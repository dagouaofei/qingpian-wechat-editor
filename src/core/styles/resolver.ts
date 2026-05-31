import type { Block } from "@/core/blocks";
import type { Article, BlockStyleOverride } from "@/core/article";

import {
  getPresetById,
  getThemeById,
  getVariantById,
  getVariantsForBlockType,
} from "./registry";
import { STYLE_SCHEMA_VERSION } from "./tokens";
import type {
  PresetDefinition,
  ResolveArticleStyleOptions,
  ResolvedArticleStyle,
  ResolvedBlockStyle,
  ResolvedStyleSource,
  ResolvedStyleTokens,
  StyleRegistry,
  StyleResolveContext,
  StyleResolveIssue,
  ThemeDefinition,
  VariantDefinition,
} from "./types";

export class StyleResolveError extends Error {
  readonly issues: StyleResolveIssue[];

  constructor(message: string, issues: StyleResolveIssue[]) {
    super(message);
    this.name = "StyleResolveError";
    this.issues = issues;
  }
}

const MAGAZINE_LEFT_BAR_TITLE_ID = "magazine_left_bar_title";

function pushIssue(
  issues: StyleResolveIssue[],
  issue: StyleResolveIssue,
): void {
  issues.push(issue);
}

function isAutomaticFallbackCandidate(variant: VariantDefinition): boolean {
  if (variant.id === MAGAZINE_LEFT_BAR_TITLE_ID) {
    return false;
  }
  if (variant.status === "experimental") {
    return false;
  }
  return true;
}

function pickRegistryDefaultVariant(
  registry: StyleRegistry,
  blockType: Block["type"],
): VariantDefinition | undefined {
  const candidates = getVariantsForBlockType(registry, blockType).filter(
    isAutomaticFallbackCandidate,
  );

  return (
    candidates.find((variant) => variant.status === "release1_required") ??
    candidates.find((variant) => variant.status === "release1_candidate") ??
    candidates[0]
  );
}

function buildResolvedTokens(
  theme: ThemeDefinition,
  variant: VariantDefinition,
): ResolvedStyleTokens {
  return {
    theme: theme.tokens,
    variant: variant.tokens,
  };
}

function buildResolvedBlockStyle(
  block: Block,
  variant: VariantDefinition,
  context: StyleResolveContext,
  source: ResolvedStyleSource,
  fallbackReason?: string,
): ResolvedBlockStyle {
  return {
    blockId: block.id,
    blockType: block.type,
    variantId: variant.id,
    variant,
    presetId: context.presetId,
    themeId: context.themeId,
    tokens: buildResolvedTokens(context.theme, variant),
    slots: variant.slots,
    compatibility: variant.compatibility,
    source,
    fallbackReason,
  };
}

function resolveVariantForBlock(
  block: Block,
  context: StyleResolveContext,
): ResolvedBlockStyle {
  const { registry, preset, issues } = context;
  const override: BlockStyleOverride | undefined = context.blockOverride;

  const tryVariant = (
    variantId: string | undefined,
    source: ResolvedStyleSource,
  ): ResolvedBlockStyle | undefined => {
    if (!variantId) {
      return undefined;
    }

    const variant = getVariantById(registry, variantId);
    if (!variant) {
      pushIssue(issues, {
        code: "variant_not_found",
        message: `Variant "${variantId}" not found in registry`,
        blockId: block.id,
      });
      return undefined;
    }

    if (variant.blockType !== block.type) {
      pushIssue(issues, {
        code: "variant_block_type_mismatch",
        message: `Variant "${variantId}" blockType ${variant.blockType} does not match block ${block.type}`,
        blockId: block.id,
      });
      return undefined;
    }

    if (
      source !== "explicit" &&
      variant.status === "experimental"
    ) {
      pushIssue(issues, {
        code: "variant_experimental_not_default",
        message: `Variant "${variantId}" is experimental and cannot be used as default`,
        blockId: block.id,
      });
      return undefined;
    }

    return buildResolvedBlockStyle(block, variant, context, source);
  };

  const explicit = tryVariant(override?.variantId, "explicit");
  if (explicit) {
    return explicit;
  }

  const presetDefaultId = preset.defaultVariantByBlockType?.[block.type];
  const presetDefault = tryVariant(presetDefaultId, "preset_default");
  if (presetDefault) {
    return presetDefault;
  }

  if (presetDefaultId) {
    pushIssue(issues, {
      code: "preset_default_unavailable",
      message: `Preset default variant "${presetDefaultId}" unavailable for block ${block.type}`,
      blockId: block.id,
    });
  }

  const registryDefault = pickRegistryDefaultVariant(registry, block.type);
  if (registryDefault) {
    const hadPriorFailure = Boolean(override?.variantId || presetDefaultId);
    return buildResolvedBlockStyle(
      block,
      registryDefault,
      context,
      hadPriorFailure ? "fallback" : "registry_default",
      hadPriorFailure
        ? `Fell back to registry variant "${registryDefault.id}"`
        : undefined,
    );
  }

  pushIssue(issues, {
    code: "no_variant_for_block_type",
    message: `No resolvable variant for block type "${block.type}"`,
    blockId: block.id,
  });

  throw new StyleResolveError(
    `Unable to resolve variant for block ${block.id}`,
    issues,
  );
}

