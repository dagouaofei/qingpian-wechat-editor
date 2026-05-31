import { articleFixtureBase, fixtureBlockId } from "./shared";

function allElevenBlocks() {
  return [
    { id: fixtureBlockId(1), type: "title" as const, content: { text: "文章标题" } },
    { id: fixtureBlockId(2), type: "lead" as const, content: { text: "导语段落" } },
    {
      id: fixtureBlockId(3),
      type: "heading" as const,
      content: { text: "章节标题", level: 2 as const },
    },
    {
      id: fixtureBlockId(4),
      type: "paragraph" as const,
      content: { text: [{ text: "正文段落" }] },
    },
    {
      id: fixtureBlockId(5),
      type: "divider" as const,
      content: { style: "line" as const },
    },
    {
      id: fixtureBlockId(6),
      type: "list" as const,
      content: {
        ordered: false,
        items: [{ text: "列表项一", subItems: ["子项"] }],
      },
    },
    {
      id: fixtureBlockId(7),
      type: "quote" as const,
      content: { text: "引用内容", attribution: "作者" },
    },
    {
      id: fixtureBlockId(8),
      type: "highlight" as const,
      content: { text: "重点内容", label: "提示" },
    },
    {
      id: fixtureBlockId(9),
      type: "info_card" as const,
      content: { title: "卡片标题", body: "卡片正文", icon: "info" },
    },
    {
      id: fixtureBlockId(10),
      type: "cta" as const,
      content: { text: "立即关注", action: "follow" },
    },
    {
      id: fixtureBlockId(11),
      type: "image_placeholder" as const,
      content: {
        caption: "配图说明",
        aspectRatio: "16:9" as const,
        position: "full",
        suggestion: "团队讨论场景",
      },
    },
  ];
}

/** Release 1 全部 11 种 block 的完整 Article fixture */
export const fullBlocksArticleFixture = {
  ...articleFixtureBase(),
  input: {
    type: "fixture" as const,
    raw: "fixture:full-blocks-article",
    capturedAt: articleFixtureBase().metadata.updatedAt,
  },
  blocks: allElevenBlocks(),
};

export const FULL_BLOCK_TYPES = [
  "title",
  "lead",
  "heading",
  "paragraph",
  "divider",
  "list",
  "quote",
  "highlight",
  "info_card",
  "cta",
  "image_placeholder",
] as const;
