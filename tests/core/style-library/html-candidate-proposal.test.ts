import { describe, expect, it } from "vitest";

import { createFirstWaveRequiredVariantRegistry } from "@/core/styles";
import {
  STYLE_LIBRARY_MANIFEST,
  createHtmlCandidateProposal,
  extractStyleFeaturesFromHtml,
  validateHtmlCandidateProposal,
} from "@/core/style-library";

const HEADING_HTML = `<p style="margin:0 0 6px"><span style="display:inline-block;background-color:#6c5ce7;color:#ffffff;font-size:12px;font-weight:700;padding:2px 8px">CHAPTER 01</span></p><h3 style="margin:0;font-size:18px;font-weight:700;color:#333333">标题</h3>`;

const INFO_CARD_HTML = `<section style="margin:16px 0;padding:12px;background-color:#eef5ff;border-left:4px solid #2563eb"><p style="margin:0;font-size:14px;color:#1e3a5f"><strong>阅读路径</strong></p></section>`;

describe("html candidate proposal engine", () => {
  it("creates proposal from heading HTML", () => {
    const proposal = createHtmlCandidateProposal({
      sourceHtml: HEADING_HTML,
      blockType: "heading",
      label: "Purple Chapter Paste",
    });

    expect(proposal.detectedBlockType).toBe("heading");
    expect(proposal.proposedLifecycle).toBe("candidate");
    expect(proposal.distribution).toEqual({
      userSelectable: false,
      defaultEligible: false,
      release1Required: false,
    });
    expect(proposal.candidateVariantId).toContain("heading");
    expect(proposal.extractedStyleFeatures.length).toBeGreaterThan(0);
  });

  it("creates proposal from info_card HTML", () => {
    const proposal = createHtmlCandidateProposal({
      sourceHtml: INFO_CARD_HTML,
      blockType: "info_card",
    });

    expect(proposal.detectedBlockType).toBe("info_card");
    expect(proposal.suggestedPaletteId).toBe("palette_reading_path_calm");
    expect(proposal.suggestedRuleIds.length).toBeGreaterThan(0);
  });

  it("extracts inline style features", () => {
    const extraction = extractStyleFeaturesFromHtml(HEADING_HTML);
    expect(extraction.hasInlineStyle).toBe(true);
    expect(extraction.features.some((row) => row.key === "backgroundColor")).toBe(true);
    expect(extraction.features.some((row) => row.key === "fontSize")).toBe(true);
  });

  it("warns on forbidden CSS", () => {
    const extraction = extractStyleFeaturesFromHtml('<p class="foo" style="color:red">x</p>');
    expect(extraction.hasForbiddenCss).toBe(true);
    expect(extraction.warnings).toContain("FORBIDDEN_CSS_DETECTED");
  });

  it("generates evidence draft and cursor patch summary", () => {
    const proposal = createHtmlCandidateProposal({ sourceHtml: HEADING_HTML, blockType: "heading" });
    expect(proposal.evidenceDraft.sourceType).toBe("pasted_html");
    expect(proposal.evidenceDraft.pasteQaStatus).toBe("not_tested");
    expect(proposal.cursorPatchSummary).toContain("S9-STORY-007B");
    expect(proposal.cursorPatchSummary).toContain(proposal.candidateVariantId);
    expect(proposal.cursorPatchSummary).toContain("userSelectable=false");
  });

  it("runs proposal inspection with validator result", () => {
    const proposal = createHtmlCandidateProposal({ sourceHtml: HEADING_HTML, blockType: "heading" });
    expect(proposal.inspection.copyStatus).toBe("ok");
    expect(["PASS", "WARNING", "FAIL"]).toContain(proposal.inspection.validatorStatus);
    expect(proposal.inspection.promoteReadinessHint).toContain("not_tested");
  });

  it("does not modify manifest", () => {
    const before = structuredClone(STYLE_LIBRARY_MANIFEST);
    createHtmlCandidateProposal({ sourceHtml: HEADING_HTML, blockType: "heading" });
    expect(STYLE_LIBRARY_MANIFEST).toEqual(before);
  });

  it("validates proposal boundaries", () => {
    const proposal = createHtmlCandidateProposal({ sourceHtml: HEADING_HTML, blockType: "heading" });
    expect(validateHtmlCandidateProposal(proposal).ok).toBe(true);
  });

  it("does not add candidates to runtime registry", () => {
    const runtimeIds = createFirstWaveRequiredVariantRegistry().variants.map((v) => v.id);
    const proposal = createHtmlCandidateProposal({ sourceHtml: HEADING_HTML, blockType: "heading" });
    expect(runtimeIds).not.toContain(proposal.candidateVariantId);
  });
});
