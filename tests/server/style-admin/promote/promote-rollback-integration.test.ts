import { describe, expect, it } from "vitest";

import { evaluateCandidatePromoteEligibility } from "@/server/style-admin/promote";
import { toDistributionSnapshot } from "@/server/style-admin/mappers";

describe("promote rollback compatibility", () => {
  it("promote distribution before snapshot can be restored by rollback audit pattern", () => {
    const before = {
      userSelectable: false,
      defaultEligible: false,
      release1Required: false,
      hidden: false,
      deprecated: false,
      cacheVersion: 1,
    };
    const after = {
      userSelectable: true,
      defaultEligible: false,
      release1Required: false,
      hidden: false,
      deprecated: false,
      cacheVersion: 2,
    };

    const beforeSnapshot = toDistributionSnapshot(before as never);
    const afterSnapshot = toDistributionSnapshot(after as never);

    expect(beforeSnapshot.userSelectable).toBe(false);
    expect(afterSnapshot.userSelectable).toBe(true);
    expect(afterSnapshot.defaultEligible).toBe(false);
    expect(afterSnapshot.release1Required).toBe(false);
  });

  it("promoted variant with paste_qa_pass remains runtime-available for hide/restore flows", () => {
    const eligibility = evaluateCandidatePromoteEligibility({
      lifecycle: "user_selectable",
      sourceType: "html_paste",
      qualityStatus: "paste_qa_pass",
      distribution: {
        userSelectable: true,
        defaultEligible: false,
        release1Required: false,
        hidden: false,
        deprecated: false,
      },
      hasCurrentVersion: true,
    });
    expect(eligibility.eligible).toBe(false);
    expect(eligibility.blockedReasons.some((reason) => reason.includes("already user-selectable"))).toBe(
      true,
    );
  });
});
