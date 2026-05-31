import { describe, expect, it } from "vitest";

import { parseArticle } from "@/core/article";
import {
  StyleResolveError,
  parseStyleRegistry,
  resolveArticleStyle,
  resolveBlockStyle,
} from "@/core/styles";
import { minimalArticleFixture } from "../../fixtures/articles";
import { fixtureBlockId } from "../../fixtures/articles/shared";
import { minimalStyleRegistryFixture } from "../../fixtures/styles/minimal-registry";

function articleWithBlocks(blocks: unknown[]) {
  return parseArticle({
    ...minimalArticleFixture,
    blocks,
  });
}

describe("style resolver", () => {
  const registry = parseStyleRegistry(minimalStyleRegistryFixture);

  describe("resolveArticleStyle", () => {
    it("resolves valid Article + Registry to ResolvedArticleStyle", () => {
      const article = parseArticle(minimalArticleFixture);
      const resolved = resolveArticleStyle(article, registry);

      expect(resolved.articleId).toBe(article.id);
      expect(resolved.presetId).toBe("classic-news");
      expect(resolved.themeId).toBe("default");
      expect(resolved.blocks).toHaveLength(1);
    });

    it("preserves block order", () => {
      const article = articleWithBlocks([
        {
          id: fixtureBlockId(1),
          type: "title",
          content: { text: "标题" },
        },
        {
          id: fixtureBlockId(2),
          type: "paragraph",
          content: { text: [{ text: "段落" }] },
        },
      ]);

      const resolved = resolveArticleStyle(article, registry);
      expect(resolved.blocks.map((b) => b.blockId)).toEqual([
        fixtureBlockId(1),
        fixtureBlockId(2),
      ]);
      expect(resolved.blocks.map((b) => b.blockType)).toEqual([
        "title",
        "paragraph",
      ]);
    });

    it("includes blockId blockType variantId presetId themeId on each block", () => {
      const article = parseArticle(minimalArticleFixture);
      const resolved = resolveArticleStyle(article, registry);
      const block = resolved.blocks[0]!;

      expect(block.blockId).toBe(fixtureBlockId(1));
      expect(block.blockType).toBe("title");
      expect(block.variantId).toBe("title-centered");
      expect(block.presetId).toBe("classic-news");
      expect(block.themeId).toBe("default");
      expect(block.variant.id).toBe("title-centered");
    });

    it("uses preset defaultVariantByBlockType", () => {
      const article = articleWithBlocks([
        {
          id: fixtureBlockId(1),
          type: "paragraph",
          content: { text: [{ text: "段落" }] },
        },
      ]);

      const resolved = resolveArticleStyle(article, registry);
      expect(resolved.blocks[0]?.variantId).toBe("paragraph-standard");
      expect(resolved.blocks[0]?.source).toBe("preset_default");
    });

    it("prefers block-level variant override over preset default", () => {
      const article = parseArticle({
        ...minimalArticleFixture,
        styleAssignment: {
          themeId: "default",
          presetId: "classic-news",
          blockOverrides: [
            {
              blockId: fixtureBlockId(1),
              variantId: "title-left",
            },
          ],
        },
        blocks: [
          {
            id: fixtureBlockId(1),
            type: "title",
            content: { text: "标题" },
          },
        ],
      });

      const resolved = resolveArticleStyle(article, registry);
      expect(resolved.blocks[0]?.variantId).toBe("title-left");
      expect(resolved.blocks[0]?.source).toBe("explicit");
    });

    it("falls back when explicit variant not found and records issue", () => {
      const article = parseArticle({
        ...minimalArticleFixture,
        styleAssignment: {
          themeId: "default",
          presetId: "classic-news",
          blockOverrides: [
            {
              blockId: fixtureBlockId(1),
              variantId: "missing-variant",
            },
          ],
        },
      });

      const resolved = resolveArticleStyle(article, registry);
      expect(resolved.blocks[0]?.variantId).toBe("title-centered");
      expect(resolved.blocks[0]?.source).toBe("preset_default");
      expect(resolved.issues?.some((i) => i.code === "variant_not_found")).toBe(
        true,
      );
    });

    it("uses registry fallback when explicit and preset default both fail", () => {
      const article = parseArticle({
        ...minimalArticleFixture,
        styleAssignment: {
          themeId: "default",
          presetId: "classic-news",
          blockOverrides: [
            {
              blockId: fixtureBlockId(1),
              variantId: "missing-variant",
            },
          ],
        },
        blocks: [
          {
            id: fixtureBlockId(1),
            type: "heading",
            content: { text: "章节", level: 2 },
          },
        ],
      });

      const resolved = resolveArticleStyle(article, registry);
      expect(resolved.blocks[0]?.variantId).toBe("heading-safe");
      expect(resolved.blocks[0]?.source).toBe("fallback");
      expect(resolved.blocks[0]?.fallbackReason).toContain("Fell back");
    });

    it("falls back when variant blockType mismatches and preset has no default", () => {
      const article = parseArticle({
        ...minimalArticleFixture,
        styleAssignment: {
          themeId: "default",
          presetId: "classic-news",
          blockOverrides: [
            {
              blockId: fixtureBlockId(1),
              variantId: "paragraph-standard",
            },
          ],
        },
        blocks: [
          {
            id: fixtureBlockId(1),
            type: "heading",
            content: { text: "章节", level: 2 },
          },
        ],
      });

      const resolved = resolveArticleStyle(article, registry);
      expect(resolved.blocks[0]?.variantId).toBe("heading-safe");
      expect(resolved.blocks[0]?.source).toBe("fallback");
      expect(resolved.issues?.some((i) => i.code === "variant_block_type_mismatch")).toBe(
        true,
      );
    });

    it("falls back when preset not found and records issue", () => {
      const article = parseArticle({
        ...minimalArticleFixture,
        styleAssignment: {
          themeId: "default",
          presetId: "missing-preset",
        },
      });

      const resolved = resolveArticleStyle(article, registry);
      expect(resolved.presetId).toBe("classic-news");
      expect(resolved.issues?.some((i) => i.code === "preset_not_found")).toBe(
        true,
      );
    });

    it("records issue when theme not found and falls back", () => {
      const article = parseArticle({
        ...minimalArticleFixture,
        styleAssignment: {
          themeId: "missing-theme",
          presetId: "classic-news",
        },
      });

      const resolved = resolveArticleStyle(article, registry);
      expect(resolved.themeId).toBe("default");
      expect(resolved.issues?.some((i) => i.code === "theme_not_found")).toBe(
        true,
      );
    });

    it("does not default to experimental variant", () => {
      const article = articleWithBlocks([
        {
          id: fixtureBlockId(1),
          type: "heading",
          content: { text: "章节", level: 2 },
        },
      ]);

      const resolved = resolveArticleStyle(article, registry);
      expect(resolved.blocks[0]?.variantId).toBe("heading-safe");
      expect(resolved.blocks[0]?.variant.status).not.toBe("experimental");
    });

    it("does not use magazine_left_bar_title as automatic fallback", () => {
      const registryOnlyMagazine = parseStyleRegistry({
        ...minimalStyleRegistryFixture,
        variants: [
          minimalStyleRegistryFixture.variants.find(
            (v) => v.id === "magazine_left_bar_title",
          )!,
        ],
      });

      const article = articleWithBlocks([
        {
          id: fixtureBlockId(1),
          type: "heading",
          content: { text: "章节", level: 2 },
        },
      ]);

      expect(() => resolveArticleStyle(article, registryOnlyMagazine)).toThrow(
        StyleResolveError,
      );
    });

    it("does not mutate the original Article", () => {
      const article = parseArticle(minimalArticleFixture);
      const snapshot = JSON.stringify(article);
      resolveArticleStyle(article, registry);
      expect(JSON.stringify(article)).toBe(snapshot);
    });

    it("output does not contain html css className or inline style fields", () => {
      const article = parseArticle(minimalArticleFixture);
      const resolved = resolveArticleStyle(article, registry);
      const serialized = JSON.stringify(resolved);

      expect(serialized).not.toMatch(/"html"\s*:/);
      expect(serialized).not.toMatch(/"className"\s*:/);
      expect(serialized).not.toMatch(/"css"\s*:/);
      expect(resolved.blocks[0]).not.toHaveProperty("style");
    });

    it("throws in strict mode when preset is missing", () => {
      const article = parseArticle({
        ...minimalArticleFixture,
        styleAssignment: {
          themeId: "default",
          presetId: "missing-preset",
        },
      });

      expect(() =>
        resolveArticleStyle(article, registry, { strict: true }),
      ).toThrow(StyleResolveError);
    });
  });

  describe("resolveBlockStyle", () => {
    it("resolves a single block via context", () => {
      const article = parseArticle(minimalArticleFixture);
      const block = article.blocks[0]!;
      const preset = registry.presets[0]!;
      const theme = registry.themes[0]!;

      const resolved = resolveBlockStyle(block, {
        registry,
        preset,
        theme,
        presetId: preset.id,
        themeId: theme.id,
        issues: [],
      });

      expect(resolved.blockId).toBe(block.id);
      expect(resolved.tokens.theme.color?.["text.default"]).toBe("#333333");
    });
  });
});
