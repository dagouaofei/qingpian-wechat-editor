import { describe, expect, it } from "vitest";

import {
  assertHighlightCopySafeCss,
  copyHtmlUsesInlineStyleOnly as highlightCopyHtmlUsesInlineStyleOnly,
  renderHighlightCopyHtml,
} from "@/core/copy/highlight-copy";
import {
  assertQuoteCopySafeCss,
  copyHtmlUsesInlineStyleOnly as quoteCopyHtmlUsesInlineStyleOnly,
  renderQuoteCopyHtml,
} from "@/core/copy/quote-copy";
import {
  buildBlockRenderContext,
  createHighlightRendererRegistry,
  createQuoteRendererRegistry,
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

describe("quote / highlight copy renderer", () => {
  const styleRegistry = parseStyleRegistry(QUOTE_HIGHLIGHT_VARIANT_REGISTRY);
  const quoteRegistry = createQuoteRendererRegistry();
  const highlightRegistry = createHighlightRendererRegistry();

  it.each(QUOTE_VARIANT_MATRIX)(
    "quote copy renders $variantId successfully",
    ({ variantId, layout }) => {
      const article = createQuoteArticleFixture({ variantId });
      const resolved = resolveArticleStyle(article, styleRegistry);
      const block = article.blocks[0]!;

      const result = renderBlock({
        input: {
          article,
          block,
          resolvedArticleStyle: resolved,
          mode: "copy",
          target: renderTargetForMode("copy"),
        },
        registry: quoteRegistry,
      });

      expect(result.ok).toBe(true);
      expect(result.mode).toBe("copy");
      expect(result.target).toBe("wechat_copy");
      expect(result.blockType).toBe("quote");
      expect(result.variantId).toBe(variantId);
      expect(result.output).toMatchObject({ kind: "quote_copy_html", layout });

      const html = (result.output as { html: string }).html;
      expect(quoteCopyHtmlUsesInlineStyleOnly(html)).toBe(true);
      assertQuoteCopySafeCss(html);
      expect(html).toContain("保持长期主义");
      expect(html).toContain("轻篇编辑部");
    },
  );

  it.each(HIGHLIGHT_VARIANT_MATRIX)(
    "highlight copy renders $variantId successfully",
    ({ variantId, layout }) => {
      const article = createHighlightArticleFixture({ variantId });
      const resolved = resolveArticleStyle(article, styleRegistry);
      const block = article.blocks[0]!;

      const result = renderBlock({
        input: {
          article,
          block,
          resolvedArticleStyle: resolved,
          mode: "copy",
          target: renderTargetForMode("copy"),
        },
        registry: highlightRegistry,
      });

      expect(result.ok).toBe(true);
      expect(result.mode).toBe("copy");
      expect(result.target).toBe("wechat_copy");
      expect(result.blockType).toBe("highlight");
      expect(result.variantId).toBe(variantId);
      expect(result.output).toMatchObject({
        kind: "highlight_copy_html",
        layout,
      });

      const html = (result.output as { html: string }).html;
      expect(highlightCopyHtmlUsesInlineStyleOnly(html)).toBe(true);
      assertHighlightCopySafeCss(html);
      expect(html).toContain("这是本段的核心观点。");
      expect(html).toContain("重点");
    },
  );

  it("quote_plain is strict and does not emit balanced warning", () => {
    const article = createQuoteArticleFixture({ variantId: "quote_plain" });
    const resolved = resolveArticleStyle(article, styleRegistry);

    const result = renderBlock({
      input: {
        article,
        block: article.blocks[0]!,
        resolvedArticleStyle: resolved,
        mode: "copy",
        target: "wechat_copy",
      },
      registry: quoteRegistry,
    });

    expect(result.warnings.some((warning) => warning.code === "copy_safety_warning")).toBe(
      false,
    );
  });

  it("balanced quote variants emit copy safety warning", () => {
    for (const variantId of ["quote_left_bar", "quote_card"]) {
      const article = createQuoteArticleFixture({ variantId });
      const resolved = resolveArticleStyle(article, styleRegistry);

      const result = renderBlock({
        input: {
          article,
          block: article.blocks[0]!,
          resolvedArticleStyle: resolved,
          mode: "copy",
          target: "wechat_copy",
        },
        registry: quoteRegistry,
      });

      expect(result.ok).toBe(true);
      expect(result.warnings).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ code: "copy_safety_warning" }),
        ]),
      );
    }
  });

  it("strict highlight variant does not emit balanced warning", () => {
    const article = createHighlightArticleFixture({
      variantId: "highlight_inline_emphasis",
    });
    const resolved = resolveArticleStyle(article, styleRegistry);

    const result = renderBlock({
      input: {
        article,
        block: article.blocks[0]!,
        resolvedArticleStyle: resolved,
        mode: "copy",
        target: "wechat_copy",
      },
      registry: highlightRegistry,
    });

    expect(result.warnings.some((warning) => warning.code === "copy_safety_warning")).toBe(
      false,
    );
  });

  it("balanced highlight variants emit copy safety warning", () => {
    for (const variantId of ["highlight_accent_band", "highlight_soft_card"]) {
      const article = createHighlightArticleFixture({ variantId });
      const resolved = resolveArticleStyle(article, styleRegistry);

      const result = renderBlock({
        input: {
          article,
          block: article.blocks[0]!,
          resolvedArticleStyle: resolved,
          mode: "copy",
          target: "wechat_copy",
        },
        registry: highlightRegistry,
      });

      expect(result.ok).toBe(true);
      expect(result.warnings).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ code: "copy_safety_warning" }),
        ]),
      );
    }
  });

  it("escapes quote and highlight HTML content", () => {
    const quoteArticle = createQuoteArticleFixture({
      variantId: "quote_plain",
      content: { text: "A < B & C", attribution: "\"source\"" },
    });
    const quoteResolved = resolveArticleStyle(quoteArticle, styleRegistry);
    const quote = renderBlock({
      input: {
        article: quoteArticle,
        block: quoteArticle.blocks[0]!,
        resolvedArticleStyle: quoteResolved,
        mode: "copy",
        target: "wechat_copy",
      },
      registry: quoteRegistry,
    });

    const highlightArticle = createHighlightArticleFixture({
      variantId: "highlight_inline_emphasis",
      content: { text: "X < Y", label: "A&B" },
    });
    const highlightResolved = resolveArticleStyle(highlightArticle, styleRegistry);
    const highlight = renderBlock({
      input: {
        article: highlightArticle,
        block: highlightArticle.blocks[0]!,
        resolvedArticleStyle: highlightResolved,
        mode: "copy",
        target: "wechat_copy",
      },
      registry: highlightRegistry,
    });

    expect((quote.output as { html: string }).html).toContain("A &lt; B &amp; C");
    expect((quote.output as { html: string }).html).toContain("&quot;source&quot;");
    expect((highlight.output as { html: string }).html).toContain("X &lt; Y");
    expect((highlight.output as { html: string }).html).toContain("A&amp;B");
  });

  it("quote_left_bar uses real DOM border-left and no pseudo element", () => {
    const article = createQuoteArticleFixture({ variantId: "quote_left_bar" });
    const resolved = resolveArticleStyle(article, styleRegistry);
    const { context } = buildBlockRenderContext({
      article,
      blockId: article.blocks[0]!.id,
      resolvedArticleStyle: resolved,
      mode: "copy",
    });

    const { output } = renderQuoteCopyHtml(context!);
    expect(output.html).toContain("border-left:3px solid #576b95");
    expect(output.html).not.toMatch(/::/);
    assertQuoteCopySafeCss(output.html);
  });

  it("highlight_inline_emphasis stays lightweight instead of a heavy card", () => {
    const article = createHighlightArticleFixture({
      variantId: "highlight_inline_emphasis",
    });
    const resolved = resolveArticleStyle(article, styleRegistry);
    const { context } = buildBlockRenderContext({
      article,
      blockId: article.blocks[0]!.id,
      resolvedArticleStyle: resolved,
      mode: "copy",
    });

    const { output } = renderHighlightCopyHtml(context!);
    expect(output.html).toContain("border-left:2px solid #576b95");
    expect(output.html).not.toContain("background-color:#f9f9f9");
    expect(output.html).not.toContain("border-radius:8px");
    assertHighlightCopySafeCss(output.html);
  });

  it("copy html avoids className, style tag, css vars, absolute, transform, pseudo elements", () => {
    const quoteArticle = createQuoteArticleFixture({ variantId: "quote_card" });
    const quoteResolved = resolveArticleStyle(quoteArticle, styleRegistry);
    const quoteContext = buildBlockRenderContext({
      article: quoteArticle,
      blockId: quoteArticle.blocks[0]!.id,
      resolvedArticleStyle: quoteResolved,
      mode: "copy",
    }).context!;
    const quoteOutput = renderQuoteCopyHtml(quoteContext).output;

    const highlightArticle = createHighlightArticleFixture({
      variantId: "highlight_accent_band",
    });
    const highlightResolved = resolveArticleStyle(highlightArticle, styleRegistry);
    const highlightContext = buildBlockRenderContext({
      article: highlightArticle,
      blockId: highlightArticle.blocks[0]!.id,
      resolvedArticleStyle: highlightResolved,
      mode: "copy",
    }).context!;
    const highlightOutput = renderHighlightCopyHtml(highlightContext).output;

    for (const html of [quoteOutput.html, highlightOutput.html]) {
      expect(html).not.toMatch(/\bclass\s*=/);
      expect(html).not.toMatch(/<style[\s>]/i);
      expect(html).not.toMatch(/var\s*\(/i);
      expect(html).not.toMatch(/\bposition\s*:\s*absolute/i);
      expect(html).not.toMatch(/\btransform\s*:/i);
      expect(html).not.toMatch(/::/);
    }
  });
});
