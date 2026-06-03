import { parseArticle } from "@/core/article";
import type { InfoCardBlockContent } from "@/core/blocks";
import { INFO_CARD_FIRST_WAVE_VARIANTS, STYLE_SCHEMA_VERSION } from "@/core/styles";

import { articleFixtureBase, fixtureBlockId } from "../articles/shared";

export function createInfoCardArticleFixture(options: {
  variantId: string;
  content?: InfoCardBlockContent;
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
        type: "info_card" as const,
        content:
          options.content ?? {
            title: "关键结论",
            body: "这是信息卡正文。\n这是第二行说明。",
            icon: "注意",
          },
      },
    ],
  });
}

export const INFO_CARD_VARIANT_REGISTRY = {
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
        info_card: "info_card_key_takeaway",
      },
    },
  ],
  variants: [...INFO_CARD_FIRST_WAVE_VARIANTS],
};

export const INFO_CARD_VARIANT_MATRIX = [
  { variantId: "info_card_key_takeaway", layout: "key_takeaway" },
  { variantId: "info_card_steps", layout: "steps" },
  { variantId: "info_card_warning_note", layout: "warning_note" },
] as const;
