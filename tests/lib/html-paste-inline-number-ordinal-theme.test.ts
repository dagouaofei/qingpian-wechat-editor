import { describe, expect, it } from "vitest";

import { parseArticle } from "@/core/article";
import { decodeVariantDsl } from "@/core/dsl/decoder";
import { encodeHtmlToVariantDsl } from "@/core/dsl/encoder";
import { renderArticlePreviewClient } from "@/lib/render-article-preview-client";
import { PREVIEW_COLOR_PALETTES } from "@/lib/preview-color-palette";
import type { UserSelectableVariantPoolSnapshot } from "@/lib/user-selectable-variant-pool-types";

import { articleFixtureBase, fixtureBlockId } from "../fixtures/articles/shared";
import { buildDatabaseDslRuntimeFixture } from "../fixtures/dsl/runtime-dsl-snapshot-fixtures";
import {
  styleSelectionArticleFixture,
  styleSelectionNormalizedInput,
} from "../fixtures/generation/style-selection";

/** d26a6370 / 49b0ec2b shape — inline accent number beside title (font-size 23px). */
const INLINE_ACCENT_NUMBER_HEADING_HTML = `<section style="text-align: left; display: flex; flex-flow: row; margin: 0px"><section style="display: inline-block; vertical-align: middle"><section style="text-align: justify; color: rgb(41, 50, 225); font-size: 23px; padding: 0px 4px"><p style="white-space: normal; margin: 0px"><strong><span>01</span></strong></p></section></section><section style="display: inline-block; padding-left: 13px"><h2 style="font-size: 18px; color: #333">章节标题</h2></section></section>`;

/** Second synthetic fixture — flex row with colored 28px number (not d26-specific). */
const SYNTHETIC_FLEX_NUMBER_HEADING_HTML = `<section style="display:flex;align-items:baseline;margin:12px 0"><section style="color:#c026d3;font-size:28px;font-weight:bold;line-height:1"><span>01</span></section><section style="padding-left:12px"><h3 style="margin:0;font-size:18px;color:#111">合成章节标题</h3></section></section>`;

const D26_LIKE_VARIANT_ID = "heading_html_paste_d26a6370_candidate";
const SYNTHETIC_VARIANT_ID = "heading_html_paste_synthetic_flex_number_candidate";

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

function buildMultiHeadingArticle(runtimeVariantId: string) {
  const h1 = fixtureBlockId(1);
  const h2 = fixtureBlockId(3);
  const h3 = fixtureBlockId(4);
  return parseArticle({
    ...articleFixtureBase(),
    styleAssignment: {
      themeId: "businessBlue",
      presetId: "business",
      blockOverrides: [
        { blockId: h1, variantId: runtimeVariantId },
        { blockId: h2, variantId: runtimeVariantId },
        { blockId: h3, variantId: runtimeVariantId },
      ],
    },
    blocks: [
      { id: h1, type: "heading", content: { text: "第一节", level: 2 } },
      { id: fixtureBlockId(2), type: "paragraph", content: { text: [{ text: "段落" }] } },
      { id: h2, type: "heading", content: { text: "第二节", level: 2 } },
      { id: h3, type: "heading", content: { text: "第三节", level: 2 } },
    ],
  });
}

function encodeHeading(html: string, runtimeVariantId: string) {
  const encoded = encodeHtmlToVariantDsl({
    html,
    runtimeVariantId,
    blockType: "heading",
    wechatCompatibilityMode: "off",
  });
  expect(encoded.ok).toBe(true);
  if (!encoded.ok) {
    throw new Error("encode failed");
  }
  return encoded.value;
}

function withStaleNumberPath<T extends { meta?: Record<string, unknown> }>(
  dsl: T,
  stalePath: string,
): T {
  const bindings = (dsl.meta?.semanticBindings ?? {}) as Record<
    string,
    { path?: string; text?: string; tag?: string }
  >;
  return {
    ...dsl,
    meta: {
      ...dsl.meta,
      semanticBindings: {
        ...bindings,
        number: {
          ...(bindings.number ?? { text: "01", tag: "section" }),
          path: stalePath,
        },
      },
    },
  };
}

