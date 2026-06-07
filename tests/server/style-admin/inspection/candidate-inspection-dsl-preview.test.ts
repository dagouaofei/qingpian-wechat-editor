import { describe, expect, it } from "vitest";

import { encodeHtmlToVariantDsl } from "@/core/dsl/encoder";
import { buildCandidatePreviewBlock } from "@/server/style-admin/inspection/candidate-preview-block";
import { buildCandidateInspectionFixture } from "@/server/style-admin/inspection/candidate-inspection-fixtures";
import type { DbCandidateInspectionSource } from "@/server/style-admin/inspection/candidate-inspection-types";
import { COMPLEX_HEADING_HTML } from "../../../fixtures/dsl/complex-heading-html";

function buildComplexHeadingSource(): DbCandidateInspectionSource {
  const runtimeVariantId = "heading_html_paste_inspection_preview_candidate";
  const encoded = encodeHtmlToVariantDsl({
    html: COMPLEX_HEADING_HTML,
    runtimeVariantId,
    blockType: "heading",
    label: "Inspection Preview",
  });
  if (!encoded.ok) {
    throw new Error("encode failed");
  }

  return {
    variantId: "variant-inspection",
    runtimeVariantId,
    blockType: "heading",
    styleFamily: "htmlPaste",
    label: "Inspection Preview",
    lifecycle: "candidate",
    definitionJson: encoded.value,
    componentProtocolJson: { layoutMode: "magazine_left_bar" },
    compatibilityJson: null,
    copySafety: "strict",
    qualityStatus: "not_checked",
    versionId: "version-1",
    versionNumber: 1,
    primarySourceType: "html_paste",
    hasRawHtml: true,
  };
}

describe("candidate inspection DSL preview", () => {
  it("renders styled heading preview via DSL decoder, not bare text fallback", () => {
    const source = buildComplexHeadingSource();
    const fixture = buildCandidateInspectionFixture("heading", source.runtimeVariantId);
    if (!fixture) throw new Error("missing fixture");

    const previewBlock = buildCandidatePreviewBlock(source, fixture);
    expect(previewBlock?.ok).toBe(true);
    if (!previewBlock?.ok || !previewBlock.output) return;

    expect(previewBlock.output.kind).toBe("dsl_tree_html_preview");
    if (previewBlock.output.kind !== "dsl_tree_html_preview") return;

    expect(previewBlock.output.html).toContain(fixture.sampleText);
    expect(previewBlock.output.html).not.toContain("怎么用");
    expect(previewBlock.output.html).toContain("CHAPTER 03");
    expect(previewBlock.output.html).toContain("03");
    expect(previewBlock.output.html).toContain("HOW TO");
  });
});
