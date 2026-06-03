"use client";

import type { CSSProperties, ReactNode } from "react";

import {
  previewTitleBadgeStyle,
  previewTitleTextStyle,
} from "@/core/renderer/preview-visual-styles";
import type { TitleHeadingPresentation } from "@/core/renderer/title-heading-visual";
import {
  titleHeadingAccentBarStyle,
  titleHeadingCardTitleFrameStyle,
  titleHeadingCornerAccentStyle,
  titleHeadingEditorialLineStyle,
  titleHeadingIconCapsuleStyle,
  titleHeadingLineCapStyle,
  titleHeadingLineSegmentStyle,
  titleHeadingNumberBadgeStyle,
  titleHeadingTopicPillStyle,
  titleHeadingHighlightMarkerTextStyle,
  titleHeadingShortLineWrapStyle,
  titleHeadingShortLineBarStyle,
  titleHeadingIconPrefixWrapStyle,
  titleHeadingMinimalNumberLabelStyle,
  titleHeadingMagazineOffsetCardStyle,
} from "@/core/renderer/title-heading-visual";
import type { TitleBlockPreviewOutput } from "@/core/renderer/types";

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
}: {
  label: string;
  size?: "md" | "lg";
}) {
  const style = titleHeadingIconCapsuleStyle(PALETTE_PROXY as never) as CSSProperties;
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
  const textStyle = previewTitleTextStyle(output.blockType, output.typography);
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
        ...(titleHeadingCardTitleFrameStyle(PALETTE_PROXY as never) as CSSProperties),
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

    case "numbered":
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
          <span style={titleHeadingNumberBadgeStyle(PALETTE_PROXY as never) as CSSProperties}>
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
              <p style={titleHeadingTopicPillStyle(PALETTE_PROXY as never) as CSSProperties}>
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
            <p style={titleHeadingTopicPillStyle(PALETTE_PROXY as never) as CSSProperties}>
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
      const markerStyle = titleHeadingHighlightMarkerTextStyle(
        PALETTE_PROXY as never,
      ) as CSSProperties;
      const textStyle = previewTitleTextStyle(output.blockType, output.typography);
      return (
        <PreviewShell variantId={output.variantId} style={{ margin: "22px 0" }}>
          <h2 style={{ ...textStyle, ...markerStyle }}>
            {output.text}
            {showStreamingCaret ? caret : null}
          </h2>
        </PreviewShell>
      );
    }

    case "short_line":
      return (
        <PreviewShell variantId={output.variantId} style={{ margin: "22px 0", textAlign: "left" }}>
          <div style={titleHeadingShortLineWrapStyle(PALETTE_PROXY as never) as CSSProperties}>
            <TitleText output={output} showStreamingCaret={showStreamingCaret} caret={caret} />
          </div>
          <div
            aria-hidden
            style={titleHeadingShortLineBarStyle(PALETTE_PROXY as never) as CSSProperties}
          />
        </PreviewShell>
      );

    case "icon_prefix":
      return (
        <PreviewShell variantId={output.variantId} style={{ margin: "22px 0", textAlign: "left" }}>
          <div style={titleHeadingIconPrefixWrapStyle(PALETTE_PROXY as never) as CSSProperties}>
            <TitleText output={output} showStreamingCaret={showStreamingCaret} caret={caret} />
          </div>
        </PreviewShell>
      );

    case "minimal_number":
      return (
        <PreviewShell
          variantId={output.variantId}
          style={{ margin: "22px 0", display: "flex", alignItems: "stretch", gap: "14px" }}
        >
          {presentation.indexLabel ? (
            <span
              style={titleHeadingMinimalNumberLabelStyle(PALETTE_PROXY as never) as CSSProperties}
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
                background: "var(--preview-border-light)",
                opacity: 0.4,
              }}
            />
          ) : null}
          <div style={{ flex: 1, minWidth: 0, paddingTop: "1px" }}>
            <TitleText output={output} showStreamingCaret={showStreamingCaret} caret={caret} />
          </div>
        </PreviewShell>
      );

    case "magazine_left_bar":
      return (
        <PreviewShell variantId={output.variantId} style={{ margin: "22px 0" }}>
          <div style={{ display: "flex", alignItems: "stretch", gap: "12px" }}>
            <div style={{ display: "flex", gap: "3px", flexShrink: 0 }}>
              <span
                aria-hidden
                style={{
                  width: "1px",
                  borderRadius: "1px",
                  background: "var(--preview-border-light)",
                  opacity: 0.55,
                }}
              />
              <span
                aria-hidden
                style={{
                  width: "3px",
                  borderRadius: "2px",
                  background: "var(--preview-text-accent)",
                  opacity: 0.88,
                }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0, paddingTop: "2px" }}>
              {presentation.badgeText ? (
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: "10px",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "var(--preview-text-muted)",
                  }}
                >
                  {presentation.badgeText}
                </p>
              ) : null}
              <TitleText output={output} showStreamingCaret={showStreamingCaret} caret={caret} />
            </div>
          </div>
        </PreviewShell>
      );

    case "magazine_offset":
      return (
        <PreviewShell variantId={output.variantId} style={{ margin: "22px 0" }}>
          <div style={{ paddingLeft: "6px", paddingTop: "4px" }}>
            <div
              style={titleHeadingMagazineOffsetCardStyle(PALETTE_PROXY as never) as CSSProperties}
            >
              <TitleText output={output} showStreamingCaret={showStreamingCaret} caret={caret} />
            </div>
          </div>
        </PreviewShell>
      );

    default:
      return (
        <PreviewShell variantId={output.variantId} style={{ margin: "24px 0" }}>
          <TitleText output={output} showStreamingCaret={showStreamingCaret} caret={caret} />
        </PreviewShell>
      );
  }
}
