import { describe, expect, it } from "vitest";

import { StyleVariantQualityStatus } from "@prisma/client";

import {
  STYLE_VARIANT_QUALITY_STATUSES,
  assertGovernanceSnapshotQualityStatus,
  isStyleVariantQualityStatus,
} from "@/server/style-admin/quality-status-contract";

describe("quality status contract", () => {
  it("matches Prisma StyleVariantQualityStatus enum values", () => {
    expect(STYLE_VARIANT_QUALITY_STATUSES.sort()).toEqual(
      Object.values(StyleVariantQualityStatus).sort(),
    );
    expect(STYLE_VARIANT_QUALITY_STATUSES).toEqual(
      expect.arrayContaining([
        "not_checked",
        "validator_pass",
        "paste_qa_pass",
        "copy_fidelity_failed",
      ]),
    );
  });

  it("rejects unknown qualityStatus with runtimeVariantId and raw value", () => {
    expect(isStyleVariantQualityStatus("paste_qa_pass")).toBe(true);
    expect(isStyleVariantQualityStatus("preview_only")).toBe(false);

    expect(() =>
      assertGovernanceSnapshotQualityStatus("preview_only", "heading_example"),
    ).toThrow(
      "Governance snapshot invalid qualityStatus for heading_example: preview_only",
    );
  });
});
