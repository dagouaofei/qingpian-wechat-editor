import type { Article } from "@/core/article";
import type { HeadingBlock, TitleBlock } from "@/core/blocks";
import type { TitleBlockLayoutMode } from "@/core/styles";
import type { ThemePaletteTokens } from "@/core/styles/theme-palette-tokens";
import { resolveThemePaletteTokens } from "@/core/styles/theme-palette-tokens";

import {
  copySafeAccentBarStyle,
  copySafeHeadingSectionStyle,
  copySafeIconCapsuleStyle,
  copySafeIconPrefixWrapStyle,
  copySafeNumberBadgeStyle,
} from "@/core/copy/title-heading-copy-styles";
import {
  copySafeHighlightMarkerTextStyle,
  copySafeNumberedSectionBadgeStyle,
} from "./heading-publish-decoration";
import {
  headingPreviewMagazineOffsetSectionStyle,
  headingPreviewOrdinalStyle,
  headingPreviewShortLineUnderlineStyle,
  headingPreviewTopicPillStyle,
} from "./heading-publish-visual";
import { resolveHeadingIndexLabel } from "./heading-ordinal";
import {
  resolveTitleHeadingIconAssetId,
  resolveTitleHeadingIconGlyph,
  titleHeadingUsesCardTitleFrame,
  titleHeadingUsesCornerAccent,
} from "./title-heading-assets";
import type { TitleBlockTypography } from "./text-style";
import type { TitleBlockPreviewOutput } from "./types";

export type TitleHeadingPresentation = {
  badgeText?: string;
  decorationLabel?: string;
  indexLabel?: string;
  iconAssetId?: string;
  iconGlyph?: string;
  iconCapsuleLabel?: string;
  cardTitleFrame?: boolean;
  cornerAccent?: boolean;
};

export function resolveTitleHeadingPresentation(
  layoutMode: TitleBlockLayoutMode,
  blockType: "title" | "heading",
  block: TitleBlock | HeadingBlock,
  slots: TitleBlockPreviewOutput["slots"],
  variantId: string,
  article?: Article,
): TitleHeadingPresentation {
  const badgeSlot = slots.badge;
  const decorationSlot = slots.decoration;

  const usesHeadingOrdinal =
    blockType === "heading" &&
    (layoutMode === "numbered" ||
      layoutMode === "minimal_number" ||
      layoutMode === "magazine_left_bar" ||
      layoutMode === "card");

  const indexLabel = usesHeadingOrdinal
    ? resolveHeadingIndexLabel(article, block.id, block.meta?.sourceIndex)
    : badgeSlot?.content ??
      (block.meta?.sourceIndex != null
        ? String(block.meta.sourceIndex).padStart(2, "0")
        : undefined);

  let badgeText = badgeSlot?.content;
  if (layoutMode === "top_badge") {
    badgeText = badgeText ?? block.meta?.label ?? (blockType === "heading" ? "话题" : "精选");
  }
  if (layoutMode === "magazine_left_bar" && blockType === "heading") {
    badgeText = block.meta?.label ?? "SECTION";
  }

  let decorationLabel = decorationSlot?.content;
  if (layoutMode === "left_bar") {
    decorationLabel =
      decorationLabel ?? (blockType === "title" ? "主标题" : "SECTION");
  }

  const iconAssetId =
    slots.icon?.content ??
    resolveTitleHeadingIconAssetId(variantId, blockType, layoutMode);
  const iconGlyph = resolveTitleHeadingIconGlyph(iconAssetId);

  return {
    badgeText,
    decorationLabel,
    indexLabel,
    iconAssetId,
    iconGlyph: iconGlyph.glyph,
    iconCapsuleLabel: iconGlyph.capsuleLabel,
    cardTitleFrame: titleHeadingUsesCardTitleFrame(variantId),
    cornerAccent: titleHeadingUsesCornerAccent(variantId),
  };
}

