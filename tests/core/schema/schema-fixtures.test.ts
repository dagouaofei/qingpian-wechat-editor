import { describe, expect, it } from "vitest";

import {
  ArticleSchemaError,
  articleSchema,
  normalizeArticle,
  parseArticle,
  validateArticle,
} from "@/core/article";
import { blockSchema, validateBlock } from "@/core/blocks";
import {
  FIXTURE_ARTICLE_ID,
  fixtureBlockId,
  fullBlocksArticleFixture,
  minimalArticleFixture,
  normalizableArticleFixture,
} from "../../fixtures/articles";

function withBlocks(blocks: unknown[]) {
  return { ...minimalArticleFixture, blocks };
}

describe("schema fixtures integration", () => {
  describe("helpers with fixtures", () => {
    it("parseArticle handles all article fixtures", () => {
      expect(parseArticle(minimalArticleFixture).id).toBe(FIXTURE_ARTICLE_ID);
      expect(parseArticle(fullBlocksArticleFixture).blocks).toHaveLength(11);
    });

    it("validateArticle handles all article fixtures", () => {
      for (const fixture of [
        minimalArticleFixture,
        fullBlocksArticleFixture,
        normalizableArticleFixture,
      ]) {
        const result = validateArticle(fixture);
        expect(result.ok).toBe(true);
      }
    });

    it("normalizeArticle handles normalizableArticleFixture", () => {
      const parsed = parseArticle(normalizableArticleFixture);
      const normalized = normalizeArticle(parsed);
      expect(validateArticle(normalized).ok).toBe(true);
    });

    it("articleSchema parses fullBlocksArticleFixture blocks", () => {
      const parsed = articleSchema.parse(fullBlocksArticleFixture);
      expect(parsed.blocks.every((b) => blockSchema.safeParse(b).success)).toBe(
        true,
      );
    });

    it("blockSchema parses each block from fullBlocksArticleFixture", () => {
      for (const block of fullBlocksArticleFixture.blocks) {
        expect(blockSchema.parse(block)).toBeDefined();
      }
    });
  });

  describe("invalid fixtures", () => {
    it("rejects unknown block type", () => {
      const result = validateArticle(
        withBlocks([
          { id: fixtureBlockId(1), type: "unknown", content: { text: "x" } },
        ]),
      );
      expect(result.ok).toBe(false);
      expect(() =>
        parseArticle(
          withBlocks([
            { id: fixtureBlockId(1), type: "unknown", content: { text: "x" } },
          ]),
        ),
      ).toThrow(ArticleSchemaError);
    });

    it("rejects paragraph content.body", () => {
      const result = validateArticle(
        withBlocks([
          {
            id: fixtureBlockId(1),
            type: "paragraph",
            content: { body: "wrong field" },
          },
        ]),
      );
      expect(result.ok).toBe(false);
    });

    it("rejects lead content.body", () => {
      const result = validateArticle(
        withBlocks([
          {
            id: fixtureBlockId(1),
            type: "lead",
            content: { body: "wrong field" },
          },
        ]),
      );
      expect(result.ok).toBe(false);
    });

    it("rejects html injection on article root", () => {
      const result = validateArticle({
        ...minimalArticleFixture,
        html: "<p>evil</p>",
      });
      expect(result.ok).toBe(false);
    });

    it("rejects style injection on article root", () => {
      const result = validateArticle({
        ...minimalArticleFixture,
        style: { color: "red" },
      });
      expect(result.ok).toBe(false);
    });

    it("rejects className injection on article root", () => {
      const result = validateArticle({
        ...minimalArticleFixture,
        className: "evil",
      });
      expect(result.ok).toBe(false);
    });

    it("rejects html injection on block", () => {
      const block = {
        id: fixtureBlockId(1),
        type: "paragraph" as const,
        content: { text: "正文" },
        html: "<p>evil</p>",
      };
      expect(validateBlock(block).ok).toBe(false);
      const result = validateArticle(withBlocks([block]));
      expect(result.ok).toBe(false);
    });

    it("rejects illegal link href in InlineContent", () => {
      const result = validateArticle(
        withBlocks([
          {
            id: fixtureBlockId(1),
            type: "paragraph",
            content: {
              text: [
                {
                  text: "bad link",
                  marks: [{ type: "link", href: "javascript:alert(1)" }],
                },
              ],
            },
          },
        ]),
      );
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

    it("rejects style object injection in styleAssignment", () => {
      const result = validateArticle({
        ...minimalArticleFixture,
        styleAssignment: {
          themeId: "default",
          presetId: "classic-news",
          style: { color: "red" },
        },
      });
      expect(result.ok).toBe(false);
    });

    it("rejects streamArticle parallel model", () => {
      expect(validateArticle({ streamArticle: minimalArticleFixture }).ok).toBe(
        false,
      );
    });

    it("rejects previewArticle parallel model", () => {
      expect(validateArticle({ previewArticle: minimalArticleFixture }).ok).toBe(
        false,
      );
    });

    it("rejects copyArticle parallel model", () => {
      expect(validateArticle({ copyArticle: minimalArticleFixture }).ok).toBe(
        false,
      );
    });

    it("validateArticle does not throw on invalid input", () => {
      expect(() => validateArticle(null)).not.toThrow();
      expect(() =>
        validateArticle({ ...minimalArticleFixture, id: "not-uuid" }),
      ).not.toThrow();
    });
  });
});
