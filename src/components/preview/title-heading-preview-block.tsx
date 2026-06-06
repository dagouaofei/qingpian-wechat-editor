"use client";

import type { CSSProperties, ReactNode } from "react";

import {
  previewTitleBadgeStyle,
  previewTitleTextStyle,
} from "@/core/renderer/preview-visual-styles";
import { isHeadingPublishVariantId } from "@/core/renderer/title-heading-assets";
import { resolveHeadingPublishIconLabel } from "@/core/renderer/heading-publish-decoration";
import {
  headingPublishContainerStyle,
  headingPublishTextStyle,
  headingPreviewCardCenteredFrameStyle,
  headingPreviewCardCenteredIndexStyle,
  headingPreviewHighlightMarkerH3Style,
  headingPreviewHighlightMarkerSectionStyle,
  headingPreviewHighlightMarkerSubtitleStyle,
  headingPreviewIconPrefixGlyphStyle,
  headingPreviewMagazineLeftBarAccentRailStyle,
  headingPreviewMagazineLeftBarLightRailStyle,
  headingPreviewMagazineOffsetSectionStyle,
  headingPreviewNumberedSectionBadgeStyle,
  headingPreviewOrdinalStyle,
  headingPreviewSectionKickerStyle,
  headingPreviewShortLineUnderlineStyle,
  headingPreviewShortLineWrapStyle,
} from "@/core/renderer/heading-publish-visual";
import type { TitleHeadingPresentation } from "@/core/renderer/title-heading-visual";
import {
  resolveTitleHeadingPaletteFromTypography,
  titleHeadingAccentBarStyle,
  titleHeadingCardTitleFrameStyleForBlock,
  titleHeadingCornerAccentStyle,
  titleHeadingEditorialLineStyle,
  titleHeadingHighlightMarkerTextStyle,
  titleHeadingIconCapsuleStyle,
  titleHeadingIconPrefixWrapStyle,
  titleHeadingLineCapStyle,
  titleHeadingLineSegmentStyle,
  titleHeadingMagazineOffsetCardStyle,
  titleHeadingMinimalNumberLabelStyle,
  titleHeadingNumberBadgeStyle,
  titleHeadingShortLineBarStyle,
  titleHeadingTopicPillStyleForBlock,
} from "@/core/renderer/title-heading-visual";
import type { ThemePaletteTokens } from "@/core/styles/theme-palette-tokens";
import type { TitleBlockPreviewOutput } from "@/core/renderer/types";
import { HEADING_TEAL_SECTION_LABEL_HTML_PASTE_VARIANT_ID } from "@/core/styles/variants/html-paste-candidate-variants";

function isHtmlPasteSectionLabelOutput(output: TitleBlockPreviewOutput): boolean {
  return (
    output.variantId === HEADING_TEAL_SECTION_LABEL_HTML_PASTE_VARIANT_ID ||
    output.presentation.htmlPasteSectionLabel === true ||
    output.presentation.htmlPasteTealSectionLabel === true
  );
}

function HtmlPasteSectionLabelPreview({
  output,
  showStreamingCaret,
  caret,
}: {
  output: TitleBlockPreviewOutput;
  showStreamingCaret?: boolean;
  caret?: ReactNode;
}) {
  const sectionLabel = output.presentation.badgeText ?? "SECTION 01";
  const accentColor = output.typography?.accentColor ?? "var(--preview-text-accent, #576b95)";

  return (
    <PreviewShell
      variantId={output.variantId}
      style={{ margin: "24px 0 12px", textAlign: "left" }}
    >
      <p style={{ margin: "0 0 6px", textAlign: "left" }}>
        <span
          style={{
            display: "inline-block",
            backgroundColor: accentColor,
            color: "#ffffff",
            fontSize: "11px",
            fontWeight: 700,
            padding: "2px 10px",
            letterSpacing: "1px",
            lineHeight: 1.5,
          }}
        >
          {sectionLabel}
        </span>
      </p>
      <h2
        style={{
          margin: 0,
          fontSize: output.typography?.fontSize ?? "17px",
          fontWeight: output.typography?.fontWeight ?? "700",
          lineHeight: output.typography?.lineHeight ?? "1.5",
          color: output.typography?.color ?? "#1f2937",
          ...(output.typography?.fontFamily
            ? { fontFamily: output.typography.fontFamily }
            : {}),
        }}
      >
        {output.text}
        {showStreamingCaret ? caret : null}
      </h2>
    </PreviewShell>
  );
}