export function titleHeadingIconCapsuleStyle(
  palette: ThemePaletteTokens,
  blockType: "title" | "heading" = "title",
): Record<string, string> {
  if (blockType === "heading") {
    return copySafeIconCapsuleStyle(palette);
  }
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    minWidth: "32px",
    borderRadius: "8px",
    background: `linear-gradient(145deg, ${palette.bgBandBlue} 0%, ${palette.bgSoft} 100%)`,
    border: `1px solid ${palette.borderSoft}`,
    color: palette.textAccent,
    fontSize: "15px",
    fontWeight: "700",
    lineHeight: "1",
    boxShadow: `0 1px 2px ${palette.borderSoft}`,
  };
}

export function titleHeadingCardTitleFrameStyle(palette: ThemePaletteTokens): Record<string, string> {
  return {
    position: "relative",
    margin: "32px 0",
    padding: "22px 28px 20px",
    textAlign: "center",
    borderRadius: "12px",
    border: `1px solid ${palette.borderSoft}`,
    background: `linear-gradient(165deg, ${palette.bgBandBlue} 0%, #ffffff 55%, ${palette.bgSoft} 100%)`,
    boxShadow: `0 8px 24px -12px ${palette.borderLight}`,
  };
}

export function titleHeadingCornerAccentStyle(palette: ThemePaletteTokens): Record<string, string> {
  return {
    position: "absolute",
    width: "10px",
    height: "10px",
    borderColor: palette.textAccent,
    borderStyle: "solid",
  };
}

export function titleHeadingAccentBarStyle(
  palette: ThemePaletteTokens,
  blockType: "title" | "heading",
): Record<string, string> {
  if (blockType === "heading") {
    return copySafeAccentBarStyle(palette, "heading");
  }
  const width = "5px";
  return {
    width,
    minWidth: width,
    alignSelf: "stretch",
    borderRadius: "2px",
    background: `linear-gradient(180deg, ${palette.textAccent} 0%, ${palette.borderLight} 100%)`,
  };
}

export function titleHeadingNumberBadgeStyle(
  palette: ThemePaletteTokens,
  blockType: "title" | "heading" = "title",
): Record<string, string> {
  if (blockType === "heading") {
    return copySafeNumberedSectionBadgeStyle(palette);
  }
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: palette.bgBandBlue,
    border: `1px solid ${palette.borderSoft}`,
    color: palette.textAccent,
    fontSize: "14px",
    fontWeight: "700",
    lineHeight: "1",
    flexShrink: "0",
  };
}

export function titleHeadingTopicPillStyle(palette: ThemePaletteTokens): Record<string, string> {
  return {
    display: "inline-block",
    margin: "0 auto 8px",
    padding: "4px 14px",
    borderRadius: "999px",
    border: `1px solid ${palette.textAccent}`,
    backgroundColor: palette.bgSoft,
    color: palette.textAccent,
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.08em",
    lineHeight: "1.4",
    textAlign: "center",
  };
}

export function titleHeadingEditorialLineStyle(palette: ThemePaletteTokens): Record<string, string> {
  return {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "10px",
    width: "100%",
    maxWidth: "280px",
    marginLeft: "auto",
    marginRight: "auto",
  };
}

export function titleHeadingLineSegmentStyle(palette: ThemePaletteTokens): Record<string, string> {
  return {
    flex: "1",
    height: "2px",
    background: `linear-gradient(90deg, transparent, ${palette.textAccent}, transparent)`,
  };
}

export function titleHeadingLineCapStyle(palette: ThemePaletteTokens): Record<string, string> {
  return {
    width: "6px",
    height: "6px",
    borderRadius: "1px",
    backgroundColor: palette.textAccent,
    transform: "rotate(45deg)",
    flexShrink: "0",
  };
}

export function resolveTitleHeadingPaletteFromTypography(
  typography: TitleBlockTypography,
): ThemePaletteTokens {
  return resolveThemePaletteTokens({
    color: {
      "text.default": typography.color,
      "text.accent": typography.accentColor ?? typography.color,
      "text.muted": typography.mutedColor ?? typography.color,
      "bg.soft": typography.mutedColor ?? "#f9f9f9",
      "bg.band.blue": typography.mutedColor ?? "#f5f7fb",
      "border.light": typography.accentColor ?? "#cccccc",
      "border.soft": typography.mutedColor ?? "#eeeeee",
    },
  });
}

