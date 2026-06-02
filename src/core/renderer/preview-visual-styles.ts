import type { CSSProperties } from "react";

import type { TitleBlockLayoutMode } from "@/core/styles";

import type { CtaLayoutKind } from "./cta-layout";
import type { DividerLayoutKind } from "./divider-layout";
import type { HighlightLayoutKind } from "./highlight-layout";
import type { ImagePlaceholderLayoutKind } from "./image-placeholder-layout";
import type { InfoCardLayoutKind } from "./info-card-layout";
import type { QuoteLayoutKind } from "./quote-layout";
import type { TextBlockLayoutKind } from "./text-block-typography";

/** Shared preview theme tokens aligned with first-wave Copy Renderer defaults. */
export const PREVIEW_THEME = {
  textDefault: "#333333",
  textMuted: "#666666",
  textAccent: "#576b95",
  borderLight: "#cccccc",
  borderSoft: "#eeeeee",
  bgSoft: "#f9f9f9",
  bgBand: "#f5f5f5",
  bgBandBlue: "#f5f7fb",
  bgSteps: "#f8fafc",
  bgWarning: "#fff8e6",
  warningColor: "#b36b00",
  warningText: "#5f3b00",
} as const;

/** CSS-variable aware preview tokens (palette can override via container vars). */
const PV = {
  textDefault: "var(--preview-text-default, #333333)",
  textMuted: "var(--preview-text-muted, #666666)",
  textAccent: "var(--preview-text-accent, #576b95)",
  borderLight: "var(--preview-border-light, #cccccc)",
  borderSoft: "var(--preview-border-soft, #eeeeee)",
  bgSoft: "var(--preview-bg-soft, #f9f9f9)",
  bgBand: "var(--preview-bg-band, #f5f5f5)",
  bgBandBlue: "var(--preview-bg-band-blue, #f5f7fb)",
  bgSteps: "var(--preview-bg-steps, #f8fafc)",
  bgWarning: "var(--preview-bg-warning, #fff8e6)",
  warningColor: "var(--preview-warning-color, #b36b00)",
  warningText: "var(--preview-warning-text, #5f3b00)",
} as const;

export function previewArticleContainerStyle(): CSSProperties {
  return {
    maxWidth: "677px",
    margin: "0 auto",
    padding: "16px 20px 24px",
    backgroundColor: "#ffffff",
    fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
    color: PV.textDefault,
  };
}

export function previewTitleContainerStyle(
  layoutMode: TitleBlockLayoutMode,
  blockType: "title" | "heading",
): CSSProperties {
  const marginBlock = blockType === "title" ? "28px" : "22px";
  const base: CSSProperties = { margin: `${marginBlock} 0` };

  switch (layoutMode) {
    case "plain":
      return {
        ...base,
        textAlign: blockType === "title" ? "center" : "left",
        padding: blockType === "title" ? "0 12px" : undefined,
      };
    case "left_bar":
      return {
        ...base,
        borderLeft: `${blockType === "title" ? 5 : 3}px solid ${PV.textAccent}`,
        paddingLeft: blockType === "title" ? "14px" : "12px",
        backgroundColor: blockType === "title" ? PV.bgSoft : undefined,
      };
    case "bottom_line":
      return {
        ...base,
        textAlign: "center",
        paddingBottom: "10px",
        borderBottom: `2px solid ${PV.textAccent}`,
      };
    case "numbered":
      return {
        ...base,
        paddingLeft: "4px",
      };
    case "top_badge":
      return {
        ...base,
        textAlign: "center",
        padding: "12px 16px 8px",
        backgroundColor: PV.bgBandBlue,
        borderRadius: "8px",
      };
    default:
      return base;
  }
}

export function previewTitleTextStyle(blockType: "title" | "heading"): CSSProperties {
  return {
    margin: 0,
    color: PV.textDefault,
    fontSize: blockType === "title" ? "24px" : "17px",
    fontWeight: blockType === "title" ? 700 : 600,
    lineHeight: blockType === "title" ? 1.35 : 1.45,
    letterSpacing: blockType === "title" ? "0.02em" : undefined,
  };
}

export function previewTitleBadgeStyle(): CSSProperties {
  return {
    margin: "0 0 6px",
    color: PV.textAccent,
    fontSize: "11px",
    fontWeight: 600,
    lineHeight: 1.4,
    textAlign: "center",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  };
}

