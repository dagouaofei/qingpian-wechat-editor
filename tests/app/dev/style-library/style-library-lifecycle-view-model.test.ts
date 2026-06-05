import { describe, expect, it } from "vitest";

import {
  buildCandidateLifecyclePanel,
  buildCandidateLifecyclePanels,
  buildLifecycleColumnMetaList,
} from "@/app/dev/style-library/style-library-lifecycle-view-model";
import { buildStyleLibraryAdminViewModel } from "@/app/dev/style-library/style-library-view-model";

describe("style-library lifecycle view model", () => {
  it("builds lifecycle panels for 006D seed assets at paste_qa_pass", () => {
    const panels = buildCandidateLifecyclePanels(undefined, "zh");

    expect(panels).toHaveLength(2);
    for (const panel of panels) {
      expect(panel.currentLifecycle).toBe("paste_qa_pass");
      expect(panel.currentLifecycleLabel).toBe("粘贴 QA 通过");
      expect(panel.linkedFutureStory).toBe("S9-STORY-007");
    }
  });

  it("includes blocked user_selectable transition requiring S9-STORY-007", () => {
    const panel = buildCandidateLifecyclePanel(
      "seed-variant-heading-purple-chapter-label",
      undefined,
      "zh",
    );

    expect(panel).not.toBeNull();
    const blocked = panel?.blockedTransitions.find(
      (row) => row.targetState === "user_selectable",
    );
    expect(blocked?.allowed).toBe(false);
    expect(blocked?.requiredStory).toBe("S9-STORY-007");
    expect(blocked?.proposal.runtimeImpact.affectsRuntime).toBe(false);
  });

  it("provides zh and en lifecycle labels in admin view model", () => {
    const zhModel = buildStyleLibraryAdminViewModel(undefined, "zh");
    const enModel = buildStyleLibraryAdminViewModel(undefined, "en");

    expect(zhModel.lifecycleGroups.find((g) => g.lifecycle === "paste_qa_pass")?.label).toBe(
      "粘贴 QA 通过",
    );
    expect(enModel.lifecycleGroups.find((g) => g.lifecycle === "paste_qa_pass")?.label).toBe(
      "Paste QA Pass",
    );
  });

  it("attaches lifecycle panels to candidate review cards", () => {
    const viewModel = buildStyleLibraryAdminViewModel(undefined, "zh");

    expect(viewModel.candidateLifecyclePanels).toHaveLength(2);
    expect(viewModel.candidateReviewCards[0]?.lifecyclePanel.assetId).toBe(
      viewModel.candidateReviewCards[0]?.assetId,
    );
    expect(viewModel.candidateReviewCards[0]?.lifecyclePanel.blockedReason).toContain(
      "S9-STORY-007",
    );
  });

  it("builds lifecycle column meta with business meaning", () => {
    const columns = buildLifecycleColumnMetaList(undefined, "zh");
    const pasteQa = columns.find((column) => column.lifecycle === "paste_qa_pass");

    expect(pasteQa?.assetCount).toBe(2);
    expect(pasteQa?.businessMeaning).toContain("粘贴");
    expect(pasteQa?.nextAction).toContain("S9-STORY-007");
  });

  it("keeps seed distribution flags false in view model", () => {
    const viewModel = buildStyleLibraryAdminViewModel(undefined, "zh");

    for (const card of viewModel.candidateReviewCards) {
      expect(card.userSelectable).toBe(false);
      expect(card.defaultEligible).toBe(false);
      expect(card.release1Required).toBe(false);
    }
  });
});