export function paletteAccentWithAlpha(palette: ThemePaletteTokens, alphaHex: string): string {
  const raw = palette.textAccent.replace("#", "");
  if (raw.length === 6) {
    return `#${raw}${alphaHex}`;
  }
  return palette.textAccent;
}

export function titleHeadingHighlightMarkerTextStyle(
  palette: ThemePaletteTokens,
  blockType: "title" | "heading" = "title",
): Record<string, string> {
  if (blockType === "heading") {
    return copySafeHighlightMarkerTextStyle(palette);
  }
  const soft = paletteAccentWithAlpha(palette, "24");
  const mid = paletteAccentWithAlpha(palette, "38");
  return {
    display: "inline",
    margin: "0",
    padding: "0 4px 2px",
    background: `linear-gradient(180deg, transparent 56%, ${soft} 56%, ${mid} 84%, transparent 92%)`,
  };
}

export function titleHeadingShortLineWrapStyle(palette: ThemePaletteTokens): Record<string, string> {
  return {
    padding: "2px 0 2px 2px",
    borderLeft: `2px solid ${paletteAccentWithAlpha(palette, "44")}`,
  };
}

export function titleHeadingShortLineBarStyle(
  palette: ThemePaletteTokens,
  blockType: "title" | "heading" = "title",
): Record<string, string> {
  if (blockType === "heading") {
    return headingPreviewShortLineUnderlineStyle(palette) as Record<string, string>;
  }
  return {
    height: "1px",
    marginTop: "8px",
    background: palette.borderLight,
    opacity: "0.85",
  };
}

export function titleHeadingIconPrefixWrapStyle(
  palette: ThemePaletteTokens,
  blockType: "title" | "heading" = "title",
): Record<string, string> {
  if (blockType === "heading") {
    return copySafeIconPrefixWrapStyle(palette);
  }
  return {
    paddingLeft: "12px",
    borderLeft: `3px solid ${palette.textAccent}`,
  };
}

export function titleHeadingMinimalNumberLabelStyle(
  palette: ThemePaletteTokens,
  blockType: "title" | "heading" = "title",
): Record<string, string> {
  if (blockType === "heading") {
    return headingPreviewOrdinalStyle(palette) as Record<string, string>;
  }
  return {
    fontSize: "11px",
    fontWeight: "600",
    color: palette.textMuted,
    letterSpacing: "0.08em",
    minWidth: "26px",
    textAlign: "right",
    fontVariantNumeric: "tabular-nums",
  };
}

export function titleHeadingMagazineOffsetCardStyle(
  palette: ThemePaletteTokens,
  blockType: "title" | "heading" = "title",
): Record<string, string> {
  if (blockType === "heading") {
    return headingPreviewMagazineOffsetSectionStyle(palette) as Record<string, string>;
  }
  return {
    marginRight: "26px",
    marginBottom: "2px",
    padding: "16px 20px 18px 22px",
    background: `linear-gradient(145deg, ${palette.bgBandBlue} 0%, ${palette.bgSoft} 55%, #ffffff 100%)`,
    border: `1px solid ${palette.borderSoft}`,
    borderLeft: `4px solid ${palette.textAccent}`,
    borderRadius: "12px",
    boxShadow: `0 2px 8px ${paletteAccentWithAlpha(palette, "44")}`,
  };
}

export function titleHeadingTopicPillStyleForBlock(
  palette: ThemePaletteTokens,
  blockType: "title" | "heading",
): Record<string, string> {
  if (blockType === "heading") {
    return headingPreviewTopicPillStyle(palette) as Record<string, string>;
  }
  return titleHeadingTopicPillStyle(palette);
}

export function titleHeadingCardTitleFrameStyleForBlock(
  palette: ThemePaletteTokens,
  blockType: "title" | "heading",
): Record<string, string> {
  if (blockType === "heading") {
    return copySafeHeadingSectionStyle();
  }
  return titleHeadingCardTitleFrameStyle(palette);
}
