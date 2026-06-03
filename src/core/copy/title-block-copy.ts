import type { HeadingBlock, TitleBlock } from "@/core/blocks";

import { assertCopySafeHtml, escapeHtml } from "./html-escape";
import { wrapInlineElement } from "./inline-style";
import type { ThemePaletteTokens } from "@/core/styles/theme-palette-tokens";
import { resolveThemePaletteTokens } from "@/core/styles/theme-palette-tokens";
import type { TitleBlockCopyOutput } from "@/core/renderer/types";
import {
  extractTitleBlockText,
  resolveCopySafety,
  resolveLayoutMode,
  resolveTitleBlockSlotContents,
  resolveTitleBlockTypography,
  slotContentMap,
} from "@/core/renderer/text-style";
import type { BlockRenderContext } from "@/core/renderer/types";
import {
  resolveTitleHeadingPresentation,
  titleHeadingCardTitleFrameStyle,
  titleHeadingIconCapsuleStyle,
  titleHeadingNumberBadgeStyle,
  titleHeadingTopicPillStyle,
  titleHeadingHighlightMarkerTextStyle,
  titleHeadingShortLineWrapStyle,
  titleHeadingShortLineBarStyle,
  titleHeadingIconPrefixWrapStyle,
  titleHeadingMinimalNumberLabelStyle,
  titleHeadingMagazineOffsetCardStyle,
} from "@/core/renderer/title-heading-visual";
import type { TitleHeadingPresentation } from "@/core/renderer/title-heading-visual";

function titleParagraphHtml(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  align: "left" | "center" = "left",
): string {
  return wrapInlineElement(
    "p",
    {
      margin: "0",
      color: typography.color,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      lineHeight: typography.lineHeight,
      textAlign: align,
      ...(typography.fontFamily ? { fontFamily: typography.fontFamily } : {}),
    },
    escapeHtml(text),
  );
}

function iconCapsuleCopyHtml(label: string, palette: ThemePaletteTokens): string {
  return wrapInlineElement(
    "span",
    titleHeadingIconCapsuleStyle(palette),
    escapeHtml(label),
  );
}

function renderPlainTitleCopy(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  palette: ThemePaletteTokens,
  presentation: TitleHeadingPresentation,
): string {
  const iconTop = presentation.iconCapsuleLabel
    ? wrapInlineElement(
        "p",
        { margin: "0 0 12px 0", textAlign: "center" },
        iconCapsuleCopyHtml(presentation.iconCapsuleLabel, palette),
      )
    : "";

  return wrapInlineElement(
    "section",
    titleHeadingCardTitleFrameStyle(palette),
    `${iconTop}${titleParagraphHtml(text, typography, "center")}`,
  );
}

function renderPlainHeadingCopy(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  palette: ThemePaletteTokens,
  presentation: TitleHeadingPresentation,
): string {
  const icon = presentation.iconCapsuleLabel
    ? iconCapsuleCopyHtml(presentation.iconCapsuleLabel, palette)
    : wrapInlineElement("span", {
        display: "inline-block",
        width: "8px",
        height: "8px",
        marginRight: "10px",
        borderRadius: "2px",
        backgroundColor: palette.textAccent,
      }, "");

  return wrapInlineElement(
    "section",
    {
      margin: `${typography.marginBlock} 0`,
      padding: "10px 14px",
      borderRadius: "10px",
      backgroundColor: palette.bgSoft,
      border: `1px solid ${palette.borderSoft}`,
    },
    wrapInlineElement(
      "table",
      { width: "100%", borderCollapse: "collapse" },
      wrapInlineElement(
        "tr",
        {},
        wrapInlineElement("td", { width: "40px", verticalAlign: "middle" }, icon) +
          wrapInlineElement(
            "td",
            { verticalAlign: "middle" },
            titleParagraphHtml(text, typography, "left"),
          ),
      ),
    ),
  );
}

