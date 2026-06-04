import { describe, expect, it } from "vitest";

import {
  createFirstWaveRequiredVariantRegistry,
  isCardEmphasisVariantId,
  parseStyleRegistry,
} from "@/core/styles";

describe("card rhythm helpers", () => {
  const registry = parseStyleRegistry(createFirstWaveRequiredVariantRegistry());

  it("detects card-emphasis variant ids", () => {
    expect(isCardEmphasisVariantId(registry, "paragraph", "paragraph_soft_card")).toBe(
      true,
    );
    expect(isCardEmphasisVariantId(registry, "paragraph", "paragraph_plain_body")).toBe(
      false,
    );
    expect(isCardEmphasisVariantId(registry, "info_card", "info_card_steps")).toBe(true);
  });
});
