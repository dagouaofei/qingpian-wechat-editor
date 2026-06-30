import { describe, expect, it } from "vitest";

import { HEADING_TEAL_SECTION_LABEL_HTML_PASTE_VARIANT_ID } from "@/core/styles/variants/html-paste-candidate-variants";
import {
  collectExistingStyleVariants,
  HISTORICAL_FIRST_WAVE_33_RUNTIME_IDS,
} from "@/server/style-admin/import/collect-existing-style-variants";
import { DEPRECATED_HEADING_RUNTIME_VARIANT_IDS } from "@/server/style-admin/import/lifecycle-distribution-mapper";
import { CANONICAL_SOURCE_TYPES } from "@/lib/runtime-variant-seed-config";

describe("collectExistingStyleVariants", () => {
  it("collects registry, harvest, html paste, and deprecated catalog variants", () => {
    const result = collectExistingStyleVariants();
    const ids = new Set(result.variants.map((variant) => variant.runtimeVariantId));

    expect(result.variants.length).toBeGreaterThan(0);
    expect(result.sources.registryRelease1Required).toBe(92);
    expect(result.sources.harvestCandidates).toBe(2);
    expect(result.sources.htmlPasteCandidates).toBe(1);
    expect(result.sources.deprecatedCatalogStubs).toBe(5);

    expect(ids.has("heading_purple_chapter_label_candidate")).toBe(true);
    expect(ids.has("info_card_reading_path_candidate")).toBe(true);
    expect(ids.has(HEADING_TEAL_SECTION_LABEL_HTML_PASTE_VARIANT_ID)).toBe(true);

    for (const deprecatedId of DEPRECATED_HEADING_RUNTIME_VARIANT_IDS) {
      expect(ids.has(deprecatedId)).toBe(true);
    }
  });

  it("identifies historical first-wave 33 runtime ids", () => {
    const result = collectExistingStyleVariants();
    expect(result.historicalFirstWave33Count).toBe(
      HISTORICAL_FIRST_WAVE_33_RUNTIME_IDS.length,
    );
    expect(HISTORICAL_FIRST_WAVE_33_RUNTIME_IDS).toHaveLength(33);
  });

  it("keeps userSelectable independent from defaultEligible during code import", () => {
    const result = collectExistingStyleVariants();
    const userSelectable = result.variants.filter(
      (variant) => variant.distribution.userSelectable,
    );

    expect(userSelectable).toHaveLength(0);
    for (const variant of result.variants) {
      if (variant.distribution.userSelectable) {
        expect(variant.distribution.defaultEligible).toBe(false);
      }
    }
  });

  it("does not mark harvest or paste_qa_pass candidates as userSelectable by default", () => {
    const result = collectExistingStyleVariants();
    const harvest = result.variants.find(
      (variant) => variant.runtimeVariantId === "heading_purple_chapter_label_candidate",
    );
    const readingPath = result.variants.find(
      (variant) => variant.runtimeVariantId === "info_card_reading_path_candidate",
    );

    expect(harvest?.distribution.userSelectable).toBe(false);
    expect(readingPath?.distribution.userSelectable).toBe(false);
    expect(harvest?.lifecycle).toBe("paste_qa_pass");
  });

  it("marks deprecated catalog stubs as hidden and deprecated", () => {
    const result = collectExistingStyleVariants();
    const deprecated = result.variants.filter((variant) => variant.isDeprecatedCatalogStub);

    expect(deprecated).toHaveLength(5);
    for (const variant of deprecated) {
      expect(variant.lifecycle).toBe("deprecated");
      expect(variant.distribution.deprecated).toBe(true);
      expect(variant.distribution.hidden).toBe(true);
      expect(variant.distribution.userSelectable).toBe(false);
    }
  });

  it("uses canonical sourceType values only", () => {
    const result = collectExistingStyleVariants();
    for (const variant of result.variants) {
      expect(CANONICAL_SOURCE_TYPES as readonly string[]).toContain(variant.sourceType);
    }
    expect(result.variants.some((variant) => variant.sourceType === "style_library_manifest")).toBe(
      false,
    );
  });

  it("marks release1_required registry variants with seed-based userSelectable only", () => {
    const result = collectExistingStyleVariants();
    const release1 = result.variants.filter(
      (variant) => variant.registryStatus === "release1_required",
    );

    expect(release1.length).toBe(92);
    const userSelectableRelease1 = release1.filter(
      (variant) => variant.distribution.userSelectable,
    );
    expect(userSelectableRelease1).toHaveLength(0);
    for (const variant of release1) {
      expect(variant.lifecycle).toBe("release1_required");
      expect(variant.distribution.release1Required).toBe(true);
      expect(variant.distribution.defaultEligible).toBe(false);
      expect(variant.sourceType).toBe("registry");
      expect(variant.sourceCohort).toBe("release1_required");
    }
  });
});
