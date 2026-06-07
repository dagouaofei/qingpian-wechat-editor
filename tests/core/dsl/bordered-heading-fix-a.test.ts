import { describe, expect, it } from "vitest";

import { decodeVariantDsl } from "@/core/dsl/decoder";
import { encodeHtmlToVariantDsl } from "@/core/dsl/encoder";
import { validateVariantDslRuntimeReadiness } from "@/lib/dsl-runtime";
import {
  dslRuntimeTraceFixtureArticle,
  pickTraceFixtureBlock,
} from "@/lib/dsl-runtime/trace-fixture-article";
import { renderDslBlock } from "@/lib/dsl-runtime/render-dsl-block";
import { buildCandidatePreviewBlock } from "@/server/style-admin/inspection/candidate-preview-block";
import { buildCandidateInspectionFixture } from "@/server/style-admin/inspection/candidate-inspection-fixtures";
import type { DbCandidateInspectionSource } from "@/server/style-admin/inspection/candidate-inspection-types";
import { renderArticlePreviewClient } from "@/lib/render-article-preview-client";
import {
  styleSelectionArticleFixture,
  styleSelectionNormalizedInput,
} from "../../fixtures/generation/style-selection";
import { buildDatabaseDslRuntimeFixture } from "../../fixtures/dsl/runtime-dsl-snapshot-fixtures";
import type { UserSelectableVariantPoolSnapshot } from "@/lib/user-selectable-variant-pool-types";
import {
  BORDERED_HEADING_HTML,
  BORDERED_HEADING_RUNTIME_VARIANT_ID,
} from "../../fixtures/dsl/bordered-heading-html";

function encodeBorderedHeading() {
  const encoded = encodeHtmlToVariantDsl({
    html: BORDERED_HEADING_HTML,
    runtimeVariantId: BORDERED_HEADING_RUNTIME_VARIANT_ID,
    blockType: "heading",
    label: "Bordered heading",
  });
  expect(encoded.ok).toBe(true);
  if (!encoded.ok) throw new Error("encode failed");
  return encoded.value;
}

function buildBorderedHeadingSource(definitionJson: unknown): DbCandidateInspectionSource {
  return {
    variantId: "variant-bordered",
    runtimeVariantId: BORDERED_HEADING_RUNTIME_VARIANT_ID,
    blockType: "heading",
    styleFamily: "htmlPaste",
    label: "Bordered heading",
    lifecycle: "candidate",
    definitionJson,
    componentProtocolJson: null,
    compatibilityJson: null,
    copySafety: "strict",
    qualityStatus: "not_checked",
    versionId: "version-bordered",
    versionNumber: 1,
    primarySourceType: "html_paste",
    hasRawHtml: true,
  };
}

