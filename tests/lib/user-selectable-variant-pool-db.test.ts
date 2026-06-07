import { describe, expect, it } from "vitest";

import { headingTealSectionLabelHtmlPasteCandidate } from "@/core/styles/variants/html-paste-candidate-variants";
import { renderArticlePreviewClient } from "@/lib/render-article-preview-client";
import type { UserSelectableVariantPoolSnapshot } from "@/lib/user-selectable-variant-pool-types";
import { createUserPreviewStyleRegistry } from "@/lib/user-preview-style-registry";
import {
  styleSelectionArticleFixture,
  styleSelectionNormalizedInput,
} from "../fixtures/generation/style-selection";

const databasePool: UserSelectableVariantPoolSnapshot = {
  source: "database",
  cache: { hit: false, ttlSeconds: 120, generatedAt: "2026-06-07T00:00:00.000Z" },
  variants: [headingTealSectionLabelHtmlPasteCandidate],
  poolVariantIds: [headingTealSectionLabelHtmlPasteCandidate.id],
  issues: [],
};

describe("user-selectable variant pool DB integration", () => {
  it("extends preview registry from database pool without code fallback duplicates", () => {
    const registry = createUserPreviewStyleRegistry({
      dbUserSelectableVariants: databasePool.variants,
      preferDatabaseVariants: true,
    });

    expect(registry.variants.map((variant) => variant.id)).toContain(
      "heading_teal_section_label_html_paste_candidate",
    );
  });

  it("renders preview and copy using DB pool variant selection", () => {
    const rendered = renderArticlePreviewClient(
      styleSelectionArticleFixture,
      styleSelectionNormalizedInput,
      {
        articleStyle: "business",
        colorPalette: "businessBlue",
        headingVariantId: "heading_teal_section_label_html_paste_candidate",
      },
      { userSelectablePool: databasePool },
    );

    expect(rendered.previewBlocks.length).toBeGreaterThan(0);
    expect(rendered.clipboard.textHtml.length).toBeGreaterThan(0);
    const headingBlock = rendered.previewBlocks.find((block) => block.blockType === "heading");
    expect(headingBlock?.variantId).toBe("heading_teal_section_label_html_paste_candidate");
  });
});
