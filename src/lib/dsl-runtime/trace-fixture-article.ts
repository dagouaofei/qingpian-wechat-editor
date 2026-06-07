import { parseArticle } from "@/core/article";
import type { Article } from "@/core/article";
import type { BlockType } from "@/core/blocks";

const FIXTURE_ISO = "2026-06-07T00:00:00.000Z";
const FIXTURE_ARTICLE_ID = "33333333-3333-4333-8333-333333333333";

function fixtureBlockId(index: number): string {
  return `44444444-4444-4444-8444-${String(index).padStart(12, "0")}`;
}

const TRACE_FIXTURE_RAW = {
  id: FIXTURE_ARTICLE_ID,
  version: 1,
  metadata: {
    title: "DSL Runtime Trace Fixture",
    createdAt: FIXTURE_ISO,
    updatedAt: FIXTURE_ISO,
    locale: "zh-CN",
  },
  input: {
    type: "fixture",
    raw: "fixture:dsl-runtime-trace",
    capturedAt: FIXTURE_ISO,
  },
  styleAssignment: {
    themeId: "businessBlue",
    presetId: "business",
  },
  blocks: [
    {
      id: fixtureBlockId(1),
      type: "title",
      content: { text: "DSL Runtime Trace Fixture" },
    },
    {
      id: fixtureBlockId(2),
      type: "heading",
      content: { text: "测试标题", level: 2 },
    },
    {
      id: fixtureBlockId(3),
      type: "paragraph",
      content: { text: [{ text: "Trace fixture paragraph." }] },
    },
    {
      id: fixtureBlockId(4),
      type: "info_card",
      content: { title: "信息卡标题", body: "Trace fixture body." },
    },
  ],
} as const;

export const dslRuntimeTraceFixtureArticle: Article = parseArticle(TRACE_FIXTURE_RAW);

export function pickTraceFixtureBlock(blockType: BlockType) {
  return (
    dslRuntimeTraceFixtureArticle.blocks.find((block) => block.type === blockType) ??
    dslRuntimeTraceFixtureArticle.blocks[0]!
  );
}
