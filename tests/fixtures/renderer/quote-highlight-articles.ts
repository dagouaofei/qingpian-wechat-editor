import { parseArticle } from "@/core/article";
import type { HighlightBlockContent, QuoteBlockContent } from "@/core/blocks";
import {
  HIGHLIGHT_FIRST_WAVE_VARIANTS,
  QUOTE_FIRST_WAVE_VARIANTS,
  STYLE_SCHEMA_VERSION,
} from "@/core/styles";

import { articleFixtureBase, fixtureBlockId } from "../articles/shared";

export function createQuoteArticleFixture(options: {
  variantId: string;
  content?: QuoteBlockContent;
}) {
  const blockId = fixtureBlockId(1);

  return parseArticle({
    ...articleFixtureBase(),
    styleAssignment: {
      themeId: "default",
      presetId: "classic-news",
      blockOverrides: [{ blockId, variantId: options.variantId }],
    },
    blocks: [
      {
        id: blockId,
        type: "quote" as const,
        content:
          options.content ?? {
            text: "保持长期主义，才能穿越周期。",
            attribution: "轻篇编辑部",
          },
      },
    ],
  });
}

export function createHighlightArticleFixture(options: {
  variantId: string;
  content?: HighlightBlockContent;
}) {
  const blockId = fixtureBlockId(1);

  return parseArticle({
    ...articleFixtureBase(),
    styleAssignment: {
      themeId: "default",
      presetId: "classic-news",
      blockOverrides: [{ blockId, variantId: options.variantId }],
    },
    blocks: [
      {
        id: blockId,
        type: "highlight" as const,
        content:
          options.content ?? {
            text: "这是本段的核心观点。",
            label: "重点",
          },
      },
    ],
  });
}

export const QUOTE_HIGHLIGHT_VARIANT_REGISTRY = {
  schemaVersion: STYLE_SCHEMA_VERSION,
  themes: [
    {
      id: "default",
      name: "Default Theme",
      schemaVersion: STYLE_SCHEMA_VERSION,
      tokens: {
        color: {
          "text.default": "#333333",
          "text.accent": "#576b95",
        },
        fontSize: { body: "16px" },
      },
    },
  ],
  presets: [
    {
      id: "classic-news",
      name: "Classic News",
      schemaVersion: STYLE_SCHEMA_VERSION,
      themeId: "default",
      defaultVariantByBlockType: {
        quote: "quote_plain",
        highlight: "highlight_inline_emphasis",
      },
    },
  ],
  variants: [...QUOTE_FIRST_WAVE_VARIANTS, ...HIGHLIGHT_FIRST_WAVE_VARIANTS],
};

export const QUOTE_VARIANT_MATRIX = [
  { variantId: "quote_plain", layout: "plain" },
  { variantId: "quote_left_bar", layout: "left_bar" },
  { variantId: "quote_card", layout: "card" },
] as const;

export const HIGHLIGHT_VARIANT_MATRIX = [
  { variantId: "highlight_inline_emphasis", layout: "inline_emphasis" },
  { variantId: "highlight_accent_band", layout: "accent_band" },
  { variantId: "highlight_soft_card", layout: "soft_card" },
] as const;
