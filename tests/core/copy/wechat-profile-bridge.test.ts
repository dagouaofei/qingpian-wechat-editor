import { describe, expect, it } from "vitest";

import {
  WECHAT_PROFILE_DOC_FIELD_BRIDGE,
  mapWeChatProfileDocFieldToCodePath,
} from "@/core/copy";

describe("wechat profile doc field bridge", () => {
  it("maps doc field names to code profile paths", () => {
    expect(mapWeChatProfileDocFieldToCodePath("allowedCssProperties")).toBe(
      "cssRules.allowed",
    );
    expect(mapWeChatProfileDocFieldToCodePath("riskyCssProperties")).toBe(
      "cssRules.risky",
    );
    expect(mapWeChatProfileDocFieldToCodePath("forbiddenCssProperties")).toBe(
      "cssRules.forbidden",
    );
  });

  it("documents all bridged fields", () => {
    expect(Object.keys(WECHAT_PROFILE_DOC_FIELD_BRIDGE)).toEqual([
      "allowedCssProperties",
      "riskyCssProperties",
      "forbiddenCssProperties",
    ]);
  });
});
