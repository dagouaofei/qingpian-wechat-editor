import type { Article } from "@/core/article";
import type { NormalizedInput } from "@/core/generation/input";
import type { InputStyleIntent } from "@/core/generation/input";
import {
  DEFAULT_THEME_FOR_PRESET,
  LEGACY_PRESET_ID_ALIASES,
  resolveMiaopianPresetId,
  type MiaopianPresetId,
} from "@/config/miaopian-preset-bundles";

import {
  defaultPaletteForPreset,
  PREVIEW_COLOR_PALETTES,
  resolvePreviewColorPaletteId,
  type PreviewColorPaletteId,
} from "./preview-color-palette";

export type PreviewArticleStyleId = MiaopianPresetId;

export type PreviewStyleControlState = {
  articleStyle: PreviewArticleStyleId;
  colorPalette: PreviewColorPaletteId;
  /** When false, switching article style resets palette to preset default */
  lockColorPalette?: boolean;
};

const DENSITY_BY_PRESET: Record<
  MiaopianPresetId,
  "light" | "medium" | "strong"
> = {
  business: "medium",
  warm: "light",
  magazine: "light",
  keynote: "medium",
  xiaohongshu: "light",
  dedao: "strong",
};

export const PREVIEW_ARTICLE_STYLE_OPTIONS: Array<{
  id: PreviewArticleStyleId;
  label: string;
  description: string;
  presetId: PreviewArticleStyleId;
  densityHint: "light" | "medium" | "strong";
}> = [
  {
    id: "business",
    label: "简洁商务",
    description: "像内部汇报一样清楚：层级分明、少装饰、把判断交给读者。",
    presetId: "business",
    densityHint: DENSITY_BY_PRESET.business,
  },
  {
    id: "warm",
    label: "温暖叙事",
    description: "像和朋友聊天：柔软边距、叙事节奏、让句子有温度。",
    presetId: "warm",
    densityHint: DENSITY_BY_PRESET.warm,
  },
  {
    id: "magazine",
    label: "高级杂志",
    description: "纸媒编辑气质：大标题、轻字重、留白与边界感。",
    presetId: "magazine",
    densityHint: DENSITY_BY_PRESET.magazine,
  },
  {
    id: "keynote",
    label: "科技发布会",
    description: "冷静、未来感：黑白灰画布上，让标题替你开口。",
    presetId: "keynote",
    densityHint: DENSITY_BY_PRESET.keynote,
  },
  {
    id: "xiaohongshu",
    label: "小红书感",
    description: "轻松、好读：卡片化信息，像收藏一篇「有用笔记」。",
    presetId: "xiaohongshu",
    densityHint: DENSITY_BY_PRESET.xiaohongshu,
  },
  {
    id: "dedao",
    label: "得到风",
    description: "高密度知识交付：结构先行，强调认知升级与可复述。",
    presetId: "dedao",
    densityHint: DENSITY_BY_PRESET.dedao,
  },
];

export const DEFAULT_PREVIEW_STYLE_CONTROL: PreviewStyleControlState = {
  articleStyle: "business",
  colorPalette: DEFAULT_THEME_FOR_PRESET.business,
  lockColorPalette: false,
};

export function resolvePreviewStyleOption(articleStyle: PreviewArticleStyleId) {
  return (
    PREVIEW_ARTICLE_STYLE_OPTIONS.find((option) => option.id === articleStyle) ??
    PREVIEW_ARTICLE_STYLE_OPTIONS[0]
  );
}

export function resolveLegacyPresetAlias(
  basicStyle: string | undefined,
): PreviewArticleStyleId | undefined {
  if (!basicStyle?.trim()) {
    return undefined;
  }
  const trimmed = basicStyle.trim();
  if (PREVIEW_ARTICLE_STYLE_OPTIONS.some((option) => option.id === trimmed)) {
    return trimmed as PreviewArticleStyleId;
  }
  return LEGACY_PRESET_ID_ALIASES[trimmed];
}

export function resolveInitialPreviewStyleControl(options: {
  basicStyle?: string;
}): PreviewStyleControlState {
  const resolved = resolveLegacyPresetAlias(options.basicStyle) ?? "business";
  return {
    articleStyle: resolved,
    colorPalette: defaultPaletteForPreset(resolved),
    lockColorPalette: false,
  };
}

export function applyArticleStyleToPreviewControl(
  control: PreviewStyleControlState,
  articleStyle: PreviewArticleStyleId,
): PreviewStyleControlState {
  const next: PreviewStyleControlState = {
    ...control,
    articleStyle,
  };
  if (!control.lockColorPalette) {
    next.colorPalette = defaultPaletteForPreset(articleStyle);
  }
  return next;
}

export function buildStyleIntentForPreviewControl(
  articleStyle: PreviewArticleStyleId,
  baseIntent?: InputStyleIntent,
): InputStyleIntent {
  const option = resolvePreviewStyleOption(articleStyle);
  return {
    ...baseIntent,
    presetHint: option.presetId,
    densityHint: option.densityHint,
  };
}

export function buildNormalizedInputForPreviewControl(
  base: NormalizedInput,
  control: PreviewStyleControlState,
): NormalizedInput {
  return {
    ...base,
    styleIntent: buildStyleIntentForPreviewControl(
      control.articleStyle,
      base.styleIntent,
    ),
  };
}

export function applyPreviewThemeToArticle(
  article: Article,
  colorPalette: PreviewColorPaletteId,
): Article {
  const themeId = PREVIEW_COLOR_PALETTES[colorPalette].themeId;

  return {
    ...article,
    styleAssignment: {
      ...article.styleAssignment,
      themeId,
    },
  };
}

export function applyPreviewPresetToArticle(
  article: Article,
  articleStyle: PreviewArticleStyleId,
): Article {
  const option = resolvePreviewStyleOption(articleStyle);
  return {
    ...article,
    styleAssignment: {
      ...article.styleAssignment,
      presetId: option.presetId,
    },
  };
}

export { resolveMiaopianPresetId, resolvePreviewColorPaletteId };
