import { describe, expect, it } from "vitest";

import {
  HEADING_HIGHLIGHT_MARKER_WAIVER,
  WECHAT_SAFE_CONTRACT_VERSION_ID,
  WECHAT_SAFE_CONTRACT_V1_PROFILE,
  classifyHtmlTag,
  findYellowWaiverForVariant,
  getCssFallbackPolicyById,
  isHtmlTagAllowedForCopy,
  listHtmlTagsByLevel,
} from "@/core/wechat-compat";

describe("wechat-safe-contract-v1 profile", () => {
  it("exposes profileId vs contractVersionId", () => {
    expect(WECHAT_SAFE_CONTRACT_V1_PROFILE.id).toBe("wechat-mp-editor-v1");
    expect(WECHAT_SAFE_CONTRACT_V1_PROFILE.contractVersionId).toBe(
      WECHAT_SAFE_CONTRACT_VERSION_ID,
    );
    expect(WECHAT_SAFE_CONTRACT_V1_PROFILE.contractVersionId).toBe(
      "wechat-safe-contract-v1",
    );
    expect(WECHAT_SAFE_CONTRACT_V1_PROFILE.dom.maxNestingDepth).toBe(3);
    expect(WECHAT_SAFE_CONTRACT_V1_PROFILE.dom.clipboardStripClassAttributes).toBe(
      true,
    );
  });

  it("classifies html tags per contract", () => {
    expect(classifyHtmlTag("p").level).toBe("green");
    expect(classifyHtmlTag("section").level).toBe("yellow");
    expect(classifyHtmlTag("script").level).toBe("red");
    expect(isHtmlTagAllowedForCopy("svg")).toBe(false);
  });

  it("lists green tags", () => {
    expect(listHtmlTagsByLevel("green")).toContain("h3");
    expect(listHtmlTagsByLevel("red")).toContain("svg");
  });

  it("registers non-transferable heading_highlight_marker waiver", () => {
    const waiver = findYellowWaiverForVariant("heading_highlight_marker", "heading");
    expect(waiver?.evidenceId).toBe(HEADING_HIGHLIGHT_MARKER_WAIVER.evidenceId);
    expect(waiver?.nonTransferable).toBe(true);
    expect(waiver?.cssCapabilities).toContain("linear-gradient");
  });

  it("provides fallback policies for yellow capabilities", () => {
    expect(getCssFallbackPolicyById("fallback-linear-gradient")).toMatchObject({
      fallbackTargets: expect.arrayContaining(["background-color"]),
    });
  });
});
