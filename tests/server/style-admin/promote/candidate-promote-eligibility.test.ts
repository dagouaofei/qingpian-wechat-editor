import { describe, expect, it } from "vitest";

import { evaluateCandidatePromoteEligibility } from "@/server/style-admin/promote";

const baseDistribution = {
  userSelectable: false,
  defaultEligible: false,
  release1Required: false,
  hidden: false,
  deprecated: false,
};

describe("evaluateCandidatePromoteEligibility", () => {
  it("allows paste_qa_pass candidate with html_paste source", () => {
    const result = evaluateCandidatePromoteEligibility({
      lifecycle: "candidate",
      sourceType: "html_paste",
      qualityStatus: "paste_qa_pass",
      distribution: baseDistribution,
      hasCurrentVersion: true,
    });
    expect(result.eligible).toBe(true);
    expect(result.blockedReasons).toHaveLength(0);
  });

  it("blocks validator_pass without paste_qa_pass", () => {
    const result = evaluateCandidatePromoteEligibility({
      lifecycle: "candidate",
      sourceType: "html_paste",
      qualityStatus: "validator_pass",
      distribution: baseDistribution,
      hasCurrentVersion: true,
    });
    expect(result.eligible).toBe(false);
    expect(result.blockedReasons[0]).toContain("Paste QA pass is required");
  });

  it("blocks not_checked qualityStatus", () => {
    const result = evaluateCandidatePromoteEligibility({
      lifecycle: "candidate",
      sourceType: "html_paste",
      qualityStatus: "not_checked",
      distribution: baseDistribution,
      hasCurrentVersion: true,
    });
    expect(result.eligible).toBe(false);
    expect(result.blockedReasons.some((reason) => reason.includes("not_checked"))).toBe(true);
  });

  it("blocks copy_fidelity_failed", () => {
    const result = evaluateCandidatePromoteEligibility({
      lifecycle: "candidate",
      sourceType: "html_paste",
      qualityStatus: "copy_fidelity_failed",
      distribution: baseDistribution,
      hasCurrentVersion: true,
    });
    expect(result.eligible).toBe(false);
    expect(result.blockedReasons.some((reason) => reason.includes("copy_fidelity_failed"))).toBe(
      true,
    );
  });

  it("blocks deprecated distribution", () => {
    const result = evaluateCandidatePromoteEligibility({
      lifecycle: "candidate",
      sourceType: "html_paste",
      qualityStatus: "paste_qa_pass",
      distribution: { ...baseDistribution, deprecated: true },
      hasCurrentVersion: true,
    });
    expect(result.eligible).toBe(false);
    expect(result.blockedReasons.some((reason) => reason.includes("deprecated"))).toBe(true);
  });

  it("blocks hidden distribution", () => {
    const result = evaluateCandidatePromoteEligibility({
      lifecycle: "candidate",
      sourceType: "html_paste",
      qualityStatus: "paste_qa_pass",
      distribution: { ...baseDistribution, hidden: true },
      hasCurrentVersion: true,
    });
    expect(result.eligible).toBe(false);
    expect(result.blockedReasons.some((reason) => reason.includes("hidden"))).toBe(true);
  });

  it("blocks already userSelectable variants", () => {
    const result = evaluateCandidatePromoteEligibility({
      lifecycle: "user_selectable",
      sourceType: "html_paste",
      qualityStatus: "paste_qa_pass",
      distribution: { ...baseDistribution, userSelectable: true },
      hasCurrentVersion: true,
    });
    expect(result.eligible).toBe(false);
    expect(result.blockedReasons.some((reason) => reason.includes("already user-selectable"))).toBe(
      true,
    );
  });

  it("blocks missing current version", () => {
    const result = evaluateCandidatePromoteEligibility({
      lifecycle: "candidate",
      sourceType: "html_paste",
      qualityStatus: "paste_qa_pass",
      distribution: baseDistribution,
      hasCurrentVersion: false,
    });
    expect(result.eligible).toBe(false);
    expect(result.blockedReasons.some((reason) => reason.includes("current version"))).toBe(true);
  });
});