function renderLeftBarCopy(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  palette: ThemePaletteTokens,
  blockType: "title" | "heading",
  presentation: TitleHeadingPresentation,
): string {
  const barWidth = blockType === "title" ? "5px" : "3px";
  const labelHtml = presentation.decorationLabel
    ? wrapInlineElement(
        "p",
        {
          margin: "0 0 6px 0",
          color: palette.textAccent,
          fontSize: "11px",
          fontWeight: "600",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        },
        escapeHtml(presentation.decorationLabel),
      )
    : "";

  const iconCell = presentation.iconCapsuleLabel
    ? wrapInlineElement(
        "td",
        { width: "44px", verticalAlign: "top" },
        iconCapsuleCopyHtml(presentation.iconCapsuleLabel, palette),
      )
    : "";

  return wrapInlineElement(
    "section",
    {
      margin: `${typography.marginBlock} 0`,
      padding: blockType === "title" ? "16px 18px" : "12px 14px",
      backgroundColor: palette.bgSoft,
      borderRadius: "10px",
      border: `1px solid ${palette.borderSoft}`,
    },
    wrapInlineElement(
      "table",
      {
        width: "100%",
        borderCollapse: "collapse",
      },
      wrapInlineElement(
        "tr",
        {},
        iconCell +
          wrapInlineElement("td", {
            width: barWidth,
            verticalAlign: "top",
            background: `linear-gradient(180deg, ${palette.textAccent} 0%, ${palette.borderLight} 100%)`,
            borderRadius: "2px",
          }, "") +
          wrapInlineElement(
            "td",
            { verticalAlign: "top", paddingLeft: "12px" },
            `${labelHtml}${titleParagraphHtml(text, typography, "left")}`,
          ),
      ),
    ),
  );
}

