import type { HeadingBlock, TitleBlock } from "@/core/blocks";

import { assertCopySafeHtml, escapeHtml } from "./html-escape";
import { wrapInlineElement } from "./inline-style";
import type { ThemePaletteTokens } from "@/core/styles/theme-palette-tokens";
import { resolveThemePaletteTokens } from "@/core/styles/theme-palette-tokens";
import type { TitleBlockCopyOutput } from "@/core/renderer/types";
import {
  extractTitleBlockText,
  getSlotContent,
  resolveCopySafety,
  resolveLayoutMode,
  resolveTitleBlockSlotContents,
  resolveTitleBlockTypography,
} from "@/core/renderer/text-style";
import type { BlockRenderContext } from "@/core/renderer/types";

function titleParagraphHtml(text: string, typography: ReturnType<typeof resolveTitleBlockTypography>): string {
  return wrapInlineElement(
    "p",
    {
      margin: "0",
      color: typography.color,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      lineHeight: typography.lineHeight,
    },
    escapeHtml(text),
  );
}

function renderPlainCopy(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  align: "left" | "center",
): string {
  return wrapInlineElement(
    "section",
    {
      margin: `${typography.marginBlock} 0`,
      textAlign: align,
    },
    titleParagraphHtml(text, { ...typography, textAlign: align }),
  );
}

function renderLeftBarCopy(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  palette: ThemePaletteTokens,
): string {
  const isTitle = typography.marginBlock === "28px";
  return wrapInlineElement(
    "section",
    {
      margin: `${typography.marginBlock} 0`,
      borderLeft: `${isTitle ? 5 : 3}px solid ${palette.textAccent}`,
      paddingLeft: isTitle ? "14px" : "12px",
      ...(isTitle ? { backgroundColor: palette.bgSoft } : {}),
    },
    titleParagraphHtml(text, { ...typography, textAlign: "left" }),
  );
}

function renderBottomLineCopy(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  palette: ThemePaletteTokens,
): string {
  return wrapInlineElement(
    "section",
    {
      margin: `${typography.marginBlock} 0`,
      textAlign: "center",
      paddingBottom: "10px",
      borderBottom: `2px solid ${palette.textAccent}`,
    },
    titleParagraphHtml(text, typography),
  );
}

function renderNumberedCopy(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  indexLabel: string | undefined,
): string {
  const prefix = indexLabel ? `${escapeHtml(indexLabel)} ` : "";
  return wrapInlineElement(
    "section",
    {
      margin: `${typography.marginBlock} 0`,
    },
    wrapInlineElement(
      "p",
      {
        margin: "0",
        color: typography.color,
        fontSize: typography.fontSize,
        fontWeight: typography.fontWeight,
        lineHeight: typography.lineHeight,
      },
      `${prefix}${escapeHtml(text)}`,
    ),
  );
}

function renderTopBadgeCopy(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  badgeText: string | undefined,
  palette: ThemePaletteTokens,
): string {
  const badgeHtml =
    badgeText != null && badgeText.length > 0
      ? wrapInlineElement(
          "p",
          {
            margin: "0 0 6px 0",
            color: palette.textAccent,
            fontSize: "11px",
            fontWeight: "600",
            lineHeight: "1.4",
            textAlign: "center",
            letterSpacing: "0.08em",
          },
          escapeHtml(badgeText),
        )
      : "";

  return wrapInlineElement(
    "section",
    {
      margin: `${typography.marginBlock} 0`,
      textAlign: "center",
      padding: "12px 16px 8px",
      backgroundColor: palette.bgBandBlue,
      borderRadius: "8px",
    },
    `${badgeHtml}${titleParagraphHtml(text, typography)}`,
  );
}

export function renderTitleBlockCopyHtml(
  context: BlockRenderContext,
): TitleBlockCopyOutput {
  const block = context.block as TitleBlock | HeadingBlock;
  const layoutMode = resolveLayoutMode(context.resolvedBlockStyle);

  if (layoutMode == null) {
    throw new Error("layoutMode is required for titleBlock copy");
  }

  const typography = resolveTitleBlockTypography(
    context.resolvedBlockStyle,
    block.type,
  );
  const palette = resolveThemePaletteTokens(context.resolvedBlockStyle.tokens.theme);
  const slots = resolveTitleBlockSlotContents(
    block,
    context.resolvedBlockStyle,
    context.slotStates,
  );
  const text = extractTitleBlockText(block);
  const badge = getSlotContent(slots, "badge");

  let html: string;

  switch (layoutMode) {
    case "plain":
      html = renderPlainCopy(
        text,
        typography,
        block.type === "title" ? "center" : "left",
      );
      break;
    case "left_bar":
      html = renderLeftBarCopy(text, typography, palette);
      break;
    case "bottom_line":
      html = renderBottomLineCopy(text, typography, palette);
      break;
    case "numbered":
      html = renderNumberedCopy(text, typography, badge?.content);
      break;
    case "top_badge":
      html = renderTopBadgeCopy(text, typography, badge?.content, palette);
      break;
    default:
      throw new Error(`unsupported titleBlock layoutMode for copy: ${layoutMode}`);
  }

  assertCopySafeHtml(html);

  return {
    kind: "title_block_copy_html",
    blockId: block.id,
    blockType: block.type,
    variantId: context.resolvedBlockStyle.variantId,
    layoutMode,
    html,
    copySafety: resolveCopySafety(context.resolvedBlockStyle),
  };
}

export function copyHtmlUsesInlineStyleOnly(html: string): boolean {
  assertCopySafeHtml(html);
  return html.includes("style=") && !html.includes('class="');
}
