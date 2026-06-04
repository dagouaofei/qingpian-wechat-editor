import { describe, expect, it } from "vitest";

import {
  FIRST_WAVE_TITLE_HEADING_VARIANT_REGISTRY,
  HEADING_PUBLISH_VARIANT_IDS,
  TITLE_BLOCK_FIRST_WAVE_VARIANTS,
  parseStyleRegistry,
  resolveArticleStyle,
} from "@/core/styles";
import {
  buildBlockRenderContext,
  createTitleBlockRendererRegistry,
  renderBlock,
  renderTargetForMode,
} from "@/core/renderer";
import { createTitleHeadingArticleFixture } from "../../fixtures/renderer/title-heading-articles";
import { fixtureBlockId } from "../../fixtures/articles/shared";

const VARIANT_MATRIX = [
  { variantId: "title_plain_minimal", blockType: "title" as const, layoutMode: "plain" },
  { variantId: "title_left_bar_classic", blockType: "title" as const, layoutMode: "left_bar" },
  {
    variantId: "title_bottom_line_editorial",
    blockType: "title" as const,
    layoutMode: "bottom_line",
  },
  {
    variantId: "heading_short_line",
    blockType: "heading" as const,
    layoutMode: "short_line",
  },
  {
    variantId: "heading_highlight_marker",
    blockType: "heading" as const,
    layoutMode: "highlight_marker",
  },
  {
    variantId: "heading_icon_prefix",
    blockType: "heading" as const,
    layoutMode: "icon_prefix",
  },
  {
    variantId: "heading_minimal_number",
    blockType: "heading" as const,
    layoutMode: "minimal_number",
  },
  {
    variantId: "heading_magazine_left_bar",
    blockType: "heading" as const,
    layoutMode: "magazine_left_bar",
  },
  {
    variantId: "heading_magazine_offset",
    blockType: "heading" as const,
    layoutMode: "magazine_offset",
  },
  {
    variantId: "heading_numbered_section",
    blockType: "heading" as const,
    layoutMode: "numbered",
  },
  {
    variantId: "heading_card_centered",
    blockType: "heading" as const,
    layoutMode: "card",
  },
] as const;

describe("title / heading renderer matrix", () => {
  const styleRegistry = parseStyleRegistry(FIRST_WAVE_TITLE_HEADING_VARIANT_REGISTRY);
  const rendererRegistry = createTitleBlockRendererRegistry();

  it("covers all publish heading variants plus title variants", () => {
    const headingIds = VARIANT_MATRIX.filter((row) => row.blockType === "heading").map(
      (row) => row.variantId,
    );
    expect(headingIds).toEqual([...HEADING_PUBLISH_VARIANT_IDS]);
    expect(VARIANT_MATRIX).toHaveLength(TITLE_BLOCK_FIRST_WAVE_VARIANTS.length);
  });

  for (const row of VARIANT_MATRIX) {
    it(`preview + copy render ${row.variantId}`, () => {
      const article = createTitleHeadingArticleFixture({
        blockType: row.blockType,
        variantId: row.variantId,
        text: row.blockType === "title" ? "主标题" : "小节标题",
      });
      const resolved = resolveArticleStyle(article, styleRegistry);
      const block = article.blocks[0]!;

      const preview = renderBlock({
        input: {
          article,
          block,
          resolvedArticleStyle: resolved,
          mode: "preview",
          target: renderTargetForMode("preview"),
        },
        registry: rendererRegistry,
      });

      const copy = renderBlock({
        input: {
          article,
          block,
          resolvedArticleStyle: resolved,
          mode: "copy",
          target: renderTargetForMode("copy"),
        },
        registry: rendererRegistry,
      });

      expect(preview.ok).toBe(true);
      expect(copy.ok).toBe(true);
      if (preview.ok && preview.output && "layoutMode" in preview.output) {
        expect(preview.output.layoutMode).toBe(row.layoutMode);
      }
    });
  }

  it("buildBlockRenderContext returns issues for unknown blockId", () => {
    const article = createTitleHeadingArticleFixture({
      blockType: "heading",
      variantId: "heading_short_line",
      text: "H",
    });
    const resolved = resolveArticleStyle(article, styleRegistry);

    const { context, issues } = buildBlockRenderContext({
      article,
      blockId: fixtureBlockId(99),
      resolvedArticleStyle: resolved,
      mode: "preview",
      target: renderTargetForMode("preview"),
    });

    expect(context).toBeUndefined();
    expect(issues.length).toBeGreaterThan(0);
  });
});
