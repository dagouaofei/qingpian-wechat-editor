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
  it("admin_inspection keeps source number color", () => {
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

    expect(inspection.ok).toBe(true);
    if (!inspection.ok) return;

    expect(inspection.html).toMatch(/rgb\(41,\s*50,\s*225\)/i);
  });

  it("preview remaps inline number color to theme textAccent", () => {
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

    const blue = decodeVariantDsl({
      article,
      block,
      variantDsl: encoded.value,
      target: "preview",
      themePalette: PREVIEW_COLOR_PALETTES.businessBlue.tokens,
    });
    const orange = decodeVariantDsl({
      article,
      block,
      variantDsl: encoded.value,
      target: "preview",
      themePalette: PREVIEW_COLOR_PALETTES.creamOrange.tokens,
    });

    expect(blue.ok).toBe(true);
    expect(orange.ok).toBe(true);
    if (!blue.ok || !orange.ok) return;

    expect(blue.html).toContain("#2563eb");
    expect(orange.html).toContain("#ea580c");
    expect(blue.html).not.toMatch(/rgb\(41,\s*50,\s*225\)/i);
    expect(orange.html).not.toMatch(/rgb\(41,\s*50,\s*225\)/i);
    expect(blue.html).not.toBe(orange.html);
  });
});