function renderBottomLineCopy(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  palette: ThemePaletteTokens,
  presentation: TitleHeadingPresentation,
): string {
  const icon = presentation.iconCapsuleLabel
    ? iconCapsuleCopyHtml(presentation.iconCapsuleLabel, palette)
    : "";

  const ornament = wrapInlineElement(
    "table",
    {
      width: "280px",
      maxWidth: "100%",
      margin: "10px auto 0",
      borderCollapse: "collapse",
    },
    wrapInlineElement(
      "tr",
      {},
      wrapInlineElement("td", { width: "40px", textAlign: "center", verticalAlign: "middle" }, icon) +
        wrapInlineElement("td", {
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${palette.textAccent}, transparent)`,
        }, "") +
        wrapInlineElement("td", { width: "40px", textAlign: "center", verticalAlign: "middle" }, icon),
    ),
  );

  return wrapInlineElement(
    "section",
    {
      margin: `${typography.marginBlock} 0`,
      textAlign: "center",
      padding: "12px 16px 0",
    },
    `${titleParagraphHtml(text, typography, "center")}${ornament}`,
  );
}

function renderNumberedCopy(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  palette: ThemePaletteTokens,
  indexLabel: string | undefined,
): string {
  const badgeStyle = titleHeadingNumberBadgeStyle(palette);
  const badge = wrapInlineElement(
    "span",
    badgeStyle,
    escapeHtml(indexLabel ?? "01"),
  );

  return wrapInlineElement(
    "section",
    {
      margin: `${typography.marginBlock} 0`,
      padding: "12px 14px",
      backgroundColor: palette.bgSteps,
      borderRadius: "10px",
      border: `1px solid ${palette.borderSoft}`,
    },
    wrapInlineElement(
      "table",
      { width: "100%", borderCollapse: "collapse" },
      wrapInlineElement(
        "tr",
        {},
        wrapInlineElement("td", { width: "44px", verticalAlign: "middle" }, badge) +
          wrapInlineElement(
            "td",
            { verticalAlign: "middle" },
            titleParagraphHtml(text, typography, "left"),
          ),
      ),
    ),
  );
}

function renderHighlightMarkerCopy(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  palette: ThemePaletteTokens,
): string {
  const markerStyle = titleHeadingHighlightMarkerTextStyle(palette);
  return wrapInlineElement(
    "section",
    { margin: `${typography.marginBlock} 0` },
    wrapInlineElement(
      "p",
      {
        margin: "0",
        color: typography.color,
        fontSize: typography.fontSize,
        fontWeight: typography.fontWeight,
        lineHeight: typography.lineHeight,
        ...(typography.fontFamily ? { fontFamily: typography.fontFamily } : {}),
        ...markerStyle,
      },
      escapeHtml(text),
    ),
  );
}

function renderShortLineCopy(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  palette: ThemePaletteTokens,
): string {
  const lineStyle = titleHeadingShortLineBarStyle(palette);
  return wrapInlineElement(
    "section",
    { margin: `${typography.marginBlock} 0`, textAlign: "left" },
    wrapInlineElement("div", titleHeadingShortLineWrapStyle(palette), titleParagraphHtml(text, typography, "left")) +
      wrapInlineElement("div", { ...lineStyle, "aria-hidden": "true" }, ""),
  );
}

function renderIconPrefixCopy(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  palette: ThemePaletteTokens,
): string {
  return wrapInlineElement(
    "section",
    { margin: `${typography.marginBlock} 0`, textAlign: "left" },
    wrapInlineElement(
      "div",
      titleHeadingIconPrefixWrapStyle(palette),
      titleParagraphHtml(text, typography, "left"),
    ),
  );
}

function renderMinimalNumberCopy(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  palette: ThemePaletteTokens,
  indexLabel: string | undefined,
): string {
  if (!indexLabel) {
    return wrapInlineElement(
      "section",
      { margin: `${typography.marginBlock} 0`, textAlign: "left" },
      titleParagraphHtml(text, typography, "left"),
    );
  }
  const num = wrapInlineElement(
    "span",
    titleHeadingMinimalNumberLabelStyle(palette),
    escapeHtml(indexLabel),
  );
  return wrapInlineElement(
    "section",
    { margin: `${typography.marginBlock} 0`, textAlign: "left" },
    wrapInlineElement(
      "table",
      { width: "100%", borderCollapse: "collapse" },
      wrapInlineElement(
        "tr",
        {},
        wrapInlineElement("td", { width: "34px", verticalAlign: "top", textAlign: "right", paddingRight: "14px" }, num) +
          wrapInlineElement("td", { width: "1px", verticalAlign: "top", background: palette.borderLight, opacity: "0.4" }, "") +
          wrapInlineElement(
            "td",
            { verticalAlign: "top", paddingLeft: "14px", paddingTop: "1px" },
            titleParagraphHtml(text, typography, "left"),
          ),
      ),
    ),
  );
}

function renderMagazineLeftBarCopy(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  palette: ThemePaletteTokens,
  badgeText: string | undefined,
): string {
  const kicker = badgeText
    ? wrapInlineElement(
        "p",
        {
          margin: "0 0 4px",
          fontSize: "10px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: palette.textMuted,
        },
        escapeHtml(badgeText),
      )
    : wrapInlineElement(
        "p",
        {
          margin: "0 0 4px",
          fontSize: "10px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: palette.textMuted,
        },
        "Editorial",
      );
  const bars =
    wrapInlineElement("span", { display: "block", width: "1px", height: "36px", borderRadius: "1px", background: palette.borderLight, opacity: "0.55", marginBottom: "3px" }, "") +
    wrapInlineElement("span", { display: "block", width: "3px", height: "36px", borderRadius: "2px", background: palette.textAccent, opacity: "0.88" }, "");
  return wrapInlineElement(
    "section",
    { margin: `${typography.marginBlock} 0`, textAlign: "left" },
    wrapInlineElement(
      "table",
      { width: "100%", borderCollapse: "collapse" },
      wrapInlineElement(
        "tr",
        {},
        wrapInlineElement("td", { width: "18px", verticalAlign: "top", paddingRight: "12px" }, bars) +
          wrapInlineElement(
            "td",
            { verticalAlign: "top", paddingTop: "2px" },
            `${kicker}${titleParagraphHtml(text, typography, "left")}`,
          ),
      ),
    ),
  );
}

function renderMagazineOffsetCopy(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  palette: ThemePaletteTokens,
): string {
  return wrapInlineElement(
    "section",
    { margin: `${typography.marginBlock} 0` },
    wrapInlineElement(
      "div",
      { paddingLeft: "6px", paddingTop: "4px" },
      wrapInlineElement(
        "div",
        titleHeadingMagazineOffsetCardStyle(palette),
        titleParagraphHtml(text, typography, "left"),
      ),
    ),
  );
}

function renderUnderlineCopy(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  palette: ThemePaletteTokens,
): string {
  return wrapInlineElement(
    "section",
    {
      margin: `${typography.marginBlock} 0`,
      paddingBottom: "8px",
      borderBottom: `1px solid ${palette.borderLight}`,
    },
    titleParagraphHtml(text, typography, "left"),
  );
}

function renderPillCopy(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  palette: ThemePaletteTokens,
  badgeText: string | undefined,
): string {
  const pill =
    badgeText != null && badgeText.length > 0
      ? wrapInlineElement("span", titleHeadingTopicPillStyle(palette), escapeHtml(badgeText))
      : "";
  return wrapInlineElement(
    "section",
    { margin: `${typography.marginBlock} 0` },
    `${pill}${titleParagraphHtml(text, typography, "left")}`,
  );
}

function renderKeynoteBarCopy(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  palette: ThemePaletteTokens,
): string {
  return wrapInlineElement(
    "section",
    {
      margin: `${typography.marginBlock} 0`,
      paddingBottom: "10px",
      borderBottom: `2px solid ${palette.textAccent}`,
    },
    titleParagraphHtml(text, typography, "left"),
  );
}

function renderTopBadgeCopy(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  presentation: TitleHeadingPresentation,
  palette: ThemePaletteTokens,
): string {
  const pillStyle = titleHeadingTopicPillStyle(palette);
  const icon = presentation.iconCapsuleLabel
    ? iconCapsuleCopyHtml(presentation.iconCapsuleLabel, palette)
    : "";
  const badgeHtml =
    presentation.badgeText != null && presentation.badgeText.length > 0
      ? wrapInlineElement("span", pillStyle, escapeHtml(presentation.badgeText))
      : "";

  const headerRow = wrapInlineElement(
    "p",
    { margin: "0 0 10px 0", textAlign: "center" },
    `${icon}${badgeHtml}`,
  );

  return wrapInlineElement(
    "section",
    titleHeadingCardTitleFrameStyle(palette),
    `${headerRow}${titleParagraphHtml(text, typography, "center")}`,
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
  const slotMap = slotContentMap(slots);
  const text = extractTitleBlockText(block);
  const presentation = resolveTitleHeadingPresentation(
    layoutMode,
    block.type,
    block,
    slotMap,
    context.resolvedBlockStyle.variantId,
  );

  let html: string;

  switch (layoutMode) {
    case "plain":
      html =
        block.type === "title"
          ? renderPlainTitleCopy(text, typography, palette, presentation)
          : renderPlainHeadingCopy(text, typography, palette, presentation);
      break;
    case "left_bar":
      html = renderLeftBarCopy(text, typography, palette, block.type, presentation);
      break;
    case "bottom_line":
      html = renderBottomLineCopy(text, typography, palette, presentation);
      break;
    case "numbered":
      html = renderNumberedCopy(text, typography, palette, presentation.indexLabel);
      break;
    case "top_badge":
      html = renderTopBadgeCopy(text, typography, presentation, palette);
      break;
    case "underline":
      html = renderUnderlineCopy(text, typography, palette);
      break;
    case "pill":
      html = renderPillCopy(text, typography, palette, presentation.badgeText);
      break;
    case "keynote_bar":
      html = renderKeynoteBarCopy(text, typography, palette);
      break;
    case "highlight_marker":
      html = renderHighlightMarkerCopy(text, typography, palette);
      break;
    case "short_line":
      html = renderShortLineCopy(text, typography, palette);
      break;
    case "icon_prefix":
      html = renderIconPrefixCopy(text, typography, palette);
      break;
    case "minimal_number":
      html = renderMinimalNumberCopy(text, typography, palette, presentation.indexLabel);
      break;
    case "magazine_left_bar":
      html = renderMagazineLeftBarCopy(text, typography, palette, presentation.badgeText);
      break;
    case "magazine_offset":
      html = renderMagazineOffsetCopy(text, typography, palette);
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
