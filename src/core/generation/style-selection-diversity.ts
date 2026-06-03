import type { BlockType } from "@/core/blocks";

import type { InputStyleIntent } from "./input";

/**
 * Release 1 copy-safe decorative variants per block type.
 * Order: stronger decoration first; used for article-aware rotation.
 */
export const ARTICLE_VARIANT_ROTATION: Partial<Record<BlockType, readonly string[]>> = {
  title: ["title_bottom_line_editorial", "title_left_bar_classic", "title_plain_minimal"],
  heading: ["heading_top_badge_topic", "heading_numbered_section", "heading_plain_minimal"],
  lead: ["lead_accent_band", "lead_quote_intro", "lead_plain_intro"],
  paragraph: ["paragraph_accent_left", "paragraph_soft_card", "paragraph_plain_body"],
  divider: ["divider_dotted_line", "divider_section_space", "divider_simple_line"],
  list: ["list_checklist_cards", "list_numbered_steps", "list_plain_bullets"],
  quote: ["quote_card", "quote_left_bar", "quote_plain"],
  highlight: ["highlight_accent_band", "highlight_soft_card", "highlight_inline_emphasis"],
  info_card: ["info_card_warning_note", "info_card_steps", "info_card_key_takeaway"],
  cta: ["cta_button_like", "cta_qr_placeholder", "cta_plain_text"],
  image_placeholder: [
    "image_placeholder_card",
    "image_placeholder_caption",
    "image_placeholder_simple",
  ],
};

const PLAIN_VARIANT_BY_BLOCK_TYPE: Partial<Record<BlockType, string>> = {
  title: "title_plain_minimal",
  heading: "heading_plain_minimal",
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
  lead: "lead_accent_band",
};

export type ArticleVariantPickSource = "style_intent" | "article_diversity" | "preset_default";

export function resolveArticleAwareVariantId(
  blockType: BlockType,
  indexWithinType: number,
  styleIntent?: InputStyleIntent,
): string | undefined {
  const density = styleIntent?.densityHint ?? "medium";

  if (blockType === "heading") {
    if (density === "light") {
      return PLAIN_VARIANT_BY_BLOCK_TYPE.heading;
    }
    const rotation = ARTICLE_VARIANT_ROTATION.heading;
    if (!rotation?.length) {
      return PLAIN_VARIANT_BY_BLOCK_TYPE.heading;
    }
    if (density === "strong") {
      const decorative = rotation.filter((id) => id !== "heading_plain_minimal");
      return (decorative[0] ?? rotation[0]) as string;
    }
    return rotation[0];
  }

  if (density === "light") {
    return PLAIN_VARIANT_BY_BLOCK_TYPE[blockType];
  }

  if (indexWithinType === 0 && FIRST_BLOCK_DECORATIVE_VARIANT[blockType]) {
    return FIRST_BLOCK_DECORATIVE_VARIANT[blockType];
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
