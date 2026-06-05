import { getStyleLibraryInspectionSummary } from "./inspection";
import type { StyleLibraryInspectionSummary } from "./inspection-result";
import { STYLE_LIBRARY_LIFECYCLE_ORDER } from "./lifecycle";
import {
  PROMOTE_BLOCK_REASON_CODES,
  PROMOTE_DEFAULT_ELIGIBLE_DECISION,
  PROMOTE_MIN_LIFECYCLE,
  PROMOTE_PROPOSED_PATCH_PRESET_ID,
  PROMOTE_PROPOSAL_STORY,
  PROMOTE_TARGET_LIFECYCLE,
} from "./promote-rules";
import type {
  PromoteEligibilityResult,
  PromoteEligibilityStatus,
  PromoteProposal,
} from "./promote-proposal";
import type {
  StyleLibraryManifest,
  StyleLibraryRegistryPatch,
  StyleLibraryVariantAsset,
} from "./types";

const NO_RUNTIME_IMPACT: PromoteProposal["runtimeImpact"] = {
  affectsRuntime: false,
  activatesRegistryPatch: false,
  affectsGallery: false,
  affectsDefaultPreset: false,
  summary: "No runtime registry change in S9-STORY-007 v0",
};

const NO_DEFAULT_PRESET_IMPACT: PromoteProposal["defaultPresetImpact"] = {
  entersDefaultPreset: false,
  affectsAiDefaultSelection: false,
  affectsRelease1RequiredVariants: false,
  summary:
    "Does not enter default preset · does not affect AI default selection · does not affect Release 1 required variants",
};

function lifecycleIndex(state: StyleLibraryManifest["assets"][number]["lifecycle"]): number {
  return STYLE_LIBRARY_LIFECYCLE_ORDER.indexOf(state);
}

function buildEvidenceChecklist(
  asset: StyleLibraryVariantAsset,
  manifest: StyleLibraryManifest,
): PromoteEligibilityResult["evidenceChecklist"] {
  const knownEvidenceIds = new Set(manifest.evidenceRefs.map((ref) => ref.evidenceId));
  return (asset.evidenceIds ?? []).map((evidenceId) => ({
    evidenceId,
    present: knownEvidenceIds.has(evidenceId),
  }));
}

function hasTraceableEvidenceRefs(
  asset: StyleLibraryVariantAsset,
  manifest: StyleLibraryManifest,
): boolean {
  const checklist = buildEvidenceChecklist(asset, manifest);
  return checklist.length > 0 && checklist.every((row) => row.present);
}

function hasPasteQaEvidence(
  asset: StyleLibraryVariantAsset,
  manifest: StyleLibraryManifest,
): boolean {
  const pasteQaEvidenceIds = new Set(
    manifest.evidenceRefs
      .filter((ref) => ref.kind === "paste_qa")
      .map((ref) => ref.evidenceId),
  );
  if ((asset.evidenceIds ?? []).some((id) => pasteQaEvidenceIds.has(id))) {
    return true;
  }
  return lifecycleIndex(asset.lifecycle) >= lifecycleIndex(PROMOTE_MIN_LIFECYCLE);
}

export function getPromoteBlockedReasons(
  asset: StyleLibraryVariantAsset,
  manifest: StyleLibraryManifest,
  inspectionSummary: StyleLibraryInspectionSummary,
): string[] {
  return checkPromoteEligibility(asset, manifest, inspectionSummary).blockedReasonCodes;
}

export function checkPromoteEligibility(
  asset: StyleLibraryVariantAsset,
  manifest: StyleLibraryManifest,
  inspectionSummary: StyleLibraryInspectionSummary,
): PromoteEligibilityResult {
  const blockedReasonCodes: string[] = [];
  const warningCodes: string[] = [];
  const evidenceChecklist = buildEvidenceChecklist(asset, manifest);

  if (asset.assetType !== "variant") {
    blockedReasonCodes.push(PROMOTE_BLOCK_REASON_CODES.NOT_VARIANT_ASSET);
  }
  if (lifecycleIndex(asset.lifecycle) < lifecycleIndex(PROMOTE_MIN_LIFECYCLE)) {
    blockedReasonCodes.push(PROMOTE_BLOCK_REASON_CODES.LIFECYCLE_TOO_LOW);
  }
  if (asset.lifecycle === "deprecated") {
    blockedReasonCodes.push(PROMOTE_BLOCK_REASON_CODES.DEPRECATED);
  }
  if (asset.distribution.userSelectable) {
    blockedReasonCodes.push(PROMOTE_BLOCK_REASON_CODES.ALREADY_USER_SELECTABLE);
  }
  if (asset.distribution.defaultEligible) {
    blockedReasonCodes.push(PROMOTE_BLOCK_REASON_CODES.ALREADY_DEFAULT_ELIGIBLE);
  }
  if (asset.distribution.release1Required) {
    blockedReasonCodes.push(PROMOTE_BLOCK_REASON_CODES.ALREADY_RELEASE1_REQUIRED);
  }
  if (!asset.runtimeVariantId) {
    blockedReasonCodes.push(PROMOTE_BLOCK_REASON_CODES.MISSING_RUNTIME_VARIANT_ID);
  }
  if (inspectionSummary.validator.status === "FAIL" || !inspectionSummary.validator.valid) {
    blockedReasonCodes.push(PROMOTE_BLOCK_REASON_CODES.VALIDATOR_FAIL);
  }
  if (
    inspectionSummary.promoteReadiness.hasBlockingIssues ||
    inspectionSummary.validator.blockerCount > 0
  ) {
    blockedReasonCodes.push(PROMOTE_BLOCK_REASON_CODES.BLOCKING_ISSUES);
  }
  if (!hasPasteQaEvidence(asset, manifest)) {
    blockedReasonCodes.push(PROMOTE_BLOCK_REASON_CODES.MISSING_PASTE_QA_EVIDENCE);
  }
  if (!hasTraceableEvidenceRefs(asset, manifest)) {
    blockedReasonCodes.push(PROMOTE_BLOCK_REASON_CODES.MISSING_EVIDENCE_REFS);
  }
  if (
    inspectionSummary.validator.status === "WARNING" &&
    blockedReasonCodes.length === 0
  ) {
    warningCodes.push(PROMOTE_BLOCK_REASON_CODES.COMPATIBILITY_WARNING);
  }

  const status: PromoteEligibilityStatus =
    blockedReasonCodes.length > 0
      ? "blocked"
      : warningCodes.length > 0
        ? "ready_with_warnings"
        : "ready";

  return {
    status,
    eligible: status !== "blocked",
    blockedReasonCodes,
    warningCodes,
    evidenceChecklist,
  };
}

