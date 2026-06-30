import {
  createFirstWaveRequiredVariantRegistry,
  type StyleRegistry,
} from "@/core/styles";
import type { VariantDefinition } from "@/core/styles/types";

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

/**
 * User preview path — extends release1 registry with DB-backed userSelectable variants only.
 * Does not merge file manifest / lifecycle fixtures.
 */
export function createUserPreviewStyleRegistry(options?: {
  dbUserSelectableVariants?: VariantDefinition[];
}): StyleRegistry {
  const base = createFirstWaveRequiredVariantRegistry();

  if (options?.dbUserSelectableVariants?.length) {
    return mergeExtraVariants(base, options.dbUserSelectableVariants);
  }

  return base;
}
