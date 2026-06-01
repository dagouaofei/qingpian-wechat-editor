import { describe, expect, it } from "vitest";

import { SPRINT4A_TEXT_FIRST_PASTE_QA_SEED } from "@/core/copy";

describe("Sprint 4-A paste QA seed", () => {
  it("keeps all records in Not Run state", () => {
    expect(SPRINT4A_TEXT_FIRST_PASTE_QA_SEED.length).toBeGreaterThanOrEqual(6);
    expect(
      SPRINT4A_TEXT_FIRST_PASTE_QA_SEED.every(
        (record) => record.status === "Not Run",
      ),
    ).toBe(true);
  });

  it("covers representative text-first variants", () => {
    expect(
      SPRINT4A_TEXT_FIRST_PASTE_QA_SEED.map((record) => record.variantId),
    ).toEqual([
      "title_plain_minimal",
      "heading_numbered_section",
      "lead_accent_band",
      "paragraph_soft_card",
      "divider_simple_line",
      "divider_dotted_line",
    ]);
  });

  it("requires manual verification with checkpoints", () => {
    for (const record of SPRINT4A_TEXT_FIRST_PASTE_QA_SEED) {
      expect(record.requiresManualVerification).toBe(true);
      expect(record.expectedCheckpoints.length).toBeGreaterThan(0);
      expect(record.testObject).toBe("text-first-copy-html");
    }
  });
});
