import { describe, expect, it } from "vitest";

import { encodeHtmlToVariantDsl } from "@/core/dsl/encoder";
import {
  styleSelectionArticleFixture,
  styleSelectionNormalizedInput,
} from "../fixtures/generation/style-selection";
import { buildDatabaseDslRuntimeFixture } from "../fixtures/dsl/runtime-dsl-snapshot-fixtures";
import { renderArticlePreviewClient } from "@/lib/render-article-preview-client";
import type { UserSelectableVariantPoolSnapshot } from "@/lib/user-selectable-variant-pool-types";

describe("DSL runtime promoted heading preview", () => {
  it("renders promoted html_paste heading in user preview when DSL definition is provided", () => {
    const runtimeVariantId = "heading_html_paste_9776cdde_candidate";
    const html = `<section style="padding: 8px 0; border-left: 4px solid #1677ff;">
  <span style="font-size: 18px; font-weight: 700; color: #111;">这是一个可上线测试小标题</span>
</section>`;

    const encoded = encodeHtmlToVariantDsl({
      html,
      runtimeVariantId,
      blockType: "heading",
      label: "Promoted heading",
    });
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;

    const dslRuntime = buildDatabaseDslRuntimeFixture({
      [runtimeVariantId]: encoded.value,
    });

    const pool: UserSelectableVariantPoolSnapshot = {
      source: "database",
      cache: { hit: false, ttlSeconds: 300, generatedAt: new Date().toISOString() },
      variants: [
        {
          id: runtimeVariantId,
          schemaVersion: "1.0",
          blockType: "heading",
          family: "htmlPaste",
          name: runtimeVariantId,
          label: "Promoted heading",
          status: "experimental",
        },
      ],
      poolVariantIds: [runtimeVariantId],
      definitionJsonByVariantId: {
        [runtimeVariantId]: encoded.value,
      },
      issues: [],
    };

    const rendered = renderArticlePreviewClient(
      styleSelectionArticleFixture,
      styleSelectionNormalizedInput,
      {
        articleStyle: "business",
        colorPalette: "businessBlue",
        headingVariantId: runtimeVariantId,
      },
      { userSelectablePool: pool, dslRuntime },
    );

    const headingBlock = rendered.previewBlocks.find((block) => block.blockType === "heading");
    expect(headingBlock?.ok).toBe(true);
    expect(headingBlock?.variantId).toBe(runtimeVariantId);
    expect(headingBlock?.output?.kind).toBe("dsl_tree_html_preview");
    if (headingBlock?.ok && headingBlock.output?.kind === "dsl_tree_html_preview") {
      expect(headingBlock.output.html.length).toBeGreaterThan(0);
      expect(headingBlock.output.html).toContain("章节标题");
    }
    expect(rendered.clipboard.textHtml.length).toBeGreaterThan(0);
  });
});
