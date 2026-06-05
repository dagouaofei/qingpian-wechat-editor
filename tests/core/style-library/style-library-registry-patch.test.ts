import { describe, expect, it } from "vitest";

import {
  SAMPLE_ADD_HEADING_CANDIDATE_TO_POOL_PATCH,
  STYLE_LIBRARY_MANIFEST,
  styleLibraryRegistryPatchSchema,
  validateStyleLibraryManifest,
  validateStyleLibraryRegistryPatch,
} from "@/core/style-library";

describe("style library registry patch", () => {
  it("accepts inactive sample patch through schema", () => {
    expect(() =>
      styleLibraryRegistryPatchSchema.parse(
        SAMPLE_ADD_HEADING_CANDIDATE_TO_POOL_PATCH,
      ),
    ).not.toThrow();
    expect(SAMPLE_ADD_HEADING_CANDIDATE_TO_POOL_PATCH.active).toBe(false);
  });

  it("allows inactive sample patch in manifest validation", () => {
    const result = validateStyleLibraryManifest(STYLE_LIBRARY_MANIFEST);
    expect(result.ok).toBe(true);
  });

  it("forbids active seed patch entering user-selectable pool", () => {
    const patch = {
      ...SAMPLE_ADD_HEADING_CANDIDATE_TO_POOL_PATCH,
      active: true,
    };

    const issues = validateStyleLibraryRegistryPatch(STYLE_LIBRARY_MANIFEST, patch);
    expect(
      issues.some((issue) => issue.code === "seed_asset_patch_forbidden"),
    ).toBe(true);
  });

  it("forbids active seed patch setting default variant", () => {
    const patch = {
      patchId: "active-set-default-seed",
      operation: "set_default_variant" as const,
      variantId: "info_card_reading_path_candidate",
      targetPresetId: "miaopian-classic",
      requiresLifecycle: "default_eligible" as const,
      requiresEvidenceIds: ["PASTE-QA-SESSION-006D"],
      active: true,
    };

    const issues = validateStyleLibraryRegistryPatch(STYLE_LIBRARY_MANIFEST, patch);
    expect(
      issues.some((issue) => issue.code === "seed_asset_patch_forbidden"),
    ).toBe(true);
  });

  it("requires evidence refs for active patches", () => {
    const patch = {
      patchId: "active-missing-evidence",
      operation: "add_to_variant_pool" as const,
      variantId: "some_future_variant",
      requiresEvidenceIds: ["MISSING-EVIDENCE"],
      active: true,
    };

    const issues = validateStyleLibraryRegistryPatch(STYLE_LIBRARY_MANIFEST, patch);
    expect(
      issues.some((issue) => issue.code === "missing_evidence_ref"),
    ).toBe(true);
  });

  it("requires lifecycle for active pool patch on non-seed asset", () => {
    const manifestWithPromotedAsset = {
      ...STYLE_LIBRARY_MANIFEST,
      assets: [
        ...STYLE_LIBRARY_MANIFEST.assets,
        {
          assetId: "variant-future-user-selectable",
          assetType: "variant" as const,
          label: "Future Variant",
          sourceType: "code" as const,
          lifecycle: "paste_qa_pass" as const,
          distribution: {
            userSelectable: true,
            defaultEligible: false,
            release1Required: false,
          },
          updatedAt: "2026-06-05",
          runtimeVariantId: "some_future_variant",
          blockType: "paragraph" as const,
          styleFamily: "classicNews",
        },
      ],
    };

    const patch = {
      patchId: "active-lifecycle-gap",
      operation: "add_to_variant_pool" as const,
      variantId: "some_future_variant",
      requiresLifecycle: "user_selectable" as const,
      requiresEvidenceIds: ["WX-HARVEST-EVIDENCE-001"],
      active: true,
    };

    const issues = validateStyleLibraryRegistryPatch(
      manifestWithPromotedAsset,
      patch,
    );
    expect(
      issues.some((issue) => issue.code === "lifecycle_requirement_not_met"),
    ).toBe(true);
  });
});
