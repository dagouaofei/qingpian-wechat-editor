/**
 * Miaopian-demo aligned preset / theme bundles (values only — no code copy).
 * @see DECISION-083 · miaopian-demo/config/stylePresets.ts · themePresets.ts
 */

import type { BlockType } from "@/core/blocks";
import type { Density, PresetDefinition, ThemeDefinition } from "@/core/styles";
import { STYLE_SCHEMA_VERSION } from "@/core/styles";

export type MiaopianPresetId =
  | "business"
  | "warm"
  | "magazine"
  | "keynote"
  | "xiaohongshu"
  | "dedao";

export type MiaopianThemeId =
  | "businessBlue"
  | "premiumBlackGold"
  | "creamOrange"
  | "techGrayBlue"
  | "knowledgePurple"
  | "healthGreen";

/** Legacy preview / generation preset ids → miaopian preset */
export const LEGACY_PRESET_ID_ALIASES: Record<string, MiaopianPresetId> = {
  "classic-news": "business",
  classic: "business",
  "business-pro": "business",
  "magazine-editorial": "magazine",
  "brand-story": "warm",
  "lifestyle-vivid": "xiaohongshu",
};

/** Legacy palette ids → miaopian theme */
export const LEGACY_PALETTE_ID_ALIASES: Record<string, MiaopianThemeId> = {
  default: "businessBlue",
  warm: "creamOrange",
  ocean: "techGrayBlue",
  forest: "healthGreen",
  elegant: "knowledgePurple",
  ink: "premiumBlackGold",
};

export const DEFAULT_THEME_FOR_PRESET: Record<MiaopianPresetId, MiaopianThemeId> = {
  business: "businessBlue",
  warm: "creamOrange",
  magazine: "premiumBlackGold",
  keynote: "techGrayBlue",
  xiaohongshu: "creamOrange",
  dedao: "knowledgePurple",
};

const ALL_THEME_IDS: MiaopianThemeId[] = [
  "businessBlue",
  "premiumBlackGold",
  "creamOrange",
  "techGrayBlue",
  "knowledgePurple",
  "healthGreen",
];

function themeColorTokens(colors: {
  textPrimary: string;
  textSecondary: string;
  primary: string;
  border: string;
  background: string;
  cardBackground: string;
  accent: string;
}) {
  return {
    "text.default": colors.textPrimary,
    "text.muted": colors.textSecondary,
    "text.accent": colors.accent,
    "brand.primary": colors.primary,
    "border.light": colors.border,
    "border.soft": colors.border,
    "bg.soft": colors.cardBackground,
    "bg.band": colors.cardBackground,
    "bg.band.blue": colors.background,
    "bg.steps": colors.background,
    "bg.warning": "#fff8e6",
    "warning.color": "#b36b00",
    "warning.text": "#5f3b00",
  };
}

