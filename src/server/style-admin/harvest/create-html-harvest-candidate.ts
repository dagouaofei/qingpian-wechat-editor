import type { StyleVariant } from "@prisma/client";

import type { StyleAdminPrismaClient } from "../prisma";
import { buildCandidateVariantDraft } from "./build-candidate-variant";
import type {
  CreateHtmlHarvestCandidateInput,
  CreateHtmlHarvestCandidateResult,
  HtmlHarvestCandidateDraft,
  PreviewHtmlHarvestInput,
  PreviewHtmlHarvestResult,
} from "./html-harvest-types";
import {
  HTML_HARVEST_MAX_RAW_HTML_LENGTH,
  HTML_HARVEST_PARSER_VERSION,
  HTML_HARVEST_SOURCE_COHORT,
  isHarvestBlockType,
  toPrismaBlockType,
} from "./html-harvest-types";
import { getHarvestWechatCompatibilityMode } from "./harvest-compatibility-mode";
import { buildHarvestPreviewTrace } from "./harvest-trace";
import { sanitizeHarvestHtml } from "./sanitize-harvest-html";

const HARVEST_COMPATIBILITY_GUIDANCE =
  "This HTML can be encoded as a candidate, but it has WeChat compatibility risks. Run Preview / Copy / Validator and Paste QA before promote.";

function buildSourceRef(runtimeVariantId: string): string {
  return `html_paste:${runtimeVariantId}`;
}

async function findExistingVariant(
  db: StyleAdminPrismaClient,
  runtimeVariantId: string,
): Promise<StyleVariant | null> {
  return db.styleVariant.findUnique({ where: { runtimeVariantId } });
}

async function persistHarvestCandidate(
  db: StyleAdminPrismaClient,
  draft: HtmlHarvestCandidateDraft,
  input: CreateHtmlHarvestCandidateInput,
): Promise<void> {
  const reason = input.notes?.trim() || "S10-STORY-009 HTML harvest candidate";
  const sourceRef = buildSourceRef(draft.runtimeVariantId);
  const compatibilityJson = draft.compatibilityJson as Record<string, unknown> | undefined;

  await db.$transaction(async (tx) => {
    const variant = await tx.styleVariant.create({
      data: {
        runtimeVariantId: draft.runtimeVariantId,
        blockType: toPrismaBlockType(draft.blockType),
        styleFamily: draft.styleFamily,
        label: draft.label,
        description: draft.description,
        lifecycle: "candidate",
      },
    });

    const version = await tx.styleVariantVersion.create({
      data: {
        variantId: variant.id,
        versionNumber: 1,
        definitionJson: draft.definitionJson,
        componentProtocolJson: draft.componentProtocolJson,
        compatibilityJson: draft.compatibilityJson,
        copySafety: draft.copySafety,
        qualityStatus: "not_checked",
        sourceChecksum: draft.sourceChecksum,
        createdBy: input.actor,
      },
    });

    await tx.styleVariant.update({
      where: { id: variant.id },
      data: { currentVersionId: version.id },
    });

    await tx.styleVariantDistribution.create({
      data: {
        variantId: variant.id,
        userSelectable: false,
        defaultEligible: false,
        release1Required: false,
        hidden: false,
        deprecated: false,
        cacheVersion: 0,
        updatedBy: input.actor,
      },
    });

    await tx.styleVariantSource.create({
      data: {
        variantId: variant.id,
        sourceType: "html_paste",
        sourceCohort: HTML_HARVEST_SOURCE_COHORT,
        sourceRef,
        rawHtml: sanitizeHarvestHtml(input.rawHtml),
        sourceMetadata: {
          sourceLabel: input.sourceLabel,
          sourceUrl: input.sourceUrl ?? null,
          sourcePlatform: input.sourcePlatform ?? "unknown",
          detectedBlockType: draft.detectedBlockType,
          selectedBlockType: draft.selectedBlockType,
          parserVersion: HTML_HARVEST_PARSER_VERSION,
          rawHtmlLength: draft.rawHtmlLength,
          notes: input.notes ?? null,
          harvestCompatibility: compatibilityJson?.harvestCompatibility ?? null,
        },
      },
    });

    await tx.styleVariantLifecycleEvent.create({
      data: {
        variantId: variant.id,
        fromLifecycle: null,
        toLifecycle: "candidate",
        reason: "Created HTML harvest candidate",
        actor: input.actor,
      },
    });

    await tx.adminAuditLog.create({
      data: {
        action: "create_html_harvest_candidate",
        entityType: "style_variant",
        entityId: variant.id,
        afterJson: {
          runtimeVariantId: draft.runtimeVariantId,
          blockType: draft.blockType,
          lifecycle: "candidate",
          sourceType: "html_paste",
          sourceCohort: HTML_HARVEST_SOURCE_COHORT,
          qualityStatus: "not_checked",
          distribution: {
            userSelectable: false,
            defaultEligible: false,
            release1Required: false,
            hidden: false,
            deprecated: false,
          },
        },
        reason,
        actor: input.actor,
      },
    });
  });
}

function validateRawHtml(rawHtml: string): string | null {
  const trimmed = rawHtml.trim();
  if (!trimmed) {
    return "rawHtml is required";
  }
  if (trimmed.length > HTML_HARVEST_MAX_RAW_HTML_LENGTH) {
    return `rawHtml exceeds maximum length (${HTML_HARVEST_MAX_RAW_HTML_LENGTH})`;
  }
  return null;
}

