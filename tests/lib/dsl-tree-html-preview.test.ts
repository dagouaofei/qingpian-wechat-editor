import { describe, expect, it } from "vitest";

import { encodeHtmlToVariantDsl } from "@/core/dsl/encoder";
import { TITLE_BLOCK_COMPONENT_ID } from "@/core/styles/types";
import { renderDslBlock } from "@/lib/dsl-runtime/render-dsl-block";
import { resolveRuntimePoolDefinitionFromMeta } from "@/lib/dsl-runtime/resolve-runtime-pool-definition";
import { renderArticlePreviewClient } from "@/lib/render-article-preview-client";
import { buildDbCandidateInspectionArticle } from "@/server/style-admin/inspection/db-candidate-admin-render";
import { buildCandidateInspectionFixture } from "@/server/style-admin/inspection/candidate-inspection-fixtures";
import {
  styleSelectionArticleFixture,
  styleSelectionNormalizedInput,
} from "../fixtures/generation/style-selection";
import { BACKGROUND_NUMBER_HEADING_HTML } from "../fixtures/dsl/background-number-heading-html";

const RUNTIME_VARIANT_ID = "heading_html_paste_4933bb91_candidate";
const SAMPLE_TITLE = "这是一个测试小标题";

function buildSlotTitleHybridDsl() {
  const encoded = encodeHtmlToVariantDsl({
    html: BACKGROUND_NUMBER_HEADING_HTML,
    runtimeVariantId: RUNTIME_VARIANT_ID,
    blockType: "heading",
    wechatCompatibilityMode: "off",
  });
  if (!encoded.ok) {
    throw new Error("encode failed");
  }

  return {
    ...encoded.value,
    tree: {
      type: "element" as const,
      tag: "section",
      style: {
        paddingTop: "10px",
        paddingBottom: "8px",
        borderLeftColor: "#1677ff",
        borderLeftStyle: "solid",
        borderLeftWidth: "4px",
      },
      children: [
        {
          type: "slot" as const,
          slot: "title",
          tag: "span",
          style: {
            color: "#f0f0f0",
            display: "block",
            fontSize: "84px",
            fontWeight: 900,
            lineHeight: "1.5",
            paddingTop: "10px",
            backgroundColor: "#E60012",
          },
        },
      ],
    },
  };
}

function renderPreviewHtml(sourceHtml?: string | null) {
  const definitionJson = buildSlotTitleHybridDsl();
  const fixture = buildCandidateInspectionFixture("heading", RUNTIME_VARIANT_ID);
  if (!fixture) {
    throw new Error("missing fixture");
  }

  const source = {
    variantId: "variant-bg-number",
    runtimeVariantId: RUNTIME_VARIANT_ID,
    blockType: "heading" as const,
    styleFamily: "htmlPaste",
    label: "Background Number Heading",
    lifecycle: "candidate" as const,
    definitionJson,
    componentProtocolJson: { layoutMode: "pill" },
    compatibilityJson: null,
    copySafety: "strict" as const,
    qualityStatus: "not_checked" as const,
    versionId: "version-bg-number",
    versionNumber: 1,
    primarySourceType: "html_paste" as const,
    hasRawHtml: Boolean(sourceHtml),
    rawHtml: sourceHtml ?? null,
  };

  const article = buildDbCandidateInspectionArticle(source, fixture);
  const block = article.blocks[0]!;

  const rendered = renderDslBlock({
    article,
    block,
    definitionJson,
    runtimeVariantId: RUNTIME_VARIANT_ID,
    target: "preview",
    mode: "preview",
    renderTarget: "preview_panel",
    sourceHtml,
    primarySourceType: "html_paste",
    family: "htmlPaste",
  });

  expect(rendered.ok).toBe(true);
  if (!rendered.ok || rendered.output?.kind !== "dsl_tree_html_preview") {
    throw new Error("expected dsl_tree_html_preview");
  }

  return rendered.output;
}

