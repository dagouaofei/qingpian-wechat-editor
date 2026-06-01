import { describe, expect, it } from "vitest";

import {
  createDividerRendererRegistry,
  createHighlightRendererRegistry,
  createListRendererRegistry,
  createQuoteRendererRegistry,
  createTextBlockRendererRegistry,
  createTitleBlockRendererRegistry,
  renderBlock,
  renderTargetForMode,
} from "@/core/renderer";
import { parseStyleRegistry, resolveArticleStyle } from "@/core/styles";
import {
  createHighlightArticleFixture,
  createQuoteArticleFixture,
  HIGHLIGHT_VARIANT_MATRIX,
  QUOTE_HIGHLIGHT_VARIANT_REGISTRY,
  QUOTE_VARIANT_MATRIX,
} from "../../fixtures/renderer/quote-highlight-articles";

describe("quote / highlight preview renderer", () => {
  const styleRegistry = parseStyleRegistry(QUOTE_HIGHLIGHT_VARIANT_REGISTRY);
  const quoteRegistry = createQuoteRendererRegistry();
  const highlightRegistry = createHighlightRendererRegistry();

  it.each(QUOTE_VARIANT_MATRIX)(
    "quote preview renders $variantId successfully",
    ({ variantId, layout }) => {
      const article = createQuoteArticleFixture({ variantId });
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
        registry: quoteRegistry,
      });

      expect(result.ok).toBe(true);
      expect(result.blockType).toBe("quote");
      expect(result.variantId).toBe(variantId);
      expect(result.output).toMatchObject({
        kind: "quote_preview",
        layout,
        text: "保持长期主义，才能穿越周期。",
        attribution: "轻篇编辑部",
        attributionState: "active",
      });
    },
  );

  it.each(HIGHLIGHT_VARIANT_MATRIX)(
    "highlight preview renders $variantId successfully",
    ({ variantId, layout }) => {
      const article = createHighlightArticleFixture({ variantId });
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
        registry: highlightRegistry,
      });

      expect(result.ok).toBe(true);
      expect(result.blockType).toBe("highlight");
      expect(result.variantId).toBe(variantId);
      expect(result.output).toMatchObject({
        kind: "highlight_preview",
        layout,
        text: "这是本段的核心观点。",
        label: "重点",
        labelState: "active",
      });
    },
  );

  it("resolves quote and highlight preview/copy through registries", () => {
    expect(quoteRegistry.has("quote", "preview")).toBe(true);
    expect(quoteRegistry.has("quote", "copy")).toBe(true);
    expect(highlightRegistry.has("highlight", "preview")).toBe(true);
    expect(highlightRegistry.has("highlight", "copy")).toBe(true);
    expect(quoteRegistry.list()).toHaveLength(2);
    expect(highlightRegistry.list()).toHaveLength(2);
  });

  it("returns unsupported_variant for quote unknown variant id", () => {
    const article = createQuoteArticleFixture({ variantId: "quote_plain" });
    const resolved = resolveArticleStyle(article, styleRegistry);
    resolved.blocks[0]!.variantId = "quote_unknown_variant";
    resolved.blocks[0]!.variant = {
      ...resolved.blocks[0]!.variant,
      id: "quote_unknown_variant",
    };

    const result = renderBlock({
      input: {
        article,
        block: article.blocks[0]!,
        resolvedArticleStyle: resolved,
        mode: "preview",
        target: "browser_preview",
      },
      registry: quoteRegistry,
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "unsupported_variant" }),
      ]),
    );
  });

  it("returns unsupported_variant for highlight unknown variant id", () => {
    const article = createHighlightArticleFixture({
      variantId: "highlight_inline_emphasis",
    });
    const resolved = resolveArticleStyle(article, styleRegistry);
    resolved.blocks[0]!.variantId = "highlight_unknown_variant";
    resolved.blocks[0]!.variant = {
      ...resolved.blocks[0]!.variant,
      id: "highlight_unknown_variant",
    };

    const result = renderBlock({
      input: {
        article,
        block: article.blocks[0]!,
        resolvedArticleStyle: resolved,
        mode: "preview",
        target: "browser_preview",
      },
      registry: highlightRegistry,
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "unsupported_variant" }),
      ]),
    );
  });

  it("returns explicit issue when quote text is empty", () => {
    const article = createQuoteArticleFixture({ variantId: "quote_plain" });
    (article.blocks[0]!.content as { text: string }).text = "";
    const resolved = resolveArticleStyle(article, styleRegistry);

    const result = renderBlock({
      input: {
        article,
        block: article.blocks[0]!,
        resolvedArticleStyle: resolved,
        mode: "preview",
        target: "browser_preview",
      },
      registry: quoteRegistry,
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual([
      expect.objectContaining({
        code: "invalid_renderer_input",
        path: ["block", "content", "text"],
      }),
    ]);
  });

  it("returns explicit issue when highlight text is missing", () => {
    const article = createHighlightArticleFixture({
      variantId: "highlight_inline_emphasis",
    });
    delete (article.blocks[0]!.content as { text?: string }).text;
    const resolved = resolveArticleStyle(article, styleRegistry);

    const result = renderBlock({
      input: {
        article,
        block: article.blocks[0]!,
        resolvedArticleStyle: resolved,
        mode: "preview",
        target: "browser_preview",
      },
      registry: highlightRegistry,
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual([
      expect.objectContaining({
        code: "invalid_renderer_input",
        path: ["block", "content", "text"],
      }),
    ]);
  });

  it("marks optional attribution and label disabled when absent", () => {
    const quoteArticle = createQuoteArticleFixture({
      variantId: "quote_plain",
      content: { text: "无来源引用" },
    });
    const quoteResolved = resolveArticleStyle(quoteArticle, styleRegistry);
    const quote = renderBlock({
      input: {
        article: quoteArticle,
        block: quoteArticle.blocks[0]!,
        resolvedArticleStyle: quoteResolved,
        mode: "preview",
        target: "browser_preview",
      },
      registry: quoteRegistry,
    });

    const highlightArticle = createHighlightArticleFixture({
      variantId: "highlight_inline_emphasis",
      content: { text: "无标签重点" },
    });
    const highlightResolved = resolveArticleStyle(highlightArticle, styleRegistry);
    const highlight = renderBlock({
      input: {
        article: highlightArticle,
        block: highlightArticle.blocks[0]!,
        resolvedArticleStyle: highlightResolved,
        mode: "preview",
        target: "browser_preview",
      },
      registry: highlightRegistry,
    });

    expect(quote.ok).toBe(true);
    expect(quote.output).toMatchObject({ attributionState: "disabled" });
    expect(quote.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "optional_slot_disabled" }),
      ]),
    );
    expect(highlight.ok).toBe(true);
    expect(highlight.output).toMatchObject({ labelState: "disabled" });
    expect(highlight.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "optional_slot_disabled" }),
      ]),
    );
  });

  it("does not break existing list and text-first registries", () => {
    expect(createTitleBlockRendererRegistry().has("title", "preview")).toBe(true);
    expect(createTextBlockRendererRegistry().has("paragraph", "copy")).toBe(true);
    expect(createDividerRendererRegistry().has("divider", "copy")).toBe(true);
    expect(createListRendererRegistry().has("list", "copy")).toBe(true);
  });
});