export const MIAOPIAN_THEME_DEFINITIONS: ThemeDefinition[] = [
  {
    id: "businessBlue",
    name: "商务蓝",
    schemaVersion: STYLE_SCHEMA_VERSION,
    tokens: {
      color: themeColorTokens({
        primary: "#1d4ed8",
        accent: "#2563eb",
        textPrimary: "#0f172a",
        textSecondary: "#64748b",
        background: "#ffffff",
        cardBackground: "#f1f5f9",
        border: "#e2e8f0",
      }),
      fontSize: { body: "16px" },
    },
  },
  {
    id: "premiumBlackGold",
    name: "高级黑金",
    schemaVersion: STYLE_SCHEMA_VERSION,
    tokens: {
      color: themeColorTokens({
        primary: "#ca8a04",
        accent: "#eab308",
        textPrimary: "#1c1917",
        textSecondary: "#78716c",
        background: "#fafaf9",
        cardBackground: "#f5f5f4",
        border: "#e7e5e4",
      }),
      fontSize: { body: "16px" },
    },
  },
  {
    id: "creamOrange",
    name: "奶油橙",
    schemaVersion: STYLE_SCHEMA_VERSION,
    tokens: {
      color: themeColorTokens({
        primary: "#c2410c",
        accent: "#ea580c",
        textPrimary: "#292524",
        textSecondary: "#78716c",
        background: "#fffdfb",
        cardBackground: "#fff7ed",
        border: "#fed7aa",
      }),
      fontSize: { body: "16px" },
    },
  },
  {
    id: "techGrayBlue",
    name: "科技灰蓝",
    schemaVersion: STYLE_SCHEMA_VERSION,
    tokens: {
      color: themeColorTokens({
        primary: "#0369a1",
        accent: "#0ea5e9",
        textPrimary: "#0f172a",
        textSecondary: "#64748b",
        background: "#f8fafc",
        cardBackground: "#f1f5f9",
        border: "#cbd5e1",
      }),
      fontSize: { body: "16px" },
    },
  },
  {
    id: "knowledgePurple",
    name: "知识紫",
    schemaVersion: STYLE_SCHEMA_VERSION,
    tokens: {
      color: themeColorTokens({
        primary: "#6d28d9",
        accent: "#7c3aed",
        textPrimary: "#1e1b4b",
        textSecondary: "#6b21a8",
        background: "#faf5ff",
        cardBackground: "#f3e8ff",
        border: "#e9d5ff",
      }),
      fontSize: { body: "16px" },
    },
  },
  {
    id: "healthGreen",
    name: "健康绿",
    schemaVersion: STYLE_SCHEMA_VERSION,
    tokens: {
      color: themeColorTokens({
        primary: "#15803d",
        accent: "#22c55e",
        textPrimary: "#14532d",
        textSecondary: "#3f6212",
        background: "#f7fef9",
        cardBackground: "#ecfdf5",
        border: "#bbf7d0",
      }),
      fontSize: { body: "16px" },
    },
  },
];

type PresetBundleMeta = {
  id: MiaopianPresetId;
  name: string;
  description: string;
  density: Density;
  tone: string;
  defaultVariantByBlockType: Partial<Record<BlockType, string>>;
  variantPoolsByBlockType: Partial<Record<BlockType, string[]>>;
};

const TITLE_POOL = [
  "title_plain_minimal",
  "title_left_bar_classic",
  "title_bottom_line_editorial",
] as const;

const HEADING_POOL = [
  "heading_plain_minimal",
  "heading_numbered_section",
  "heading_top_badge_topic",
  "heading_underline_classic",
  "heading_pill_topic",
  "heading_editorial_plain",
  "heading_keynote_strong",
  "heading_highlight_marker",
  "heading_short_line",
  "heading_icon_prefix",
  "heading_minimal_number",
  "heading_magazine_left_bar",
  "heading_magazine_offset",
] as const;

const LEAD_POOL = [
  "lead_plain_intro",
  "lead_accent_band",
  "lead_quote_intro",
  "lead_business_brief",
  "lead_warm_story",
  "lead_magazine_pull",
  "lead_keynote_hook",
  "lead_notebook_highlight",
  "lead_dense_summary",
] as const;

const PARAGRAPH_POOL = [
  "paragraph_plain_body",
  "paragraph_accent_left",
  "paragraph_soft_card",
  "paragraph_compact_rhythm",
  "paragraph_indent_classic",
  "paragraph_highlight_inline",
  "paragraph_magazine_measure",
  "paragraph_notebook_margin",
  "paragraph_callout_soft",
] as const;

const DIVIDER_POOL = [
  "divider_simple_line",
  "divider_dotted_line",
  "divider_section_space",
  "divider_dash_editorial",
  "divider_hair_keynote",
  "divider_dot_warm",
  "divider_short_accent",
  "divider_space_wide",
  "divider_label_center",
] as const;

