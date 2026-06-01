import { parseArticle } from "@/core/article";
import {
  CTA_FIRST_WAVE_VARIANTS,
  HIGHLIGHT_FIRST_WAVE_VARIANTS,
  IMAGE_PLACEHOLDER_FIRST_WAVE_VARIANTS,
  INFO_CARD_FIRST_WAVE_VARIANTS,
  LIST_FIRST_WAVE_VARIANTS,
  QUOTE_FIRST_WAVE_VARIANTS,
  STYLE_SCHEMA_VERSION,
} from "@/core/styles";

import { articleFixtureBase, fixtureBlockId } from "../articles/shared";

export const STRUCTURED_COPY_SNAPSHOT_VARIANTS = [
  "list_plain_bullets",
  "list_numbered_steps",
  "list_checklist_cards",
  "quote_plain",
  "quote_left_bar",
  "quote_card",
  "highlight_inline_emphasis",
  "highlight_accent_band",
  "highlight_soft_card",
  "info_card_key_takeaway",
  "info_card_steps",
  "info_card_warning_note",
  "cta_plain_text",
  "cta_button_like",
  "cta_qr_placeholder",
  "image_placeholder_simple",
  "image_placeholder_caption",
  "image_placeholder_card",
] as const;

export const STRUCTURED_COPY_STYLE_REGISTRY = {
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
          "brand.primary": "#576b95",
        },
        fontSize: { body: "16px" },
      },
    },
  ],
  presets: [
    {
      id: "classic-news",
      name: "Classic News",
      schemaVersion: STYLE_SCHEMA_VERSION,
      themeId: "default",
      defaultVariantByBlockType: {
        list: "list_plain_bullets",
        quote: "quote_plain",
        highlight: "highlight_inline_emphasis",
        info_card: "info_card_key_takeaway",
        cta: "cta_plain_text",
        image_placeholder: "image_placeholder_simple",
      },
    },
  ],
  variants: [
    ...LIST_FIRST_WAVE_VARIANTS,
    ...QUOTE_FIRST_WAVE_VARIANTS,
    ...HIGHLIGHT_FIRST_WAVE_VARIANTS,
    ...INFO_CARD_FIRST_WAVE_VARIANTS,
    ...CTA_FIRST_WAVE_VARIANTS,
    ...IMAGE_PLACEHOLDER_FIRST_WAVE_VARIANTS,
  ],
};

export function createStructuredCopyArticleFixture() {
  const blocks = STRUCTURED_COPY_SNAPSHOT_VARIANTS.map((variantId, index) => {
    const id = fixtureBlockId(index + 1);

    if (variantId.startsWith("list_")) {
      return {
        id,
        type: "list" as const,
        content: {
          ordered: variantId === "list_numbered_steps",
          items: [
            { text: "确认内容结构" },
            { text: "检查复制输出", subItems: ["保留顺序", "保留文本"] },
            { text: "记录待人工粘贴验证项" },
          ],
        },
      };
    }

    if (variantId.startsWith("quote_")) {
      return {
        id,
        type: "quote" as const,
        content: {
          text: "复制路径必须优先保证正文内容稳定。",
          attribution: "轻篇 Renderer Contract",
        },
      };
    }

    if (variantId.startsWith("highlight_")) {
      return {
        id,
        type: "highlight" as const,
        content: {
          text: "这是 structured copy snapshot 的重点提示。",
          label: "重点",
        },
      };
    }

    if (variantId.startsWith("info_card_")) {
      return {
        id,
        type: "info_card" as const,
        content: {
          title: "结构化信息卡",
          body: "第一条信息\n第二条信息",
          icon: "提示",
        },
      };
    }

    if (variantId.startsWith("cta_")) {
      return {
        id,
        type: "cta" as const,
        content: {
          text: "关注轻篇，获取后续模板更新。",
          action: "占位操作文案",
        },
      };
    }

    return {
      id,
      type: "image_placeholder" as const,
      content: {
        caption: "这里需要一张产品截图",
        aspectRatio: "16:9" as const,
        position: "full" as const,
        suggestion: "后续由人工补充图片资源",
      },
    };
  });

  return parseArticle({
    ...articleFixtureBase(),
    styleAssignment: {
      themeId: "default",
      presetId: "classic-news",
      blockOverrides: STRUCTURED_COPY_SNAPSHOT_VARIANTS.map((variantId, index) => ({
        blockId: fixtureBlockId(index + 1),
        variantId,
      })),
    },
    blocks,
  });
}
