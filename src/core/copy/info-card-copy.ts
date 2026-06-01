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

import { assertCopySafeHtml, escapeHtml } from "./html-escape";
import { wrapInlineElement } from "./inline-style";

function titleHtml(
  title: string | undefined,
  typography: ReturnType<typeof resolveInfoCardTypography>,
): string {
  if (title == null) {
    return "";
  }

  return wrapInlineElement(
    "p",
    {
      margin: "0 0 8px",
      color: typography.accentColor,
      fontSize: typography.titleFontSize,
      fontWeight: "600",
      lineHeight: "1.6",
    },
    escapeHtml(title),
  );
}

function iconHtml(
  icon: string | undefined,
  typography: ReturnType<typeof resolveInfoCardTypography>,
): string {
  if (icon == null) {
    return "";
  }

  return wrapInlineElement(
    "p",
    {
      margin: "0 0 6px",
      color: typography.mutedColor,
      fontSize: typography.auxFontSize,
      lineHeight: "1.5",
    },
    escapeHtml(icon),
  );
}

function bodyParagraphHtml(
  text: string,
  typography: ReturnType<typeof resolveInfoCardTypography>,
  extra?: Record<string, string>,
): string {
  return wrapInlineElement(
    "p",
    {
      margin: "0",
      color: typography.color,
      fontSize: typography.fontSize,
      lineHeight: typography.lineHeight,
      ...extra,
    },
    escapeHtml(text),
  );
}

function stepsBodyHtml(
  content: NormalizedInfoCardContent,
  typography: ReturnType<typeof resolveInfoCardTypography>,
): string {
  return content.bodyLines
    .map((line, index) =>
      wrapInlineElement(
        "p",
        {
          margin: index === content.bodyLines.length - 1 ? "0" : "0 0 6px",
          color: typography.color,
          fontSize: typography.fontSize,
          lineHeight: typography.lineHeight,
        },
        `${index + 1}. ${escapeHtml(line)}`,
      ),
    )
    .join("");
}

function wrapInfoCardLayoutHtml(
  layout: InfoCardLayoutKind,
  content: NormalizedInfoCardContent,
  typography: ReturnType<typeof resolveInfoCardTypography>,
): string {
  switch (layout) {
    case "key_takeaway":
      return wrapInlineElement(
        "section",
        {
          margin: `${typography.marginBlock} 0`,
          padding: "12px 16px",
          backgroundColor: "#f9f9f9",
          border: `1px solid ${typography.accentColor}`,
          borderRadius: "8px",
        },
        titleHtml(content.title, typography) +
          bodyParagraphHtml(content.body, typography),
      );
    case "steps":
      return wrapInlineElement(
        "section",
        {
          margin: `${typography.marginBlock} 0`,
          padding: "12px 16px",
          backgroundColor: "#f8fafc",
          border: "1px solid #eeeeee",
          borderRadius: "8px",
        },
        stepsBodyHtml(content, typography),
      );
    case "warning_note":
      return wrapInlineElement(
        "section",
        {
          margin: `${typography.marginBlock} 0`,
          padding: "12px 16px",
          backgroundColor: "#fff8e6",
          borderLeft: `4px solid ${typography.warningColor}`,
        },
        iconHtml(content.icon, typography) +
          titleHtml(content.title, typography) +
          bodyParagraphHtml(content.body, typography, {
            color: "#5f3b00",
          }),
      );
    default:
      throw new Error(`unsupported info_card layout: ${layout satisfies never}`);
  }
}

export function renderInfoCardCopyHtml(
  context: BlockRenderContext,
  normalizedContent?: NormalizedInfoCardContent,
): { output: InfoCardCopyOutput; warnings: RendererIssue[] } {
  const block = context.block as InfoCardBlock;
  const layout = resolveInfoCardLayout(context.resolvedBlockStyle.variantId);

  if (layout == null) {
    throw new Error(
      `unsupported info_card variant: ${context.resolvedBlockStyle.variantId}`,
    );
  }

  const normalized =
    normalizedContent == null
      ? normalizeInfoCardContentForRenderer(
          block,
          context.resolvedBlockStyle.variantId,
        )
      : { content: normalizedContent, issues: [] };

  if (normalized.content == null) {
    throw new Error("info_card copy renderer requires normalized content");
  }

  const typography = resolveInfoCardTypography(context.resolvedBlockStyle);
  const html = wrapInfoCardLayoutHtml(layout, normalized.content, typography);
  assertInfoCardCopySafeCss(html);

  return {
    output: {
      kind: "info_card_copy_html",
      blockId: block.id,
      blockType: "info_card",
      variantId: context.resolvedBlockStyle.variantId,
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
