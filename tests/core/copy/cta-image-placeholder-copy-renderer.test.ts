import { describe, expect, it } from "vitest";

import {
  assertCtaCopySafeCss,
  copyHtmlUsesInlineStyleOnly as ctaCopyHtmlUsesInlineStyleOnly,
  renderCtaCopyHtml,
} from "@/core/copy/cta-copy";
import {
  assertImagePlaceholderCopySafeCss,
  copyHtmlUsesInlineStyleOnly as imagePlaceholderCopyHtmlUsesInlineStyleOnly,
  renderImagePlaceholderCopyHtml,
} from "@/core/copy/image-placeholder-copy";
import {
  buildBlockRenderContext,
  createCtaRendererRegistry,
  createImagePlaceholderRendererRegistry,
  renderBlock,
  renderTargetForMode,
} from "@/core/renderer";
import { parseStyleRegistry, resolveArticleStyle } from "@/core/styles";
import {
  CTA_IMAGE_PLACEHOLDER_VARIANT_REGISTRY,
  CTA_VARIANT_MATRIX,
  IMAGE_PLACEHOLDER_VARIANT_MATRIX,
  createCtaArticleFixture,
  createImagePlaceholderArticleFixture,
} from "../../fixtures/renderer/cta-image-placeholder-articles";

describe("cta copy renderer", () => {
  const styleRegistry = parseStyleRegistry(CTA_IMAGE_PLACEHOLDER_VARIANT_REGISTRY);
  const rendererRegistry = createCtaRendererRegistry();

  it.each(CTA_VARIANT_MATRIX)(
    "copy renders $variantId successfully",
    ({ variantId, layout, copySafety }) => {
      const article = createCtaArticleFixture({ variantId });
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
        registry: rendererRegistry,
      });

      expect(result.ok).toBe(true);
      expect(result.mode).toBe("copy");
      expect(result.target).toBe("wechat_copy");
      expect(result.blockType).toBe("cta");
      expect(result.variantId).toBe(variantId);
      expect(result.output).toMatchObject({
        kind: "cta_copy_html",
        layout,
        copySafety,
        placeholderOnly: true,
      });

      const html = (result.output as { html: string }).html;
      expect(ctaCopyHtmlUsesInlineStyleOnly(html)).toBe(true);
      assertCtaCopySafeCss(html);
      expect(html).toContain("关注轻篇，获取后续模板更新。");
    },
  );

  it("cta_button_like uses stable DOM text and does not output a real button", () => {
    const article = createCtaArticleFixture({
      variantId: "cta_button_like",
      content: { text: "加入内测", action: "点击占位文案" },
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
      registry: rendererRegistry,
    });

    const html = (result.output as { html: string }).html;
    expect(html).toContain("点击占位文案");
    expect(html).toContain("border-radius:16px");
    expect(html).not.toMatch(/<button\b/i);
    expect(html).not.toMatch(/<a\b|href\s*=/i);
  });

  it("cta_qr_placeholder renders placeholder text without QR images", () => {
    const article = createCtaArticleFixture({
      variantId: "cta_qr_placeholder",
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
      registry: rendererRegistry,
    });

    const html = (result.output as { html: string }).html;
    expect(html).toContain("QR placeholder only; no QR generated");
    expect(html).not.toMatch(/<img\b/i);
    expect(html).not.toMatch(/qrcode|qr-code/i);
  });

  it("escapes cta text and action HTML content", () => {
    const article = createCtaArticleFixture({
      variantId: "cta_plain_text",
      content: { text: "A < B", action: "Go & \"read\"" },
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
      registry: rendererRegistry,
    });

    const html = (result.output as { html: string }).html;
    expect(html).toContain("A &lt; B");
    expect(html).toContain("Go &amp; &quot;read&quot;");
    expect(html).not.toContain("A < B");
  });

  it("strict cta variant does not emit balanced copy safety warning", () => {
    const article = createCtaArticleFixture({ variantId: "cta_plain_text" });
    const resolved = resolveArticleStyle(article, styleRegistry);

    const result = renderBlock({
      input: {
        article,
        block: article.blocks[0]!,
        resolvedArticleStyle: resolved,
        mode: "copy",
        target: "wechat_copy",
      },
      registry: rendererRegistry,
    });

    expect(result.ok).toBe(true);
    expect(result.warnings).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "copy_safety_warning" }),
      ]),
    );
  });

  it("balanced cta variants emit copy safety warning without blocking render", () => {
    for (const { variantId, copySafety } of CTA_VARIANT_MATRIX) {
      const article = createCtaArticleFixture({ variantId });
      const resolved = resolveArticleStyle(article, styleRegistry);

      const result = renderBlock({
        input: {
          article,
          block: article.blocks[0]!,
          resolvedArticleStyle: resolved,
          mode: "copy",
          target: "wechat_copy",
        },
        registry: rendererRegistry,
      });

      expect(result.ok).toBe(true);
      if (copySafety === "balanced") {
        expect(result.warnings).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ code: "copy_safety_warning" }),
          ]),
        );
      }
    }
  });

  it("cta copy html avoids unsafe copy constructs", () => {
    const article = createCtaArticleFixture({
      variantId: "cta_button_like",
    });
    const resolved = resolveArticleStyle(article, styleRegistry);
    const { context } = buildBlockRenderContext({
      article,
      blockId: article.blocks[0]!.id,
      resolvedArticleStyle: resolved,
      mode: "copy",
    });

    const { output } = renderCtaCopyHtml(context!);
    assertCtaCopySafeCss(output.html);
    expect(output.html).not.toMatch(/\bclass\s*=/);
    expect(output.html).not.toMatch(/<style[\s>]/i);
    expect(output.html).not.toMatch(/var\s*\(/i);
    expect(output.html).not.toMatch(/\bposition\s*:\s*absolute/i);
    expect(output.html).not.toMatch(/\btransform\s*:/i);
    expect(output.html).not.toMatch(/::/);
    expect(output.html).not.toMatch(/\bdisplay\s*:\s*(flex|grid)/i);
  });
});

