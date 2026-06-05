import type { BlockType } from "@/core/blocks";

import type { StyleLibrarySchemaVersion } from "./tokens";

export const STYLE_LIBRARY_SOURCE_TYPES = ["code", "json", "external"] as const;
export type StyleLibrarySourceType = (typeof STYLE_LIBRARY_SOURCE_TYPES)[number];

export const STYLE_LIBRARY_ASSET_TYPES = [
  "variant",
  "palette",
  "preset",
  "rule",
] as const;
export type StyleLibraryAssetType = (typeof STYLE_LIBRARY_ASSET_TYPES)[number];

export const STYLE_LIBRARY_LIFECYCLE_STATES = [
  "draft",
  "candidate",
  "validator_pass",
  "paste_qa_pass",
  "user_selectable",
  "default_eligible",
  "deprecated",
] as const;
export type StyleLibraryLifecycleState =
  (typeof STYLE_LIBRARY_LIFECYCLE_STATES)[number];

export const STYLE_LIBRARY_REGISTRY_PATCH_OPERATIONS = [
  "add_variant_definition",
  "add_to_variant_pool",
  "set_default_variant",
] as const;
export type StyleLibraryRegistryPatchOperation =
  (typeof STYLE_LIBRARY_REGISTRY_PATCH_OPERATIONS)[number];

export const STYLE_LIBRARY_EVIDENCE_KINDS = [
  "harvest",
  "paste_qa",
  "validator",
  "matrix",
  "drift",
  "waiver",
] as const;
export type StyleLibraryEvidenceKind =
  (typeof STYLE_LIBRARY_EVIDENCE_KINDS)[number];

export const STYLE_LIBRARY_RULE_KINDS = ["copy_safe", "selection"] as const;
export type StyleLibraryRuleKind = (typeof STYLE_LIBRARY_RULE_KINDS)[number];

export type StyleLibraryDistributionFlags = {
  userSelectable: boolean;
  defaultEligible: boolean;
  release1Required: boolean;
};

export type StyleLibraryAssetBase = {
  assetId: string;
  assetType: StyleLibraryAssetType;
  label: string;
  description?: string;
  sourceType: StyleLibrarySourceType;
  lifecycle: StyleLibraryLifecycleState;
  distribution: StyleLibraryDistributionFlags;
  updatedAt: string;
  tags?: string[];
};

export type StyleLibraryVariantAsset = StyleLibraryAssetBase & {
  assetType: "variant";
  runtimeVariantId: string;
  blockType: BlockType;
  styleFamily: string;
  isSeedAsset?: boolean;
  evidenceIds?: string[];
};

export type StyleLibraryPaletteAsset = StyleLibraryAssetBase & {
  assetType: "palette";
  paletteId: string;
  tokenRefs: Record<string, string>;
  compatibleThemeIds?: string[];
};

export type StyleLibraryPresetAsset = StyleLibraryAssetBase & {
  assetType: "preset";
  presetId: string;
  themeId: string;
  notes?: string;
};

export type StyleLibraryRuleAsset = StyleLibraryAssetBase & {
  assetType: "rule";
  ruleId: string;
  ruleKind: StyleLibraryRuleKind;
  refPath?: string;
};

export type StyleLibraryAsset =
  | StyleLibraryVariantAsset
  | StyleLibraryPaletteAsset
  | StyleLibraryPresetAsset
  | StyleLibraryRuleAsset;

export type StyleLibraryEvidenceRef = {
  evidenceId: string;
  kind: StyleLibraryEvidenceKind;
  refPath: string;
  matrixRowId?: string;
  sessionId?: string;
};

export type StyleLibraryLifecycleRef = {
  refId: string;
  variantId: string;
  lifecycle: StyleLibraryLifecycleState;
  recordedAt: string;
};

export type StyleLibraryRegistryPatch = {
  patchId: string;
  operation: StyleLibraryRegistryPatchOperation;
  variantId: string;
  targetPresetId?: string;
  requiresLifecycle?: StyleLibraryLifecycleState;
  requiresEvidenceIds?: string[];
  active: boolean;
  notes?: string;
};

export type StyleLibraryManifest = {
  schemaVersion: StyleLibrarySchemaVersion;
  libraryId: string;
  updatedAt: string;
  assets: StyleLibraryAsset[];
  seedAssetIds: string[];
  registryPatches: StyleLibraryRegistryPatch[];
  evidenceRefs: StyleLibraryEvidenceRef[];
  lifecycleRefs: StyleLibraryLifecycleRef[];
};

export type StyleLibraryValidationIssue = {
  code: string;
  message: string;
  path?: Array<string | number>;
};

export type StyleLibraryValidationResult<T> =
  | { ok: true; data: T; issues: [] }
  | { ok: false; data?: undefined; issues: StyleLibraryValidationIssue[] };
