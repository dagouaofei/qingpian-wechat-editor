import type { Article } from "@/core/article";
import type { NormalizedInput } from "@/core/generation/input";
import type { InputStyleIntent } from "@/core/generation/input";

import type { PreviewColorPaletteId } from "./preview-color-palette";

export type PreviewArticleStyleId = "classic-news" | "classic";

export type PreviewStyleControlState = {
  articleStyle: PreviewArticleStyleId;
  colorPalette: PreviewColorPaletteId;
};

export const PREVIEW_ARTICLE_STYLE_OPTIONS: Array<{
  id: PreviewArticleStyleId;
  label: string;
  description: string;
}> = [
  {
    id: "classic-news",
    label: "经典资讯",
    description: "强调装饰控件与信息层级",
  },
  {
    id: "classic",
    label: "经典简约",
    description: "更轻量的 plain 控件组合",
  },
];

export const DEFAULT_PREVIEW_STYLE_CONTROL: PreviewStyleControlState = {
  articleStyle: "classic-news",
  colorPalette: "default",
};

export function resolveInitialPreviewStyleControl(options: {
  basicStyle?: string;
}): PreviewStyleControlState {
  const basicStyle = options.basicStyle?.trim();
  return {
    articleStyle: basicStyle === "classic" ? "classic" : "classic-news",
    colorPalette: "default",
  };
}

export function buildStyleIntentForPreviewControl(
  articleStyle: PreviewArticleStyleId,
  baseIntent?: InputStyleIntent,
): InputStyleIntent {
  return {
    ...baseIntent,
    presetHint: articleStyle === "classic" ? "classic" : "classic-news",
    densityHint: articleStyle === "classic" ? "light" : "medium",
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
  const themeId =
    colorPalette === "warm" ? "warm-editorial" : "default";

  return {
    ...article,
    styleAssignment: {
      ...article.styleAssignment,
      themeId,
    },
  };
}
