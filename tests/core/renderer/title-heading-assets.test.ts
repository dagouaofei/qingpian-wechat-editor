import { describe, expect, it } from "vitest";

import {
  TITLE_HEADING_ICON_ASSET_BY_VARIANT,
  resolveTitleHeadingIconAssetId,
  resolveTitleHeadingIconGlyph,
  titleHeadingUsesCardTitleFrame,
} from "@/core/renderer/title-heading-assets";

describe("title-heading-assets", () => {
  it("maps each first-wave variant to a builtin icon asset", () => {
    for (const variantId of Object.keys(TITLE_HEADING_ICON_ASSET_BY_VARIANT)) {
      const assetId = resolveTitleHeadingIconAssetId(variantId, "title", "plain");
      expect(assetId.length).toBeGreaterThan(0);
      expect(resolveTitleHeadingIconGlyph(assetId).glyph.length).toBeGreaterThan(0);
    }
  });

  it("flags cardTitle frame variants", () => {
    expect(titleHeadingUsesCardTitleFrame("title_plain_minimal")).toBe(true);
    expect(titleHeadingUsesCardTitleFrame("heading_top_badge_topic")).toBe(true);
    expect(titleHeadingUsesCardTitleFrame("heading_plain_minimal")).toBe(false);
  });
});
