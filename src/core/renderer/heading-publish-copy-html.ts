/**
 * Heading publish pool — Copy HTML builders (WeChat-safe).
 * Preview 装饰须与 `heading-publish-decoration.ts` 同源 token 对齐。
 */

import { wrapCopySafeMarginSection, wrapTitleHeadingElement } from "@/core/copy/copy-safe-primitives";
import { escapeHtml } from "@/core/copy/html-escape";
import { wrapInlineElement } from "@/core/copy/inline-style";
import type { ThemePaletteTokens } from "@/core/styles/theme-palette-tokens";
import type { TitleHeadingPresentation } from "./title-heading-visual";
import type { TitleBlockTypography } from "./text-style";
import {
  copySafeHeadingOrdinalStyle,
  copySafeHeadingSectionKickerStyle,
  copySafeHeadingSectionStyle,
  copySafeCardCenteredFrameStyle,
  copySafeCardCenteredHeadingStyle,
  copySafeCardCenteredIndexStyle,
  copySafeHighlightMarkerH3Style,
  copySafeHighlightMarkerSectionStyle,
  copySafeHighlightMarkerSubtitleStyle,
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

export function renderPublishHighlightMarkerCopy(
  text: string,
  typography: TitleBlockTypography,
  palette: ThemePaletteTokens,
  subtitleText?: string,
): string {
  const h3 = wrapInlineElement(
    "h3",
    copySafeHighlightMarkerH3Style(palette, typography),
    escapeHtml(text),
  );
  const subtitle =
    subtitleText != null && subtitleText.length > 0
      ? wrapInlineElement(
          "p",
          copySafeHighlightMarkerSubtitleStyle(typography),
          escapeHtml(subtitleText),
        )
      : "";
  return wrapInlineElement(
    "section",
    copySafeHighlightMarkerSectionStyle(typography),
    `${h3}${subtitle}`,
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
    `${indexLine}${wrapTitleHeadingElement(
      "heading",
      {
        ...copySafeCardCenteredHeadingStyle(palette),
        color: typography.color,
        fontSize: typography.fontSize,
        fontWeight: typography.fontWeight,
        lineHeight: typography.lineHeight,
        ...(typography.fontFamily ? { fontFamily: typography.fontFamily } : {}),
      },
      escapeHtml(text),
    )}`,
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
  const titleLine = wrapTitleHeadingElement(
    "heading",
    {
      margin: "0",
      color: typography.color,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      lineHeight: typography.lineHeight,
      ...(typography.fontFamily ? { fontFamily: typography.fontFamily } : {}),
    },
    escapeHtml(text),
  );
  const accentRail = wrapInlineElement(
    "section",
    copySafeMagazineLeftBarAccentRailStyle(palette),
    `${indexLine}${sectionLine}${titleLine}`,
  );
  const lightRail = wrapInlineElement(
    "section",
    copySafeMagazineLeftBarLightRailStyle(palette),
    accentRail,
  );
  return wrapCopySafeMarginSection(
    copySafeHeadingSectionStyle().margin ?? "28px 0 12px",
    lightRail,
  );
}

export function renderPublishMagazineOffsetCopy(
  text: string,
  typography: TitleBlockTypography,
  palette: ThemePaletteTokens,
): string {
  const { margin, ...offsetOnHeading } = copySafeMagazineOffsetSectionStyle(palette);
  return wrapCopySafeMarginSection(
    margin ?? "28px 0 12px",
    wrapTitleHeadingElement(
      "heading",
      {
        margin: "0",
        ...offsetOnHeading,
        color: typography.color,
        fontSize: typography.fontSize,
        fontWeight: typography.fontWeight,
        lineHeight: typography.lineHeight,
        ...(typography.fontFamily ? { fontFamily: typography.fontFamily } : {}),
      },
      escapeHtml(text),
    ),
  );
}
