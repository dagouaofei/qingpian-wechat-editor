import type { LeadBlock, ParagraphBlock } from "@/core/blocks";
import { normalizeInlineContent } from "@/core/article";

import {
  copySafeCardContentStyle,
  copySafeLeftBorderContentStyle,
  mergeInlineStyles,
  wrapCopySafeMarginSection,
} from "./copy-safe-primitives";
import { assertCopySafeHtml } from "./html-escape";
import { renderInlineContentToCopyHtml } from "./inline-content-html";
import { wrapInlineElement } from "./inline-style";
import type { RendererIssue, TextBlockCopyOutput } from "@/core/renderer/types";
import type {
  TextBlockLayoutKind,
  TextBlockTypography,
} from "@/core/renderer/text-block-typography";
import type { BlockRenderContext } from "@/core/renderer/types";
import {
  resolveTextBlockCopySafety,
  resolveTextBlockLayout,
  resolveTextBlockTypography,
} from "@/core/renderer/text-block-typography";
import type { ThemePaletteTokens } from "@/core/styles/theme-palette-tokens";
import { resolveThemePaletteTokens } from "@/core/styles/theme-palette-tokens";

function paragraphBaseStyle(typography: TextBlockTypography): Record<string, string> {
  return {
    color: typography.color,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    lineHeight: typography.lineHeight,
    fontFamily: typography.fontFamily,
  };
}

function wrapLayoutHtml(
  layout: TextBlockLayoutKind,
  innerHtml: string,
  typography: TextBlockTypography,
  palette: ThemePaletteTokens,
): string {
  const margin = `${typography.marginBlock} 0`;
  const base = paragraphBaseStyle(typography);

  switch (layout) {
    case "plain":
      return wrapCopySafeMarginSection(
        margin,
        wrapInlineElement("p", mergeInlineStyles(base, { margin: "0" }), innerHtml),
      );
    case "accent_band":
      return wrapCopySafeMarginSection(
        margin,
        wrapInlineElement(
          "p",
          copySafeLeftBorderContentStyle(base, `4px solid ${palette.textAccent}`, {
            paddingLeft: "12px",
            padding: "12px 16px",
            backgroundColor: palette.bgBand,
          }),
          innerHtml,
        ),
      );
    case "quote_intro":
      return wrapCopySafeMarginSection(
        margin,
        wrapInlineElement(
          "p",
          mergeInlineStyles(
            copySafeLeftBorderContentStyle(base, `3px solid ${palette.borderLight}`, {
              paddingLeft: "12px",
            }),
            { fontStyle: "italic" },
          ),
          innerHtml,
        ),
      );
    case "accent_left":
      return wrapCopySafeMarginSection(
        margin,
        wrapInlineElement(
          "p",
          copySafeLeftBorderContentStyle(base, `3px solid ${palette.textAccent}`, {
            paddingLeft: "12px",
          }),
          innerHtml,
        ),
      );
    case "soft_card":
      return wrapCopySafeMarginSection(
        margin,
        wrapInlineElement(
          "p",
          copySafeCardContentStyle(base, {
            backgroundColor: palette.bgSoft,
            border: `1px solid ${palette.borderSoft}`,
            padding: "12px 16px",
          }),
          innerHtml,
        ),
      );
    default:
      throw new Error(`unsupported text block layout: ${layout satisfies never}`);
  }
}

export function renderTextBlockCopyHtml(
  context: BlockRenderContext,
): { output: TextBlockCopyOutput; warnings: RendererIssue[] } {
  const block = context.block as LeadBlock | ParagraphBlock;
  const layout = resolveTextBlockLayout(context.resolvedBlockStyle.variantId);

  if (layout == null) {
    throw new Error(`unsupported text block variant: ${context.resolvedBlockStyle.variantId}`);
  }

  const typography = resolveTextBlockTypography(
    context.resolvedBlockStyle,
    block.type,
  );
  const palette = resolveThemePaletteTokens(context.resolvedBlockStyle.tokens.theme);
  const inlineContent = normalizeInlineContent(block.content.text);
  const { html: inlineHtml, warnings } = renderInlineContentToCopyHtml({
    content: inlineContent,
    themeTokens: context.resolvedBlockStyle.tokens.theme,
    defaultColor: typography.color,
    blockId: block.id,
    blockType: block.type,
    variantId: context.resolvedBlockStyle.variantId,
  });

  const html = wrapLayoutHtml(layout, inlineHtml, typography, palette);
  assertCopySafeHtml(html);

  return {
    output: {
      kind: "text_block_copy_html",
      blockId: block.id,
      blockType: block.type,
      variantId: context.resolvedBlockStyle.variantId,
      layout,
      html,
      copySafety: resolveTextBlockCopySafety(context.resolvedBlockStyle),
    },
    warnings,
  };
}

export function copyHtmlUsesInlineStyleOnly(html: string): boolean {
  assertCopySafeHtml(html);
  return html.includes("style=");
}
