import type { BlockType } from "@/core/blocks";

import { HEADING_PUBLISH_VARIANT_IDS } from "@/core/styles/variants/heading-publish-pool";

import type { InputStyleIntent } from "./input";

/**
 * Release 1 copy-safe decorative variants per block type.
 * Order: stronger decoration first; used for article-aware rotation.
 */
/** Decorative rotation — heading uses publish pool only (S7-STORY-008). */
export const ARTICLE_VARIANT_ROTATION: Partial<Record<BlockType, readonly string[]>> = {
  title: ["title_plain_minimal", "title_left_bar_classic", "title_bottom_line_editorial"],
  heading: [...HEADING_PUBLISH_VARIANT_IDS],
  lead: ["lead_plain_intro", "lead_accent_band", "lead_quote_intro"],
  paragraph: ["paragraph_plain_body", "paragraph_accent_left", "paragraph_soft_card"],
  divider: ["divider_simple_line", "divider_dotted_line", "divider_section_space"],
  list: ["list_plain_bullets", "list_numbered_steps", "list_checklist_cards"],
  quote: ["quote_plain", "quote_left_bar", "quote_card"],
  highlight: [
    "highlight_inline_emphasis",
    "highlight_accent_band",
    "highlight_soft_card",
  ],
  info_card: ["info_card_key_takeaway", "info_card_steps", "info_card_warning_note"],
  cta: ["cta_plain_text", "cta_qr_placeholder", "cta_button_like"],
  image_placeholder: [
    "image_placeholder_simple",
    "image_placeholder_caption",
    "image_placeholder_card",
  ],
};

const CARD_PRONE_BLOCK_TYPES = new Set<BlockType>([
  "paragraph",
  "quote",
  "highlight",
  "list",
  "lead",
  "cta",
  "image_placeholder",
]);

const PLAIN_VARIANT_BY_BLOCK_TYPE: Partial<Record<BlockType, string>> = {
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
  image_placeholder: "image_placeholder_simple",
};

const FIRST_BLOCK_DECORATIVE_VARIANT: Partial<Record<BlockType, string>> = {
  title: "title_bottom_line_editorial",
  heading: "heading_magazine_left_bar",
};

export type ArticleVariantPickSource = "style_intent" | "article_diversity" | "preset_default";

export function resolveArticleAwareVariantId(
  blockType: BlockType,
  indexWithinType: number,
  styleIntent?: InputStyleIntent,
): string | undefined {
  const density = styleIntent?.densityHint ?? "medium";

  if (blockType === "heading") {
    const rotation = ARTICLE_VARIANT_ROTATION.heading;
    if (!rotation?.length) {
      return PLAIN_VARIANT_BY_BLOCK_TYPE.heading;
    }
    if (density === "light") {
      return indexWithinType % 2 === 0
        ? "heading_short_line"
        : "heading_minimal_number";
    }
    if (density === "strong") {
      const strongPool = [
        "heading_magazine_left_bar",
        "heading_highlight_marker",
        "heading_magazine_offset",
        "heading_numbered_section",
      ] as const;
      return strongPool[indexWithinType % strongPool.length];
    }
    return rotation[indexWithinType % rotation.length];
  }

  if (density === "light") {
    return PLAIN_VARIANT_BY_BLOCK_TYPE[blockType];
  }

  if (
    density === "strong" &&
    indexWithinType === 0 &&
    FIRST_BLOCK_DECORATIVE_VARIANT[blockType]
  ) {
    return FIRST_BLOCK_DECORATIVE_VARIANT[blockType];
  }

  if (
    density !== "strong" &&
    indexWithinType > 0 &&
    CARD_PRONE_BLOCK_TYPES.has(blockType)
  ) {
    return PLAIN_VARIANT_BY_BLOCK_TYPE[blockType];
  }

  const rotation = ARTICLE_VARIANT_ROTATION[blockType];
  if (!rotation?.length) {
    return PLAIN_VARIANT_BY_BLOCK_TYPE[blockType];
  }

  if (density === "strong") {
    const decorativeOnly = rotation.filter(
      (variantId) => variantId !== PLAIN_VARIANT_BY_BLOCK_TYPE[blockType],
    );
    if (decorativeOnly.length === 0) {
      return rotation[0];
    }
    return decorativeOnly[indexWithinType % decorativeOnly.length];
  }

  return rotation[indexWithinType % rotation.length];
}
