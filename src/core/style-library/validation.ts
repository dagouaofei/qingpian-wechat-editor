import { ZodError } from "zod";

import { formatZodIssues } from "@/core/schema";

import { validateAllStyleLibraryRegistryPatches } from "./registry-patch";
import { styleLibraryManifestSchema } from "./schemas";
import type {
  StyleLibraryAsset,
  StyleLibraryManifest,
  StyleLibraryValidationIssue,
  StyleLibraryValidationResult,
  StyleLibraryVariantAsset,
} from "./types";

export class StyleLibraryError extends Error {
  readonly issues: ReturnType<typeof formatZodIssues>;

  constructor(message: string, issues: ReturnType<typeof formatZodIssues>) {
    super(message);
    this.name = "StyleLibraryError";
    this.issues = issues;
  }
}

function collectSemanticIssues(
  manifest: StyleLibraryManifest,
): StyleLibraryValidationIssue[] {
  const issues: StyleLibraryValidationIssue[] = [];
  const assetIds = new Set<string>();

  for (const asset of manifest.assets) {
    if (assetIds.has(asset.assetId)) {
      issues.push({
        code: "duplicate_asset_id",
        message: `Duplicate assetId "${asset.assetId}"`,
        path: ["assets"],
      });
    }
    assetIds.add(asset.assetId);

    if (asset.assetType === "variant") {
      const variantAsset = asset;
      if (variantAsset.isSeedAsset || manifest.seedAssetIds.includes(asset.assetId)) {
        if (variantAsset.distribution.userSelectable) {
          issues.push({
            code: "seed_asset_user_selectable_forbidden",
            message: `Seed asset "${asset.assetId}" must not be userSelectable`,
            path: ["assets", asset.assetId, "distribution", "userSelectable"],
          });
        }
        if (variantAsset.distribution.defaultEligible) {
          issues.push({
            code: "seed_asset_default_eligible_forbidden",
            message: `Seed asset "${asset.assetId}" must not be defaultEligible`,
            path: ["assets", asset.assetId, "distribution", "defaultEligible"],
          });
        }
        if (variantAsset.distribution.release1Required) {
          issues.push({
            code: "seed_asset_release1_required_forbidden",
            message: `Seed asset "${asset.assetId}" must not be release1Required`,
            path: ["assets", asset.assetId, "distribution", "release1Required"],
          });
        }
      }
    }
  }

  for (const seedAssetId of manifest.seedAssetIds) {
    if (!assetIds.has(seedAssetId)) {
      issues.push({
        code: "missing_seed_asset",
        message: `seedAssetIds references missing asset "${seedAssetId}"`,
        path: ["seedAssetIds"],
      });
    }
  }

  issues.push(...validateAllStyleLibraryRegistryPatches(manifest));

  return issues;
}

export function parseStyleLibraryManifest(input: unknown): StyleLibraryManifest {
  try {
    return styleLibraryManifestSchema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      const issues = formatZodIssues(error);
      throw new StyleLibraryError(
        issues.map((issue) => issue.message).join("; "),
        issues,
      );
    }
    throw error;
  }
}

export function validateStyleLibraryManifest(
  input: unknown,
): StyleLibraryValidationResult<StyleLibraryManifest> {
  const schemaResult = styleLibraryManifestSchema.safeParse(input);
  if (!schemaResult.success) {
    return {
      ok: false,
      issues: formatZodIssues(schemaResult.error).map((issue) => ({
        code: issue.code,
        message: issue.message,
        path: issue.path,
      })),
    };
  }

  const semanticIssues = collectSemanticIssues(schemaResult.data);
  if (semanticIssues.length > 0) {
    return { ok: false, issues: semanticIssues };
  }

  return { ok: true, data: schemaResult.data, issues: [] };
}

export function getStyleLibraryAssetById(
  manifest: StyleLibraryManifest,
  assetId: string,
): StyleLibraryAsset | undefined {
  return manifest.assets.find((asset) => asset.assetId === assetId);
}

export function getStyleLibraryVariantAssets(
  manifest: StyleLibraryManifest,
): StyleLibraryVariantAsset[] {
  return manifest.assets.filter(
    (asset): asset is StyleLibraryVariantAsset => asset.assetType === "variant",
  );
}

export function getStyleLibrarySeedAssets(
  manifest: StyleLibraryManifest,
): StyleLibraryVariantAsset[] {
  const seedIdSet = new Set(manifest.seedAssetIds);
  return getStyleLibraryVariantAssets(manifest).filter(
    (asset) => asset.isSeedAsset === true || seedIdSet.has(asset.assetId),
  );
}

export { STYLE_LIBRARY_MANIFEST } from "./manifest";
