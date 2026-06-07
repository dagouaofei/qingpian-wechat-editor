import { describe, expect, it } from "vitest";

import { encodeHtmlToVariantDsl } from "@/core/dsl/encoder";
import { VARIANT_DSL_VERSION } from "@/core/dsl/runtime";

describe("encodeHtmlToVariantDsl", () => {
  it("encodes heading HTML to Variant DSL tree", () => {
    const html = `<section style="padding: 8px 0; border-left: 4px solid #1677ff;">
  <span style="font-size: 18px; font-weight: 700; color: #111;">测试小标题</span>
</section>`;

    const result = encodeHtmlToVariantDsl({
      html,
      runtimeVariantId: "heading_html_paste_abcdef01_candidate",
      blockType: "heading",
      label: "测试",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.version).toBe(VARIANT_DSL_VERSION);
      expect(result.value.tree?.type).toBe("element");
      expect(result.value.blockType).toBe("heading");
    }
  });

  it("encodes info_card HTML to Variant DSL", () => {
    const html = `<section style="padding:16px;background:#f7f8fa;border:1px solid #e5e7eb;">
  <strong>标题</strong><p>正文内容</p>
</section>`;

    const result = encodeHtmlToVariantDsl({
      html,
      runtimeVariantId: "info_card_html_paste_abcdef01_candidate",
      blockType: "info_card",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.blockType).toBe("info_card");
      expect(result.value.tree).toBeTruthy();
    }
  });
});
