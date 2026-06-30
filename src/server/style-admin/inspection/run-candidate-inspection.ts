import type { StyleVariantQualityStatus, StyleVariantValidationStatus } from "@prisma/client";

import { invalidateUserSelectableVariantPoolCache } from "../runtime/user-selectable-variant-pool-cache";
import type { StyleAdminPrismaClient } from "../prisma";
import type { JsonValue } from "../types";
import { StyleVariantAuditRepository } from "../repositories/style-variant-audit-repository";
import { StyleVariantValidationRepository } from "../repositories/style-variant-validation-repository";
import { inspectCandidateCopy } from "./candidate-copy-inspector";
import {
  isCandidateInspectionEligible,
  isSupportedInspectionBlockType,
} from "./candidate-inspection-eligibility";
import { buildCandidateInspectionFixture } from "./candidate-inspection-fixtures";
import { inspectCandidatePreview } from "./candidate-preview-inspector";
import type {
  CandidateInspectionResult,
  DbCandidateInspectionSource,
  RunCandidateInspectionResult,
} from "./candidate-inspection-types";
import { ADMIN_INSPECTION_CONTEXT } from "./candidate-inspection-types";
import { inspectCandidateValidator } from "./candidate-validator";
import { mapDbCandidateToVariantDefinition } from "./db-candidate-variant-mapper";
import { pickInspectionHtmlSource } from "./pick-inspection-html-source";
import { resolveQualityStatusFromInspection } from "./resolve-quality-status";

function mapValidatorRunStatus(
  status: "pass" | "warning" | "fail",
): StyleVariantValidationStatus {
  if (status === "pass") return "pass";
  if (status === "warning") return "warning";
  return "fail";
}

export function runCandidateInspectionDryRun(
  source: DbCandidateInspectionSource,
): CandidateInspectionResult {
  const fixture = buildCandidateInspectionFixture(source.blockType, source.runtimeVariantId);
  if (!fixture || !isSupportedInspectionBlockType(source.blockType)) {
    return {
      context: ADMIN_INSPECTION_CONTEXT,
      runtimeVariantId: source.runtimeVariantId,
      blockType: source.blockType,
      variantDefinition: mapDbCandidateToVariantDefinition(source),
      supported: false,
      unsupportedReason: `Inspection for blockType ${source.blockType} is not supported in S10-STORY-010.`,
      fixture: {
        fixtureId: "unsupported",
        fixtureLabel: "Unsupported",
        sampleText: "",
        blockContent: {},
      },
      preview: {
        ok: false,
        status: "unsupported",
        blockType: source.blockType,
        variantId: source.runtimeVariantId,
        fixtureText: "",
        outputKind: null,
        issues: ["unsupported blockType"],
        usedAdminFallback: false,
      },
      copy: {
        ok: false,
        status: "unsupported",
        blockType: source.blockType,
        variantId: source.runtimeVariantId,
        html: null,
        htmlSnippet: null,
        textPlain: null,
        copySafety: source.copySafety,
        usesInlineStyle: false,
        issues: ["unsupported blockType"],
        usedAdminFallback: false,
      },
      validator: {
        status: "fail",
        valid: false,
        issueCount: 1,
        blockerCount: 1,
        warningCount: 0,
        structuralIssues: ["unsupported blockType"],
        issues: [{ level: "error", message: "unsupported blockType" }],
      },
      resolvedQualityStatus: "validator_failed",
    };
  }

  const preview = inspectCandidatePreview(source, fixture);
  const copy = inspectCandidateCopy(source, fixture);
  const validator = inspectCandidateValidator(source, preview, copy);

  return {
    context: ADMIN_INSPECTION_CONTEXT,
    runtimeVariantId: source.runtimeVariantId,
    blockType: source.blockType,
    variantDefinition: mapDbCandidateToVariantDefinition(source),
    supported: true,
    unsupportedReason: null,
    fixture,
    preview,
    copy,
    validator,
    resolvedQualityStatus: resolveQualityStatusFromInspection({ preview, copy, validator }),
  };
}

