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
  copySafeCardTitleFrameStyle,
  copySafeHeadingOrdinalStyle,
  copySafeHeadingSectionKickerStyle,
  copySafeHeadingSectionStyle,
  copySafeHighlightMarkerTextStyle,
  copySafeIconCapsuleStyle,
  copySafeIconPrefixInlineStyle,
  copySafeMagazineOffsetSectionStyle,
  copySafeNumberBadgeStyle,
  copySafeShortLineUnderlineStyle,
  copySafeTopicPillStyle,
} from "./title-heading-copy-styles";
import {
  renderPublishHighlightMarkerCopy,
  renderPublishIconPrefixCopy,
  renderPublishMagazineLeftBarCopy,
  renderPublishMagazineOffsetCopy,
  renderPublishMinimalNumberCopy,
  renderPublishNumberedSectionCopy,
  renderPublishShortLineCopy,
  renderPublishCardCenteredCopy,
} from "@/core/renderer/heading-publish-copy-html";
import { isHeadingPublishVariantId } from "@/core/renderer/title-heading-assets";
import {
  resolveTitleHeadingPresentation,
  titleHeadingTopicPillStyle,
} from "@/core/renderer/title-heading-visual";
import type { TitleHeadingPresentation } from "@/core/renderer/title-heading-visual";

function headingSectionStyle(): Record<string, string> {
  return copySafeHeadingSectionStyle();
}

function titleSectionStyle(
  typography: ReturnType<typeof resolveTitleBlockTypography>,
): Record<string, string> {
  return { margin: `${typography.marginBlock} 0` };
}

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
    copySafeIconCapsuleStyle(palette),
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
    copySafeCardTitleFrameStyle(palette),
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
            backgroundColor: palette.textAccent,
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
          backgroundColor: palette.textAccent,
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

function titleInlineHtml(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
): string {
  return wrapInlineElement(
    "span",
    {
      color: typography.color,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      lineHeight: typography.lineHeight,
      ...(typography.fontFamily ? { fontFamily: typography.fontFamily } : {}),
    },
    escapeHtml(text),
  );
}

function renderNumberedCopy(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  palette: ThemePaletteTokens,
  indexLabel: string | undefined,
  blockType: "title" | "heading",
): string {
  if (blockType === "heading") {
    const label = indexLabel ?? "01";
    const num = wrapInlineElement(
      "span",
      copySafeHeadingOrdinalStyle(palette),
      escapeHtml(label),
    );
    return wrapInlineElement(
      "section",
      headingSectionStyle(),
      wrapInlineElement(
        "p",
        { margin: "0", lineHeight: typography.lineHeight },
        `${num}${titleInlineHtml(text, typography)}`,
      ),
    );
  }

  const badgeStyle = copySafeNumberBadgeStyle(palette);
  const badge = wrapInlineElement("span", badgeStyle, escapeHtml(indexLabel ?? "01"));
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
  blockType: "title" | "heading",
): string {
  const sectionStyle =
    blockType === "heading" ? headingSectionStyle() : titleSectionStyle(typography);
  const baseTextStyle = {
    margin: "0",
    color: typography.color,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    lineHeight: typography.lineHeight,
    ...(typography.fontFamily ? { fontFamily: typography.fontFamily } : {}),
  };
  if (blockType === "heading") {
    const marked = wrapInlineElement(
      "span",
      copySafeHighlightMarkerTextStyle(palette),
      escapeHtml(text),
    );
    return wrapInlineElement(
      "section",
      sectionStyle,
      wrapInlineElement("p", baseTextStyle, marked),
    );
  }
  return wrapInlineElement(
    "section",
    sectionStyle,
    wrapInlineElement(
      "p",
      { ...baseTextStyle, ...copySafeHighlightMarkerTextStyle(palette) },
      escapeHtml(text),
    ),
  );
}

function renderShortLineCopy(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  palette: ThemePaletteTokens,
): string {
  const underline = wrapInlineElement(
    "p",
    copySafeShortLineUnderlineStyle(palette),
    "&nbsp;",
  );
  return wrapInlineElement(
    "section",
    { ...headingSectionStyle(), textAlign: "left" },
    titleParagraphHtml(text, typography, "left") + underline,
  );
}

function renderIconPrefixCopy(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  palette: ThemePaletteTokens,
  presentation: TitleHeadingPresentation,
): string {
  const iconLabel = presentation.iconCapsuleLabel ?? presentation.iconGlyph ?? "▸";
  const icon = wrapInlineElement(
    "span",
    copySafeIconPrefixInlineStyle(palette),
    escapeHtml(iconLabel),
  );
  const inner = `${icon}${titleInlineHtml(text, typography)}`;
  return wrapInlineElement(
    "section",
    { ...headingSectionStyle(), textAlign: "left" },
    wrapInlineElement("p", { margin: "0", lineHeight: typography.lineHeight }, inner),
  );
}

