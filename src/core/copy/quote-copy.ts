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

import {
  copySafeCardContentStyle,
  copySafeLeftBorderContentStyle,
  mergeInlineStyles,
  wrapCopySafeMarginSection,
} from "./copy-safe-primitives";
import { assertCopySafeHtml, escapeHtml } from "./html-escape";
import { wrapInlineElement } from "./inline-style";
import type { ThemePaletteTokens } from "@/core/styles/theme-palette-tokens";
import { resolveThemePaletteTokens } from "@/core/styles/theme-palette-tokens";

function quoteBase(typography: ReturnType<typeof resolveQuoteTypography>): Record<string, string> {
  return {
    color: typography.color,
    fontSize: typography.fontSize,
    lineHeight: typography.lineHeight,
    fontFamily: typography.fontFamily,
  };
}

function quoteBodyHtml(
  content: NormalizedQuoteContent,
  typography: ReturnType<typeof resolveQuoteTypography>,
): string {
  const body = wrapInlineElement(
    "span",
    { display: "block", margin: "0" },
    escapeHtml(content.text),
  );
  const attribution =
    content.attribution != null
      ? wrapInlineElement(
          "span",
          {
            display: "block",
            margin: "8px 0 0",
            color: typography.mutedColor,
            fontSize: typography.attributionFontSize,
            lineHeight: typography.lineHeight,
            fontFamily: typography.fontFamily,
            textAlign: "right",
          },
          `— ${escapeHtml(content.attribution)}`,
        )
      : "";
  return body + attribution;
}

function wrapQuoteLayoutHtml(
  layout: QuoteLayoutKind,
  content: NormalizedQuoteContent,
  typography: ReturnType<typeof resolveQuoteTypography>,
  palette: ThemePaletteTokens,
): string {
  const margin = `${typography.marginBlock} 0`;
  const base = quoteBase(typography);
  const inner = quoteBodyHtml(content, typography);

  switch (layout) {
    case "plain":
      return wrapCopySafeMarginSection(
        margin,
        wrapInlineElement("p", mergeInlineStyles(base, { margin: "0" }), inner),
      );
    case "left_bar":
      return wrapCopySafeMarginSection(
        margin,
        wrapInlineElement(
          "p",
          copySafeLeftBorderContentStyle(base, `3px solid ${typography.accentColor}`, {
            paddingLeft: "12px",
          }),
          inner,
        ),
      );
    case "card":
      return wrapCopySafeMarginSection(
        margin,
        wrapInlineElement(
          "p",
          copySafeCardContentStyle(base, {
            backgroundColor: palette.bgSoft,
            border: `1px solid ${palette.borderSoft}`,
            padding: "12px 16px",
          }),
          inner,
        ),
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
