import { describe, expect, it } from "vitest";

import {
  HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET,
  INFO_CARD_READING_PATH_SEED_ASSET,
  STYLE_LIBRARY_MANIFEST,
  checkPromoteEligibility,
  createPromoteProposal,
  createUserSelectablePatchProposal,
  getPromoteBlockedReasons,
  getStyleLibraryInspectionSummary,
  validatePromoteProposal,
} from "@/core/style-library";
import { PROMOTE_BLOCK_REASON_CODES } from "@/core/style-library/promote-rules";

describe("style-library promote engine", () => {
  it("allows paste_qa_pass seeds with WARNING validator into promote review", () => {
    for (const asset of [
      HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET,
      INFO_CARD_READING_PATH_SEED_ASSET,
    ]) {
      const summary = getStyleLibraryInspectionSummary(asset, STYLE_LIBRARY_MANIFEST);
      const eligibility = checkPromoteEligibility(asset, STYLE_LIBRARY_MANIFEST, summary);
      expect(eligibility.status).toBe("ready_with_warnings");
      expect(eligibility.eligible).toBe(true);
      expect(eligibility.blockedReasonCodes).toHaveLength(0);
      expect(eligibility.warningCodes).toContain(
        PROMOTE_BLOCK_REASON_CODES.COMPATIBILITY_WARNING,
      );
    }
  });

  it("blocks validator FAIL", () => {
    const asset = HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET;
    const summary = getStyleLibraryInspectionSummary(asset, STYLE_LIBRARY_MANIFEST);
    const failSummary = {
      ...summary,
      validator: {
        ...summary.validator,
        status: "FAIL" as const,
        valid: false,
      },
    };
    const eligibility = checkPromoteEligibility(asset, STYLE_LIBRARY_MANIFEST, failSummary);
    expect(eligibility.status).toBe("blocked");
    expect(eligibility.blockedReasonCodes).toContain(PROMOTE_BLOCK_REASON_CODES.VALIDATOR_FAIL);
  });

  it("blocks when blocking issues are present", () => {
    const asset = HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET;
    const summary = getStyleLibraryInspectionSummary(asset, STYLE_LIBRARY_MANIFEST);
    const blockedSummary = {
      ...summary,
      promoteReadiness: {
        ...summary.promoteReadiness,
        hasBlockingIssues: true,
      },
      validator: {
        ...summary.validator,
        blockerCount: 1,
      },
    };
    const eligibility = checkPromoteEligibility(asset, STYLE_LIBRARY_MANIFEST, blockedSummary);
    expect(eligibility.status).toBe("blocked");
    expect(eligibility.blockedReasonCodes).toContain(PROMOTE_BLOCK_REASON_CODES.BLOCKING_ISSUES);
  });

  it("blocks when paste QA evidence is missing below paste_qa_pass", () => {
    const asset = {
      ...HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET,
      lifecycle: "validator_pass" as const,
      evidenceIds: ["S8M-HARVEST-001"],
    };
    const summary = getStyleLibraryInspectionSummary(asset, STYLE_LIBRARY_MANIFEST);
    const eligibility = checkPromoteEligibility(asset, STYLE_LIBRARY_MANIFEST, summary);
    expect(eligibility.status).toBe("blocked");
    expect(eligibility.blockedReasonCodes).toContain(
      PROMOTE_BLOCK_REASON_CODES.MISSING_PASTE_QA_EVIDENCE,
    );
  });

  it("includes compatibility warning in proposal without blocking", () => {
    const asset = HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET;
    const summary = getStyleLibraryInspectionSummary(asset, STYLE_LIBRARY_MANIFEST);
    const proposal = createPromoteProposal(asset, STYLE_LIBRARY_MANIFEST, summary);
    expect(proposal.eligibilityStatus).toBe("ready_with_warnings");
    expect(proposal.warnings).toContain(PROMOTE_BLOCK_REASON_CODES.COMPATIBILITY_WARNING);
    expect(proposal.blockedReasons).toHaveLength(0);
  });

  it("sets distributionImpact to user_selectable only", () => {
    const asset = HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET;
    const proposal = createPromoteProposal(asset, STYLE_LIBRARY_MANIFEST);
    expect(proposal.toDistribution).toEqual({
      userSelectable: true,
      defaultEligible: false,
      release1Required: false,
    });
    expect(proposal.distributionImpact.userSelectable).toEqual({ from: false, to: true });
    expect(proposal.distributionImpact.defaultEligible).toEqual({ from: false, to: false });
    expect(proposal.distributionImpact.release1Required).toEqual({ from: false, to: false });
  });

  it("keeps runtimeImpact as no runtime change", () => {
    const proposal = createPromoteProposal(
      HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET,
      STYLE_LIBRARY_MANIFEST,
    );
    expect(proposal.runtimeImpact.affectsRuntime).toBe(false);
    expect(proposal.runtimeImpact.activatesRegistryPatch).toBe(false);
    expect(proposal.runtimeImpact.affectsGallery).toBe(false);
    expect(proposal.runtimeImpact.affectsDefaultPreset).toBe(false);
    expect(proposal.runtimeImpact.summary).toContain("No runtime registry change");
  });

  it("does not modify manifest when creating proposals", () => {
    const before = structuredClone(STYLE_LIBRARY_MANIFEST);
    createPromoteProposal(HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET, STYLE_LIBRARY_MANIFEST);
    createUserSelectablePatchProposal({
      assetId: HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET.assetId,
      runtimeVariantId: HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET.runtimeVariantId,
      requiredEvidenceIds: HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET.evidenceIds ?? [],
    });
    expect(STYLE_LIBRARY_MANIFEST).toEqual(before);
  });

  it("does not modify seed asset distribution flags", () => {
    const before = {
      userSelectable: HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET.distribution.userSelectable,
      defaultEligible: HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET.distribution.defaultEligible,
      release1Required: HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET.distribution.release1Required,
    };
    createPromoteProposal(HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET, STYLE_LIBRARY_MANIFEST);
    expect(HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET.distribution).toEqual(before);
  });

  it("requires separate PO decision for default_eligible", () => {
    const proposal = createPromoteProposal(
      HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET,
      STYLE_LIBRARY_MANIFEST,
    );
    expect(proposal.nextDecisionRequired).toContain("default_eligible");
    expect(proposal.defaultPresetImpact.entersDefaultPreset).toBe(false);
    const validation = validatePromoteProposal(proposal, STYLE_LIBRARY_MANIFEST);
    expect(validation.ok).toBe(true);
  });

  it("creates inactive proposed patch preview", () => {
    const proposal = createPromoteProposal(
      INFO_CARD_READING_PATH_SEED_ASSET,
      STYLE_LIBRARY_MANIFEST,
    );
    expect(proposal.patchPreview.active).toBe(false);
    expect(proposal.patchPreview.status).toBe("proposed");
    expect(proposal.patchPreview.operation).toBe("add_to_variant_pool");
    expect(proposal.patchPreview.variantId).toBe("info_card_reading_path_candidate");
  });

  it("returns blocked reason codes via getPromoteBlockedReasons", () => {
    const asset = {
      ...HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET,
      lifecycle: "candidate" as const,
    };
    const summary = getStyleLibraryInspectionSummary(asset, STYLE_LIBRARY_MANIFEST);
    const reasons = getPromoteBlockedReasons(asset, STYLE_LIBRARY_MANIFEST, summary);
    expect(reasons).toContain(PROMOTE_BLOCK_REASON_CODES.LIFECYCLE_TOO_LOW);
  });
});
