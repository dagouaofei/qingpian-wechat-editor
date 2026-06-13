import { describe, expect, it } from "vitest";

import { evaluateUserSelectablePoolMembership } from "@/lib/user-selectable-pool-eligibility";

const TEAL_ID = "heading_teal_section_label_html_paste_candidate";
const D26_ID = "heading_html_paste_d26a6370_candidate";

describe("user-selectable pool eligibility", () => {
  it("includes variant when distribution.userSelectable=true and quality gate passes", () => {
    const trace = evaluateUserSelectablePoolMembership({
      runtimeVariantId: D26_ID,
      blockType: "heading",
      lifecycle: "paste_qa_pass",
      distribution: {
        userSelectable: true,
        hidden: false,
        deprecated: false,
      },
      currentVersion: { qualityStatus: "paste_qa_pass" },
      definitionJson: { id: D26_ID, blockType: "heading" },
      requiredBlockType: "heading",
    });

    expect(trace.eligible).toBe(true);
    expect(trace.inPreviewPicker).toBe(true);
    expect(trace.exclusionReasons).toEqual([]);
  });

  it("excludes variant when distribution.userSelectable=false even if lifecycle is user_selectable", () => {
    const trace = evaluateUserSelectablePoolMembership({
      runtimeVariantId: TEAL_ID,
      blockType: "heading",
      lifecycle: "user_selectable",
      distribution: {
        userSelectable: false,
        hidden: false,
        deprecated: false,
      },
      currentVersion: { qualityStatus: "paste_qa_pass" },
      definitionJson: { id: TEAL_ID, blockType: "heading" },
      requiredBlockType: "heading",
    });

    expect(trace.eligible).toBe(false);
    expect(trace.inPreviewPicker).toBe(false);
    expect(trace.exclusionReasons).toContain("distribution.userSelectable_false");
    expect(trace.passesSqlQuery).toBe(false);
  });

  it("excludes release1Required when userSelectable=false", () => {
    const trace = evaluateUserSelectablePoolMembership({
      runtimeVariantId: "heading_short_line",
      blockType: "heading",
      lifecycle: "release1_required",
      distribution: {
        userSelectable: false,
        hidden: false,
        deprecated: false,
      },
      currentVersion: { qualityStatus: "not_checked" },
      definitionJson: { id: "heading_short_line", blockType: "heading" },
      requiredBlockType: "heading",
    });

    expect(trace.eligible).toBe(false);
  });

  it("does not grant pool access from lifecycle alone", () => {
    const trace = evaluateUserSelectablePoolMembership({
      runtimeVariantId: TEAL_ID,
      blockType: "heading",
      lifecycle: "paste_qa_pass",
      distribution: {
        userSelectable: false,
        hidden: false,
        deprecated: false,
      },
      currentVersion: { qualityStatus: "paste_qa_pass" },
      definitionJson: { id: TEAL_ID, blockType: "heading" },
    });

    expect(trace.eligible).toBe(false);
    expect(trace.passesLifecycleGate).toBe(true);
    expect(trace.passesDistributionGate).toBe(false);
  });

  it("excludes blocked quality statuses", () => {
    const trace = evaluateUserSelectablePoolMembership({
      runtimeVariantId: D26_ID,
      blockType: "heading",
      lifecycle: "candidate",
      distribution: {
        userSelectable: true,
        hidden: false,
        deprecated: false,
      },
      currentVersion: { qualityStatus: "copy_fidelity_failed" },
      definitionJson: { id: D26_ID, blockType: "heading" },
    });

    expect(trace.eligible).toBe(false);
    expect(trace.exclusionReasons).toContain("quality_status:copy_fidelity_failed");
  });
});