describe("FIX-A bordered heading DSL decode", () => {
  it("encodes non-empty styleTokens with border, padding, and typography", () => {
    const dsl = encodeBorderedHeading();
    const styleTokens = dsl.meta?.styleTokens as Record<string, string> | undefined;

    expect(styleTokens).toBeTruthy();
    expect(Object.keys(styleTokens ?? {}).length).toBeGreaterThan(0);
    expect(styleTokens?.padding).toBe("14px 18px");
    expect(styleTokens?.border).toContain("#2563eb");
    expect(styleTokens?.borderLeft).toContain("4px");
    expect(styleTokens?.borderRadius).toBe("8px");
    expect(styleTokens?.color).toBe("#0f172a");
    expect(styleTokens?.fontSize).toBe("17px");
    expect(styleTokens?.lineHeight).toBe("1.5");
    expect(dsl.meta?.layoutIntent).toBe("bordered_left_accent_heading");
  });

  it("normalizes tree styles onto section root + h3 title slot without duplicate root padding", () => {
    const dsl = encodeBorderedHeading();
    const root = dsl.tree;
    expect(root?.tag).toBe("section");
    const titleSlot = root?.children?.[0];
    expect(titleSlot?.type).toBe("slot");
    if (titleSlot?.type !== "slot") return;
    expect(titleSlot.tag).toBe("h3");
    expect(titleSlot.style?.border).toContain("#2563eb");
    expect(titleSlot.style?.borderLeft).toContain("4px");
    expect(titleSlot.style?.borderRadius).toBe("8px");
    expect(titleSlot.style?.padding).toBe("14px 18px");
    expect(root?.style?.padding).toBeUndefined();
    expect(root?.style?.borderLeft).toBeUndefined();
  });

  it("decodes non-empty preview and copy_wechat HTML with title text and border styles", () => {
    const dsl = encodeBorderedHeading();
    const block = pickTraceFixtureBlock("heading");
    const article = dslRuntimeTraceFixtureArticle;

    const preview = decodeVariantDsl({
      article,
      block,
      variantDsl: dsl,
      target: "preview",
    });
    expect(preview.ok).toBe(true);
    expect(preview.html?.length).toBeGreaterThan(0);
    expect(preview.output?.kind).toBe("dsl_tree_html_preview");
    expect(preview.html).toContain("测试标题");
    expect(preview.html).toMatch(/border/i);
    expect(preview.html).toMatch(/border-radius|border-radius: 8px/i);

    const copy = decodeVariantDsl({
      article,
      block,
      variantDsl: dsl,
      target: "copy_wechat",
    });
    expect(copy.ok).toBe(true);
    expect(copy.html?.length).toBeGreaterThan(0);
    expect(copy.html).toContain("测试标题");
  });

  it("returns failed status when decoded preview HTML is empty", () => {
    const dsl = encodeBorderedHeading();
    const block = {
      ...pickTraceFixtureBlock("heading"),
      content: { text: "", level: 2 },
    };
    const article = { ...dslRuntimeTraceFixtureArticle, blocks: [block] };
    const emptyDsl = {
      ...dsl,
      meta: { ...dsl.meta, extractedSlots: undefined },
    };

    const preview = decodeVariantDsl({
      article,
      block,
      variantDsl: emptyDsl,
      target: "preview",
    });
    expect(preview.ok).toBe(false);
    expect(preview.issues.join(" ")).toMatch(/DSL_RENDER_EMPTY|DSL_SLOT_MISSING/);
  });

  it("rejects readiness when preview decode is empty", () => {
    const dsl = encodeBorderedHeading();
    const block = {
      ...pickTraceFixtureBlock("heading"),
      content: { text: "   ", level: 2 },
    };
    const emptyDsl = {
      ...dsl,
      meta: { ...dsl.meta, extractedSlots: undefined },
    };

    const readiness = validateVariantDslRuntimeReadiness({
      runtimeVariantId: BORDERED_HEADING_RUNTIME_VARIANT_ID,
      blockType: "heading",
      definitionJson: emptyDsl,
      poolSource: "database",
      article: { ...dslRuntimeTraceFixtureArticle, blocks: [block] },
      block,
    });
    expect(readiness.previewReady).toBe(false);
    expect(readiness.ok).toBe(false);
  });

  it("does not fallback to default heading renderer when database_dsl decode fails", () => {
    const dsl = encodeBorderedHeading();
    const block = pickTraceFixtureBlock("heading");
    const brokenDsl = { ...dsl, tree: undefined };

    const result = renderDslBlock({
      article: dslRuntimeTraceFixtureArticle,
      block,
      definitionJson: brokenDsl,
      runtimeVariantId: BORDERED_HEADING_RUNTIME_VARIANT_ID,
      target: "preview",
      mode: "preview",
      renderTarget: "browser",
    });
    expect(result.ok).toBe(false);
    expect(result.output).toBeUndefined();
  });

  it("renders user preview from DSL tree HTML without preview-bg-soft fallback card", () => {
    const dsl = encodeBorderedHeading();
    const dslRuntime = buildDatabaseDslRuntimeFixture({
      [BORDERED_HEADING_RUNTIME_VARIANT_ID]: dsl,
    });
    const pool: UserSelectableVariantPoolSnapshot = {
      source: "database",
      cache: { hit: false, ttlSeconds: 300, generatedAt: new Date().toISOString() },
      variants: [
        {
          id: BORDERED_HEADING_RUNTIME_VARIANT_ID,
          schemaVersion: "1.0",
          blockType: "heading",
          family: "htmlPaste",
          name: BORDERED_HEADING_RUNTIME_VARIANT_ID,
          label: "Bordered heading",
          status: "experimental",
        },
      ],
      poolVariantIds: [BORDERED_HEADING_RUNTIME_VARIANT_ID],
      definitionJsonByVariantId: {
        [BORDERED_HEADING_RUNTIME_VARIANT_ID]: dsl,
      },
      issues: [],
    };

    const rendered = renderArticlePreviewClient(
      styleSelectionArticleFixture,
      styleSelectionNormalizedInput,
      {
        articleStyle: "business",
        colorPalette: "businessBlue",
        headingVariantId: BORDERED_HEADING_RUNTIME_VARIANT_ID,
      },
      { userSelectablePool: pool, dslRuntime },
    );

    const headingBlock = rendered.previewBlocks.find((block) => block.blockType === "heading");
    expect(headingBlock?.ok).toBe(true);
    expect(headingBlock?.variantId).toBe(BORDERED_HEADING_RUNTIME_VARIANT_ID);
    expect(headingBlock?.output?.kind).toBe("dsl_tree_html_preview");
    if (headingBlock?.output?.kind === "dsl_tree_html_preview") {
      expect(headingBlock.output.html).toContain("#2563eb");
      expect(headingBlock.output.html).not.toContain("var(--preview-bg-soft)");
      expect(headingBlock.output.runtimeTrace?.runtimeSource).toBe("database_dsl");
      expect(headingBlock.output.runtimeTrace?.selectedRuntimeVariantId).toBe(
        BORDERED_HEADING_RUNTIME_VARIANT_ID,
      );
      expect(headingBlock.output.runtimeTrace?.renderedByVariantId).toBe(
        BORDERED_HEADING_RUNTIME_VARIANT_ID,
      );
      expect(headingBlock.output.runtimeTrace?.fallbackUsed).toBe(false);
    }
  });

  it("renders candidate detail preview inspection with styled HTML, not bare text", () => {
    const dsl = encodeBorderedHeading();
    const source = buildBorderedHeadingSource(dsl);
    const fixture = buildCandidateInspectionFixture("heading", source.runtimeVariantId);
    if (!fixture) throw new Error("missing fixture");

    const previewBlock = buildCandidatePreviewBlock(source, fixture);
    expect(previewBlock?.ok).toBe(true);
    expect(previewBlock?.output?.kind).toBe("dsl_tree_html_preview");
    if (previewBlock?.ok && previewBlock.output?.kind === "dsl_tree_html_preview") {
      expect(previewBlock.output.html).toContain("这是一个测试小标题");
      expect(previewBlock.output.html).toMatch(/border/i);
      expect(previewBlock.output.html).toMatch(/border-radius|border-radius: 8px/i);
    }
  });
});