const LIST_POOL = [
  "list_plain_bullets",
  "list_numbered_steps",
  "list_checklist_cards",
  "list_compact_bullets",
  "list_step_cards",
  "list_icon_bullets",
  "list_two_column",
  "list_priority_stack",
  "list_timeline_markers",
] as const;

const QUOTE_POOL = [
  "quote_plain",
  "quote_left_bar",
  "quote_card",
  "quote_soft_card",
  "quote_center_mark",
  "quote_label_chip",
  "quote_dark_band",
  "quote_minimal_serif",
  "quote_brand_callout",
] as const;

const HIGHLIGHT_POOL = [
  "highlight_inline_emphasis",
  "highlight_accent_band",
  "highlight_soft_card",
  "highlight_marker_warm",
  "highlight_flat_business",
  "highlight_border_glow",
  "highlight_notebook",
  "highlight_keynote_box",
  "highlight_tip_pill",
] as const;

const INFO_CARD_POOL = [
  "info_card_key_takeaway",
  "info_card_steps",
  "info_card_warning_note",
  "info_card_method_steps",
  "info_card_insight_band",
  "info_card_case_study",
  "info_card_checklist",
  "info_card_data_snapshot",
  "info_card_soft_banner",
] as const;

const CTA_POOL = [
  "cta_plain_text",
  "cta_button_like",
  "cta_qr_placeholder",
  "cta_soft_banner",
  "cta_summary_band",
  "cta_checklist_footer",
  "cta_dual_action",
  "cta_minimal_link",
  "cta_card_promo",
] as const;

const IMAGE_POOL = [
  "image_placeholder_simple",
  "image_placeholder_card",
  "image_placeholder_caption",
  "image_placeholder_full_bleed",
  "image_placeholder_minimal_frame",
  "image_placeholder_polaroid",
  "image_placeholder_editorial",
  "image_placeholder_product",
  "image_placeholder_hero_band",
] as const;

