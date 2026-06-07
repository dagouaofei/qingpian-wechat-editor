import { describe, expect, it } from "vitest";

import { encodeHtmlToVariantDsl } from "@/core/dsl/encoder";
import { buildCandidateInspectionPanelViewModel } from "@/app/admin/(protected)/style-library/candidate-inspection-view-model";
import { buildCandidateInspectionFixture } from "@/server/style-admin/inspection/candidate-inspection-fixtures";
import type { DbCandidateInspectionSource } from "@/server/style-admin/inspection/candidate-inspection-types";
import type { AdminVariantDetail } from "@/server/style-admin/queries/style-library-admin-query";
import { BACKGROUND_NUMBER_HEADING_HTML } from "../../../fixtures/dsl/background-number-heading-html";

const RUNTIME_VARIANT_ID = "heading_html_paste_4933bb91_candidate";
const SAMPLE_TITLE = "这是一个测试小标题";

function buildStaleCollapsedTreeDefinition() {
  const encoded = encodeHtmlToVariantDsl({
    html: BACKGROUND_NUMBER_HEADING_HTML,
    runtimeVariantId: RUNTIME_VARIANT_ID,
    blockType: "heading",
    label: "Background Number Heading",
    wechatCompatibilityMode: "off",
  });
  if (!encoded.ok) {
    throw new Error("encode failed");
  }

  const staleTree = {
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
        type: "element" as const,
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
        children: [{ type: "text" as const, value: "一、生产力暴击" }],
      },
    ],
  };

  return {
    ...encoded.value,
    tree: staleTree,
  };
}

function buildInspectionSource(
  overrides: Partial<DbCandidateInspectionSource> = {},
): DbCandidateInspectionSource {
  const definitionJson = buildStaleCollapsedTreeDefinition();
  return {
    variantId: "variant-bg-number",
    runtimeVariantId: RUNTIME_VARIANT_ID,
    blockType: "heading",
    styleFamily: "htmlPaste",
    label: "Background Number Heading",
    lifecycle: "candidate",
    definitionJson,
    componentProtocolJson: { layoutMode: "pill" },
    compatibilityJson: null,
    copySafety: "strict",
    qualityStatus: "not_checked",
    versionId: "version-bg-number",
    versionNumber: 1,
    primarySourceType: "html_paste",
    hasRawHtml: true,
    rawHtml: BACKGROUND_NUMBER_HEADING_HTML,
    ...overrides,
  };
}

function buildAdminDetail(source: DbCandidateInspectionSource): AdminVariantDetail {
  return {
    variant: {
      id: source.variantId,
      runtimeVariantId: source.runtimeVariantId,
      blockType: source.blockType,
      styleFamily: source.styleFamily,
      label: source.label,
      lifecycle: source.lifecycle,
    } as AdminVariantDetail["variant"],
    distribution: null,
    currentVersion: {
      id: source.versionId,
      versionNumber: source.versionNumber,
      definitionJson: source.definitionJson,
      componentProtocolJson: source.componentProtocolJson,
      compatibilityJson: source.compatibilityJson,
      copySafety: source.copySafety,
      qualityStatus: source.qualityStatus,
    } as AdminVariantDetail["currentVersion"],
    sources: [
      {
        id: "source-bg-number",
        sourceType: "html_paste",
        rawHtml: source.rawHtml ?? null,
        createdAt: new Date("2026-06-07T00:00:00.000Z"),
      } as AdminVariantDetail["sources"][number],
    ],
    lifecycleEvents: [],
    validationRuns: [],
    evidence: [],
    promoteRecords: [],
  };
}

function extractPreviewHtml(
  inspection: ReturnType<typeof buildCandidateInspectionPanelViewModel>,
): string {
  const output = inspection?.previewBlock?.output;
  if (output?.kind !== "dsl_tree_html_preview") {
    throw new Error(`expected dsl_tree_html_preview, got ${output?.kind ?? "none"}`);
  }
  return output.html;
}

describe("candidate inspection background number heading (real admin entry)", () => {
  it("buildCandidateInspectionPanelViewModel substitutes sample title at h2 binding, not number span", () => {
    const source = buildInspectionSource();
    const fixture = buildCandidateInspectionFixture("heading", source.runtimeVariantId);
    expect(fixture?.sampleText).toBe(SAMPLE_TITLE);

    const inspection = buildCandidateInspectionPanelViewModel(buildAdminDetail(source));
    expect(inspection?.supported).toBe(true);
    expect(inspection?.previewOk).toBe(true);

    const html = extractPreviewHtml(inspection);
    const bindings = (source.definitionJson as { meta?: { semanticBindings?: Record<string, { path: string }> } })
      .meta?.semanticBindings;

    expect(html).toContain("01");
    expect(html).toContain(SAMPLE_TITLE);
    expect(html).toMatch(/<h2[^>]*>[\s\S]*这是一个测试小标题[\s\S]*<\/h2>/i);

    const numberSpan =
      html.match(/<span[^>]*font-size:\s*84px[^>]*>[\s\S]*?<\/span>/i)?.[0] ?? "";
    expect(numberSpan).toContain("01");
    expect(numberSpan).not.toContain(SAMPLE_TITLE);

    expect(html).toMatch(/font-size:\s*24px/i);
    expect(html).toMatch(/color:\s*#111/i);
    expect(html).toMatch(/background-color:\s*#E60012/i);
    expect(html).toMatch(/font-size:\s*84px/i);
    expect(html).not.toMatch(/border-left-color:\s*#1677ff/i);
    expect(html).not.toMatch(/padding-bottom:\s*8px/i);

    const h2Html = html.match(/<h2[^>]*>[\s\S]*?<\/h2>/i)?.[0] ?? "";
    expect(h2Html).toContain(SAMPLE_TITLE);
    expect(h2Html).not.toMatch(/background-color:\s*#E60012/i);

    const runtimeTrace =
      inspection?.previewBlock?.ok && inspection.previewBlock.output?.kind === "dsl_tree_html_preview"
        ? inspection.previewBlock.output.runtimeTrace
        : undefined;

    expect(runtimeTrace?.slotSubstitutionPath).toBe("meta.semanticBindings.title");
    expect(runtimeTrace?.slotSubstitutionTargetPath).toBe(bindings?.title?.path);
    expect(runtimeTrace?.substitutedSlot).toBe("title");
    expect(runtimeTrace?.decorativeSlotsPreserved).toContain("number");
    expect(runtimeTrace?.fallbackUsed).toBe(false);
  });
});
