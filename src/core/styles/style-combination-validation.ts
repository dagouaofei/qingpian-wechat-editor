/**
 * Theme / Preset / Density / Slot combination boundary validation
 * @see docs/architecture/style-system.md §11.6 / §11.8.3
 */

import type { BlockType } from "@/core/blocks";

import { getPresetById, getThemeById, getVariantById } from "./registry";
import { validateBlockStyleProtocolBundle } from "./protocol-validation";
import { densitySchema } from "./schemas";
import type {
  Density,
  PresetDefinition,
  StyleRegistry,
  StyleValidationIssue,
  StyleValidationResult,
  ThemeDefinition,
} from "./types";
import type { StyleAssignmentPatchBlockOverride } from "./style-assignment";
import type { VisualAssetRegistry } from "./visual-assets";
import { RELEASE1_VISUAL_ASSET_REGISTRY } from "./visual-asset-registry";
import { buildStyleValidationResult } from "./validation";
import { isRegisteredFamilyInRegistry } from "./block-visual-protocol";

export type StyleCombinationValidationContext = {
  registry: StyleRegistry;
  assetRegistry?: VisualAssetRegistry;
  requireRelease1RequiredPath?: boolean;
};

export type ValidatePresetThemeInput = {
  presetId?: string;
  themeId?: string;
  density?: Density;
};

function defaultContext(
  context: StyleCombinationValidationContext,
): Required<Pick<StyleCombinationValidationContext, "assetRegistry" | "requireRelease1RequiredPath">> &
  StyleCombinationValidationContext {
  return {
    ...context,
    assetRegistry: context.assetRegistry ?? RELEASE1_VISUAL_ASSET_REGISTRY,
    requireRelease1RequiredPath: context.requireRelease1RequiredPath ?? true,
  };
}

export function validateDensityValue(
  density: unknown,
  path: Array<string | number> = ["density"],
): StyleValidationIssue[] {
  const parsed = densitySchema.safeParse(density);
  if (parsed.success) {
    return [];
  }

  return [
    {
      severity: "error",
      code: "unknown_density",
      message: `Unknown density "${String(density)}"; expected compact | standard | relaxed`,
      path,
      value: String(density),
    },
  ];
}

export function validatePresetThemeCombination(
  input: ValidatePresetThemeInput,
  context: StyleCombinationValidationContext,
): StyleValidationResult {
  const issues: StyleValidationIssue[] = [];
  const resolved = defaultContext(context);

  if (input.density !== undefined) {
    issues.push(...validateDensityValue(input.density));
  }

  if (input.themeId) {
    const theme = getThemeById(resolved.registry, input.themeId);
    if (!theme) {
      issues.push({
        severity: "error",
        code: "theme_not_registered",
        message: `Theme "${input.themeId}" is not registered in StyleRegistry`,
        path: ["themeId"],
        value: input.themeId,
      });
    }
  }

  if (!input.presetId) {
    return buildStyleValidationResult(issues);
  }

  const preset = getPresetById(resolved.registry, input.presetId);
  if (!preset) {
    issues.push({
      severity: "error",
      code: "preset_not_registered",
      message: `Preset "${input.presetId}" is not registered in StyleRegistry`,
      path: ["presetId"],
      value: input.presetId,
    });
    return buildStyleValidationResult(issues);
  }

  if (input.themeId && preset.themeId !== input.themeId) {
    const themeExists = getThemeById(resolved.registry, input.themeId);
    if (themeExists && preset.themeId !== input.themeId) {
      issues.push({
        severity: "warning",
        code: "preset_theme_override_mismatch",
        message: `Preset "${preset.id}" default theme is "${preset.themeId}" but override themeId is "${input.themeId}"`,
        path: ["themeId"],
        value: input.themeId,
      });
    }
  }

  issues.push(...validatePresetDefinition(preset, resolved).issues);

  return buildStyleValidationResult(issues);
}

