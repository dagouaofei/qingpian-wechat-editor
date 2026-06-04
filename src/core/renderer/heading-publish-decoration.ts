/**
 * Heading publish pool — single source for Preview/Copy decoration tokens + paste contract.
 * PO 手测项应映射到 `HEADING_PUBLISH_COPY_CONTRACT`，避免逐款肉眼改 HTML。
 * @see docs/product/heading-publish-catalog.md
 */

import type { ResolvedBlockStyle } from "@/core/styles";
import type { ThemePaletteTokens } from "@/core/styles/theme-palette-tokens";
import { resolveThemePaletteTokens } from "@/core/styles/theme-palette-tokens";
import { HEADING_PUBLISH_VARIANT_IDS } from "@/core/styles/variants/heading-publish-pool";

import type { TitleHeadingPresentation } from "./title-heading-visual";

/** Preview 与 Copy 必须使用同一套 theme palette（禁止 typography 近似映射） */
export function resolveHeadingPublishPaletteFromResolvedStyle(
  resolvedBlockStyle: ResolvedBlockStyle,
): ThemePaletteTokens {
  return resolveThemePaletteTokens(resolvedBlockStyle.tokens.theme);
}

/** 图标前缀固定字形（Copy/Preview 一致，避免 capsule 汉字「节」） */
export const HEADING_PUBLISH_ICON_PREFIX_GLYPH = "▸";

export function resolveHeadingPublishIconLabel(
  presentation: TitleHeadingPresentation,
  variantId?: string,
): string {
  if (variantId === "heading_icon_prefix") {
    return HEADING_PUBLISH_ICON_PREFIX_GLYPH;
  }
  return presentation.iconGlyph ?? presentation.iconCapsuleLabel ?? "▸";
}

/**
 * 简单「图标/编号 + 标题」行：用 inline 兄弟节点，不用 table（微信易错位、字形不一致）。
 */
export const HEADING_PUBLISH_USE_INLINE_ROW = true;

/** 全池 Copy 禁止项（微信表格退化、满宽装饰等） */
export const HEADING_PUBLISH_COMMON_COPY_FORBIDDEN: RegExp[] = [
  /<table[^>]*width:\s*100%/i,
  /width:\s*100%[^>]*<\/table/i,
];

/** icon_prefix 不得再用 table 行布局 */
export const HEADING_PUBLISH_ICON_PREFIX_COPY_FORBIDDEN: RegExp[] = [/<table/i];

export type HeadingPublishVariantId = (typeof HEADING_PUBLISH_VARIANT_IDS)[number];

/** 全池共性：装饰元素默认无灰底填充（胶囊/图标/标题字） */
export const HEADING_PUBLISH_NO_FILL_ON_LABEL = true;

/** 荧光笔 variant 经 PO 粘贴 QA 允许 inline linear-gradient */
export const HEADING_HIGHLIGHT_MARKER_COPY_SAFE_OPTIONS = {
  allowedViolationCodes: ["linear_gradient" as const],
};

export type HeadingPublishCopyContract = {
  /** Copy HTML 必须匹配（装饰存在性） */
  mustMatch: RegExp[];
  /** Copy HTML 不得出现（粘贴退化 / 与 minimal 混淆 / 满宽竖线等） */
  mustNotMatch: RegExp[];
};

/** 8 款 + 共性禁止项 — 用于自动化回归，不等同于粘贴 QA PASS */
export const HEADING_PUBLISH_COPY_CONTRACT: Record<
  HeadingPublishVariantId,
  HeadingPublishCopyContract
