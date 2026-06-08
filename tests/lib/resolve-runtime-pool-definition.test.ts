import { describe, expect, it } from "vitest";

import { encodeHtmlToVariantDsl } from "@/core/dsl/encoder";
import {
  resolveRuntimePoolDefinitionJson,
  stripSourceHtmlFromRuntimeMeta,
} from "@/lib/dsl-runtime/resolve-runtime-pool-definition";
import { BACKGROUND_NUMBER_HEADING_HTML } from "../fixtures/dsl/background-number-heading-html";

const RUNTIME_VARIANT_ID = "heading_html_paste_4933bb91_candidate";

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

describe("resolveRuntimePoolDefinitionJson", () => {
  it("refreshes stale html_paste heading DSL from sourceHtml on the server", () => {
    const stale = buildSlotTitleHybridDsl();
    const resolved = resolveRuntimePoolDefinitionJson({
      definitionJson: stale,
      runtimeVariantId: RUNTIME_VARIANT_ID,
      blockType: "heading",
      label: "Background Number Heading",
      styleFamily: "htmlPaste",
      primarySourceType: "html_paste",
      sourceHtml: BACKGROUND_NUMBER_HEADING_HTML,
    });

    expect(resolved).not.toEqual(stale);
    expect(JSON.stringify(resolved)).toMatch(/margin.*60px/i);
    expect(JSON.stringify(resolved)).not.toMatch(/borderLeftColor.*#1677ff/i);
  });

  it("strips raw HTML from runtime meta sent to the browser", () => {
    const stripped = stripSourceHtmlFromRuntimeMeta({
      [RUNTIME_VARIANT_ID]: {
        blockType: "heading",
        styleFamily: "htmlPaste",
        label: "Preview",
        primarySourceType: "html_paste",
        sourceHtml: BACKGROUND_NUMBER_HEADING_HTML,
      },
    });

    expect(stripped?.[RUNTIME_VARIANT_ID]?.sourceHtml).toBeUndefined();
    expect(stripped?.[RUNTIME_VARIANT_ID]?.primarySourceType).toBe("html_paste");
  });
});
