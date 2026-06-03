import { describe, expect, it } from "vitest";

import { formatFontFamilyForInlineStyle } from "@/core/copy/copy-typography";
import { buildInlineStyle } from "@/core/copy/inline-style";

describe("copy typography", () => {
  it("formats font stacks with single-quoted names for style attributes", () => {
    const formatted = formatFontFamilyForInlineStyle(
      '"PingFang SC", "Microsoft YaHei", sans-serif',
    );
    expect(formatted).toBe("'PingFang SC', 'Microsoft YaHei', sans-serif");
    expect(formatted).not.toContain('"');
  });

  it("buildInlineStyle does not break double-quoted style attributes", () => {
    const style = buildInlineStyle({
      fontFamily: '"PingFang SC", Arial, sans-serif',
      fontSize: "16px",
      color: "#333333",
    });
    const html = `<p style="${style}">x</p>`;
    expect(html).toContain("font-family:'PingFang SC', Arial, sans-serif");
    expect(html).not.toMatch(/style="[^"]*font-family:"/);
  });
});
