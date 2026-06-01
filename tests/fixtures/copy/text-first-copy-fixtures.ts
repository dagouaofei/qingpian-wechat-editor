import { parseArticle } from "@/core/article";
import {
  DIVIDER_FIRST_WAVE_VARIANTS,
  HEADING_FIRST_WAVE_VARIANTS,
  LEAD_FIRST_WAVE_VARIANTS,
  PARAGRAPH_FIRST_WAVE_VARIANTS,
  STYLE_SCHEMA_VERSION,
  TITLE_FIRST_WAVE_VARIANTS,
} from "@/core/styles";

import { articleFixtureBase, fixtureBlockId } from "../articles/shared";

export const TEXT_FIRST_COPY_SNAPSHOT_VARIANTS = [
  "title_plain_minimal",
  "heading_numbered_section",
  "lead_accent_band",
  "paragraph_soft_card",
  "divider_simple_line",
  "divider_dotted_line",
] as const;

export const TEXT_FIRST_COPY_STYLE_REGISTRY = {
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
        title: "title_plain_minimal",
        heading: "heading_plain_minimal",
        lead: "lead_plain_intro",
        paragraph: "paragraph_plain_body",
        divider: "divider_simple_line",
      },
    },
  ],
  variants: [
    ...TITLE_FIRST_WAVE_VARIANTS,
    ...HEADING_FIRST_WAVE_VARIANTS,
    ...LEAD_FIRST_WAVE_VARIANTS,
    ...PARAGRAPH_FIRST_WAVE_VARIANTS,
    ...DIVIDER_FIRST_WAVE_VARIANTS,
  ],
};

export function createTextFirstCopyArticleFixture() {
  const blocks = [
    {
      id: fixtureBlockId(1),
      type: "title" as const,
      content: { text: "轻篇复制快照标题" },
    },
    {
      id: fixtureBlockId(2),
      type: "heading" as const,
      content: { text: "章节标题", level: 2 as const },
      meta: { sourceIndex: 1 },
    },
    {
      id: fixtureBlockId(3),
      type: "lead" as const,
      content: { text: "这是一段用于复制快照的导语。" },
    },
    {
      id: fixtureBlockId(4),
      type: "paragraph" as const,
      content: {
        text: [
          { text: "正文包含 " },
          { text: "加粗", marks: [{ type: "bold" as const }] },
          { text: "、" },
          { text: "高亮", marks: [{ type: "highlight" as const }] },
          { text: " 与 " },
          {
            text: "安全链接",
            marks: [
              { type: "link" as const, href: "https://example.com/article" },
            ],
          },
          { text: "。" },
        ],
      },
    },
    {
      id: fixtureBlockId(5),
      type: "divider" as const,
      content: { style: "line" as const },
    },
    {
      id: fixtureBlockId(6),
      type: "divider" as const,
      content: { style: "dot" as const },
    },
  ];

  return parseArticle({
    ...articleFixtureBase(),
    styleAssignment: {
      themeId: "default",
      presetId: "classic-news",
      blockOverrides: [
        { blockId: fixtureBlockId(1), variantId: "title_plain_minimal" },
        { blockId: fixtureBlockId(2), variantId: "heading_numbered_section" },
        { blockId: fixtureBlockId(3), variantId: "lead_accent_band" },
        { blockId: fixtureBlockId(4), variantId: "paragraph_soft_card" },
        { blockId: fixtureBlockId(5), variantId: "divider_simple_line" },
        { blockId: fixtureBlockId(6), variantId: "divider_dotted_line" },
      ],
    },
    blocks,
  });
}
