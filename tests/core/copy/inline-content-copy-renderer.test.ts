import { describe, expect, it } from "vitest";

import { escapeHtml } from "@/core/copy/html-escape";
import { renderInlineContentToCopyHtml } from "@/core/copy/inline-content-html";
import {
  resolveInlineMarkColor,
  resolveInlineMarkLink,
} from "@/core/renderer/inline-content-marks";
import { MARKS_FIXTURE } from "../../fixtures/renderer/lead-paragraph-articles";

describe("inline content copy renderer", () => {
  const themeTokens = {
    color: { "text.default": "#333333", "text.accent": "#576b95" },
  };

  it("renders bold / italic / highlight / color / link marks", () => {
    const { html, warnings } = renderInlineContentToCopyHtml({
      content: MARKS_FIXTURE,
      themeTokens,
      defaultColor: "#333333",
      blockId: "block-1",
      blockType: "paragraph",
      variantId: "paragraph_plain_body",
    });

    expect(warnings).toEqual([]);
    expect(html).toContain("font-weight:bold");
    expect(html).toContain("font-style:italic");
    expect(html).toContain("background-color:#fff3cd");
    expect(html).toContain("color:#576b95");
    expect(html).toContain('href="https://example.com/article"');
  });

  it("falls back unsafe color with warning", () => {
    const resolved = resolveInlineMarkColor({
      colorInput: "not-a-color",
      themeTokens,
      defaultColor: "#333333",
      blockId: "block-1",
      blockType: "paragraph",
      variantId: "paragraph_plain_body",
    });

    expect(resolved.state).toBe("fallback");
    expect(resolved.cssColor).toBe("#333333");
    expect(resolved.issue?.code).toBe("unsafe_inline_color");
  });

  it("strips unsafe href with warning", () => {
    const resolved = resolveInlineMarkLink({
      href: "javascript:alert(1)",
      blockId: "block-1",
      blockType: "paragraph",
      variantId: "paragraph_plain_body",
    });

    expect(resolved.state).toBe("stripped");
    expect(resolved.issue?.code).toBe("unsafe_link_href");
  });

  it("escapes text in copy html", () => {
    const { html } = renderInlineContentToCopyHtml({
      content: [{ text: `Tom & Jerry "引号"` }],
      themeTokens,
      defaultColor: "#333333",
      blockId: "block-1",
      blockType: "lead",
      variantId: "lead_plain_intro",
    });

    expect(html).toContain(escapeHtml(`Tom & Jerry "引号"`));
    expect(html).toContain("&amp;");
  });

  it("does not output class attributes", () => {
    const { html } = renderInlineContentToCopyHtml({
      content: MARKS_FIXTURE,
      themeTokens,
      defaultColor: "#333333",
      blockId: "block-1",
      blockType: "paragraph",
      variantId: "paragraph_plain_body",
    });

    expect(html).not.toMatch(/\bclass\s*=/);
    expect(html).not.toMatch(/<style[\s>]/i);
  });
});
