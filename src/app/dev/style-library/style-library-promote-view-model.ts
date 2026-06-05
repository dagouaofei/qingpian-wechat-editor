import {
  STYLE_LIBRARY_MANIFEST,
  checkPromoteEligibility,
  createPromoteProposal,
  getStyleLibraryInspectionSummary,
  getStyleLibraryInspectionSummaries,
} from "@/core/style-library";
import type {
  PromoteEligibilityStatus,
  PromoteProposal,
  StyleLibraryInspectionSummary,
  StyleLibraryManifest,
} from "@/core/style-library";

import {
  getPromoteBadgeLabel,
  getPromoteEligibilityStatusLabel,
  getPromoteImpactCopy,
  translatePromoteBlockReasonCode,
  translatePromoteWarningCode,
  type StyleLibraryLocale,
} from "./style-library-i18n";

export type StyleLibraryPromoteSummaryCounts = {
  readyForPromoteReview: number;
  compatibilityWarnings: number;
  blockedCandidates: number;
  proposalsAvailable: number;
};

export type StyleLibraryCandidatePromotePanel = {
  assetId: string;
  runtimeVariantId: string;
  eligibilityStatus: PromoteEligibilityStatus;
  eligibilityStatusLabel: string;
  badgeLabel: string;
  eligible: boolean;
  blockedReasons: string[];
  warningReasons: string[];
  evidenceChecklist: Array<{ evidenceId: string; present: boolean; label: string }>;
  validatorStatus: string;
  pasteQaStatus: string;
  distributionImpactSummary: string;
  runtimeImpactSummary: string;
  defaultPresetImpactSummary: string;
  nextDecisionRequired: string;
  promoteTarget: string;
  proposal: PromoteProposal;
  proposalPreviewOpen: boolean;
};

function buildPromotePanel(
  summary: StyleLibraryInspectionSummary,
  manifest: StyleLibraryManifest,
  locale: StyleLibraryLocale,
): StyleLibraryCandidatePromotePanel {
  const asset = manifest.assets.find(
    (row) => row.assetId === summary.target.assetId,
  );
  if (asset?.assetType !== "variant") {
    throw new Error(`Missing variant asset for promote panel ${summary.target.assetId}`);
  }

  const eligibility = checkPromoteEligibility(asset, manifest, summary);
  const proposal = createPromoteProposal(asset, manifest, summary);
  const impactCopy = getPromoteImpactCopy(locale);

  return {
    assetId: asset.assetId,
    runtimeVariantId: asset.runtimeVariantId,
    eligibilityStatus: eligibility.status,
    eligibilityStatusLabel: getPromoteEligibilityStatusLabel(locale, eligibility.status),
    badgeLabel: getPromoteBadgeLabel(locale, eligibility.status),
    eligible: eligibility.eligible,
    blockedReasons: eligibility.blockedReasonCodes.map((code) =>
      translatePromoteBlockReasonCode(locale, code),
    ),
    warningReasons: eligibility.warningCodes.map((code) =>
      translatePromoteWarningCode(locale, code),
    ),
    evidenceChecklist: eligibility.evidenceChecklist.map((row) => ({
      ...row,
      label: row.present ? "✓" : "✗",
    })),
    validatorStatus: summary.validator.status,
    pasteQaStatus: proposal.pasteQaStatus,
    distributionImpactSummary: impactCopy.distributionImpact,
    runtimeImpactSummary: impactCopy.runtimeImpact,
    defaultPresetImpactSummary: impactCopy.defaultPresetImpact,
    nextDecisionRequired: impactCopy.nextDecisionRequired,
    promoteTarget: impactCopy.promoteTarget,
    proposal,
    proposalPreviewOpen: eligibility.eligible,
  };
}

export function buildStyleLibraryPromoteSummaryCounts(
  manifest: StyleLibraryManifest = STYLE_LIBRARY_MANIFEST,
): StyleLibraryPromoteSummaryCounts {
  const summaries = getStyleLibraryInspectionSummaries(manifest);
  return summaries.reduce<StyleLibraryPromoteSummaryCounts>(
    (acc, summary) => {
      const asset = manifest.assets.find((row) => row.assetId === summary.target.assetId);
      if (asset?.assetType !== "variant") {
        return acc;
      }
      const eligibility = checkPromoteEligibility(asset, manifest, summary);
      if (eligibility.status === "ready" || eligibility.status === "ready_with_warnings") {
        acc.readyForPromoteReview += 1;
        acc.proposalsAvailable += 1;
      }
      if (eligibility.status === "ready_with_warnings") {
        acc.compatibilityWarnings += 1;
      }
      if (eligibility.status === "blocked") {
        acc.blockedCandidates += 1;
      }
      return acc;
    },
    {
      readyForPromoteReview: 0,
      compatibilityWarnings: 0,
      blockedCandidates: 0,
      proposalsAvailable: 0,
    },
  );
}

export function buildStyleLibraryPromotePanels(
  manifest: StyleLibraryManifest = STYLE_LIBRARY_MANIFEST,
  locale: StyleLibraryLocale = "zh",
): StyleLibraryCandidatePromotePanel[] {
  return getStyleLibraryInspectionSummaries(manifest).map((summary) =>
    buildPromotePanel(summary, manifest, locale),
  );
}

export function buildStyleLibraryPromotePanelForAsset(
  assetId: string,
  manifest: StyleLibraryManifest = STYLE_LIBRARY_MANIFEST,
  locale: StyleLibraryLocale = "zh",
): StyleLibraryCandidatePromotePanel | null {
  const asset = manifest.assets.find((row) => row.assetId === assetId);
  if (asset?.assetType !== "variant") {
    return null;
  }
  const summary = getStyleLibraryInspectionSummary(asset, manifest);
  return buildPromotePanel(summary, manifest, locale);
}
