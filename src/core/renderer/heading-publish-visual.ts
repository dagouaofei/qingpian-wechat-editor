/**
 * Heading publish pool — Preview re-exports decoration tokens (same as Copy).
 * @see docs/product/heading-publish-catalog.md
 */

import type { CSSProperties } from "react";

import type { ThemePaletteTokens } from "@/core/styles/theme-palette-tokens";

import {
  copySafeHeadingOrdinalStyle,
  copySafeHeadingSectionKickerStyle,
  copySafeHeadingSectionStyle,
  copySafeCardCenteredFrameStyle,
  copySafeCardCenteredIndexStyle,
  copySafeHighlightMarkerBandCellStyle,
  copySafeHighlightMarkerTableStyle,
  copySafeHighlightMarkerTextCellStyle,
  copySafeInlineIconTextRowStyle,
  copySafeIconPrefixGlyphStyle,
  copySafeMagazineLeftBarAccentRailStyle,
  copySafeMagazineLeftBarLightRailStyle,
  copySafeMagazineOffsetSectionStyle,
  copySafeNumberedSectionBadgeStyle,
  copySafeShortLineUnderlineStyle,
  copySafeShortLineWrapStyle,
  copySafeTopicPillStyle,
} from "./heading-publish-decoration";

import { HEADING_PUBLISH_VARIANT_IDS } from "@/core/styles/variants/heading-publish-pool";

export { HEADING_PUBLISH_VARIANT_IDS };

export const HEADING_PUBLISH_LABELS: Record<
  (typeof HEADING_PUBLISH_VARIANT_IDS)[number],
  string
> = {
  heading_short_line: "短线标题",
  heading_highlight_marker: "荧光笔强调",
  heading_icon_prefix: "图标前缀",
  heading_minimal_number: "极简数字",
  heading_magazine_left_bar: "杂志竖线",
  heading_magazine_offset: "杂志错位",
  heading_numbered_section: "编号小节",
  heading_card_centered: "卡片居中",
};

export function headingPublishTypographyStyle(): CSSProperties {
  return {
    fontSize: "17px",
    fontWeight: "600",
    lineHeight: "1.45",
    letterSpacing: "0.01em",
  };
}

export function headingPublishContainerStyle(): CSSProperties {
  return copySafeHeadingSectionStyle() as CSSProperties;
}

export function headingPreviewHighlightMarkerTableStyle(): CSSProperties {
  return copySafeHighlightMarkerTableStyle() as CSSProperties;
}

export function headingPreviewHighlightMarkerTextCellStyle(
  palette: ThemePaletteTokens,
  typography?: {
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    fontFamily?: string;
    color?: string;
  },
): CSSProperties {
  return copySafeHighlightMarkerTextCellStyle(palette, typography) as CSSProperties;
}

export function headingPreviewHighlightMarkerBandCellStyle(
  palette: ThemePaletteTokens,
): CSSProperties {
  return copySafeHighlightMarkerBandCellStyle(palette) as CSSProperties;
}

/** @deprecated */
export const headingPreviewHighlightMarkerMarkedStyle =
  headingPreviewHighlightMarkerTextCellStyle;
export const headingPreviewHighlightMarkerTextStyle =
  headingPreviewHighlightMarkerTextCellStyle;
export const headingPreviewHighlightMarkerBarStyle =
  headingPreviewHighlightMarkerBandCellStyle;

export function headingPreviewCardCenteredFrameStyle(
  palette: ThemePaletteTokens,
): CSSProperties {
  return copySafeCardCenteredFrameStyle(palette) as CSSProperties;
}

export function headingPreviewCardCenteredIndexStyle(
  palette: ThemePaletteTokens,
): CSSProperties {
  return copySafeCardCenteredIndexStyle(palette) as CSSProperties;
}

export function headingPreviewShortLineWrapStyle(): CSSProperties {
  return copySafeShortLineWrapStyle() as CSSProperties;
}

export function headingPreviewShortLineUnderlineStyle(
  palette: ThemePaletteTokens,
): CSSProperties {
  return copySafeShortLineUnderlineStyle(palette) as CSSProperties;
}

export function headingPreviewMagazineOffsetSectionStyle(
  palette: ThemePaletteTokens,
): CSSProperties {
  return copySafeMagazineOffsetSectionStyle(palette) as CSSProperties;
}

export function headingPreviewMagazineLeftBarLightRailStyle(
  palette: ThemePaletteTokens,
): CSSProperties {
  return copySafeMagazineLeftBarLightRailStyle(palette) as CSSProperties;
}

export function headingPreviewMagazineLeftBarAccentRailStyle(
  palette: ThemePaletteTokens,
): CSSProperties {
  return copySafeMagazineLeftBarAccentRailStyle(palette) as CSSProperties;
}

export function headingPreviewIconPrefixGlyphStyle(
  palette: ThemePaletteTokens,
): CSSProperties {
  return copySafeIconPrefixGlyphStyle(palette) as CSSProperties;
}

export function headingPreviewNumberedSectionBadgeStyle(
  palette: ThemePaletteTokens,
): CSSProperties {
  return copySafeNumberedSectionBadgeStyle(palette) as CSSProperties;
}

export function headingPreviewOrdinalStyle(
  palette: ThemePaletteTokens,
): CSSProperties {
  return copySafeHeadingOrdinalStyle(palette) as CSSProperties;
}

export function headingPreviewSectionKickerStyle(
  palette: ThemePaletteTokens,
): CSSProperties {
  return copySafeHeadingSectionKickerStyle(palette) as CSSProperties;
}

/** 非 publish 池 top_badge 等仍使用 */
export function headingPreviewTopicPillStyle(
  palette: ThemePaletteTokens,
): CSSProperties {
  return copySafeTopicPillStyle(palette) as CSSProperties;
}

export function headingPublishTextStyle(typography: {
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  fontFamily?: string;
  color?: string;
}): CSSProperties {
  return {
    ...headingPublishTypographyStyle(),
    margin: 0,
    padding: 0,
    color: typography.color ?? "#333333",
    fontSize: typography.fontSize ?? "17px",
    fontWeight: typography.fontWeight ?? "600",
    lineHeight: typography.lineHeight ?? "1.45",
    fontFamily: typography.fontFamily,
  };
}