function renderMinimalNumberCopy(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  palette: ThemePaletteTokens,
  indexLabel: string | undefined,
): string {
  const label = indexLabel ?? "01";
  const num = wrapInlineElement(
    "span",
    copySafeHeadingOrdinalStyle(palette),
    escapeHtml(label),
  );
  return wrapInlineElement(
    "section",
    { ...headingSectionStyle(), textAlign: "left" },
    wrapInlineElement(
      "p",
      { margin: "0", lineHeight: typography.lineHeight },
      `${num}${titleInlineHtml(text, typography)}`,
    ),
  );
}

function renderMagazineLeftBarCopy(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  palette: ThemePaletteTokens,
  presentation: TitleHeadingPresentation,
): string {
  const indexLine = wrapInlineElement(
    "p",
    copySafeHeadingOrdinalStyle(palette),
    escapeHtml(presentation.indexLabel ?? "01"),
  );
  const sectionLine = wrapInlineElement(
    "p",
    copySafeHeadingSectionKickerStyle(palette),
    escapeHtml(presentation.badgeText ?? "SECTION"),
  );
  const bars = wrapInlineElement(
    "table",
    { borderCollapse: "collapse", margin: "0", padding: "0" },
    wrapInlineElement(
      "tr",
      {},
      wrapInlineElement("td", {
        width: "1px",
        height: "52px",
        backgroundColor: palette.borderLight,
        padding: "0",
        fontSize: "0",
        lineHeight: "0",
      }, "&nbsp;") +
        wrapInlineElement("td", {
          width: "3px",
          height: "52px",
          backgroundColor: palette.textAccent,
          padding: "0",
          fontSize: "0",
          lineHeight: "0",
        }, "&nbsp;"),
    ),
  );
  const body = wrapInlineElement(
    "table",
    { width: "100%", borderCollapse: "collapse" },
    wrapInlineElement(
      "tr",
      {},
      wrapInlineElement("td", { width: "14px", verticalAlign: "top", paddingRight: "10px" }, bars) +
        wrapInlineElement(
          "td",
          { verticalAlign: "top" },
          `${indexLine}${sectionLine}${titleParagraphHtml(text, typography, "left")}`,
        ),
    ),
  );
  return wrapInlineElement("section", headingSectionStyle(), body);
}

function renderMagazineOffsetCopy(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  palette: ThemePaletteTokens,
): string {
  return wrapInlineElement(
    "section",
    copySafeMagazineOffsetSectionStyle(palette),
    titleParagraphHtml(text, typography, "left"),
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
  blockType: "title" | "heading",
): string {
  const pillStyle = copySafeTopicPillStyle(palette);
  const badgeHtml =
    presentation.badgeText != null && presentation.badgeText.length > 0
      ? wrapInlineElement("span", pillStyle, escapeHtml(presentation.badgeText))
      : "";

  if (blockType === "heading") {
    return wrapInlineElement(
      "section",
      headingSectionStyle(),
      `${badgeHtml}${titleParagraphHtml(text, typography, "left")}`,
    );
  }

  const icon = presentation.iconCapsuleLabel
    ? iconCapsuleCopyHtml(presentation.iconCapsuleLabel, palette)
    : "";
  const headerRow = wrapInlineElement(
    "p",
    { margin: "0 0 10px 0", textAlign: "center" },
    `${icon}${badgeHtml}`,
  );

  return wrapInlineElement(
    "section",
    copySafeCardTitleFrameStyle(palette),
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
    context.article,
  );

  const variantId = context.resolvedBlockStyle.variantId;
  const isPublishHeading =
    block.type === "heading" && isHeadingPublishVariantId(variantId);

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
      html = isPublishHeading
        ? renderPublishNumberedSectionCopy(text, typography, palette, presentation.indexLabel)
        : renderNumberedCopy(text, typography, palette, presentation.indexLabel, block.type);
      break;
    case "top_badge":
      html = renderTopBadgeCopy(text, typography, presentation, palette, block.type);
      break;
    case "card":
      html = isPublishHeading
        ? renderPublishCardCenteredCopy(text, typography, palette, presentation.indexLabel)
        : renderPlainHeadingCopy(text, typography, palette, presentation);
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
      html = isPublishHeading
        ? renderPublishHighlightMarkerCopy(text, typography, palette)
        : renderHighlightMarkerCopy(text, typography, palette, block.type);
      break;
    case "short_line":
      html = isPublishHeading
        ? renderPublishShortLineCopy(text, typography, palette)
        : renderShortLineCopy(text, typography, palette);
      break;
    case "icon_prefix":
      html = isPublishHeading
        ? renderPublishIconPrefixCopy(text, typography, palette, presentation, variantId)
        : renderIconPrefixCopy(text, typography, palette, presentation);
      break;
    case "minimal_number":
      html = isPublishHeading
        ? renderPublishMinimalNumberCopy(text, typography, palette, presentation.indexLabel)
        : renderMinimalNumberCopy(text, typography, palette, presentation.indexLabel);
      break;
    case "magazine_left_bar":
      html = isPublishHeading
        ? renderPublishMagazineLeftBarCopy(text, typography, palette, presentation)
        : renderMagazineLeftBarCopy(text, typography, palette, presentation);
      break;
    case "magazine_offset":
      html = isPublishHeading
        ? renderPublishMagazineOffsetCopy(text, typography, palette)
        : renderMagazineOffsetCopy(text, typography, palette);
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
