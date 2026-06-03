import { parseArticle } from "@/core/article";
import { LIST_FIRST_WAVE_VARIANTS, STYLE_SCHEMA_VERSION } from "@/core/styles";
import type { ListBlockContent } from "@/core/blocks";

import { articleFixtureBase, fixtureBlockId } from "../articles/shared";

export function createListArticleFixture(options: {
  variantId: string;
  content?: ListBlockContent;
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
        type: "list" as const,
        content:
          options.content ?? {
            ordered: false,
            items: [
              { text: "第一项", subItems: ["第一项补充"] },
              { text: "第二项" },
              { text: "第三项" },
            ],
          },
      },
    ],
  });
}

export const LIST_VARIANT_REGISTRY = {
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
        list: "list_plain_bullets",
      },
    },
  ],
  variants: [...LIST_FIRST_WAVE_VARIANTS],
};

export const LIST_VARIANT_MATRIX = [
  { variantId: "list_plain_bullets", layout: "plain_bullets", marker: "•" },
  { variantId: "list_numbered_steps", layout: "numbered_steps", marker: "1." },
  { variantId: "list_checklist_cards", layout: "checklist_cards", marker: "✓" },
] as const;
