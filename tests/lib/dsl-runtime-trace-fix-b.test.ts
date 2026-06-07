import { describe, expect, it } from "vitest";

import { encodeHtmlToVariantDsl } from "@/core/dsl/encoder";
import { decodeVariantDsl } from "@/core/dsl/decoder";
import {
  buildRuntimeTraceForVariant,
  validateVariantDslRuntimeReadiness,
} from "@/lib/dsl-runtime";
import { USER_SELECTABLE_RELEASE1_HEADING_SEED_IDS } from "@/lib/runtime-variant-seed-config";
import { buildDatabaseDslRuntimeFixture } from "../fixtures/dsl/runtime-dsl-snapshot-fixtures";
import { COMPLEX_HEADING_HTML } from "../fixtures/dsl/complex-heading-html";
import { previewHtmlHarvestCandidate } from "@/server/style-admin/harvest/create-html-harvest-candidate";

describe("S10-STORY-011A FIX-B runtime trace", () => {
  const databaseFixture = buildDatabaseDslRuntimeFixture();

  it("preview harvest returns encoder/decoder trace for complex heading", () => {
    const preview = previewHtmlHarvestCandidate({ rawHtml: COMPLEX_HEADING_HTML });
    expect(preview.ok).toBe(true);
    if (!preview.ok) return;
    expect(preview.trace?.extractedSlots.title).toBe("怎么用");
    expect(preview.trace?.decoderPreview.ok).toBe(true);
    expect(preview.trace?.decoderCopy.ok).toBe(true);
  });

  it("database_dsl trace for userSelectable heading variants in fixture pool", () => {
    for (const variantId of USER_SELECTABLE_RELEASE1_HEADING_SEED_IDS) {
      const definitionJson = databaseFixture.definitionJsonByVariantId[variantId];
      const trace = buildRuntimeTraceForVariant({
        runtimeVariantId: variantId,
        blockType: "heading",
        definitionJson,
        poolSource: "database",
        article: {
          id: "trace",
          title: "Trace",
          blocks: [{ id: "b1", type: "heading", content: { text: "标题", level: 2 } }],
          meta: {},
        },
        block: { id: "b1", type: "heading", content: { text: "标题", level: 2 } },
      });
      expect(trace.runtimeSource).toBe("database_dsl");
      expect(trace.dslValid).toBe(true);
      expect(trace.decoderPath).toBe("renderContract");
    }
  });

  it("invalid DSL does not silently render empty", () => {
    const decoded = decodeVariantDsl({
      article: {
        id: "a",
        title: "t",
        blocks: [{ id: "b", type: "heading", content: { text: "", level: 2 } }],
        meta: {},
      },
      block: { id: "b", type: "heading", content: { text: "", level: 2 } },
      variantDsl: {
        version: "s10.variant-dsl.v1",
        id: "broken",
        blockType: "heading",
        copySafety: "strict",
        tree: { type: "element", tag: "section", children: [{ type: "slot", slot: "title", tag: "span" }] },
      },
      target: "preview",
    });
    expect(decoded.ok).toBe(false);
    if (decoded.ok) return;
    expect(decoded.issues.join(" ")).toMatch(/DSL_SLOT_MISSING|DSL_RENDER_EMPTY|empty/);
  });

  it("runtime readiness returns explicit issues for complex harvest DSL", () => {
    const encoded = encodeHtmlToVariantDsl({
      html: COMPLEX_HEADING_HTML,
      runtimeVariantId: "heading_html_paste_trace_candidate",
      blockType: "heading",
      label: "trace",
    });
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;

    const article = {
      id: "a1",
      title: "t",
      blocks: [{ id: "b1", type: "heading" as const, content: { text: "怎么用", level: 2 } }],
      meta: {},
    };

    const readiness = validateVariantDslRuntimeReadiness({
      runtimeVariantId: "heading_html_paste_trace_candidate",
      blockType: "heading",
      definitionJson: encoded.value,
      poolSource: "database",
      article,
      block: article.blocks[0]!,
    });

    expect(readiness.previewReady).toBe(true);
    expect(readiness.copyReady).toBe(true);
    expect(readiness.trace.decoderPath).toBe("tree");
  });
});
