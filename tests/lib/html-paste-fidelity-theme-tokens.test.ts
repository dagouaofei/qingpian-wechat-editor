import { describe, expect, it } from "vitest";

import { decodeVariantDsl } from "@/core/dsl/decoder";
import { encodeHtmlToVariantDsl } from "@/core/dsl/encoder";
import { DEFAULT_THEME_PALETTE } from "@/core/styles/theme-palette-tokens";
import { PREVIEW_COLOR_PALETTES } from "@/lib/preview-color-palette";
import { renderArticlePreviewClient } from "@/lib/render-article-preview-client";
import type { UserSelectableVariantPoolSnapshot } from "@/lib/user-selectable-variant-pool-types";
import {
  dslRuntimeTraceFixtureArticle,
  pickTraceFixtureBlock,
} from "@/lib/dsl-runtime/trace-fixture-article";

import { buildDatabaseDslRuntimeFixture } from "../fixtures/dsl/runtime-dsl-snapshot-fixtures";
import { BACKGROUND_NUMBER_HEADING_HTML } from "../fixtures/dsl/background-number-heading-html";
import { COMPLEX_HEADING_HTML } from "../fixtures/dsl/complex-heading-html";
import {
  styleSelectionArticleFixture,
  styleSelectionNormalizedInput,
} from "../fixtures/generation/style-selection";

const RUNTIME_VARIANT_ID = "heading_html_paste_4933bb91_candidate";
const COMPLEX_VARIANT_ID = "heading_html_paste_64e3b97a_candidate";

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

function renderFidelityHeading(
  html: string,
  runtimeVariantId: string,
  colorPalette: "businessBlue" | "creamOrange",
) {
  const encoded = encodeHtmlToVariantDsl({
    html,
    runtimeVariantId,
    blockType: "heading",
    wechatCompatibilityMode: "off",
  });
  expect(encoded.ok).toBe(true);
  if (!encoded.ok) throw new Error("encode failed");

  const dslRuntime = buildDatabaseDslRuntimeFixture({
    [runtimeVariantId]: encoded.value,
  });

  const rendered = renderArticlePreviewClient(
    styleSelectionArticleFixture,
    styleSelectionNormalizedInput,
    {
      articleStyle: "business",
      colorPalette,
      headingVariantId: runtimeVariantId,
    },
    { userSelectablePool: buildPool(runtimeVariantId, encoded.value), dslRuntime },
  );

  const headingBlock = rendered.previewBlocks.find((entry) => entry.blockType === "heading");
  expect(headingBlock?.ok).toBe(true);
  if (!headingBlock?.ok || headingBlock.output?.kind !== "dsl_tree_html_preview") {
    throw new Error("expected dsl_tree_html_preview");
  }

  return {
    encoded: encoded.value,
    previewHtml: headingBlock.output.html,
    clipboardHtml: rendered.clipboard.textHtml,
    themeId: rendered.article.styleAssignment.themeId,
  };
}

