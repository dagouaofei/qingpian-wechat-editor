import { describe, expect, it } from "vitest";

import {
  createTextBlockRendererRegistry,
  createTitleBlockRendererRegistry,
  createDividerRendererRegistry,
  renderBlock,
  renderTargetForMode,
} from "@/core/renderer";
import { parseStyleRegistry, resolveArticleStyle } from "@/core/styles";
import {
  createDividerArticleFixture,
  DIVIDER_VARIANT_MATRIX,
  DIVIDER_VARIANT_REGISTRY,
} from "../../fixtures/renderer/divider-articles";
import { fixtureBlockId } from "../../fixtures/articles/shared";

describe("divider preview renderer", () => {
  const styleRegistry = parseStyleRegistry(DIVIDER_VARIANT_REGISTRY);
  const rendererRegistry = createDividerRendererRegistry();

  it.each(DIVIDER_VARIANT_MATRIX)(
    "preview renders $variantId successfully",
    ({ variantId, layout }) => {
      const article = createDividerArticleFixture({ variantId });
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
      expect(result.blockType).toBe("divider");
      expect(result.variantId).toBe(variantId);
      expect(result.output).toMatchObject({
        kind: "divider_preview",
        layout,
      });
    },
  );

  it("does not depend on divider content.text", () => {
    const article = createDividerArticleFixture({
      variantId: "divider_simple_line",
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
    expect(result.output).toMatchObject({ kind: "divider_preview" });
  });

  it("resolves all 3 variants through renderer registry", () => {
    expect(rendererRegistry.has("divider", "preview")).toBe(true);
    expect(rendererRegistry.has("divider", "copy")).toBe(true);
    expect(rendererRegistry.list()).toHaveLength(2);
  });

  it("returns unsupported_variant for unknown variant id", () => {
    const article = createDividerArticleFixture({
      variantId: "divider_simple_line",
    });
    const resolved = resolveArticleStyle(article, styleRegistry);
    resolved.blocks[0]!.variantId = "divider_unknown_variant";
    resolved.blocks[0]!.variant = {
      ...resolved.blocks[0]!.variant,
      id: "divider_unknown_variant",
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
    const article = createDividerArticleFixture({
      variantId: "divider_simple_line",
    });
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

  it("does not register title or text block renderers", () => {
    expect(rendererRegistry.has("title", "preview")).toBe(false);
    expect(rendererRegistry.has("lead", "preview")).toBe(false);
    expect(rendererRegistry.has("paragraph", "copy")).toBe(false);
  });

  it("does not break existing title and text block registries", () => {
    const titleRegistry = createTitleBlockRendererRegistry();
    const textRegistry = createTextBlockRendererRegistry();

    expect(titleRegistry.has("title", "preview")).toBe(true);
    expect(textRegistry.has("lead", "copy")).toBe(true);
    expect(titleRegistry.list()).toHaveLength(4);
    expect(textRegistry.list()).toHaveLength(4);
  });
});
