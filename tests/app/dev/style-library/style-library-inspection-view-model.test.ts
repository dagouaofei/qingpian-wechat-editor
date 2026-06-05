import { describe, expect, it } from "vitest";

import {
  buildStyleLibraryAdminViewModel,
} from "@/app/dev/style-library/style-library-view-model";
import {
  buildStyleLibraryInspectionPanels,
  buildStyleLibraryInspectionSummaryCounts,
} from "@/app/dev/style-library/style-library-inspection-view-model";
import {
  HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET,
  STYLE_LIBRARY_MANIFEST,
  getStyleLibraryInspectionSummaries,
  getStyleLibraryInspectionSummary,
} from "@/core/style-library";
import type { StyleLibraryInspectionSummary } from "@/core/style-library";

function mockSummary(
  overrides: Partial<StyleLibraryInspectionSummary> & {
    validatorStatus?: "PASS" | "WARNING" | "FAIL";
    hasBlockingIssues?: boolean;
    hasPasteQaEvidence?: boolean;
    readyForPromoteReview?: boolean;
  },
): StyleLibraryInspectionSummary {
  const base = getStyleLibraryInspectionSummary(
    HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET,
    STYLE_LIBRARY_MANIFEST,
  );
  const validatorStatus = overrides.validatorStatus ?? base.validator.status;
  const hasBlockingIssues =
    overrides.hasBlockingIssues ?? base.promoteReadiness.hasBlockingIssues;

  return {
    ...base,
    ...overrides,
    validator: {
      ...base.validator,
      status: validatorStatus,
      valid: validatorStatus !== "FAIL",
      blockerCount: hasBlockingIssues ? 1 : 0,
      warningCount: validatorStatus === "WARNING" ? 1 : 0,
      ...overrides.validator,
    },
    promoteReadiness: {
      ...base.promoteReadiness,
      hasBlockingIssues,
      hasPasteQaEvidence:
        overrides.hasPasteQaEvidence ?? base.promoteReadiness.hasPasteQaEvidence,
      readyForPromoteReview:
        overrides.readyForPromoteReview ?? base.promoteReadiness.readyForPromoteReview,
      ...overrides.promoteReadiness,
    },
    operatorConclusionKey:
      overrides.operatorConclusionKey ??
      (validatorStatus === "FAIL"
        ? "validator_fail"
        : hasBlockingIssues
          ? "has_blocking_issues"
          : validatorStatus === "WARNING"
            ? "ready_for_promote_review_with_warnings"
            : "ready_for_promote_review"),
  };
}

describe("style-library inspection view model", () => {
  it("builds inspection panels for seed candidates and applied user_selectable asset", () => {
    const panels = buildStyleLibraryInspectionPanels(STYLE_LIBRARY_MANIFEST, "zh");
    expect(panels).toHaveLength(3);
    expect(panels.map((panel) => panel.runtimeVariantId)).toEqual([
      "heading_purple_chapter_label_candidate",
      "info_card_reading_path_candidate",
      "heading_teal_section_label_html_paste_candidate",
    ]);
  });

  it("includes preview block payload for operator preview shell", () => {
    const panel = buildStyleLibraryInspectionPanels(STYLE_LIBRARY_MANIFEST, "zh")[0]!;
    expect(panel.previewOk).toBe(true);
    expect(panel.previewBlock?.ok).toBe(true);
    expect(panel.previewBlock?.output).toBeTruthy();
  });

  it("shows warning-aware readiness copy for WARNING + paste_qa_pass seeds in zh", () => {
    const panel = buildStyleLibraryInspectionPanels(STYLE_LIBRARY_MANIFEST, "zh").find(
      (row) => row.runtimeVariantId === "heading_purple_chapter_label_candidate",
    )!;
    expect(panel.validatorStatus).toBe("WARNING");
    expect(panel.promoteReadiness.readyForPromoteReview).toBe(true);
    expect(panel.promoteReadinessLabel).toBe(
      "可进入上线审核（有兼容性提醒，需保留 Paste QA 证据）",
    );
    expect(panel.operatorConclusion).toBe(
      "可进入上线审核（有兼容性提醒，需保留 Paste QA 证据）",
    );
  });

  it("shows warning-aware readiness copy in en", () => {
    const panel = buildStyleLibraryInspectionPanels(STYLE_LIBRARY_MANIFEST, "en").find(
      (row) => row.runtimeVariantId === "heading_purple_chapter_label_candidate",
    )!;
    expect(panel.promoteReadinessLabel).toBe(
      "Ready for promote review with compatibility warnings",
    );
    expect(panel.operatorConclusion).toBe(
      "Ready for promote review with compatibility warnings",
    );
  });

  it("does not count WARNING-only seed candidates as blocked in inspection counts", () => {
    const counts = buildStyleLibraryInspectionSummaryCounts(
      getStyleLibraryInspectionSummaries(STYLE_LIBRARY_MANIFEST),
    );
    expect(counts.blockedCandidates).toBe(0);
    expect(counts.compatibilityWarnings).toBe(3);
  });

  it("counts FAIL candidates as blocked but not as compatibility warnings", () => {
    const counts = buildStyleLibraryInspectionSummaryCounts([
      mockSummary({ validatorStatus: "FAIL", readyForPromoteReview: false }),
      mockSummary({ validatorStatus: "WARNING", hasBlockingIssues: false }),
    ]);
    expect(counts.blockedCandidates).toBe(1);
    expect(counts.compatibilityWarnings).toBe(1);
  });

  it("aggregates inspection summary counts for seeds and applied asset", () => {
    const counts = buildStyleLibraryInspectionSummaryCounts(
      getStyleLibraryInspectionSummaries(STYLE_LIBRARY_MANIFEST),
    );
    expect(counts.autoValidationPassed).toBe(3);
    expect(counts.readyForPromoteReview).toBe(2);
    expect(counts.needsPasteQa).toBe(0);
  });

  it("integrates inspection panels into admin view model", () => {
    const viewModel = buildStyleLibraryAdminViewModel(STYLE_LIBRARY_MANIFEST, "zh");
    expect(viewModel.candidateInspectionPanels).toHaveLength(3);
    expect(viewModel.inspectionSummaryCounts.readyForPromoteReview).toBe(2);
    expect(viewModel.statusSummary.compatibilityWarnings).toBe(2);
    expect(viewModel.statusSummary.blockedCandidates).toBe(1);
    expect(viewModel.candidateReviewCards[0]?.currentConclusion).toContain(
      "有兼容性提醒",
    );
  });
});
