import { describe, expect, it } from "vitest";

import { encodeHtmlToVariantDsl } from "@/core/dsl/encoder";
import { renderArticlePreviewClient } from "@/lib/render-article-preview-client";
import type { UserSelectableVariantPoolSnapshot } from "@/lib/user-selectable-variant-pool-types";

import { BACKGROUND_NUMBER_HEADING_HTML } from "../fixtures/dsl/background-number-heading-html";
import { BORDERED_HEADING_HTML } from "../fixtures/dsl/bordered-heading-html";
import { COMPLEX_HEADING_HTML } from "../fixtures/dsl/complex-heading-html";
import { buildDatabaseDslRuntimeFixture } from "../fixtures/dsl/runtime-dsl-snapshot-fixtures";
import {
  styleSelectionArticleFixture,
  styleSelectionNormalizedInput,
} from "../fixtures/generation/style-selection";

const ARTICLE_HEADING = "春季敏感肌的饮食和生活习惯";

function buildPool(
  runtimeVariantId: string,
  definitionJson: unknown,
): UserSelectableVariantPoolSnapshot {
  return {
    source: "database",
    cache: { hit: false, ttlSeconds: 300, generatedAt: new Date().toISOString() },
    variants: [
      {
        id: runtimeVariantId,
        schemaVersion: "1.0",
        blockType: "heading",
        family: "htmlPaste",
        name: runtimeVariantId,
        label: runtimeVariantId,
        status: "experimental",
      },
    ],
    poolVariantIds: [runtimeVariantId],
    definitionJsonByVariantId: { [runtimeVariantId]: definitionJson },
    issues: [],
  };
}

function renderHeadingPreview(html: string, runtimeVariantId: string) {
  const encoded = encodeHtmlToVariantDsl({
    html,
    runtimeVariantId,
    blockType: "heading",
    wechatCompatibilityMode: "off",
  });
  expect(encoded.ok).toBe(true);
  if (!encoded.ok) throw new Error("encode failed");

  const article = structuredClone(styleSelectionArticleFixture);
  const heading = article.blocks.find((block) => block.type === "heading")!;
  (heading.content as { text: string }).text = ARTICLE_HEADING;

  const dslRuntime = buildDatabaseDslRuntimeFixture({
    [runtimeVariantId]: encoded.value,
  });

  const rendered = renderArticlePreviewClient(
    article,
    styleSelectionNormalizedInput,
    {
      articleStyle: "business",
      colorPalette: "businessBlue",
      headingVariantId: runtimeVariantId,
    },
    { userSelectablePool: buildPool(runtimeVariantId, encoded.value), dslRuntime },
  );

  const block = rendered.previewBlocks.find((entry) => entry.blockType === "heading");
  expect(block?.ok).toBe(true);
  if (!block?.ok || block.output?.kind !== "dsl_tree_html_preview") {
    throw new Error("expected dsl_tree_html_preview");
  }

  return { encoded: encoded.value, output: block.output, html: block.output.html };
}

