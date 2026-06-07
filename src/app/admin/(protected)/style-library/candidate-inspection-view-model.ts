import type { AdminVariantDetail } from "@/server/style-admin/queries/style-library-admin-query";
import type { JsonValue } from "@/server/style-admin/types";
import {
  isCandidateInspectionEligible,
} from "@/server/style-admin/inspection/candidate-inspection-eligibility";
import { buildCandidatePreviewBlock } from "@/server/style-admin/inspection/candidate-preview-block";
import { runCandidateInspectionDryRun } from "@/server/style-admin/inspection/run-candidate-inspection";
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

  return {
    eligible: true,
    supported: inspection.supported,
    unsupportedReason: inspection.unsupportedReason,
    inspectionRequiredBeforePromote: true,
    sampleText: inspection.fixture.sampleText,
    previewOk: inspection.preview.ok,
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
  };
}
