import { describe, expect, it } from "vitest";

import { parseArticle } from "@/core/article";
import {
  ARTICLE_VARIANT_ROTATION,
  resolveArticleAwareVariantId,
} from "@/core/generation/style-selection-diversity";

describe("style-selection-diversity", () => {
  it("rotates paragraph variants for medium density", () => {
    const first = resolveArticleAwareVariantId("paragraph", 0, { densityHint: "medium" });
    const second = resolveArticleAwareVariantId("paragraph", 1, { densityHint: "medium" });
    const third = resolveArticleAwareVariantId("paragraph", 2, { densityHint: "medium" });

    expect(first).toBe("paragraph_accent_left");
    expect(second).toBe("paragraph_soft_card");
    expect(third).toBe("paragraph_plain_body");
  });

  it("uses plain variants for light density", () => {
    expect(resolveArticleAwareVariantId("paragraph", 0, { densityHint: "light" })).toBe(
      "paragraph_plain_body",
    );
    expect(resolveArticleAwareVariantId("highlight", 1, { densityHint: "light" })).toBe(
      "highlight_inline_emphasis",
    );
  });

  it("uses decorative title and lead for first block", () => {
    expect(resolveArticleAwareVariantId("title", 0)).toBe("title_bottom_line_editorial");
    expect(resolveArticleAwareVariantId("lead", 0)).toBe("lead_accent_band");
  });

  it("defines rotation lists for all Release 1 structured block types", () => {
    for (const blockType of [
      "title",
      "heading",
      "lead",
      "paragraph",
      "divider",
      "list",
      "quote",
      "highlight",
      "info_card",
      "cta",
      "image_placeholder",
    ] as const) {
      expect(ARTICLE_VARIANT_ROTATION[blockType]?.length).toBeGreaterThan(1);
    }
  });
});

describe("style-selection-diversity integration", () => {
  it("builds distinct paragraph variants in deterministic selection", async () => {
    const { generateDeterministicStyleSelection } = await import("@/core/generation");
    const { parseAndNormalizeInputRequest } = await import("@/core/generation");
    const { createFirstWaveRequiredVariantRegistry } = await import("@/core/styles");
    const { articleFixtureBase, fixtureBlockId } = await import(
      "../../fixtures/articles/shared"
    );
    const { topicOnlyInputRequestFixture } = await import(
      "../../fixtures/generation/input-requests"
    );

    const article = parseArticle({
      ...articleFixtureBase(),
      blocks: [
        {
          id: fixtureBlockId(1),
          type: "paragraph" as const,
          content: { text: [{ text: "段落一" }] },
        },
        {
          id: fixtureBlockId(2),
          type: "paragraph" as const,
          content: { text: [{ text: "段落二" }] },
        },
        {
          id: fixtureBlockId(3),
          type: "paragraph" as const,
          content: { text: [{ text: "段落三" }] },
        },
      ],
    });

    const result = generateDeterministicStyleSelection({
      article,
      normalizedInput: parseAndNormalizeInputRequest(topicOnlyInputRequestFixture),
      registry: createFirstWaveRequiredVariantRegistry(),
      timestamp: "2026-06-02T12:00:00.000Z",
    });

    const variantIds =
      result.patch.blockOverrides?.map((override) => override.variantId) ?? [];
    expect(new Set(variantIds).size).toBeGreaterThan(1);
    expect(variantIds).toContain("paragraph_accent_left");
    expect(variantIds).toContain("paragraph_soft_card");
  });
});
