import { describe, expect, it } from "vitest";

import {
  createDividerRendererRegistry,
  createHighlightRendererRegistry,
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
  createInfoCardArticleFixture,
  INFO_CARD_VARIANT_MATRIX,
  INFO_CARD_VARIANT_REGISTRY,
} from "../../fixtures/renderer/info-card-articles";

describe("info_card preview renderer", () => {
  const styleRegistry = parseStyleRegistry(INFO_CARD_VARIANT_REGISTRY);
  const rendererRegistry = createInfoCardRendererRegistry();

  it.each(INFO_CARD_VARIANT_MATRIX)(
    "preview renders $variantId successfully",
    ({ variantId, layout }) => {
      const article = createInfoCardArticleFixture({ variantId });
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
      expect(result.blockType).toBe("info_card");
      expect(result.variantId).toBe(variantId);
      expect(result.output).toMatchObject({
        kind: "info_card_preview",
        layout,
        title: "关键结论",
        titleState: "active",
        body: "这是信息卡正文。\n这是第二行说明。",
        bodyLines: ["这是信息卡正文。", "这是第二行说明。"],
        icon: "注意",
        iconState: "active",
      });
    },
  );

  it("resolves info_card preview and copy through renderer registry", () => {
    expect(rendererRegistry.has("info_card", "preview")).toBe(true);
    expect(rendererRegistry.has("info_card", "copy")).toBe(true);
    expect(rendererRegistry.list()).toHaveLength(2);
  });

  it("returns unsupported_variant for unknown variant id", () => {
    const article = createInfoCardArticleFixture({
      variantId: "info_card_key_takeaway",
    });
    const resolved = resolveArticleStyle(article, styleRegistry);
    resolved.blocks[0]!.variantId = "info_card_unknown_variant";
    resolved.blocks[0]!.variant = {
      ...resolved.blocks[0]!.variant,
      id: "info_card_unknown_variant",
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

  it("returns explicit issue when body is missing", () => {
    const article = createInfoCardArticleFixture({
      variantId: "info_card_key_takeaway",
    });
    delete (article.blocks[0]!.content as { body?: string }).body;
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
        path: ["block", "content", "body"],
      }),
    ]);
  });

  it("returns explicit issue when body is empty", () => {
    const article = createInfoCardArticleFixture({
      variantId: "info_card_steps",
    });
    (article.blocks[0]!.content as { body: string }).body = "";
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
        path: ["block", "content", "body"],
      }),
    ]);
  });

  it("marks optional title and icon disabled when absent", () => {
    const article = createInfoCardArticleFixture({
      variantId: "info_card_key_takeaway",
      content: { body: "只有正文" },
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
      titleState: "disabled",
      iconState: "disabled",
    });
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "optional_slot_disabled", slotId: "title" }),
        expect.objectContaining({ code: "optional_slot_disabled", slotId: "icon" }),
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
  });
});
