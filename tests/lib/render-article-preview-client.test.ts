import { describe, expect, it } from "vitest";

import { normalizeInputRequest } from "@/core/generation/input.normalize";
import { renderArticlePreviewClient } from "@/lib/render-article-preview-client";
import {
  styleSelectionArticleFixture,
  styleSelectionMinimalArticleFixture,
  styleSelectionNormalizedInput,
} from "../fixtures/generation/style-selection";

describe("renderArticlePreviewClient", () => {
  it("re-renders preview with different article styles", () => {
    const decorative = renderArticlePreviewClient(
      styleSelectionArticleFixture,
      styleSelectionNormalizedInput,
      { articleStyle: "classic-news", colorPalette: "default" },
    );
    const plain = renderArticlePreviewClient(
      styleSelectionArticleFixture,
      styleSelectionNormalizedInput,
      { articleStyle: "classic", colorPalette: "default" },
    );

    const decorativeVariants = decorative.previewBlocks.map((block) => block.variantId);
    const plainVariants = plain.previewBlocks.map((block) => block.variantId);

    expect(decorative.previewBlocks.length).toBeGreaterThan(0);
    expect(plain.previewBlocks.length).toBeGreaterThan(0);
    expect(decorativeVariants).not.toEqual(plainVariants);
  });

  it("updates copy payload when color palette changes", () => {
    const defaultPalette = renderArticlePreviewClient(
      styleSelectionMinimalArticleFixture,
      styleSelectionNormalizedInput,
      { articleStyle: "classic-news", colorPalette: "default" },
    );
    const warmPalette = renderArticlePreviewClient(
      styleSelectionMinimalArticleFixture,
      styleSelectionNormalizedInput,
      { articleStyle: "classic-news", colorPalette: "warm" },
    );

    expect(defaultPalette.clipboard.textHtml).not.toBe(warmPalette.clipboard.textHtml);
    expect(defaultPalette.article.styleAssignment.themeId).toBe("default");
    expect(warmPalette.article.styleAssignment.themeId).toBe("warm-editorial");
    expect(warmPalette.clipboard.textHtml).toContain("#3d2c1e");
    expect(warmPalette.clipboard.textHtml).toContain("#dcc8b8");
    expect(warmPalette.clipboard.textHtml).not.toContain("#333333");
    expect(warmPalette.clipboard.textHtml).not.toContain("#576b95");
  });

  it("builds normalized style intent for classic vs classic-news", () => {
    const classicInput = normalizeInputRequest({
      mode: "topic_only",
      topic: "测试",
      styleIntent: { presetHint: "classic", densityHint: "light" },
    });

    const rendered = renderArticlePreviewClient(
      styleSelectionMinimalArticleFixture,
      classicInput,
      { articleStyle: "classic", colorPalette: "default" },
    );

    expect(rendered.previewBlocks.some((block) => block.ok)).toBe(true);
    expect(rendered.clipboard.textPlain.length).toBeGreaterThan(0);
  });
});
