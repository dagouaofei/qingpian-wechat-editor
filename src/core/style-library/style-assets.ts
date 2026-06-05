import type { StyleLibraryLifecycleState } from "./types";

export type StyleLocalizedText = {
  zh: string;
  en: string;
};

export type StyleLocalizedList = {
  zh: string[];
  en: string[];
};

export type StyleDefinition = {
  styleId: string;
  name: StyleLocalizedText;
  description: StyleLocalizedText;
  intendedUseCases: StyleLocalizedList;
  targetArticleTypes: string[];
  tone: StyleLocalizedText;
  density: StyleLocalizedText;
  linkedPaletteIds: string[];
  linkedVariantAssetIds: string[];
  linkedRuleIds: string[];
  lifecycle: StyleLibraryLifecycleState;
  operatorNotes: StyleLocalizedText;
  s10ExpansionHints: StyleLocalizedText;
  readyForExpansion: boolean;
};

export const CHAPTER_LABEL_STYLE: StyleDefinition = {
  styleId: "style-chapter-label",
  name: {
    zh: "章节标签",
    en: "Chapter Label",
  },
  description: {
    zh: "用于章节分隔与标题强调的紫色标签风格，适合知识干货与结构化长文。",
    en: "Purple chapter label styling for section breaks and heading emphasis in editorial content.",
  },
  intendedUseCases: {
    zh: ["章节分隔", "小节标题", "知识干货结构"],
    en: ["Section breaks", "Subsection headings", "Knowledge editorial structure"],
  },
  targetArticleTypes: ["heading", "long_form_editorial"],
  tone: { zh: "清晰 · 编辑感", en: "Clear · Editorial" },
  density: { zh: "中等", en: "Medium" },
  linkedPaletteIds: ["palette_purple_chapter_editorial"],
  linkedVariantAssetIds: ["seed-variant-heading-purple-chapter-label"],
  linkedRuleIds: [
    "RULE_PASTE_QA_BEFORE_DEFAULT",
    "RULE_WARNING_PROMOTE_WITH_EVIDENCE",
    "RULE_USER_SELECTABLE_NOT_DEFAULT",
    "RULE_HARVEST_NOT_RELEASE1",
  ],
  lifecycle: "paste_qa_pass",
  operatorNotes: {
    zh: "006D harvest seed · 尚未 user_selectable · 仅工作台 metadata",
    en: "006D harvest seed · not user_selectable · workbench metadata only",
  },
  s10ExpansionHints: {
    zh: "可批量扩展同 tone 的 heading / title 变体；需共用 palette 与 copy-safe 规则。",
    en: "Batch-expand heading/title variants sharing palette and copy-safe rules.",
  },
  readyForExpansion: true,
};

export const READING_PATH_STYLE: StyleDefinition = {
  styleId: "style-reading-path",
  name: {
    zh: "阅读路径",
    en: "Reading Path",
  },
  description: {
    zh: "用于阅读引导与路径说明的信息卡片风格，强调可读性与 calm 商务感。",
    en: "Info-card styling for reading guidance and path summaries with calm business tone.",
  },
  intendedUseCases: {
    zh: ["阅读路径", "步骤引导", "信息摘要"],
    en: ["Reading paths", "Step guidance", "Info summaries"],
  },
  targetArticleTypes: ["info_card", "guide", "business_update"],
  tone: { zh: "专业 · 友好", en: "Professional · Friendly" },
  density: { zh: "紧凑", en: "Compact" },
  linkedPaletteIds: ["palette_reading_path_calm"],
  linkedVariantAssetIds: ["seed-variant-info-card-reading-path"],
  linkedRuleIds: [
    "RULE_PASTE_QA_BEFORE_DEFAULT",
    "RULE_WARNING_PROMOTE_WITH_EVIDENCE",
    "RULE_USER_SELECTABLE_NOT_DEFAULT",
    "RULE_HARVEST_NOT_RELEASE1",
  ],
  lifecycle: "paste_qa_pass",
  operatorNotes: {
    zh: "006D harvest seed · 尚未 user_selectable · 仅工作台 metadata",
    en: "006D harvest seed · not user_selectable · workbench metadata only",
  },
  s10ExpansionHints: {
    zh: "适合 S10 批量扩展 info_card / highlight 变体；保持 copy-safe inline 约束。",
    en: "S10 batch expansion for info_card/highlight variants under copy-safe inline constraints.",
  },
  readyForExpansion: true,
};

export const KNOWLEDGE_EDITORIAL_STYLE: StyleDefinition = {
  styleId: "style-knowledge-editorial",
  name: {
    zh: "知识干货",
    en: "Knowledge Editorial",
  },
  description: {
    zh: "面向知识型长文的整体视觉方向规划项，当前无独立 variant，用于 S10 扩展规划。",
    en: "Planned editorial direction for knowledge articles; no dedicated variant yet.",
  },
  intendedUseCases: {
    zh: ["知识分享", "方法论", "长文结构"],
    en: ["Knowledge sharing", "Methodology", "Long-form structure"],
  },
  targetArticleTypes: ["long_form_editorial"],
  tone: { zh: "理性 · 清晰", en: "Rational · Clear" },
  density: { zh: "中等", en: "Medium" },
  linkedPaletteIds: ["palette_purple_chapter_editorial"],
  linkedVariantAssetIds: [],
  linkedRuleIds: ["RULE_PASTE_QA_BEFORE_DEFAULT", "RULE_USER_SELECTABLE_NOT_DEFAULT"],
  lifecycle: "candidate",
  operatorNotes: {
    zh: "规划项 · 暂无关联 candidate · 缺少 variant 关联",
    en: "Planning entry · no linked candidate yet",
  },
  s10ExpansionHints: {
    zh: "S10 可从 chapter-label 风格延伸更多 heading / quote 变体。",
    en: "S10 can extend chapter-label into more heading/quote variants.",
  },
  readyForExpansion: false,
};

export const BUSINESS_PROFESSIONAL_STYLE: StyleDefinition = {
  styleId: "style-business-professional",
  name: {
    zh: "商务专业",
    en: "Business Professional",
  },
  description: {
    zh: "面向商务更新与专业资讯的视觉方向规划项，当前无独立 variant。",
    en: "Planned direction for business updates; no dedicated variant yet.",
  },
  intendedUseCases: {
    zh: ["商务通讯", "产品更新", "专业资讯"],
    en: ["Business comms", "Product updates", "Professional briefs"],
  },
  targetArticleTypes: ["business_update", "info_card"],
  tone: { zh: "稳重 · 专业", en: "Stable · Professional" },
  density: { zh: "紧凑", en: "Compact" },
  linkedPaletteIds: [],
  linkedVariantAssetIds: [],
  linkedRuleIds: ["RULE_HARVEST_NOT_RELEASE1"],
  lifecycle: "draft",
  operatorNotes: {
    zh: "规划项 · 缺少 palette 与 variant 关联",
    en: "Planning entry · missing palette and variant links",
  },
  s10ExpansionHints: {
    zh: "S10 需先登记 palette，再批量导入 info_card / highlight 变体。",
    en: "S10 needs palette registration before batch info_card/highlight import.",
  },
  readyForExpansion: false,
};

export const STYLE_LIBRARY_STYLE_DEFINITIONS = [
  CHAPTER_LABEL_STYLE,
  READING_PATH_STYLE,
  KNOWLEDGE_EDITORIAL_STYLE,
  BUSINESS_PROFESSIONAL_STYLE,
] as const;
