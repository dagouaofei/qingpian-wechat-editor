"use client";

import type { CSSProperties, ReactNode } from "react";

import {
  PREVIEW_THEME,
  previewArticleContainerStyle,
  previewCtaActionStyle,
  previewCtaButtonStyle,
  previewCtaContainerStyle,
  previewCtaQrPlaceholderStyle,
  previewCtaTextStyle,
  previewDividerStyle,
  previewHighlightContainerStyle,
  previewHighlightLabelStyle,
  previewHighlightTextStyle,
  previewImageCaptionStyle,
  previewImagePlaceholderBoxStyle,
  previewImagePlaceholderContainerStyle,
  previewImageSuggestionStyle,
  previewInfoCardBodyStyle,
  previewInfoCardContainerStyle,
  previewInfoCardIconStyle,
  previewInfoCardTitleStyle,
  previewListChecklistItemStyle,
  previewListContainerStyle,
  previewListItemStyle,
  previewListSubItemStyle,
  previewQuoteAttributionStyle,
  previewQuoteContainerStyle,
  previewQuoteTextStyle,
  previewTextBlockContainerStyle,
  previewTextBlockTypography,
  previewTitleBadgeStyle,
  previewTitleContainerStyle,
  previewTitleTextStyle,
} from "@/core/renderer/preview-visual-styles";
import type {
  PreviewInlineNode,
  RendererIssue,
  RendererOutputPlaceholder,
} from "@/core/renderer";

import type { PreviewColorPaletteId } from "@/lib/preview-color-palette";
import { previewPaletteCssVariables } from "@/lib/preview-color-palette";

import type { SerializedPreviewBlock } from "./types";

function renderInlineNodes(nodes: PreviewInlineNode[]) {
  return nodes.map((node, index) => {
    const content = node.text;
    if (!node.marks?.length) {
      return <span key={index}>{content}</span>;
    }
    return (
      <span key={index}>
        {node.marks.reduce<ReactNode>((child, mark, markIndex) => {
          if (mark.type === "bold") {
            return <strong key={markIndex}>{child}</strong>;
          }
          if (mark.type === "italic") {
            return <em key={markIndex}>{child}</em>;
          }
          if (mark.type === "link" && mark.href) {
            return (
              <a
                key={markIndex}
                href={mark.href}
                style={{ color: "var(--preview-text-accent, #576b95)", textDecoration: "underline" }}
              >
                {child}
              </a>
            );
          }
          if (mark.type === "color" && mark.resolvedColor) {
            return (
              <span key={markIndex} style={{ color: mark.resolvedColor }}>
                {child}
              </span>
            );
          }
          return child;
        }, content)}
      </span>
    );
  });
}

function PreviewIssueList({ issues }: { issues: RendererIssue[] }) {
  if (issues.length === 0) {
    return null;
  }
  return (
    <ul
      style={{
        marginTop: "8px",
        paddingLeft: "20px",
        fontSize: "13px",
        color: "#b45309",
        listStyle: "disc",
      }}
    >
      {issues.map((issue, index) => (
        <li key={`${issue.code}-${index}`}>
          [{issue.code}] {issue.message}
        </li>
      ))}
    </ul>
  );
}

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

function StreamingCaret() {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: "2px",
        height: "1em",
        marginLeft: "2px",
        verticalAlign: "text-bottom",
        backgroundColor: "var(--preview-text-accent, #576b95)",
        animation: "preview-caret-blink 1s step-end infinite",
      }}
    />
  );
}

