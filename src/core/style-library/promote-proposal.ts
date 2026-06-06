import type {
  StyleLibraryDistributionFlags,
  StyleLibraryLifecycleState,
  StyleLibraryRegistryPatch,
} from "./types";

import type { StyleLibraryInspectionValidatorStatus } from "./inspection-result";

export type PromoteEligibilityStatus = "ready" | "ready_with_warnings" | "blocked";

export type PromotePasteQaStatus = "present" | "missing";

export type PromoteDistributionImpact = {
  userSelectable: { from: boolean; to: boolean };
  defaultEligible: { from: boolean; to: boolean };
  release1Required: { from: boolean; to: boolean };
  summary: string;
};

export type PromoteRuntimeImpact = {
  affectsRuntime: false;
  activatesRegistryPatch: false;
  affectsGallery: false;
  affectsDefaultPreset: false;
  summary: string;
};

export type PromoteDefaultPresetImpact = {
  entersDefaultPreset: false;
  affectsAiDefaultSelection: false;
  affectsRelease1RequiredVariants: false;
  summary: string;
};

export type PromotePatchPreview = StyleLibraryRegistryPatch & {
  status: "proposed";
};

export type PromoteProposal = {
  proposalId: string;
  assetId: string;
  runtimeVariantId: string;
  fromLifecycle: StyleLibraryLifecycleState;
  toDistribution: StyleLibraryDistributionFlags;
  eligibilityStatus: PromoteEligibilityStatus;
  warnings: string[];
  blockedReasons: string[];
  requiredEvidenceIds: string[];
  validatorStatus: StyleLibraryInspectionValidatorStatus;
  pasteQaStatus: PromotePasteQaStatus;
  patchPreview: PromotePatchPreview;
  distributionImpact: PromoteDistributionImpact;
  runtimeImpact: PromoteRuntimeImpact;
  defaultPresetImpact: PromoteDefaultPresetImpact;
  nextDecisionRequired: string;
  createdAt: string;
};

export type PromoteEligibilityResult = {
  status: PromoteEligibilityStatus;
  eligible: boolean;
  blockedReasonCodes: string[];
  warningCodes: string[];
  evidenceChecklist: Array<{ evidenceId: string; present: boolean }>;
};
