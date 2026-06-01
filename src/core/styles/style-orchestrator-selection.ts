/**
 * Block → Variant selection for StyleOrchestrator (before StyleResolver).
 * Priority: block-level assignment > preset default > registry fallback.
 */

import type { Block } from "@/core/blocks";

import { getPresetById, getVariantById, getVariantsForBlockType } from "./registry";
import type {
  PresetDefinition,
  ResolvedStyleSource,
  StyleRegistry,
  StyleValidationIssue,
  VariantDefinition,
} from "./types";

const MAGAZINE_LEFT_BAR_TITLE_ID = "magazine_left_bar_title";

export type OrchestratorBlockStyleState = {
  blockId: string;
  blockType: Block["type"];
  variantId: string;
  familyId: string;
  layoutMode?: string;
  source: ResolvedStyleSource;
  slotOverrides?: Record<string, string | number | boolean>;
  assetBindings?: Record<string, string>;
};

export type OrchestratorBlockOverrideInput = {
  blockId: string;
  variantId?: string;
  familyId?: string;
  slotOverrides?: Record<string, string | number | boolean>;
  assetBindings?: Record<string, string>;
};

function pushIssue(
  issues: StyleValidationIssue[],
  issue: StyleValidationIssue,
): void {
  issues.push(issue);
}

export function isOrchestratorCopySafeRequiredVariant(
  variant: VariantDefinition,
): boolean {
  if (variant.id === MAGAZINE_LEFT_BAR_TITLE_ID) {
    return false;
  }
  if (variant.status !== "release1_required") {
    return false;
  }
  if (variant.compatibility?.copySafety === "preview_only") {
    return false;
  }
  return true;
}

export function pickOrchestratorFallbackVariant(
  registry: StyleRegistry,
  blockType: Block["type"],
  options?: {
    excludeVariantIds?: string[];
    excludeFamilyLayout?: { familyId: string; layoutMode?: string };
  },
): VariantDefinition | undefined {
  const excluded = new Set(options?.excludeVariantIds ?? []);

  return getVariantsForBlockType(registry, blockType).find((variant) => {
    if (!isOrchestratorCopySafeRequiredVariant(variant)) {
      return false;
    }
    if (excluded.has(variant.id)) {
      return false;
    }
    if (
      options?.excludeFamilyLayout &&
      variant.family === options.excludeFamilyLayout.familyId &&
      variant.componentProtocol?.layoutMode ===
        options.excludeFamilyLayout.layoutMode
    ) {
      return false;
    }
    return true;
  });
}

function variantToBlockState(
  block: Block,
  variant: VariantDefinition,
  source: ResolvedStyleSource,
  extras?: Pick<
    OrchestratorBlockStyleState,
    "slotOverrides" | "assetBindings"
  >,
): OrchestratorBlockStyleState {
  return {
    blockId: block.id,
    blockType: block.type,
    variantId: variant.id,
    familyId: variant.family,
    layoutMode: variant.componentProtocol?.layoutMode,
    source,
    slotOverrides: extras?.slotOverrides,
    assetBindings: extras?.assetBindings,
  };
}

function tryResolveVariant(
  block: Block,
  registry: StyleRegistry,
  variantId: string | undefined,
  source: ResolvedStyleSource,
  extras: Pick<OrchestratorBlockStyleState, "slotOverrides" | "assetBindings">,
  issues: StyleValidationIssue[],
): OrchestratorBlockStyleState | undefined {
  if (!variantId) {
    return undefined;
  }

  const variant = getVariantById(registry, variantId);
  if (!variant) {
    pushIssue(issues, {
      severity: "error",
      code: "orchestrator_variant_not_found",
      message: `Variant "${variantId}" not found in registry`,
      blockId: block.id,
      variantId,
    });
    return undefined;
  }

  if (variant.blockType !== block.type) {
    pushIssue(issues, {
      severity: "error",
      code: "orchestrator_variant_block_type_mismatch",
      message: `Variant "${variantId}" blockType ${variant.blockType} does not match block ${block.type}`,
      blockId: block.id,
      blockType: block.type,
      variantId,
    });
    return undefined;
  }

  if (source !== "explicit" && variant.status === "experimental") {
    pushIssue(issues, {
      severity: "error",
      code: "orchestrator_experimental_not_default",
      message: `Variant "${variantId}" is experimental and cannot be selected by default`,
      blockId: block.id,
      variantId,
    });
    return undefined;
  }

  return variantToBlockState(block, variant, source, extras);
}

export function resolveOrchestratorBlockVariant(
  block: Block,
  registry: StyleRegistry,
  preset: PresetDefinition,
  override: OrchestratorBlockOverrideInput | undefined,
  issues: StyleValidationIssue[],
): OrchestratorBlockStyleState {
  const extras = {
    slotOverrides: override?.slotOverrides,
    assetBindings: override?.assetBindings,
  };

  const explicit = tryResolveVariant(
    block,
    registry,
    override?.variantId,
    "explicit",
    extras,
    issues,
  );
  if (explicit) {
    return explicit;
  }

  const presetDefaultId = preset.defaultVariantByBlockType?.[block.type];
  const presetDefault = tryResolveVariant(
    block,
    registry,
    presetDefaultId,
    "preset_default",
    extras,
    issues,
  );
  if (presetDefault) {
    return presetDefault;
  }

  if (presetDefaultId) {
    pushIssue(issues, {
      severity: "warning",
      code: "orchestrator_preset_default_unavailable",
      message: `Preset default variant "${presetDefaultId}" unavailable for block ${block.type}`,
      blockId: block.id,
      variantId: presetDefaultId,
    });
  }

  const registryFallback = pickOrchestratorFallbackVariant(registry, block.type);
  if (registryFallback) {
    const hadPriorFailure = Boolean(override?.variantId || presetDefaultId);
    if (hadPriorFailure) {
      pushIssue(issues, {
        severity: "warning",
        code: "orchestrator_registry_fallback_applied",
        message: `Fell back to registry variant "${registryFallback.id}" for block ${block.id}`,
        blockId: block.id,
        variantId: registryFallback.id,
        fallbackVariantId: registryFallback.id,
      });
    }
    return variantToBlockState(
      block,
      registryFallback,
      hadPriorFailure ? "fallback" : "registry_default",
      extras,
    );
  }

  pushIssue(issues, {
    severity: "error",
    code: "orchestrator_no_fallback_variant",
    message: `No copy-safe release1_required fallback variant for block type "${block.type}"`,
    blockId: block.id,
    blockType: block.type,
  });

  throw new Error(
    `Unable to resolve orchestrator variant for block ${block.id}`,
  );
}

export function resolveOrchestratorPreset(
  registry: StyleRegistry,
  presetId: string,
  issues: StyleValidationIssue[],
): PresetDefinition {
  const preset = getPresetById(registry, presetId);
  if (preset) {
    return preset;
  }

  pushIssue(issues, {
    severity: "error",
    code: "orchestrator_preset_not_found",
    message: `Preset "${presetId}" not found in registry`,
  });

  const fallbackPreset = registry.presets[0];
  if (!fallbackPreset) {
    throw new Error("Style registry has no presets");
  }

  pushIssue(issues, {
    severity: "warning",
    code: "orchestrator_preset_fallback",
    message: `Fell back to preset "${fallbackPreset.id}"`,
  });

  return fallbackPreset;
}
