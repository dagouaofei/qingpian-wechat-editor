import {
  createFirstWaveRequiredVariantRegistry,
  type StyleRegistry,
} from "@/core/styles";
import {
  getUserSelectablePreviewVariantAssets,
  getUserSelectablePreviewVariantDefinition,
} from "@/core/style-library/user-selectable-preview-pool";

/**
 * User preview path only — extends release1 registry with user_selectable variants.
 * Does not modify preset defaults, variant pools, or generation selection.
 */
export function createUserPreviewStyleRegistry(): StyleRegistry {
  const base = createFirstWaveRequiredVariantRegistry();
  const existingIds = new Set(base.variants.map((variant) => variant.id));

  const extraVariants = getUserSelectablePreviewVariantAssets()
    .map((asset) => getUserSelectablePreviewVariantDefinition(asset.runtimeVariantId))
    .filter((variant): variant is NonNullable<typeof variant> => variant != null)
    .filter((variant) => !existingIds.has(variant.id));

  return {
    ...base,
    variants: [...base.variants, ...extraVariants],
  };
}
