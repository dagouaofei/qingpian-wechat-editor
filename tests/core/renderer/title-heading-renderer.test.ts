import { describe, expect, it } from "vitest";

import {
  FIRST_WAVE_TITLE_HEADING_VARIANT_REGISTRY,
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
  { variantId: "heading_plain_minimal", blockType: "heading" as const, layoutMode: "plain" },
  {
    variantId: "heading_numbered_section",
    blockType: "heading" as const,
    layoutMode: "numbered",
  },
  {
    variantId: "heading_top_badge_topic",
    blockType: "heading" as const,
    layoutMode: "top_badge",
  },
];

describe("title / heading preview renderer", () => {
  const styleRegistry = parseStyleRegistry(FIRST_WAVE_TITLE_HEADING_VARIANT_REGISTRY);
  const rendererRegistry = createTitleBlockRendererRegistry();

  it.each(VARIANT_MATRIX)(
    "preview renders $variantId successfully",
    ({ variantId, blockType, layoutMode }) => {
      const article = createTitleHeadingArticleFixture({
        blockType,
        variantId,
        text: `${variantId} 文本`,
        meta:
          variantId === "heading_numbered_section"
            ? { sourceIndex: 2 }
            : variantId === "heading_top_badge_topic"
              ? { label: "专题" }
              : undefined,
      });
      const resolved = resolveArticleStyle(article, styleRegistry);
      const block = article.blocks[0]!;

      const result = renderBlock({
        input: {
          article,
          block,
          resolvedArticleStyle: resolved,
          mode: "preview",
          target: renderTargetForMode("preview"),
        },
        registry: rendererRegistry,
      });

      expect(result.ok).toBe(true);
      expect(result.mode).toBe("preview");
      expect(result.target).toBe("browser_preview");
      expect(result.blockId).toBe(block.id);
      expect(result.blockType).toBe(blockType);
      expect(result.variantId).toBe(variantId);
      expect(result.output).toMatchObject({
        kind: "title_block_preview",
        layoutMode,
        text: `${variantId} 文本`,
      });
    },
  );

  it("resolves all 6 variants through renderer registry", () => {
    expect(rendererRegistry.has("title", "preview")).toBe(true);
    expect(rendererRegistry.has("title", "copy")).toBe(true);
    expect(rendererRegistry.has("heading", "preview")).toBe(true);
    expect(rendererRegistry.has("heading", "copy")).toBe(true);
    expect(rendererRegistry.list()).toHaveLength(4);
  });

  it("returns unsupported_variant for unregistered variant id", () => {
    const article = createTitleHeadingArticleFixture({
      blockType: "title",
      variantId: "title_plain_minimal",
      text: "标题",
    });
    const resolved = resolveArticleStyle(article, styleRegistry);
    resolved.blocks[0]!.variantId = "title-centered";
    resolved.blocks[0]!.variant = {
      ...resolved.blocks[0]!.variant,
      id: "title-centered",
    };

    const block = article.blocks[0]!;
    const { context } = buildBlockRenderContext({
      article,
      blockId: block.id,
      resolvedArticleStyle: resolved,
      mode: "preview",
    });

    expect(context).toBeDefined();
    const result = renderBlock({
      input: {
        article,
        block,
        resolvedArticleStyle: resolved,
        mode: "preview",
        target: "browser_preview",
      },
      registry: rendererRegistry,
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual([
      expect.objectContaining({ code: "unsupported_variant" }),
    ]);
  });

  it("returns missing_resolved_style when style is absent", () => {
    const article = createTitleHeadingArticleFixture({
      blockType: "title",
      variantId: "title_plain_minimal",
      text: "标题",
    });
    const resolved = resolveArticleStyle(article, styleRegistry);
    const stripped = {
      ...resolved,
      blocks: resolved.blocks.filter((entry) => entry.blockId !== article.blocks[0]!.id),
    };
    const block = article.blocks[0]!;

    const result = renderBlock({
      input: {
        article,
        block,
        resolvedArticleStyle: stripped,
        mode: "preview",
        target: "browser_preview",
      },
      registry: rendererRegistry,
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual([
      expect.objectContaining({ code: "missing_resolved_style" }),
    ]);
  });

  it("heading_numbered_section uses index fallback when badge presentation missing", () => {
    const article = createTitleHeadingArticleFixture({
      blockType: "heading",
      variantId: "heading_numbered_section",
      text: "章节",
      meta: { sourceIndex: 3 },
    });
    const resolved = resolveArticleStyle(article, styleRegistry);
    const block = article.blocks[0]!;

    const result = renderBlock({
      input: {
        article,
        block,
        resolvedArticleStyle: resolved,
        mode: "preview",
        target: "browser_preview",
      },
      registry: rendererRegistry,
    });

    expect(result.ok).toBe(true);
    expect(result.output).toMatchObject({
      kind: "title_block_preview",
      slots: expect.objectContaining({
        badge: expect.objectContaining({
          state: "fallback",
          content: "03",
        }),
      }),
    });
  });

  it("heading_top_badge_topic disables badge when presentation and meta label missing", () => {
    const article = createTitleHeadingArticleFixture({
      blockType: "heading",
      variantId: "heading_top_badge_topic",
      text: "章节",
    });
    const resolved = resolveArticleStyle(article, styleRegistry);
    const block = article.blocks[0]!;

    const result = renderBlock({
      input: {
        article,
        block,
        resolvedArticleStyle: resolved,
        mode: "preview",
        target: "browser_preview",
      },
      registry: rendererRegistry,
    });

    expect(result.ok).toBe(true);
    expect(result.output).toMatchObject({
      slots: expect.objectContaining({
        badge: expect.objectContaining({ state: "disabled" }),
      }),
    });
    expect(result.warnings.some((warning) => warning.code === "optional_slot_disabled")).toBe(
      true,
    );
  });

  it("covers all first-wave variant ids in matrix", () => {
    expect(VARIANT_MATRIX.map((entry) => entry.variantId)).toEqual(
      TITLE_BLOCK_FIRST_WAVE_VARIANTS.map((variant) => variant.id),
    );
  });
});

describe("title / heading renderer input contract", () => {
  it("uses Article + ResolvedArticleStyle without parallel models", () => {
    const article = createTitleHeadingArticleFixture({
      blockType: "title",
      variantId: "title_plain_minimal",
      text: "标题",
    });
    const resolved = resolveArticleStyle(
      article,
      parseStyleRegistry(FIRST_WAVE_TITLE_HEADING_VARIANT_REGISTRY),
    );

    const { context } = buildBlockRenderContext({
      article,
      blockId: fixtureBlockId(1),
      resolvedArticleStyle: resolved,
      mode: "copy",
    });

    expect(context?.article).toBe(article);
    expect(context?.resolvedArticleStyle).toBe(resolved);
  });
});
