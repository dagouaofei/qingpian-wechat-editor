import type { HeadingBlock, TitleBlock } from "@/core/blocks";

import {
  copySafeCardContentStyle,
  copySafeLeftBorderContentStyle,
  mergeInlineStyles,
  wrapCopySafeMarginSection,
  wrapTitleHeadingElement,
} from "./copy-safe-primitives";
import { renderHarvestChapterLabelHeadingCopy } from "./harvest-candidate-copy";
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

function titleHeadingBaseStyle(
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  align: "left" | "center" = "left",
): Record<string, string> {
  return {
    margin: "0",
    color: typography.color,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    lineHeight: typography.lineHeight,
    textAlign: align,
    ...(typography.fontFamily ? { fontFamily: typography.fontFamily } : {}),
  };
}

function titleParagraphHtml(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  align: "left" | "center" = "left",
): string {
  return wrapInlineElement("p", titleHeadingBaseStyle(typography, align), escapeHtml(text));
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

  return wrapCopySafeMarginSection(
    `${typography.marginBlock} 0`,
    `${iconTop}${wrapTitleHeadingElement(
      "title",
      copySafeCardContentStyle(titleHeadingBaseStyle(typography, "center"), {
        backgroundColor: palette.bgSoft,
        border: `1px solid ${palette.borderSoft}`,
        padding: "14px 16px",
      }),
      escapeHtml(text),
    )}`,
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

  const prefix = icon
    ? wrapInlineElement("span", { display: "inline-block", margin: "0 10px 0 0" }, icon)
    : "";
  return wrapCopySafeMarginSection(
    `${typography.marginBlock} 0`,
    wrapTitleHeadingElement(
      "heading",
      copySafeCardContentStyle(titleHeadingBaseStyle(typography, "left"), {
        backgroundColor: palette.bgSoft,
        border: `1px solid ${palette.borderSoft}`,
        padding: "10px 14px",
      }),
      `${prefix}${escapeHtml(text)}`,
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

  const iconPrefix = presentation.iconCapsuleLabel
    ? wrapInlineElement(
        "span",
        { display: "inline-block", margin: "0 10px 0 0", verticalAlign: "top" },
        iconCapsuleCopyHtml(presentation.iconCapsuleLabel, palette),
      )
    : "";

  const headingHtml =
    blockType === "title"
      ? wrapTitleHeadingElement(
          "title",
          copySafeLeftBorderContentStyle(
            titleHeadingBaseStyle(typography, "left"),
            `${barWidth} solid ${palette.textAccent}`,
            {
              paddingLeft: "16px",
              padding: "16px 18px",
              backgroundColor: palette.bgSoft,
            },
          ),
          `${iconPrefix}${escapeHtml(text)}`,
        )
      : wrapTitleHeadingElement(
          "heading",
          copySafeLeftBorderContentStyle(
            titleHeadingBaseStyle(typography, "left"),
            `${barWidth} solid ${palette.textAccent}`,
            {
              paddingLeft: "14px",
              padding: "12px 14px",
              backgroundColor: palette.bgSoft,
            },
          ),
          `${iconPrefix}${escapeHtml(text)}`,
        );

  return wrapCopySafeMarginSection(
    `${typography.marginBlock} 0`,
    `${labelHtml}${headingHtml}`,
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

  const iconPrefix =
    icon.length > 0
      ? wrapInlineElement("span", { display: "inline-block", margin: "0 0 8px" }, icon)
      : "";

  return wrapCopySafeMarginSection(
    `${typography.marginBlock} 0`,
    `${iconPrefix}${wrapTitleHeadingElement(
      "title",
      mergeInlineStyles(titleHeadingBaseStyle(typography, "center"), {
        paddingBottom: "6px",
        borderBottom: `1px solid ${palette.textAccent}`,
      }),
      escapeHtml(text),
    )}`,
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
  return wrapCopySafeMarginSection(
    `${typography.marginBlock} 0`,
    wrapTitleHeadingElement(
      "title",
      copySafeCardContentStyle(titleHeadingBaseStyle(typography, "left"), {
        backgroundColor: palette.bgSteps,
        border: `1px solid ${palette.borderSoft}`,
        padding: "12px 14px",
      }),
      `${badge}${titleInlineHtml(text, typography)}`,
    ),
  );
}

function renderHighlightMarkerCopy(
  text: string,
  typography: ReturnType<typeof resolveTitleBlockTypography>,
  palette: ThemePaletteTokens,
  blockType: "title" | "heading",
): string {
  if (blockType === "heading") {
    return renderPublishHighlightMarkerCopy(text, typography, palette);
  }
  const sectionStyle = titleSectionStyle(typography);
  const baseTextStyle = {
    margin: "0",
    color: typography.color,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    lineHeight: typography.lineHeight,
    ...(typography.fontFamily ? { fontFamily: typography.fontFamily } : {}),
  };
  return wrapInlineElement(
    "section",
    sectionStyle,
    wrapInlineElement(
      "p",
      { ...baseTextStyle, ...copySafeHighlightMarkerTextStyle(palette, typography) },
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
  blockType: "title" | "heading",
): string {
  return wrapCopySafeMarginSection(
    `${typography.marginBlock} 0`,
    wrapTitleHeadingElement(
      blockType,
      mergeInlineStyles(titleHeadingBaseStyle(typography, "left"), {
        paddingBottom: "8px",
        borderBottom: `1px solid ${palette.borderLight}`,
      }),
      escapeHtml(text),
    ),
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
  blockType: "title" | "heading",
): string {
  return wrapCopySafeMarginSection(
    `${typography.marginBlock} 0`,
    wrapTitleHeadingElement(
      blockType,
      mergeInlineStyles(titleHeadingBaseStyle(typography, "left"), {
        paddingBottom: "10px",
        borderBottom: `2px solid ${palette.textAccent}`,
      }),
      escapeHtml(text),
    ),
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

  return wrapCopySafeMarginSection(
    `${typography.marginBlock} 0`,
    `${headerRow}${wrapTitleHeadingElement(
      "title",
      copySafeCardContentStyle(titleHeadingBaseStyle(typography, "center"), {
        backgroundColor: palette.bgSoft,
        border: `1px solid ${palette.borderSoft}`,
        padding: "14px 16px",
      }),
      escapeHtml(text),
    )}`,
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

  if (variantId === "heading_purple_chapter_label_candidate") {
    return renderHarvestChapterLabelHeadingCopy(context);
  }

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
      html = renderUnderlineCopy(text, typography, palette, block.type);
      break;
    case "pill":
      html = renderPillCopy(text, typography, palette, presentation.badgeText);
      break;
    case "keynote_bar":
      html = renderKeynoteBarCopy(text, typography, palette, block.type);
      break;
    case "highlight_marker":
      html = isPublishHeading
        ? renderPublishHighlightMarkerCopy(
            text,
            typography,
            palette,
            slotMap.subtitle?.content,
          )
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
