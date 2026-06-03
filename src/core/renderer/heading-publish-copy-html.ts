/**
 * Heading publish pool — Copy HTML builders (WeChat-safe).
 * Preview 装饰须与 `heading-publish-decoration.ts` 同源 token 对齐。
 */

import { escapeHtml } from "@/core/copy/html-escape";
import { buildInlineStyle, wrapInlineElement } from "@/core/copy/inline-style";
import type { ThemePaletteTokens } from "@/core/styles/theme-palette-tokens";
import type { TitleHeadingPresentation } from "./title-heading-visual";
import type { TitleBlockTypography } from "./text-style";
import {
  copySafeHeadingOrdinalStyle,
  copySafeHeadingSectionKickerStyle,
  copySafeHeadingSectionStyle,
  copySafeCardCenteredFrameStyle,
  copySafeCardCenteredIndexStyle,
  copySafeHighlightMarkerBandCellStyle,
  copySafeHighlightMarkerTableStyle,
  copySafeHighlightMarkerTextCellStyle,
  copySafeIconPrefixGlyphStyle,
  copySafeInlineIconTextRowStyle,
  copySafeMagazineLeftBarAccentRailStyle,
  copySafeMagazineLeftBarLightRailStyle,
  copySafeMagazineOffsetSectionStyle,
  copySafeNumberedSectionBadgeStyle,
  copySafeShortLineUnderlineStyle,
  copySafeShortLineWrapStyle,
  resolveHeadingPublishIconLabel,
} from "./heading-publish-decoration";

function titleParagraphHtml(
  text: string,
  typography: TitleBlockTypography,
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

function titleInlineHtml(text: string, typography: TitleBlockTypography): string {
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

function baseTextParagraphStyle(typography: TitleBlockTypography): Record<string, string> {
  return {
    margin: "0",
    color: typography.color,
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    lineHeight: typography.lineHeight,
    ...(typography.fontFamily ? { fontFamily: typography.fontFamily } : {}),
  };
}

function renderPublishHighlightMarkerTableHtml(
  text: string,
  typography: TitleBlockTypography,
  palette: ThemePaletteTokens,
): string {
  const textCellStyle = buildInlineStyle(
    copySafeHighlightMarkerTextCellStyle(palette, typography),
  );
  const bandCellStyle = buildInlineStyle(copySafeHighlightMarkerBandCellStyle(palette));
  const tableStyle = buildInlineStyle(copySafeHighlightMarkerTableStyle());
  return `<table style="${tableStyle}"><tbody><tr><td style="${textCellStyle}">${escapeHtml(text)}</td></tr><tr><td style="${bandCellStyle}">&nbsp;</td></tr></tbody></table>`;
}

export function renderPublishHighlightMarkerCopy(
  text: string,
  typography: TitleBlockTypography,
  palette: ThemePaletteTokens,
): string {
  const marked = renderPublishHighlightMarkerTableHtml(text, typography, palette);
  return wrapInlineElement(
    "section",
    copySafeHeadingSectionStyle(),
    wrapInlineElement("p", baseTextParagraphStyle(typography), marked),
  );
}

export function renderPublishShortLineCopy(
  text: string,
  typography: TitleBlockTypography,
  palette: ThemePaletteTokens,
): string {
  const titleLine = wrapInlineElement(
    "span",
    {
      display: "block",
      margin: "0",
      color: typography.color,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      lineHeight: typography.lineHeight,
      ...(typography.fontFamily ? { fontFamily: typography.fontFamily } : {}),
    },
    escapeHtml(text),
  );
  const block = wrapInlineElement(
    "span",
    copySafeShortLineWrapStyle(),
    titleLine +
      wrapInlineElement("span", copySafeShortLineUnderlineStyle(palette), "&nbsp;"),
  );
  return wrapInlineElement(
    "section",
    { ...copySafeHeadingSectionStyle(), textAlign: "left" },
    wrapInlineElement("p", { margin: "0" }, block),
  );
}

export function renderPublishNumberedSectionCopy(
  text: string,
  typography: TitleBlockTypography,
  palette: ThemePaletteTokens,
  indexLabel: string | undefined,
): string {
  const badge = wrapInlineElement(
    "span",
    copySafeNumberedSectionBadgeStyle(palette),
    escapeHtml(indexLabel ?? "01"),
  );
  return wrapInlineElement(
    "section",
    copySafeHeadingSectionStyle(),
    wrapInlineElement(
      "p",
      { margin: "0", lineHeight: typography.lineHeight },
      `${badge}${titleInlineHtml(text, typography)}`,
    ),
  );
}

export function renderPublishMinimalNumberCopy(
  text: string,
  typography: TitleBlockTypography,
  palette: ThemePaletteTokens,
  indexLabel: string | undefined,
): string {
  const num = wrapInlineElement(
    "span",
    copySafeHeadingOrdinalStyle(palette),
    escapeHtml(indexLabel ?? "01"),
  );
  return wrapInlineElement(
    "section",
    { ...copySafeHeadingSectionStyle(), textAlign: "left" },
    wrapInlineElement(
      "p",
      { margin: "0", lineHeight: typography.lineHeight },
      `${num}${titleInlineHtml(text, typography)}`,
    ),
  );
}

export function renderPublishCardCenteredCopy(
  text: string,
  typography: TitleBlockTypography,
  palette: ThemePaletteTokens,
  indexLabel: string | undefined,
): string {
  const indexLine = wrapInlineElement(
    "p",
    copySafeCardCenteredIndexStyle(palette),
    escapeHtml(indexLabel ?? "01"),
  );
  return wrapInlineElement(
    "section",
    copySafeCardCenteredFrameStyle(palette),
    `${indexLine}${titleParagraphHtml(text, typography, "center")}`,
  );
}

export function renderPublishIconPrefixCopy(
  text: string,
  typography: TitleBlockTypography,
  palette: ThemePaletteTokens,
  presentation: TitleHeadingPresentation,
  variantId: string,
): string {
  const iconLabel = resolveHeadingPublishIconLabel(presentation, variantId);
  const icon = wrapInlineElement(
    "span",
    copySafeIconPrefixGlyphStyle(palette),
    escapeHtml(iconLabel),
  );
  const inner = `${icon}${titleInlineHtml(text, typography)}`;
  return wrapInlineElement(
    "section",
    { ...copySafeHeadingSectionStyle(), textAlign: "left" },
    wrapInlineElement(
      "p",
      copySafeInlineIconTextRowStyle(typography.lineHeight),
      inner,
    ),
  );
}

export function renderPublishMagazineLeftBarCopy(
  text: string,
  typography: TitleBlockTypography,
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
  const content = `${indexLine}${sectionLine}${titleParagraphHtml(text, typography, "left")}`;
  const inner = wrapInlineElement("section", copySafeMagazineLeftBarAccentRailStyle(palette), content);
  const middle = wrapInlineElement("section", copySafeMagazineLeftBarLightRailStyle(palette), inner);
  return wrapInlineElement("section", copySafeHeadingSectionStyle(), middle);
}

export function renderPublishMagazineOffsetCopy(
  text: string,
  typography: TitleBlockTypography,
  palette: ThemePaletteTokens,
): string {
  return wrapInlineElement(
    "section",
    copySafeMagazineOffsetSectionStyle(palette),
    titleParagraphHtml(text, typography, "left"),
  );
}
