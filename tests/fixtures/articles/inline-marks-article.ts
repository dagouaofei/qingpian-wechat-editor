import { articleFixtureBase, fixtureBlockId } from "./shared";

/**
 * 覆盖 InlineContent / InlineMark 的 Article fixture：
 * plain text、bold、italic、highlight、semantic color、link
 */
export const inlineMarksArticleFixture = {
  ...articleFixtureBase(),
  input: {
    type: "fixture" as const,
    raw: "fixture:inline-marks-article",
    capturedAt: articleFixtureBase().metadata.updatedAt,
  },
  blocks: [
    {
      id: fixtureBlockId(1),
      type: "title" as const,
      content: { text: "Inline Mark 覆盖测试" },
    },
    {
      id: fixtureBlockId(2),
      type: "paragraph" as const,
      content: {
        text: [
          { text: "普通文本 " },
          { text: "加粗", marks: [{ type: "bold" as const }] },
          { text: " " },
          { text: "斜体", marks: [{ type: "italic" as const }] },
          { text: " " },
          { text: "高亮", marks: [{ type: "highlight" as const }] },
          { text: " " },
          {
            text: "语义色",
            marks: [{ type: "color" as const, color: "brandPrimary" }],
          },
          { text: " " },
          {
            text: "链接",
            marks: [{ type: "link" as const, href: "https://example.com/article" }],
          },
        ],
      },
    },
  ],
};
