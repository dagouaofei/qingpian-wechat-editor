import type { StyleLibraryPaletteAsset } from "./types";
import type { StyleLocalizedText } from "./style-assets";

const PALETTE_DISTRIBUTION = {
  userSelectable: false,
  defaultEligible: false,
  release1Required: false,
} as const;

export type PaletteMetadata = {
  paletteId: string;
  name: StyleLocalizedText;
  description: StyleLocalizedText;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  compatibleStyleIds: string[];
  copySafeNotes: StyleLocalizedText;
  contrastNotes: StyleLocalizedText;
  operatorNotes: StyleLocalizedText;
  linkedVariantAssetIds: string[];
};

export const PURPLE_CHAPTER_PALETTE_ASSET: StyleLibraryPaletteAsset = {
  assetId: "palette-purple-chapter-editorial",
  assetType: "palette",
  paletteId: "palette_purple_chapter_editorial",
  label: "Purple Chapter Editorial",
  description: "006D chapter label harvest palette · metadata only · not runtime theme",
  sourceType: "code",
  lifecycle: "candidate",
  distribution: { ...PALETTE_DISTRIBUTION },
  updatedAt: "2026-06-05",
  tokenRefs: {
    primary: "#7C3AED",
    accent: "#A78BFA",
    background: "#F5F3FF",
    text: "#1F2937",
    border: "#DDD6FE",
  },
  compatibleThemeIds: ["harvest-candidate"],
  tags: ["palette", "006d", "chapter-label"],
};

export const READING_PATH_PALETTE_ASSET: StyleLibraryPaletteAsset = {
  assetId: "palette-reading-path-calm",
  assetType: "palette",
  paletteId: "palette_reading_path_calm",
  label: "Reading Path Calm",
  description: "006D reading path info card palette · metadata only · not runtime theme",
  sourceType: "code",
  lifecycle: "candidate",
  distribution: { ...PALETTE_DISTRIBUTION },
  updatedAt: "2026-06-05",
  tokenRefs: {
    primary: "#2563EB",
    accent: "#60A5FA",
    background: "#EFF6FF",
    text: "#1E3A5F",
    border: "#BFDBFE",
  },
  compatibleThemeIds: ["harvest-candidate"],
  tags: ["palette", "006d", "reading-path"],
};

export const TEAL_SECTION_PALETTE_ASSET: StyleLibraryPaletteAsset = {
  assetId: "palette-teal-section-editorial",
  assetType: "palette",
  paletteId: "palette_teal_section_editorial",
  label: "Teal Section Editorial",
  description:
    "S9-STORY-007B HTML paste teal section label palette · metadata only · not runtime theme",
  sourceType: "code",
  lifecycle: "candidate",
  distribution: { ...PALETTE_DISTRIBUTION },
  updatedAt: "2026-06-05",
  tokenRefs: {
    primary: "#0D9488",
    accent: "#14B8A6",
    background: "#F0FDFA",
    text: "#1F2937",
    border: "#99F6E4",
  },
  compatibleThemeIds: ["html-paste-candidate"],
  tags: ["palette", "007b", "html-paste"],
};

export const STYLE_LIBRARY_PALETTE_ASSETS = [
  PURPLE_CHAPTER_PALETTE_ASSET,
  READING_PATH_PALETTE_ASSET,
  TEAL_SECTION_PALETTE_ASSET,
] as const;

export const STYLE_LIBRARY_PALETTE_METADATA: Record<string, PaletteMetadata> = {
  palette_purple_chapter_editorial: {
    paletteId: "palette_purple_chapter_editorial",
    name: { zh: "紫色章节编辑", en: "Purple Chapter Editorial" },
    description: {
      zh: "heading 章节标签 harvest 候选的紫色编辑配色方向。",
      en: "Purple editorial palette direction for heading chapter label harvest candidates.",
    },
    primaryColor: "#7C3AED",
    accentColor: "#A78BFA",
    backgroundColor: "#F5F3FF",
    textColor: "#1F2937",
    borderColor: "#DDD6FE",
    compatibleStyleIds: ["style-chapter-label", "style-knowledge-editorial"],
    copySafeNotes: {
      zh: "优先 inline style · 避免未 catalogued CSS · 保留 Paste QA 证据",
      en: "Prefer inline style · avoid uncatalogued CSS · retain Paste QA evidence",
    },
    contrastNotes: {
      zh: "紫底浅字对比度需在 Paste QA 中确认",
      en: "Purple-on-light contrast should be confirmed in Paste QA",
    },
    operatorNotes: {
      zh: "仅 metadata · 未接入 runtime theme",
      en: "Metadata only · not connected to runtime theme",
    },
    linkedVariantAssetIds: ["seed-variant-heading-purple-chapter-label"],
  },
  palette_reading_path_calm: {
    paletteId: "palette_reading_path_calm",
    name: { zh: "阅读路径 calm", en: "Reading Path Calm" },
    description: {
      zh: "info_card 阅读路径 harvest 候选的 calm 商务蓝配色方向。",
      en: "Calm business-blue palette for reading-path info card harvest candidates.",
    },
    primaryColor: "#2563EB",
    accentColor: "#60A5FA",
    backgroundColor: "#EFF6FF",
    textColor: "#1E3A5F",
    borderColor: "#BFDBFE",
    compatibleStyleIds: ["style-reading-path"],
    copySafeNotes: {
      zh: "info_card inline 背景/边框需符合 WeChat copy-safe 约束",
      en: "Info card inline background/border must meet WeChat copy-safe constraints",
    },
    contrastNotes: {
      zh: "浅蓝背景 + 深字在 Paste QA 中已通过",
      en: "Light blue background + dark text passed Paste QA",
    },
    operatorNotes: {
      zh: "仅 metadata · 未接入 runtime theme",
      en: "Metadata only · not connected to runtime theme",
    },
    linkedVariantAssetIds: ["seed-variant-info-card-reading-path"],
  },
  palette_teal_section_editorial: {
    paletteId: "palette_teal_section_editorial",
    name: { zh: "青绿章节编辑", en: "Teal Section Editorial" },
    description: {
      zh: "S9-STORY-007B HTML paste 青绿章节标签配色方向。",
      en: "Teal editorial palette for HTML paste section label candidates.",
    },
    primaryColor: "#0D9488",
    accentColor: "#14B8A6",
    backgroundColor: "#F0FDFA",
    textColor: "#1F2937",
    borderColor: "#99F6E4",
    compatibleStyleIds: ["style-teal-section-label"],
    copySafeNotes: {
      zh: "inline 青绿标签 + 深字 · 已通过 validator · Paste QA E2E 007B",
      en: "Inline teal label + dark text · validator pass · Paste QA E2E 007B",
    },
    contrastNotes: {
      zh: "青绿底白字对比度在 E2E paste QA 中已确认",
      en: "Teal-on-white contrast confirmed in E2E paste QA",
    },
    operatorNotes: {
      zh: "S9-STORY-007B apply patch · 仅 metadata · 未接入 runtime theme",
      en: "S9-STORY-007B apply patch · metadata only · not runtime theme",
    },
    linkedVariantAssetIds: ["variant-html-paste-teal-section-label"],
  },
};