export function createUserSelectablePatchProposal(
  proposal: Pick<PromoteProposal, "assetId" | "runtimeVariantId" | "requiredEvidenceIds">,
): StyleLibraryRegistryPatch {
  return {
    patchId: `proposed-promote-${proposal.assetId}`,
    operation: "add_to_variant_pool",
    variantId: proposal.runtimeVariantId,
    targetPresetId: PROMOTE_PROPOSED_PATCH_PRESET_ID,
    requiresLifecycle: PROMOTE_TARGET_LIFECYCLE,
    requiresEvidenceIds: proposal.requiredEvidenceIds,
    active: false,
    notes: `${PROMOTE_PROPOSAL_STORY} proposed patch · inactive · not applied to runtime`,
  };
}

function buildDistributionImpact(
  asset: StyleLibraryVariantAsset,
): PromoteProposal["distributionImpact"] {
  return {
    userSelectable: {
      from: asset.distribution.userSelectable,
      to: true,
    },
    defaultEligible: {
      from: asset.distribution.defaultEligible,
      to: false,
    },
    release1Required: {
      from: asset.distribution.release1Required,
      to: false,
    },
    summary: "userSelectable: false → true · defaultEligible: false → false · release1Required: false → false",
  };
}

export function createPromoteProposal(
  asset: StyleLibraryVariantAsset,
  manifest: StyleLibraryManifest = {} as StyleLibraryManifest,
  inspectionSummary?: StyleLibraryInspectionSummary,
): PromoteProposal {
  const summary =
    inspectionSummary ?? getStyleLibraryInspectionSummary(asset, manifest);
  const eligibility = checkPromoteEligibility(asset, manifest, summary);
  const requiredEvidenceIds = asset.evidenceIds ?? [];
  const proposalId = `promote-proposal-${asset.assetId}`;

  const patch = createUserSelectablePatchProposal({
    assetId: asset.assetId,
    runtimeVariantId: asset.runtimeVariantId,
    requiredEvidenceIds,
  });

  return {
    proposalId,
    assetId: asset.assetId,
    runtimeVariantId: asset.runtimeVariantId,
    fromLifecycle: asset.lifecycle,
    toDistribution: {
      userSelectable: true,
      defaultEligible: false,
      release1Required: false,
    },
    eligibilityStatus: eligibility.status,
    warnings: eligibility.warningCodes,
    blockedReasons: eligibility.blockedReasonCodes,
    requiredEvidenceIds,
    validatorStatus: summary.validator.status,
    pasteQaStatus: hasPasteQaEvidence(asset, manifest) ? "present" : "missing",
    patchPreview: {
      ...patch,
      status: "proposed",
    },
    distributionImpact: buildDistributionImpact(asset),
    runtimeImpact: NO_RUNTIME_IMPACT,
    defaultPresetImpact: NO_DEFAULT_PRESET_IMPACT,
    nextDecisionRequired: PROMOTE_DEFAULT_ELIGIBLE_DECISION,
    createdAt: manifest.updatedAt ?? "2026-06-05",
  };
}

export function validatePromoteProposal(
  proposal: PromoteProposal,
  manifest: StyleLibraryManifest,
): { ok: boolean; issues: string[] } {
  const issues: string[] = [];

  if (!proposal.toDistribution.userSelectable) {
    issues.push("proposal must set userSelectable to true");
  }
  if (proposal.toDistribution.defaultEligible) {
    issues.push("proposal must not set defaultEligible");
  }
  if (proposal.toDistribution.release1Required) {
    issues.push("proposal must not set release1Required");
  }
  if (proposal.patchPreview.active) {
    issues.push("patch preview must remain inactive");
  }
  if (proposal.runtimeImpact.affectsRuntime) {
    issues.push("runtime impact must remain no-change");
  }
  if (proposal.defaultPresetImpact.entersDefaultPreset) {
    issues.push("proposal must not enter default preset");
  }

  const asset = manifest.assets.find((row) => row.assetId === proposal.assetId);
  if (asset?.assetType === "variant") {
    if (
      asset.distribution.userSelectable !== proposal.distributionImpact.userSelectable.from
    ) {
      issues.push("proposal distributionImpact.from does not match manifest");
    }
  }

  return { ok: issues.length === 0, issues };
}

export type {
  PromoteEligibilityResult,
  PromoteEligibilityStatus,
  PromoteProposal,
} from "./promote-proposal";
