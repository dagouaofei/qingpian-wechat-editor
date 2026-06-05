import { describe, expect, it } from "vitest";

import { validateWechatCopyHtml } from "@/core/copy";
import { createFirstWaveRequiredVariantRegistry } from "@/core/styles";
import {
  HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET,
  INFO_CARD_READING_PATH_SEED_ASSET,
  STYLE_LIBRARY_MANIFEST,
  STYLE_LIBRARY_SEED_RUNTIME_VARIANT_IDS,
  buildStyleLibraryInspectionTarget,
  createCandidatePreviewFixture,
  createStyleLibraryInspectionStyleRegistry,
  getStyleLibraryInspectionSummaries,
  getStyleLibraryInspectionSummary,
  renderStyleLibraryCandidateCopyHtml,
  renderStyleLibraryCandidatePreview,
  validateStyleLibraryCandidateCopyHtml,
} from "@/core/style-library";

describe("style-library inspection engine", () => {
  it("builds inspection targets for 006D seed assets", () => {
    for (const asset of [
      HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET,
      INFO_CARD_READING_PATH_SEED_ASSET,
    ]) {
      const target = buildStyleLibraryInspectionTarget(asset, STYLE_LIBRARY_MANIFEST);
      expect(target.inspectionContext).toBe("style-library-inspection");
      expect(target.runtimeVariantId).toBe(asset.runtimeVariantId);
      expect(target.blockType).toBe(asset.blockType);
    }
  });

  it("does not modify manifest when running inspection", () => {
    const before = structuredClone(STYLE_LIBRARY_MANIFEST);
    getStyleLibraryInspectionSummaries(STYLE_LIBRARY_MANIFEST);
    expect(STYLE_LIBRARY_MANIFEST).toEqual(before);
  });

  it("does not add harvest candidates to runtime default registry", () => {
    const runtimeRegistry = createFirstWaveRequiredVariantRegistry();
    const runtimeVariantIds = runtimeRegistry.variants.map((variant) => variant.id);
    for (const variantId of STYLE_LIBRARY_SEED_RUNTIME_VARIANT_IDS) {
      expect(runtimeVariantIds).not.toContain(variantId);
    }
  });

  it("uses a separate inspection-only style registry", () => {
    const inspectionRegistry = createStyleLibraryInspectionStyleRegistry();
    const inspectionVariantIds = inspectionRegistry.variants.map((variant) => variant.id);
    for (const variantId of STYLE_LIBRARY_SEED_RUNTIME_VARIANT_IDS) {
      expect(inspectionVariantIds).toContain(variantId);
    }
  });

  it("generates preview results for seed assets", () => {
    const preview = renderStyleLibraryCandidatePreview(
      HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET,
      STYLE_LIBRARY_MANIFEST,
    );
    expect(preview.ok).toBe(true);
    expect(preview.outputKind).toBe("title_block_preview");
    expect(preview.variantId).toBe("heading_purple_chapter_label_candidate");
  });

  it("generates copy HTML results for seed assets", () => {
    const copy = renderStyleLibraryCandidateCopyHtml(
      INFO_CARD_READING_PATH_SEED_ASSET,
      STYLE_LIBRARY_MANIFEST,
    );
    expect(copy.ok).toBe(true);
    expect(copy.html).toContain("阅读路径");
    expect(copy.usesInlineStyle).toBe(true);
  });

  it("validates copy HTML via validateWechatCopyHtml", () => {
    const validator = validateStyleLibraryCandidateCopyHtml(
      HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET,
      STYLE_LIBRARY_MANIFEST,
    );
    expect(validator.validation).not.toBeNull();
    expect(["PASS", "WARNING", "FAIL"]).toContain(validator.status);
    expect(validator.issueCount).toBeGreaterThan(0);
  });

  it("maps validator WARNING to operator-ready promote review for paste_qa_pass seeds", () => {
    const summary = getStyleLibraryInspectionSummary(
      HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET,
      STYLE_LIBRARY_MANIFEST,
    );
    expect(summary.validator.status).not.toBe("FAIL");
    expect(summary.promoteReadiness.hasPasteQaEvidence).toBe(true);
    expect(summary.promoteReadiness.readyForPromoteReview).toBe(true);
    expect(summary.operatorConclusionKey).toBe("ready_for_promote_review_with_warnings");
    expect(summary.promoteReadiness.nextRequiredStory).toBe("S9-STORY-007");
  });

  it("shows needs paste QA when evidence is missing", () => {
    const assetWithoutPaste = {
      ...HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET,
      lifecycle: "validator_pass" as const,
      evidenceIds: ["S8M-HARVEST-001"],
    };
    const summary = getStyleLibraryInspectionSummary(assetWithoutPaste, STYLE_LIBRARY_MANIFEST);
    expect(summary.promoteReadiness.hasPasteQaEvidence).toBe(false);
    expect(summary.promoteReadiness.readyForPromoteReview).toBe(false);
    expect(summary.operatorConclusionKey).toBe("needs_paste_qa");
  });

  it("does not auto-modify distribution flags", () => {
    const before = {
      userSelectable: HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET.distribution.userSelectable,
      defaultEligible: HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET.distribution.defaultEligible,
      release1Required: HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET.distribution.release1Required,
    };
    getStyleLibraryInspectionSummary(
      HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET,
      STYLE_LIBRARY_MANIFEST,
    );
    expect(HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET.distribution).toEqual(before);
  });

  it("creates preview fixture articles without touching runtime registry", () => {
    const article = createCandidatePreviewFixture(HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET);
    expect(article.blocks).toHaveLength(1);
    expect(article.styleAssignment.presetId).toBe("style_library_inspection_v0");
  });

  it("reuses validateWechatCopyHtml on rendered copy html", () => {
    const copy = renderStyleLibraryCandidateCopyHtml(
      INFO_CARD_READING_PATH_SEED_ASSET,
      STYLE_LIBRARY_MANIFEST,
    );
    const direct = validateWechatCopyHtml({
      html: copy.html!,
      blockType: "info_card",
      variantId: "info_card_reading_path_candidate",
    });
    const wrapped = validateStyleLibraryCandidateCopyHtml(
      INFO_CARD_READING_PATH_SEED_ASSET,
      STYLE_LIBRARY_MANIFEST,
    );
    expect(wrapped.validation?.valid).toBe(direct.valid);
    expect(wrapped.validation?.issues.length).toBe(direct.issues.length);
  });
});
