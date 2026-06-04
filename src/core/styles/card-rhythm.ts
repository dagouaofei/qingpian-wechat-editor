/**
 * Article card-emphasis rhythm helpers (S7-STORY-006).
 * @see docs/architecture/style-system.md §11.7 R4
 */

import type { Block, BlockType } from "@/core/blocks";

import { getVariantById } from "./registry";
import type { StyleRegistry, VariantDefinition } from "./types";

/** Copy-safe plain variant per block type — used when card stack exceeds limit. */
export const PLAIN_RHYTHM_VARIANT_BY_BLOCK_TYPE: Partial<Record<BlockType, string>> = {
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

const TITLE_HEADING_DECOR_FAMILIES = new Set(["iconDecor", "cardTitle"]);

const CARD_EMPHASIS_BODY_BLOCK_TYPES = new Set<BlockType>([
  "lead",
  "paragraph",
  "quote",
  "highlight",
  "list",
  "info_card",
  "cta",
  "image_placeholder",
]);

const CARD_EMPHASIS_VARIANT_ID_PATTERN =
  /_(?:soft_)?cards?$|_card_promo$|_callout_soft$|_step_cards$|_checklist_cards$/;

const CARD_EMPHASIS_FAMILIES = new Set(["soft_card"]);

export function isTitleHeadingDecorFamily(familyId: string | undefined): boolean {
  return familyId !== undefined && TITLE_HEADING_DECOR_FAMILIES.has(familyId);
}

export function isCardEmphasisVariant(
  blockType: BlockType,
  variant: VariantDefinition | undefined,
): boolean {
  if (!variant) {
    return false;
  }
  if (blockType === "info_card") {
    return true;
  }
  if (!CARD_EMPHASIS_BODY_BLOCK_TYPES.has(blockType)) {
    return false;
  }
  if (CARD_EMPHASIS_FAMILIES.has(variant.family)) {
    return true;
  }
  if (variant.componentProtocol?.layoutMode === "card") {
    return true;
  }
  return CARD_EMPHASIS_VARIANT_ID_PATTERN.test(variant.id);
}

export function isCardEmphasisVariantId(
  registry: StyleRegistry,
  blockType: BlockType,
  variantId: string,
): boolean {
  return isCardEmphasisVariant(blockType, getVariantById(registry, variantId));
}

export function isCardRhythmBodyBlock(block: Block): boolean {
  return CARD_EMPHASIS_BODY_BLOCK_TYPES.has(block.type);
}

export function resolvePlainRhythmVariantId(blockType: BlockType): string | undefined {
  return PLAIN_RHYTHM_VARIANT_BY_BLOCK_TYPE[blockType];
}

/** Non–iconDecor/cardTitle fallback for R4 title/heading rhythm. */
export function resolveTitleHeadingR4FallbackVariantId(
  blockType: "title" | "heading",
): string {
  return blockType === "title"
    ? "title_bottom_line_editorial"
    : "heading_numbered_section";
}
