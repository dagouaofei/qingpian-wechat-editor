import { describe, expect, it } from "vitest";

import { parseArticle } from "@/core/article";
import { articleSampleRawForId } from "@/fixtures/article-samples";
import {
  GALLERY_SAMPLE_TITLE_HEADING_ASSIGNMENTS,
  galleryTitleHeadingOverridesForArticle,
} from "@/lib/gallery-title-heading";
import { DEFAULT_GALLERY_STYLE_CONTROL } from "@/lib/gallery-style-controls";
import { renderGalleryPreview } from "@/lib/render-gallery-preview";

describe("galleryTitleHeadingOverridesForArticle", () => {
  it("assigns distinct title/heading variants per sample defaults", () => {
    for (const [sampleId, assignment] of Object.entries(
      GALLERY_SAMPLE_TITLE_HEADING_ASSIGNMENTS,
    )) {
      expect(
        assignment.titleVariantId === "title_plain_minimal" &&
          assignment.headingVariantId === "heading_plain_minimal",
      ).toBe(false);
      const article = parseArticle(articleSampleRawForId(sampleId as keyof typeof GALLERY_SAMPLE_TITLE_HEADING_ASSIGNMENTS));
      const overrides = galleryTitleHeadingOverridesForArticle(article, sampleId as keyof typeof GALLERY_SAMPLE_TITLE_HEADING_ASSIGNMENTS);
      const titleOverride = overrides.find((entry) =>
        article.blocks.find((block) => block.id === entry.blockId)?.type === "title",
      );
      expect(titleOverride?.variantId).toBe(assignment.titleVariantId);
    }
  });

  it("respects explicit title/heading override ids", () => {
    const article = parseArticle(articleSampleRawForId("sample-knowledge"));
    const overrides = galleryTitleHeadingOverridesForArticle(
      article,
      "sample-knowledge",
      "title_plain_minimal",
      "heading_top_badge_topic",
    );
    const titleOverride = overrides.find((entry) =>
      article.blocks.find((block) => block.id === entry.blockId)?.type === "title",
    );
    expect(titleOverride?.variantId).toBe("title_plain_minimal");
    expect(
      overrides.some((entry) => entry.variantId === "heading_top_badge_topic"),
    ).toBe(true);
  });
});

describe("renderGalleryPreview title/heading", () => {
  it("returns clipboard payload for copy preview panel", () => {
    const result = renderGalleryPreview("sample-knowledge", DEFAULT_GALLERY_STYLE_CONTROL);
    expect(result.clipboard.textHtml.length).toBeGreaterThan(0);
    expect(result.clipboard.textPlain.length).toBeGreaterThan(0);
  });

  it("applies per-sample title/heading assignment to variant ids", () => {
    const result = renderGalleryPreview("sample-knowledge", DEFAULT_GALLERY_STYLE_CONTROL);
    const titleBlock = result.previewBlocks.find((block) => block.blockType === "title");
    const headingBlock = result.previewBlocks.find((block) => block.blockType === "heading");
    expect(titleBlock?.variantId).toBe("title_bottom_line_editorial");
    expect(headingBlock?.variantId).toBe("heading_numbered_section");
  });

  it("filters to title/heading blocks in focus mode", () => {
    const result = renderGalleryPreview("sample-product", {
      ...DEFAULT_GALLERY_STYLE_CONTROL,
      focusTitleHeading: true,
    });
    expect(result.displayBlocks.every(
      (block) => block.blockType === "title" || block.blockType === "heading",
    )).toBe(true);
    expect(result.displayBlocks.length).toBeLessThan(result.previewBlocks.length);
  });

  it("switches title variant when override select is set", () => {
    const baseline = renderGalleryPreview("sample-knowledge", DEFAULT_GALLERY_STYLE_CONTROL);
    const overridden = renderGalleryPreview("sample-knowledge", {
      ...DEFAULT_GALLERY_STYLE_CONTROL,
      titleVariantId: "title_left_bar_classic",
    });
    const baselineTitle = baseline.previewBlocks.find((block) => block.blockType === "title");
    const overriddenTitle = overridden.previewBlocks.find((block) => block.blockType === "title");
    expect(baselineTitle?.variantId).toBe("title_bottom_line_editorial");
    expect(overriddenTitle?.variantId).toBe("title_left_bar_classic");
  });
});
