import { describe, expect, it } from "vitest";

import { decodeVariantDsl } from "@/core/dsl/decoder";
import { encodeHtmlToVariantDsl } from "@/core/dsl/encoder";
import { PREVIEW_COLOR_PALETTES } from "@/lib/preview-color-palette";
import {
  dslRuntimeTraceFixtureArticle,
  pickTraceFixtureBlock,
} from "@/lib/dsl-runtime/trace-fixture-article";

const RUNTIME_VARIANT_ID = "heading_html_paste_49b0ec2b_candidate";

/** Inline section-label number + title (49b0ec2b shape) */
const INLINE_NUMBER_HEADING_HTML = `<section style="text-align: left; display: flex; flex-flow: row; margin: 0px"><section style="display: inline-block; vertical-align: middle"><section style="text-align: justify; color: rgb(41, 50, 225); font-size: 23px; padding: 0px 4px"><p style="white-space: normal; margin: 0px"><strong><span>01</span></strong></p></section></section><section style="display: inline-block; padding-left: 13px"><h2 style="font-size: 18px; color: #333">章节标题</h2></section></section>`;

describe("heading_html_paste_49b0ec2b inline number color", () => {
  it("preview keeps solid accent number color instead of palette bgBand", () => {
    const encoded = encodeHtmlToVariantDsl({
      html: INLINE_NUMBER_HEADING_HTML,
      runtimeVariantId: RUNTIME_VARIANT_ID,
      blockType: "heading",
      wechatCompatibilityMode: "off",
    });
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;

    const article = structuredClone(dslRuntimeTraceFixtureArticle);
    const block = pickTraceFixtureBlock("heading");
    const themePalette = PREVIEW_COLOR_PALETTES.creamOrange.tokens;

    const inspection = decodeVariantDsl({
      article,
      block,
      variantDsl: encoded.value,
      target: "admin_inspection",
      themePalette,
    });
    const preview = decodeVariantDsl({
      article,
      block,
      variantDsl: encoded.value,
      target: "preview",
      themePalette,
    });

    expect(inspection.ok).toBe(true);
    expect(preview.ok).toBe(true);
    if (!inspection.ok || !preview.ok) return;

    expect(inspection.html).toMatch(/rgb\(41,\s*50,\s*225\)/i);
    expect(preview.html).toMatch(/rgb\(41,\s*50,\s*225\)/i);
    expect(preview.html).not.toContain("#fff7ed");
  });
});
