import type { BlockType } from "@/core/blocks";
import { HTML_PASTE_CANDIDATE_VARIANTS } from "@/core/styles/variants/html-paste-candidate-variants";
import type { VariantDefinition } from "@/core/styles/types";

import { STYLE_LIBRARY_MANIFEST } from "./manifest";
import type { StyleLibraryVariantAsset } from "./types";

export type UserSelectablePreviewHeadingVariantId =
  (typeof HTML_PASTE_CANDIDATE_VARIANTS)[number]["id"];

const USER_SELECTABLE_VARIANT_DEFINITIONS = new Map<string, VariantDefinition>(
  HTML_PASTE_CANDIDATE_VARIANTS.map((variant) => [variant.id, variant]),
);

/** Dev/test manifest fixtures — distribution.userSelectable only (no lifecycle gate). */
export function getUserSelectablePreviewVariantAssets(): StyleLibraryVariantAsset[] {
  return STYLE_LIBRARY_MANIFEST.assets.filter(
    (asset): asset is StyleLibraryVariantAsset =>
      asset.assetType === "variant" &&
      asset.distribution.userSelectable === true &&
      asset.distribution.defaultEligible === false &&
      asset.distribution.release1Required === false,
  );
}

export function getUserSelectablePreviewVariantAssetsForBlockType(
  blockType: BlockType,
): StyleLibraryVariantAsset[] {
  return getUserSelectablePreviewVariantAssets().filter(
    (asset) => asset.blockType === blockType,
  );
}

export function getUserSelectablePreviewVariantIds(): string[] {
  return getUserSelectablePreviewVariantAssets().map((asset) => asset.runtimeVariantId);
}

export function isUserSelectablePreviewVariantId(variantId: string): boolean {
  return getUserSelectablePreviewVariantIds().includes(variantId);
}

export function getUserSelectablePreviewVariantDefinition(
  variantId: string,
): VariantDefinition | undefined {
  if (!isUserSelectablePreviewVariantId(variantId)) {
    return undefined;
  }
  return USER_SELECTABLE_VARIANT_DEFINITIONS.get(variantId);
}

export function getUserSelectablePreviewVariantLabel(variantId: string): string {
  const asset = getUserSelectablePreviewVariantAssets().find(
    (entry) => entry.runtimeVariantId === variantId,
  );
  return asset?.label ?? variantId;
}
