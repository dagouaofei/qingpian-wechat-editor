import type { BlockType } from "@/core/blocks";
import type { UserSelectableVariantPoolSnapshot } from "@/lib/user-selectable-variant-pool-types";
import type { VariantDefinition } from "@/core/styles/types";

import type { PreviewHeadingVariantId } from "./preview-heading-style";

export type PreviewUserSelectableHeadingOption = {
  id: PreviewHeadingVariantId;
  label: string;
  source: "user_selectable" | "database";
};

export function buildUserSelectableHeadingOptionsFromPool(
  pool: UserSelectableVariantPoolSnapshot,
): PreviewUserSelectableHeadingOption[] {
  return pool.variants
    .filter((variant) => variant.blockType === "heading")
    .map((variant) => ({
      id: variant.id as PreviewHeadingVariantId,
      label: variant.label,
      source: pool.source === "database" ? "database" : "user_selectable",
    }));
}

export function buildPreviewHeadingStyleOptionsFromPool(
  pool: UserSelectableVariantPoolSnapshot,
) {
  return buildUserSelectableHeadingOptionsFromPool(pool);
}

export function isDbBackedRuntimePool(pool: UserSelectableVariantPoolSnapshot): boolean {
  return pool.source === "database";
}

export function isVariantInUserSelectablePool(
  variantId: string,
  pool: UserSelectableVariantPoolSnapshot,
): boolean {
  return pool.poolVariantIds.includes(variantId);
}

export function getUserSelectableVariantsForRegistry(
  pool: UserSelectableVariantPoolSnapshot,
  blockType?: BlockType,
): VariantDefinition[] {
  if (pool.source !== "database") {
    return [];
  }
  return pool.variants.filter((variant) =>
    blockType ? variant.blockType === blockType : true,
  );
}
