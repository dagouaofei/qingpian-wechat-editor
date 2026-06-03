import { parseArticle } from "@/core/article";
import type {
  CtaBlockContent,
  ImagePlaceholderBlockContent,
} from "@/core/blocks";
import {
  CTA_FIRST_WAVE_VARIANTS,
  IMAGE_PLACEHOLDER_FIRST_WAVE_VARIANTS,
  STYLE_SCHEMA_VERSION,
} from "@/core/styles";

import { articleFixtureBase, fixtureBlockId } from "../articles/shared";

export function createCtaArticleFixture(options: {
  variantId: string;
  content?: CtaBlockContent;
}) {
  const blockId = fixtureBlockId(1);

  return parseArticle({
    ...articleFixtureBase(),
    styleAssignment: {
      themeId: "businessBlue",
      presetId: "business",
      blockOverrides: [{ blockId, variantId: options.variantId }],
    },
    blocks: [
      {
        id: blockId,
        type: "cta" as const,
        content:
          options.content ?? {
            text: "关注轻篇，获取后续模板更新。",
            action: "查看占位操作",
          },
      },
    ],
  });
}

export function createImagePlaceholderArticleFixture(options: {
  variantId: string;
  content?: ImagePlaceholderBlockContent;
}) {
  const blockId = fixtureBlockId(1);

  return parseArticle({
    ...articleFixtureBase(),
    styleAssignment: {
      themeId: "businessBlue",
      presetId: "business",
      blockOverrides: [{ blockId, variantId: options.variantId }],
    },
    blocks: [
      {
        id: blockId,
        type: "image_placeholder" as const,
        content:
          options.content ?? {
            caption: "这里需要一张产品截图",
            aspectRatio: "16:9",
            position: "full",
            suggestion: "后续由人工补充图片资源",
          },
      },
    ],
  });
}

export const CTA_IMAGE_PLACEHOLDER_VARIANT_REGISTRY = {
  schemaVersion: STYLE_SCHEMA_VERSION,
  themes: [
    {
      id: "default",
      name: "Default Theme",
      schemaVersion: STYLE_SCHEMA_VERSION,
      tokens: {
        color: {
          "text.default": "#333333",
          "text.accent": "#576b95",
        },
        fontSize: { body: "16px" },
      },
    },
  ],
  presets: [
    {
      id: "business",
      name: "Classic News",
      schemaVersion: STYLE_SCHEMA_VERSION,
      themeId: "businessBlue",
      defaultVariantByBlockType: {
        cta: "cta_plain_text",
        image_placeholder: "image_placeholder_simple",
      },
    },
  ],
  variants: [
    ...CTA_FIRST_WAVE_VARIANTS,
    ...IMAGE_PLACEHOLDER_FIRST_WAVE_VARIANTS,
  ],
};

export const CTA_VARIANT_MATRIX = [
  { variantId: "cta_plain_text", layout: "plain_text", copySafety: "strict" },
  { variantId: "cta_button_like", layout: "button_like", copySafety: "balanced" },
  {
    variantId: "cta_qr_placeholder",
    layout: "qr_placeholder",
    copySafety: "balanced",
  },
] as const;

export const IMAGE_PLACEHOLDER_VARIANT_MATRIX = [
  {
    variantId: "image_placeholder_simple",
    layout: "simple",
    copySafety: "strict",
  },
  {
    variantId: "image_placeholder_caption",
    layout: "caption",
    copySafety: "balanced",
  },
  {
    variantId: "image_placeholder_card",
    layout: "card",
    copySafety: "balanced",
  },
] as const;
