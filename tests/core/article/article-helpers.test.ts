import { describe, expect, it } from "vitest";

import {
  ArticleSchemaError,
  articleSchema,
  normalizeArticle,
  parseArticle,
  validateArticle,
} from "@/core/article";

const ARTICLE_ID = "22222222-2222-4222-8222-222222222222";
const BLOCK_ID = "11111111-1111-4111-8111-000000000001";
const ISO = "2026-05-31T00:00:00.000Z";

function minimalArticle(overrides?: {
  blocks?: unknown[];
  extra?: Record<string, unknown>;
}) {
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
    blocks: overrides?.blocks ?? [
      { id: BLOCK_ID, type: "title", content: { text: "文章标题" } },
    ],
    ...overrides?.extra,
  };
}

describe("article schema helpers", () => {
  describe("validateArticle", () => {
    it("returns ok true for valid article", () => {
      const result = validateArticle(minimalArticle());
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.id).toBe(ARTICLE_ID);
        expect(result.issues).toEqual([]);
      }
    });

    it("returns ok false with issues for invalid article", () => {
      const result = validateArticle({ ...minimalArticle(), id: "not-uuid" });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues.length).toBeGreaterThan(0);
        expect(result.issues[0]).toMatchObject({
          path: expect.any(Array),
          message: expect.any(String),
          code: expect.any(String),
        });
      }
    });

    it("does not throw on invalid input", () => {
      expect(() => validateArticle(null)).not.toThrow();
    });
  });

  describe("parseArticle", () => {
    it("parses valid article", () => {
      const article = parseArticle(minimalArticle());
      expect(article.id).toBe(ARTICLE_ID);
    });

    it("throws ArticleSchemaError on invalid input", () => {
      expect(() => parseArticle(null)).toThrow(ArticleSchemaError);
    });

    it("rejects unknown block type", () => {
      expect(() =>
        parseArticle(
          minimalArticle({
            blocks: [{ id: BLOCK_ID, type: "unknown", content: { text: "x" } }],
          }),
        ),
      ).toThrow(ArticleSchemaError);
    });

    it("rejects HTML string in metadata title", () => {
      expect(() =>
        parseArticle({
          ...minimalArticle(),
          metadata: {
            ...minimalArticle().metadata,
            title: "<script>bad</script>",
          },
        }),
      ).toThrow(ArticleSchemaError);
    });

    it("rejects streamArticle parallel root", () => {
      expect(() => parseArticle({ streamArticle: minimalArticle() })).toThrow(
        ArticleSchemaError,
      );
    });
  });

  describe("normalizeArticle", () => {
    it("normalizes paragraph.content.text string to InlineContent", () => {
      const parsed = parseArticle(
        minimalArticle({
          blocks: [
            {
              id: BLOCK_ID,
              type: "paragraph",
              content: { text: "正文段落" },
            },
          ],
        }),
      );
      const normalized = normalizeArticle(parsed);
      const block = normalized.blocks[0];
      expect(block?.type).toBe("paragraph");
      if (block?.type === "paragraph") {
        expect(block.content.text).toEqual([{ text: "正文段落" }]);
      }
    });

    it("normalizes lead.content.text string to InlineContent", () => {
      const parsed = parseArticle(
        minimalArticle({
          blocks: [
            { id: BLOCK_ID, type: "lead", content: { text: "导语" } },
          ],
        }),
      );
      const normalized = normalizeArticle(parsed);
      const block = normalized.blocks[0];
      expect(block?.type).toBe("lead");
      if (block?.type === "lead") {
        expect(block.content.text).toEqual([{ text: "导语" }]);
      }
    });

    it("normalized article passes articleSchema.parse", () => {
      const parsed = parseArticle(
        minimalArticle({
          blocks: [
            {
              id: BLOCK_ID,
              type: "paragraph",
              content: { text: "段落" },
            },
          ],
        }),
      );
      const normalized = normalizeArticle(parsed);
      expect(articleSchema.parse(normalized)).toEqual(normalized);
    });

    it("preserves article id and block id / type", () => {
      const parsed = parseArticle(
        minimalArticle({
          blocks: [
            {
              id: BLOCK_ID,
              type: "paragraph",
              content: { text: "段落" },
            },
          ],
        }),
      );
      const normalized = normalizeArticle(parsed);
      expect(normalized.id).toBe(ARTICLE_ID);
      expect(normalized.blocks[0]?.id).toBe(BLOCK_ID);
      expect(normalized.blocks[0]?.type).toBe("paragraph");
    });

    it("keeps existing InlineContent valid", () => {
      const inline = [{ text: "词", marks: [{ type: "bold" as const }] }];
      const parsed = parseArticle(
        minimalArticle({
          blocks: [
            {
              id: BLOCK_ID,
              type: "paragraph",
              content: { text: inline },
            },
          ],
        }),
      );
      const normalized = normalizeArticle(parsed);
      const block = normalized.blocks[0];
      if (block?.type === "paragraph") {
        expect(block.content.text).toEqual(inline);
      }
    });

    it("does not add renderer style or generation fields", () => {
      const parsed = parseArticle(
        minimalArticle({
          blocks: [
            {
              id: BLOCK_ID,
              type: "paragraph",
              content: { text: "段落" },
            },
          ],
        }),
      );
      const normalized = normalizeArticle(parsed);
      expect(normalized).not.toHaveProperty("style");
      expect(normalized).not.toHaveProperty("className");
      expect(normalized).not.toHaveProperty("html");
      expect(normalized.blocks[0]).not.toHaveProperty("resolvedStyle");
    });
  });

  describe("boundary rejection", () => {
    it("validateArticle rejects previewArticle root", () => {
      const result = validateArticle({ previewArticle: minimalArticle() });
      expect(result.ok).toBe(false);
    });

    it("validateArticle rejects copyArticle root", () => {
      const result = validateArticle({ copyArticle: minimalArticle() });
      expect(result.ok).toBe(false);
    });

    it("validateArticle rejects style injection", () => {
      const result = validateArticle(
        minimalArticle({ extra: { style: { color: "red" } } }),
      );
      expect(result.ok).toBe(false);
    });

    it("validateArticle rejects className injection", () => {
      const result = validateArticle(
        minimalArticle({ extra: { className: "evil" } }),
      );
      expect(result.ok).toBe(false);
    });

    it("validateArticle rejects html injection", () => {
      const result = validateArticle(
        minimalArticle({ extra: { html: "<p>x</p>" } }),
      );
      expect(result.ok).toBe(false);
    });

    it("validateArticle rejects unknown passthrough fields", () => {
      const result = validateArticle(
        minimalArticle({ extra: { extraField: true } }),
      );
      expect(result.ok).toBe(false);
    });
  });
});
