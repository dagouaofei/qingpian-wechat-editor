import { typographyForMiaopianPreset } from "@/config/miaopian-typography";
import type { CopySafety } from "@/core/styles";
import { resolveThemePaletteTokens } from "@/core/styles/theme-palette-tokens";

import type { ResolvedBlockStyleView } from "@/core/renderer/types";

export type TextBlockTypography = {
  color: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  marginBlock: string;
  fontFamily: string;
};

export type TextBlockLayoutKind =
  | "plain"
  | "accent_band"
  | "quote_intro"
  | "accent_left"
  | "soft_card";

import { TEXT_BLOCK_VARIANT_LAYOUT } from "./expansion-layout-maps";

export function resolveTextBlockLayout(variantId: string): TextBlockLayoutKind | undefined {
  return TEXT_BLOCK_VARIANT_LAYOUT[variantId];
}

export function resolveTextBlockTypography(
  resolved: ResolvedBlockStyleView,
  blockType: "lead" | "paragraph",
): TextBlockTypography {
  const palette = resolveThemePaletteTokens(resolved.tokens.theme);
  const variantWeight = resolved.tokens.variant?.["typography.weight"];
  const variantSpacing = resolved.tokens.variant?.["spacing.block"];
  const presetTypography = typographyForMiaopianPreset(resolved.presetId);
  const bodyFontSize = resolved.tokens.theme.fontSize?.body ?? presetTypography.bodyFontSize;

  return {
    color: palette.textDefault,
    fontSize: blockType === "lead" ? "17px" : bodyFontSize,
    fontWeight: variantWeight === "regular" ? "400" : "400",
    lineHeight: blockType === "lead" ? "1.65" : presetTypography.bodyLineHeight,
    marginBlock: variantSpacing ?? (blockType === "lead" ? "20px" : "18px"),
    fontFamily: presetTypography.fontFamily,
  };
}

export function resolveTextBlockCopySafety(
  resolved: ResolvedBlockStyleView,
): CopySafety | undefined {
  return resolved.compatibility?.copySafety ?? resolved.variant.compatibility?.copySafety;
}