> = {
  heading_short_line: {
    mustMatch: [/display:\s*inline-block/i, /border-bottom:\s*2px/i, /width:\s*100%/i],
    mustNotMatch: [/width:\s*200px/i],
  },
  heading_highlight_marker: {
    mustMatch: [
      /<h3\b/i,
      /display:\s*inline/i,
      /linear-gradient\s*\(\s*180deg/i,
      /transparent\s+56%/i,
      /box-decoration-break:\s*clone/i,
      /-webkit-box-decoration-break:\s*clone/i,
    ],
    mustNotMatch: [/<table/i, /display:\s*inline-block/i, /border-bottom:\s*[0-9]+px/i],
  },
  heading_magazine_left_bar: {
    mustMatch: [/border-left:\s*1px/i, /border-left:\s*3px/i],
    mustNotMatch: [/<table/i, /width:\s*100%/i],
  },
  heading_magazine_offset: {
    mustMatch: [
      /border-radius:\s*8px/i,
      /border-left:\s*4px/i,
      /background-color:transparent/i,
    ],
    mustNotMatch: [/border:\s*1px solid[^;]*border\.soft/i],
  },
  heading_numbered_section: {
    mustMatch: [/border-radius:\s*6px/i, /padding:\s*3px 10px/i],
    mustNotMatch: [
      /border-radius:\s*50%/i,
      /width:\s*28px/i,
      /letter-spacing:\s*0\.08em;\s*line-height:\s*1\.4/i,
    ],
  },
  heading_card_centered: {
    mustMatch: [/text-align:\s*center/i, /border-radius:\s*8px/i],
    mustNotMatch: [/border-radius:\s*999px/i, /话题/],
  },
  heading_icon_prefix: {
    mustMatch: [/font-size:\s*20px/i, /vertical-align:\s*middle/i, /▸/],
    mustNotMatch: [
      /<table/i,
      /width:\s*28px;\s*height:\s*28px/i,
      /background-color:[^;]+;\s*[^"]*border:\s*1px/i,
    ],
  },
  heading_minimal_number: {
    mustMatch: [/letter-spacing:\s*0\.08em/i],
    mustNotMatch: [/border-radius:\s*50%/i, /width:\s*26px/i],
  },
};

export function assertHeadingPublishCopyContract(
  html: string,
  variantId: HeadingPublishVariantId,
): string[] {
  const contract = HEADING_PUBLISH_COPY_CONTRACT[variantId];
  const errors: string[] = [];
  for (const pattern of contract.mustMatch) {
    if (!pattern.test(html)) {
      errors.push(`${variantId}: expected match ${pattern}`);
    }
  }
  for (const pattern of contract.mustNotMatch) {
    if (pattern.test(html)) {
      errors.push(`${variantId}: forbidden match ${pattern}`);
    }
  }
  for (const pattern of HEADING_PUBLISH_COMMON_COPY_FORBIDDEN) {
    if (pattern.test(html)) {
      errors.push(`${variantId}: common forbidden ${pattern}`);
    }
  }
  if (variantId === "heading_icon_prefix") {
    for (const pattern of HEADING_PUBLISH_ICON_PREFIX_COPY_FORBIDDEN) {
      if (pattern.test(html)) {
        errors.push(`${variantId}: icon prefix forbidden ${pattern}`);
      }
    }
  }
  return errors;
}

// --- Shared tokens (Preview imports via heading-publish-visual) ---

export function copySafeHeadingSectionStyle(): Record<string, string> {
  return {
    margin: "28px 0 12px",
    padding: "0",
  };
}

export function copySafeHeadingOrdinalStyle(
  palette: ThemePaletteTokens,
): Record<string, string> {
  return {
    display: "inline-block",
    margin: "0 8px 0 0",
    fontSize: "11px",
    fontWeight: "600",
    color: palette.textMuted,
    letterSpacing: "0.08em",
    lineHeight: "1.4",
    fontVariantNumeric: "tabular-nums",
    verticalAlign: "baseline",
  };
}

export function copySafeHeadingSectionKickerStyle(
  palette: ThemePaletteTokens,
): Record<string, string> {
  return {
    margin: "0 0 4px",
    padding: "0",
    fontSize: "10px",
    fontWeight: "600",
    color: palette.textMuted,
    letterSpacing: "0.22em",
    lineHeight: "1.4",
  };
}

export function copySafeShortLineWrapStyle(): Record<string, string> {
  return {
    display: "inline-block",
    margin: "0",
    padding: "0",
    maxWidth: "100%",
  };
}

/** 短线宽度随标题文字（置于 wrap 内 width:100%） */
export function copySafeShortLineUnderlineStyle(
  palette: ThemePaletteTokens,
): Record<string, string> {
  return {
    display: "block",
    width: "100%",
    margin: "8px 0 0",
    padding: "0",
    border: "none",
    borderBottom: `2px solid ${palette.textAccent}`,
    lineHeight: "0",
    fontSize: "0",
  };
}

/** 主题 accent 叠加 8 位 hex 透明度（RRGGBBAA） */
export function paletteAccentWithAlphaHex(
  palette: ThemePaletteTokens,
  alphaHex: string,
): string {
  const raw = palette.textAccent.replace("#", "");
  if (raw.length === 6) {
    return `#${raw}${alphaHex}`;
  }
  return palette.textAccent;
}

/** 荧光笔渐变透明度：弱强调 / 中段（略高于原 14/22，仍克制） */
export const HIGHLIGHT_MARKER_GRADIENT_ALPHA_SOFT = "20";
export const HIGHLIGHT_MARKER_GRADIENT_ALPHA_MID = "33";

/** miaopian 荧光笔纵向渐变 — Preview/Copy 同源 */
export function buildHighlightMarkerGradient(palette: ThemePaletteTokens): string {
  const accentSoft = paletteAccentWithAlphaHex(
    palette,
    HIGHLIGHT_MARKER_GRADIENT_ALPHA_SOFT,
  );
  const accentMid = paletteAccentWithAlphaHex(
    palette,
    HIGHLIGHT_MARKER_GRADIENT_ALPHA_MID,
  );
  return `linear-gradient(180deg,transparent 56%,${accentSoft} 56%,${accentMid} 84%,transparent 92%)`;
}

export function copySafeHighlightMarkerSectionStyle(
  typography: {
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    fontFamily?: string;
    color?: string;
  },
): Record<string, string> {
  return {
    ...copySafeHeadingSectionStyle(),
    textAlign: "left",
    ...(typography.fontFamily ? { fontFamily: typography.fontFamily } : {}),
    ...(typography.color ? { color: typography.color } : {}),
  };
}

export function copySafeHighlightMarkerH3Style(
  palette: ThemePaletteTokens,
  typography: {
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    fontFamily?: string;
    color?: string;
  },
): Record<string, string> {
  return {
    margin: "0",
    padding: "0 4px 2px",
    display: "inline",
    fontSize: typography.fontSize ?? "17px",
    lineHeight: typography.lineHeight ?? "1.45",
    fontWeight: typography.fontWeight ?? "600",
    letterSpacing: "0.02em",
    color: typography.color ?? palette.textDefault,
    background: buildHighlightMarkerGradient(palette),
    boxDecorationBreak: "clone",
    WebkitBoxDecorationBreak: "clone",
    ...(typography.fontFamily ? { fontFamily: typography.fontFamily } : {}),
  };
}

export function copySafeHighlightMarkerSubtitleStyle(
  typography: {
    fontSize?: string;
    lineHeight?: string;
    fontFamily?: string;
    color?: string;
  },
): Record<string, string> {
  return {
    margin: "8px 0 0",
    padding: "0",
    fontSize: typography.fontSize ?? "14px",
    lineHeight: typography.lineHeight ?? "1.5",
    color: typography.color ?? "#666666",
    ...(typography.fontFamily ? { fontFamily: typography.fontFamily } : {}),
  };
}

/** @deprecated 使用 copySafeHighlightMarkerH3Style */
export function copySafeHighlightMarkerTextStyle(
  palette: ThemePaletteTokens,
  typography?: {
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    fontFamily?: string;
    color?: string;
  },
): Record<string, string> {
  return copySafeHighlightMarkerH3Style(palette, typography ?? {});
}

export function copySafeMagazineOffsetSectionStyle(
  palette: ThemePaletteTokens,
): Record<string, string> {
  return {
    margin: "28px 0 12px",
    padding: "14px 18px",
    backgroundColor: "transparent",
    border: `1px solid ${palette.textAccent}`,
    borderLeft: `4px solid ${palette.textAccent}`,
    borderRadius: "8px",
  };
}

/** 编号小节：accent 方牌（非圆章；与极简数字区分） */
export function copySafeNumberedSectionBadgeStyle(
  palette: ThemePaletteTokens,
): Record<string, string> {
  return {
    display: "inline-block",
    minWidth: "32px",
    margin: "0 10px 0 0",
    padding: "3px 10px",
    textAlign: "center",
    borderRadius: "6px",
    backgroundColor: palette.textAccent,
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "700",
    lineHeight: "1.35",
    verticalAlign: "middle",
    fontVariantNumeric: "tabular-nums",
    letterSpacing: "0.04em",
  };
}

/** 卡片居中：外框 + 居中编号 + 标题（透明底，避免误用灰 card 底） */
export function copySafeCardCenteredFrameStyle(
  palette: ThemePaletteTokens,
): Record<string, string> {
  return {
    margin: "28px 0 12px",
    padding: "16px 18px",
    textAlign: "center",
    borderRadius: "8px",
    border: `1px solid ${palette.borderSoft}`,
    backgroundColor: "transparent",
  };
}

export function copySafeCardCenteredIndexStyle(
  palette: ThemePaletteTokens,
): Record<string, string> {
  return {
    display: "block",
    margin: "0 0 10px",
    padding: "0",
    fontSize: "22px",
    fontWeight: "700",
    lineHeight: "1.2",
    color: palette.textAccent,
    textAlign: "center",
    letterSpacing: "0.05em",
    fontVariantNumeric: "tabular-nums",
  };
}

/** 话题胶囊：描边无填充 */
export function copySafeTopicPillStyle(
  palette: ThemePaletteTokens,
): Record<string, string> {
  return {
    display: "inline-block",
    margin: "0 0 8px",
    padding: "4px 14px",
    borderRadius: "999px",
    border: `1px solid ${palette.textAccent}`,
    backgroundColor: "transparent",
    color: palette.textAccent,
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.06em",
    lineHeight: "1.4",
  };
}

/** 图标前缀：无灰底，与标题同一行 inline 紧贴 */
export function copySafeIconPrefixGlyphStyle(
  palette: ThemePaletteTokens,
): Record<string, string> {
  return {
    display: "inline-block",
    margin: "0 6px 0 0",
    padding: "0",
    fontSize: "20px",
    fontWeight: "700",
    lineHeight: "1",
    color: palette.textAccent,
    verticalAlign: "middle",
    backgroundColor: "transparent",
    border: "none",
    fontFamily: "Arial, Helvetica, sans-serif",
  };
}

export function copySafeInlineIconTextRowStyle(
  lineHeight: string,
): Record<string, string> {
  return {
    margin: "0",
    padding: "0",
    lineHeight,
    textAlign: "left",
  };
}

/** 杂志竖线：嵌套 border-left（避免微信把 table 列撑成横条） */
export function copySafeMagazineLeftBarLightRailStyle(
  palette: ThemePaletteTokens,
): Record<string, string> {
  return {
    margin: "0",
    padding: "0 0 0 6px",
    border: "none",
    borderLeft: `1px solid ${palette.borderLight}`,
  };
}

export function copySafeMagazineLeftBarAccentRailStyle(
  palette: ThemePaletteTokens,
): Record<string, string> {
  return {
    margin: "0",
    padding: "2px 0 2px 10px",
    border: "none",
    borderLeft: `3px solid ${palette.textAccent}`,
  };
}
