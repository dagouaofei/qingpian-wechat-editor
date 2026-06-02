import type { QuoteBlock } from "@/core/blocks";
import {
  normalizeQuoteContentForRenderer,
  resolveQuoteCopySafety,
  resolveQuoteLayout,
  resolveQuoteTypography,
  type NormalizedQuoteContent,
  type QuoteLayoutKind,
} from "@/core/renderer/quote-layout";
import type {
  BlockRenderContext,
  QuoteCopyOutput,
  RendererIssue,
} from "@/core/renderer/types";

import { assertCopySafeHtml, escapeHtml } from "./html-escape";
import { wrapInlineElement } from "./inline-style";
import type { ThemePaletteTokens } from "@/core/styles/theme-palette-tokens";
import { resolveThemePaletteTokens } from "@/core/styles/theme-palette-tokens";

function attributionHtml(
  attribution: string | undefined,
  typography: ReturnType<typeof resolveQuoteTypography>,
): string {
  if (attribution == null) {
    return "";
  }

  return wrapInlineElement(
    "p",
    {
      margin: "8px 0 0",
      color: typography.mutedColor,
      fontSize: "14px",
      lineHeight: "1.6",
      textAlign: "right",
    },
    `— ${escapeHtml(attribution)}`,
  );
}

function quoteBodyHtml(
  content: NormalizedQuoteContent,
  typography: ReturnType<typeof resolveQuoteTypography>,
): string {
  return (
    wrapInlineElement(
      "p",
      {
        margin: "0",
        color: typography.color,
        fontSize: typography.fontSize,
        lineHeight: typography.lineHeight,
      },
      escapeHtml(content.text),
    ) + attributionHtml(content.attribution, typography)
  );
}

function wrapQuoteLayoutHtml(
  layout: QuoteLayoutKind,
  content: NormalizedQuoteContent,
  typography: ReturnType<typeof resolveQuoteTypography>,
  palette: ThemePaletteTokens,
): string {
  const bodyHtml = quoteBodyHtml(content, typography);

  switch (layout) {
    case "plain":
      return wrapInlineElement(
        "section",
        { margin: `${typography.marginBlock} 0` },
        bodyHtml,
      );
    case "left_bar":
      return wrapInlineElement(
        "section",
        {
          margin: `${typography.marginBlock} 0`,
          paddingLeft: "12px",
          borderLeft: `3px solid ${typography.accentColor}`,
        },
        bodyHtml,
      );
    case "card":
      return wrapInlineElement(
        "section",
        {
          margin: `${typography.marginBlock} 0`,
          padding: "12px 16px",
          backgroundColor: palette.bgSoft,
          border: `1px solid ${palette.borderSoft}`,
          borderRadius: "8px",
        },
        bodyHtml,
      );
    default:
      throw new Error(`unsupported quote layout: ${layout satisfies never}`);
  }
}

export function renderQuoteCopyHtml(
  context: BlockRenderContext,
  normalizedContent?: NormalizedQuoteContent,
): { output: QuoteCopyOutput; warnings: RendererIssue[] } {
  const block = context.block as QuoteBlock;
  const layout = resolveQuoteLayout(context.resolvedBlockStyle.variantId);

  if (layout == null) {
    throw new Error(`unsupported quote variant: ${context.resolvedBlockStyle.variantId}`);
  }

  const normalized =
    normalizedContent == null
      ? normalizeQuoteContentForRenderer(block, context.resolvedBlockStyle.variantId)
      : { content: normalizedContent, issues: [] };

  if (normalized.content == null) {
    throw new Error("quote copy renderer requires normalized content");
  }

  const typography = resolveQuoteTypography(context.resolvedBlockStyle);
  const palette = resolveThemePaletteTokens(context.resolvedBlockStyle.tokens.theme);
  const html = wrapQuoteLayoutHtml(layout, normalized.content, typography, palette);
  assertQuoteCopySafeCss(html);

  return {
    output: {
      kind: "quote_copy_html",
      blockId: block.id,
      blockType: "quote",
      variantId: context.resolvedBlockStyle.variantId,
      layout,
      html,
      copySafety: resolveQuoteCopySafety(context.resolvedBlockStyle),
    },
    warnings: normalized.issues,
  };
}

export function copyHtmlUsesInlineStyleOnly(html: string): boolean {
  assertQuoteCopySafeCss(html);
  return html.includes("style=");
}

export function assertQuoteCopySafeCss(html: string): void {
  assertCopySafeHtml(html);
  if (/var\s*\(/i.test(html)) {
    throw new Error("Quote copy HTML must not use CSS variables");
  }
  if (/\bposition\s*:\s*absolute/i.test(html)) {
    throw new Error("Quote copy HTML must not use absolute positioning");
  }
  if (/\btransform\s*:/i.test(html)) {
    throw new Error("Quote copy HTML must not use transform");
  }
  if (/::/.test(html)) {
    throw new Error("Quote copy HTML must not use pseudo elements");
  }
}
