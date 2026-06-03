/**
 * WeChat paste–safe title/heading inline styles (no gradient / flex / shadow / absolute).
 * Heading publish pool tokens: `heading-publish-decoration.ts`（Preview/Copy 同源）。
 */

import type { ThemePaletteTokens } from "@/core/styles/theme-palette-tokens";
import {
  copySafeHighlightMarkerMarkedStyle,
  copySafeMagazineOffsetSectionStyle,
} from "@/core/renderer/heading-publish-decoration";

export {
  copySafeHeadingOrdinalStyle,
  copySafeHeadingSectionKickerStyle,
  copySafeHeadingSectionStyle,
  copySafeHighlightMarkerMarkedStyle,
  copySafeHighlightMarkerTextStyle,
  copySafeHighlightMarkerWrapStyle,
  copySafeInlineIconTextRowStyle,
  copySafeIconPrefixGlyphStyle,
  copySafeMagazineLeftBarAccentRailStyle,
  copySafeMagazineLeftBarLightRailStyle,
  copySafeMagazineOffsetSectionStyle,
  copySafeShortLineWrapStyle,
  copySafeNumberedSectionBadgeStyle,
  copySafeShortLineUnderlineStyle,
  copySafeTopicPillStyle,
} from "@/core/renderer/heading-publish-decoration";

/** @deprecated Use copySafeIconPrefixGlyphStyle for heading publish pool */
export function copySafeIconPrefixInlineStyle(palette: ThemePaletteTokens): Record<string, string> {
  return {
    display: "inline-block",
    margin: "0 10px 0 0",
    padding: "0",
    fontSize: "20px",
    fontWeight: "700",
    lineHeight: "1",
    color: palette.textAccent,
    verticalAlign: "middle",
    backgroundColor: "transparent",
    border: "none",
  };
}

export function copySafeIconPrefixWrapStyle(palette: ThemePaletteTokens): Record<string, string> {
  return {
    paddingLeft: "12px",
    borderLeft: `3px solid ${palette.textAccent}`,
  };
}

export function copySafeMinimalNumberLabelStyle(palette: ThemePaletteTokens): Record<string, string> {
  return {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: "600",
    color: palette.textMuted,
    letterSpacing: "0.08em",
    minWidth: "26px",
    textAlign: "right",
    verticalAlign: "top",
    paddingTop: "2px",
    marginRight: "10px",
  };
}

export function copySafeIconCapsuleStyle(palette: ThemePaletteTokens): Record<string, string> {
  return {
    display: "inline-block",
    width: "32px",
    height: "32px",
    lineHeight: "32px",
    textAlign: "center",
    borderRadius: "8px",
    backgroundColor: palette.bgSoft,
    border: `1px solid ${palette.borderSoft}`,
    color: palette.textAccent,
    fontSize: "15px",
    fontWeight: "700",
  };
}

export function copySafeCardTitleFrameStyle(palette: ThemePaletteTokens): Record<string, string> {
  return {
    margin: "28px 0 12px",
    padding: "14px 16px",
    textAlign: "left",
    borderRadius: "8px",
    border: `1px solid ${palette.borderSoft}`,
    backgroundColor: palette.bgSoft,
  };
}

export function copySafeNumberBadgeStyle(palette: ThemePaletteTokens): Record<string, string> {
  return {
    display: "inline-block",
    width: "36px",
    height: "36px",
    lineHeight: "36px",
    textAlign: "center",
    borderRadius: "50%",
    backgroundColor: palette.bgBandBlue,
    border: `1px solid ${palette.borderSoft}`,
    color: palette.textAccent,
    fontSize: "14px",
    fontWeight: "700",
  };
}

export function copySafeAccentBarStyle(
  palette: ThemePaletteTokens,
  blockType: "title" | "heading",
): Record<string, string> {
  const width = blockType === "title" ? "4px" : "3px";
  return {
    width,
    backgroundColor: palette.textAccent,
  };
}

export function copySafeHighlightMarkerStyle(palette: ThemePaletteTokens): Record<string, string> {
  return copySafeHighlightMarkerMarkedStyle(palette);
}

export function copySafeMagazineOffsetCardStyle(palette: ThemePaletteTokens): Record<string, string> {
  return copySafeMagazineOffsetSectionStyle(palette);
}

export function copySafeEditorialLineTableStyle(): Record<string, string> {
  return {
    width: "280px",
    maxWidth: "100%",
    margin: "10px auto 0",
    borderCollapse: "collapse",
  };
}

export function copySafeEditorialLineCellStyle(palette: ThemePaletteTokens): Record<string, string> {
  return {
    height: "2px",
    backgroundColor: palette.textAccent,
  };
}