const PRESET_BUNDLE_META: PresetBundleMeta[] = [
  {
    id: "business",
    name: "简洁商务",
    description: "像内部汇报一样清楚：层级分明、少装饰、把判断交给读者。",
    density: "standard",
    tone: "理性、克制、可执行",
    defaultVariantByBlockType: {
      title: "title_bottom_line_editorial",
      lead: "lead_plain_intro",
      heading: "heading_short_line",
      paragraph: "paragraph_plain_body",
      divider: "divider_simple_line",
      list: "list_plain_bullets",
      quote: "quote_left_bar",
      highlight: "highlight_inline_emphasis",
      info_card: "info_card_key_takeaway",
      cta: "cta_plain_text",
      image_placeholder: "image_placeholder_simple",
    },
    variantPoolsByBlockType: {
      title: [...TITLE_POOL],
      heading: [...HEADING_POOL],
      lead: [...LEAD_POOL],
      paragraph: [...PARAGRAPH_POOL],
      divider: [...DIVIDER_POOL],
      list: [...LIST_POOL],
      quote: [...QUOTE_POOL],
      highlight: [...HIGHLIGHT_POOL],
      info_card: [...INFO_CARD_POOL],
      cta: [...CTA_POOL],
      image_placeholder: [...IMAGE_POOL],
    },
  },
  {
    id: "warm",
    name: "温暖叙事",
    description: "像和朋友聊天：柔软边距、叙事节奏、让句子有温度。",
    density: "relaxed",
    tone: "亲近、松弛、有故事",
    defaultVariantByBlockType: {
      title: "title_plain_minimal",
      lead: "lead_warm_story",
      heading: "heading_highlight_marker",
      paragraph: "paragraph_plain_body",
      divider: "divider_dot_warm",
      list: "list_plain_bullets",
      quote: "quote_left_bar",
      highlight: "highlight_marker_warm",
      info_card: "info_card_key_takeaway",
      cta: "cta_soft_banner",
      image_placeholder: "image_placeholder_simple",
    },
    variantPoolsByBlockType: {
      title: [...TITLE_POOL],
      heading: [...HEADING_POOL],
      lead: [...LEAD_POOL],
      paragraph: [...PARAGRAPH_POOL],
      divider: [...DIVIDER_POOL],
      list: [...LIST_POOL],
      quote: [...QUOTE_POOL],
      highlight: [...HIGHLIGHT_POOL],
      info_card: [...INFO_CARD_POOL],
      cta: [...CTA_POOL],
      image_placeholder: [...IMAGE_POOL],
    },
  },
  {
    id: "magazine",
    name: "高级杂志",
    description: "纸媒编辑气质：大标题、轻字重、留白与边界感。",
    density: "relaxed",
    tone: "安静、考究、慢读",
    defaultVariantByBlockType: {
      title: "title_bottom_line_editorial",
      lead: "lead_magazine_pull",
      heading: "heading_magazine_offset",
      paragraph: "paragraph_magazine_measure",
      divider: "divider_dash_editorial",
      list: "list_plain_bullets",
      quote: "quote_card",
      highlight: "highlight_notebook",
      info_card: "info_card_insight_band",
      cta: "cta_plain_text",
      image_placeholder: "image_placeholder_editorial",
    },
    variantPoolsByBlockType: {
      title: [...TITLE_POOL],
      heading: [...HEADING_POOL],
      lead: [...LEAD_POOL],
      paragraph: [...PARAGRAPH_POOL],
      divider: [...DIVIDER_POOL],
      list: [...LIST_POOL],
      quote: [...QUOTE_POOL],
      highlight: [...HIGHLIGHT_POOL],
      info_card: [...INFO_CARD_POOL],
      cta: [...CTA_POOL],
      image_placeholder: [...IMAGE_POOL],
    },
  },
  {
    id: "keynote",
    name: "科技发布会",
    description: "冷静、未来感：黑白灰画布上，让标题替你开口。",
    density: "standard",
    tone: "克制、笃定、向前看",
    defaultVariantByBlockType: {
      title: "title_left_bar_classic",
      lead: "lead_keynote_hook",
      heading: "heading_magazine_left_bar",
      paragraph: "paragraph_compact_rhythm",
      divider: "divider_hair_keynote",
      list: "list_numbered_steps",
      quote: "quote_dark_band",
      highlight: "highlight_keynote_box",
      info_card: "info_card_data_snapshot",
      cta: "cta_summary_band",
      image_placeholder: "image_placeholder_hero_band",
    },
    variantPoolsByBlockType: {
      title: [...TITLE_POOL],
      heading: [...HEADING_POOL],
      lead: [...LEAD_POOL],
      paragraph: [...PARAGRAPH_POOL],
      divider: [...DIVIDER_POOL],
      list: [...LIST_POOL],
      quote: [...QUOTE_POOL],
      highlight: [...HIGHLIGHT_POOL],
      info_card: [...INFO_CARD_POOL],
      cta: [...CTA_POOL],
      image_placeholder: [...IMAGE_POOL],
    },
  },
  {
    id: "xiaohongshu",
    name: "小红书感",
    description: "轻松、好读：卡片化信息，像收藏一篇「有用笔记」。",
    density: "relaxed",
    tone: "轻松、真诚、生活感",
    defaultVariantByBlockType: {
      title: "title_plain_minimal",
      lead: "lead_notebook_highlight",
      heading: "heading_pill_topic",
      paragraph: "paragraph_callout_soft",
      divider: "divider_dot_warm",
      list: "list_checklist_cards",
      quote: "quote_soft_card",
      highlight: "highlight_tip_pill",
      info_card: "info_card_checklist",
      cta: "cta_card_promo",
      image_placeholder: "image_placeholder_polaroid",
    },
    variantPoolsByBlockType: {
      title: [...TITLE_POOL],
      heading: [...HEADING_POOL],
      lead: [...LEAD_POOL],
      paragraph: [...PARAGRAPH_POOL],
      divider: [...DIVIDER_POOL],
      list: [...LIST_POOL],
      quote: [...QUOTE_POOL],
      highlight: [...HIGHLIGHT_POOL],
      info_card: [...INFO_CARD_POOL],
      cta: [...CTA_POOL],
      image_placeholder: [...IMAGE_POOL],
    },
  },
  {
    id: "dedao",
    name: "得到风",
    description: "高密度知识交付：结构先行，强调认知升级与可复述。",
    density: "compact",
    tone: "理性、密实、可迁移",
    defaultVariantByBlockType: {
      title: "title_left_bar_classic",
      lead: "lead_dense_summary",
      heading: "heading_numbered_section",
      paragraph: "paragraph_indent_classic",
      divider: "divider_simple_line",
      list: "list_step_cards",
      quote: "quote_label_chip",
      highlight: "highlight_border_glow",
      info_card: "info_card_method_steps",
      cta: "cta_checklist_footer",
      image_placeholder: "image_placeholder_simple",
    },
    variantPoolsByBlockType: {
      title: [...TITLE_POOL],
      heading: [...HEADING_POOL],
      lead: [...LEAD_POOL],
      paragraph: [...PARAGRAPH_POOL],
      divider: [...DIVIDER_POOL],
      list: [...LIST_POOL],
      quote: [...QUOTE_POOL],
      highlight: [...HIGHLIGHT_POOL],
      info_card: [...INFO_CARD_POOL],
      cta: [...CTA_POOL],
      image_placeholder: [...IMAGE_POOL],
    },
  },
];