describe("image_placeholder copy renderer", () => {
  const styleRegistry = parseStyleRegistry(CTA_IMAGE_PLACEHOLDER_VARIANT_REGISTRY);
  const rendererRegistry = createImagePlaceholderRendererRegistry();

  it.each(IMAGE_PLACEHOLDER_VARIANT_MATRIX)(
    "copy renders $variantId successfully",
    ({ variantId, layout, copySafety }) => {
      const article = createImagePlaceholderArticleFixture({ variantId });
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
        registry: rendererRegistry,
      });

      expect(result.ok).toBe(true);
      expect(result.mode).toBe("copy");
      expect(result.target).toBe("wechat_copy");
      expect(result.blockType).toBe("image_placeholder");
      expect(result.variantId).toBe(variantId);
      expect(result.output).toMatchObject({
        kind: "image_placeholder_copy_html",
        layout,
        copySafety,
        placeholderOnly: true,
      });

      const html = (result.output as { html: string }).html;
      expect(imagePlaceholderCopyHtmlUsesInlineStyleOnly(html)).toBe(true);
      assertImagePlaceholderCopySafeCss(html);
      expect(html).toContain("Image placeholder only; no image resource rendered");
    },
  );

  it("image_placeholder_caption renders caption and suggestion text", () => {
    const article = createImagePlaceholderArticleFixture({
      variantId: "image_placeholder_caption",
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
      registry: rendererRegistry,
    });

    const html = (result.output as { html: string }).html;
    expect(html).toContain("这里需要一张产品截图");
    expect(html).toContain("后续由人工补充图片资源");
    expect(html).toContain("font-size:16px");
    expect(html).toContain("line-height:1.7");
  });

  it("image_placeholder_card keeps a lightweight card without real image output", () => {
    const article = createImagePlaceholderArticleFixture({
      variantId: "image_placeholder_card",
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
      registry: rendererRegistry,
    });

    const html = (result.output as { html: string }).html;
    expect(html).toContain("border-radius:8px");
    expect(html).not.toMatch(/<img\b/i);
  });

  it("escapes image placeholder caption and suggestion HTML content", () => {
    const article = createImagePlaceholderArticleFixture({
      variantId: "image_placeholder_caption",
      content: {
        caption: "A < B",
        suggestion: "Use & \"source\"",
      },
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
      registry: rendererRegistry,
    });

    const html = (result.output as { html: string }).html;
    expect(html).toContain("A &lt; B");
    expect(html).toContain("Use &amp; &quot;source&quot;");
    expect(html).not.toContain("A < B");
  });

  it("strict image placeholder variant does not emit balanced warning", () => {
    const article = createImagePlaceholderArticleFixture({
      variantId: "image_placeholder_simple",
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
      registry: rendererRegistry,
    });

    expect(result.ok).toBe(true);
    expect(result.warnings).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "copy_safety_warning" }),
      ]),
    );
  });

  it("balanced image placeholder variants warn without blocking render", () => {
    for (const { variantId, copySafety } of IMAGE_PLACEHOLDER_VARIANT_MATRIX) {
      const article = createImagePlaceholderArticleFixture({ variantId });
      const resolved = resolveArticleStyle(article, styleRegistry);

      const result = renderBlock({
        input: {
          article,
          block: article.blocks[0]!,
          resolvedArticleStyle: resolved,
          mode: "copy",
          target: "wechat_copy",
        },
        registry: rendererRegistry,
      });

      expect(result.ok).toBe(true);
      if (copySafety === "balanced") {
        expect(result.warnings).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ code: "copy_safety_warning" }),
          ]),
        );
      }
    }
  });

  it("image placeholder copy html avoids unsafe copy constructs", () => {
    const article = createImagePlaceholderArticleFixture({
      variantId: "image_placeholder_card",
    });
    const resolved = resolveArticleStyle(article, styleRegistry);
    const { context } = buildBlockRenderContext({
      article,
      blockId: article.blocks[0]!.id,
      resolvedArticleStyle: resolved,
      mode: "copy",
    });

    const { output } = renderImagePlaceholderCopyHtml(context!);
    assertImagePlaceholderCopySafeCss(output.html);
    expect(output.html).not.toMatch(/\bclass\s*=/);
    expect(output.html).not.toMatch(/<style[\s>]/i);
    expect(output.html).not.toMatch(/var\s*\(/i);
    expect(output.html).not.toMatch(/\bposition\s*:\s*absolute/i);
    expect(output.html).not.toMatch(/\btransform\s*:/i);
    expect(output.html).not.toMatch(/::/);
    expect(output.html).not.toMatch(/\bdisplay\s*:\s*(flex|grid)/i);
  });
});
