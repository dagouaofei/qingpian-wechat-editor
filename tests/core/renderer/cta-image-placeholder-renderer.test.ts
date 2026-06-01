import { describe, expect, it } from "vitest";

import {
  createCtaRendererRegistry,
  createDividerRendererRegistry,
  createHighlightRendererRegistry,
  createImagePlaceholderRendererRegistry,
  createInfoCardRendererRegistry,
  createListRendererRegistry,
  createQuoteRendererRegistry,
  createTextBlockRendererRegistry,
  createTitleBlockRendererRegistry,
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

describe("cta preview renderer", () => {
  const styleRegistry = parseStyleRegistry(CTA_IMAGE_PLACEHOLDER_VARIANT_REGISTRY);
  const rendererRegistry = createCtaRendererRegistry();

  it.each(CTA_VARIANT_MATRIX)(
    "preview renders $variantId successfully",
    ({ variantId, layout, copySafety }) => {
      const article = createCtaArticleFixture({ variantId });
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
      expect(result.blockType).toBe("cta");
      expect(result.variantId).toBe(variantId);
      expect(result.output).toMatchObject({
        kind: "cta_preview",
        layout,
        text: "关注轻篇，获取后续模板更新。",
        action: "查看占位操作",
        actionState: "active",
        copySafety,
      });
    },
  );

  it("resolves cta preview and copy through renderer registry", () => {
    expect(rendererRegistry.has("cta", "preview")).toBe(true);
    expect(rendererRegistry.has("cta", "copy")).toBe(true);
    expect(rendererRegistry.list()).toHaveLength(2);
  });

  it("returns unsupported_variant for unknown cta variant id", () => {
    const article = createCtaArticleFixture({ variantId: "cta_plain_text" });
    const resolved = resolveArticleStyle(article, styleRegistry);
    resolved.blocks[0]!.variantId = "cta_unknown_variant";
    resolved.blocks[0]!.variant = {
      ...resolved.blocks[0]!.variant,
      id: "cta_unknown_variant",
    };

    const result = renderBlock({
      input: {
        article,
        block: article.blocks[0]!,
        resolvedArticleStyle: resolved,
        mode: "preview",
        target: "browser_preview",
      },
      registry: rendererRegistry,
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "unsupported_variant" }),
      ]),
    );
  });

  it("returns explicit issue when cta text is missing", () => {
    const article = createCtaArticleFixture({ variantId: "cta_plain_text" });
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
      registry: rendererRegistry,
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual([
      expect.objectContaining({
        code: "invalid_renderer_input",
        path: ["block", "content", "text"],
      }),
    ]);
  });

  it("marks optional action disabled when absent", () => {
    const article = createCtaArticleFixture({
      variantId: "cta_button_like",
      content: { text: "只保留主文本" },
    });
    const resolved = resolveArticleStyle(article, styleRegistry);

    const result = renderBlock({
      input: {
        article,
        block: article.blocks[0]!,
        resolvedArticleStyle: resolved,
        mode: "preview",
        target: "browser_preview",
      },
      registry: rendererRegistry,
    });

    expect(result.ok).toBe(true);
    expect(result.output).toMatchObject({ actionState: "disabled" });
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "optional_slot_disabled", slotId: "action" }),
      ]),
    );
  });
});

describe("image_placeholder preview renderer", () => {
  const styleRegistry = parseStyleRegistry(CTA_IMAGE_PLACEHOLDER_VARIANT_REGISTRY);
  const rendererRegistry = createImagePlaceholderRendererRegistry();

  it.each(IMAGE_PLACEHOLDER_VARIANT_MATRIX)(
    "preview renders $variantId successfully",
    ({ variantId, layout, copySafety }) => {
      const article = createImagePlaceholderArticleFixture({ variantId });
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
      expect(result.blockType).toBe("image_placeholder");
      expect(result.variantId).toBe(variantId);
      expect(result.output).toMatchObject({
        kind: "image_placeholder_preview",
        layout,
        caption: "这里需要一张产品截图",
        captionState: "active",
        suggestion: "后续由人工补充图片资源",
        suggestionState: "active",
        aspectRatio: "16:9",
        position: "full",
        copySafety,
      });
    },
  );

  it("resolves image_placeholder preview and copy through renderer registry", () => {
    expect(rendererRegistry.has("image_placeholder", "preview")).toBe(true);
    expect(rendererRegistry.has("image_placeholder", "copy")).toBe(true);
    expect(rendererRegistry.list()).toHaveLength(2);
  });

  it("returns unsupported_variant for unknown image_placeholder variant id", () => {
    const article = createImagePlaceholderArticleFixture({
      variantId: "image_placeholder_simple",
    });
    const resolved = resolveArticleStyle(article, styleRegistry);
    resolved.blocks[0]!.variantId = "image_placeholder_unknown_variant";
    resolved.blocks[0]!.variant = {
      ...resolved.blocks[0]!.variant,
      id: "image_placeholder_unknown_variant",
    };

    const result = renderBlock({
      input: {
        article,
        block: article.blocks[0]!,
        resolvedArticleStyle: resolved,
        mode: "preview",
        target: "browser_preview",
      },
      registry: rendererRegistry,
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "unsupported_variant" }),
      ]),
    );
  });

  it("marks optional caption and suggestion disabled when absent", () => {
    const article = createImagePlaceholderArticleFixture({
      variantId: "image_placeholder_caption",
      content: {},
    });
    const resolved = resolveArticleStyle(article, styleRegistry);

    const result = renderBlock({
      input: {
        article,
        block: article.blocks[0]!,
        resolvedArticleStyle: resolved,
        mode: "preview",
        target: "browser_preview",
      },
      registry: rendererRegistry,
    });

    expect(result.ok).toBe(true);
    expect(result.output).toMatchObject({
      captionState: "disabled",
      suggestionState: "disabled",
      aspectRatio: "16:9",
      position: "full",
    });
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "optional_slot_disabled", slotId: "image" }),
        expect.objectContaining({ code: "optional_slot_disabled", slotId: "caption" }),
        expect.objectContaining({ code: "optional_slot_disabled", slotId: "suggestion" }),
      ]),
    );
  });

  it("does not break existing renderer registries", () => {
    expect(createTitleBlockRendererRegistry().has("title", "preview")).toBe(true);
    expect(createTextBlockRendererRegistry().has("paragraph", "copy")).toBe(true);
    expect(createDividerRendererRegistry().has("divider", "copy")).toBe(true);
    expect(createListRendererRegistry().has("list", "copy")).toBe(true);
    expect(createQuoteRendererRegistry().has("quote", "copy")).toBe(true);
    expect(createHighlightRendererRegistry().has("highlight", "copy")).toBe(true);
    expect(createInfoCardRendererRegistry().has("info_card", "copy")).toBe(true);
  });
});