export function previewTextBlockContainerStyle(
  layout: TextBlockLayoutKind,
  blockType: "lead" | "paragraph",
): CSSProperties {
  const marginBlock = blockType === "lead" ? "18px" : "16px";
  const base: CSSProperties = { margin: `${marginBlock} 0` };

  switch (layout) {
    case "plain":
      return base;
    case "accent_band":
      return {
        ...base,
        padding: "12px 16px",
        backgroundColor: PV.bgBand,
        borderLeft: `4px solid ${PV.textAccent}`,
      };
    case "quote_intro":
      return {
        ...base,
        paddingLeft: "12px",
        borderLeft: `3px solid ${PV.borderLight}`,
      };
    case "accent_left":
      return {
        ...base,
        paddingLeft: "12px",
        borderLeft: `3px solid ${PV.textAccent}`,
      };
    case "soft_card":
      return {
        ...base,
        padding: "12px 16px",
        backgroundColor: PV.bgSoft,
        border: `1px solid ${PV.borderSoft}`,
        borderRadius: "8px",
      };
    default:
      return base;
  }
}

export function previewTextBlockTypography(
  layout: TextBlockLayoutKind,
  blockType: "lead" | "paragraph",
): CSSProperties {
  return {
    margin: 0,
    color: PV.textDefault,
    fontSize: blockType === "lead" ? "17px" : "16px",
    fontWeight: 400,
    lineHeight: blockType === "lead" ? 1.6 : 1.75,
    fontStyle: layout === "quote_intro" ? "italic" : "normal",
  };
}

export function previewDividerStyle(layout: DividerLayoutKind): CSSProperties {
  switch (layout) {
    case "simple_line":
      return {
        margin: "24px 0",
        borderTop: `1px solid ${PV.borderLight}`,
        height: 0,
      };
    case "dotted_line":
      return {
        margin: "24px 0",
        borderTop: `1px dashed ${PV.borderLight}`,
        height: 0,
      };
    case "section_space":
      return {
        margin: 0,
        height: "32px",
      };
    default:
      return { margin: "24px 0" };
  }
}

export function previewListContainerStyle(): CSSProperties {
  return {
    margin: "16px 0",
    color: PV.textDefault,
    fontSize: "16px",
    lineHeight: 1.75,
  };
}

export function previewListItemStyle(): CSSProperties {
  return {
    margin: "0 0 8px",
    color: PV.textDefault,
    fontSize: "16px",
    lineHeight: 1.75,
  };
}

export function previewListChecklistItemStyle(): CSSProperties {
  return {
    margin: "0 0 8px",
    padding: "10px 12px",
    border: `1px solid ${PV.borderSoft}`,
    borderRadius: "8px",
    backgroundColor: PV.bgSoft,
  };
}

export function previewListSubItemStyle(): CSSProperties {
  return {
    margin: "2px 0 0 20px",
    color: PV.textMuted,
    fontSize: "15px",
    lineHeight: 1.65,
  };
}

export function previewQuoteContainerStyle(layout: QuoteLayoutKind): CSSProperties {
  const base: CSSProperties = { margin: "16px 0" };

  switch (layout) {
    case "plain":
      return base;
    case "left_bar":
      return {
        ...base,
        paddingLeft: "12px",
        borderLeft: `3px solid ${PV.textAccent}`,
      };
    case "card":
      return {
        ...base,
        padding: "12px 16px",
        backgroundColor: PV.bgSoft,
        border: `1px solid ${PV.borderSoft}`,
        borderRadius: "8px",
      };
    default:
      return base;
  }
}

export function previewQuoteTextStyle(): CSSProperties {
  return {
    margin: 0,
    color: PV.textDefault,
    fontSize: "16px",
    lineHeight: 1.75,
  };
}

export function previewQuoteAttributionStyle(): CSSProperties {
  return {
    margin: "8px 0 0",
    color: PV.textMuted,
    fontSize: "14px",
    lineHeight: 1.6,
    textAlign: "right",
  };
}

export function previewHighlightContainerStyle(
  layout: HighlightLayoutKind,
): CSSProperties {
  const base: CSSProperties = { margin: "16px 0" };

  switch (layout) {
    case "inline_emphasis":
      return {
        ...base,
        paddingLeft: "8px",
        borderLeft: `2px solid ${PV.textAccent}`,
      };
    case "accent_band":
      return {
        ...base,
        padding: "10px 14px",
        backgroundColor: PV.bgBandBlue,
        borderLeft: `4px solid ${PV.textAccent}`,
      };
    case "soft_card":
      return {
        ...base,
        padding: "12px 16px",
        backgroundColor: PV.bgSoft,
        border: `1px solid ${PV.borderSoft}`,
        borderRadius: "8px",
      };
    default:
      return base;
  }
}

export function previewHighlightLabelStyle(): CSSProperties {
  return {
    margin: "0 0 6px",
    color: PV.textAccent,
    fontSize: "13px",
    lineHeight: 1.5,
    fontWeight: 600,
  };
}

export function previewHighlightTextStyle(): CSSProperties {
  return {
    margin: 0,
    color: PV.textDefault,
    fontSize: "16px",
    lineHeight: 1.75,
  };
}

