import { describe, expect, it } from "vitest";

import { encodeHtmlToVariantDsl } from "@/core/dsl/encoder";
import {
  extractHeadingSemanticsFromHtml,
  buildSemanticHeadingTree,
} from "@/core/dsl/encoder/heading-semantic-extractor";
import { decodeVariantDsl } from "@/core/dsl/decoder";
import { COMPLEX_HEADING_HTML } from "../../../fixtures/dsl/complex-heading-html";

describe("heading semantic extractor", () => {
  it("extracts chapter heading semantic slots from complex HTML", () => {
    const result = extractHeadingSemanticsFromHtml(COMPLEX_HEADING_HTML);
    expect(result.slots.eyebrow).toBe("CHAPTER 03");
    expect(result.slots.number).toBe("03");
    expect(result.slots.title).toBe("怎么用");
    expect(result.slots.subtitle).toBe("HOW TO · 使用指南");
    expect(result.layoutIntent).toBe("chapter_overlay_heading");
  });

  it("records flex, negative margin, and nesting in lossReport", () => {
    const result = extractHeadingSemanticsFromHtml(COMPLEX_HEADING_HTML);
    const messages = result.lossReport.map((entry) => entry.message.toLowerCase()).join(" ");
    expect(messages).toMatch(/flex/);
    expect(messages).toMatch(/negative margin/);
    expect(messages).toMatch(/nesting/);
  });

  it("unwraps leaf span and removes empty br", () => {
    const html = `<span leaf=""><br></span><strong style="font-size:30px;">标题</strong>`;
    const result = extractHeadingSemanticsFromHtml(html);
    expect(result.lossReport.some((e) => e.code === "leaf_span_unwrapped" || e.code === "empty_br_removed")).toBe(
      true,
    );
    expect(result.slots.title).toBe("标题");
  });

  it("builds shallow normalized tree without deep original DOM nesting", () => {
    const extraction = extractHeadingSemanticsFromHtml(COMPLEX_HEADING_HTML);
    const tree = buildSemanticHeadingTree(extraction);
    const serialized = JSON.stringify(tree);
    expect(serialized).not.toContain("display:flex");
    expect(serialized).not.toContain("margin-top:-60px");
    expect((tree.children ?? []).length).toBeLessThanOrEqual(3);
  });

  it("encodes complex heading to decodable preview and copy DSL", () => {
    const encoded = encodeHtmlToVariantDsl({
      html: COMPLEX_HEADING_HTML,
      runtimeVariantId: "heading_html_paste_test_candidate",
      blockType: "heading",
      label: "Complex heading",
    });
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;

    const article = {
      id: "a1",
      title: "t",
      blocks: [{ id: "b1", type: "heading" as const, content: { text: "怎么用", level: 2 } }],
      meta: {},
    };
    const block = article.blocks[0]!;

    const preview = decodeVariantDsl({
      article,
      block,
      variantDsl: encoded.value,
      target: "preview",
    });
    const copy = decodeVariantDsl({
      article,
      block,
      variantDsl: encoded.value,
      target: "copy_wechat",
    });

    expect(preview.ok).toBe(true);
    expect(copy.ok).toBe(true);
    expect(preview.trace?.decoderPath).toBe("tree");
    expect(preview.trace?.rendered ?? Boolean(preview.output)).toBe(true);
    expect(copy.html?.length ?? 0).toBeGreaterThan(0);
  });
});
