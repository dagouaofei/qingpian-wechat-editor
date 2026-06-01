import type { BlockType } from "@/core/blocks";
import type { Article } from "@/core/article";
import {
  getPresetById,
  getVariantById,
  getVariantsForBlockType,
} from "@/core/styles/registry";
import type {
  PresetDefinition,
  StyleRegistry,
  StyleValidationIssue,
  VariantDefinition,
} from "@/core/styles/types";
import type {
  StyleSelectionBlockStyleHint,
  StyleSelectionRequest,
} from "@/core/styles/style-assignment";

import type { InputStyleIntent } from "./input";

export const SAFE_STYLE_PRESET_ID = "classic-news";
export const SAFE_STYLE_THEME_ID = "default";

const FORBIDDEN_STYLE_FIELDS = ["html", "css", "className", "style"] as const;

const KNOWN_PRESET_HINTS: Record<string, string> = {
  classic: SAFE_STYLE_PRESET_ID,
  "classic-news": SAFE_STYLE_PRESET_ID,
  news: SAFE_STYLE_PRESET_ID,
};

const BLOCK_VARIANT_HEURISTICS: Partial<
  Record<BlockType, Record<string, string>>
> = {
  title: {
    editorial: "title_bottom_line_editorial",
    formal: "title_left_bar_classic",
    default: "title_plain_minimal",
  },
  heading: {
    strong: "heading_numbered_section",
    structured: "heading_top_badge_topic",
    default: "heading_plain_minimal",
  },
  lead: {
    quote: "lead_quote_intro",
    accent: "lead_accent_band",
    default: "lead_plain_intro",
  },
  paragraph: {
    soft: "paragraph_soft_card",
    accent: "paragraph_accent_left",
    default: "paragraph_plain_body",
  },
  list: {
    steps: "list_numbered_steps",
    checklist: "list_checklist_cards",
    default: "list_plain_bullets",
  },
  quote: {
    card: "quote_card",
    bar: "quote_left_bar",
    default: "quote_plain",
  },
  highlight: {
    card: "highlight_soft_card",
    band: "highlight_accent_band",
    default: "highlight_inline_emphasis",
  },
  info_card: {
    steps: "info_card_steps",
    warning: "info_card_warning_note",
    default: "info_card_key_takeaway",
  },
  cta: {
    button: "cta_button_like",
    qr: "cta_qr_placeholder",
    default: "cta_plain_text",
  },
  divider: {
    space: "divider_section_space",
    dot: "divider_dotted_line",
    default: "divider_simple_line",
  },
  image_placeholder: {
    card: "image_placeholder_card",
    caption: "image_placeholder_caption",
    default: "image_placeholder_simple",
  },
};

function pushWarning(
  warnings: StyleValidationIssue[],
  code: string,
  message: string,
  path: string[] = [],
): void {
  warnings.push({ severity: "warning", code, message, path });
}

export function containsForbiddenStyleFields(value: unknown): string | undefined {
  if (value == null || typeof value !== "object") {
    return undefined;
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      const nested = containsForbiddenStyleFields(entry);
      if (nested) {
        return nested;
      }
    }
    return undefined;
  }

  for (const field of FORBIDDEN_STYLE_FIELDS) {
    if (field in (value as Record<string, unknown>)) {
      return field;
    }
  }

  for (const entry of Object.values(value as Record<string, unknown>)) {
    const nested = containsForbiddenStyleFields(entry);
    if (nested) {
      return nested;
    }
  }

  return undefined;
}

export function validateStyleIntentForGeneration(
  styleIntent?: InputStyleIntent,
): StyleValidationIssue[] {
  const issues: StyleValidationIssue[] = [];
  if (!styleIntent) {
    return issues;
  }

  const forbidden = containsForbiddenStyleFields(styleIntent);
  if (forbidden) {
    issues.push({
      severity: "error",
      code: "style_intent_forbidden_field",
      message: `styleIntent must not include forbidden field "${forbidden}"`,
      path: ["styleIntent", forbidden],
    });
  }

  return issues;
}

export function resolvePresetIdFromStyleIntent(
  styleIntent: InputStyleIntent | undefined,
  article: Article,
  warnings: StyleValidationIssue[],
): string {
  const hinted = styleIntent?.presetHint?.trim().toLowerCase();
  if (!hinted) {
    return article.styleAssignment.presetId || SAFE_STYLE_PRESET_ID;
  }

  const mapped = KNOWN_PRESET_HINTS[hinted] ?? hinted;
  if (mapped !== hinted) {
    return mapped;
  }

  pushWarning(
    warnings,
    "style_preset_hint_unknown",
    `Unknown presetHint "${styleIntent?.presetHint}"; using safe preset "${SAFE_STYLE_PRESET_ID}"`,
    ["styleIntent", "presetHint"],
  );
  return SAFE_STYLE_PRESET_ID;
}

