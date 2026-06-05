import { describe, expect, it } from "vitest";

import { createFirstWaveRequiredVariantRegistry } from "@/core/styles";
import {
  CHAPTER_LABEL_STYLE,
  HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET,
  INFO_CARD_READING_PATH_SEED_ASSET,
  STYLE_LIBRARY_MANIFEST,
  STYLE_LIBRARY_SEED_RUNTIME_VARIANT_IDS,
  buildStylePaletteRuleSummaryCounts,
  buildVariantStyleAssociation,
  getPalettesForVariantAssetId,
  getRulesForVariantAssetId,
  getStyleForVariantAssetId,
  getStyleLibraryPaletteAssets,
  getStyleLibraryRuleAssets,
  getStyleLibraryStyleDefinitions,
  validateStyleLibraryManifest,
} from "@/core/style-library";

describe("style palette rule management", () => {
  it("reads style definitions", () => {
    const styles = getStyleLibraryStyleDefinitions();
    expect(styles.length).toBeGreaterThanOrEqual(4);
    expect(styles.some((style) => style.styleId === "style-chapter-label")).toBe(true);
  });

  it("reads palette and rule assets from manifest", () => {
    expect(getStyleLibraryPaletteAssets()).toHaveLength(3);
    expect(getStyleLibraryRuleAssets()).toHaveLength(4);
    expect(validateStyleLibraryManifest(STYLE_LIBRARY_MANIFEST).ok).toBe(true);
  });

  it("links 006D seed assets to style palette and rules", () => {
    const headingStyle = getStyleForVariantAssetId(
      HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET.assetId,
    );
    expect(headingStyle?.styleId).toBe("style-chapter-label");
    expect(getPalettesForVariantAssetId(HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET.assetId)).toHaveLength(1);
    expect(getRulesForVariantAssetId(HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET.assetId).length).toBeGreaterThan(0);

    const infoStyle = getStyleForVariantAssetId(INFO_CARD_READING_PATH_SEED_ASSET.assetId);
    expect(infoStyle?.styleId).toBe("style-reading-path");
  });

  it("computes summary metrics", () => {
    const counts = buildStylePaletteRuleSummaryCounts(STYLE_LIBRARY_MANIFEST);
    expect(counts.styleCount).toBe(5);
    expect(counts.paletteCount).toBe(3);
    expect(counts.ruleCount).toBe(4);
    expect(counts.copySafeRuleCount).toBe(2);
    expect(counts.selectionRuleCount).toBe(2);
    expect(counts.stylesReadyForExpansion).toBe(3);
    expect(counts.stylesMissingPalette).toBe(1);
    expect(counts.rulesWithWarnings).toBe(1);
  });

  it("builds variant associations without mutating distribution flags", () => {
    const before = {
      userSelectable: HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET.distribution.userSelectable,
      defaultEligible: HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET.distribution.defaultEligible,
      release1Required: HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET.distribution.release1Required,
    };
    const association = buildVariantStyleAssociation(HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET);
    expect(association.hasStyleLink).toBe(true);
    expect(association.hasPaletteLink).toBe(true);
    expect(association.hasRuleLink).toBe(true);
    expect(HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET.distribution).toEqual(before);
  });

  it("does not add harvest candidates to runtime registry", () => {
    const runtimeIds = createFirstWaveRequiredVariantRegistry().variants.map((v) => v.id);
    for (const id of STYLE_LIBRARY_SEED_RUNTIME_VARIANT_IDS) {
      expect(runtimeIds).not.toContain(id);
    }
  });

  it("marks planning styles missing palette links", () => {
    expect(CHAPTER_LABEL_STYLE.linkedPaletteIds.length).toBeGreaterThan(0);
    const business = getStyleLibraryStyleDefinitions().find(
      (style) => style.styleId === "style-business-professional",
    );
    expect(business?.linkedPaletteIds).toHaveLength(0);
  });
});
