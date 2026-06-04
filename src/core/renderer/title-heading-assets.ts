import type { TitleBlockLayoutMode } from "@/core/styles";
import { HEADING_PUBLISH_VARIANT_IDS } from "@/core/styles/variants/heading-publish-pool";

/** Default VisualAssetRegistry ids per title / heading publish-pool variant. */
export const TITLE_HEADING_ICON_ASSET_BY_VARIANT: Record<string, string> = {
  title_plain_minimal: "icon-star-minimal",
  title_left_bar_classic: "icon-quote-left",
  title_bottom_line_editorial: "icon-star-minimal",
  heading_numbered_section: "icon-section-number",
  heading_card_centered: "icon-section-number",
  heading_short_line: "icon-arrow-right",
  heading_highlight_marker: "icon-arrow-right",
  heading_icon_prefix: "icon-arrow-right",
  heading_minimal_number: "icon-section-number",
  heading_magazine_left_bar: "icon-section-number",
  heading_magazine_offset: "icon-arrow-right",
};

export type TitleHeadingIconGlyph = {
  assetId: string;
  /** Copy-safe single-character or short text glyph */
  glyph: string;
  /** Preview label inside icon capsule */
  capsuleLabel: string;
};

const ICON_GLYPHS: Record<string, TitleHeadingIconGlyph> = {
  "icon-star-minimal": { assetId: "icon-star-minimal", glyph: "✦", capsuleLabel: "✦" },
  "icon-quote-left": { assetId: "icon-quote-left", glyph: "「", capsuleLabel: "引" },
  "icon-arrow-right": { assetId: "icon-arrow-right", glyph: "▸", capsuleLabel: "▸" },
  "icon-bookmark": { assetId: "icon-bookmark", glyph: "◆", capsuleLabel: "签" },
  "icon-section-number": {
    assetId: "icon-section-number",
    glyph: "§",
    capsuleLabel: "节",
  },
  "mark-topic-label": { assetId: "mark-topic-label", glyph: "话", capsuleLabel: "话" },
};

const HEADING_PUBLISH_SET = new Set<string>(HEADING_PUBLISH_VARIANT_IDS);

export function resolveTitleHeadingIconAssetId(
  variantId: string,
  blockType: "title" | "heading",
  layoutMode: TitleBlockLayoutMode,
): string {
  const mapped = TITLE_HEADING_ICON_ASSET_BY_VARIANT[variantId];
  if (mapped) {
    return mapped;
  }
  if (layoutMode === "top_badge") {
    return "mark-topic-label";
  }
  if (blockType === "title") {
    return "icon-star-minimal";
  }
  return "icon-arrow-right";
}

export function resolveTitleHeadingIconGlyph(assetId: string): TitleHeadingIconGlyph {
  return (
    ICON_GLYPHS[assetId] ?? {
      assetId,
      glyph: "•",
      capsuleLabel: "•",
    }
  );
}

export function titleHeadingUsesCardTitleFrame(variantId: string): boolean {
  return variantId === "title_plain_minimal";
}

export function titleHeadingUsesIconDecorLayout(variantId: string): boolean {
  return (
    variantId === "title_left_bar_classic" ||
    variantId === "title_bottom_line_editorial" ||
    variantId === "heading_icon_prefix"
  );
}

export function titleHeadingUsesCornerAccent(variantId: string): boolean {
  return titleHeadingUsesCardTitleFrame(variantId);
}

export function isHeadingPublishVariantId(variantId: string): boolean {
  return HEADING_PUBLISH_SET.has(variantId);
}
