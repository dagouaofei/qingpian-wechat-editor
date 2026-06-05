import { describe, expect, it } from "vitest";

import { createFirstWaveRequiredVariantRegistry, RELEASE1_REQUIRED_VARIANT_IDS } from "@/core/styles";
import { buildMiaopianPresetDefinitions } from "@/config/miaopian-preset-bundles";
import {
  HTML_PASTE_TEAL_SECTION_LABEL_ASSET,
  STYLE_LIBRARY_MANIFEST,
  checkPromoteEligibility,
  createPromoteProposal,
  getStyleLibraryInspectionSummary,
  validateStyleLibraryManifest,
} from "@/core/style-library";
import { HTML_PASTE_CANDIDATE_VARIANT_IDS } from "@/core/copy/html-paste-candidate-copy";
import { HEADING_TEAL_SECTION_LABEL_HTML_PASTE_VARIANT_ID } from "@/core/styles/variants/html-paste-candidate-variants";

import {
  S9_STORY_007B_ASSET_ID,
  S9_STORY_007B_EVIDENCE_ID,
  S9_STORY_007B_HTML_PASTE_E2E_SOURCE_HTML,
  S9_STORY_007B_VARIANT_ID,
} from "../../fixtures/style-library/s9-story-007b-html-paste-e2e-sample";
import { buildStyleLibraryAdminViewModel } from "@/app/dev/style-library/style-library-view-model";

describe("S9-STORY-007B apply candidate promote patch", () => {
  it("registers html paste candidate asset from manifest", () => {
    const asset = STYLE_LIBRARY_MANIFEST.assets.find(
      (row) => row.assetId === S9_STORY_007B_ASSET_ID,
    );
    expect(asset).toBeDefined();
    expect(asset).toEqual(HTML_PASTE_TEAL_SECTION_LABEL_ASSET);
  });

  it("sets lifecycle user_selectable and distribution boundaries", () => {
    const asset = HTML_PASTE_TEAL_SECTION_LABEL_ASSET;
    expect(asset.lifecycle).toBe("user_selectable");
    expect(asset.distribution).toEqual({
      userSelectable: true,
      defaultEligible: false,
      release1Required: false,
    });
    expect(asset.isSeedAsset).toBe(false);
  });

  it("validates manifest with new asset and evidence refs", () => {
    const result = validateStyleLibraryManifest(STYLE_LIBRARY_MANIFEST);
    expect(result.ok).toBe(true);
    expect(
      STYLE_LIBRARY_MANIFEST.evidenceRefs.some(
        (ref) => ref.evidenceId === S9_STORY_007B_EVIDENCE_ID,
      ),
    ).toBe(true);
  });

  it("keeps variant out of release1_required default pool", () => {
    expect(RELEASE1_REQUIRED_VARIANT_IDS).not.toContain(S9_STORY_007B_VARIANT_ID);
    const registry = createFirstWaveRequiredVariantRegistry();
    expect(registry.variants.some((v) => v.id === S9_STORY_007B_VARIANT_ID)).toBe(false);
    expect(HTML_PASTE_CANDIDATE_VARIANT_IDS).toContain(
      HEADING_TEAL_SECTION_LABEL_HTML_PASTE_VARIANT_ID,
    );
  });

  it("does not modify default preset default variants", () => {
    const presets = buildMiaopianPresetDefinitions();
    for (const preset of presets) {
      for (const variantId of Object.values(preset.defaultVariantByBlockType ?? {})) {
        expect(variantId).not.toBe(S9_STORY_007B_VARIANT_ID);
      }
    }
  });

  it("uses a new HTML sample distinct from 006D seeds", () => {
    expect(S9_STORY_007B_HTML_PASTE_E2E_SOURCE_HTML).toContain("#0d9488");
    expect(S9_STORY_007B_HTML_PASTE_E2E_SOURCE_HTML).not.toContain("#6c5ce7");
    expect(S9_STORY_007B_VARIANT_ID).not.toBe("heading_purple_chapter_label_candidate");
    expect(S9_STORY_007B_VARIANT_ID).not.toBe("info_card_reading_path_candidate");
  });

  it("exposes user_selectable asset in admin view model", () => {
    const viewModel = buildStyleLibraryAdminViewModel(undefined, "zh");
    const asset = viewModel.assets.find((row) => row.assetId === S9_STORY_007B_ASSET_ID);
    expect(asset).toBeDefined();
    expect(asset?.lifecycle).toBe("user_selectable");
    expect(asset?.userSelectable).toBe(true);
    expect(asset?.defaultEligible).toBe(false);
    expect(asset?.release1Required).toBe(false);

    const userSelectableGroup = viewModel.lifecycleGroups.find(
      (group) => group.lifecycle === "user_selectable",
    );
    expect(userSelectableGroup?.assets).toHaveLength(1);
    expect(userSelectableGroup?.assets[0]?.runtimeVariantId).toBe(S9_STORY_007B_VARIANT_ID);
  });

  it("blocks further promote because asset is already user_selectable", () => {
    const summary = getStyleLibraryInspectionSummary(
      HTML_PASTE_TEAL_SECTION_LABEL_ASSET,
      STYLE_LIBRARY_MANIFEST,
    );
    const eligibility = checkPromoteEligibility(
      HTML_PASTE_TEAL_SECTION_LABEL_ASSET,
      STYLE_LIBRARY_MANIFEST,
      summary,
    );
    expect(eligibility.status).toBe("blocked");
    const proposal = createPromoteProposal(
      HTML_PASTE_TEAL_SECTION_LABEL_ASSET,
      STYLE_LIBRARY_MANIFEST,
      summary,
    );
    expect(proposal.defaultPresetImpact.entersDefaultPreset).toBe(false);
    expect(proposal.defaultPresetImpact.affectsRelease1RequiredVariants).toBe(false);
    expect(proposal.defaultPresetImpact.summary).toContain("default preset");
  });

  it("records inactive applied registry patch without default preset impact", () => {
    const patch = STYLE_LIBRARY_MANIFEST.registryPatches.find(
      (row) => row.patchId === "applied-add-html-paste-teal-section-to-pool",
    );
    expect(patch?.active).toBe(false);
    expect(patch?.targetPresetId).toBe("style_library_inspection_v0");
    expect(patch?.variantId).toBe(S9_STORY_007B_VARIANT_ID);
  });
});
