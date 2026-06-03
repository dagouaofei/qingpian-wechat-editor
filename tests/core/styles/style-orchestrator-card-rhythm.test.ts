import { describe, expect, it } from "vitest";

import { parseArticle } from "@/core/article";
import {
  applyOrchestratorRuleCardStack,
  applyOrchestratorRuleR4,
  createFirstWaveRequiredVariantRegistry,
  orchestrateArticleStyle,
  parseStyleRegistry,
} from "@/core/styles";

import { fixtureBlockId } from "../../fixtures/articles/shared";
import { minimalArticleFixture } from "../../fixtures/articles/minimal-article";

describe("orchestrator card rhythm rules", () => {
  const registry = parseStyleRegistry(createFirstWaveRequiredVariantRegistry());

  function articleWithBlocks(
    blocks: unknown[],
    blockOverrides: Array<{ blockId: string; variantId: string }>,
  ) {
    return parseArticle({
      ...minimalArticleFixture,
      styleAssignment: {
        themeId: "businessBlue",
        presetId: "business",
        blockOverrides,
      },
      blocks,
    });
  }

  it("RCARD demotes third consecutive card-emphasis paragraph", () => {
    const blocks = [
      {
        id: fixtureBlockId(1),
        type: "paragraph" as const,
        content: { text: "A" },
      },
      {
        id: fixtureBlockId(2),
        type: "paragraph" as const,
        content: { text: "B" },
      },
      {
        id: fixtureBlockId(3),
        type: "paragraph" as const,
        content: { text: "C" },
      },
    ];
    const article = articleWithBlocks(
      blocks,
      blocks.map((block) => ({
        blockId: block.id,
        variantId: "paragraph_soft_card",
      })),
    );

    const result = orchestrateArticleStyle(article, registry, {
      applyRhythmRules: true,
    });
    const overrides = result.styleAssignment.blockOverrides ?? [];
    const third = overrides.find((entry) => entry.blockId === fixtureBlockId(3));

    expect(third?.variantId).toBe("paragraph_plain_body");
    expect(
      result.issues.some((issue) => issue.code === "orchestrator_rcard_fallback"),
    ).toBe(true);
  });

  it("R4 demotes third consecutive title/heading decor family", () => {
    const blocks = [
      {
        id: fixtureBlockId(1),
        type: "title" as const,
        content: { text: "Title" },
      },
      {
        id: fixtureBlockId(2),
        type: "heading" as const,
        content: { text: "H1", level: 2 as const },
      },
      {
        id: fixtureBlockId(3),
        type: "heading" as const,
        content: { text: "H2", level: 2 as const },
      },
    ];
    const states = new Map(
      blocks.map((block) => {
        const variantId = "heading_plain_minimal";
        const resolvedVariantId =
          block.type === "title" ? "title_plain_minimal" : variantId;
        const variant = registry.variants.find((entry) => entry.id === resolvedVariantId)!;
        return [
          block.id,
          {
            blockId: block.id,
            blockType: block.type,
            variantId: variant.id,
            familyId: variant.family,
            layoutMode: variant.componentProtocol?.layoutMode,
            source: "explicit" as const,
          },
        ];
      }),
    );
    const issues: Parameters<typeof applyOrchestratorRuleR4>[3] = [];

    applyOrchestratorRuleR4(blocks, states, registry, issues);

    const thirdState = states.get(fixtureBlockId(3));
    expect(thirdState?.variantId).toBe("heading_numbered_section");
    expect(issues.some((issue) => issue.code === "orchestrator_r4_fallback")).toBe(
      true,
    );
  });

  it("applyOrchestratorRuleCardStack resets run after plain break", () => {
    const blocks = [
      {
        id: fixtureBlockId(1),
        type: "paragraph" as const,
        content: { text: "A" },
      },
      {
        id: fixtureBlockId(2),
        type: "paragraph" as const,
        content: { text: "B" },
      },
      {
        id: fixtureBlockId(3),
        type: "paragraph" as const,
        content: { text: "plain" },
      },
      {
        id: fixtureBlockId(4),
        type: "paragraph" as const,
        content: { text: "C" },
      },
    ];
    const states = new Map(
      blocks.map((block, index) => [
        block.id,
        {
          blockId: block.id,
          blockType: "paragraph" as const,
          variantId:
            index === 2 ? "paragraph_plain_body" : "paragraph_soft_card",
          familyId: index === 2 ? "plain" : "soft_card",
          source: "explicit" as const,
        },
      ]),
    );
    const issues: Parameters<typeof applyOrchestratorRuleCardStack>[3] = [];

    applyOrchestratorRuleCardStack(blocks, states, registry, issues);

    expect(states.get(fixtureBlockId(4))?.variantId).toBe("paragraph_soft_card");
    expect(issues).toHaveLength(0);
  });
});
