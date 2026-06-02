import { describe, expect, it } from "vitest";

import { IMPLEMENTED_FIRST_WAVE_VARIANT_IDS } from "@/core/styles/variants";
import { renderGalleryPreview } from "@/lib/render-gallery-preview";

describe("renderGalleryPreview", () => {
  it("renders all first-wave block types for full-blocks fixture", () => {
    const result = renderGalleryPreview("full-blocks");

    expect(result.sampleId).toBe("full-blocks");
    expect(result.previewBlocks).toHaveLength(11);
    expect(result.previewBlocks.every((block) => block.ok)).toBe(true);
    expect(result.variantIds.length).toBeGreaterThan(0);
    expect(new Set(result.variantIds).size).toBe(result.variantIds.length);
  });

  it("renders minimal title fixture", () => {
    const result = renderGalleryPreview("minimal-title");

    expect(result.previewBlocks).toHaveLength(1);
    expect(result.previewBlocks[0]?.blockType).toBe("title");
    expect(result.previewBlocks[0]?.ok).toBe(true);
  });

  it("reacts to style control changes", () => {
    const decorative = renderGalleryPreview("full-blocks", {
      articleStyle: "classic-news",
      colorPalette: "default",
    });
    const plain = renderGalleryPreview("full-blocks", {
      articleStyle: "classic",
      colorPalette: "default",
    });

    expect(decorative.variantIds).not.toEqual(plain.variantIds);
  });

  it("covers implemented first-wave variant registry count", () => {
    expect(IMPLEMENTED_FIRST_WAVE_VARIANT_IDS.length).toBeGreaterThanOrEqual(33);
  });
});
