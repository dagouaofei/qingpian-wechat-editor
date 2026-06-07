import type { BlockType } from "@/core/blocks";
import type { UserSelectableVariantPoolSnapshot } from "@/lib/user-selectable-variant-pool-types";
import type { VariantDefinition } from "@/core/styles/types";

import {
  PREVIEW_HEADING_PUBLISH_STYLE_OPTIONS,
  type PreviewHeadingVariantId,
} from "./preview-heading-style";

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
  const userSelectable = buildUserSelectableHeadingOptionsFromPool(pool);
  return [...PREVIEW_HEADING_PUBLISH_STYLE_OPTIONS, ...userSelectable];
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
