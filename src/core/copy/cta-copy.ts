import type { CtaBlock } from "@/core/blocks";
import {
  normalizeCtaContentForRenderer,
  resolveCtaCopySafety,
  resolveCtaLayout,
  resolveCtaTypography,
  type CtaLayoutKind,
  type NormalizedCtaContent,
} from "@/core/renderer/cta-layout";
import type { BlockRenderContext, CtaCopyOutput, RendererIssue } from "@/core/renderer/types";

import { assertCopySafeHtml, escapeHtml } from "./html-escape";
import { wrapInlineElement } from "./inline-style";
import type { ThemePaletteTokens } from "@/core/styles/theme-palette-tokens";
import { resolveThemePaletteTokens } from "@/core/styles/theme-palette-tokens";

function actionHtml(
  action: string | undefined,
  typography: ReturnType<typeof resolveCtaTypography>,
): string {
  if (action == null) {
    return "";
  }

  return wrapInlineElement(
    "p",
    {
      margin: "8px 0 0",
      color: typography.accentColor,
      fontSize: typography.actionFontSize,
      lineHeight: "1.6",
      fontWeight: "600",
    },
    escapeHtml(action),
  );
}

function ctaTextHtml(
  text: string,
  typography: ReturnType<typeof resolveCtaTypography>,
): string {
  return wrapInlineElement(
    "p",
    {
      margin: "0",
      color: typography.color,
      fontSize: typography.fontSize,
      lineHeight: typography.lineHeight,
    },
    escapeHtml(text),
  );
}

function qrPlaceholderHtml(
  content: NormalizedCtaContent,
  typography: ReturnType<typeof resolveCtaTypography>,
  palette: ThemePaletteTokens,
): string {
  return wrapInlineElement(
    "section",
    {
      margin: "10px 0 0",
      padding: "12px",
      border: `1px dashed ${palette.borderLight}`,
      backgroundColor: palette.bgSoft,
      color: typography.mutedColor,
      fontSize: "14px",
      lineHeight: "1.6",
      textAlign: "center",
    },
    escapeHtml(content.placeholderLabel),
  );
}

function wrapCtaLayoutHtml(
  layout: CtaLayoutKind,
  content: NormalizedCtaContent,
  typography: ReturnType<typeof resolveCtaTypography>,
  palette: ThemePaletteTokens,
): string {
  switch (layout) {
    case "plain_text":
      return wrapInlineElement(
        "section",
        { margin: `${typography.marginBlock} 0` },
        ctaTextHtml(content.text, typography) +
          actionHtml(content.action, typography),
      );
    case "button_like":
      return wrapInlineElement(
        "section",
        {
          margin: `${typography.marginBlock} 0`,
          padding: "12px 16px",
          border: `1px solid ${typography.accentColor}`,
          borderRadius: "8px",
          backgroundColor: palette.bgSoft,
        },
        ctaTextHtml(content.text, typography) +
          wrapInlineElement(
            "p",
            {
              margin: "10px 0 0",
              padding: "6px 12px",
              color: typography.accentColor,
              fontSize: typography.actionFontSize,
              lineHeight: "1.5",
              fontWeight: "600",
              textAlign: "center",
              border: `1px solid ${typography.accentColor}`,
              borderRadius: "16px",
            },
            escapeHtml(content.action ?? "Action placeholder (not clickable)"),
          ),
      );
    case "qr_placeholder":
      return wrapInlineElement(
        "section",
        {
          margin: `${typography.marginBlock} 0`,
          padding: "12px 16px",
          border: `1px solid ${palette.borderSoft}`,
          borderRadius: "8px",
          backgroundColor: palette.bgSoft,
        },
        ctaTextHtml(content.text, typography) +
          actionHtml(content.action, typography) +
          qrPlaceholderHtml(content, typography, palette),
      );
    default:
      throw new Error(`unsupported cta layout: ${layout satisfies never}`);
  }
}

export function renderCtaCopyHtml(
  context: BlockRenderContext,
  normalizedContent?: NormalizedCtaContent,
): { output: CtaCopyOutput; warnings: RendererIssue[] } {
  const block = context.block as CtaBlock;
  const layout = resolveCtaLayout(context.resolvedBlockStyle.variantId);

  if (layout == null) {
    throw new Error(`unsupported cta variant: ${context.resolvedBlockStyle.variantId}`);
  }

  const normalized =
    normalizedContent == null
      ? normalizeCtaContentForRenderer(block, context.resolvedBlockStyle.variantId)
      : { content: normalizedContent, issues: [] };

  if (normalized.content == null) {
    throw new Error("cta copy renderer requires normalized content");
  }

  const typography = resolveCtaTypography(context.resolvedBlockStyle);
  const palette = resolveThemePaletteTokens(context.resolvedBlockStyle.tokens.theme);
  const html = wrapCtaLayoutHtml(layout, normalized.content, typography, palette);
  assertCtaCopySafeCss(html);

  return {
    output: {
      kind: "cta_copy_html",
      blockId: block.id,
      blockType: "cta",
      variantId: context.resolvedBlockStyle.variantId,
      layout,
      html,
      copySafety: resolveCtaCopySafety(context.resolvedBlockStyle),
      placeholderOnly: true,
    },
    warnings: normalized.issues,
  };
}

export function copyHtmlUsesInlineStyleOnly(html: string): boolean {
  assertCtaCopySafeCss(html);
  return html.includes("style=");
}

export function assertCtaCopySafeCss(html: string): void {
  assertCopySafeHtml(html);
  if (/<a\b|href\s*=|<button\b|<img\b/i.test(html)) {
    throw new Error("CTA copy HTML must not output live links, buttons, or images");
  }
  if (/var\s*\(/i.test(html)) {
    throw new Error("CTA copy HTML must not use CSS variables");
  }
  if (/\bposition\s*:\s*absolute/i.test(html)) {
    throw new Error("CTA copy HTML must not use absolute positioning");
  }
  if (/\btransform\s*:/i.test(html)) {
    throw new Error("CTA copy HTML must not use transform");
  }
  if (/::/.test(html)) {
    throw new Error("CTA copy HTML must not use pseudo elements");
  }
  if (/\bdisplay\s*:\s*(flex|grid)/i.test(html)) {
    throw new Error("CTA copy HTML must not depend on flex/grid layout");
  }
}