export function previewHtmlHarvestCandidate(
  input: PreviewHtmlHarvestInput,
): PreviewHtmlHarvestResult {
  const rawHtmlError = validateRawHtml(input.rawHtml);
  if (rawHtmlError) {
    return { ok: false, code: "invalid_raw_html", message: rawHtmlError, blocking: true };
  }

  const manualBlockType =
    input.blockType && isHarvestBlockType(input.blockType) ? input.blockType : undefined;

  const built = buildCandidateVariantDraft(
    input.rawHtml,
    { sourceLabel: "Preview" },
    manualBlockType,
  );

  const { draft, detectedBlockType, issues, warnings, lossReport, canCreateCandidate, partial } =
    built;
  const activeCompatibilityMode = getHarvestWechatCompatibilityMode();

  if (!draft) {
    if (detectedBlockType === "unknown" && !manualBlockType) {
      return {
        ok: true,
        detectedBlockType,
        effectiveBlockType: null,
        draftPreview: null,
        issues,
        warnings,
        lossReport,
        canCreateCandidate: false,
        partial: false,
        severity: null,
        blocking: false,
        wechatCompatibilityMode: activeCompatibilityMode,
      };
    }

    const blockingMessage =
      built.extract && !built.extract.ok
        ? built.extract.message
        : `Detected blockType is ${detectedBlockType}. Select heading or info_card to continue.`;

    return {
      ok: false,
      code: built.extract && !built.extract.ok ? built.extract.code : "block_type_required",
      message: blockingMessage,
      detectedBlockType,
      issues,
      lossReport,
      blocking: true,
    };
  }

  const severity = built.extract?.ok ? built.extract.severity : null;
  const wechatCompatibilityMode =
    built.extract?.ok ? built.extract.wechatCompatibilityMode : activeCompatibilityMode;
  const hasCompatibilityRisks =
    wechatCompatibilityMode !== "off" &&
    issues.some((issue) => issue.severity === "risk" || issue.severity === "warning");

  const trace = buildHarvestPreviewTrace(
    draft.definitionJson,
    draft.runtimeVariantId,
    draft.blockType,
    issues,
    lossReport,
    wechatCompatibilityMode,
  );

  return {
    ok: true,
    detectedBlockType,
    effectiveBlockType: draft.blockType,
    draftPreview: {
      runtimeVariantId: draft.runtimeVariantId,
      label: draft.label,
      blockType: draft.blockType,
      styleFamily: draft.styleFamily,
      sampleText: draft.sampleText,
      detectedBlockType: draft.detectedBlockType,
      selectedBlockType: draft.selectedBlockType,
    },
    issues,
    warnings,
    lossReport,
    canCreateCandidate,
    partial,
    severity,
    blocking: false,
    guidance: hasCompatibilityRisks ? HARVEST_COMPATIBILITY_GUIDANCE : undefined,
    trace: trace ?? undefined,
    wechatCompatibilityMode,
  };
}

export async function createHtmlHarvestCandidate(
  db: StyleAdminPrismaClient,
  input: CreateHtmlHarvestCandidateInput,
): Promise<CreateHtmlHarvestCandidateResult> {
  const sourceLabel = input.sourceLabel.trim();
  if (!sourceLabel) {
    return { ok: false, code: "source_label_required", message: "sourceLabel is required" };
  }

  const rawHtmlError = validateRawHtml(input.rawHtml);
  if (rawHtmlError) {
    return { ok: false, code: "invalid_raw_html", message: rawHtmlError, blocking: true };
  }

  const manualBlockType =
    input.blockType && isHarvestBlockType(input.blockType) ? input.blockType : undefined;

  const built = buildCandidateVariantDraft(
    input.rawHtml,
    {
      sourceLabel,
      sourceUrl: input.sourceUrl,
      sourcePlatform: input.sourcePlatform,
      notes: input.notes,
    },
    manualBlockType,
  );

  const { draft, detectedBlockType, issues, lossReport, canCreateCandidate } = built;

  if (!draft) {
    if (built.extract && !built.extract.ok) {
      return {
        ok: false,
        code: built.extract.code,
        message: built.extract.message,
        issues,
        lossReport,
        blocking: true,
      };
    }

    return {
      ok: false,
      code: "block_type_required",
      message: `Detected blockType is ${detectedBlockType}. Select heading or info_card to continue.`,
      issues,
      lossReport,
      blocking: !canCreateCandidate,
    };
  }

  if (!canCreateCandidate) {
    const blockingIssue = issues.find((issue) => issue.severity === "blocking");
    return {
      ok: false,
      code: "harvest_blocked",
      message: blockingIssue?.message ?? "Cannot create harvest candidate due to blocking issues",
      issues,
      lossReport,
      blocking: true,
    };
  }

  const existing = await findExistingVariant(db, draft.runtimeVariantId);
  if (existing) {
    return {
      ok: true,
      action: "reused",
      runtimeVariantId: draft.runtimeVariantId,
      draft,
      issues,
      lossReport,
    };
  }

  await persistHarvestCandidate(db, draft, input);

  return {
    ok: true,
    action: "created",
    runtimeVariantId: draft.runtimeVariantId,
    draft,
    issues,
    lossReport,
  };
}
