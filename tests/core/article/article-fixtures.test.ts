import { describe, expect, it } from "vitest";

import {
  articleSchema,
  isInlineContent,
  normalizeArticle,
  parseArticle,
  validateArticle,
} from "@/core/article";
import { blockSchema } from "@/core/blocks";
import {
  FIXTURE_ARTICLE_ID,
  FULL_BLOCK_TYPES,
  fullBlocksArticleFixture,
  inlineMarksArticleFixture,
  minimalArticleFixture,
  normalizableArticleFixture,
} from "../../fixtures/articles";

describe("article fixtures", () => {
  describe("minimalArticleFixture", () => {
    it("parses via parseArticle", () => {
      const article = parseArticle(minimalArticleFixture);
      expect(article.id).toBe(FIXTURE_ARTICLE_ID);
      expect(article.blocks).toHaveLength(1);
    });

    it("validateArticle returns ok true", () => {
      const result = validateArticle(minimalArticleFixture);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.issues).toEqual([]);
      }
    });

    it("passes articleSchema.parse", () => {
      expect(articleSchema.parse(minimalArticleFixture)).toMatchObject({
        id: FIXTURE_ARTICLE_ID,
        version: 1,
      });
    });
  });

  describe("fullBlocksArticleFixture", () => {
    it("parses via parseArticle", () => {
      const article = parseArticle(fullBlocksArticleFixture);
      expect(article.blocks).toHaveLength(11);
    });

    it("contains all 11 block types", () => {
      const article = parseArticle(fullBlocksArticleFixture);
      const types = article.blocks.map((block) => block.type);
      expect(types).toEqual([...FULL_BLOCK_TYPES]);
    });

    it("each block type is valid via blockSchema", () => {
      const article = parseArticle(fullBlocksArticleFixture);
      for (const block of article.blocks) {
        expect(blockSchema.parse(block).type).toBe(block.type);
      }
    });

    it("validateArticle returns ok true", () => {
      expect(validateArticle(fullBlocksArticleFixture).ok).toBe(true);
    });
  });

  describe("inlineMarksArticleFixture", () => {
    it("parses via parseArticle", () => {
      const article = parseArticle(inlineMarksArticleFixture);
      expect(article.blocks).toHaveLength(2);
    });

    it("validateArticle returns ok true", () => {
      expect(validateArticle(inlineMarksArticleFixture).ok).toBe(true);
    });

    it("marks do not contain HTML, style objects, or className", () => {
      const serialized = JSON.stringify(inlineMarksArticleFixture);
      expect(serialized).not.toMatch(/<[^>]+>/);
      expect(serialized).not.toContain("className");
      expect(serialized).not.toMatch(/"style"\s*:\s*\{/);

      const article = parseArticle(inlineMarksArticleFixture);
      const paragraph = article.blocks.find((b) => b.type === "paragraph");
      expect(paragraph?.type).toBe("paragraph");
      if (paragraph?.type === "paragraph") {
        expect(isInlineContent(paragraph.content.text)).toBe(true);
        const marks = paragraph.content.text.flatMap((node) => node.marks ?? []);
        const markTypes = marks.map((mark) => mark.type);
        expect(markTypes).toEqual(
          expect.arrayContaining(["bold", "italic", "highlight", "color", "link"]),
        );
      }
    });
  });

  describe("normalizableArticleFixture", () => {
    it("parses before normalize", () => {
      expect(() => parseArticle(normalizableArticleFixture)).not.toThrow();
    });

    it("normalize then passes articleSchema.parse", () => {
      const parsed = parseArticle(normalizableArticleFixture);
      const normalized = normalizeArticle(parsed);
      expect(articleSchema.parse(normalized)).toEqual(normalized);
    });

    it("normalizes lead and paragraph string text to InlineContent", () => {
      const parsed = parseArticle(normalizableArticleFixture);
      const normalized = normalizeArticle(parsed);

      const lead = normalized.blocks.find((b) => b.type === "lead");
      const paragraph = normalized.blocks.find((b) => b.type === "paragraph");

      if (lead?.type === "lead") {
        expect(lead.content.text).toEqual([{ text: "导语使用 string 文本" }]);
      }
      if (paragraph?.type === "paragraph") {
        expect(paragraph.content.text).toEqual([{ text: "段落使用 string 文本" }]);
      }
    });

    it("preserves article id and block id / type after normalize", () => {
      const parsed = parseArticle(normalizableArticleFixture);
      const normalized = normalizeArticle(parsed);

      expect(normalized.id).toBe(FIXTURE_ARTICLE_ID);
      expect(normalized.blocks.map((b) => b.id)).toEqual(
        parsed.blocks.map((b) => b.id),
      );
      expect(normalized.blocks.map((b) => b.type)).toEqual(
        parsed.blocks.map((b) => b.type),
      );
    });
  });
});
