import { describe, expect, it } from "vitest";

import { blockSchema } from "@/core/blocks";
import { articleSchema } from "@/core/article";

const ARTICLE_ID = "22222222-2222-4222-8222-222222222222";
const ISO = "2026-05-31T00:00:00.000Z";

function blockId(index: number): string {
  return `11111111-1111-4111-8111-${String(index).padStart(12, "0")}`;
}

function minimalArticleBase() {
  return {
    id: ARTICLE_ID,
    version: 1 as const,
    metadata: {
      title: "文章标题",
      createdAt: ISO,
      updatedAt: ISO,
      locale: "zh-CN",
    },
    input: {
      type: "fixture" as const,
      raw: "fixture:article-minimal",
      capturedAt: ISO,
    },
    styleAssignment: {
      themeId: "default",
      presetId: "classic-news",
    },
  };
}

function allElevenBlocks() {
  return [
    { id: blockId(1), type: "title" as const, content: { text: "文章标题" } },
    { id: blockId(2), type: "lead" as const, content: { text: "导语" } },
    {
      id: blockId(3),
      type: "heading" as const,
      content: { text: "章节", level: 2 as const },
    },
    {
      id: blockId(4),
      type: "paragraph" as const,
      content: { text: [{ text: "正文", marks: [{ type: "bold" as const }] }] },
    },
    { id: blockId(5), type: "divider" as const, content: { style: "line" as const } },
    {
      id: blockId(6),
      type: "list" as const,
      content: { ordered: false, items: [{ text: "项一" }] },
    },
    {
      id: blockId(7),
      type: "quote" as const,
      content: { text: "引用", attribution: "作者" },
    },
    {
      id: blockId(8),
      type: "highlight" as const,
      content: { text: "重点", label: "提示" },
    },
    {
      id: blockId(9),
      type: "info_card" as const,
      content: { title: "卡片", body: "卡片正文" },
    },
    {
      id: blockId(10),
      type: "cta" as const,
      content: { text: "关注", action: "follow" },
    },
    {
      id: blockId(11),
      type: "image_placeholder" as const,
      content: { caption: "配图", aspectRatio: "16:9" as const },
    },
  ];
}

