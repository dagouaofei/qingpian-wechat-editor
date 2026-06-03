import { describe, expect, it } from "vitest";

import { buildStyleFidelityPageData } from "@/lib/style-fidelity-debug";

const EXPECTED_BLOCK_TYPES = [
  "title",
  "lead",
  "heading",
  "paragraph",
  "list",
  "quote",
  "highlight",
  "info_card",
  "divider",
  "image_placeholder",
  "cta",
] as const;

describe("buildStyleFidelityPageData", () => {
  it("r1-golden-default-article yields preview blocks for all core types", () => {
    const data = buildStyleFidelityPageData("r1-golden-default-article");

    expect(data.presetId).toBe("business");
    expect(data.themeId).toBe("businessBlue");
    expect(data.previewBlockCount).toBeGreaterThanOrEqual(11);
    expect(data.previewBlocks.length).toBe(data.previewBlockCount);

    const previewTypes = new Set(data.previewBlocks.map((b) => b.blockType));
    for (const blockType of EXPECTED_BLOCK_TYPES) {
      expect(previewTypes.has(blockType)).toBe(true);
    }

    expect(data.copyHtml.length).toBeGreaterThan(200);
    expect(data.copySafe).toBe(true);
  });
});
