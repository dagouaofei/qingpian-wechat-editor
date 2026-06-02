import { describe, expect, it } from "vitest";

import { IMPLEMENTED_FIRST_WAVE_VARIANT_IDS } from "@/core/styles/variants";
import { DEFAULT_GALLERY_STYLE_CONTROL } from "@/lib/gallery-style-controls";
import { renderGalleryPreview } from "@/lib/render-gallery-preview";

describe("renderGalleryPreview", () => {
  it("renders knowledge sample with variants", () => {
    const result = renderGalleryPreview("sample-knowledge");

    expect(result.sampleId).toBe("sample-knowledge");
    expect(result.previewBlocks.length).toBeGreaterThanOrEqual(8);
    expect(result.previewBlocks.every((block) => block.ok)).toBe(true);
    expect(result.variantIds.length).toBeGreaterThan(0);
  });

  it("renders product sample", () => {
    const result = renderGalleryPreview("sample-product");

    expect(result.previewBlocks.length).toBeGreaterThanOrEqual(8);
    expect(result.previewBlocks.some((block) => block.blockType === "image_placeholder")).toBe(
      true,
    );
  });

  it("reacts to style control changes", () => {
    const decorative = renderGalleryPreview("sample-knowledge", {
      ...DEFAULT_GALLERY_STYLE_CONTROL,
      articleStyle: "classic-news",
      colorPalette: "default",
    });
    const plain = renderGalleryPreview("sample-knowledge", {
      ...DEFAULT_GALLERY_STYLE_CONTROL,
      articleStyle: "classic",
      colorPalette: "default",
    });

    expect(decorative.variantIds).not.toEqual(plain.variantIds);
  });

  it("covers implemented first-wave variant registry count", () => {
    expect(IMPLEMENTED_FIRST_WAVE_VARIANT_IDS.length).toBeGreaterThanOrEqual(33);
  });
});
