import { describe, expect, it } from "vitest";

import {
  HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET,
  STYLE_LIBRARY_LIFECYCLE_ORDER,
  STYLE_LIBRARY_MANIFEST,
  createLifecycleChangeProposal,
  getAllowedLifecycleTransitions,
  getBlockedLifecycleTransitions,
  canTransitionLifecycle,
  validateLifecycleTransition,
} from "@/core/style-library";
import type { StyleLibraryManifest, StyleLibraryVariantAsset } from "@/core/style-library";

const CANDIDATE_NO_EVIDENCE: StyleLibraryVariantAsset = {
  ...HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET,
  assetId: "candidate-no-evidence",
  lifecycle: "candidate",
  evidenceIds: [],
  isSeedAsset: false,
};

const VALIDATOR_NO_PASTE: StyleLibraryVariantAsset = {
  ...HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET,
  assetId: "validator-no-paste",
  lifecycle: "validator_pass",
  evidenceIds: ["S8M-HARVEST-001"],
  isSeedAsset: false,
};

const USER_SELECTABLE_ASSET: StyleLibraryVariantAsset = {
  ...HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET,
  assetId: "user-selectable-sample",
  lifecycle: "user_selectable",
  distribution: {
    userSelectable: true,
    defaultEligible: false,
    release1Required: false,
  },
  isSeedAsset: false,
};

function manifestWithAssets(
  assets: StyleLibraryVariantAsset[],
): StyleLibraryManifest {
  return {
    ...STYLE_LIBRARY_MANIFEST,
    assets,
    seedAssetIds: STYLE_LIBRARY_MANIFEST.seedAssetIds,
  };
}

describe("style-library lifecycle engine", () => {
  it("defines lifecycle state order", () => {
    expect(STYLE_LIBRARY_LIFECYCLE_ORDER).toEqual([
      "draft",
      "candidate",
      "validator_pass",
      "paste_qa_pass",
      "user_selectable",
      "default_eligible",
      "deprecated",
    ]);
  });

  it("keeps 006D seed assets at paste_qa_pass", () => {
    for (const asset of STYLE_LIBRARY_MANIFEST.assets.filter((row) => row.isSeedAsset)) {
      expect(asset.lifecycle).toBe("paste_qa_pass");
    }
  });

  it("blocks paste_qa_pass to user_selectable with S9-STORY-007", () => {
    const asset = HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET;
    const proposal = createLifecycleChangeProposal(
      asset,
      "user_selectable",
      STYLE_LIBRARY_MANIFEST,
    );

    expect(proposal.allowed).toBe(false);
    expect(proposal.requiredStory).toBe("S9-STORY-007");
    expect(proposal.blockedReasonCodes).toContain("SEED_REQUIRES_PROMOTE_REVIEW");
  });

  it("blocks user_selectable to default_eligible without PO decision", () => {
    const proposal = createLifecycleChangeProposal(
      USER_SELECTABLE_ASSET,
      "default_eligible",
      manifestWithAssets([USER_SELECTABLE_ASSET]),
    );

    expect(proposal.allowed).toBe(false);
    expect(proposal.requiredStory).toBe("S9-STORY-007");
    expect(proposal.blockedReasonCodes).toContain("REQUIRES_PO_DEFAULT_DECISION");
  });

  it("blocks candidate to validator_pass when validator evidence is missing", () => {
    const manifest = manifestWithAssets([CANDIDATE_NO_EVIDENCE]);
    const blocked = getBlockedLifecycleTransitions(CANDIDATE_NO_EVIDENCE, manifest);
    const target = blocked.find((row) => row.targetState === "validator_pass");

    expect(target?.allowed).toBe(false);
    expect(target?.blockedReasonCodes).toContain("MISSING_VALIDATOR_EVIDENCE");
  });

  it("blocks validator_pass to paste_qa_pass when paste QA evidence is missing", () => {
    const manifest = manifestWithAssets([VALIDATOR_NO_PASTE]);
    const blocked = getBlockedLifecycleTransitions(VALIDATOR_NO_PASTE, manifest);
    const target = blocked.find((row) => row.targetState === "paste_qa_pass");

    expect(target?.allowed).toBe(false);
    expect(target?.blockedReasonCodes).toContain("MISSING_PASTE_QA_EVIDENCE");
  });

  it("requires a reason for deprecated proposals", () => {
    const asset = HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET;
    const withoutReason = createLifecycleChangeProposal(
      asset,
      "deprecated",
      STYLE_LIBRARY_MANIFEST,
    );
    const withReason = createLifecycleChangeProposal(
      asset,
      "deprecated",
      STYLE_LIBRARY_MANIFEST,
      { deprecationReason: "Operator review: superseded" },
    );

    expect(withoutReason.allowed).toBe(false);
    expect(withReason.allowed).toBe(true);
  });

  it("keeps runtimeImpact as no runtime change", () => {
    const proposal = createLifecycleChangeProposal(
      HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET,
      "user_selectable",
      STYLE_LIBRARY_MANIFEST,
    );

    expect(proposal.runtimeImpact.affectsRuntime).toBe(false);
    expect(proposal.runtimeImpact.activatesRegistryPatch).toBe(false);
    expect(proposal.runtimeImpact.affectsGallery).toBe(false);
    expect(proposal.runtimeImpact.affectsDefaultPreset).toBe(false);
  });

  it("does not change distribution flags in proposals", () => {
    const asset = HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET;
    const proposal = createLifecycleChangeProposal(
      asset,
      "user_selectable",
      STYLE_LIBRARY_MANIFEST,
    );

    expect(proposal.distributionImpact.userSelectable).toBe(false);
    expect(proposal.distributionImpact.defaultEligible).toBe(false);
    expect(proposal.distributionImpact.release1Required).toBe(false);

    const validation = validateLifecycleTransition(proposal, STYLE_LIBRARY_MANIFEST);
    expect(validation.ok).toBe(true);
  });

  it("allows deprecated proposal preview when reason is provided", () => {
    const asset = HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET;
    expect(
      canTransitionLifecycle(asset, "deprecated", STYLE_LIBRARY_MANIFEST, {
        deprecationReason: "Retire seed candidate",
      }),
    ).toBe(true);
    expect(getAllowedLifecycleTransitions(asset, STYLE_LIBRARY_MANIFEST, {
      deprecationReason: "Retire seed candidate",
    }).some((row) => row.targetState === "deprecated")).toBe(true);
  });
});
