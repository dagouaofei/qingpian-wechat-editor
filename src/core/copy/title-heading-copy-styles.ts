/**
 * WeChat paste–safe title/heading inline styles (no gradient / flex / shadow / absolute).
 * S7-STORY-007A — used by title-block-copy only; Preview keeps richer title-heading-visual.
 */

import type { ThemePaletteTokens } from "@/core/styles/theme-palette-tokens";

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
    margin: "28px 0",
    padding: "18px 20px",
    textAlign: "center",
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

export function copySafeAccentBarStyle(palette: ThemePaletteTokens, blockType: "title" | "heading"): Record<string, string> {
  const width = blockType === "title" ? "4px" : "3px";
  return {
    width,
    backgroundColor: palette.textAccent,
  };
}

export function copySafeHighlightMarkerStyle(palette: ThemePaletteTokens): Record<string, string> {
  return {
    display: "inline",
    margin: "0",
    padding: "0 4px 2px",
    backgroundColor: palette.bgSoft,
    borderBottom: `2px solid ${palette.textAccent}`,
  };
}

export function copySafeMagazineOffsetCardStyle(palette: ThemePaletteTokens): Record<string, string> {
  return {
    marginRight: "20px",
    marginBottom: "2px",
    padding: "14px 18px",
    backgroundColor: palette.bgSoft,
    border: `1px solid ${palette.borderSoft}`,
    borderLeft: `4px solid ${palette.textAccent}`,
    borderRadius: "8px",
  };
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
