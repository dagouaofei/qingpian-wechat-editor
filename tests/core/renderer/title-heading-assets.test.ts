import { describe, expect, it } from "vitest";

import {
  isHeadingPublishVariantId,
  titleHeadingUsesCardTitleFrame,
  titleHeadingUsesIconDecorLayout,
} from "@/core/renderer/title-heading-assets";
import { HEADING_PUBLISH_VARIANT_IDS } from "@/core/styles/variants/heading-publish-pool";

describe("title-heading-assets publish pool", () => {
  it("recognizes all publish heading variant ids", () => {
    for (const id of HEADING_PUBLISH_VARIANT_IDS) {
      expect(isHeadingPublishVariantId(id)).toBe(true);
    }
    expect(isHeadingPublishVariantId("heading_plain_minimal")).toBe(false);
  });

  it("card title frame only for plain title (heading publish avoids card bg)", () => {
    expect(titleHeadingUsesCardTitleFrame("title_plain_minimal")).toBe(true);
    expect(titleHeadingUsesCardTitleFrame("heading_card_centered")).toBe(false);
    expect(titleHeadingUsesCardTitleFrame("heading_short_line")).toBe(false);
  });

  it("icon decor layout for title bars and heading icon prefix", () => {
    expect(titleHeadingUsesIconDecorLayout("title_left_bar_classic")).toBe(true);
    expect(titleHeadingUsesIconDecorLayout("heading_icon_prefix")).toBe(true);
    expect(titleHeadingUsesIconDecorLayout("heading_short_line")).toBe(false);
  });
});