describe("html_paste fidelity tree theme tokens", () => {
  it("remaps title and accent bar colors for businessBlue user preview", () => {
    const { previewHtml } = renderFidelityHeading(
      BACKGROUND_NUMBER_HEADING_HTML,
      RUNTIME_VARIANT_ID,
      "businessBlue",
    );
    const palette = PREVIEW_COLOR_PALETTES.businessBlue.tokens;

    expect(previewHtml).toContain(palette.textDefault);
    expect(previewHtml).toContain(palette.textAccent);
    expect(previewHtml).toContain(palette.bgBand);
    expect(previewHtml).not.toContain("#E60012");
    expect(previewHtml).not.toContain("#111");
  });

  it("changes fidelity heading colors when preview palette switches", () => {
    const blue = renderFidelityHeading(
      BACKGROUND_NUMBER_HEADING_HTML,
      RUNTIME_VARIANT_ID,
      "businessBlue",
    );
    const orange = renderFidelityHeading(
      BACKGROUND_NUMBER_HEADING_HTML,
      RUNTIME_VARIANT_ID,
      "creamOrange",
    );

    const bluePalette = PREVIEW_COLOR_PALETTES.businessBlue.tokens;
    const orangePalette = PREVIEW_COLOR_PALETTES.creamOrange.tokens;

    expect(blue.previewHtml).toContain(bluePalette.textAccent);
    expect(blue.previewHtml).toContain(bluePalette.textDefault);
    expect(orange.previewHtml).toContain(orangePalette.textAccent);
    expect(orange.previewHtml).toContain(orangePalette.textDefault);
    expect(blue.previewHtml).not.toBe(orange.previewHtml);
    expect(blue.clipboardHtml).not.toBe(orange.clipboardHtml);
    expect(orange.previewHtml).toContain("#ea580c");
    expect(orange.previewHtml).toContain("#292524");
    expect(orange.previewHtml).not.toContain("#2563eb");
    expect(orange.previewHtml).not.toContain("#0f172a");
  });

  it("keeps preview and copy_wechat theme colors aligned", () => {
    const { previewHtml, clipboardHtml } = renderFidelityHeading(
      BACKGROUND_NUMBER_HEADING_HTML,
      RUNTIME_VARIANT_ID,
      "businessBlue",
    );
    const accent = PREVIEW_COLOR_PALETTES.businessBlue.tokens.textAccent;

    expect(previewHtml).toContain(accent);
    expect(clipboardHtml).toContain(accent);
    expect(clipboardHtml).not.toContain("#E60012");
  });

  it("preserves source colors when decode runs without themePalette", () => {
    const encoded = encodeHtmlToVariantDsl({
      html: BACKGROUND_NUMBER_HEADING_HTML,
      runtimeVariantId: RUNTIME_VARIANT_ID,
      blockType: "heading",
      wechatCompatibilityMode: "off",
    });
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;

    const article = structuredClone(dslRuntimeTraceFixtureArticle);
    const block = pickTraceFixtureBlock("heading");

    const decoded = decodeVariantDsl({
      article,
      block,
      variantDsl: encoded.value,
      target: "preview",
    });
    expect(decoded.ok).toBe(true);
    if (!decoded.ok) return;

    expect(decoded.html).toMatch(/background-color\s*:\s*#E60012/i);
    expect(decoded.html).toMatch(/color\s*:\s*#111/i);
  });

  it("preserves source colors for admin_inspection even when themePalette is passed", () => {
    const encoded = encodeHtmlToVariantDsl({
      html: BACKGROUND_NUMBER_HEADING_HTML,
      runtimeVariantId: RUNTIME_VARIANT_ID,
      blockType: "heading",
      wechatCompatibilityMode: "off",
    });
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;

    const article = structuredClone(dslRuntimeTraceFixtureArticle);
    const block = pickTraceFixtureBlock("heading");
    const themePalette = DEFAULT_THEME_PALETTE;

    const decoded = decodeVariantDsl({
      article,
      block,
      variantDsl: encoded.value,
      target: "admin_inspection",
      themePalette,
    });
    expect(decoded.ok).toBe(true);
    if (!decoded.ok) return;

    expect(decoded.html).toMatch(/background-color\s*:\s*#E60012/i);
  });

  it("remaps eyebrow, number, and subtitle roles on complex chapter overlay heading", () => {
    const { previewHtml } = renderFidelityHeading(
      COMPLEX_HEADING_HTML,
      COMPLEX_VARIANT_ID,
      "businessBlue",
    );
    const palette = PREVIEW_COLOR_PALETTES.businessBlue.tokens;

    expect(previewHtml).toContain(palette.textMuted);
    expect(previewHtml).toContain(palette.textAccent);
    expect(previewHtml).toContain(palette.bgBand);
    expect(previewHtml).not.toContain("rgb(148,163,184)");
    expect(previewHtml).not.toContain("#6c5ce7");
  });
});
