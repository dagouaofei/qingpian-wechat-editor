import { describe, expect, it } from "vitest";

import { parseArticle } from "@/core/article";
import { balanceCardEmphasisInBlockHints } from "@/core/generation/style-selection-card-rhythm";
import { createFirstWaveRequiredVariantRegistry, parseStyleRegistry } from "@/core/styles";

import { fixtureBlockId } from "../../fixtures/articles/shared";
import { minimalArticleFixture } from "../../fixtures/articles/minimal-article";

describe("balanceCardEmphasisInBlockHints", () => {
  const registry = parseStyleRegistry(createFirstWaveRequiredVariantRegistry());

  it("demotes third consecutive card hint to plain variant", () => {
    const article = parseArticle({
      ...minimalArticleFixture,
      blocks: [
        {
          id: fixtureBlockId(1),
          type: "paragraph",
          content: { text: "A" },
        },
        {
          id: fixtureBlockId(2),
          type: "paragraph",
          content: { text: "B" },
        },
        {
          id: fixtureBlockId(3),
          type: "paragraph",
          content: { text: "C" },
        },
      ],
    });

    const hints = article.blocks.map((block) => ({
      blockId: block.id,
      blockType: block.type,
      suggestedVariantId: "paragraph_soft_card",
    }));

    const balanced = balanceCardEmphasisInBlockHints(article, hints, registry);

    expect(balanced[2]?.suggestedVariantId).toBe("paragraph_plain_body");
  });
});