export async function runCandidateInspectionAndPersist(
  db: StyleAdminPrismaClient,
  runtimeVariantId: string,
  actor: string,
): Promise<RunCandidateInspectionResult> {
  const variant = await db.styleVariant.findUnique({
    where: { runtimeVariantId },
    include: {
      currentVersion: true,
      distribution: true,
      sources: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  if (!variant?.currentVersion) {
    return { ok: false, code: "not_found", message: "Variant or current version not found" };
  }

  const htmlSource = pickInspectionHtmlSource(variant.sources);
  const source: DbCandidateInspectionSource = {
    variantId: variant.id,
    runtimeVariantId: variant.runtimeVariantId,
    blockType: variant.blockType,
    styleFamily: variant.styleFamily,
    label: variant.label,
    lifecycle: variant.lifecycle,
    definitionJson: variant.currentVersion.definitionJson as JsonValue,
    componentProtocolJson: variant.currentVersion.componentProtocolJson as JsonValue | null,
    compatibilityJson: variant.currentVersion.compatibilityJson as JsonValue | null,
    copySafety: variant.currentVersion.copySafety,
    qualityStatus: variant.currentVersion.qualityStatus,
    versionId: variant.currentVersion.id,
    versionNumber: variant.currentVersion.versionNumber,
    primarySourceType: htmlSource?.sourceType ?? null,
    hasRawHtml: Boolean(htmlSource?.rawHtml?.trim()),
    rawHtml: htmlSource?.rawHtml ?? null,
  };

  if (
    !isCandidateInspectionEligible({
      lifecycle: variant.lifecycle,
      sourceType: source.primarySourceType,
      qualityStatus: source.qualityStatus,
    })
  ) {
    return {
      ok: false,
      code: "not_eligible",
      message: "Variant is not eligible for candidate inspection",
    };
  }

  const inspection = runCandidateInspectionDryRun(source);
  const previousQualityStatus = source.qualityStatus;
  const nextQualityStatus = inspection.resolvedQualityStatus;

  const validationRepo = new StyleVariantValidationRepository(db);
  const validationRunIds: string[] = [];

  const previewRun = await validationRepo.createValidationRun({
    variantId: variant.id,
    versionId: source.versionId,
    runType: "preview",
    status: inspection.preview.ok ? "pass" : "fail",
    issuesJson: inspection.preview.issues,
    summaryJson: {
      actor,
      context: ADMIN_INSPECTION_CONTEXT,
      fixtureText: inspection.fixture.sampleText,
      outputKind: inspection.preview.outputKind,
      usedAdminFallback: inspection.preview.usedAdminFallback,
    },
  });
  validationRunIds.push(previewRun.id);

  const copyRun = await validationRepo.createValidationRun({
    variantId: variant.id,
    versionId: source.versionId,
    runType: "copy_html",
    status: inspection.copy.ok ? "pass" : "fail",
    issuesJson: inspection.copy.issues,
    summaryJson: {
      actor,
      context: ADMIN_INSPECTION_CONTEXT,
      htmlSnippet: inspection.copy.htmlSnippet,
      textPlain: inspection.copy.textPlain,
      copySafety: inspection.copy.copySafety,
      usedAdminFallback: inspection.copy.usedAdminFallback,
    },
  });
  validationRunIds.push(copyRun.id);

  const validatorRun = await validationRepo.createValidationRun({
    variantId: variant.id,
    versionId: source.versionId,
    runType: "wechat_validator",
    status: mapValidatorRunStatus(inspection.validator.status),
    issuesJson: inspection.validator.issues,
    summaryJson: {
      actor,
      context: ADMIN_INSPECTION_CONTEXT,
      valid: inspection.validator.valid,
      blockerCount: inspection.validator.blockerCount,
      warningCount: inspection.validator.warningCount,
      structuralIssues: inspection.validator.structuralIssues,
    },
  });
  validationRunIds.push(validatorRun.id);

  await db.styleVariantVersion.update({
    where: { id: source.versionId },
    data: { qualityStatus: nextQualityStatus },
  });

  const auditRepo = new StyleVariantAuditRepository(db);
  await auditRepo.recordAdminAuditLog({
    action: "run_candidate_inspection",
    entityType: "style_variant",
    entityId: variant.id,
    beforeJson: { qualityStatus: previousQualityStatus },
    afterJson: {
      qualityStatus: nextQualityStatus,
      validationRunIds,
      previewOk: inspection.preview.ok,
      copyOk: inspection.copy.ok,
      validatorStatus: inspection.validator.status,
    },
    reason: "S10-STORY-010 candidate inspection",
    actor,
  });

  invalidateUserSelectableVariantPoolCache(variant.blockType);
  invalidateUserSelectableVariantPoolCache();

  return {
    ok: true,
    inspection,
    validationRunIds,
    qualityStatus: nextQualityStatus,
    previousQualityStatus,
  };
}
