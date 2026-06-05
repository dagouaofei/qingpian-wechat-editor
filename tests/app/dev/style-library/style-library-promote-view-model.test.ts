import { describe, expect, it } from "vitest";

import {
  buildStyleLibraryPromotePanels,
  buildStyleLibraryPromoteSummaryCounts,
} from "@/app/dev/style-library/style-library-promote-view-model";
import { buildStyleLibraryAdminViewModel } from "@/app/dev/style-library/style-library-view-model";
import {
  getPromoteEligibilityStatusLabel,
  translatePromoteBlockReasonCode,
} from "@/app/dev/style-library/style-library-i18n";
import { STYLE_LIBRARY_MANIFEST } from "@/core/style-library";

describe("style-library promote view model", () => {
  it("builds promote panels for seed candidates and applied user_selectable asset", () => {
    const panels = buildStyleLibraryPromotePanels(STYLE_LIBRARY_MANIFEST, "zh");
    expect(panels).toHaveLength(3);
    const seedPanels = panels.filter((panel) =>
      ["heading_purple_chapter_label_candidate", "info_card_reading_path_candidate"].includes(
        panel.runtimeVariantId,
      ),
    );
    expect(seedPanels).toHaveLength(2);
    expect(seedPanels.every((panel) => panel.eligible)).toBe(true);
    expect(
      panels.find(
        (panel) =>
          panel.runtimeVariantId === "heading_teal_section_label_html_paste_candidate",
      )?.eligible,
    ).toBe(false);
  });

  it("counts ready proposals and warnings from manifest", () => {
    const counts = buildStyleLibraryPromoteSummaryCounts(STYLE_LIBRARY_MANIFEST);
    expect(counts.readyForPromoteReview).toBe(2);
    expect(counts.compatibilityWarnings).toBe(2);
    expect(counts.blockedCandidates).toBe(1);
    expect(counts.proposalsAvailable).toBe(2);
  });

  it("localizes eligibility labels in zh and en without translating technical ids", () => {
    const zhPanel = buildStyleLibraryPromotePanels(STYLE_LIBRARY_MANIFEST, "zh")[0]!;
    const enPanel = buildStyleLibraryPromotePanels(STYLE_LIBRARY_MANIFEST, "en")[0]!;

    expect(zhPanel.eligibilityStatusLabel).toBe("可进入上线审核（有兼容性提醒）");
    expect(enPanel.eligibilityStatusLabel).toBe("Ready with compatibility warnings");
    expect(zhPanel.runtimeVariantId).toBe("heading_purple_chapter_label_candidate");
    expect(zhPanel.proposal.proposalId).toContain("seed-variant-heading-purple-chapter-label");
    expect(zhPanel.promoteTarget).toBe("user_selectable");
  });

  it("translates block reason codes while keeping codes as fallback", () => {
    expect(
      translatePromoteBlockReasonCode("zh", "MISSING_PASTE_QA_EVIDENCE"),
    ).toBe("缺少粘贴 QA 证据");
    expect(
      translatePromoteBlockReasonCode("en", "MISSING_PASTE_QA_EVIDENCE"),
    ).toBe("Paste QA evidence missing");
    expect(translatePromoteBlockReasonCode("zh", "UNKNOWN_CODE")).toBe("UNKNOWN_CODE");
  });

  it("wires promote panels into admin view model", () => {
    const viewModel = buildStyleLibraryAdminViewModel(undefined, "zh");
    expect(viewModel.promoteSummaryCounts.proposalsAvailable).toBe(2);
    expect(viewModel.statusSummary.promoteProposalsAvailable).toBe(2);
    expect(viewModel.candidateReviewCards[0]?.promotePanel.proposal.patchPreview.active).toBe(
      false,
    );
    expect(viewModel.candidateReviewCards[0]?.promotePanel.nextDecisionRequired).toContain(
      "default_eligible",
    );
  });

  it("uses localized impact copy in panels", () => {
    const zhPanel = buildStyleLibraryPromotePanels(STYLE_LIBRARY_MANIFEST, "zh")[0]!;
    const enPanel = buildStyleLibraryPromotePanels(STYLE_LIBRARY_MANIFEST, "en")[0]!;

    expect(zhPanel.distributionImpactSummary).toContain("userSelectable: false → true");
    expect(zhPanel.runtimeImpactSummary).toContain("不修改 runtime registry");
    expect(enPanel.runtimeImpactSummary).toContain("No runtime registry change");
    expect(getPromoteEligibilityStatusLabel("en", "ready_with_warnings")).toBe(
      "Ready with compatibility warnings",
    );
  });
});
