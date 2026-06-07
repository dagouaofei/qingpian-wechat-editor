import type { StyleVariantQualityStatus } from "@prisma/client";

import type { StyleAdminPrismaClient } from "../prisma";
import { StyleVariantAuditRepository } from "../repositories/style-variant-audit-repository";
import { StyleVariantValidationRepository } from "../repositories/style-variant-validation-repository";
import { isCandidateInspectionEligible } from "./candidate-inspection-eligibility";
import type {
  ManualPasteQaEvidenceInput,
  ManualPasteQaEvidenceResult,
  PasteQaEvidenceMetadata,
} from "./candidate-inspection-types";
import { ADMIN_INSPECTION_CONTEXT, PASTE_QA_EVIDENCE_TYPE } from "./candidate-inspection-types";
import { resolveQualityStatusFromPasteQa } from "./resolve-quality-status";

export async function createManualPasteQaEvidence(
  db: StyleAdminPrismaClient,
  input: ManualPasteQaEvidenceInput,
): Promise<ManualPasteQaEvidenceResult> {
  const variant = await db.styleVariant.findUnique({
    where: { runtimeVariantId: input.runtimeVariantId },
    include: {
      currentVersion: true,
      sources: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  if (!variant?.currentVersion) {
    return { ok: false, code: "not_found", message: "Variant or current version not found" };
  }

  const primarySource = variant.sources[0] ?? null;
  if (
    !isCandidateInspectionEligible({
      lifecycle: variant.lifecycle,
      sourceType: primarySource?.sourceType ?? null,
      qualityStatus: variant.currentVersion.qualityStatus,
    })
  ) {
    return {
      ok: false,
      code: "not_eligible",
      message: "Variant is not eligible for paste QA evidence",
    };
  }

  const validationRepo = new StyleVariantValidationRepository(db);
  const validationRun = await validationRepo.createValidationRun({
    variantId: variant.id,
    versionId: variant.currentVersion.id,
    runType: "paste_qa",
    status:
      input.status === "pass" ? "pass" : input.status === "failed" ? "fail" : "pending",
    summaryJson: {
      actor: input.actor,
      context: ADMIN_INSPECTION_CONTEXT,
      pasteQaStatus: input.status,
      notes: input.notes ?? null,
    },
  });

  const metadata: PasteQaEvidenceMetadata = {
    notes: input.notes,
    pasteQaStatus: input.status,
    actor: input.actor,
    createdFrom: "s10_story_010",
    validationRunIds: [validationRun.id],
  };

  const evidence = await validationRepo.createEvidence({
    variantId: variant.id,
    versionId: variant.currentVersion.id,
    evidenceType: PASTE_QA_EVIDENCE_TYPE,
    sourceUrl: input.sourceUrl,
    sourceLabel: input.sourceLabel,
    ossKey: undefined,
    metadataJson: metadata,
  });

  const previousQualityStatus = variant.currentVersion.qualityStatus;
  const nextQualityStatus: StyleVariantQualityStatus = resolveQualityStatusFromPasteQa(
    input.status,
    previousQualityStatus,
  );

  if (nextQualityStatus !== previousQualityStatus) {
    await db.styleVariantVersion.update({
      where: { id: variant.currentVersion.id },
      data: { qualityStatus: nextQualityStatus },
    });
  }

  const auditRepo = new StyleVariantAuditRepository(db);
  await auditRepo.recordAdminAuditLog({
    action: "create_manual_paste_qa_evidence",
    entityType: "style_variant_evidence",
    entityId: evidence.id,
    beforeJson: { qualityStatus: previousQualityStatus },
    afterJson: {
      qualityStatus: nextQualityStatus,
      evidenceId: evidence.id,
      pasteQaStatus: input.status,
    },
    reason: input.notes ?? "S10-STORY-010 manual paste QA evidence",
    actor: input.actor,
  });

  return {
    ok: true,
    evidenceId: evidence.id,
    qualityStatus: nextQualityStatus,
  };
}
