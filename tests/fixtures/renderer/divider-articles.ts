import { parseArticle } from "@/core/article";
import { DIVIDER_FIRST_WAVE_VARIANTS, STYLE_SCHEMA_VERSION } from "@/core/styles";

import { articleFixtureBase, fixtureBlockId } from "../articles/shared";

export function createDividerArticleFixture(options: {
  variantId: string;
  content?: Record<string, never> | { style?: "line" | "space" | "dot" };
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
        type: "divider" as const,
        content: options.content ?? {},
      },
    ],
  });
}

export const DIVIDER_VARIANT_REGISTRY = {
  schemaVersion: STYLE_SCHEMA_VERSION,
  themes: [
    {
      id: "default",
      name: "Default Theme",
      schemaVersion: STYLE_SCHEMA_VERSION,
      tokens: {
        color: { "text.default": "#333333" },
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
        divider: "divider_simple_line",
      },
    },
  ],
  variants: [...DIVIDER_FIRST_WAVE_VARIANTS],
};

export const DIVIDER_VARIANT_MATRIX = [
  { variantId: "divider_simple_line", layout: "simple_line" },
  { variantId: "divider_dotted_line", layout: "dotted_line" },
  { variantId: "divider_section_space", layout: "section_space" },
] as const;
