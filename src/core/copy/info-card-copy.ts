import type { InfoCardBlock } from "@/core/blocks";
import {
  normalizeInfoCardContentForRenderer,
  resolveInfoCardCopySafety,
  resolveInfoCardLayout,
  resolveInfoCardTypography,
  type InfoCardLayoutKind,
  type NormalizedInfoCardContent,
} from "@/core/renderer/info-card-layout";
import type {
  BlockRenderContext,
  InfoCardCopyOutput,
  RendererIssue,
} from "@/core/renderer/types";

import {
  copySafeCardContentStyle,
  copySafeLeftBorderContentStyle,
  mergeInlineStyles,
  wrapCopySafeMarginSection,
} from "./copy-safe-primitives";
import { renderHarvestReadingPathInfoCardCopy } from "./harvest-candidate-copy";
import { assertCopySafeHtml, escapeHtml } from "./html-escape";
import { wrapInlineElement } from "./inline-style";
import type { ThemePaletteTokens } from "@/core/styles/theme-palette-tokens";
import { resolveThemePaletteTokens } from "@/core/styles/theme-palette-tokens";

function bodyTypography(
  typography: ReturnType<typeof resolveInfoCardTypography>,
  extra?: Record<string, string>,
): Record<string, string> {
  return {
    color: typography.color,
    fontSize: typography.fontSize,
    lineHeight: typography.lineHeight,
    fontFamily: typography.fontFamily,
    ...extra,
  };
}

function titleSpanHtml(
  title: string,
  typography: ReturnType<typeof resolveInfoCardTypography>,
): string {
  return wrapInlineElement(
    "span",
    {
      display: "block",
      margin: "0 0 8px",
      color: typography.accentColor,
      fontSize: typography.titleFontSize,
      fontWeight: "600",
      lineHeight: "1.6",
      fontFamily: typography.fontFamily,
    },
    escapeHtml(title),
  );
}

function iconSpanHtml(
  icon: string,
  typography: ReturnType<typeof resolveInfoCardTypography>,
): string {
  return wrapInlineElement(
    "span",
    {
      display: "block",
      margin: "0 0 6px",
      color: typography.mutedColor,
      fontSize: typography.auxFontSize,
      lineHeight: "1.5",
      fontFamily: typography.fontFamily,
    },
    escapeHtml(icon),
  );
}

function wrapInfoCardLayoutHtml(
  layout: InfoCardLayoutKind,
  content: NormalizedInfoCardContent,
  typography: ReturnType<typeof resolveInfoCardTypography>,
  palette: ThemePaletteTokens,
): string {
  const margin = `${typography.marginBlock} 0`;
  const bodyBase = bodyTypography(typography);

  switch (layout) {
    case "key_takeaway": {
      const inner =
        (content.title != null ? titleSpanHtml(content.title, typography) : "") +
        escapeHtml(content.body);
      return wrapCopySafeMarginSection(
        margin,
        wrapInlineElement(
          "p",
          copySafeCardContentStyle(bodyBase, {
            backgroundColor: palette.bgSoft,
            border: `1px solid ${typography.accentColor}`,
            padding: "12px 16px",
          }),
          inner,
        ),
      );
    }
    case "steps": {
      const lines = content.bodyLines
        .map((line, index) => `${index + 1}. ${escapeHtml(line)}`)
        .join("<br />");
      return wrapCopySafeMarginSection(
        margin,
        wrapInlineElement(
          "p",
          copySafeCardContentStyle(bodyBase, {
            backgroundColor: palette.bgSteps,
            border: `1px solid ${palette.borderSoft}`,
            padding: "12px 16px",
          }),
          lines,
        ),
      );
    }
    case "warning_note": {
      const inner =
        (content.icon != null ? iconSpanHtml(content.icon, typography) : "") +
        (content.title != null ? titleSpanHtml(content.title, typography) : "") +
        escapeHtml(content.body);
      return wrapCopySafeMarginSection(
        margin,
        wrapInlineElement(
          "p",
          copySafeLeftBorderContentStyle(
            mergeInlineStyles(bodyBase, { color: palette.warningText }),
            `4px solid ${typography.warningColor}`,
            {
              paddingLeft: "12px",
              padding: "12px 16px",
              backgroundColor: palette.bgWarning,
            },
          ),
          inner,
        ),
      );
    }
    default:
      throw new Error(`unsupported info_card layout: ${layout satisfies never}`);
  }
}

export function renderInfoCardCopyHtml(
  context: BlockRenderContext,
  normalizedContent?: NormalizedInfoCardContent,
): { output: InfoCardCopyOutput; warnings: RendererIssue[] } {
  const block = context.block as InfoCardBlock;
  const variantId = context.resolvedBlockStyle.variantId;

  if (variantId === "info_card_reading_path_candidate") {
    return renderHarvestReadingPathInfoCardCopy(context, normalizedContent);
  }

  const layout = resolveInfoCardLayout(variantId);

  if (layout == null) {
    throw new Error(`unsupported info_card variant: ${variantId}`);
  }

  const normalized =
    normalizedContent == null
      ? normalizeInfoCardContentForRenderer(block, variantId)
      : { content: normalizedContent, issues: [] };

  if (normalized.content == null) {
    throw new Error("info_card copy renderer requires normalized content");
  }

  const typography = resolveInfoCardTypography(context.resolvedBlockStyle);
  const palette = resolveThemePaletteTokens(context.resolvedBlockStyle.tokens.theme);
  const html = wrapInfoCardLayoutHtml(layout, normalized.content, typography, palette);
  assertInfoCardCopySafeCss(html);

  return {
    output: {
      kind: "info_card_copy_html",
      blockId: block.id,
      blockType: "info_card",
      variantId,
      layout,
      html,
      copySafety: resolveInfoCardCopySafety(context.resolvedBlockStyle),
    },
    warnings: normalized.issues,
  };
}

export function copyHtmlUsesInlineStyleOnly(html: string): boolean {
  assertInfoCardCopySafeCss(html);
  return html.includes("style=");
}

export function assertInfoCardCopySafeCss(html: string): void {
  assertCopySafeHtml(html);
  if (/var\s*\(/i.test(html)) {
    throw new Error("Info card copy HTML must not use CSS variables");
  }
  if (/\bposition\s*:\s*absolute/i.test(html)) {
    throw new Error("Info card copy HTML must not use absolute positioning");
  }
  if (/\btransform\s*:/i.test(html)) {
    throw new Error("Info card copy HTML must not use transform");
  }
  if (/::/.test(html)) {
    throw new Error("Info card copy HTML must not use pseudo elements");
  }
  if (/\bdisplay\s*:\s*(flex|grid)/i.test(html)) {
    throw new Error("Info card copy HTML must not depend on flex/grid layout");
  }
}
