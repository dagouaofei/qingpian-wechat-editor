import type { HighlightBlock } from "@/core/blocks";
import {
  normalizeHighlightContentForRenderer,
  resolveHighlightCopySafety,
  resolveHighlightLayout,
  resolveHighlightTypography,
  type HighlightLayoutKind,
  type NormalizedHighlightContent,
} from "@/core/renderer/highlight-layout";
import type {
  BlockRenderContext,
  HighlightCopyOutput,
  RendererIssue,
} from "@/core/renderer/types";

import { assertCopySafeHtml, escapeHtml } from "./html-escape";
import { wrapInlineElement } from "./inline-style";
import type { ThemePaletteTokens } from "@/core/styles/theme-palette-tokens";
import { resolveThemePaletteTokens } from "@/core/styles/theme-palette-tokens";

function labelHtml(
  label: string | undefined,
  typography: ReturnType<typeof resolveHighlightTypography>,
  palette: ThemePaletteTokens,
): string {
  if (label == null) {
    return "";
  }

  return wrapInlineElement(
    "p",
    {
      margin: "0 0 6px",
      color: palette.textAccent,
      fontSize: typography.labelFontSize,
      lineHeight: typography.lineHeight,
      fontWeight: "600",
      fontFamily: typography.fontFamily,
    },
    escapeHtml(label),
  );
}

function bodyHtml(
  content: NormalizedHighlightContent,
  typography: ReturnType<typeof resolveHighlightTypography>,
  palette: ThemePaletteTokens,
): string {
  return (
    labelHtml(content.label, typography, palette) +
    wrapInlineElement(
      "p",
      {
        margin: "0",
        color: typography.color,
        fontSize: typography.fontSize,
        lineHeight: typography.lineHeight,
        fontFamily: typography.fontFamily,
      },
      escapeHtml(content.text),
    )
  );
}

function wrapHighlightLayoutHtml(
  layout: HighlightLayoutKind,
  content: NormalizedHighlightContent,
  typography: ReturnType<typeof resolveHighlightTypography>,
  palette: ThemePaletteTokens,
): string {
  const innerHtml = bodyHtml(content, typography, palette);

  switch (layout) {
    case "inline_emphasis":
      return wrapInlineElement(
        "section",
        {
          margin: `${typography.marginBlock} 0`,
          paddingLeft: "8px",
          borderLeft: `2px solid ${typography.accentColor}`,
        },
        innerHtml,
      );
    case "accent_band":
      return wrapInlineElement(
        "section",
        {
          margin: `${typography.marginBlock} 0`,
          padding: "10px 14px",
          backgroundColor: palette.bgBandBlue,
          borderLeft: `4px solid ${typography.accentColor}`,
        },
        innerHtml,
      );
    case "soft_card":
      return wrapInlineElement(
        "section",
        {
          margin: `${typography.marginBlock} 0`,
          padding: "12px 16px",
          backgroundColor: palette.bgSoft,
          border: `1px solid ${palette.borderSoft}`,
          borderRadius: "8px",
        },
        innerHtml,
      );
    default:
      throw new Error(`unsupported highlight layout: ${layout satisfies never}`);
  }
}

export function renderHighlightCopyHtml(
  context: BlockRenderContext,
  normalizedContent?: NormalizedHighlightContent,
): { output: HighlightCopyOutput; warnings: RendererIssue[] } {
  const block = context.block as HighlightBlock;
  const layout = resolveHighlightLayout(context.resolvedBlockStyle.variantId);

  if (layout == null) {
    throw new Error(
      `unsupported highlight variant: ${context.resolvedBlockStyle.variantId}`,
    );
  }

  const normalized =
    normalizedContent == null
      ? normalizeHighlightContentForRenderer(
          block,
          context.resolvedBlockStyle.variantId,
        )
      : { content: normalizedContent, issues: [] };

  if (normalized.content == null) {
    throw new Error("highlight copy renderer requires normalized content");
  }

  const typography = resolveHighlightTypography(context.resolvedBlockStyle);
  const palette = resolveThemePaletteTokens(context.resolvedBlockStyle.tokens.theme);
  const html = wrapHighlightLayoutHtml(layout, normalized.content, typography, palette);
  assertHighlightCopySafeCss(html);

  return {
    output: {
      kind: "highlight_copy_html",
      blockId: block.id,
      blockType: "highlight",
      variantId: context.resolvedBlockStyle.variantId,
      layout,
      html,
      copySafety: resolveHighlightCopySafety(context.resolvedBlockStyle),
    },
    warnings: normalized.issues,
  };
}

export function copyHtmlUsesInlineStyleOnly(html: string): boolean {
  assertHighlightCopySafeCss(html);
  return html.includes("style=");
}

export function assertHighlightCopySafeCss(html: string): void {
  assertCopySafeHtml(html);
  if (/var\s*\(/i.test(html)) {
    throw new Error("Highlight copy HTML must not use CSS variables");
  }
  if (/\bposition\s*:\s*absolute/i.test(html)) {
    throw new Error("Highlight copy HTML must not use absolute positioning");
  }
  if (/\btransform\s*:/i.test(html)) {
    throw new Error("Highlight copy HTML must not use transform");
  }
  if (/::/.test(html)) {
    throw new Error("Highlight copy HTML must not use pseudo elements");
  }
}
