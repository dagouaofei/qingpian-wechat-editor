import type { BlockType } from "@/core/blocks";
import {
  PREVIEW_HEADING_PUBLISH_STYLE_OPTIONS,
} from "@/lib/preview-heading-style";
import type { UserSelectableVariantPoolSnapshot } from "@/lib/user-selectable-variant-pool-types";
import type { VariantDefinition } from "@/core/styles/types";

import type { PreviewHeadingVariantId } from "./preview-heading-style";

export type PreviewUserSelectableHeadingOption = {
  id: PreviewHeadingVariantId;
  label: string;
  source: "user_selectable" | "database";
};

export function isDbBackedRuntimePool(pool: UserSelectableVariantPoolSnapshot): boolean {
  return pool.source === "database";
}

/** User /preview picker uses DB-only options when the pool snapshot is database-backed. */
export function shouldUseDatabaseOnlyHeadingPicker(
  pool: UserSelectableVariantPoolSnapshot | undefined,
): boolean {
  return pool != null && pool.source === "database";
}

export function buildUserSelectableHeadingOptionsFromPool(
  pool: UserSelectableVariantPoolSnapshot,
): PreviewUserSelectableHeadingOption[] {
  const seen = new Set<string>();
  const options: PreviewUserSelectableHeadingOption[] = [];

  for (const variant of pool.variants) {
    if (variant.blockType !== "heading") {
      continue;
    }
    if (seen.has(variant.id)) {
      continue;
    }
    seen.add(variant.id);
    options.push({
      id: variant.id as PreviewHeadingVariantId,
      label: variant.label,
      source: pool.source === "database" ? "database" : "user_selectable",
    });
  }

  return options;
}

export function buildPreviewHeadingStyleOptionsFromPool(
  pool: UserSelectableVariantPoolSnapshot,
) {
  return buildUserSelectableHeadingOptionsFromPool(pool);
}

/**
 * Resolves heading picker options for PreviewStyleControls.
 * Never merges release1 publish pool with DB userSelectable options.
 */
export function resolvePreviewHeadingStyleOptions(input: {
  includeUserSelectableHeadingOptions: boolean;
  userSelectableHeadingOptions?: PreviewUserSelectableHeadingOption[];
  userSelectablePool?: UserSelectableVariantPoolSnapshot;
}): Array<
  | PreviewUserSelectableHeadingOption
  | (typeof PREVIEW_HEADING_PUBLISH_STYLE_OPTIONS)[number]
> {
  if (!input.includeUserSelectableHeadingOptions) {
    return PREVIEW_HEADING_PUBLISH_STYLE_OPTIONS;
  }

  const pool = input.userSelectablePool;
  if (shouldUseDatabaseOnlyHeadingPicker(pool)) {
    return input.userSelectableHeadingOptions ?? [];
  }

  if (pool?.source === "empty") {
    return input.userSelectableHeadingOptions ?? [];
  }

  if (pool?.source === "code_fallback" || pool?.source === "db_unavailable") {
    return input.userSelectableHeadingOptions ?? [];
  }

  if (input.userSelectableHeadingOptions != null) {
    return input.userSelectableHeadingOptions;
  }

  return [];
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
