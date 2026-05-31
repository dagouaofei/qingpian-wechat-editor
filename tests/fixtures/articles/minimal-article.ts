import { articleFixtureBase, fixtureBlockId } from "./shared";

/** 最小合法 Article：1 个 title block，无 runtime / HTML / CSS 字段 */
export const minimalArticleFixture = {
  ...articleFixtureBase(),
  input: {
    type: "fixture" as const,
    raw: "fixture:minimal-article",
    capturedAt: articleFixtureBase().metadata.updatedAt,
  },
  blocks: [
    {
      id: fixtureBlockId(1),
      type: "title" as const,
      content: { text: "文章标题" },
    },
  ],
};
