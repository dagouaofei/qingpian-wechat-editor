import { describe, expect, it } from "vitest";

import { encodeHtmlToVariantDsl } from "@/core/dsl/encoder";
import { renderDslBlock } from "@/lib/dsl-runtime/render-dsl-block";
import { buildDbCandidateInspectionArticle } from "@/server/style-admin/inspection/db-candidate-admin-render";
import { buildCandidateInspectionFixture } from "@/server/style-admin/inspection/candidate-inspection-fixtures";
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
});