function extractHeadingNumbersFromHtml(html: string): string[] {
  return [...html.matchAll(/>(\d{2})</g)].map((match) => match[1]!);
}

describe("html paste inline number ordinal + theme (d26-like)", () => {
  it("increments 01/02/03 in preview and copy for d26-like inline accent variant", () => {
    const dsl = encodeHeading(INLINE_ACCENT_NUMBER_HEADING_HTML, D26_LIKE_VARIANT_ID);
    const article = buildMultiHeadingArticle(D26_LIKE_VARIANT_ID);
    const dslRuntime = buildDatabaseDslRuntimeFixture({ [D26_LIKE_VARIANT_ID]: dsl });

    const rendered = renderArticlePreviewClient(
      article,
      styleSelectionNormalizedInput,
      {
        articleStyle: "business",
        colorPalette: "businessBlue",
        headingVariantId: D26_LIKE_VARIANT_ID,
      },
      {
        userSelectablePool: buildPool(D26_LIKE_VARIANT_ID, dsl),
        dslRuntime,
      },
    );

    const previewNumbers = rendered.previewBlocks
      .filter((entry) => entry.blockType === "heading" && entry.ok)
      .flatMap((entry) =>
        entry.ok && entry.output?.kind === "dsl_tree_html_preview"
          ? extractHeadingNumbersFromHtml(entry.output.html)
          : [],
      );

    expect(previewNumbers).toEqual(["01", "02", "03"]);
    expect(extractHeadingNumbersFromHtml(rendered.clipboard.textHtml)).toEqual([
      "01",
      "02",
      "03",
    ]);
  });

  it("recovers dynamic numbering when stored number path is stale but infer finds inline number", () => {
    const dsl = withStaleNumberPath(
      encodeHeading(INLINE_ACCENT_NUMBER_HEADING_HTML, D26_LIKE_VARIANT_ID),
      "tree.children[99].children[0]",
    );
    const article = buildMultiHeadingArticle(D26_LIKE_VARIANT_ID);

    const numbers: string[] = [];
    for (const block of article.blocks.filter((entry) => entry.type === "heading")) {
      const decoded = decodeVariantDsl({
        article,
        block,
        variantDsl: dsl,
        target: "preview",
        themePalette: PREVIEW_COLOR_PALETTES.businessBlue.tokens,
      });
      expect(decoded.ok, JSON.stringify(decoded.issues)).toBe(true);
      expect(decoded.substitutionTrace?.substitutedNumber).toBeTruthy();
      numbers.push(decoded.substitutionTrace!.substitutedNumber!);
      expect(decoded.issues).not.toContain("fidelity_number_substitution_failed");
    }

    expect(numbers).toEqual(["01", "02", "03"]);
  });

  it("remaps number color to theme textAccent and removes source rgb for preview and copy", () => {
    const dsl = encodeHeading(INLINE_ACCENT_NUMBER_HEADING_HTML, D26_LIKE_VARIANT_ID);
    const article = structuredClone(styleSelectionArticleFixture);
    const block = article.blocks.find((entry) => entry.type === "heading")!;

    const bluePreview = decodeVariantDsl({
      article,
      block,
      variantDsl: dsl,
      target: "preview",
      themePalette: PREVIEW_COLOR_PALETTES.businessBlue.tokens,
    });
    const orangeCopy = decodeVariantDsl({
      article,
      block,
      variantDsl: dsl,
      target: "copy_wechat",
      themePalette: PREVIEW_COLOR_PALETTES.creamOrange.tokens,
    });

    expect(bluePreview.ok).toBe(true);
    expect(orangeCopy.ok).toBe(true);
    if (!bluePreview.ok || !orangeCopy.ok) return;

    expect(bluePreview.html).toContain(PREVIEW_COLOR_PALETTES.businessBlue.tokens.textAccent);
    expect(orangeCopy.html).toContain(PREVIEW_COLOR_PALETTES.creamOrange.tokens.textAccent);
    expect(bluePreview.html).not.toMatch(/rgb\(41,\s*50,\s*225\)/i);
    expect(orangeCopy.html).not.toMatch(/rgb\(41,\s*50,\s*225\)/i);
  });

  it("remaps number color with stale stored path via inferred binding path", () => {
    const dsl = withStaleNumberPath(
      encodeHeading(INLINE_ACCENT_NUMBER_HEADING_HTML, D26_LIKE_VARIANT_ID),
      "tree.children[99].children[0]",
    );
    const article = structuredClone(styleSelectionArticleFixture);
    const block = article.blocks.find((entry) => entry.type === "heading")!;

    const decoded = decodeVariantDsl({
      article,
      block,
      variantDsl: dsl,
      target: "preview",
      themePalette: PREVIEW_COLOR_PALETTES.businessBlue.tokens,
    });

    expect(decoded.ok).toBe(true);
    if (!decoded.ok) return;
    expect(decoded.html).toContain(PREVIEW_COLOR_PALETTES.businessBlue.tokens.textAccent);
    expect(decoded.html).not.toMatch(/rgb\(41,\s*50,\s*225\)/i);
  });

  it("preview and copy parity for number text and theme color", () => {
    const dsl = encodeHeading(INLINE_ACCENT_NUMBER_HEADING_HTML, D26_LIKE_VARIANT_ID);
    const article = buildMultiHeadingArticle(D26_LIKE_VARIANT_ID);
    const palette = PREVIEW_COLOR_PALETTES.businessBlue.tokens;

    for (const block of article.blocks.filter((entry) => entry.type === "heading")) {
      const preview = decodeVariantDsl({
        article,
        block,
        variantDsl: dsl,
        target: "preview",
        themePalette: palette,
      });
      const copy = decodeVariantDsl({
        article,
        block,
        variantDsl: dsl,
        target: "copy_wechat",
        themePalette: palette,
      });
      expect(preview.ok && copy.ok).toBe(true);
      if (!preview.ok || !copy.ok) continue;

      const previewNumber = preview.substitutionTrace?.substitutedNumber;
      const copyNumber = copy.substitutionTrace?.substitutedNumber;
      expect(previewNumber).toBe(copyNumber);
      expect(preview.html).toContain(palette.textAccent);
      expect(copy.html).toContain(palette.textAccent);
      expect(previewNumber).toBeTruthy();
      expect(preview.html).toContain(`>${previewNumber}<`);
      expect(copy.html).toContain(`>${copyNumber}<`);
    }
  });

  it("applies the same ordinal + theme rules to a second synthetic flex-number fixture", () => {
    const dsl = withStaleNumberPath(
      encodeHeading(SYNTHETIC_FLEX_NUMBER_HEADING_HTML, SYNTHETIC_VARIANT_ID),
      "tree.children[50].children[0]",
    );
    const article = buildMultiHeadingArticle(SYNTHETIC_VARIANT_ID);

    const numbers: string[] = [];
    for (const block of article.blocks.filter((entry) => entry.type === "heading")) {
      const decoded = decodeVariantDsl({
        article,
        block,
        variantDsl: dsl,
        target: "preview",
        themePalette: PREVIEW_COLOR_PALETTES.creamOrange.tokens,
      });
      expect(decoded.ok, JSON.stringify(decoded.issues)).toBe(true);
      numbers.push(decoded.substitutionTrace?.substitutedNumber ?? "");
      expect(decoded.html).toContain(PREVIEW_COLOR_PALETTES.creamOrange.tokens.textAccent);
      expect(decoded.html).not.toContain("#c026d3");
    }

    expect(numbers).toEqual(["01", "02", "03"]);
  });
});
