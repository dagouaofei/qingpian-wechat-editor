import type {
  StyleLibraryAsset,
  StyleLibraryDistributionFlags,
  StyleLibraryLifecycleState,
  StyleLibraryManifest,
  StyleLibraryVariantAsset,
} from "./types";

export const STYLE_LIBRARY_LIFECYCLE_ORDER: StyleLibraryLifecycleState[] = [
  "draft",
  "candidate",
  "validator_pass",
  "paste_qa_pass",
  "user_selectable",
  "default_eligible",
  "deprecated",
];

export type LifecycleDistributionImpact = {
  userSelectable: StyleLibraryDistributionFlags["userSelectable"];
  defaultEligible: StyleLibraryDistributionFlags["defaultEligible"];
  release1Required: StyleLibraryDistributionFlags["release1Required"];
  summary: string;
};

export type LifecycleRuntimeImpact = {
  affectsRuntime: false;
  activatesRegistryPatch: false;
  affectsGallery: false;
  affectsDefaultPreset: false;
  summary: string;
};

export type LifecycleChangeProposal = {
  proposalId: string;
  assetId: string;
  runtimeVariantId: string | null;
  fromLifecycle: StyleLibraryLifecycleState;
  toLifecycle: StyleLibraryLifecycleState;
  allowed: boolean;
  blockedReasons: string[];
  blockedReasonCodes: string[];
  requiredEvidenceIds: string[];
  requiredStory: string | null;
  distributionImpact: LifecycleDistributionImpact;
  runtimeImpact: LifecycleRuntimeImpact;
  notes: string[];
};

export type LifecycleTransitionEvaluation = {
  targetState: StyleLibraryLifecycleState;
  allowed: boolean;
  blockedReasons: string[];
  blockedReasonCodes: string[];
  requiredEvidenceIds: string[];
  requiredStory: string | null;
};

export type LifecycleTransitionOptions = {
  deprecationReason?: string;
};

export const LIFECYCLE_BLOCK_REASON_CODES = {
  MISSING_VALIDATOR_EVIDENCE: "MISSING_VALIDATOR_EVIDENCE",
  MISSING_PASTE_QA_EVIDENCE: "MISSING_PASTE_QA_EVIDENCE",
  REQUIRES_PROMOTE_REVIEW: "REQUIRES_PROMOTE_REVIEW",
  SEED_REQUIRES_PROMOTE_REVIEW: "SEED_REQUIRES_PROMOTE_REVIEW",
  REQUIRES_PO_DEFAULT_DECISION: "REQUIRES_PO_DEFAULT_DECISION",
  DEPRECATION_REASON_REQUIRED: "DEPRECATION_REASON_REQUIRED",
  NOT_FORWARD_TRANSITION: "NOT_FORWARD_TRANSITION",
  PROPOSAL_ONLY_NO_PERSISTENCE: "PROPOSAL_ONLY_NO_PERSISTENCE",
} as const;

export type LifecycleBlockReasonCode =
  (typeof LIFECYCLE_BLOCK_REASON_CODES)[keyof typeof LIFECYCLE_BLOCK_REASON_CODES];

const NO_RUNTIME_IMPACT: LifecycleRuntimeImpact = {
  affectsRuntime: false,
  activatesRegistryPatch: false,
  affectsGallery: false,
  affectsDefaultPreset: false,
  summary:
    "No runtime impact in S9-STORY-004. Gallery, Preview, Copy, and default preset unchanged. Registry patch not activated.",
};

const PROPOSAL_ONLY_NOTE =
  "S9-STORY-004 proposal preview only. Does not write STYLE_LIBRARY_MANIFEST.";

function isVariantAsset(asset: StyleLibraryAsset): asset is StyleLibraryVariantAsset {
  return asset.assetType === "variant";
}

function unchangedDistributionImpact(
  asset: StyleLibraryAsset,
): LifecycleDistributionImpact {
  return {
    userSelectable: asset.distribution.userSelectable,
    defaultEligible: asset.distribution.defaultEligible,
    release1Required: asset.distribution.release1Required,
    summary:
      "Distribution flags unchanged in S9-STORY-004 proposal preview.",
  };
}

function getVariantAssetEvidenceIds(
  asset: StyleLibraryVariantAsset,
  manifest: StyleLibraryManifest,
): string[] {
  const linked = asset.evidenceIds ?? [];
  return manifest.evidenceRefs
    .filter((ref) => linked.includes(ref.evidenceId))
    .map((ref) => ref.evidenceId);
}

function hasValidatorEvidence(
  asset: StyleLibraryVariantAsset,
  manifest: StyleLibraryManifest,
): boolean {
  const linkedIds = new Set(asset.evidenceIds ?? []);
  return manifest.evidenceRefs.some(
    (ref) =>
      linkedIds.has(ref.evidenceId) &&
      (ref.kind === "validator" ||
        ref.kind === "matrix" ||
        ref.kind === "harvest"),
  );
}

