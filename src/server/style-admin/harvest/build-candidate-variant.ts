import { detectHtmlBlockType } from "./detect-html-block-type";
import { extractHeadingCandidate } from "./extract-heading-candidate";
import { extractInfoCardCandidate } from "./extract-info-card-candidate";
import type { HarvestExtractResult } from "./extract-harvest-candidate-shared";
import type {
  HarvestIssue,
  HarvestLossReportEntry,
} from "./harvest-compatibility";
import type {
  HtmlHarvestCandidateDraft,
  HtmlHarvestDetectableBlockType,
  HtmlHarvestDetectedBlockType,
  HtmlHarvestSourceInput,
} from "./html-harvest-types";
import { buildSanitizeLossReport, sanitizeHarvestHtml } from "./sanitize-harvest-html";

export type BuildCandidateVariantDraftResult = {
  draft: HtmlHarvestCandidateDraft | null;
  detectedBlockType: HtmlHarvestDetectedBlockType;
  extract: HarvestExtractResult | null;
  issues: HarvestIssue[];
  warnings: HarvestIssue[];
  lossReport: HarvestLossReportEntry[];
  sanitizeLossReport: HarvestLossReportEntry[];
  encoderLossReport: HarvestLossReportEntry[];
  compatibilityTransformLossReport: HarvestLossReportEntry[];
  canCreateCandidate: boolean;
  partial: boolean;
};

export function resolveSelectedBlockType(
  detectedBlockType: HtmlHarvestDetectedBlockType,
  manualBlockType?: HtmlHarvestDetectableBlockType,
): HtmlHarvestDetectableBlockType | null {
  if (manualBlockType) {
    return manualBlockType;
  }
  if (detectedBlockType === "heading" || detectedBlockType === "info_card") {
    return detectedBlockType;
  }
  return null;
}

export function buildCandidateVariantDraft(
  rawHtml: string,
  source: HtmlHarvestSourceInput,
  manualBlockType?: HtmlHarvestDetectableBlockType,
): BuildCandidateVariantDraftResult {
  const sanitizedHtml = sanitizeHarvestHtml(rawHtml);
  const sanitizeLossReport = buildSanitizeLossReport(rawHtml);
  const detectedBlockType = detectHtmlBlockType(sanitizedHtml);
  const selectedBlockType = resolveSelectedBlockType(detectedBlockType, manualBlockType);

  if (!selectedBlockType) {
    return {
      draft: null,
      detectedBlockType,
      extract: null,
      issues: [],
      warnings: [],
      lossReport: [],
      sanitizeLossReport: sanitizeLossReport,
      encoderLossReport: [],
      compatibilityTransformLossReport: [],
      canCreateCandidate: false,
      partial: false,
    };
  }

  const extract =
    selectedBlockType === "heading"
      ? extractHeadingCandidate(sanitizedHtml, source, selectedBlockType)
      : extractInfoCardCandidate(sanitizedHtml, source, selectedBlockType);

  const encoderLossReport = extract.encoderLossReport;
  const compatibilityTransformLossReport = extract.compatibilityTransformLossReport;
  const mergedLossReport = [
    ...sanitizeLossReport,
    ...encoderLossReport,
    ...compatibilityTransformLossReport,
  ];

  if (!extract.ok) {
    return {
      draft: null,
      detectedBlockType,
      extract,
      issues: extract.issues,
      warnings: [],
      lossReport: mergedLossReport,
      sanitizeLossReport,
      encoderLossReport,
      compatibilityTransformLossReport,
      canCreateCandidate: false,
      partial: false,
    };
  }

  return {
    detectedBlockType,
    extract,
    issues: extract.issues,
    warnings: extract.warnings,
    lossReport: mergedLossReport,
    sanitizeLossReport,
    encoderLossReport,
    compatibilityTransformLossReport,
    canCreateCandidate: extract.canCreateCandidate,
    partial: extract.partial,
    draft: {
      runtimeVariantId: extract.runtimeVariantId,
      blockType: extract.blockType,
      styleFamily: extract.styleFamily,
      label: extract.label,
      description: extract.description,
      sampleText: extract.sampleText,
      definitionJson: extract.definitionJson,
      componentProtocolJson: extract.componentProtocolJson,
      compatibilityJson: extract.compatibilityJson,
      copySafety: extract.copySafety,
      sourceChecksum: extract.sourceChecksum,
      detectedBlockType,
      selectedBlockType,
      sanitizedHtml,
      rawHtmlLength: rawHtml.length,
    },
  };
}
