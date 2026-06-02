import type { ThemeTokens } from "./types";

/** Inline copy / preview palette tokens — aligned with preview-visual-styles PREVIEW_THEME. */
export type ThemePaletteTokens = {
  textDefault: string;
  textMuted: string;
  textAccent: string;
  borderLight: string;
  borderSoft: string;
  bgSoft: string;
  bgBand: string;
  bgBandBlue: string;
  bgSteps: string;
  bgWarning: string;
  warningColor: string;
  warningText: string;
};

export const DEFAULT_THEME_PALETTE: ThemePaletteTokens = {
  textDefault: "#333333",
  textMuted: "#666666",
  textAccent: "#576b95",
  borderLight: "#cccccc",
  borderSoft: "#eeeeee",
  bgSoft: "#f9f9f9",
  bgBand: "#f5f5f5",
  bgBandBlue: "#f5f7fb",
  bgSteps: "#f8fafc",
  bgWarning: "#fff8e6",
  warningColor: "#b36b00",
  warningText: "#5f3b00",
};

function readColor(
  color: ThemeTokens["color"],
  key: string,
  fallback: string,
): string {
  return color?.[key] ?? fallback;
}

export function resolveThemePaletteTokens(theme: ThemeTokens): ThemePaletteTokens {
  const color = theme.color;

  return {
    textDefault: readColor(color, "text.default", DEFAULT_THEME_PALETTE.textDefault),
    textMuted: readColor(color, "text.muted", DEFAULT_THEME_PALETTE.textMuted),
    textAccent:
      readColor(color, "text.accent", "") ||
      readColor(color, "brand.primary", DEFAULT_THEME_PALETTE.textAccent),
    borderLight: readColor(color, "border.light", DEFAULT_THEME_PALETTE.borderLight),
    borderSoft: readColor(color, "border.soft", DEFAULT_THEME_PALETTE.borderSoft),
    bgSoft: readColor(color, "bg.soft", DEFAULT_THEME_PALETTE.bgSoft),
    bgBand: readColor(color, "bg.band", DEFAULT_THEME_PALETTE.bgBand),
    bgBandBlue: readColor(color, "bg.band.blue", DEFAULT_THEME_PALETTE.bgBandBlue),
    bgSteps: readColor(color, "bg.steps", DEFAULT_THEME_PALETTE.bgSteps),
    bgWarning: readColor(color, "bg.warning", DEFAULT_THEME_PALETTE.bgWarning),
    warningColor: readColor(color, "warning.color", DEFAULT_THEME_PALETTE.warningColor),
    warningText: readColor(color, "warning.text", DEFAULT_THEME_PALETTE.warningText),
  };
}