function hasPasteQaEvidence(
  asset: StyleLibraryVariantAsset,
  manifest: StyleLibraryManifest,
): boolean {
  const linkedIds = new Set(asset.evidenceIds ?? []);
  return manifest.evidenceRefs.some(
    (ref) => linkedIds.has(ref.evidenceId) && ref.kind === "paste_qa",
  );
}

function isSeedAsset(asset: StyleLibraryAsset, manifest: StyleLibraryManifest): boolean {
  return (
    manifest.seedAssetIds.includes(asset.assetId) ||
    (isVariantAsset(asset) && asset.isSeedAsset === true)
  );
}

function forwardTargets(from: StyleLibraryLifecycleState): StyleLibraryLifecycleState[] {
  switch (from) {
    case "draft":
      return ["candidate", "deprecated"];
    case "candidate":
      return ["validator_pass", "deprecated"];
    case "validator_pass":
      return ["paste_qa_pass", "deprecated"];
    case "paste_qa_pass":
      return ["user_selectable", "deprecated"];
    case "user_selectable":
      return ["default_eligible", "deprecated"];
    case "default_eligible":
      return ["deprecated"];
    case "deprecated":
      return [];
    default:
      return [];
  }
}

function evaluateTransition(
  asset: StyleLibraryAsset,
  manifest: StyleLibraryManifest,
  targetState: StyleLibraryLifecycleState,
  options: LifecycleTransitionOptions = {},
): LifecycleTransitionEvaluation {
  const fromLifecycle = asset.lifecycle;
  const targets = forwardTargets(fromLifecycle);
  const requiredEvidenceIds = isVariantAsset(asset)
    ? getVariantAssetEvidenceIds(asset, manifest)
    : [];

  if (!targets.includes(targetState)) {
    return {
      targetState,
      allowed: false,
      blockedReasonCodes: [LIFECYCLE_BLOCK_REASON_CODES.NOT_FORWARD_TRANSITION],
      blockedReasons: [
        `Transition ${fromLifecycle} → ${targetState} is not a supported forward path.`,
      ],
      requiredEvidenceIds,
      requiredStory: null,
    };
  }

  if (targetState === "deprecated") {
    if (!options.deprecationReason?.trim()) {
      return {
        targetState,
        allowed: false,
        blockedReasonCodes: [
          LIFECYCLE_BLOCK_REASON_CODES.DEPRECATION_REASON_REQUIRED,
        ],
        blockedReasons: ["Deprecation requires an operator reason in S9-STORY-004."],
        requiredEvidenceIds,
        requiredStory: null,
      };
    }
    return {
      targetState,
      allowed: true,
      blockedReasonCodes: [LIFECYCLE_BLOCK_REASON_CODES.PROPOSAL_ONLY_NO_PERSISTENCE],
      blockedReasons: [PROPOSAL_ONLY_NOTE],
      requiredEvidenceIds,
      requiredStory: null,
    };
  }

  if (fromLifecycle === "candidate" && targetState === "validator_pass") {
    if (!isVariantAsset(asset) || !hasValidatorEvidence(asset, manifest)) {
      return {
        targetState,
        allowed: false,
        blockedReasonCodes: [
          LIFECYCLE_BLOCK_REASON_CODES.MISSING_VALIDATOR_EVIDENCE,
        ],
        blockedReasons: [
          "Validator evidence or validator-pending harvest/matrix evidence is required.",
        ],
        requiredEvidenceIds,
        requiredStory: "S9-STORY-006",
      };
    }
  }

  if (fromLifecycle === "validator_pass" && targetState === "paste_qa_pass") {
    if (!isVariantAsset(asset) || !hasPasteQaEvidence(asset, manifest)) {
      return {
        targetState,
        allowed: false,
        blockedReasonCodes: [LIFECYCLE_BLOCK_REASON_CODES.MISSING_PASTE_QA_EVIDENCE],
        blockedReasons: ["Paste QA evidence is required."],
        requiredEvidenceIds,
        requiredStory: "S9-STORY-006",
      };
    }
  }

  if (fromLifecycle === "paste_qa_pass" && targetState === "user_selectable") {
    const seed = isSeedAsset(asset, manifest);
    return {
      targetState,
      allowed: false,
      blockedReasonCodes: [
        seed
          ? LIFECYCLE_BLOCK_REASON_CODES.SEED_REQUIRES_PROMOTE_REVIEW
          : LIFECYCLE_BLOCK_REASON_CODES.REQUIRES_PROMOTE_REVIEW,
      ],
      blockedReasons: [
        seed
          ? "Seed assets cannot enter user_selectable before promote review."
          : "Promote review is required before entering user_selectable.",
      ],
      requiredEvidenceIds,
      requiredStory: "S9-STORY-007",
    };
  }

  if (fromLifecycle === "user_selectable" && targetState === "default_eligible") {
    return {
      targetState,
      allowed: false,
      blockedReasonCodes: [LIFECYCLE_BLOCK_REASON_CODES.REQUIRES_PO_DEFAULT_DECISION],
      blockedReasons: [
        "default_eligible requires an independent PO decision; not automatic from user_selectable.",
      ],
      requiredEvidenceIds,
      requiredStory: "S9-STORY-007",
    };
  }

  return {
    targetState,
    allowed: true,
    blockedReasonCodes: [LIFECYCLE_BLOCK_REASON_CODES.PROPOSAL_ONLY_NO_PERSISTENCE],
    blockedReasons: [PROPOSAL_ONLY_NOTE],
    requiredEvidenceIds,
    requiredStory: null,
  };
}