describe("dsl tree html preview render path", () => {
  it("renderDslBlock refreshes slot-tree DSL from sourceHtml and renders fidelity tree html", () => {
    const output = renderPreviewHtml(BACKGROUND_NUMBER_HEADING_HTML);
    const html = output.html;

    expect(html).toMatch(/margin:\s*60px\s+0\s+35px/i);
    expect((html.match(/<section\b/gi) ?? []).length).toBeGreaterThanOrEqual(3);
    expect(html).toMatch(/font-size:\s*84px/i);
    expect(html).toContain("01");
    expect(html).toMatch(/font-size:\s*24px/i);
    expect(html).toContain(SAMPLE_TITLE);
    expect(html).toMatch(/background-color:\s*#E60012/i);
    expect(html).not.toMatch(/border-left-color:\s*#1677ff/i);
    expect(html).toMatch(/<h2[^>]*>[\s\S]*这是一个测试小标题[\s\S]*<\/h2>/i);

    const numberSpan =
      html.match(/<span[^>]*font-size:\s*84px[^>]*>[\s\S]*?<\/span>/i)?.[0] ?? "";
    expect(numberSpan).toContain("01");
    expect(numberSpan).not.toContain(SAMPLE_TITLE);

    expect(output.runtimeTrace?.slotSubstitutionPath).toBe("meta.semanticBindings.title");
    expect(output.runtimeTrace?.slotSubstitutionPath).not.toBe("slots.title");
    expect(output.runtimeTrace?.fallbackUsed).toBe(false);
  });

  it("does not route article title through slots.title when semantic binding exists", () => {
    const output = renderPreviewHtml(null);
    const html = output.html;

    expect(output.runtimeTrace?.slotSubstitutionPath).not.toBe("slots.title");
    expect(html).not.toMatch(
      /<span[^>]*font-size:\s*84px[^>]*>[\s\S]*这是一个测试小标题[\s\S]*<\/span>/i,
    );
  });

  it("renderArticlePreviewClient uses server-preresolved fidelity DSL without client-side encode", () => {
    const staleDefinitionJson = buildSlotTitleHybridDsl();
    const sourceMeta = {
      blockType: "heading" as const,
      styleFamily: "htmlPaste",
      label: "Background Number Heading",
      primarySourceType: "html_paste",
      sourceHtml: BACKGROUND_NUMBER_HEADING_HTML,
    };
    const resolvedDefinitionJson = resolveRuntimePoolDefinitionFromMeta(
      staleDefinitionJson,
      RUNTIME_VARIANT_ID,
      sourceMeta,
    );
    const dslRuntime = {
      source: "database" as const,
      cache: { hit: false, ttlSeconds: 120, generatedAt: "2026-06-07T12:00:00.000Z" },
      definitionJsonByVariantId: { [RUNTIME_VARIANT_ID]: resolvedDefinitionJson },
      variantSourceMetaByVariantId: {
        [RUNTIME_VARIANT_ID]: {
          blockType: sourceMeta.blockType,
          styleFamily: sourceMeta.styleFamily,
          label: sourceMeta.label,
          primarySourceType: sourceMeta.primarySourceType,
        },
      },
      variantIds: [RUNTIME_VARIANT_ID],
      issues: [],
    };

    const rendered = renderArticlePreviewClient(
      styleSelectionArticleFixture,
      styleSelectionNormalizedInput,
      {
        articleStyle: "business",
        colorPalette: "businessBlue",
        headingVariantId: RUNTIME_VARIANT_ID,
      },
      {
        dslRuntime,
        userSelectablePool: {
          source: "database",
          cache: { hit: false, ttlSeconds: 120, generatedAt: "2026-06-07T12:00:00.000Z" },
          variants: [
            {
              id: RUNTIME_VARIANT_ID,
              schemaVersion: "1.0",
              blockType: "heading",
              family: "htmlPaste",
              name: RUNTIME_VARIANT_ID,
              label: "Background Number Heading",
              status: "experimental",
              componentProtocol: {
                componentId: TITLE_BLOCK_COMPONENT_ID,
                familyId: "htmlPaste",
                layoutMode: "pill",
              },
            },
          ],
          poolVariantIds: [RUNTIME_VARIANT_ID],
          issues: [],
        },
      },
    );

    const heading = rendered.previewBlocks.find((block) => block.blockType === "heading");
    expect(heading?.ok).toBe(true);
    if (!heading?.ok || heading.output?.kind !== "dsl_tree_html_preview") {
      throw new Error("expected dsl_tree_html_preview");
    }

    expect(heading.output.runtimeTrace?.slotSubstitutionPath).toBe("meta.semanticBindings.title");
    expect(heading.output.html).toMatch(/margin:\s*60px\s+0\s+35px/i);
    expect(heading.output.html).not.toMatch(/border-left-color:\s*#1677ff/i);
    expect(heading.output.html).toContain("01");
    expect(heading.output.html).toContain("章节标题");
    expect(rendered.clipboard.textHtml).toMatch(/margin:\s*60px\s+0\s+35px/i);
    expect(rendered.clipboard.textHtml).not.toMatch(/border-left-color:\s*#1677ff/i);
  });
});
