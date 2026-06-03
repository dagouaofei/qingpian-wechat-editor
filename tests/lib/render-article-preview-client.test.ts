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
      { articleStyle: "business", colorPalette: "businessBlue" },
    );
    const plain = renderArticlePreviewClient(
      styleSelectionArticleFixture,
      styleSelectionNormalizedInput,
      { articleStyle: "warm", colorPalette: "businessBlue" },
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
      { articleStyle: "business", colorPalette: "businessBlue" },
    );
    const warmPalette = renderArticlePreviewClient(
      styleSelectionMinimalArticleFixture,
      styleSelectionNormalizedInput,
      { articleStyle: "business", colorPalette: "creamOrange" },
    );

    expect(defaultPalette.clipboard.textHtml).not.toBe(warmPalette.clipboard.textHtml);
    expect(defaultPalette.article.styleAssignment.themeId).toBe("businessBlue");
    expect(warmPalette.article.styleAssignment.themeId).toBe("creamOrange");
    expect(warmPalette.clipboard.textHtml).toContain("#292524");
    expect(warmPalette.clipboard.textHtml).toContain("#ea580c");
    expect(warmPalette.clipboard.textHtml).not.toContain("#0f172a");
    expect(warmPalette.clipboard.textHtml).not.toContain("#2563eb");
  });

  it("builds normalized style intent for warm vs business", () => {
    const warmInput = normalizeInputRequest({
      mode: "topic_only",
      topic: "测试",
      styleIntent: { presetHint: "warm", densityHint: "light" },
    });

    const rendered = renderArticlePreviewClient(
      styleSelectionMinimalArticleFixture,
      warmInput,
      { articleStyle: "warm", colorPalette: "creamOrange" },
    );

    expect(rendered.previewBlocks.some((block) => block.ok)).toBe(true);
    expect(rendered.clipboard.textPlain.length).toBeGreaterThan(0);
  });
});
