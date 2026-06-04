/**
 * S8 Fidelity Matrix — test-only style registry.
 * Preset defaults exclude probe variants; fixtures use explicit blockOverrides only.
 */

import {
  CTA_FIRST_WAVE_VARIANTS,
  DIVIDER_EXPANSION_VARIANTS,
  DIVIDER_FIRST_WAVE_VARIANTS,
  HIGHLIGHT_EXPANSION_VARIANTS,
  HIGHLIGHT_FIRST_WAVE_VARIANTS,
  INFO_CARD_EXPANSION_VARIANTS,
  INFO_CARD_FIRST_WAVE_VARIANTS,
  LEAD_FIRST_WAVE_VARIANTS,
  LIST_FIRST_WAVE_VARIANTS,
  PARAGRAPH_EXPANSION_VARIANTS,
  PARAGRAPH_FIRST_WAVE_VARIANTS,
  QUOTE_FIRST_WAVE_VARIANTS,
  STYLE_SCHEMA_VERSION,
  TITLE_BLOCK_FIRST_WAVE_VARIANTS,
  CTA_EXPANSION_VARIANTS,
} from "@/core/styles";

export const S8_FIDELITY_PRESET_ID = "s8_fidelity_matrix_test";

export const S8_FIDELITY_STYLE_REGISTRY = {
  schemaVersion: STYLE_SCHEMA_VERSION,
  themes: [
    {
      id: "businessBlue",
      name: "商务蓝",
      schemaVersion: STYLE_SCHEMA_VERSION,
      tokens: {
        color: { "text.default": "#333333", "brand.primary": "#576b95" },
        fontSize: { body: "16px" },
      },
    },
  ],
  presets: [
    {
      id: S8_FIDELITY_PRESET_ID,
      name: "S8 Fidelity Matrix (test-only)",
      schemaVersion: STYLE_SCHEMA_VERSION,
      themeId: "businessBlue",
      defaultVariantByBlockType: {
        title: "title_plain_minimal",
        heading: "heading_short_line",
        lead: "lead_plain_intro",
        paragraph: "paragraph_plain_body",
        divider: "divider_simple_line",
        list: "list_plain_bullets",
        quote: "quote_plain",
        highlight: "highlight_inline_emphasis",
        info_card: "info_card_key_takeaway",
        cta: "cta_plain_text",
      },
    },
  ],
  variants: [
    ...TITLE_BLOCK_FIRST_WAVE_VARIANTS,
    ...LEAD_FIRST_WAVE_VARIANTS,
    ...PARAGRAPH_FIRST_WAVE_VARIANTS,
    ...PARAGRAPH_EXPANSION_VARIANTS,
    ...DIVIDER_FIRST_WAVE_VARIANTS,
    ...DIVIDER_EXPANSION_VARIANTS,
    ...LIST_FIRST_WAVE_VARIANTS,
    ...QUOTE_FIRST_WAVE_VARIANTS,
    ...HIGHLIGHT_FIRST_WAVE_VARIANTS,
    ...HIGHLIGHT_EXPANSION_VARIANTS,
    ...INFO_CARD_FIRST_WAVE_VARIANTS,
    ...INFO_CARD_EXPANSION_VARIANTS,
    ...CTA_FIRST_WAVE_VARIANTS,
    ...CTA_EXPANSION_VARIANTS,
  ],
} as const;
