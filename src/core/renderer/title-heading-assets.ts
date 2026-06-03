import type { TitleBlockLayoutMode } from "@/core/styles";

/** Default VisualAssetRegistry ids per first-wave title/heading variant (no new variants). */
export const TITLE_HEADING_ICON_ASSET_BY_VARIANT: Record<string, string> = {
  title_plain_minimal: "icon-star-minimal",
  title_left_bar_classic: "icon-quote-left",
  title_bottom_line_editorial: "icon-star-minimal",
  heading_plain_minimal: "icon-arrow-right",
  heading_numbered_section: "icon-section-number",
  heading_top_badge_topic: "icon-bookmark",
  heading_underline_classic: "icon-arrow-right",
  heading_pill_topic: "mark-topic-label",
  heading_editorial_plain: "icon-section-number",
  heading_keynote_strong: "icon-arrow-right",
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
  return variantId === "title_plain_minimal" || variantId === "heading_top_badge_topic";
}

export function titleHeadingUsesIconDecorLayout(variantId: string): boolean {
  return (
    variantId === "title_left_bar_classic" ||
    variantId === "title_bottom_line_editorial" ||
    variantId === "heading_plain_minimal"
  );
}

export function titleHeadingUsesCornerAccent(variantId: string): boolean {
  return titleHeadingUsesCardTitleFrame(variantId);
}