function PreviewBlockOutput({
  output,
  showStreamingCaret,
}: {
  output: RendererOutputPlaceholder;
  showStreamingCaret?: boolean;
}) {
  switch (output.kind) {
    case "title_block_preview": {
      const badge = output.slots.badge?.content;
      const numberedPrefix =
        output.layoutMode === "numbered" && badge ? `${badge} ` : "";

      return (
        <PreviewShell
          style={previewTitleContainerStyle(output.layoutMode, output.blockType)}
          variantId={output.variantId}
        >
          {output.layoutMode === "top_badge" && badge ? (
            <p style={previewTitleBadgeStyle()}>{badge}</p>
          ) : null}
          {output.blockType === "heading" ? (
            <h2 style={previewTitleTextStyle("heading")}>
              {numberedPrefix}
              {output.text}
              {showStreamingCaret ? <StreamingCaret /> : null}
            </h2>
          ) : (
            <h1 style={previewTitleTextStyle("title")}>
              {numberedPrefix}
              {output.text}
              {showStreamingCaret ? <StreamingCaret /> : null}
            </h1>
          )}
        </PreviewShell>
      );
    }
    case "text_block_preview":
      return (
        <PreviewShell
          style={previewTextBlockContainerStyle(output.layout, output.blockType)}
          variantId={output.variantId}
        >
          <p style={previewTextBlockTypography(output.layout, output.blockType)}>
            {renderInlineNodes(output.nodes)}
            {showStreamingCaret ? <StreamingCaret /> : null}
          </p>
        </PreviewShell>
      );
    case "divider_preview":
      return (
        <PreviewShell
          style={previewDividerStyle(output.layout)}
          variantId={output.variantId}
        >
          {output.layout === "section_space" ? null : <span aria-hidden="true" />}
        </PreviewShell>
      );
    case "list_preview":
      return (
        <PreviewShell
          style={previewListContainerStyle()}
          variantId={output.variantId}
        >
          {output.items.map((item) => {
            const itemContent = (
              <>
                <div>
                  {output.layout === "checklist_cards" ? "✓ " : null}
                  {output.layout === "plain_bullets" && !output.ordered ? "• " : null}
                  {output.layout === "numbered_steps" ? `${item.marker} ` : null}
                  {item.text}
                </div>
                {item.subItems.length > 0
                  ? item.subItems.map((subItem, index) => (
                      <p key={index} style={previewListSubItemStyle()}>
                        {output.layout === "numbered_steps" ? "· " : "◦ "}
                        {subItem}
                      </p>
                    ))
                  : null}
              </>
            );

            if (output.layout === "checklist_cards") {
              return (
                <div key={item.sourceIndex} style={previewListChecklistItemStyle()}>
                  {itemContent}
                </div>
              );
            }

            return (
              <div key={item.sourceIndex} style={previewListItemStyle()}>
                {itemContent}
              </div>
            );
          })}
        </PreviewShell>
      );
    case "quote_preview":
      return (
        <PreviewShell
          style={previewQuoteContainerStyle(output.layout)}
          variantId={output.variantId}
        >
          <p style={previewQuoteTextStyle()}>{output.text}</p>
          {output.attribution ? (
            <p style={previewQuoteAttributionStyle()}>— {output.attribution}</p>
          ) : null}
        </PreviewShell>
      );
    case "highlight_preview":
      return (
        <PreviewShell
          style={previewHighlightContainerStyle(output.layout)}
          variantId={output.variantId}
        >
          {output.label ? <p style={previewHighlightLabelStyle()}>{output.label}</p> : null}
          <p style={previewHighlightTextStyle()}>{output.text}</p>
        </PreviewShell>
      );
    case "info_card_preview":
      return (
        <PreviewShell
          style={previewInfoCardContainerStyle(output.layout)}
          variantId={output.variantId}
        >
          {output.icon ? <p style={previewInfoCardIconStyle()}>{output.icon}</p> : null}
          {output.title ? (
            <p style={previewInfoCardTitleStyle(output.layout)}>{output.title}</p>
          ) : null}
          {output.layout === "steps" && output.bodyLines.length > 0
            ? output.bodyLines.map((line, index) => (
                <p
                  key={index}
                  style={{
                    ...previewInfoCardBodyStyle(output.layout),
                    marginBottom: index === output.bodyLines.length - 1 ? 0 : "6px",
                  }}
                >
                  {index + 1}. {line}
                </p>
              ))
            : (
              <p style={previewInfoCardBodyStyle(output.layout)}>{output.body}</p>
            )}
        </PreviewShell>
      );
    case "cta_preview":
      return (
        <PreviewShell
          style={previewCtaContainerStyle(output.layout)}
          variantId={output.variantId}
        >
          <p style={previewCtaTextStyle()}>{output.text}</p>
          {output.layout === "button_like" ? (
            <p style={previewCtaButtonStyle()}>
              {output.action ?? "Action placeholder (not clickable)"}
            </p>
          ) : output.action ? (
            <p style={previewCtaActionStyle()}>{output.action}</p>
          ) : null}
          {output.layout === "qr_placeholder" ? (
            <div style={previewCtaQrPlaceholderStyle()}>{output.placeholderLabel}</div>
          ) : null}
        </PreviewShell>
      );
    case "image_placeholder_preview":
      return (
        <PreviewShell
          style={previewImagePlaceholderContainerStyle(output.layout)}
          variantId={output.variantId}
        >
          <div style={previewImagePlaceholderBoxStyle()}>
            {output.placeholderLabel} ({output.aspectRatio}, {output.position})
          </div>
          {output.caption ? (
            <p style={previewImageCaptionStyle()}>{output.caption}</p>
          ) : null}
          {output.suggestion ? (
            <p style={previewImageSuggestionStyle()}>{output.suggestion}</p>
          ) : null}
        </PreviewShell>
      );
    case "preview_placeholder":
      return (
        <p style={{ fontSize: "14px", color: PREVIEW_THEME.textMuted }}>
          Preview placeholder for {output.blockId}
        </p>
      );
    default:
      return (
        <p style={{ fontSize: "14px", color: "#dc2626" }}>
          Unsupported preview output kind: {(output as { kind?: string }).kind ?? "unknown"}
        </p>
      );
  }
}

