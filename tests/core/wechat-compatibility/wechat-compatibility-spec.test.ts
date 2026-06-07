import { describe, expect, it } from "vitest";

import {
  getWechatCompatibilityPromptRules,
  normalizeAndValidateWechatHtml,
  transformHtmlToWechatCompatible,
} from "@/core/wechat-compatibility";

describe("WeChat Compatibility Spec", () => {
  it("removes script tags and event handlers", () => {
    const html = `<section onclick="alert(1)"><script>alert(1)</script><span>ok</span></section>`;
    const result = transformHtmlToWechatCompatible(html);
    expect(result.html).not.toContain("<script");
    expect(result.html).not.toContain("onclick");
    expect(result.html).toContain("ok");
  });

  it("exports prompt rules for future AI DSL generation", () => {
    const rules = getWechatCompatibilityPromptRules();
    expect(rules.length).toBeGreaterThan(0);
    expect(rules.join(" ")).toContain("Allowed tags");
  });

  it("validates normalized HTML", () => {
    const { validation } = normalizeAndValidateWechatHtml(
      `<section style="padding:8px 0;border-left:4px solid #1677ff;"><span style="font-size:18px;">标题</span></section>`,
    );
    expect(validation.valid).toBe(true);
  });
});
