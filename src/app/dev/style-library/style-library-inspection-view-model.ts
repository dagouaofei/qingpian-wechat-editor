import {
  STYLE_LIBRARY_MANIFEST,
  getStyleLibraryInspectionSummary,
  getStyleLibraryInspectionSummaries,
} from "@/core/style-library";
import type {
  PromoteReadiness,
  StyleLibraryInspectionSummary,
  StyleLibraryInspectionValidatorStatus,
  StyleLibraryManifest,
} from "@/core/style-library";
import type { SerializedPreviewBlock } from "@/server/generation/generate-flow-types";

import {
  getInspectionConclusionCopy,
  getInspectionUiCopy,
  getPromoteReadinessLabel,
  getValidatorStatusLabel,
  translatePromoteBlockedReason,
  type StyleLibraryInspectionUiCopy,
  type StyleLibraryLocale,
} from "./style-library-i18n";

export type StyleLibraryInspectionSummaryCounts = {
  autoValidationPassed: number;
  needsPasteQa: number;
  readyForPromoteReview: number;
  blockedCandidates: number;
  compatibilityWarnings: number;
};

export type StyleLibraryCandidateInspectionPanel = {
  assetId: string;
  runtimeVariantId: string;
  blockType: string;
  fixtureLabel: string;
  fixtureText: string;
  previewStatus: string;
  previewOk: boolean;
  previewBlock: SerializedPreviewBlock | null;
  copyStatus: string;
  copyOk: boolean;
  copyHtmlSnippet: string | null;
  usesInlineStyle: boolean;
  hasForbiddenCapability: boolean;
  hasRiskyCapability: boolean;
  validatorStatus: StyleLibraryInspectionValidatorStatus;
  validatorStatusLabel: string;
  issueCount: number;
  blockerCount: number;
  warningCount: number;
  operatorConclusion: string;
  promoteReadiness: PromoteReadiness;
  promoteReadinessLabel: string;
  promoteBlockedReasons: string[];
  nextRequiredStory: string | null;
  validatorIssueSummaries: string[];
  rawCopyHtml: string | null;
  rawValidatorIssues: string[];
};

function toPreviewBlock(
  summary: StyleLibraryInspectionSummary,
): SerializedPreviewBlock | null {
  if (!summary.preview.ok || summary.preview.output == null) {
    return null;
  }

  return {
    blockId: summary.target.assetId,
    blockType: summary.preview.blockType,
    variantId: summary.preview.variantId,
    ok: true,
    output: summary.preview.output,
    issues: [],
    warnings: [],
  };
}

function buildInspectionPanel(
  summary: StyleLibraryInspectionSummary,
  locale: StyleLibraryLocale,
): StyleLibraryCandidateInspectionPanel {
  const ui = getInspectionUiCopy(locale);
  const readiness = summary.promoteReadiness;

  return {
    assetId: summary.target.assetId,
    runtimeVariantId: summary.target.runtimeVariantId,
    blockType: summary.target.blockType,
    fixtureLabel: summary.target.fixtureLabel,
    fixtureText: summary.target.fixtureText,
    previewStatus: summary.preview.ok ? ui.previewStatusOk : ui.previewStatusError,
    previewOk: summary.preview.ok,
    previewBlock: toPreviewBlock(summary),
    copyStatus: summary.copy.ok ? ui.copyStatusOk : ui.copyStatusError,
    copyOk: summary.copy.ok,
    copyHtmlSnippet: summary.copy.htmlSnippet,
    usesInlineStyle: summary.copy.usesInlineStyle,
    hasForbiddenCapability: summary.copy.hasForbiddenCapability,
    hasRiskyCapability: summary.copy.hasRiskyCapability,
    validatorStatus: summary.validator.status,
    validatorStatusLabel: getValidatorStatusLabel(locale, summary.validator.status),
    issueCount: summary.validator.issueCount,
    blockerCount: summary.validator.blockerCount,
    warningCount: summary.validator.warningCount,
    operatorConclusion: getInspectionConclusionCopy(locale, summary.operatorConclusionKey),
    promoteReadiness: readiness,
    promoteReadinessLabel: getPromoteReadinessLabel(locale, {
      readyForPromoteReview: readiness.readyForPromoteReview,
      validatorStatus: summary.validator.status,
    }),
    promoteBlockedReasons: readiness.blockedReasons.map((code) =>
      translatePromoteBlockedReason(locale, code),
    ),
    nextRequiredStory: readiness.nextRequiredStory,
    validatorIssueSummaries: summary.validator.issues.slice(0, 6).map((issue) => {
      const location = issue.tagName ? ` @ ${issue.tagName}` : "";
      return `${issue.severity.toUpperCase()} · ${issue.code}${location}: ${issue.message}`;
    }),
    rawCopyHtml: summary.copy.html,
    rawValidatorIssues: summary.validator.issues.map(
      (issue) => `${issue.severity} · ${issue.code}: ${issue.message}`,
    ),
  };
}

export function buildStyleLibraryInspectionSummaryCounts(
  summaries: StyleLibraryInspectionSummary[],
): StyleLibraryInspectionSummaryCounts {
  return summaries.reduce<StyleLibraryInspectionSummaryCounts>(
    (acc, summary) => {
      if (summary.validator.status === "PASS" || summary.validator.status === "WARNING") {
        acc.autoValidationPassed += 1;
      }
      if (!summary.promoteReadiness.hasPasteQaEvidence) {
        acc.needsPasteQa += 1;
      }
      if (summary.promoteReadiness.readyForPromoteReview) {
        acc.readyForPromoteReview += 1;
      }
      if (
        summary.promoteReadiness.hasBlockingIssues ||
        summary.validator.status === "FAIL"
      ) {
        acc.blockedCandidates += 1;
      }
      if (
        summary.validator.status === "WARNING" &&
        !summary.promoteReadiness.hasBlockingIssues
      ) {
        acc.compatibilityWarnings += 1;
      }
      return acc;
    },
    {
      autoValidationPassed: 0,
      needsPasteQa: 0,
      readyForPromoteReview: 0,
      blockedCandidates: 0,
      compatibilityWarnings: 0,
    },
  );
}

export function buildStyleLibraryInspectionPanels(
  manifest: StyleLibraryManifest = STYLE_LIBRARY_MANIFEST,
  locale: StyleLibraryLocale = "zh",
): StyleLibraryCandidateInspectionPanel[] {
  return getStyleLibraryInspectionSummaries(manifest).map((summary) =>
    buildInspectionPanel(summary, locale),
  );
}

export function buildStyleLibraryInspectionPanelForAsset(
  assetId: string,
  manifest: StyleLibraryManifest = STYLE_LIBRARY_MANIFEST,
  locale: StyleLibraryLocale = "zh",
): StyleLibraryCandidateInspectionPanel | null {
  const asset = manifest.assets.find((row) => row.assetId === assetId);
  if (asset?.assetType !== "variant") {
    return null;
  }
  return buildInspectionPanel(getStyleLibraryInspectionSummary(asset, manifest), locale);
}

export type { StyleLibraryInspectionUiCopy };