export function PreviewBlockView({
  block,
  showStreamingCaret,
}: {
  block: SerializedPreviewBlock;
  showStreamingCaret?: boolean;
}) {
  if (!block.ok || !block.output) {
    return (
      <section
        style={{
          margin: "12px 0",
          padding: "12px 16px",
          border: "1px solid #fecaca",
          backgroundColor: "#fef2f2",
          borderRadius: "8px",
        }}
      >
        <p style={{ fontSize: "14px", fontWeight: 600, color: "#b91c1c" }}>
          Preview failed for {block.blockType} ({block.blockId})
        </p>
        <PreviewIssueList issues={block.issues} />
      </section>
    );
  }

  return (
    <>
      <PreviewBlockOutput output={block.output} showStreamingCaret={showStreamingCaret} />
      <PreviewIssueList issues={[...block.issues, ...block.warnings]} />
    </>
  );
}

export function ArticlePreviewPanel({
  blocks,
  activeBlockId,
  showStreamingCaret,
  disableBlockRevealAnimation = false,
  colorPalette = "default",
}: {
  blocks: SerializedPreviewBlock[];
  activeBlockId?: string | null;
  showStreamingCaret?: boolean;
  disableBlockRevealAnimation?: boolean;
  colorPalette?: PreviewColorPaletteId;
}) {
  return (
    <div
      style={{
        ...previewArticleContainerStyle(),
        ...previewPaletteCssVariables(colorPalette),
      }}
      data-testid="article-preview-panel"
    >
      <style>{`
        @keyframes preview-caret-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes preview-block-reveal {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {blocks.map((block, index) => (
        <div
          key={block.blockId}
          id={`preview-block-${block.blockId}`}
          style={
            disableBlockRevealAnimation
              ? undefined
              : {
                  animation: "preview-block-reveal 320ms ease-out both",
                  animationDelay: `${Math.min(index * 40, 200)}ms`,
                }
          }
        >
          <PreviewBlockView
            block={block}
            showStreamingCaret={
              showStreamingCaret && activeBlockId != null && block.blockId === activeBlockId
            }
          />
        </div>
      ))}
    </div>
  );
}