export function previewInfoCardContainerStyle(
  layout: InfoCardLayoutKind,
): CSSProperties {
  const base: CSSProperties = { margin: "16px 0", padding: "12px 16px" };

  switch (layout) {
    case "key_takeaway":
      return {
        ...base,
        backgroundColor: PV.bgSoft,
        border: `1px solid ${PV.textAccent}`,
        borderRadius: "8px",
      };
    case "steps":
      return {
        ...base,
        backgroundColor: PV.bgSteps,
        border: `1px solid ${PV.borderSoft}`,
        borderRadius: "8px",
      };
    case "warning_note":
      return {
        ...base,
        backgroundColor: PV.bgWarning,
        borderLeft: `4px solid ${PV.warningColor}`,
      };
    default:
      return base;
  }
}

export function previewInfoCardTitleStyle(layout: InfoCardLayoutKind): CSSProperties {
  return {
    margin: "0 0 8px",
    color:
      layout === "warning_note" ? PV.warningColor : PV.textAccent,
    fontSize: "16px",
    fontWeight: 600,
    lineHeight: 1.6,
  };
}

export function previewInfoCardIconStyle(): CSSProperties {
  return {
    margin: "0 0 6px",
    color: PV.textMuted,
    fontSize: "13px",
    lineHeight: 1.5,
  };
}

export function previewInfoCardBodyStyle(layout: InfoCardLayoutKind): CSSProperties {
  return {
    margin: 0,
    color: layout === "warning_note" ? PV.warningText : PV.textDefault,
    fontSize: "16px",
    lineHeight: 1.75,
    whiteSpace: "pre-line",
  };
}

export function previewCtaContainerStyle(layout: CtaLayoutKind): CSSProperties {
  const base: CSSProperties = { margin: "16px 0" };

  switch (layout) {
    case "plain_text":
      return base;
    case "button_like":
      return {
        ...base,
        padding: "12px 16px",
        border: `1px solid ${PV.textAccent}`,
        borderRadius: "8px",
        backgroundColor: PV.bgSoft,
      };
    case "qr_placeholder":
      return {
        ...base,
        padding: "12px 16px",
        border: `1px solid ${PV.borderSoft}`,
        borderRadius: "8px",
        backgroundColor: PV.bgSoft,
      };
    default:
      return base;
  }
}

export function previewCtaTextStyle(): CSSProperties {
  return {
    margin: 0,
    color: PV.textDefault,
    fontSize: "16px",
    lineHeight: 1.75,
  };
}

export function previewCtaActionStyle(): CSSProperties {
  return {
    margin: "8px 0 0",
    color: PV.textAccent,
    fontSize: "15px",
    lineHeight: 1.6,
    fontWeight: 600,
  };
}

export function previewCtaButtonStyle(): CSSProperties {
  return {
    margin: "10px 0 0",
    padding: "6px 12px",
    color: PV.textAccent,
    fontSize: "15px",
    lineHeight: 1.5,
    fontWeight: 600,
    textAlign: "center",
    border: `1px solid ${PV.textAccent}`,
    borderRadius: "16px",
  };
}

export function previewCtaQrPlaceholderStyle(): CSSProperties {
  return {
    margin: "10px 0 0",
    padding: "12px",
    border: `1px dashed ${PV.borderLight}`,
    backgroundColor: PV.bgSoft,
    color: PV.textMuted,
    fontSize: "14px",
    lineHeight: 1.6,
    textAlign: "center",
  };
}

export function previewImagePlaceholderContainerStyle(
  layout: ImagePlaceholderLayoutKind,
): CSSProperties {
  const base: CSSProperties = { margin: "16px 0" };

  switch (layout) {
    case "simple":
      return base;
    case "caption":
      return base;
    case "card":
      return {
        ...base,
        padding: "12px",
        border: `1px solid ${PV.borderSoft}`,
        borderRadius: "8px",
        backgroundColor: "#ffffff",
      };
    default:
      return base;
  }
}

export function previewImagePlaceholderBoxStyle(): CSSProperties {
  return {
    margin: 0,
    padding: "22px 12px",
    border: `1px dashed ${PV.borderLight}`,
    backgroundColor: PV.bgSoft,
    color: PV.textMuted,
    fontSize: "13px",
    lineHeight: 1.6,
    textAlign: "center",
  };
}

export function previewImageCaptionStyle(): CSSProperties {
  return {
    margin: "8px 0 0",
    color: PV.textDefault,
    fontSize: "16px",
    lineHeight: 1.75,
    textAlign: "center",
  };
}

export function previewImageSuggestionStyle(): CSSProperties {
  return {
    margin: "6px 0 0",
    color: PV.textMuted,
    fontSize: "13px",
    lineHeight: 1.6,
    textAlign: "center",
  };
}