function isHeadingPublishOutput(output: TitleBlockPreviewOutput): boolean {
  return (
    output.blockType === "heading" && isHeadingPublishVariantId(output.variantId)
  );
}

function paletteForOutput(output: TitleBlockPreviewOutput): ThemePaletteTokens {
  if (isHeadingPublishOutput(output) && output.themePalette) {
    return output.themePalette;
  }
  if (output.typography?.color) {
    return resolveTitleHeadingPaletteFromTypography({
      color: output.typography.color,
      fontSize: output.typography.fontSize,
      fontWeight: output.typography.fontWeight,
      lineHeight: output.typography.lineHeight,
      marginBlock: "28px",
      accentColor: output.typography.accentColor,
      mutedColor: output.typography.mutedColor,
    });
  }
  return PALETTE_PROXY as unknown as ThemePaletteTokens;
}

function shellStyleForHeading(output: TitleBlockPreviewOutput): CSSProperties {
  if (isHeadingPublishOutput(output)) {
    return headingPublishContainerStyle();
  }
  return { margin: output.blockType === "title" ? "32px 0" : "24px 0" };
}

const PALETTE_PROXY = {
  textDefault: "var(--preview-text-default)",
  textMuted: "var(--preview-text-muted)",
  textAccent: "var(--preview-text-accent)",
  borderLight: "var(--preview-border-light)",
  borderSoft: "var(--preview-border-soft)",
  bgSoft: "var(--preview-bg-soft)",
  bgBand: "var(--preview-bg-band)",
  bgBandBlue: "var(--preview-bg-band-blue)",
  bgSteps: "var(--preview-bg-steps)",
  bgWarning: "var(--preview-bg-warning)",
  warningColor: "var(--preview-warning-color)",
  warningText: "var(--preview-warning-text)",
} as const;

function PreviewShell({
  style,
  variantId,
  children,
}: {
  style: CSSProperties;
  variantId?: string;
  children: ReactNode;
}) {
  return (
    <section style={style} data-variant-id={variantId}>
      {children}
    </section>
  );
}

function CornerAccents() {
  const base = titleHeadingCornerAccentStyle(PALETTE_PROXY as never) as CSSProperties;
  return (
    <>
      <span
        aria-hidden
        style={{ ...base, top: "10px", left: "10px", borderWidth: "2px 0 0 2px" }}
      />
      <span
        aria-hidden
        style={{ ...base, top: "10px", right: "10px", borderWidth: "2px 2px 0 0" }}
      />
      <span
        aria-hidden
        style={{ ...base, bottom: "10px", left: "10px", borderWidth: "0 0 2px 2px" }}
      />
      <span
        aria-hidden
        style={{ ...base, bottom: "10px", right: "10px", borderWidth: "0 2px 2px 0" }}
      />
    </>
  );
}

function IconCapsule({
  label,
  size = "md",
  blockType = "title",
}: {
  label: string;
  size?: "md" | "lg";
  blockType?: "title" | "heading";
}) {
  const style = titleHeadingIconCapsuleStyle(
    PALETTE_PROXY as never,
    blockType,
  ) as CSSProperties;
  return (
    <span
      aria-hidden
      style={{
        ...style,
        width: size === "lg" ? "40px" : "32px",
        height: size === "lg" ? "40px" : "32px",
        minWidth: size === "lg" ? "40px" : "32px",
        fontSize: size === "lg" ? "18px" : "15px",
      }}
    >
      {label}
    </span>
  );
}

