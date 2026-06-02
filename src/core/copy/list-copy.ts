import type { ListBlock } from "@/core/blocks";
import type {
  BlockRenderContext,
  ListCopyOutput,
  RendererIssue,
} from "@/core/renderer/types";
import {
  normalizeListItemsForRenderer,
  resolveListCopySafety,
  resolveListLayout,
  resolveListTypography,
  type ListLayoutKind,
  type NormalizedListItem,
} from "@/core/renderer/list-layout";

import type { ThemePaletteTokens } from "@/core/styles/theme-palette-tokens";
import { resolveThemePaletteTokens } from "@/core/styles/theme-palette-tokens";

import { assertCopySafeHtml, escapeHtml } from "./html-escape";
import { wrapInlineElement } from "./inline-style";

function subItemsHtml(
  items: string[],
  marker: string,
  typography: ReturnType<typeof resolveListTypography>,
): string {
  return items
    .map((item) =>
      wrapInlineElement(
        "p",
        {
          margin: "2px 0 0 20px",
          color: typography.mutedColor,
          fontSize: "15px",
          lineHeight: "1.65",
        },
        `${marker} ${escapeHtml(item)}`,
      ),
    )
    .join("");
}

function plainBulletItemHtml(
  item: NormalizedListItem,
  typography: ReturnType<typeof resolveListTypography>,
): string {
  return (
    wrapInlineElement(
      "p",
      {
        margin: `0 0 ${typography.itemGap} 0`,
        color: typography.color,
        fontSize: typography.fontSize,
        lineHeight: typography.lineHeight,
      },
      `• ${escapeHtml(item.text)}`,
    ) + subItemsHtml(item.subItems, "◦", typography)
  );
}

function numberedStepItemHtml(
  item: NormalizedListItem,
  index: number,
  typography: ReturnType<typeof resolveListTypography>,
): string {
  return (
    wrapInlineElement(
      "p",
      {
        margin: `0 0 ${typography.itemGap} 0`,
        color: typography.color,
        fontSize: typography.fontSize,
        lineHeight: typography.lineHeight,
      },
      `${index + 1}. ${escapeHtml(item.text)}`,
    ) + subItemsHtml(item.subItems, "·", typography)
  );
}

function checklistCardItemHtml(
  item: NormalizedListItem,
  typography: ReturnType<typeof resolveListTypography>,
  palette: ThemePaletteTokens,
): string {
  const bodyHtml =
    wrapInlineElement(
      "p",
      {
        margin: "0",
        color: typography.color,
        fontSize: typography.fontSize,
        lineHeight: typography.lineHeight,
      },
      `✓ ${escapeHtml(item.text)}`,
    ) + subItemsHtml(item.subItems, "·", typography);

  return wrapInlineElement(
    "section",
    {
      margin: `0 0 ${typography.itemGap} 0`,
      padding: "10px 12px",
      border: `1px solid ${palette.borderSoft}`,
      borderRadius: "8px",
      backgroundColor: palette.bgSoft,
    },
    bodyHtml,
  );
}

function buildListItemsHtml(
  layout: ListLayoutKind,
  items: NormalizedListItem[],
  typography: ReturnType<typeof resolveListTypography>,
  palette: ThemePaletteTokens,
): string {
  switch (layout) {
    case "plain_bullets":
      return items.map((item) => plainBulletItemHtml(item, typography)).join("");
    case "numbered_steps":
      return items
        .map((item, index) => numberedStepItemHtml(item, index, typography))
        .join("");
    case "checklist_cards":
      return items.map((item) => checklistCardItemHtml(item, typography, palette)).join("");
    default:
      throw new Error(`unsupported list layout: ${layout satisfies never}`);
  }
}

export function renderListCopyHtml(
  context: BlockRenderContext,
  normalizedItems?: NormalizedListItem[],
): { output: ListCopyOutput; warnings: RendererIssue[] } {
  const block = context.block as ListBlock;
  const layout = resolveListLayout(context.resolvedBlockStyle.variantId);

  if (layout == null) {
    throw new Error(`unsupported list variant: ${context.resolvedBlockStyle.variantId}`);
  }

  const normalized =
    normalizedItems == null
      ? normalizeListItemsForRenderer(block, context.resolvedBlockStyle.variantId)
      : { items: normalizedItems, issues: [] };
  const typography = resolveListTypography(context.resolvedBlockStyle);
  const palette = resolveThemePaletteTokens(context.resolvedBlockStyle.tokens.theme);
  const innerHtml = buildListItemsHtml(layout, normalized.items, typography, palette);
  const html = wrapInlineElement(
    "section",
    {
      margin: `${typography.marginBlock} 0`,
      color: typography.color,
      fontSize: typography.fontSize,
      lineHeight: typography.lineHeight,
    },
    innerHtml,
  );
  assertListCopySafeCss(html);

  return {
    output: {
      kind: "list_copy_html",
      blockId: block.id,
      blockType: "list",
      variantId: context.resolvedBlockStyle.variantId,
      layout,
      html,
      copySafety: resolveListCopySafety(context.resolvedBlockStyle),
    },
    warnings: normalized.issues,
  };
}

export function copyHtmlUsesInlineStyleOnly(html: string): boolean {
  assertListCopySafeCss(html);
  return html.includes("style=");
}

export function assertListCopySafeCss(html: string): void {
  assertCopySafeHtml(html);
  if (/var\s*\(/i.test(html)) {
    throw new Error("List copy HTML must not use CSS variables");
  }
  if (/\bposition\s*:\s*absolute/i.test(html)) {
    throw new Error("List copy HTML must not use absolute positioning");
  }
  if (/\btransform\s*:/i.test(html)) {
    throw new Error("List copy HTML must not use transform");
  }
  if (/::/.test(html)) {
    throw new Error("List copy HTML must not use pseudo elements");
  }
}
