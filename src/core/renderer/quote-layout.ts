import type { QuoteBlock } from "@/core/blocks";
import type { CopySafety } from "@/core/styles";
import { resolveThemePaletteTokens } from "@/core/styles/theme-palette-tokens";

import { createRendererIssue } from "./issues";
import type { RendererIssue, ResolvedBlockStyleView } from "./types";

export type QuoteLayoutKind = "plain" | "left_bar" | "card";

export type NormalizedQuoteContent = {
  text: string;
  attribution?: string;
};

export type QuoteTypography = {
  color: string;
  mutedColor: string;
  accentColor: string;
  fontSize: string;
  attributionFontSize: string;
  lineHeight: string;
  marginBlock: string;
};

import { QUOTE_VARIANT_LAYOUT } from "./expansion-layout-maps";

export function resolveQuoteLayout(
  variantId: string,
): QuoteLayoutKind | undefined {
  return QUOTE_VARIANT_LAYOUT[variantId];
}

export function resolveQuoteTypography(
  resolved: ResolvedBlockStyleView,
): QuoteTypography {
  const palette = resolveThemePaletteTokens(resolved.tokens.theme);
  const bodyFontSize = resolved.tokens.theme.fontSize?.body ?? "16px";
  const variantSpacing = resolved.tokens.variant?.["spacing.block"];

  return {
    color: palette.textDefault,
    mutedColor: palette.textMuted,
    accentColor: palette.textAccent,
    fontSize: bodyFontSize,
    attributionFontSize: "14px",
    lineHeight: "1.75",
    marginBlock: variantSpacing ?? "18px",
  };
}

export function resolveQuoteCopySafety(
  resolved: ResolvedBlockStyleView,
): CopySafety | undefined {
  return resolved.compatibility?.copySafety ?? resolved.variant.compatibility?.copySafety;
}

export function normalizeQuoteContentForRenderer(
  block: QuoteBlock,
  variantId: string,
): { content?: NormalizedQuoteContent; issues: RendererIssue[] } {
  const issues: RendererIssue[] = [];
  const rawText = (block.content as { text?: unknown }).text;

  if (typeof rawText !== "string" || rawText.trim() === "") {
    issues.push(
      createRendererIssue({
        code: "invalid_renderer_input",
        message: "quote renderer requires non-empty content.text",
        blockId: block.id,
        blockType: block.type,
        variantId,
        path: ["block", "content", "text"],
      }),
    );
    return { issues };
  }

  const rawAttribution = (block.content as { attribution?: unknown }).attribution;
  let attribution: string | undefined;

  if (rawAttribution == null || rawAttribution === "") {
    issues.push(
      createRendererIssue({
        code: "optional_slot_disabled",
        message: "quote attribution is absent and will not be rendered",
        severity: "info",
        blockId: block.id,
        blockType: block.type,
        variantId,
        slotId: "attribution",
        path: ["block", "content", "attribution"],
      }),
    );
  } else if (typeof rawAttribution === "string") {
    attribution = rawAttribution.trim();
  } else {
    issues.push(
      createRendererIssue({
        code: "invalid_renderer_input",
        message: "quote attribution must be a string when present",
        severity: "warning",
        blockId: block.id,
        blockType: block.type,
        variantId,
        path: ["block", "content", "attribution"],
      }),
    );
  }

  return {
    content: {
      text: rawText.trim(),
      attribution: attribution === "" ? undefined : attribution,
    },
    issues,
  };
}
