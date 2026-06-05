import { describe, expect, it } from "vitest";

import {
  buildStyleLibraryAdminViewModel,
} from "@/app/dev/style-library/style-library-view-model";
import {
  buildStyleLibraryInspectionPanels,
  buildStyleLibraryInspectionSummaryCounts,
} from "@/app/dev/style-library/style-library-inspection-view-model";
import { STYLE_LIBRARY_MANIFEST, getStyleLibraryInspectionSummaries } from "@/core/style-library";

describe("style-library inspection view model", () => {
  it("builds inspection panels for both seed candidates", () => {
    const panels = buildStyleLibraryInspectionPanels(STYLE_LIBRARY_MANIFEST, "zh");
    expect(panels).toHaveLength(2);
    expect(panels.map((panel) => panel.runtimeVariantId)).toEqual([
      "heading_purple_chapter_label_candidate",
      "info_card_reading_path_candidate",
    ]);
  });

  it("includes preview block payload for operator preview shell", () => {
    const panel = buildStyleLibraryInspectionPanels(STYLE_LIBRARY_MANIFEST, "zh")[0]!;
    expect(panel.previewOk).toBe(true);
    expect(panel.previewBlock?.ok).toBe(true);
    expect(panel.previewBlock?.output).toBeTruthy();
  });

  it("maps seed assets to ready for promote review in zh", () => {
    const panel = buildStyleLibraryInspectionPanels(STYLE_LIBRARY_MANIFEST, "zh").find(
      (row) => row.runtimeVariantId === "heading_purple_chapter_label_candidate",
    )!;
    expect(panel.promoteReadiness.readyForPromoteReview).toBe(true);
    expect(panel.operatorConclusion).toContain("上线审核");
  });

  it("supports en copy for validator and readiness labels", () => {
    const panel = buildStyleLibraryInspectionPanels(STYLE_LIBRARY_MANIFEST, "en")[0]!;
    expect(panel.validatorStatusLabel).toMatch(/PASS|WARNING|FAIL/);
    expect(panel.operatorConclusion).toContain("promote review");
  });

  it("aggregates inspection summary counts", () => {
    const counts = buildStyleLibraryInspectionSummaryCounts(
      getStyleLibraryInspectionSummaries(STYLE_LIBRARY_MANIFEST),
    );
    expect(counts.autoValidationPassed).toBe(2);
    expect(counts.readyForPromoteReview).toBe(2);
    expect(counts.needsPasteQa).toBe(0);
  });

  it("integrates inspection panels into admin view model", () => {
    const viewModel = buildStyleLibraryAdminViewModel(STYLE_LIBRARY_MANIFEST, "zh");
    expect(viewModel.candidateInspectionPanels).toHaveLength(2);
    expect(viewModel.inspectionSummaryCounts.readyForPromoteReview).toBe(2);
    expect(viewModel.candidateReviewCards[0]?.inspectionPanel.previewOk).toBe(true);
    expect(viewModel.candidateReviewCards[0]?.currentConclusion).toContain("上线审核");
  });
});
