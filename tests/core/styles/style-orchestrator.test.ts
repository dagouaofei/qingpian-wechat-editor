import { describe, expect, it } from "vitest";

import { parseArticle } from "@/core/article";
import {
  createFirstWaveRequiredVariantRegistry,
  orchestrateArticleStyle,
  parseStyleRegistry,
  resolveArticleStyle,
} from "@/core/styles";
import { FIRST_WAVE_TITLE_HEADING_VARIANT_REGISTRY } from "@/core/styles/variants/title-heading";

const fullRegistry = createFirstWaveRequiredVariantRegistry();

import { minimalArticleFixture } from "../../fixtures/articles/minimal-article";
import { fixtureBlockId } from "../../fixtures/articles/shared";

function articleWithBlocks(
  blocks: unknown[],
  styleAssignment?: Record<string, unknown>,
) {
  return parseArticle({
    ...minimalArticleFixture,
    styleAssignment: {
      themeId: "businessBlue",
      presetId: "business",
      ...styleAssignment,
    },
    blocks,
  });
}

describe("orchestrateArticleStyle", () => {
  const registry = parseStyleRegistry(FIRST_WAVE_TITLE_HEADING_VARIANT_REGISTRY);

  it("returns ArticleStylePlan for valid Article input", () => {
    const article = articleWithBlocks([
      {
        id: fixtureBlockId(1),
        type: "title",
        content: { text: "标题" },
      },
    ]);

    const result = orchestrateArticleStyle(article, registry);

    expect(result.plan.articleId).toBe(article.id);
    expect(result.plan.presetId).toBe("business");
    expect(result.plan.themeId).toBe("businessBlue");
    expect(result.styleAssignment.presetId).toBe("business");
  });

  it("does not mutate the original Article object", () => {
    const article = articleWithBlocks([
      {
        id: fixtureBlockId(1),
        type: "title",
        content: { text: "标题" },
      },
    ]);
    const snapshot = structuredClone(article);

    orchestrateArticleStyle(article, registry);

    expect(article).toEqual(snapshot);
  });

  it("does not modify Article.blocks or block.content", () => {
    const article = articleWithBlocks([
      {
        id: fixtureBlockId(1),
        type: "title",
        content: { text: "标题" },
      },
      {
        id: fixtureBlockId(2),
        type: "heading",
        content: { text: "章节", level: 2 },
      },
    ]);
    const blocksSnapshot = structuredClone(article.blocks);

    orchestrateArticleStyle(article, registry);

    expect(article.blocks).toEqual(blocksSnapshot);
  });

  it("keeps the same heading variant on adjacent headings (R1 disabled for miaopian unity)", () => {
    const article = articleWithBlocks(
      [
        {
          id: fixtureBlockId(1),
          type: "heading",
          content: { text: "H1", level: 2 },
        },
        {
          id: fixtureBlockId(2),
          type: "heading",
          content: { text: "H2", level: 2 },
        },
      ],
      {
        blockOverrides: [
          { blockId: fixtureBlockId(1), variantId: "heading_short_line" },
          { blockId: fixtureBlockId(2), variantId: "heading_short_line" },
        ],
      },
    );

    const result = orchestrateArticleStyle(article, registry);

    expect(
      result.plan.blockOverrides?.find((o) => o.blockId === fixtureBlockId(2))
        ?.variantId,
    ).toBe("heading_short_line");
    expect(
      result.issues.some((issue) => issue.code === "orchestrator_r1_fallback"),
    ).toBe(false);
  });

  it("uses the same heading variant for every heading in the article", () => {
    const article = articleWithBlocks([
      {
        id: fixtureBlockId(1),
        type: "heading",
        content: { text: "第一节", level: 2 },
      },
      {
        id: fixtureBlockId(2),
        type: "heading",
        content: { text: "第二节", level: 2 },
        meta: { sourceIndex: 2 },
      },
      {
        id: fixtureBlockId(3),
        type: "paragraph",
        content: { text: [{ text: "正文" }] },
      },
      {
        id: fixtureBlockId(4),
        type: "heading",
        content: { text: "第三节", level: 2 },
        meta: { sourceIndex: 3 },
      },
    ]);

    const fullRegistry = createFirstWaveRequiredVariantRegistry();
    const result = orchestrateArticleStyle(article, fullRegistry);
    const headingOverrides =
      result.plan.blockOverrides?.filter((override) => {
        const block = article.blocks.find((b) => b.id === override.blockId);
        return block?.type === "heading";
      }) ?? [];

    expect(headingOverrides).toHaveLength(3);
    const uniqueVariants = new Set(headingOverrides.map((o) => o.variantId));
    expect(uniqueVariants.size).toBe(1);
  });

  it("does not apply R8 when publish pool title and heading differ in family", () => {
    const article = articleWithBlocks([
      {
        id: fixtureBlockId(1),
        type: "title",
        content: { text: "标题" },
      },
      {
        id: fixtureBlockId(2),
        type: "heading",
        content: { text: "章节", level: 2 },
      },
    ]);

    const result = orchestrateArticleStyle(article, registry);

    expect(
      result.issues.some((issue) => issue.code === "orchestrator_r8_fallback"),
    ).toBe(false);
  });

  it("emits R2 issues when asset reuse exceeds limit", () => {
    const article = articleWithBlocks([
      {
        id: fixtureBlockId(1),
        type: "heading",
        content: { text: "H1", level: 2 },
      },
      {
        id: fixtureBlockId(2),
        type: "heading",
        content: { text: "H2", level: 2 },
      },
      {
        id: fixtureBlockId(3),
        type: "heading",
        content: { text: "H3", level: 2 },
      },
    ]);

    const result = orchestrateArticleStyle(article, registry, {
      patch: {
        blockOverrides: [
          {
            blockId: fixtureBlockId(1),
            assetBindings: { a: "asset-star" },
          },
          {
            blockId: fixtureBlockId(2),
            assetBindings: { b: "asset-star" },
          },
          {
            blockId: fixtureBlockId(3),
            assetBindings: { c: "asset-star" },
          },
        ],
        meta: {
          source: "ai_style_selection",
          generatedAt: "2026-06-01T00:00:00.000Z",
          validationStatus: "valid",
        },
      },
    });

    expect(
      result.issues.some(
        (issue) => issue.code === "orchestrator_r2_asset_reuse_exceeded",
      ),
    ).toBe(true);
  });

  it("respects block-level assignment priority over preset default", () => {
    const article = articleWithBlocks([
      {
        id: fixtureBlockId(1),
        type: "heading",
        content: { text: "章节", level: 2 },
      },
    ]);

    const result = orchestrateArticleStyle(article, registry, {
      patch: {
        blockOverrides: [
          { blockId: fixtureBlockId(1), variantId: "heading_card_centered" },
        ],
        meta: {
          source: "user",
          validationStatus: "valid",
        },
      },
    });

    expect(result.plan.blockOverrides?.[0]?.variantId).toBe(
      "heading_card_centered",
    );
  });

  it("emits rhythm fallback when three card-emphasis paragraphs stack", () => {
    const article = articleWithBlocks([
      {
        id: fixtureBlockId(1),
        type: "paragraph",
        content: { text: [{ text: "A" }] },
      },
      {
        id: fixtureBlockId(2),
        type: "paragraph",
        content: { text: [{ text: "B" }] },
      },
      {
        id: fixtureBlockId(3),
        type: "paragraph",
        content: { text: [{ text: "C" }] },
      },
    ]);

    const result = orchestrateArticleStyle(article, fullRegistry, {
      patch: {
        meta: { source: "user", validationStatus: "valid" },
        blockOverrides: [
          { blockId: fixtureBlockId(1), variantId: "paragraph_soft_card" },
          { blockId: fixtureBlockId(2), variantId: "paragraph_soft_card" },
          { blockId: fixtureBlockId(3), variantId: "paragraph_soft_card" },
        ],
      },
    });

    expect(result.issues.length).toBeGreaterThan(0);
    expect(result.plan.meta?.validationStatus).toBe("fallback_applied");
  });

  it("produces StyleValidationIssue-compatible rhythm issues", () => {
    const article = articleWithBlocks([
      {
        id: fixtureBlockId(1),
        type: "heading",
        content: { text: "H1", level: 2 },
      },
      {
        id: fixtureBlockId(2),
        type: "heading",
        content: { text: "H2", level: 2 },
      },
    ]);

    const result = orchestrateArticleStyle(article, registry, {
      patch: {
        blockOverrides: [
          { blockId: fixtureBlockId(1), variantId: "heading_short_line" },
          { blockId: fixtureBlockId(2), variantId: "heading_short_line" },
        ],
        meta: { source: "system", validationStatus: "valid" },
      },
    });

    for (const issue of result.issues) {
      expect(issue).toMatchObject({
        severity: expect.stringMatching(/error|warning|info/),
        code: expect.any(String),
        message: expect.any(String),
      });
    }
  });

  it("feeds StyleResolver-compatible styleAssignment after orchestration", () => {
    const article = articleWithBlocks([
      {
        id: fixtureBlockId(1),
        type: "title",
        content: { text: "标题" },
      },
    ]);

    const orchestrated = orchestrateArticleStyle(article, registry);
    const resolved = resolveArticleStyle(
      { ...article, styleAssignment: orchestrated.styleAssignment },
      registry,
    );

    expect(resolved.blocks[0]?.variantId).toBeDefined();
    expect(resolved.blocks[0]?.source).toBeDefined();
  });

  it("can disable rhythm rules via options", () => {
    const article = articleWithBlocks([
      {
        id: fixtureBlockId(1),
        type: "title",
        content: { text: "标题" },
      },
      {
        id: fixtureBlockId(2),
        type: "heading",
        content: { text: "章节", level: 2 },
      },
    ]);

    const result = orchestrateArticleStyle(article, registry, {
      applyRhythmRules: false,
    });

    expect(result.issues.filter((issue) => issue.code.includes("orchestrator_r"))).toHaveLength(
      0,
    );
    expect(
      result.plan.blockOverrides?.find((o) => o.blockId === fixtureBlockId(2))
        ?.variantId,
    ).toBe("heading_short_line");
  });
});