export function buildMiaopianPresetDefinitions(): PresetDefinition[] {
  return PRESET_BUNDLE_META.map((meta) => ({
    id: meta.id,
    name: meta.name,
    description: meta.description,
    schemaVersion: STYLE_SCHEMA_VERSION,
    themeId: DEFAULT_THEME_FOR_PRESET[meta.id],
    density: meta.density,
    tone: meta.tone,
    defaultVariantByBlockType: meta.defaultVariantByBlockType,
    variantPoolsByBlockType: meta.variantPoolsByBlockType,
    recommendedThemeIds: [...ALL_THEME_IDS],
  }));
}

export function resolveMiaopianPresetId(
  presetIdOrLegacy: string | undefined,
): MiaopianPresetId {
  if (!presetIdOrLegacy) {
    return "business";
  }
  if (
    presetIdOrLegacy === "business" ||
    presetIdOrLegacy === "warm" ||
    presetIdOrLegacy === "magazine" ||
    presetIdOrLegacy === "keynote" ||
    presetIdOrLegacy === "xiaohongshu" ||
    presetIdOrLegacy === "dedao"
  ) {
    return presetIdOrLegacy;
  }
  return LEGACY_PRESET_ID_ALIASES[presetIdOrLegacy] ?? "business";
}

export function resolveMiaopianThemeId(
  themeOrPaletteId: string | undefined,
  presetId?: MiaopianPresetId,
): MiaopianThemeId {
  if (
    themeOrPaletteId === "businessBlue" ||
    themeOrPaletteId === "premiumBlackGold" ||
    themeOrPaletteId === "creamOrange" ||
    themeOrPaletteId === "techGrayBlue" ||
    themeOrPaletteId === "knowledgePurple" ||
    themeOrPaletteId === "healthGreen"
  ) {
    return themeOrPaletteId;
  }
  if (themeOrPaletteId && LEGACY_PALETTE_ID_ALIASES[themeOrPaletteId]) {
    return LEGACY_PALETTE_ID_ALIASES[themeOrPaletteId];
  }
  if (presetId) {
    return DEFAULT_THEME_FOR_PRESET[presetId];
  }
  return "businessBlue";
}