function isRelease1RequiredCopySafeVariant(
  variant: VariantDefinition | undefined,
): variant is VariantDefinition {
  if (!variant) {
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

function resolveHeuristicVariantId(
  blockType: BlockType,
  styleIntent: InputStyleIntent | undefined,
): string | undefined {
  const tone = styleIntent?.tone?.trim().toLowerCase() ?? "";
  const density = styleIntent?.densityHint;
  const heuristics = BLOCK_VARIANT_HEURISTICS[blockType];
  if (!heuristics) {
    return undefined;
  }

  if (blockType === "heading" && density === "strong") {
    return heuristics.strong;
  }
  if (blockType === "title" && (tone.includes("editorial") || tone.includes("杂志"))) {
    return heuristics.editorial;
  }
  if (blockType === "title" && (tone.includes("formal") || tone.includes("正式"))) {
    return heuristics.formal;
  }
  if (blockType === "lead" && tone.includes("quote")) {
    return heuristics.quote;
  }
  if (blockType === "paragraph" && (tone.includes("soft") || density === "light")) {
    return heuristics.soft;
  }
  if (blockType === "list" && tone.includes("step")) {
    return heuristics.steps;
  }
  if (blockType === "cta" && tone.includes("button")) {
    return heuristics.button;
  }

  return heuristics.default;
}

function resolvePresetDefaultVariantId(
  preset: PresetDefinition,
  blockType: BlockType,
): string | undefined {
  return preset.defaultVariantByBlockType?.[blockType];
}

export function pickRegisteredVariantForBlock(
  registry: StyleRegistry,
  preset: PresetDefinition,
  blockType: BlockType,
  styleIntent: InputStyleIntent | undefined,
  warnings: StyleValidationIssue[],
): { variantId: string; source: "style_intent" | "preset_default" } {
  const heuristicId = resolveHeuristicVariantId(blockType, styleIntent);
  if (heuristicId) {
    const heuristicVariant = getVariantById(registry, heuristicId);
    if (isRelease1RequiredCopySafeVariant(heuristicVariant)) {
      return { variantId: heuristicVariant.id, source: "style_intent" };
    }
    pushWarning(
      warnings,
      "style_variant_hint_rejected",
      `Heuristic variant "${heuristicId}" is not allowed on Release 1 required path`,
      ["styleIntent"],
    );
  }

  const presetDefaultId = resolvePresetDefaultVariantId(preset, blockType);
  const presetVariant = presetDefaultId
    ? getVariantById(registry, presetDefaultId)
    : undefined;
  if (isRelease1RequiredCopySafeVariant(presetVariant)) {
    return { variantId: presetVariant.id, source: "preset_default" };
  }

  const fallback = getVariantsForBlockType(registry, blockType).find((variant) =>
    isRelease1RequiredCopySafeVariant(variant),
  );
  if (fallback) {
    pushWarning(
      warnings,
      "style_variant_registry_fallback",
      `Using registry fallback variant "${fallback.id}" for block type "${blockType}"`,
      ["blocks"],
    );
    return { variantId: fallback.id, source: "preset_default" };
  }

  throw new Error(`No Release 1 required variant available for block type ${blockType}`);
}

export function buildStyleSelectionBlockHints(
  article: Article,
  registry: StyleRegistry,
  presetId: string,
  styleIntent: InputStyleIntent | undefined,
  warnings: StyleValidationIssue[],
): StyleSelectionBlockStyleHint[] {
  const preset = getPresetById(registry, presetId);
  if (!preset) {
    pushWarning(
      warnings,
      "style_preset_not_found",
      `Preset "${presetId}" not found; using "${SAFE_STYLE_PRESET_ID}"`,
      ["presetId"],
    );
    return buildStyleSelectionBlockHints(
      article,
      registry,
      SAFE_STYLE_PRESET_ID,
      styleIntent,
      warnings,
    );
  }

  return article.blocks.map((block) => {
    const picked = pickRegisteredVariantForBlock(
      registry,
      preset,
      block.type,
      styleIntent,
      warnings,
    );
    return {
      blockId: block.id,
      blockType: block.type,
      suggestedVariantId: picked.variantId,
      reason:
        picked.source === "style_intent"
          ? "Derived from styleIntent heuristics"
          : "Derived from preset default variant",
    };
  });
}

export function buildStyleSelectionRequestFromArticle(
  article: Article,
  registry: StyleRegistry,
  options: {
    styleIntent?: InputStyleIntent;
    timestamp: string;
    modelId?: string;
    source?: "system" | "ai_style_selection";
  },
): { request: StyleSelectionRequest; warnings: StyleValidationIssue[] } {
  const warnings: StyleValidationIssue[] = [];
  const presetId = resolvePresetIdFromStyleIntent(
    options.styleIntent,
    article,
    warnings,
  );

  const headingCount = article.blocks.filter((block) => block.type === "heading").length;

  return {
    request: {
      articleId: article.id,
      preferredPresetId: presetId,
      articleContext: {
        blockCount: article.blocks.length,
        headingCount,
        densityHint: options.styleIntent?.densityHint,
      },
      blockStyleHints: buildStyleSelectionBlockHints(
        article,
        registry,
        presetId,
        options.styleIntent,
        warnings,
      ),
      constraints: {
        mustUseRegisteredVariants: true,
        mustUseRegisteredAssets: true,
        mustPassWeChatCompatibility: true,
        maxDecorationDensity: options.styleIntent?.densityHint,
      },
      meta: {
        source: options.source ?? "ai_style_selection",
        validationStatus: "pending",
        generatedAt: options.timestamp,
        modelId: options.modelId,
      },
    },
    warnings,
  };
}

export function buildStyleSelectionArticleContext(article: Article) {
  return {
    blockCount: article.blocks.length,
    headingCount: article.blocks.filter((block) => block.type === "heading").length,
  };
}
