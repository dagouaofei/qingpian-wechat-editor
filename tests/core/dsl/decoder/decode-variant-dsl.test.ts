import { describe, expect, it } from "vitest";

import { parseArticle } from "@/core/article";
import { encodeHtmlToVariantDsl } from "@/core/dsl/encoder";
import { decodeVariantDsl } from "@/core/dsl/decoder";
import { encodeRegistryVariantToDsl } from "@/core/dsl/encoder";
import { headingShortLine } from "@/core/styles/variants/miaopian-heading-variants";
import { minimalArticleFixture } from "../../../fixtures/articles/minimal-article";
import { fixtureBlockId } from "../../../fixtures/articles/shared";

describe("decodeVariantDsl", () => {
  it("decodes heading tree DSL to preview output with title text", () => {
    const html = `<section style="padding: 8px 0; border-left: 4px solid #1677ff;">
  <span style="font-size: 18px; font-weight: 700; color: #111;">这是一个可上线测试小标题</span>
</section>`;
    const encoded = encodeHtmlToVariantDsl({
      html,
      runtimeVariantId: "heading_html_paste_9776cdde_candidate",
      blockType: "heading",
    });
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;

    const article = parseArticle({
      ...minimalArticleFixture,
      styleAssignment: {
        presetId: "business",
        themeId: "businessBlue",
        blockOverrides: [
          { blockId: fixtureBlockId(1), variantId: "heading_html_paste_9776cdde_candidate" },
        ],
      },
      blocks: [
        {
          id: fixtureBlockId(1),
          type: "heading",
          content: { text: "这是一个可上线测试小标题", level: 2 },
        },
      ],
    });

    const result = decodeVariantDsl({
      variantDsl: encoded.value,
      block: article.blocks[0]!,
      article,
      target: "preview",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output?.kind).toBe("title_block_preview");
      if (result.output?.kind === "title_block_preview") {
        expect(result.output.text).toContain("这是一个可上线测试小标题");
      }
    }
  });

  it("decodes registry contract DSL for heading_short_line", () => {
    const encoded = encodeRegistryVariantToDsl(headingShortLine);
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;

    const article = parseArticle({
      ...minimalArticleFixture,
      styleAssignment: {
        presetId: "business",
        themeId: "businessBlue",
        blockOverrides: [{ blockId: fixtureBlockId(1), variantId: headingShortLine.id }],
      },
      blocks: [
        {
          id: fixtureBlockId(1),
          type: "heading",
          content: { text: "短线标题样例", level: 2 },
        },
      ],
    });

    const preview = decodeVariantDsl({
      variantDsl: encoded.value,
      block: article.blocks[0]!,
      article,
      target: "preview",
    });
    const copy = decodeVariantDsl({
      variantDsl: encoded.value,
      block: article.blocks[0]!,
      article,
      target: "copy_wechat",
    });

    expect(preview.ok).toBe(true);
    expect(copy.ok).toBe(true);
  });

  it("returns explicit error for invalid DSL", () => {
    const article = parseArticle({
      ...minimalArticleFixture,
      blocks: [{ id: fixtureBlockId(1), type: "heading", content: { text: "x", level: 2 } }],
    });

    const result = decodeVariantDsl({
      variantDsl: {
        version: "s10.variant-dsl.v1",
        id: "bad",
        blockType: "heading",
        copySafety: "strict",
      },
      block: article.blocks[0]!,
      article,
      target: "preview",
    });

    expect(result.ok).toBe(false);
  });
});
