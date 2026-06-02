import type { ImagePlaceholderBlock } from "@/core/blocks";
import {
  normalizeImagePlaceholderContentForRenderer,
  resolveImagePlaceholderCopySafety,
  resolveImagePlaceholderLayout,
  resolveImagePlaceholderTypography,
  type ImagePlaceholderLayoutKind,
  type NormalizedImagePlaceholderContent,
} from "@/core/renderer/image-placeholder-layout";
import type {
  BlockRenderContext,
  ImagePlaceholderCopyOutput,
  RendererIssue,
} from "@/core/renderer/types";

import { assertCopySafeHtml, escapeHtml } from "./html-escape";
import { wrapInlineElement } from "./inline-style";
import type { ThemePaletteTokens } from "@/core/styles/theme-palette-tokens";
import { resolveThemePaletteTokens } from "@/core/styles/theme-palette-tokens";

function captionHtml(
  caption: string | undefined,
  typography: ReturnType<typeof resolveImagePlaceholderTypography>,
): string {
  if (caption == null) {
    return "";
  }

  return wrapInlineElement(
    "p",
    {
      margin: "8px 0 0",
      color: typography.color,
      fontSize: typography.fontSize,
      lineHeight: typography.lineHeight,
      textAlign: "center",
    },
    escapeHtml(caption),
  );
}

function suggestionHtml(
  suggestion: string | undefined,
  typography: ReturnType<typeof resolveImagePlaceholderTypography>,
): string {
  if (suggestion == null) {
    return "";
  }

  return wrapInlineElement(
    "p",
    {
      margin: "6px 0 0",
      color: typography.mutedColor,
      fontSize: typography.auxFontSize,
      lineHeight: "1.6",
      textAlign: "center",
    },
    escapeHtml(suggestion),
  );
}

function placeholderBoxHtml(
  content: NormalizedImagePlaceholderContent,
  typography: ReturnType<typeof resolveImagePlaceholderTypography>,
  palette: ThemePaletteTokens,
): string {
  return wrapInlineElement(
    "section",
    {
      margin: "0",
      padding: "22px 12px",
      border: `1px dashed ${palette.borderLight}`,
      backgroundColor: palette.bgSoft,
      color: typography.mutedColor,
      fontSize: typography.auxFontSize,
      lineHeight: "1.6",
      textAlign: "center",
    },
    `${escapeHtml(content.placeholderLabel)} (${escapeHtml(content.aspectRatio)}, ${escapeHtml(
      content.position,
    )})`,
  );
}

function wrapImagePlaceholderHtml(
  layout: ImagePlaceholderLayoutKind,
  content: NormalizedImagePlaceholderContent,
  typography: ReturnType<typeof resolveImagePlaceholderTypography>,
  palette: ThemePaletteTokens,
): string {
  const body =
    placeholderBoxHtml(content, typography, palette) +
    captionHtml(content.caption, typography) +
    suggestionHtml(content.suggestion, typography);

  switch (layout) {
    case "simple":
      return wrapInlineElement(
        "section",
        { margin: `${typography.marginBlock} 0` },
        placeholderBoxHtml(content, typography, palette),
      );
    case "caption":
      return wrapInlineElement(
        "section",
        { margin: `${typography.marginBlock} 0` },
        body,
      );
    case "card":
      return wrapInlineElement(
        "section",
        {
          margin: `${typography.marginBlock} 0`,
          padding: "12px",
          border: `1px solid ${palette.borderSoft}`,
          borderRadius: "8px",
          backgroundColor: "#ffffff",
        },
        body,
      );
    default:
      throw new Error(`unsupported image placeholder layout: ${layout satisfies never}`);
  }
}

export function renderImagePlaceholderCopyHtml(
  context: BlockRenderContext,
  normalizedContent?: NormalizedImagePlaceholderContent,
): { output: ImagePlaceholderCopyOutput; warnings: RendererIssue[] } {
  const block = context.block as ImagePlaceholderBlock;
  const layout = resolveImagePlaceholderLayout(context.resolvedBlockStyle.variantId);

  if (layout == null) {
    throw new Error(
      `unsupported image_placeholder variant: ${context.resolvedBlockStyle.variantId}`,
    );
  }

  const normalized =
    normalizedContent == null
      ? normalizeImagePlaceholderContentForRenderer(
          block,
          context.resolvedBlockStyle.variantId,
        )
      : { content: normalizedContent, issues: [] };

  const typography = resolveImagePlaceholderTypography(context.resolvedBlockStyle);
  const palette = resolveThemePaletteTokens(context.resolvedBlockStyle.tokens.theme);
  const html = wrapImagePlaceholderHtml(layout, normalized.content, typography, palette);
  assertImagePlaceholderCopySafeCss(html);

  return {
    output: {
      kind: "image_placeholder_copy_html",
      blockId: block.id,
      blockType: "image_placeholder",
      variantId: context.resolvedBlockStyle.variantId,
      layout,
      html,
      copySafety: resolveImagePlaceholderCopySafety(context.resolvedBlockStyle),
      placeholderOnly: true,
    },
    warnings: normalized.issues,
  };
}

export function copyHtmlUsesInlineStyleOnly(html: string): boolean {
  assertImagePlaceholderCopySafeCss(html);
  return html.includes("style=");
}

export function assertImagePlaceholderCopySafeCss(html: string): void {
  assertCopySafeHtml(html);
  if (/<img\b/i.test(html)) {
    throw new Error("Image placeholder copy HTML must not output real images");
  }
  if (/var\s*\(/i.test(html)) {
    throw new Error("Image placeholder copy HTML must not use CSS variables");
  }
  if (/\bposition\s*:\s*absolute/i.test(html)) {
    throw new Error("Image placeholder copy HTML must not use absolute positioning");
  }
  if (/\btransform\s*:/i.test(html)) {
    throw new Error("Image placeholder copy HTML must not use transform");
  }
  if (/::/.test(html)) {
    throw new Error("Image placeholder copy HTML must not use pseudo elements");
  }
  if (/\bdisplay\s*:\s*(flex|grid)/i.test(html)) {
    throw new Error("Image placeholder copy HTML must not depend on flex/grid layout");
  }
}
