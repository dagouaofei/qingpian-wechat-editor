import { describe, expect, it } from "vitest";

import { parseArticle } from "@/core/article";
import {
  createFirstWaveRequiredVariantRegistry,
  orchestrateArticleStyle,
  parseStyleRegistry,
} from "@/core/styles";

import { loadR1GoldenArticle } from "../../fixtures/articles/r1-golden";
import { fixtureBlockId } from "../../fixtures/articles/shared";
import { minimalArticleFixture } from "../../fixtures/articles/minimal-article";

describe("orchestrator article layout rules", () => {
  const registry = parseStyleRegistry(createFirstWaveRequiredVariantRegistry());

  it("demotes adjacent strong visual blocks on structured golden article", () => {
    const article = loadR1GoldenArticle("r1-golden-structured-article");
    const result = orchestrateArticleStyle(article, registry);
    const variantIds =
      result.styleAssignment.blockOverrides?.map((entry) => entry.variantId) ?? [];

    const quoteCount = variantIds.filter((id) => id === "quote_plain").length;
    const highlightPlain = variantIds.filter(
      (id) => id === "highlight_inline_emphasis",
    ).length;

    expect(quoteCount + highlightPlain).toBeGreaterThan(0);
    expect(
      result.issues.some((issue) => issue.code === "orchestrator_rlayout_fallback"),
    ).toBe(true);
  });

  it("demotes non-tail heavy CTA", () => {
    const article = parseArticle({
      ...minimalArticleFixture,
      blocks: [
        {
          id: fixtureBlockId(1),
          type: "cta",
          content: { text: "Mid CTA", action: "a" },
        },
        {
          id: fixtureBlockId(2),
          type: "paragraph",
          content: { text: [{ text: "body" }] },
        },
        {
          id: fixtureBlockId(3),
          type: "cta",
          content: { text: "Tail CTA", action: "b" },
        },
      ],
      styleAssignment: {
        themeId: "businessBlue",
        presetId: "business",
        blockOverrides: [
          { blockId: fixtureBlockId(1), variantId: "cta_button_like" },
          { blockId: fixtureBlockId(3), variantId: "cta_button_like" },
        ],
      },
    });

    const result = orchestrateArticleStyle(article, registry);
    const first = result.styleAssignment.blockOverrides?.find(
      (entry) => entry.blockId === fixtureBlockId(1),
    );
    expect(first?.variantId).toBe("cta_plain_text");
  });
});
