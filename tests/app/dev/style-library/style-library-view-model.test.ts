import { describe, expect, it } from "vitest";

import { STYLE_LIBRARY_MANIFEST } from "@/core/style-library";

import { getCandidateDisabledActions } from "@/app/dev/style-library/style-library-i18n";
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

  it("defaults locale to zh", () => {
    const viewModel = buildStyleLibraryAdminViewModel();

    expect(viewModel.locale).toBe("zh");
    expect(viewModel.workbench.title).toBe("样式管理工作台");
    expect(viewModel.workbench.runtimeStatus).toBe("未接入运行时");
    expect(viewModel.workbench.mode).toBe("只读治理模式");
  });

  it("builds English workbench copy when locale is en", () => {
    const viewModel = buildStyleLibraryAdminViewModel(undefined, "en");

    expect(viewModel.locale).toBe("en");
    expect(viewModel.workbench.title).toBe("Style Library Workbench");
    expect(viewModel.workbench.runtimeStatus).toBe("Not connected to runtime");
    expect(viewModel.workbench.mode).toBe("Read-only governance shell");
  });

  it("builds status summary cards from manifest metrics", () => {
    const viewModel = buildStyleLibraryAdminViewModel();

    expect(viewModel.statusSummary.totalAssets).toBe(2);
    expect(viewModel.statusSummary.seedCandidates).toBe(2);
    expect(viewModel.statusSummary.pasteQaPassed).toBe(2);
    expect(viewModel.statusSummary.userSelectable).toBe(0);
    expect(viewModel.statusSummary.defaultEligible).toBe(0);
    expect(viewModel.statusSummary.activePatches).toBe(0);
    expect(viewModel.statusSummary.validationIssues).toBe(0);
  });

  it("generates lifecycle groups with Chinese labels and 006D seeds in paste_qa_pass", () => {
    const viewModel = buildStyleLibraryAdminViewModel(undefined, "zh");

    expect(viewModel.lifecycleGroups).toHaveLength(7);
    const pasteQaGroup = viewModel.lifecycleGroups.find(
      (group) => group.lifecycle === "paste_qa_pass",
    );
    expect(pasteQaGroup?.label).toBe("粘贴 QA 通过");
    expect(pasteQaGroup?.rawKey).toBe("paste_qa_pass");
    expect(pasteQaGroup?.assets).toHaveLength(2);
    expect(
      pasteQaGroup?.assets.map((asset) => asset.runtimeVariantId).sort(),
    ).toEqual([
      "heading_purple_chapter_label_candidate",
      "info_card_reading_path_candidate",
    ]);
  });

  it("builds candidate review cards for 006D seed assets in zh and en", () => {
    const zhViewModel = buildStyleLibraryAdminViewModel(undefined, "zh");
    const enViewModel = buildStyleLibraryAdminViewModel(undefined, "en");

    for (const viewModel of [zhViewModel, enViewModel]) {
      expect(viewModel.candidateReviewCards).toHaveLength(2);
      const runtimeIds = viewModel.candidateReviewCards
        .map((card) => card.runtimeVariantId)
        .sort();
      expect(runtimeIds).toEqual([
        "heading_purple_chapter_label_candidate",
        "info_card_reading_path_candidate",
      ]);
    }

    expect(zhViewModel.candidateReviewCards[0]?.currentConclusion).toContain(
      "有兼容性提醒",
    );
    expect(enViewModel.candidateReviewCards[0]?.currentConclusion).toContain(
      "compatibility warnings",
    );
    expect(zhViewModel.candidateReviewCards[0]?.disabledActions[0]?.label).toBe(
      "校验",
    );
    expect(enViewModel.candidateReviewCards[0]?.disabledActions[0]?.label).toBe(
      "Validate",
    );
  });

  it("defines disabled actions deferred to later stories", () => {
    const zhActions = getCandidateDisabledActions("zh");
    expect(
      zhActions.some((action) => action.deferredStory.includes("S9-STORY-004")),
    ).toBe(true);
    expect(
      zhActions.some((action) => action.deferredStory.includes("S9-STORY-006")),
    ).toBe(true);
    expect(
      zhActions.some((action) => action.deferredStory.includes("S9-STORY-007")),
    ).toBe(true);
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
      expect(asset.assetId).toContain("seed-variant");
      expect(asset.runtimeVariantId).toContain("_candidate");
    }
  });

  it("includes promote summary counts and panels on candidate cards", () => {
    const viewModel = buildStyleLibraryAdminViewModel(undefined, "zh");

    expect(viewModel.promoteSummaryCounts.readyForPromoteReview).toBe(2);
    expect(viewModel.statusSummary.promoteProposalsAvailable).toBe(2);
    expect(viewModel.candidatePromotePanels).toHaveLength(2);
    expect(viewModel.candidateReviewCards[0]?.promotePanel.eligible).toBe(true);
    expect(viewModel.candidateReviewCards[0]?.promotePanel.proposal.toDistribution).toEqual({
      userSelectable: true,
      defaultEligible: false,
      release1Required: false,
    });
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

  it("states runtime is not connected for operators", () => {
    const viewModel = buildStyleLibraryAdminViewModel(undefined, "zh");
    expect(viewModel.runtimeNotice).toContain("Gallery");
    expect(viewModel.runtimeNotice).toContain("Preview");
    expect(viewModel.runtimeNotice).toContain("Copy");
  });
});