export function resolveBlockStyle(
  block: Block,
  context: StyleResolveContext,
): ResolvedBlockStyle {
  return resolveVariantForBlock(block, context);
}

function resolvePresetAndTheme(
  article: Article,
  registry: StyleRegistry,
  options: ResolveArticleStyleOptions | undefined,
  issues: StyleResolveIssue[],
): { preset: PresetDefinition; theme: ThemeDefinition; presetId: string; themeId: string } {
  const requestedPresetId =
    options?.presetId ?? article.styleAssignment.presetId;
  let preset = getPresetById(registry, requestedPresetId);
  let presetId = requestedPresetId;

  if (!preset) {
    pushIssue(issues, {
      code: "preset_not_found",
      message: `Preset "${requestedPresetId}" not found in registry`,
    });
    const fallbackPreset = registry.presets[0];
    if (!fallbackPreset) {
      throw new StyleResolveError("Style registry has no presets", issues);
    }
    preset = fallbackPreset;
    presetId = fallbackPreset.id;
  }

  const requestedThemeId =
    options?.themeId ?? article.styleAssignment.themeId ?? preset.themeId;
  let theme = getThemeById(registry, requestedThemeId);
  let themeId = requestedThemeId;

  if (!theme) {
    pushIssue(issues, {
      code: "theme_not_found",
      message: `Theme "${requestedThemeId}" not found in registry`,
    });
    theme = getThemeById(registry, preset.themeId);
    if (theme) {
      themeId = preset.themeId;
      pushIssue(issues, {
        code: "theme_fallback_to_preset",
        message: `Fell back to preset theme "${preset.themeId}"`,
      });
    } else {
      const fallbackTheme = registry.themes[0];
      if (!fallbackTheme) {
        throw new StyleResolveError("Style registry has no themes", issues);
      }
      theme = fallbackTheme;
      themeId = fallbackTheme.id;
      pushIssue(issues, {
        code: "theme_fallback_to_registry",
        message: `Fell back to registry theme "${fallbackTheme.id}"`,
      });
    }
  }

  if (options?.strict && issues.length > 0) {
    throw new StyleResolveError("Strict style resolve failed", issues);
  }

  return { preset, theme, presetId, themeId };
}

export function resolveArticleStyle(
  article: Article,
  registry: StyleRegistry,
  options?: ResolveArticleStyleOptions,
): ResolvedArticleStyle {
  const issues: StyleResolveIssue[] = [];
  const { preset, theme, presetId, themeId } = resolvePresetAndTheme(
    article,
    registry,
    options,
    issues,
  );

  const overrideByBlockId = new Map(
    (article.styleAssignment.blockOverrides ?? []).map((override) => [
      override.blockId,
      override,
    ]),
  );

  const blocks = article.blocks.map((block) => {
    const context: StyleResolveContext = {
      registry,
      preset,
      theme,
      presetId,
      themeId,
      blockOverride: overrideByBlockId.get(block.id),
      issues,
    };
    return resolveBlockStyle(block, context);
  });

  const result: ResolvedArticleStyle = {
    articleId: article.id,
    schemaVersion: STYLE_SCHEMA_VERSION,
    presetId,
    themeId,
    blocks,
  };

  if (issues.length > 0) {
    result.issues = [...issues];
  }

  return result;
}
