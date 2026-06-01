import { parseArticle } from "@/core/article";
import type { InlineContent, InlineTextInput } from "@/core/article";
import {
  LEAD_FIRST_WAVE_VARIANTS,
  PARAGRAPH_FIRST_WAVE_VARIANTS,
  STYLE_SCHEMA_VERSION,
} from "@/core/styles";

import { articleFixtureBase, fixtureBlockId } from "../articles/shared";

export function createLeadParagraphArticleFixture(options: {
  blockType: "lead" | "paragraph";
  variantId: string;
  text: InlineTextInput;
}) {
  const blockId = fixtureBlockId(1);
  const block =
    options.blockType === "lead"
      ? {
          id: blockId,
          type: "lead" as const,
          content: { text: options.text },
        }
      : {
          id: blockId,
          type: "paragraph" as const,
          content: { text: options.text },
        };

  return parseArticle({
    ...articleFixtureBase(),
    styleAssignment: {
      themeId: "default",
      presetId: "classic-news",
      blockOverrides: [{ blockId, variantId: options.variantId }],
    },
    blocks: [block],
  });
}

export const LEAD_PARAGRAPH_VARIANT_REGISTRY = {
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
      id: "classic-news",
      name: "Classic News",
      schemaVersion: STYLE_SCHEMA_VERSION,
      themeId: "default",
      defaultVariantByBlockType: {
        lead: "lead_plain_intro",
        paragraph: "paragraph_plain_body",
      },
    },
  ],
  variants: [...LEAD_FIRST_WAVE_VARIANTS, ...PARAGRAPH_FIRST_WAVE_VARIANTS],
};

export const MARKS_FIXTURE: InlineContent = [
  { text: "bold", marks: [{ type: "bold" }] },
  { text: " italic", marks: [{ type: "italic" }] },
  { text: " highlight", marks: [{ type: "highlight" }] },
  { text: " color", marks: [{ type: "color", color: "brandPrimary" }] },
  {
    text: " link",
    marks: [{ type: "link", href: "https://example.com/article" }],
  },
];
