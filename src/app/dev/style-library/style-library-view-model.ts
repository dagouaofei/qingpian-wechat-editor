import {
  STYLE_LIBRARY_MANIFEST,
  getStyleLibrarySeedAssets,
  getStyleLibraryVariantAssets,
  validateStyleLibraryManifest,
  validateStyleLibraryRegistryPatch,
} from "@/core/style-library";
import type {
  StyleLibraryEvidenceRef,
  StyleLibraryLifecycleState,
  StyleLibraryManifest,
  StyleLibraryRegistryPatch,
  StyleLibraryValidationIssue,
  StyleLibraryVariantAsset,
} from "@/core/style-library";

export type StyleLibraryAdminAssetRow = {
  assetId: string;
  assetType: string;
  label: string;
  runtimeVariantId: string | null;
  blockType: string | null;
  styleFamily: string | null;
  lifecycle: StyleLibraryLifecycleState;
  userSelectable: boolean;
  defaultEligible: boolean;
  release1Required: boolean;
  isSeedAsset: boolean;
  evidenceCount: number;
  seedBadge: string | null;
};

export type StyleLibraryAdminPatchRow = {
  patchId: string;
  operation: string;
  variantId: string;
  active: boolean;
  requiresLifecycle: string | null;
  requiresEvidenceIds: string[];
  validationIssueCount: number;
  validationIssues: StyleLibraryValidationIssue[];
};

export type StyleLibraryAdminEvidenceRow = {
  evidenceId: string;
  kind: string;
  refPath: string;
  matrixRowId: string | null;
  sessionId: string | null;
};

export type StyleLibraryAdminOverview = {
  libraryId: string;
  schemaVersion: number;
  updatedAt: string;
  totalAssets: number;
  variantAssetCount: number;
  seedAssetCount: number;
  registryPatchCount: number;
  activePatchCount: number;
  evidenceRefCount: number;
  lifecycleDistribution: Record<StyleLibraryLifecycleState, number>;
};

export type StyleLibraryAdminValidationPanel = {
  ok: boolean;
  issueCount: number;
  issues: StyleLibraryValidationIssue[];
};

export type StyleLibraryAdminViewModel = {
  overview: StyleLibraryAdminOverview;
  assets: StyleLibraryAdminAssetRow[];
  patches: StyleLibraryAdminPatchRow[];
  evidence: StyleLibraryAdminEvidenceRow[];
  validation: StyleLibraryAdminValidationPanel;
  runtimeNotice: string;
};

const LIFECYCLE_STATES: StyleLibraryLifecycleState[] = [
  "draft",
  "candidate",
  "validator_pass",
  "paste_qa_pass",
  "user_selectable",
  "default_eligible",
  "deprecated",
];

function emptyLifecycleDistribution(): Record<
  StyleLibraryLifecycleState,
  number
> {
  return LIFECYCLE_STATES.reduce(
    (acc, state) => {
      acc[state] = 0;
      return acc;
    },
    {} as Record<StyleLibraryLifecycleState, number>,
  );
}

function buildLifecycleDistribution(
  manifest: StyleLibraryManifest,
): Record<StyleLibraryLifecycleState, number> {
  const distribution = emptyLifecycleDistribution();
  for (const asset of manifest.assets) {
    distribution[asset.lifecycle] += 1;
  }
  return distribution;
}

function seedBadgeForAsset(asset: StyleLibraryVariantAsset): string | null {
  if (!asset.isSeedAsset) {
    return null;
  }
  return `seed · candidate · ${asset.lifecycle}`;
}

function toAssetRow(
  asset: StyleLibraryManifest["assets"][number],
  seedAssetIds: Set<string>,
): StyleLibraryAdminAssetRow {
  if (asset.assetType === "variant") {
    const isSeed =
      asset.isSeedAsset === true || seedAssetIds.has(asset.assetId);
    return {
      assetId: asset.assetId,
      assetType: asset.assetType,
      label: asset.label,
      runtimeVariantId: asset.runtimeVariantId,
      blockType: asset.blockType,
      styleFamily: asset.styleFamily,
      lifecycle: asset.lifecycle,
      userSelectable: asset.distribution.userSelectable,
      defaultEligible: asset.distribution.defaultEligible,
      release1Required: asset.distribution.release1Required,
      isSeedAsset: isSeed,
      evidenceCount: asset.evidenceIds?.length ?? 0,
      seedBadge: isSeed ? seedBadgeForAsset(asset) : null,
    };
  }

  return {
    assetId: asset.assetId,
    assetType: asset.assetType,
    label: asset.label,
    runtimeVariantId: null,
    blockType: null,
    styleFamily: null,
    lifecycle: asset.lifecycle,
    userSelectable: asset.distribution.userSelectable,
    defaultEligible: asset.distribution.defaultEligible,
    release1Required: asset.distribution.release1Required,
    isSeedAsset: seedAssetIds.has(asset.assetId),
    evidenceCount: 0,
    seedBadge: null,
  };
}

function toPatchRow(
  manifest: StyleLibraryManifest,
  patch: StyleLibraryRegistryPatch,
): StyleLibraryAdminPatchRow {
  const validationIssues = validateStyleLibraryRegistryPatch(manifest, patch);
  return {
    patchId: patch.patchId,
    operation: patch.operation,
    variantId: patch.variantId,
    active: patch.active,
    requiresLifecycle: patch.requiresLifecycle ?? null,
    requiresEvidenceIds: patch.requiresEvidenceIds ?? [],
    validationIssueCount: validationIssues.length,
    validationIssues,
  };
}

function toEvidenceRow(ref: StyleLibraryEvidenceRef): StyleLibraryAdminEvidenceRow {
  return {
    evidenceId: ref.evidenceId,
    kind: ref.kind,
    refPath: ref.refPath,
    matrixRowId: ref.matrixRowId ?? null,
    sessionId: ref.sessionId ?? null,
  };
}

export function buildStyleLibraryAdminViewModel(
  manifest: StyleLibraryManifest = STYLE_LIBRARY_MANIFEST,
): StyleLibraryAdminViewModel {
  const seedAssetIds = new Set(manifest.seedAssetIds);
  const validationResult = validateStyleLibraryManifest(manifest);
  const variantAssets = getStyleLibraryVariantAssets(manifest);
  const seedAssets = getStyleLibrarySeedAssets(manifest);

  return {
    overview: {
      libraryId: manifest.libraryId,
      schemaVersion: manifest.schemaVersion,
      updatedAt: manifest.updatedAt,
      totalAssets: manifest.assets.length,
      variantAssetCount: variantAssets.length,
      seedAssetCount: seedAssets.length,
      registryPatchCount: manifest.registryPatches.length,
      activePatchCount: manifest.registryPatches.filter((patch) => patch.active)
        .length,
      evidenceRefCount: manifest.evidenceRefs.length,
      lifecycleDistribution: buildLifecycleDistribution(manifest),
    },
    assets: manifest.assets.map((asset) => toAssetRow(asset, seedAssetIds)),
    patches: manifest.registryPatches.map((patch) => toPatchRow(manifest, patch)),
    evidence: manifest.evidenceRefs.map(toEvidenceRow),
    validation: {
      ok: validationResult.ok,
      issueCount: validationResult.ok ? 0 : validationResult.issues.length,
      issues: validationResult.ok ? [] : validationResult.issues,
    },
    runtimeNotice:
      "Registry patches are not applied to runtime StyleRegistry in S9-STORY-003. Gallery, Preview, Copy, and default preset are unchanged.",
  };
}
