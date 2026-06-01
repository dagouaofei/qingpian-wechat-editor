import { describe, expect, it } from "vitest";

import {
  createDividerRendererRegistry,
  createListRendererRegistry,
  createTextBlockRendererRegistry,
  createTitleBlockRendererRegistry,
  renderBlock,
  renderTargetForMode,
} from "@/core/renderer";
import { parseStyleRegistry, resolveArticleStyle } from "@/core/styles";
import { fixtureBlockId } from "../../fixtures/articles/shared";
import {
  createListArticleFixture,
  LIST_VARIANT_MATRIX,
  LIST_VARIANT_REGISTRY,
} from "../../fixtures/renderer/list-articles";

describe("list preview renderer", () => {
  const styleRegistry = parseStyleRegistry(LIST_VARIANT_REGISTRY);
  const rendererRegistry = createListRendererRegistry();

  it.each(LIST_VARIANT_MATRIX)(
    "preview renders $variantId successfully",
    ({ variantId, layout, marker }) => {
      const article = createListArticleFixture({ variantId });
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
      expect(result.blockType).toBe("list");
      expect(result.variantId).toBe(variantId);
      expect(result.output).toMatchObject({
        kind: "list_preview",
        layout,
        items: [
          expect.objectContaining({ text: "第一项", marker, sourceIndex: 0 }),
          expect.objectContaining({ text: "第二项", sourceIndex: 1 }),
          expect.objectContaining({ text: "第三项", sourceIndex: 2 }),
        ],
      });
    },
  );

  it("preserves item order and subItems in preview output", () => {
    const article = createListArticleFixture({
      variantId: "list_plain_bullets",
      content: {
        ordered: false,
        items: [
          { text: "A", subItems: ["A1"] },
          { text: "B" },
          { text: "C", subItems: ["C1", "C2"] },
        ],
      },
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
      items: [
        { text: "A", subItems: ["A1"], sourceIndex: 0 },
        { text: "B", subItems: [], sourceIndex: 1 },
        { text: "C", subItems: ["C1", "C2"], sourceIndex: 2 },
      ],
    });
  });

  it("resolves list preview and copy through renderer registry", () => {
    expect(rendererRegistry.has("list", "preview")).toBe(true);
    expect(rendererRegistry.has("list", "copy")).toBe(true);
    expect(rendererRegistry.list()).toHaveLength(2);
  });

  it("returns unsupported_variant for unknown variant id", () => {
    const article = createListArticleFixture({ variantId: "list_plain_bullets" });
    const resolved = resolveArticleStyle(article, styleRegistry);
    resolved.blocks[0]!.variantId = "list_unknown_variant";
    resolved.blocks[0]!.variant = {
      ...resolved.blocks[0]!.variant,
      id: "list_unknown_variant",
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

  it("returns missing_resolved_style when style is absent", () => {
    const article = createListArticleFixture({ variantId: "list_plain_bullets" });
    const resolved = resolveArticleStyle(article, styleRegistry);
    resolved.blocks = resolved.blocks.filter(
      (blockStyle) => blockStyle.blockId !== fixtureBlockId(1),
    );

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
      expect.objectContaining({ code: "missing_resolved_style" }),
    ]);
  });

  it("returns explicit issue when list has no items", () => {
    const article = createListArticleFixture({ variantId: "list_plain_bullets" });
    (article.blocks[0]!.content as { items: unknown[] }).items = [];
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
        path: ["block", "content", "items"],
      }),
    ]);
  });

  it("warns and skips empty item without dropping later valid items", () => {
    const article = createListArticleFixture({ variantId: "list_plain_bullets" });
    (article.blocks[0]!.content as { items: Array<{ text: string }> }).items[1]!.text =
      "";
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
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "invalid_renderer_input" }),
      ]),
    );
    expect(result.output).toMatchObject({
      items: [
        expect.objectContaining({ text: "第一项", sourceIndex: 0 }),
        expect.objectContaining({ text: "第三项", sourceIndex: 2 }),
      ],
    });
  });

  it("does not break existing text-first registries", () => {
    expect(createTitleBlockRendererRegistry().has("title", "preview")).toBe(true);
    expect(createTextBlockRendererRegistry().has("paragraph", "copy")).toBe(true);
    expect(createDividerRendererRegistry().has("divider", "copy")).toBe(true);
  });
});
