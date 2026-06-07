import type { AdminVariantDetail } from "@/server/style-admin/queries/style-library-admin-query";
import type { JsonValue } from "@/server/style-admin/types";
import {
  isCandidateInspectionEligible,
} from "@/server/style-admin/inspection/candidate-inspection-eligibility";
import { renderCandidateViaDslDecoder } from "@/server/style-admin/inspection/candidate-dsl-render";
import { buildCandidatePreviewBlock } from "@/server/style-admin/inspection/candidate-preview-block";
import { runCandidateInspectionDryRun } from "@/server/style-admin/inspection/run-candidate-inspection";
import {
  readHarvestCompatibilityModeFromCompatibilityJson,
  readHarvestCompatibilityModeFromDefinition,
} from "@/lib/dsl-runtime/read-harvest-compatibility-mode";
import { buildSourceExactTrace } from "@/lib/dsl-runtime/source-exact-trace";
import { mapPoolSourceToRuntimeSource } from "@/lib/dsl-runtime/runtime-trace";
import type { SourceExactTrace } from "@/core/dsl/runtime/dsl-trace-types";
import type { DbCandidateInspectionSource } from "@/server/style-admin/inspection/candidate-inspection-types";
import type { SerializedPreviewBlock } from "@/server/generation/generate-flow-types";

export type CandidateInspectionPanelViewModel = {
  eligible: boolean;
  supported: boolean;
  unsupportedReason: string | null;
  inspectionRequiredBeforePromote: boolean;
  sampleText: string;
  previewOk: boolean;
  previewIssues: string[];
  previewBlock: SerializedPreviewBlock | null;
  copyOk: boolean;
  copyHtmlSnippet: string | null;
  copyTextPlain: string | null;
  copyIssues: string[];
  validatorStatus: string;
  validatorValid: boolean;
  validatorIssueCount: number;
  resolvedQualityStatus: string;
  hasRawHtml: boolean;
  usedAdminFallback: boolean;
  decodedPreviewHtmlLength: number;
  decodedPreviewHtmlSnippet: string | null;
  runtimeSource: string;
  decoderPath: string;
  decoderIssues: string[];
  sourceExact: SourceExactTrace;
  wechatCompatibilityMode: string | null;
};

function toInspectionSource(detail: AdminVariantDetail): DbCandidateInspectionSource {
  const primarySource = detail.sources[0] ?? null;
  const currentVersion = detail.currentVersion!;
  return {
    variantId: detail.variant.id,
    runtimeVariantId: detail.variant.runtimeVariantId,
    blockType: detail.variant.blockType,
    styleFamily: detail.variant.styleFamily,
    label: detail.variant.label,
    lifecycle: detail.variant.lifecycle,
    definitionJson: currentVersion.definitionJson as JsonValue,
    componentProtocolJson: currentVersion.componentProtocolJson as JsonValue | null,
    compatibilityJson: currentVersion.compatibilityJson as JsonValue | null,
    copySafety: currentVersion.copySafety,
    qualityStatus: currentVersion.qualityStatus,
    versionId: currentVersion.id,
    versionNumber: currentVersion.versionNumber,
    primarySourceType: primarySource?.sourceType ?? null,
    hasRawHtml: Boolean(primarySource?.rawHtml),
    rawHtml: primarySource?.rawHtml ?? null,
  };
}

export function buildCandidateInspectionPanelViewModel(
  detail: AdminVariantDetail,
): CandidateInspectionPanelViewModel | null {
  const currentVersion = detail.currentVersion;
  if (!currentVersion) {
    return null;
  }

  const primarySource = detail.sources[0] ?? null;
  const eligible = isCandidateInspectionEligible({
    lifecycle: detail.variant.lifecycle,
    sourceType: primarySource?.sourceType ?? null,
    qualityStatus: currentVersion.qualityStatus,
  });

  if (!eligible) {
    return null;
  }

  const source = toInspectionSource(detail);
  const inspection = runCandidateInspectionDryRun(source);
  const previewBlock = inspection.supported
    ? buildCandidatePreviewBlock(source, inspection.fixture)
    : null;

  const previewDecode = inspection.supported
    ? renderCandidateViaDslDecoder(source, inspection.fixture, "preview")
    : null;

  const decodedPreviewHtml = previewDecode?.ok ? previewDecode.html ?? null : null;
  const decodedCopyHtml = inspection.copy.ok ? inspection.copy.html : null;
  const previewHasVisibleText = Boolean(
    decodedPreviewHtml?.replace(/<[^>]+>/g, "").trim(),
  );

  const sourceExact = buildSourceExactTrace({
    runtimeVariantId: source.runtimeVariantId,
    definitionJson: source.definitionJson,
    decodedPreviewHtml,
    decodedCopyHtml,
    renderedHtml: decodedPreviewHtml,
    selectedRuntimeVariantId: source.runtimeVariantId,
    renderedByVariantId: source.runtimeVariantId,
    fallbackUsed: previewDecode?.substitutionTrace?.fallbackUsed ?? false,
    fallbackReason: previewDecode?.substitutionTrace?.fallbackReason ?? null,
  });

  return {
    eligible: true,
    supported: inspection.supported,
    unsupportedReason: inspection.unsupportedReason,
    inspectionRequiredBeforePromote: true,
    sampleText: inspection.fixture.sampleText,
    previewOk: inspection.preview.ok && previewHasVisibleText,
    previewIssues: inspection.preview.issues,
    previewBlock,
    copyOk: inspection.copy.ok,
    copyHtmlSnippet: inspection.copy.htmlSnippet,
    copyTextPlain: inspection.copy.textPlain,
    copyIssues: inspection.copy.issues,
    validatorStatus: inspection.validator.status,
    validatorValid: inspection.validator.valid,
    validatorIssueCount: inspection.validator.issueCount,
    resolvedQualityStatus: inspection.resolvedQualityStatus,
    hasRawHtml: source.hasRawHtml,
    usedAdminFallback: inspection.preview.usedAdminFallback || inspection.copy.usedAdminFallback,
    decodedPreviewHtmlLength: decodedPreviewHtml?.length ?? 0,
    decodedPreviewHtmlSnippet: decodedPreviewHtml
      ? decodedPreviewHtml.length > 240
        ? `${decodedPreviewHtml.slice(0, 240)}…`
        : decodedPreviewHtml
      : null,
    runtimeSource: mapPoolSourceToRuntimeSource("database", true),
    decoderPath: previewDecode?.trace?.decoderPath ?? "none",
    decoderIssues: previewDecode?.issues ?? [],
    sourceExact,
    wechatCompatibilityMode:
      readHarvestCompatibilityModeFromCompatibilityJson(currentVersion.compatibilityJson) ??
      readHarvestCompatibilityModeFromDefinition(source.definitionJson) ??
      null,
  };
}