describe("article schema contract", () => {
  describe("valid articles", () => {
    it("parses minimal legal article", () => {
      const article = {
        ...minimalArticleBase(),
        blocks: [
          { id: blockId(1), type: "title", content: { text: "文章标题" } },
        ],
      };
      expect(articleSchema.parse(article)).toMatchObject({
        id: ARTICLE_ID,
        version: 1,
      });
    });

    it("parses article with all 11 block types", () => {
      const article = {
        ...minimalArticleBase(),
        blocks: allElevenBlocks(),
      };
      const parsed = articleSchema.parse(article);
      expect(parsed.blocks).toHaveLength(11);
      expect(parsed.blocks.map((b) => b.type)).toEqual([
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
      ]);
    });

    it("uses blockSchema for blocks array", () => {
      const block = allElevenBlocks()[3];
      expect(blockSchema.parse(block)).toEqual(block);
    });

    it("parses metadata, input, and styleAssignment", () => {
      const article = {
        ...minimalArticleBase(),
        metadata: {
          ...minimalArticleBase().metadata,
          subtitle: "副标题",
          summary: "摘要",
          author: "作者",
          tags: ["标签"],
        },
        input: {
          type: "topic" as const,
          raw: "主题输入",
          normalized: "标准化主题",
          capturedAt: ISO,
        },
        styleAssignment: {
          themeId: "default",
          presetId: "classic-news",
          blockOverrides: [
            {
              blockId: blockId(1),
              variantId: "centered_title",
              slotOverrides: { accent: "brandPrimary" },
            },
          ],
        },
        blocks: [
          { id: blockId(1), type: "title", content: { text: "文章标题" } },
        ],
      };
      expect(articleSchema.parse(article)).toMatchObject({
        metadata: { subtitle: "副标题", tags: ["标签"] },
        input: { type: "topic", normalized: "标准化主题" },
        styleAssignment: {
          blockOverrides: [{ variantId: "centered_title" }],
        },
      });
    });

    it("parses optional generation meta", () => {
      const article = {
        ...minimalArticleBase(),
        generation: {
          status: "completed" as const,
          mode: "batch" as const,
          modelId: "gpt-test",
          startedAt: ISO,
          completedAt: ISO,
        },
        blocks: [
          { id: blockId(1), type: "title", content: { text: "文章标题" } },
        ],
      };
      expect(articleSchema.parse(article).generation?.status).toBe("completed");
    });

    it("rejects HTML in metadata.title", () => {
      expect(() =>
        articleSchema.parse({
          ...minimalArticleBase(),
          metadata: {
            ...minimalArticleBase().metadata,
            title: "<script>bad</script>",
          },
          blocks: [
            { id: blockId(1), type: "title", content: { text: "标题" } },
          ],
        }),
      ).toThrow();
    });

    it("accepts version literal 1", () => {
      const parsed = articleSchema.parse({
        ...minimalArticleBase(),
        blocks: [
          { id: blockId(1), type: "title", content: { text: "标题" } },
        ],
      });
      expect(parsed.version).toBe(1);
    });
  });

  describe("invalid articles", () => {
    it("rejects missing id", () => {
      const base = {
        ...minimalArticleBase(),
        blocks: [
          { id: blockId(1), type: "title", content: { text: "标题" } },
        ],
      };
      const rest = { ...base };
      delete (rest as { id?: string }).id;
      expect(() => articleSchema.parse(rest)).toThrow();
    });

    it("rejects missing blocks", () => {
      expect(() => articleSchema.parse(minimalArticleBase())).toThrow();
    });

    it("rejects empty blocks array", () => {
      expect(() =>
        articleSchema.parse({ ...minimalArticleBase(), blocks: [] }),
      ).toThrow();
    });

    it("rejects unknown block type in blocks", () => {
      expect(() =>
        articleSchema.parse({
          ...minimalArticleBase(),
          blocks: [
            { id: blockId(1), type: "unknown", content: { text: "x" } },
          ],
        }),
      ).toThrow();
    });

    it("rejects invalid block content", () => {
      expect(() =>
        articleSchema.parse({
          ...minimalArticleBase(),
          blocks: [
            {
              id: blockId(1),
              type: "paragraph",
              content: { body: "wrong" },
            },
          ],
        }),
      ).toThrow();
    });

    it("rejects style injection on article", () => {
      expect(() =>
        articleSchema.parse({
          ...minimalArticleBase(),
          style: { color: "red" },
          blocks: [
            { id: blockId(1), type: "title", content: { text: "标题" } },
          ],
        }),
      ).toThrow();
    });

    it("rejects className injection on article", () => {
      expect(() =>
        articleSchema.parse({
          ...minimalArticleBase(),
          className: "evil",
          blocks: [
            { id: blockId(1), type: "title", content: { text: "标题" } },
          ],
        }),
      ).toThrow();
    });

    it("rejects html field injection on article", () => {
      expect(() =>
        articleSchema.parse({
          ...minimalArticleBase(),
          html: "<p>x</p>",
          blocks: [
            { id: blockId(1), type: "title", content: { text: "标题" } },
          ],
        }),
      ).toThrow();
    });

    it("rejects CSS style object in styleAssignment slotOverrides", () => {
      expect(() =>
        articleSchema.parse({
          ...minimalArticleBase(),
          styleAssignment: {
            themeId: "default",
            presetId: "classic-news",
            blockOverrides: [
              {
                blockId: blockId(1),
                slotOverrides: { accent: { color: "red" } },
              },
            ],
          },
          blocks: [
            { id: blockId(1), type: "title", content: { text: "标题" } },
          ],
        }),
      ).toThrow();
    });

    it("rejects unknown top-level fields", () => {
      expect(() =>
        articleSchema.parse({
          ...minimalArticleBase(),
          extraField: true,
          blocks: [
            { id: blockId(1), type: "title", content: { text: "标题" } },
          ],
        }),
      ).toThrow();
    });

    it("rejects invalid version", () => {
      expect(() =>
        articleSchema.parse({
          ...minimalArticleBase(),
          version: 2,
          blocks: [
            { id: blockId(1), type: "title", content: { text: "标题" } },
          ],
        }),
      ).toThrow();
    });
  });

  describe("parallel model boundaries", () => {
    it("rejects streamArticle parallel root", () => {
      expect(() =>
        articleSchema.parse({
          streamArticle: {
            ...minimalArticleBase(),
            blocks: [
              { id: blockId(1), type: "title", content: { text: "标题" } },
            ],
          },
        }),
      ).toThrow();
    });

    it("rejects previewArticle parallel root", () => {
      expect(() =>
        articleSchema.parse({
          previewArticle: minimalArticleBase(),
        }),
      ).toThrow();
    });

    it("rejects copyArticle parallel root", () => {
      expect(() =>
        articleSchema.parse({
          copyArticle: minimalArticleBase(),
        }),
      ).toThrow();
    });

    it("rejects streamArticle alongside valid article fields", () => {
      expect(() =>
        articleSchema.parse({
          ...minimalArticleBase(),
          streamArticle: {},
          blocks: [
            { id: blockId(1), type: "title", content: { text: "标题" } },
          ],
        }),
      ).toThrow();
    });

    it("rejects blocks as HTML string", () => {
      expect(() =>
        articleSchema.parse({
          ...minimalArticleBase(),
          blocks: "<p>html</p>",
        }),
      ).toThrow();
    });
  });
});