describe("fidelity heading user preview substitution", () => {
  it("background number heading preserves 01 and substitutes article title at h2 binding", () => {
    const runtimeVariantId = "heading_html_paste_4933bb91_candidate";
    const { encoded, output, html } = renderHeadingPreview(
      BACKGROUND_NUMBER_HEADING_HTML,
      runtimeVariantId,
    );

    expect(html).toContain("01");
    expect(html).toContain(ARTICLE_HEADING);
    expect(html).not.toContain("一、生产力暴击");
    expect(html).toMatch(/font-size\s*:\s*84px/i);
    expect(html).toMatch(/color\s*:\s*#f0f0f0/i);
    expect(html).toMatch(/font-size\s*:\s*24px/i);
    expect(html).toMatch(/color\s*:\s*#111/i);
    expect(html).toMatch(/background-color\s*:\s*#E60012/i);
    expect(html).not.toMatch(/border-left\s*:\s*4px\s+solid\s+#1677ff/i);

    const bindings = encoded.meta?.semanticBindings as Record<string, { path: string }>;
    expect(output.runtimeTrace?.slotSubstitutionPath).toBe("meta.semanticBindings.title");
    expect(output.runtimeTrace?.slotSubstitutionTargetPath).toBe(bindings.title.path);
    expect(output.runtimeTrace?.substitutedSlot).toBe("title");
    expect(output.runtimeTrace?.decorativeSlotsPreserved).toContain("number");
    expect(output.runtimeTrace?.fallbackUsed).toBe(false);
    expect(output.runtimeTrace?.runtimeSource).toBe("database_dsl");
    expect(output.runtimeTrace?.selectedRuntimeVariantId).toBe(runtimeVariantId);
    expect(output.runtimeTrace?.renderedByVariantId).toBe(runtimeVariantId);
  });

  it("does not put article title into number decorative span", () => {
    const { html } = renderHeadingPreview(
      BACKGROUND_NUMBER_HEADING_HTML,
      "heading_bg_number_no_number_swap",
    );

    const numberSpan = html.match(/<span[^>]*font-size:\s*84px[^>]*>[\s\S]*?<\/span>/i)?.[0] ?? "";
    expect(numberSpan).toContain("01");
    expect(numberSpan).not.toContain(ARTICLE_HEADING);
  });

  it("uses semanticBindings.title instead of first text node when number is first", () => {
    const encoded = encodeHtmlToVariantDsl({
      html: BACKGROUND_NUMBER_HEADING_HTML,
      runtimeVariantId: "heading_binding_priority",
      blockType: "heading",
      wechatCompatibilityMode: "off",
    });
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;

    const bindings = encoded.value.meta?.semanticBindings as Record<string, { path: string }>;
    expect(bindings.title.path).toBe("tree.children[1].children[0]");
    expect(bindings.number.path).toBe("tree.children[0].children[0]");
  });

  it("marks fallbackUsed when semantic title binding is missing", () => {
    const runtimeVariantId = "heading_fallback_trace";
    const encoded = encodeHtmlToVariantDsl({
      html: `<section><span style="font-size:18px;color:#111">装饰</span><p style="font-size:20px;color:#222">模板标题</p></section>`,
      runtimeVariantId,
      blockType: "heading",
      wechatCompatibilityMode: "off",
    });
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;

    const dsl = {
      ...encoded.value,
      meta: {
        ...encoded.value.meta,
        semanticBindings: undefined,
        extractedSlots: { title: "模板标题" },
      },
    };

    const article = structuredClone(styleSelectionArticleFixture);
    const heading = article.blocks.find((block) => block.type === "heading")!;
    (heading.content as { text: string }).text = ARTICLE_HEADING;

    const dslRuntime = buildDatabaseDslRuntimeFixture({ [runtimeVariantId]: dsl });
    const rendered = renderArticlePreviewClient(
      article,
      styleSelectionNormalizedInput,
      {
        articleStyle: "business",
        colorPalette: "businessBlue",
        headingVariantId: runtimeVariantId,
      },
      { userSelectablePool: buildPool(runtimeVariantId, dsl), dslRuntime },
    );

    const block = rendered.previewBlocks.find((entry) => entry.blockType === "heading");
    expect(block?.ok).toBe(true);
    if (!block?.ok || block.output?.kind !== "dsl_tree_html_preview") return;

    expect(block.output.runtimeTrace?.fallbackUsed).toBe(true);
    expect(block.output.runtimeTrace?.fallbackReason).toContain("semantic_binding_missing");
    expect(block.output.html).toContain(ARTICLE_HEADING);
  });

  it("bordered heading still substitutes article title on title slot", () => {
    const runtimeVariantId = "heading_bordered_substitution";
    const { html, output } = renderHeadingPreview(BORDERED_HEADING_HTML, runtimeVariantId);

    expect(output.kind).toBe("dsl_tree_html_preview");
    expect(html).toContain(ARTICLE_HEADING);
    expect(html).toMatch(/border-left\s*:\s*4px\s+solid\s+#2563eb/i);
    expect(html).not.toMatch(/border-left\s*:\s*4px\s+solid\s+#1677ff/i);
  });

  it("chapter overlay heading preserves number and substitutes title at binding", () => {
    const runtimeVariantId = "heading_chapter_overlay_substitution";
    const { html, output } = renderHeadingPreview(COMPLEX_HEADING_HTML, runtimeVariantId);

    expect(html).toContain("03");
    expect(html).toContain(ARTICLE_HEADING);
    expect(html).not.toContain("怎么用");
    expect(html).toMatch(/display\s*:\s*flex/i);
    expect(output.runtimeTrace?.fallbackUsed).toBe(false);
    expect(output.runtimeTrace?.decorativeSlotsPreserved).toContain("number");
  });
});
