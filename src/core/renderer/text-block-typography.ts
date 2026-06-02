import type { CopySafety } from "@/core/styles";
import { resolveThemePaletteTokens } from "@/core/styles/theme-palette-tokens";

import type { ResolvedBlockStyleView } from "@/core/renderer/types";

export type TextBlockTypography = {
  color: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  marginBlock: string;
};

export type TextBlockLayoutKind =
  | "plain"
  | "accent_band"
  | "quote_intro"
  | "accent_left"
  | "soft_card";

const VARIANT_LAYOUT_MAP: Record<string, TextBlockLayoutKind> = {
  lead_plain_intro: "plain",
  lead_accent_band: "accent_band",
  lead_quote_intro: "quote_intro",
  paragraph_plain_body: "plain",
  paragraph_accent_left: "accent_left",
  paragraph_soft_card: "soft_card",
};

export function resolveTextBlockLayout(variantId: string): TextBlockLayoutKind | undefined {
  return VARIANT_LAYOUT_MAP[variantId];
}

export function resolveTextBlockTypography(
  resolved: ResolvedBlockStyleView,
  blockType: "lead" | "paragraph",
): TextBlockTypography {
  const palette = resolveThemePaletteTokens(resolved.tokens.theme);
  const variantWeight = resolved.tokens.variant?.["typography.weight"];
  const variantSpacing = resolved.tokens.variant?.["spacing.block"];
  const bodyFontSize = resolved.tokens.theme.fontSize?.body ?? "16px";

  return {
    color: palette.textDefault,
    fontSize: blockType === "lead" ? "17px" : bodyFontSize,
    fontWeight: variantWeight === "regular" ? "400" : "400",
    lineHeight: blockType === "lead" ? "1.6" : "1.75",
    marginBlock: variantSpacing ?? (blockType === "lead" ? "18px" : "16px"),
  };
}

export function resolveTextBlockCopySafety(
  resolved: ResolvedBlockStyleView,
): CopySafety | undefined {
  return resolved.compatibility?.copySafety ?? resolved.variant.compatibility?.copySafety;
}
