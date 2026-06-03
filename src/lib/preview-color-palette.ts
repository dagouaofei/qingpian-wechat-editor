import type { CSSProperties } from "react";

import {
  DEFAULT_THEME_FOR_PRESET,
  LEGACY_PALETTE_ID_ALIASES,
  type MiaopianPresetId,
  type MiaopianThemeId,
} from "@/config/miaopian-preset-bundles";
import { PREVIEW_THEME } from "@/core/renderer/preview-visual-styles";

export type PreviewColorPaletteId = MiaopianThemeId;

export type PreviewThemeTokens = {
  [K in keyof typeof PREVIEW_THEME]: string;
};

export type PreviewColorPalette = {
  id: PreviewColorPaletteId;
  label: string;
  themeId: string;
  tokens: PreviewThemeTokens;
};

function tokensFromTheme(colors: {
  textPrimary: string;
  textSecondary: string;
  accent: string;
  border: string;
  cardBackground: string;
  background: string;
  warningText?: string;
}): PreviewThemeTokens {
  return {
    textDefault: colors.textPrimary,
    textMuted: colors.textSecondary,
    textAccent: colors.accent,
    borderLight: colors.border,
    borderSoft: colors.border,
    bgSoft: colors.cardBackground,
    bgBand: colors.cardBackground,
    bgBandBlue: colors.background,
    bgSteps: colors.background,
    bgWarning: "#fff8e6",
    warningColor: "#b36b00",
    warningText: colors.warningText ?? "#5f3b00",
  };
}

export const PREVIEW_COLOR_PALETTES: Record<
  PreviewColorPaletteId,
  PreviewColorPalette
> = {
  businessBlue: {
    id: "businessBlue",
    label: "商务蓝",
    themeId: "businessBlue",
    tokens: tokensFromTheme({
      textPrimary: "#0f172a",
      textSecondary: "#64748b",
      accent: "#2563eb",
      border: "#e2e8f0",
      cardBackground: "#f1f5f9",
      background: "#ffffff",
    }),
  },
  premiumBlackGold: {
    id: "premiumBlackGold",
    label: "高级黑金",
    themeId: "premiumBlackGold",
    tokens: tokensFromTheme({
      textPrimary: "#1c1917",
      textSecondary: "#78716c",
      accent: "#eab308",
      border: "#e7e5e4",
      cardBackground: "#f5f5f4",
      background: "#fafaf9",
    }),
  },
  creamOrange: {
    id: "creamOrange",
    label: "奶油橙",
    themeId: "creamOrange",
    tokens: tokensFromTheme({
      textPrimary: "#292524",
      textSecondary: "#78716c",
      accent: "#ea580c",
      border: "#fed7aa",
      cardBackground: "#fff7ed",
      background: "#fffdfb",
    }),
  },
  techGrayBlue: {
    id: "techGrayBlue",
    label: "科技灰蓝",
    themeId: "techGrayBlue",
    tokens: tokensFromTheme({
      textPrimary: "#0f172a",
      textSecondary: "#64748b",
      accent: "#0ea5e9",
      border: "#cbd5e1",
      cardBackground: "#f1f5f9",
      background: "#f8fafc",
    }),
  },
  knowledgePurple: {
    id: "knowledgePurple",
    label: "知识紫",
    themeId: "knowledgePurple",
    tokens: tokensFromTheme({
      textPrimary: "#1e1b4b",
      textSecondary: "#6b21a8",
      accent: "#7c3aed",
      border: "#e9d5ff",
      cardBackground: "#f3e8ff",
      background: "#faf5ff",
    }),
  },
  healthGreen: {
    id: "healthGreen",
    label: "健康绿",
    themeId: "healthGreen",
    tokens: tokensFromTheme({
      textPrimary: "#14532d",
      textSecondary: "#3f6212",
      accent: "#22c55e",
      border: "#bbf7d0",
      cardBackground: "#ecfdf5",
      background: "#f7fef9",
    }),
  },
};

export const PREVIEW_COLOR_PALETTE_OPTIONS = Object.values(PREVIEW_COLOR_PALETTES);

export function resolvePreviewColorPaletteId(
  paletteOrLegacy: string | undefined,
  presetId?: MiaopianPresetId,
): PreviewColorPaletteId {
  if (
    paletteOrLegacy &&
    paletteOrLegacy in PREVIEW_COLOR_PALETTES
  ) {
    return paletteOrLegacy as PreviewColorPaletteId;
  }
  if (paletteOrLegacy && LEGACY_PALETTE_ID_ALIASES[paletteOrLegacy]) {
    return LEGACY_PALETTE_ID_ALIASES[paletteOrLegacy];
  }
  if (presetId) {
    return DEFAULT_THEME_FOR_PRESET[presetId];
  }
  return "businessBlue";
}

export function defaultPaletteForPreset(presetId: MiaopianPresetId): PreviewColorPaletteId {
  return DEFAULT_THEME_FOR_PRESET[presetId];
}

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
