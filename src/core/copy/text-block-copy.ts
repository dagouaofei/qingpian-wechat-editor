import type { LeadBlock, ParagraphBlock } from "@/core/blocks";
import { normalizeInlineContent } from "@/core/article";

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

function paragraphShell(
  innerHtml: string,
  typography: TextBlockTypography,
  extra?: Record<string, string>,
): string {
  return wrapInlineElement(
    "p",
    {
      margin: "0",
      color: typography.color,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      lineHeight: typography.lineHeight,
      ...extra,
    },
    innerHtml,
  );
}

function wrapLayoutHtml(
  layout: TextBlockLayoutKind,
  innerHtml: string,
  typography: TextBlockTypography,
  palette: ThemePaletteTokens,
): string {
  const margin = typography.marginBlock;

  switch (layout) {
    case "plain":
      return wrapInlineElement(
        "section",
        { margin: `${margin} 0` },
        paragraphShell(innerHtml, typography),
      );
    case "accent_band":
      return wrapInlineElement(
        "section",
        {
          margin: `${margin} 0`,
          padding: "12px 16px",
          backgroundColor: palette.bgBand,
          borderLeft: `4px solid ${palette.textAccent}`,
        },
        paragraphShell(innerHtml, typography),
      );
    case "quote_intro":
      return wrapInlineElement(
        "section",
        {
          margin: `${margin} 0`,
          paddingLeft: "12px",
          borderLeft: `3px solid ${palette.borderLight}`,
        },
        paragraphShell(innerHtml, typography, { fontStyle: "italic" }),
      );
    case "accent_left":
      return wrapInlineElement(
        "section",
        {
          margin: `${margin} 0`,
          paddingLeft: "12px",
          borderLeft: `3px solid ${palette.textAccent}`,
        },
        paragraphShell(innerHtml, typography),
      );
    case "soft_card":
      return wrapInlineElement(
        "section",
        {
          margin: `${margin} 0`,
          padding: "12px 16px",
          backgroundColor: palette.bgSoft,
          border: `1px solid ${palette.borderSoft}`,
          borderRadius: "8px",
        },
        paragraphShell(innerHtml, typography),
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
