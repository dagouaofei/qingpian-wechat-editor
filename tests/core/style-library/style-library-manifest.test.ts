import { describe, expect, it } from "vitest";

import {
  HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET,
  INFO_CARD_READING_PATH_SEED_ASSET,
  STYLE_LIBRARY_MANIFEST,
  getStyleLibraryAssetById,
  getStyleLibrarySeedAssets,
  getStyleLibraryVariantAssets,
  validateStyleLibraryManifest,
} from "@/core/style-library";

describe("style library manifest", () => {
  it("validates the shipped manifest", () => {
    const result = validateStyleLibraryManifest(STYLE_LIBRARY_MANIFEST);
    expect(result.ok).toBe(true);
  });

  it("registers 006D harvest candidates as seed assets", () => {
    const seeds = getStyleLibrarySeedAssets(STYLE_LIBRARY_MANIFEST);
    expect(seeds).toHaveLength(2);

    const runtimeIds = seeds.map((asset) => asset.runtimeVariantId).sort();
    expect(runtimeIds).toEqual([
      "heading_purple_chapter_label_candidate",
      "info_card_reading_path_candidate",
    ]);
  });

  it("forbids seed assets from user_selectable and default_eligible flags", () => {
    for (const asset of getStyleLibrarySeedAssets(STYLE_LIBRARY_MANIFEST)) {
      expect(asset.distribution.userSelectable).toBe(false);
      expect(asset.distribution.defaultEligible).toBe(false);
      expect(asset.distribution.release1Required).toBe(false);
      expect(asset.isSeedAsset).toBe(true);
    }
  });

  it("rejects seed assets marked user_selectable", () => {
    const invalid = {
      ...STYLE_LIBRARY_MANIFEST,
      assets: [
        {
          ...HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET,
          distribution: {
            ...HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET.distribution,
            userSelectable: true,
          },
        },
        INFO_CARD_READING_PATH_SEED_ASSET,
      ],
    };

    const result = validateStyleLibraryManifest(invalid);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(
        result.issues.some(
          (issue) => issue.code === "seed_asset_user_selectable_forbidden",
        ),
      ).toBe(true);
    }
  });

  it("returns stable helper query results", () => {
    const variantAssets = getStyleLibraryVariantAssets(STYLE_LIBRARY_MANIFEST);
    expect(variantAssets).toHaveLength(2);

    const heading = getStyleLibraryAssetById(
      STYLE_LIBRARY_MANIFEST,
      "seed-variant-heading-purple-chapter-label",
    );
    expect(heading?.assetType).toBe("variant");
    if (heading?.assetType === "variant") {
      expect(heading.runtimeVariantId).toBe(
        "heading_purple_chapter_label_candidate",
      );
      expect(heading.styleFamily).toBe("harvestCandidate");
    }
  });
});
