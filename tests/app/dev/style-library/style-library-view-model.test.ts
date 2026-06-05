import { describe, expect, it } from "vitest";

import { STYLE_LIBRARY_MANIFEST } from "@/core/style-library";

import { buildStyleLibraryAdminViewModel } from "@/app/dev/style-library/style-library-view-model";

describe("buildStyleLibraryAdminViewModel", () => {
  it("computes overview metrics from STYLE_LIBRARY_MANIFEST", () => {
    const viewModel = buildStyleLibraryAdminViewModel();

    expect(viewModel.overview.libraryId).toBe("qingpian-style-library-v0");
    expect(viewModel.overview.schemaVersion).toBe(1);
    expect(viewModel.overview.totalAssets).toBe(2);
    expect(viewModel.overview.variantAssetCount).toBe(2);
    expect(viewModel.overview.seedAssetCount).toBe(2);
    expect(viewModel.overview.registryPatchCount).toBe(1);
    expect(viewModel.overview.activePatchCount).toBe(0);
    expect(viewModel.overview.evidenceRefCount).toBe(4);
    expect(viewModel.overview.lifecycleDistribution.paste_qa_pass).toBe(2);
  });

  it("includes 006D harvest seed assets with distribution flags false", () => {
    const viewModel = buildStyleLibraryAdminViewModel();
    const runtimeIds = viewModel.assets
      .filter((asset) => asset.isSeedAsset)
      .map((asset) => asset.runtimeVariantId)
      .sort();

    expect(runtimeIds).toEqual([
      "heading_purple_chapter_label_candidate",
      "info_card_reading_path_candidate",
    ]);

    for (const asset of viewModel.assets.filter((row) => row.isSeedAsset)) {
      expect(asset.userSelectable).toBe(false);
      expect(asset.defaultEligible).toBe(false);
      expect(asset.release1Required).toBe(false);
      expect(asset.lifecycle).toBe("paste_qa_pass");
      expect(asset.seedBadge).toContain("seed");
    }
  });

  it("shows inactive registry patch with zero active patch count", () => {
    const viewModel = buildStyleLibraryAdminViewModel();

    expect(viewModel.patches).toHaveLength(1);
    expect(viewModel.patches[0]?.active).toBe(false);
    expect(viewModel.patches[0]?.validationIssueCount).toBe(0);
    expect(viewModel.overview.activePatchCount).toBe(0);
  });

  it("exposes manifest validation panel as valid", () => {
    const viewModel = buildStyleLibraryAdminViewModel();

    expect(viewModel.validation.ok).toBe(true);
    expect(viewModel.validation.issueCount).toBe(0);
    expect(viewModel.validation.issues).toHaveLength(0);
  });

  it("includes 006D-related evidence refs", () => {
    const viewModel = buildStyleLibraryAdminViewModel();
    const evidenceIds = viewModel.evidence.map((row) => row.evidenceId);

    expect(evidenceIds).toContain("WX-HARVEST-EVIDENCE-001");
    expect(evidenceIds).toContain("S8M-HARVEST-001");
    expect(evidenceIds).toContain("S8M-HARVEST-002");
    expect(evidenceIds).toContain("PASTE-QA-SESSION-006D");
  });

  it("does not depend on runtime StyleRegistry exports", () => {
    const viewModel = buildStyleLibraryAdminViewModel(STYLE_LIBRARY_MANIFEST);
    expect(viewModel.overview.libraryId).toBe(STYLE_LIBRARY_MANIFEST.libraryId);
    expect(viewModel.assets.every((asset) => asset.assetId.length > 0)).toBe(
      true,
    );
  });

  it("states runtime patches are not applied", () => {
    const viewModel = buildStyleLibraryAdminViewModel();
    expect(viewModel.runtimeNotice).toContain("not applied");
    expect(viewModel.runtimeNotice).toContain("Gallery");
  });
});
