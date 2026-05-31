import { ZodError } from "zod";

import {
  formatZodIssues,
  validationFailure,
  validationSuccess,
  type SchemaValidationResult,
} from "@/core/schema";
import type { BlockType } from "@/core/blocks";

import { styleRegistrySchema } from "./schemas";
import type {
  PresetDefinition,
  StyleRegistry,
  ThemeDefinition,
  VariantDefinition,
} from "./types";

export class StyleRegistryError extends Error {
  readonly issues: ReturnType<typeof formatZodIssues>;

  constructor(message: string, issues: ReturnType<typeof formatZodIssues>) {
    super(message);
    this.name = "StyleRegistryError";
    this.issues = issues;
  }
}

export function parseStyleRegistry(input: unknown): StyleRegistry {
  try {
    return styleRegistrySchema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      const issues = formatZodIssues(error);
      throw new StyleRegistryError(
        issues.map((issue) => issue.message).join("; "),
        issues,
      );
    }
    throw error;
  }
}

export function validateStyleRegistry(
  input: unknown,
): SchemaValidationResult<StyleRegistry> {
  const result = styleRegistrySchema.safeParse(input);
  if (result.success) {
    return validationSuccess(result.data);
  }
  return validationFailure(formatZodIssues(result.error));
}

export function getThemeById(
  registry: StyleRegistry,
  themeId: string,
): ThemeDefinition | undefined {
  return registry.themes.find((theme) => theme.id === themeId);
}

export function getPresetById(
  registry: StyleRegistry,
  presetId: string,
): PresetDefinition | undefined {
  return registry.presets.find((preset) => preset.id === presetId);
}

export function getVariantById(
  registry: StyleRegistry,
  variantId: string,
): VariantDefinition | undefined {
  return registry.variants.find((variant) => variant.id === variantId);
}

export function getVariantsForBlockType(
  registry: StyleRegistry,
  blockType: BlockType,
): VariantDefinition[] {
  return registry.variants.filter((variant) => variant.blockType === blockType);
}