export function getLifecycleTransitionTargets(
  asset: StyleLibraryAsset,
): StyleLibraryLifecycleState[] {
  return forwardTargets(asset.lifecycle);
}

export function getAllowedLifecycleTransitions(
  asset: StyleLibraryAsset,
  manifest: StyleLibraryManifest,
  options: LifecycleTransitionOptions = {},
): LifecycleTransitionEvaluation[] {
  return getLifecycleTransitionTargets(asset)
    .map((targetState) => evaluateTransition(asset, manifest, targetState, options))
    .filter((evaluation) => evaluation.allowed);
}

export function getBlockedLifecycleTransitions(
  asset: StyleLibraryAsset,
  manifest: StyleLibraryManifest,
  options: LifecycleTransitionOptions = {},
): LifecycleTransitionEvaluation[] {
  return getLifecycleTransitionTargets(asset)
    .map((targetState) => evaluateTransition(asset, manifest, targetState, options))
    .filter((evaluation) => !evaluation.allowed);
}

export function canTransitionLifecycle(
  asset: StyleLibraryAsset,
  targetState: StyleLibraryLifecycleState,
  manifest: StyleLibraryManifest,
  options: LifecycleTransitionOptions = {},
): boolean {
  return evaluateTransition(asset, manifest, targetState, options).allowed;
}

export function createLifecycleChangeProposal(
  asset: StyleLibraryAsset,
  targetState: StyleLibraryLifecycleState,
  manifest: StyleLibraryManifest,
  options: LifecycleTransitionOptions = {},
): LifecycleChangeProposal {
  const evaluation = evaluateTransition(asset, manifest, targetState, options);
  const runtimeVariantId =
    asset.assetType === "variant" ? asset.runtimeVariantId : null;

  return {
    proposalId: `${asset.assetId}:${asset.lifecycle}->${targetState}`,
    assetId: asset.assetId,
    runtimeVariantId,
    fromLifecycle: asset.lifecycle,
    toLifecycle: targetState,
    allowed: evaluation.allowed,
    blockedReasons: evaluation.blockedReasons,
    blockedReasonCodes: evaluation.blockedReasonCodes,
    requiredEvidenceIds: evaluation.requiredEvidenceIds,
    requiredStory: evaluation.requiredStory,
    distributionImpact: unchangedDistributionImpact(asset),
    runtimeImpact: NO_RUNTIME_IMPACT,
    notes: evaluation.allowed
      ? [PROPOSAL_ONLY_NOTE]
      : [...evaluation.blockedReasons],
  };
}

export function validateLifecycleTransition(
  proposal: LifecycleChangeProposal,
  manifest: StyleLibraryManifest,
  options: LifecycleTransitionOptions = {},
): { ok: boolean; issues: string[] } {
  const asset = manifest.assets.find((row) => row.assetId === proposal.assetId);
  if (!asset) {
    return { ok: false, issues: [`Asset ${proposal.assetId} not found.`] };
  }

  const expected = createLifecycleChangeProposal(
    asset,
    proposal.toLifecycle,
    manifest,
    options,
  );

  const issues: string[] = [];
  if (expected.allowed !== proposal.allowed) {
    issues.push("Proposal allowed flag does not match transition rules.");
  }
  if (expected.fromLifecycle !== proposal.fromLifecycle) {
    issues.push("Proposal fromLifecycle does not match asset state.");
  }
  if (
    proposal.distributionImpact.userSelectable !== asset.distribution.userSelectable ||
    proposal.distributionImpact.defaultEligible !== asset.distribution.defaultEligible ||
    proposal.distributionImpact.release1Required !== asset.distribution.release1Required
  ) {
    issues.push("Proposal must not change distribution flags in S9-STORY-004.");
  }
  if (proposal.runtimeImpact.affectsRuntime !== false) {
    issues.push("Proposal must not claim runtime impact in S9-STORY-004.");
  }

  return { ok: issues.length === 0, issues };
}

export {
  NO_RUNTIME_IMPACT,
  PROPOSAL_ONLY_NOTE,
  getVariantAssetEvidenceIds,
  hasPasteQaEvidence,
  hasValidatorEvidence,
  isSeedAsset,
};