function EditorialOrnamentLine({ iconLabel }: { iconLabel?: string }) {
  const lineStyle = titleHeadingEditorialLineStyle(PALETTE_PROXY as never) as CSSProperties;
  const capStyle = titleHeadingLineCapStyle(PALETTE_PROXY as never) as CSSProperties;
  const segmentStyle = titleHeadingLineSegmentStyle(PALETTE_PROXY as never) as CSSProperties;

  return (
    <div style={lineStyle}>
      {iconLabel ? <IconCapsule label={iconLabel} size="md" /> : <span style={capStyle} />}
      <span style={segmentStyle} />
      {iconLabel ? <IconCapsule label={iconLabel} size="md" /> : <span style={capStyle} />}
    </div>
  );
}

function TitleText({
  output,
  showStreamingCaret,
  caret,
}: {
  output: TitleBlockPreviewOutput;
  showStreamingCaret?: boolean;
  caret?: ReactNode;
}) {
  const textStyle = isHeadingPublishOutput(output)
    ? headingPublishTextStyle(output.typography ?? {})
    : previewTitleTextStyle(output.blockType, output.typography);
  if (output.blockType === "heading") {
    return (
      <h2 style={textStyle}>
        {output.text}
        {showStreamingCaret ? caret : null}
      </h2>
    );
  }
  return (
    <h1 style={textStyle}>
      {output.text}
      {showStreamingCaret ? caret : null}
    </h1>
  );
}

function CardTitleFrame({
  output,
  presentation,
  showStreamingCaret,
  caret,
  children,
}: {
  output: TitleBlockPreviewOutput;
  presentation: TitleHeadingPresentation;
  showStreamingCaret?: boolean;
  caret?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <PreviewShell
      variantId={output.variantId}
      style={{
        ...(titleHeadingCardTitleFrameStyleForBlock(
          PALETTE_PROXY as never,
          output.blockType,
        ) as CSSProperties),
        position: "relative",
      }}
    >
      {presentation.cornerAccent ? <CornerAccents /> : null}
      {presentation.iconCapsuleLabel ? (
        <div style={{ marginBottom: "12px" }}>
          <IconCapsule label={presentation.iconCapsuleLabel} size="lg" />
        </div>
      ) : null}
      {children ?? (
        <TitleText output={output} showStreamingCaret={showStreamingCaret} caret={caret} />
      )}
    </PreviewShell>
  );
}

