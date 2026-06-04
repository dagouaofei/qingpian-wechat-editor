import { describe, expect, it } from "vitest";

import { parseArticle } from "@/core/article";
import { orchestrateArticleStyle, createFirstWaveRequiredVariantRegistry } from "@/core/styles";

import { minimalArticleFixture } from "../../fixtures/articles/minimal-article";
import { fixtureBlockId } from "../../fixtures/articles/shared";

describe("unifyHeadingVariantsInStates", () => {
  const registry = createFirstWaveRequiredVariantRegistry();

  it("keeps explicit heading override for all headings", () => {
    const article = parseArticle({
      ...minimalArticleFixture,
      styleAssignment: {
        themeId: "businessBlue",
        presetId: "business",
        blockOverrides: [
          { blockId: fixtureBlockId(2), variantId: "heading_highlight_marker" },
        ],
      },
      blocks: [
        { id: fixtureBlockId(1), type: "title", content: { text: "标题" } },
        { id: fixtureBlockId(2), type: "heading", content: { text: "A", level: 2 } },
        { id: fixtureBlockId(3), type: "heading", content: { text: "B", level: 2 } },
      ],
    });

    const result = orchestrateArticleStyle(article, registry);
    const ids =
      result.plan.blockOverrides
        ?.filter((o) => article.blocks.find((b) => b.id === o.blockId)?.type === "heading")
        .map((o) => o.variantId) ?? [];

    expect(ids).toEqual([
      "heading_highlight_marker",
      "heading_highlight_marker",
    ]);
  });
});
