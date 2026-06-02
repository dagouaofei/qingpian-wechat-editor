/** Gallery fixture articles — shared IDs aligned with tests/fixtures/articles for traceability. */

export const GALLERY_FIXTURE_ARTICLE_ID = "22222222-2222-4222-8222-222222222222";

export const GALLERY_FIXTURE_ISO = "2026-05-31T00:00:00.000Z";

function galleryBlockId(index: number): string {
  return `11111111-1111-4111-8111-${String(index).padStart(12, "0")}`;
}

function galleryArticleBase() {
  return {
    id: GALLERY_FIXTURE_ARTICLE_ID,
    version: 1 as const,
    metadata: {
      title: "Gallery 样例文章",
      createdAt: GALLERY_FIXTURE_ISO,
      updatedAt: GALLERY_FIXTURE_ISO,
      locale: "zh-CN",
    },
    input: {
      type: "fixture" as const,
      raw: "fixture:gallery",
      capturedAt: GALLERY_FIXTURE_ISO,
    },
    styleAssignment: {
      themeId: "default",
      presetId: "classic-news",
    },
  };
}

/** Release 1 全部 11 种 block — 与 tests/fixtures/articles/full-blocks-article 同构 */
export const galleryFullBlocksArticleRaw = {
  ...galleryArticleBase(),
  input: {
    type: "fixture" as const,
    raw: "fixture:full-blocks-article",
    capturedAt: GALLERY_FIXTURE_ISO,
  },
  blocks: [
    { id: galleryBlockId(1), type: "title" as const, content: { text: "轻篇样式进展 · 完整 block 样例" } },
    { id: galleryBlockId(2), type: "lead" as const, content: { text: "导语：用于 Gallery 肉眼验收 Preview Renderer 与 Style 系统，不调用 AI。" } },
    { id: galleryBlockId(3), type: "heading" as const, content: { text: "章节标题", level: 2 as const } },
    { id: galleryBlockId(4), type: "paragraph" as const, content: { text: [{ text: "正文段落：每轮 Renderer / variant 改动可在此页直接查看。" }] } },
    { id: galleryBlockId(5), type: "divider" as const, content: { style: "line" as const } },
    { id: galleryBlockId(6), type: "list" as const, content: { ordered: false, items: [{ text: "列表项一", subItems: ["子项 A"] }] } },
    { id: galleryBlockId(7), type: "quote" as const, content: { text: "引用内容", attribution: "轻篇编辑部" } },
    { id: galleryBlockId(8), type: "highlight" as const, content: { text: "重点内容", label: "提示" } },
    { id: galleryBlockId(9), type: "info_card" as const, content: { title: "卡片标题", body: "卡片正文", icon: "info" } },
    { id: galleryBlockId(10), type: "cta" as const, content: { text: "立即关注", action: "follow" } },
    {
      id: galleryBlockId(11),
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

export const galleryMinimalArticleRaw = {
  ...galleryArticleBase(),
  input: {
    type: "fixture" as const,
    raw: "fixture:minimal-article",
    capturedAt: GALLERY_FIXTURE_ISO,
  },
  blocks: [
    {
      id: galleryBlockId(1),
      type: "title" as const,
      content: { text: "最小 title 样例" },
    },
  ],
};

export type GallerySampleId = "full-blocks" | "minimal-title";

export type GallerySampleDefinition = {
  id: GallerySampleId;
  label: string;
  description: string;
  blockCount: number;
  blockTypes: string[];
};

export const GALLERY_SAMPLES: GallerySampleDefinition[] = [
  {
    id: "full-blocks",
    label: "完整 11 block",
    description: "Release 1 first-wave 全部 block 类型 · fixture 驱动 Preview",
    blockCount: 11,
    blockTypes: [
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
    ],
  },
  {
    id: "minimal-title",
    label: "最小 title",
    description: "最小合法 Article · 单 block 冒烟",
    blockCount: 1,
    blockTypes: ["title"],
  },
];

export function galleryArticleRawForSample(sampleId: GallerySampleId) {
  switch (sampleId) {
    case "full-blocks":
      return galleryFullBlocksArticleRaw;
    case "minimal-title":
      return galleryMinimalArticleRaw;
    default:
      throw new Error(`unknown gallery sample: ${sampleId satisfies never}`);
  }
}
