import { articleFixtureBase, fixtureBlockId } from "./shared";

/**
 * 用于 normalize 测试：paragraph / lead 的 content.text 使用 string，
 * normalize 后应变为 InlineContent
 */
export const normalizableArticleFixture = {
  ...articleFixtureBase(),
  input: {
    type: "fixture" as const,
    raw: "fixture:normalizable-article",
    capturedAt: articleFixtureBase().metadata.updatedAt,
  },
  blocks: [
    {
      id: fixtureBlockId(1),
      type: "title" as const,
      content: { text: "可归一化文章" },
    },
    {
      id: fixtureBlockId(2),
      type: "lead" as const,
      content: { text: "导语使用 string 文本" },
    },
    {
      id: fixtureBlockId(3),
      type: "paragraph" as const,
      content: { text: "段落使用 string 文本" },
    },
  ],
};
