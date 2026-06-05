import {
  STYLE_LIBRARY_MANIFEST,
  createLifecycleChangeProposal,
  getAllowedLifecycleTransitions,
  getBlockedLifecycleTransitions,
  getStyleLibraryAssetById,
} from "@/core/style-library";
import type {
  LifecycleChangeProposal,
  StyleLibraryLifecycleState,
  StyleLibraryManifest,
} from "@/core/style-library";

import {
  getLifecycleColumnMeta,
  getLifecycleStatusCopy,
  translateLifecycleBlockReasonCode,
  type StyleLibraryLocale,
} from "./style-library-i18n";

export type StyleLibraryLifecycleTransitionRow = {
  targetState: StyleLibraryLifecycleState;
  targetLabel: string;
  rawKey: string;
  allowed: boolean;
  blockedReasons: string[];
  requiredStory: string | null;
  requiredEvidenceIds: string[];
  proposal: LifecycleChangeProposal;
};

export type StyleLibraryLifecycleColumnMeta = {
  lifecycle: StyleLibraryLifecycleState;
  label: string;
  rawKey: string;
  businessMeaning: string;
  nextAction: string;
  assetCount: number;
};

export type StyleLibraryCandidateLifecyclePanel = {
  assetId: string;
  runtimeVariantId: string | null;
  currentLifecycle: StyleLibraryLifecycleState;
  currentLifecycleLabel: string;
  currentStateDescription: string;
  statusExplanation: string;
  nextStepSuggestion: string;
  blockedReason: string | null;
  requiredEvidenceIds: string[];
  linkedFutureStory: string | null;
  runtimeImpactSummary: string;
  allowedTransitions: StyleLibraryLifecycleTransitionRow[];
  blockedTransitions: StyleLibraryLifecycleTransitionRow[];
  promoteProposalPreview: LifecycleChangeProposal | null;
};

function toTransitionRow(
  asset: StyleLibraryManifest["assets"][number],
  manifest: StyleLibraryManifest,
  locale: StyleLibraryLocale,
  targetState: StyleLibraryLifecycleState,
  options?: { deprecationReason?: string },
): StyleLibraryLifecycleTransitionRow {
  const proposal = createLifecycleChangeProposal(
    asset,
    targetState,
    manifest,
    options,
  );

  return {
    targetState,
    targetLabel: getLifecycleColumnMeta(locale, targetState).label,
    rawKey: targetState,
    allowed: proposal.allowed,
    blockedReasons: proposal.blockedReasonCodes.map((code) =>
      translateLifecycleBlockReasonCode(locale, code),
    ),
    requiredStory: proposal.requiredStory,
    requiredEvidenceIds: proposal.requiredEvidenceIds,
    proposal,
  };
}

export function buildCandidateLifecyclePanel(
  assetId: string,
  manifest: StyleLibraryManifest = STYLE_LIBRARY_MANIFEST,
  locale: StyleLibraryLocale = "zh",
): StyleLibraryCandidateLifecyclePanel | null {
  const asset = getStyleLibraryAssetById(manifest, assetId);
  if (!asset) {
    return null;
  }

  const statusCopy = getLifecycleStatusCopy(locale, asset.lifecycle, asset);
  const allowed = getAllowedLifecycleTransitions(asset, manifest).map((row) =>
    toTransitionRow(asset, manifest, locale, row.targetState),
  );
  const blocked = getBlockedLifecycleTransitions(asset, manifest).map((row) =>
    toTransitionRow(asset, manifest, locale, row.targetState),
  );
  const promoteProposalPreview =
    blocked.find((row) => row.targetState === "user_selectable")?.proposal ??
    null;

  return {
    assetId: asset.assetId,
    runtimeVariantId: asset.assetType === "variant" ? asset.runtimeVariantId : null,
    currentLifecycle: asset.lifecycle,
    currentLifecycleLabel: getLifecycleColumnMeta(locale, asset.lifecycle).label,
    currentStateDescription: statusCopy.currentStateDescription,
    statusExplanation: statusCopy.statusExplanation,
    nextStepSuggestion: statusCopy.nextStepSuggestion,
    blockedReason: statusCopy.blockedReason,
    requiredEvidenceIds:
      asset.assetType === "variant" ? (asset.evidenceIds ?? []) : [],
    linkedFutureStory: statusCopy.linkedFutureStory,
    runtimeImpactSummary: statusCopy.runtimeImpactSummary,
    allowedTransitions: allowed,
    blockedTransitions: blocked,
    promoteProposalPreview,
  };
}

export function buildLifecycleColumnMetaList(
  manifest: StyleLibraryManifest = STYLE_LIBRARY_MANIFEST,
  locale: StyleLibraryLocale = "zh",
): StyleLibraryLifecycleColumnMeta[] {
  const counts = manifest.assets.reduce(
    (acc, asset) => {
      acc[asset.lifecycle] += 1;
      return acc;
    },
    {
      draft: 0,
      candidate: 0,
      validator_pass: 0,
      paste_qa_pass: 0,
      user_selectable: 0,
      default_eligible: 0,
      deprecated: 0,
    } satisfies Record<StyleLibraryLifecycleState, number>,
  );

  return (
    [
      "draft",
      "candidate",
      "validator_pass",
      "paste_qa_pass",
      "user_selectable",
      "default_eligible",
      "deprecated",
    ] as StyleLibraryLifecycleState[]
  ).map((lifecycle) => {
    const meta = getLifecycleColumnMeta(locale, lifecycle);
    return {
      lifecycle,
      label: meta.label,
      rawKey: lifecycle,
      businessMeaning: meta.businessMeaning,
      nextAction: meta.nextAction,
      assetCount: counts[lifecycle],
    };
  });
}

export function buildCandidateLifecyclePanels(
  manifest: StyleLibraryManifest = STYLE_LIBRARY_MANIFEST,
  locale: StyleLibraryLocale = "zh",
): StyleLibraryCandidateLifecyclePanel[] {
  return manifest.seedAssetIds
    .map((assetId) => buildCandidateLifecyclePanel(assetId, manifest, locale))
    .filter((panel): panel is StyleLibraryCandidateLifecyclePanel => panel !== null);
}
