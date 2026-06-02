import type { CSSProperties } from "react";

import { PREVIEW_THEME } from "@/core/renderer/preview-visual-styles";

export type PreviewColorPaletteId = "default" | "warm";

export type PreviewThemeTokens = {
  [K in keyof typeof PREVIEW_THEME]: string;
};

export type PreviewColorPalette = {
  id: PreviewColorPaletteId;
  label: string;
  themeId: string;
  tokens: PreviewThemeTokens;
};

export const PREVIEW_COLOR_PALETTES: Record<
  PreviewColorPaletteId,
  PreviewColorPalette
> = {
  default: {
    id: "default",
    label: "默认配色",
    themeId: "default",
    tokens: PREVIEW_THEME,
  },
  warm: {
    id: "warm",
    label: "暖色编辑",
    themeId: "warm-editorial",
    tokens: {
      textDefault: "#3d2c1e",
      textMuted: "#7a6555",
      textAccent: "#c45c26",
      borderLight: "#dcc8b8",
      borderSoft: "#f0e4d8",
      bgSoft: "#fffaf5",
      bgBand: "#fff3e8",
      bgBandBlue: "#fff7ed",
      bgSteps: "#fff8f2",
      bgWarning: "#fff4e5",
      warningColor: "#b45309",
      warningText: "#78350f",
    },
  },
};

export const PREVIEW_COLOR_PALETTE_OPTIONS = Object.values(PREVIEW_COLOR_PALETTES);

export function previewPaletteCssVariables(
  paletteId: PreviewColorPaletteId,
): CSSProperties {
  const tokens = PREVIEW_COLOR_PALETTES[paletteId].tokens;
  return {
    ["--preview-text-default" as string]: tokens.textDefault,
    ["--preview-text-muted" as string]: tokens.textMuted,
    ["--preview-text-accent" as string]: tokens.textAccent,
    ["--preview-border-light" as string]: tokens.borderLight,
    ["--preview-border-soft" as string]: tokens.borderSoft,
    ["--preview-bg-soft" as string]: tokens.bgSoft,
    ["--preview-bg-band" as string]: tokens.bgBand,
    ["--preview-bg-band-blue" as string]: tokens.bgBandBlue,
    ["--preview-bg-steps" as string]: tokens.bgSteps,
    ["--preview-bg-warning" as string]: tokens.bgWarning,
    ["--preview-warning-color" as string]: tokens.warningColor,
    ["--preview-warning-text" as string]: tokens.warningText,
  };
}
