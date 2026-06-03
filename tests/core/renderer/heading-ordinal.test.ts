import { describe, expect, it } from "vitest";

import { parseArticle } from "@/core/article";
import {
  buildClipboardPayload,
} from "@/core/copy";
import { createTitleBlockRendererRegistry } from "@/core/renderer";
import {
  createFirstWaveRequiredVariantRegistry,
  resolveArticleStyle,
} from "@/core/styles";

import { articleFixtureBase, fixtureBlockId } from "../../fixtures/articles/shared";
import {
  formatHeadingOrdinalLabel,
  resolveHeadingIndexLabel,
  resolveHeadingOrdinalInArticle,
} from "@/core/renderer/heading-ordinal";

describe("heading ordinal", () => {
  it("resolves 1-based index among heading blocks", () => {
    const article = parseArticle({
      ...articleFixtureBase(),
      blocks: [
        { id: fixtureBlockId(1), type: "paragraph", content: { text: "intro" } },
        { id: fixtureBlockId(2), type: "heading", content: { text: "A", level: 2 } },
        { id: fixtureBlockId(3), type: "heading", content: { text: "B", level: 2 } },
        { id: fixtureBlockId(4), type: "heading", content: { text: "C", level: 2 } },
      ],
    });

    expect(resolveHeadingOrdinalInArticle(article, fixtureBlockId(2))).toBe(1);
    expect(resolveHeadingOrdinalInArticle(article, fixtureBlockId(3))).toBe(2);
    expect(resolveHeadingOrdinalInArticle(article, fixtureBlockId(4))).toBe(3);
    expect(formatHeadingOrdinalLabel(2)).toBe("02");
    expect(resolveHeadingIndexLabel(article, fixtureBlockId(3))).toBe("02");
  });

  it("copy HTML uses auto-increment labels for numbered headings", () => {
    const registry = createFirstWaveRequiredVariantRegistry();
    const copyRegistry = createTitleBlockRendererRegistry();
    const h1 = fixtureBlockId(1);
    const h2 = fixtureBlockId(2);
    const article = parseArticle({
      ...articleFixtureBase(),
      styleAssignment: {
        themeId: "businessBlue",
        presetId: "business",
        blockOverrides: [
          { blockId: h1, variantId: "heading_numbered_section" },
          { blockId: h2, variantId: "heading_numbered_section" },
        ],
      },
      blocks: [
        { id: h1, type: "heading", content: { text: "第一节", level: 2 } },
        { id: h2, type: "heading", content: { text: "第二节", level: 2 } },
      ],
    });
    const resolved = resolveArticleStyle(article, registry);
    const payload = buildClipboardPayload({
      article,
      resolvedArticleStyle: resolved,
      registry: copyRegistry,
    });

    expect(payload.textHtml).toMatch(/>01</);
    expect(payload.textHtml).toMatch(/>02</);
    expect(payload.textHtml).toMatch(/border-radius:\s*6px/i);
    expect(payload.textHtml).toMatch(/padding:\s*3px 10px/i);
  });
});
