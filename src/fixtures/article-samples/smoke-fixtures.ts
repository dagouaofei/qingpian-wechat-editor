/** Renderer smoke fixtures — not part of the 8 article sample set. */

import { sampleArticleBase, sampleBlockId } from "./shared";

const SMOKE_ARTICLE_INDEX = 99;

export const smokeFullBlocksArticleRaw = {
  ...sampleArticleBase(
    SMOKE_ARTICLE_INDEX,
    "Renderer 冒烟 · 完整 11 block",
    "fixture:smoke-full-blocks",
  ),
  blocks: [
    { id: sampleBlockId(SMOKE_ARTICLE_INDEX, 1), type: "title" as const, content: { text: "轻篇样式进展 · 完整 block 样例" } },
    { id: sampleBlockId(SMOKE_ARTICLE_INDEX, 2), type: "lead" as const, content: { text: "导语：用于 Gallery 肉眼验收 Preview Renderer 与 Style 系统，不调用 AI。" } },
    { id: sampleBlockId(SMOKE_ARTICLE_INDEX, 3), type: "heading" as const, content: { text: "章节标题", level: 2 as const } },
    { id: sampleBlockId(SMOKE_ARTICLE_INDEX, 4), type: "paragraph" as const, content: { text: [{ text: "正文段落：每轮 Renderer / variant 改动可在此页直接查看。" }] } },
    { id: sampleBlockId(SMOKE_ARTICLE_INDEX, 5), type: "divider" as const, content: { style: "line" as const } },
    { id: sampleBlockId(SMOKE_ARTICLE_INDEX, 6), type: "list" as const, content: { ordered: false, items: [{ text: "列表项一", subItems: ["子项 A"] }] } },
    { id: sampleBlockId(SMOKE_ARTICLE_INDEX, 7), type: "quote" as const, content: { text: "引用内容", attribution: "轻篇编辑部" } },
    { id: sampleBlockId(SMOKE_ARTICLE_INDEX, 8), type: "highlight" as const, content: { text: "重点内容", label: "提示" } },
    { id: sampleBlockId(SMOKE_ARTICLE_INDEX, 9), type: "info_card" as const, content: { title: "卡片标题", body: "卡片正文", icon: "info" } },
    { id: sampleBlockId(SMOKE_ARTICLE_INDEX, 10), type: "cta" as const, content: { text: "立即关注", action: "follow" } },
    {
      id: sampleBlockId(SMOKE_ARTICLE_INDEX, 11),
      type: "image_placeholder" as const,
      content: {
        caption: "配图说明",
        aspectRatio: "16:9" as const,
        position: "full",
        suggestion: "团队讨论场景",
      },
    },
  ],
};

export const smokeMinimalTitleArticleRaw = {
  ...sampleArticleBase(SMOKE_ARTICLE_INDEX + 1, "最小 title 样例", "fixture:smoke-minimal-title"),
  blocks: [
    {
      id: sampleBlockId(SMOKE_ARTICLE_INDEX + 1, 1),
      type: "title" as const,
      content: { text: "最小 title 样例" },
    },
  ],
};