export function TitleHeadingPreviewBlock({
  output,
  showStreamingCaret,
  caret,
}: {
  output: TitleBlockPreviewOutput;
  showStreamingCaret?: boolean;
  caret?: ReactNode;
}) {
  if (isHtmlPasteSectionLabelOutput(output)) {
    return (
      <HtmlPasteSectionLabelPreview
        output={output}
        showStreamingCaret={showStreamingCaret}
        caret={caret}
      />
    );
  }

  const presentation = output.presentation;

  switch (output.layoutMode) {
    case "plain":
      if (output.blockType === "title") {
        return (
          <CardTitleFrame
            output={output}
            presentation={presentation}
            showStreamingCaret={showStreamingCaret}
            caret={caret}
          />
        );
      }
      return (
        <PreviewShell
          variantId={output.variantId}
          style={{
            margin: "24px 0",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 14px",
            borderRadius: "10px",
            backgroundColor: "var(--preview-bg-soft)",
            border: "1px solid var(--preview-border-soft)",
          }}
        >
          {presentation.iconCapsuleLabel ? (
            <IconCapsule label={presentation.iconCapsuleLabel} />
          ) : null}
          <TitleText output={output} showStreamingCaret={showStreamingCaret} caret={caret} />
        </PreviewShell>
      );

    case "left_bar":
      return (
        <PreviewShell
          variantId={output.variantId}
          style={{
            margin: output.blockType === "title" ? "32px 0" : "24px 0",
            display: "flex",
            alignItems: "stretch",
            gap: "10px",
            padding: output.blockType === "title" ? "16px 18px" : "12px 14px",
            backgroundColor: "var(--preview-bg-soft)",
            borderRadius: "10px",
            border: "1px solid var(--preview-border-soft)",
          }}
        >
          {presentation.iconCapsuleLabel ? (
            <IconCapsule label={presentation.iconCapsuleLabel} size="lg" />
          ) : null}
          <span
            aria-hidden
            style={
              titleHeadingAccentBarStyle(PALETTE_PROXY as never, output.blockType) as CSSProperties
            }
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            {presentation.decorationLabel ? (
              <p
                style={{
                  ...previewTitleBadgeStyle(),
                  textAlign: "left",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                }}
              >
                {presentation.decorationLabel}
              </p>
            ) : null}
            <TitleText output={output} showStreamingCaret={showStreamingCaret} caret={caret} />
          </div>
        </PreviewShell>
      );

    case "bottom_line":
      return (
        <PreviewShell
          variantId={output.variantId}
          style={{
            margin: "36px 0",
            textAlign: "center",
            padding: "12px 16px 0",
          }}
        >
          {presentation.decorationLabel ? (
            <p
              style={{
                ...previewTitleBadgeStyle(),
                marginBottom: "8px",
                letterSpacing: "0.12em",
              }}
            >
              EDITORIAL
            </p>
          ) : null}
          <TitleText output={output} showStreamingCaret={showStreamingCaret} caret={caret} />
          <EditorialOrnamentLine iconLabel={presentation.iconCapsuleLabel} />
        </PreviewShell>
      );

    case "numbered": {
      const palette = paletteForOutput(output);
      if (isHeadingPublishOutput(output)) {
        const textStyleLocal = headingPublishTextStyle(output.typography ?? {});
        const badgeStyle = headingPreviewNumberedSectionBadgeStyle(palette);
        return (
          <PreviewShell variantId={output.variantId} style={shellStyleForHeading(output)}>
            <h2
              style={{
                ...textStyleLocal,
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: 0,
              }}
            >
              <span style={badgeStyle}>{presentation.indexLabel ?? "01"}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                {output.text}
                {showStreamingCaret ? caret : null}
              </span>
            </h2>
          </PreviewShell>
        );
      }
      return (
        <PreviewShell
          variantId={output.variantId}
          style={{
            margin: "24px 0",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 16px",
            background: `linear-gradient(90deg, var(--preview-bg-steps) 0%, #ffffff 100%)`,
            borderRadius: "12px",
            border: "1px solid var(--preview-border-soft)",
          }}
        >
          <span
            style={
              titleHeadingNumberBadgeStyle(palette, output.blockType) as CSSProperties
            }
          >
            {presentation.indexLabel ?? "01"}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <TitleText output={output} showStreamingCaret={showStreamingCaret} caret={caret} />
          </div>
          {presentation.iconCapsuleLabel ? (
            <IconCapsule label={presentation.iconCapsuleLabel} />
          ) : null}
        </PreviewShell>
      );
    }

    case "card":
      if (isHeadingPublishOutput(output)) {
        const palette = paletteForOutput(output);
        const textStyleLocal = headingPublishTextStyle(output.typography ?? {});
        return (
          <PreviewShell
            variantId={output.variantId}
            style={headingPreviewCardCenteredFrameStyle(palette)}
          >
            <p style={headingPreviewCardCenteredIndexStyle(palette)}>
              {presentation.indexLabel ?? "01"}
            </p>
            <h2 style={{ ...textStyleLocal, margin: 0, textAlign: "center" }}>
              {output.text}
              {showStreamingCaret ? caret : null}
            </h2>
          </PreviewShell>
        );
      }
      return (
        <PreviewShell variantId={output.variantId} style={{ margin: "24px 0" }}>
          <TitleText output={output} showStreamingCaret={showStreamingCaret} caret={caret} />
        </PreviewShell>
      );

    case "top_badge":
      return (
        <CardTitleFrame
          output={output}
          presentation={presentation}
          showStreamingCaret={showStreamingCaret}
          caret={caret}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            {presentation.iconCapsuleLabel ? (
              <IconCapsule label={presentation.iconCapsuleLabel} />
            ) : null}
            {presentation.badgeText ? (
              <p
                style={
                  titleHeadingTopicPillStyleForBlock(
                    PALETTE_PROXY as never,
                    output.blockType,
                  ) as CSSProperties
                }
              >
                {presentation.badgeText}
              </p>
            ) : null}
          </div>
          <TitleText output={output} showStreamingCaret={showStreamingCaret} caret={caret} />
        </CardTitleFrame>
      );

    case "underline":
      return (
        <PreviewShell
          variantId={output.variantId}
          style={{
            margin: "24px 0",
            paddingBottom: "8px",
            borderBottom: "1px solid var(--preview-border-light)",
          }}
        >
          <TitleText output={output} showStreamingCaret={showStreamingCaret} caret={caret} />
        </PreviewShell>
      );

    case "pill":
      return (
        <PreviewShell
          variantId={output.variantId}
          style={{
            margin: "24px 0",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {presentation.badgeText ? (
            <p
              style={
                titleHeadingTopicPillStyleForBlock(
                  PALETTE_PROXY as never,
                  output.blockType,
                ) as CSSProperties
              }
            >
              {presentation.badgeText}
            </p>
          ) : null}
          <TitleText output={output} showStreamingCaret={showStreamingCaret} caret={caret} />
        </PreviewShell>
      );

    case "keynote_bar":
      return (
        <PreviewShell
          variantId={output.variantId}
          style={{
            margin: "24px 0",
            paddingBottom: "10px",
            borderBottom: "2px solid var(--preview-text-accent)",
          }}
        >
          <TitleText output={output} showStreamingCaret={showStreamingCaret} caret={caret} />
        </PreviewShell>
      );

    case "highlight_marker": {
      const palette = paletteForOutput(output);
      const typography = output.typography ?? {};
      if (isHeadingPublishOutput(output)) {
        const subtitle = output.slots?.subtitle?.content;
        return (
          <section
            style={headingPreviewHighlightMarkerSectionStyle(typography)}
            data-variant-id={output.variantId}
          >
            <h3 style={headingPreviewHighlightMarkerH3Style(palette, typography)}>
              {output.text}
              {showStreamingCaret ? caret : null}
            </h3>
            {subtitle ? (
              <p style={headingPreviewHighlightMarkerSubtitleStyle(typography)}>
                {subtitle}
              </p>
            ) : null}
          </section>
        );
      }
      const textStyleLocal = previewTitleTextStyle(output.blockType, output.typography);
      return (
        <PreviewShell
          variantId={output.variantId}
          style={shellStyleForHeading(output)}
        >
          <h2 style={{ ...textStyleLocal, margin: 0 }}>
            <span
              style={
                titleHeadingHighlightMarkerTextStyle(
                  palette,
                  output.blockType,
                ) as CSSProperties
              }
            >
              {output.text}
            </span>
            {showStreamingCaret ? caret : null}
          </h2>
        </PreviewShell>
      );
    }

    case "short_line": {
      const palette = paletteForOutput(output);
      if (isHeadingPublishOutput(output)) {
        const textStyleLocal = headingPublishTextStyle(output.typography ?? {});
        return (
          <PreviewShell
            variantId={output.variantId}
            style={{ ...shellStyleForHeading(output), textAlign: "left" }}
          >
            <p style={{ margin: 0 }}>
              <span style={headingPreviewShortLineWrapStyle()}>
                <span style={{ ...textStyleLocal, display: "block" }}>{output.text}</span>
                <span
                  aria-hidden
                  style={headingPreviewShortLineUnderlineStyle(palette)}
                />
              </span>
              {showStreamingCaret ? caret : null}
            </p>
          </PreviewShell>
        );
      }
      const underlineStyle = titleHeadingShortLineBarStyle(
        palette,
        output.blockType,
      ) as CSSProperties;
      return (
        <PreviewShell
          variantId={output.variantId}
          style={{ ...shellStyleForHeading(output), textAlign: "left" }}
        >
          <TitleText output={output} showStreamingCaret={showStreamingCaret} caret={caret} />
          <p aria-hidden style={underlineStyle}>
            &nbsp;
          </p>
        </PreviewShell>
      );
    }

    case "icon_prefix": {
      const palette = paletteForOutput(output);
      if (isHeadingPublishOutput(output)) {
        const textStyleLocal = headingPublishTextStyle(output.typography ?? {});
        const iconLabel = resolveHeadingPublishIconLabel(
          presentation,
          output.variantId,
        );
        return (
          <PreviewShell variantId={output.variantId} style={shellStyleForHeading(output)}>
            <h2 style={{ ...textStyleLocal, margin: 0 }}>
              <span style={headingPreviewIconPrefixGlyphStyle(palette)}>
                {iconLabel}
              </span>
              {output.text}
              {showStreamingCaret ? caret : null}
            </h2>
          </PreviewShell>
        );
      }
      return (
        <PreviewShell
          variantId={output.variantId}
          style={{ ...shellStyleForHeading(output), textAlign: "left" }}
        >
          <div
            style={
              titleHeadingIconPrefixWrapStyle(palette, output.blockType) as CSSProperties
            }
          >
            {presentation.iconCapsuleLabel ? (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <IconCapsule label={presentation.iconCapsuleLabel} blockType="heading" />
                <TitleText output={output} showStreamingCaret={showStreamingCaret} caret={caret} />
              </div>
            ) : (
              <TitleText output={output} showStreamingCaret={showStreamingCaret} caret={caret} />
            )}
          </div>
        </PreviewShell>
      );
    }

    case "minimal_number": {
      const palette = paletteForOutput(output);
      if (isHeadingPublishOutput(output)) {
        const textStyleLocal = headingPublishTextStyle(output.typography ?? {});
        return (
          <PreviewShell variantId={output.variantId} style={shellStyleForHeading(output)}>
            <h2 style={{ ...textStyleLocal, margin: 0 }}>
              <span style={headingPreviewOrdinalStyle(palette)}>
                {presentation.indexLabel ?? "01"}
              </span>
              {output.text}
              {showStreamingCaret ? caret : null}
            </h2>
          </PreviewShell>
        );
      }
      return (
        <PreviewShell
          variantId={output.variantId}
          style={{
            ...shellStyleForHeading(output),
            display: "flex",
            alignItems: "stretch",
            gap: "14px",
          }}
        >
          {presentation.indexLabel ? (
            <span
              style={
                titleHeadingMinimalNumberLabelStyle(palette, output.blockType) as CSSProperties
              }
            >
              {presentation.indexLabel}
            </span>
          ) : null}
          {presentation.indexLabel ? (
            <span
              aria-hidden
              style={{
                width: "1px",
                alignSelf: "stretch",
                background: palette.borderLight,
                opacity: 0.4,
              }}
            />
          ) : null}
          <div style={{ flex: 1, minWidth: 0, paddingTop: "1px" }}>
            <TitleText output={output} showStreamingCaret={showStreamingCaret} caret={caret} />
          </div>
        </PreviewShell>
      );
    }

    case "magazine_left_bar": {
      const palette = paletteForOutput(output);
      const textStyleLocal = headingPublishTextStyle(output.typography ?? {});
      return (
        <PreviewShell variantId={output.variantId} style={shellStyleForHeading(output)}>
          <section style={headingPreviewMagazineLeftBarLightRailStyle(palette)}>
            <section style={headingPreviewMagazineLeftBarAccentRailStyle(palette)}>
              <p style={headingPreviewOrdinalStyle(palette)}>
                {presentation.indexLabel ?? "01"}
              </p>
              <p style={headingPreviewSectionKickerStyle(palette)}>
                {presentation.badgeText ?? "SECTION"}
              </p>
              <h2 style={{ ...textStyleLocal, margin: 0 }}>
                {output.text}
                {showStreamingCaret ? caret : null}
              </h2>
            </section>
          </section>
        </PreviewShell>
      );
    }

    case "magazine_offset": {
      const palette = paletteForOutput(output);
      const sectionStyle = isHeadingPublishOutput(output)
        ? (headingPreviewMagazineOffsetSectionStyle(palette) as CSSProperties)
        : (titleHeadingMagazineOffsetCardStyle(palette, output.blockType) as CSSProperties);
      return (
        <PreviewShell variantId={output.variantId} style={sectionStyle}>
          <TitleText output={output} showStreamingCaret={showStreamingCaret} caret={caret} />
        </PreviewShell>
      );
    }

    default:
      return (
        <PreviewShell variantId={output.variantId} style={{ margin: "24px 0" }}>
          <TitleText output={output} showStreamingCaret={showStreamingCaret} caret={caret} />
        </PreviewShell>
      );
  }
}
