import {
  createFirstWaveRequiredVariantRegistry,
  type StyleRegistry,
} from "@/core/styles";
import type { VariantDefinition } from "@/core/styles/types";
import {
  getUserSelectablePreviewVariantAssets,
  getUserSelectablePreviewVariantDefinition,
} from "@/core/style-library/user-selectable-preview-pool";

function mergeExtraVariants(
  base: StyleRegistry,
  extraVariants: VariantDefinition[],
): StyleRegistry {
  const existingIds = new Set(base.variants.map((variant) => variant.id));
  const merged = extraVariants.filter((variant) => !existingIds.has(variant.id));
  return {
    ...base,
    variants: [...base.variants, ...merged],
  };
}

function getCodeBackedUserSelectableVariants(): VariantDefinition[] {
  return getUserSelectablePreviewVariantAssets()
    .map((asset) => getUserSelectablePreviewVariantDefinition(asset.runtimeVariantId))
    .filter((variant): variant is VariantDefinition => variant != null);
}

/**
 * User preview path only — extends release1 registry with user_selectable variants.
 * Does not modify preset defaults, variant pools, or generation selection.
 */
export function createUserPreviewStyleRegistry(options?: {
  dbUserSelectableVariants?: VariantDefinition[];
  preferDatabaseVariants?: boolean;
}): StyleRegistry {
  const base = createFirstWaveRequiredVariantRegistry();

  if (options?.preferDatabaseVariants && options.dbUserSelectableVariants?.length) {
    return mergeExtraVariants(base, options.dbUserSelectableVariants);
  }

  return mergeExtraVariants(base, getCodeBackedUserSelectableVariants());
}
