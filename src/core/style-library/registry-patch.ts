import type {
  StyleLibraryLifecycleState,
  StyleLibraryManifest,
  StyleLibraryRegistryPatch,
  StyleLibraryValidationIssue,
  StyleLibraryVariantAsset,
} from "./types";
import {
  STYLE_LIBRARY_SEED_RUNTIME_VARIANT_IDS,
} from "./assets/seed-variant-assets";

const LIFECYCLE_ORDER: StyleLibraryLifecycleState[] = [
  "draft",
  "candidate",
  "validator_pass",
  "paste_qa_pass",
  "user_selectable",
  "default_eligible",
  "deprecated",
];

function lifecycleRank(state: StyleLibraryLifecycleState): number {
  return LIFECYCLE_ORDER.indexOf(state);
}

function findVariantAssetByRuntimeId(
  manifest: StyleLibraryManifest,
  variantId: string,
): StyleLibraryVariantAsset | undefined {
  return manifest.assets.find(
    (asset): asset is StyleLibraryVariantAsset =>
      asset.assetType === "variant" && asset.runtimeVariantId === variantId,
  );
}

function isSeedRuntimeVariant(variantId: string): boolean {
  return (STYLE_LIBRARY_SEED_RUNTIME_VARIANT_IDS as readonly string[]).includes(
    variantId,
  );
}

function isSeedVariantAsset(asset: StyleLibraryVariantAsset | undefined): boolean {
  if (!asset) {
    return false;
  }
  return asset.isSeedAsset === true || isSeedRuntimeVariant(asset.runtimeVariantId);
}

export function validateStyleLibraryRegistryPatch(
  manifest: StyleLibraryManifest,
  patch: StyleLibraryRegistryPatch,
): StyleLibraryValidationIssue[] {
  const issues: StyleLibraryValidationIssue[] = [];

  if (!patch.active) {
    return issues;
  }

  const variantAsset = findVariantAssetByRuntimeId(manifest, patch.variantId);

  if (patch.operation === "add_to_variant_pool") {
    if (isSeedRuntimeVariant(patch.variantId) || isSeedVariantAsset(variantAsset)) {
      issues.push({
        code: "seed_asset_patch_forbidden",
        message:
          "Seed assets cannot enter user-selectable pool via registry patch in S9-STORY-002; promote is S9-STORY-007",
        path: ["variantId"],
      });
    }

    if (variantAsset && !variantAsset.distribution.userSelectable) {
      issues.push({
        code: "variant_not_user_selectable",
        message:
          "add_to_variant_pool requires asset.distribution.userSelectable=true",
        path: ["variantId"],
      });
    }
  }

  if (patch.operation === "set_default_variant") {
    if (isSeedRuntimeVariant(patch.variantId) || isSeedVariantAsset(variantAsset)) {
      issues.push({
        code: "seed_asset_patch_forbidden",
        message:
          "Seed assets cannot enter default preset via registry patch in S9-STORY-002; promote is S9-STORY-007",
        path: ["variantId"],
      });
    }

    if (variantAsset && !variantAsset.distribution.defaultEligible) {
      issues.push({
        code: "variant_not_default_eligible",
        message:
          "set_default_variant requires asset.distribution.defaultEligible=true",
        path: ["variantId"],
      });
    }

    if (variantAsset?.distribution.release1Required) {
      issues.push({
        code: "release1_required_default_patch_forbidden",
        message:
          "Active patch must not override release1_required default pool semantics",
        path: ["operation"],
      });
    }
  }

  if (patch.requiresLifecycle) {
    const requiredRank = lifecycleRank(patch.requiresLifecycle);
    const assetLifecycle = variantAsset?.lifecycle;
    if (!assetLifecycle || lifecycleRank(assetLifecycle) < requiredRank) {
      issues.push({
        code: "lifecycle_requirement_not_met",
        message: `Patch requires lifecycle ${patch.requiresLifecycle} but asset lifecycle is ${assetLifecycle ?? "missing"}`,
        path: ["requiresLifecycle"],
      });
    }
  }

  if (patch.requiresEvidenceIds && patch.requiresEvidenceIds.length > 0) {
    const knownEvidenceIds = new Set(
      manifest.evidenceRefs.map((ref) => ref.evidenceId),
    );
    for (const evidenceId of patch.requiresEvidenceIds) {
      if (!knownEvidenceIds.has(evidenceId)) {
        issues.push({
          code: "missing_evidence_ref",
          message: `Required evidence "${evidenceId}" is not registered in manifest.evidenceRefs`,
          path: ["requiresEvidenceIds"],
        });
      }
    }
  }

  return issues;
}

export function validateAllStyleLibraryRegistryPatches(
  manifest: StyleLibraryManifest,
): StyleLibraryValidationIssue[] {
  return manifest.registryPatches.flatMap((patch) =>
    validateStyleLibraryRegistryPatch(manifest, patch),
  );
}
