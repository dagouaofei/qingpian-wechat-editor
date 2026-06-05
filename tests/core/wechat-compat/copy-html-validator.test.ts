import { describe, expect, it } from "vitest";

import {
  WECHAT_COPY_ISSUE_CODES,
  WECHAT_SAFE_CONTRACT_VERSION_ID,
  validateWechatCopyHtml,
} from "@/core/wechat-compat";

describe("validateWechatCopyHtml", () => {
  it("passes basic green paragraph", () => {
    const result = validateWechatCopyHtml({
      html: '<p style="font-size:16px;color:#333;line-height:1.8;">正文</p>',
    });
    expect(result.valid).toBe(true);
    expect(result.hasError).toBe(false);
    expect(result.contractVersionId).toBe(WECHAT_SAFE_CONTRACT_VERSION_ID);
    expect(result.profileId).toBe("wechat-mp-editor-v1");
  });

  it("reports red tags", () => {
    expect(
      validateWechatCopyHtml({ html: "<script>alert(1)</script>" }).errors.some(
        (e) => e.code === WECHAT_COPY_ISSUE_CODES.RED_TAG,
      ),
    ).toBe(true);
    expect(
      validateWechatCopyHtml({ html: "<style>.x{}</style>" }).errors.some(
        (e) =>
          e.code === WECHAT_COPY_ISSUE_CODES.STYLE_TAG_FORBIDDEN ||
          e.code === WECHAT_COPY_ISSUE_CODES.RED_TAG,
      ),
    ).toBe(true);
    expect(
      validateWechatCopyHtml({ html: "<svg></svg>" }).errors.some(
        (e) => e.code === WECHAT_COPY_ISSUE_CODES.RED_TAG,
      ),
    ).toBe(true);
  });

  it("forbids class attribute", () => {
    const result = validateWechatCopyHtml({
      html: '<p class="x" style="font-size:16px;">text</p>',
    });
    expect(result.valid).toBe(false);
    expect(
      result.errors.some(
        (e) => e.code === WECHAT_COPY_ISSUE_CODES.CLASS_ATTRIBUTE_FORBIDDEN,
      ),
    ).toBe(true);
  });

  it("warns on yellow tags", () => {
    const section = validateWechatCopyHtml({
      html: '<section style="margin:0;">text</section>',
    });
    expect(section.warnings.some((e) => e.code === WECHAT_COPY_ISSUE_CODES.YELLOW_TAG)).toBe(
      true,
    );
    expect(section.valid).toBe(true);

    const table = validateWechatCopyHtml({
      html: "<table><tr><td style=\"padding:8px;\">text</td></tr></table>",
    });
    expect(table.warnings.some((e) => e.code === WECHAT_COPY_ISSUE_CODES.YELLOW_TAG)).toBe(
      true,
    );
  });

  it("validates green CSS declarations", () => {
    for (const decl of [
      "display:block",
      "display:inline-block",
      "box-sizing:border-box",
    ]) {
      const result = validateWechatCopyHtml({
        html: `<p style="${decl};font-size:16px;color:#333;">t</p>`,
      });
      expect(result.errors.filter((e) => e.property?.startsWith("display") || e.property === "box-sizing")).toHaveLength(0);
    }
    const width = validateWechatCopyHtml({
      html: '<p style="width:100%;font-size:16px;">t</p>',
    });
    expect(width.valid).toBe(true);
  });

  it("warns on yellow CSS without waiver", () => {
    expect(
      validateWechatCopyHtml({
        html: '<p style="border-radius:8px;font-size:16px;">t</p>',
      }).warnings.some(
        (e) => e.code === WECHAT_COPY_ISSUE_CODES.YELLOW_CSS_WITHOUT_WAIVER,
      ),
    ).toBe(true);
    expect(
      validateWechatCopyHtml({
        html: '<p style="box-shadow:0 2px 8px rgba(0,0,0,.1);font-size:16px;">t</p>',
      }).warnings.length,
    ).toBeGreaterThan(0);
    expect(
      validateWechatCopyHtml({
        html: '<p style="background:linear-gradient(180deg,red,blue);font-size:16px;">t</p>',
      }).warnings.some(
        (e) => e.code === WECHAT_COPY_ISSUE_CODES.YELLOW_CSS_WITHOUT_WAIVER,
      ),
    ).toBe(true);
  });

  it("errors on red CSS", () => {
    const cases = [
      "display:flex",
      "display:grid",
      "position:absolute",
      "transform:translateX(10px)",
      "color:var(--token)",
      "width:calc(100% - 20px)",
      "font-size:16px !important",
      "unknown-prop:1px",
    ];
    for (const style of cases) {
      const result = validateWechatCopyHtml({
        html: `<p style="${style};color:#333;">t</p>`,
      });
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    }
  });

  it("errors on duplicate CSS properties", () => {
    const result = validateWechatCopyHtml({
      html: '<p style="color:#333;color:#444;font-size:16px;">t</p>',
    });
    expect(
      result.errors.some(
        (e) => e.code === WECHAT_COPY_ISSUE_CODES.DUPLICATE_CSS_PROPERTY,
      ),
    ).toBe(true);
  });

  it("applies heading_highlight_marker waiver as note not warning", () => {
    const ok = validateWechatCopyHtml({
      html: '<h3 style="background:linear-gradient(180deg,transparent,#2563eb33);font-size:16px;">t</h3>',
      blockType: "heading",
      variantId: "heading_highlight_marker",
    });
    expect(
      ok.notes.some((e) => e.code === WECHAT_COPY_ISSUE_CODES.YELLOW_CSS_WITH_WAIVER),
    ).toBe(true);
    expect(
      ok.warnings.filter(
        (e) => e.code === WECHAT_COPY_ISSUE_CODES.YELLOW_CSS_WITHOUT_WAIVER,
      ),
    ).toHaveLength(0);
    expect(ok.valid).toBe(true);

    const quote = validateWechatCopyHtml({
      html: '<p style="background:linear-gradient(180deg,red,blue);font-size:16px;">t</p>',
      blockType: "quote",
      variantId: "any",
    });
    expect(
      quote.warnings.some(
        (e) => e.code === WECHAT_COPY_ISSUE_CODES.YELLOW_CSS_WITHOUT_WAIVER,
      ),
    ).toBe(true);
  });

  it("warns when nesting exceeds max depth", () => {
    const deep =
      "<div><div><div><div><p style=\"font-size:16px;color:#333;\">deep</p></div></div></div></div>";
    const result = validateWechatCopyHtml({ html: deep });
    expect(
      result.warnings.some(
        (e) => e.code === WECHAT_COPY_ISSUE_CODES.MAX_NESTING_DEPTH_EXCEEDED,
      ),
    ).toBe(true);
    expect(result.valid).toBe(true);
  });

  it("aggregates valid / hasWarning / hasError", () => {
    const withWarning = validateWechatCopyHtml({
      html: '<section style="margin:0;font-size:16px;">t</section>',
    });
    expect(withWarning.valid).toBe(true);
    expect(withWarning.hasWarning).toBe(true);
    expect(withWarning.hasError).toBe(false);

    const withError = validateWechatCopyHtml({ html: "<script/>" });
    expect(withError.valid).toBe(false);
    expect(withError.hasError).toBe(true);
  });

  it("reports unknown HTML tags", () => {
    const result = validateWechatCopyHtml({ html: "<foo>bar</foo>" });
    expect(
      result.errors.some((e) => e.code === WECHAT_COPY_ISSUE_CODES.UNKNOWN_TAG),
    ).toBe(true);
  });
});