export function validatePresetDefinition(
  preset: PresetDefinition,
  context: StyleCombinationValidationContext,
): StyleValidationResult {
  const issues: StyleValidationIssue[] = [];
  const resolved = defaultContext(context);

  if (preset.density !== undefined) {
    issues.push(...validateDensityValue(preset.density, ["presets", preset.id, "density"]));
  }

  if (!getThemeById(resolved.registry, preset.themeId)) {
    issues.push({
      severity: "error",
      code: "preset_theme_not_registered",
      message: `Preset "${preset.id}" references unregistered theme "${preset.themeId}"`,
      path: ["presets", preset.id, "themeId"],
      value: preset.themeId,
    });
  }

  if (preset.defaultVariantByBlockType) {
    for (const [blockType, variantId] of Object.entries(
      preset.defaultVariantByBlockType,
    )) {
      if (!variantId) {
        continue;
      }

      const variant = getVariantById(resolved.registry, variantId);
      if (!variant) {
        issues.push({
          severity: "error",
          code: "preset_variant_not_registered",
          message: `Preset "${preset.id}" references unregistered variant "${variantId}" for blockType "${blockType}"`,
          path: ["presets", preset.id, "defaultVariantByBlockType", blockType],
          value: variantId,
        });
        continue;
      }

      if (variant.blockType !== blockType) {
        issues.push({
          severity: "error",
          code: "preset_variant_block_type_mismatch",
          message: `Preset "${preset.id}" variant "${variantId}" blockType "${variant.blockType}" does not match "${blockType}"`,
          path: ["presets", preset.id, "defaultVariantByBlockType", blockType],
          value: variantId,
        });
      }

      if (!isRegisteredFamilyInRegistry(resolved.registry, variant.family)) {
        issues.push({
          severity: "error",
          code: "preset_family_not_registered",
          message: `Preset "${preset.id}" variant "${variantId}" family "${variant.family}" is not registered`,
          path: ["presets", preset.id, "defaultVariantByBlockType", blockType],
          value: variant.family,
        });
      }

      if (
        resolved.requireRelease1RequiredPath &&
        variant.status !== "release1_required"
      ) {
        issues.push({
          severity: "error",
          code: "preset_variant_not_required_path",
          message: `Preset "${preset.id}" variant "${variantId}" status "${variant.status}" is not allowed on default release1_required path`,
          path: ["presets", preset.id, "defaultVariantByBlockType", blockType],
          value: variant.status,
        });
      }
    }
  }

  return buildStyleValidationResult(issues);
}

export function validateStyleAssignmentBlockOverride(
  override: StyleAssignmentPatchBlockOverride,
  blockType: BlockType,
  context: StyleCombinationValidationContext,
): StyleValidationResult {
  const issues: StyleValidationIssue[] = [];
  const resolved = defaultContext(context);

  if (override.density !== undefined) {
    issues.push(
      ...validateDensityValue(override.density, [
        "blockOverrides",
        override.blockId,
        "density",
      ]),
    );
  }

  if (override.familyId && !isRegisteredFamilyInRegistry(resolved.registry, override.familyId)) {
    issues.push({
      severity: "error",
      code: "block_override_family_not_registered",
      message: `Block override familyId "${override.familyId}" is not registered in StyleRegistry`,
      blockId: override.blockId,
      blockType,
      path: ["blockOverrides", override.blockId, "familyId"],
      value: override.familyId,
    });
  }

  if (!override.variantId) {
    return buildStyleValidationResult(issues);
  }

  const bundleResult = validateBlockStyleProtocolBundle({
    blockType,
    blockId: override.blockId,
    variantId: override.variantId,
    familyId: override.familyId,
    slotOverrides: override.slotOverrides,
    assetBindings: override.assetBindings,
    context: {
      registry: resolved.registry,
      assetRegistry: resolved.assetRegistry,
      requireRelease1RequiredPath: resolved.requireRelease1RequiredPath,
      blockType,
      blockId: override.blockId,
    },
  });

  issues.push(...bundleResult.issues);
  return buildStyleValidationResult(issues);
}

export function validateThemePresetDensitySlotCombination(input: {
  presetId?: string;
  themeId?: string;
  density?: Density;
  blockOverrides?: Array<{
    override: StyleAssignmentPatchBlockOverride;
    blockType: BlockType;
  }>;
  context: StyleCombinationValidationContext;
}): StyleValidationResult {
  const issues: StyleValidationIssue[] = [];

  issues.push(
    ...validatePresetThemeCombination(
      {
        presetId: input.presetId,
        themeId: input.themeId,
        density: input.density,
      },
      input.context,
    ).issues,
  );

  if (input.blockOverrides) {
    for (const entry of input.blockOverrides) {
      issues.push(
        ...validateStyleAssignmentBlockOverride(
          entry.override,
          entry.blockType,
          input.context,
        ).issues,
      );
    }
  }

  return buildStyleValidationResult(issues);
}

export function resolveThemeForCombination(
  registry: StyleRegistry,
  presetId?: string,
  themeId?: string,
): ThemeDefinition | undefined {
  if (themeId) {
    return getThemeById(registry, themeId);
  }
  if (!presetId) {
    return undefined;
  }
  const preset = getPresetById(registry, presetId);
  if (!preset) {
    return undefined;
  }
  return getThemeById(registry, preset.themeId);
}
