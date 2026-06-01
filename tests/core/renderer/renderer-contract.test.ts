import { describe, expect, it } from "vitest";

import { parseArticle } from "@/core/article";
import {
  RENDER_MODES,
  RENDER_TARGETS,
  buildBlockRenderContext,
  createBlockRendererRegistry,
  createRendererIssue,
  enrichResolvedBlockStyleForRenderer,
  getResolvedComponentProtocol,
  renderBlock,
  renderTargetForMode,
  resolveRendererOrIssue,
  validateBlockRenderInput,
} from "@/core/renderer";
import { parseStyleRegistry, resolveArticleStyle } from "@/core/styles";
import { minimalArticleFixture } from "../../fixtures/articles";
import { fixtureBlockId } from "../../fixtures/articles/shared";
import { minimalStyleRegistryFixture } from "../../fixtures/styles/minimal-registry";

describe("renderer contract", () => {
  const registry = parseStyleRegistry(minimalStyleRegistryFixture);
  const article = parseArticle(minimalArticleFixture);
  const resolvedArticleStyle = resolveArticleStyle(article, registry);
  const block = article.blocks[0]!;

  it("requires Article + ResolvedArticleStyle for block render context", () => {
    const { context, issues } = buildBlockRenderContext({
      article,
      blockId: block.id,
      resolvedArticleStyle,
      mode: "preview",
    });

    expect(context).toBeDefined();
    expect(context!.article).toBe(article);
    expect(context!.resolvedArticleStyle).toBe(resolvedArticleStyle);
    expect(context!.resolvedBlockStyle.blockId).toBe(block.id);
    expect(issues).toEqual([]);
  });

  it("returns missing_resolved_style when block style is absent", () => {
    const strippedStyle = {
      ...resolvedArticleStyle,
      blocks: resolvedArticleStyle.blocks.filter(
        (entry) => entry.blockId !== block.id,
      ),
    };

    const { context, issues } = buildBlockRenderContext({
      article,
      blockId: block.id,
      resolvedArticleStyle: strippedStyle,
      mode: "preview",
    });

    expect(context).toBeUndefined();
    expect(issues).toEqual([
      expect.objectContaining({
        code: "missing_resolved_style",
        blockId: block.id,
        blockType: "title",
      }),
    ]);
  });

  it("returns renderer_not_registered for empty registry", () => {
    const emptyRegistry = createBlockRendererRegistry();
    const result = renderBlock({
      input: {
        article,
        block,
        resolvedArticleStyle,
        mode: "preview",
        target: "browser_preview",
      },
      registry: emptyRegistry,
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual([
      expect.objectContaining({
        code: "renderer_not_registered",
        blockType: "title",
      }),
    ]);
  });

  it("does not silent fail for unsupported block type in text-first scope", () => {
    const paragraphArticle = parseArticle({
      ...minimalArticleFixture,
      blocks: [
        {
          id: fixtureBlockId(2),
          type: "paragraph",
          content: { text: [{ text: "段落" }] },
        },
      ],
    });
    const paragraphResolved = resolveArticleStyle(paragraphArticle, registry);
    const paragraphBlock = paragraphArticle.blocks[0]!;

    const result = renderBlock({
      input: {
        article: paragraphArticle,
        block: paragraphBlock,
        resolvedArticleStyle: paragraphResolved,
        mode: "preview",
        target: "browser_preview",
      },
      registry: createBlockRendererRegistry(),
      supportedBlockTypes: ["title"],
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toEqual([
      expect.objectContaining({
        code: "unsupported_block_type",
        blockType: "paragraph",
      }),
    ]);
  });

  it("distinguishes preview and copy mode targets", () => {
    for (const mode of RENDER_MODES) {
      const inputIssues = validateBlockRenderInput({
        article,
        block,
        resolvedArticleStyle,
        mode,
        target: renderTargetForMode(mode),
      });

      expect(inputIssues).toEqual([]);
      expect(renderTargetForMode(mode)).toBe(
        mode === "preview" ? "browser_preview" : "wechat_copy",
      );
    }

    const mismatchIssues = validateBlockRenderInput({
      article,
      block,
      resolvedArticleStyle,
      mode: "preview",
      target: "wechat_copy",
    });

    expect(mismatchIssues).toEqual([
      expect.objectContaining({ code: "invalid_renderer_input" }),
    ]);
  });

  it("includes blockId blockType variantId on renderer result metadata path", () => {
    const blockRegistry = createBlockRendererRegistry();
    blockRegistry.register({
      blockType: "title",
      mode: "preview",
      render: (context) => ({
        ok: true,
        blockId: context.block.id,
        blockType: context.block.type,
        variantId: context.resolvedBlockStyle.variantId,
        mode: context.mode,
        target: context.target,
        issues: [],
        warnings: [],
        output: { kind: "preview_placeholder", blockId: context.block.id },
      }),
    });

    const result = renderBlock({
      input: {
        article,
        block,
        resolvedArticleStyle,
        mode: "preview",
        target: "browser_preview",
      },
      registry: blockRegistry,
    });

    expect(result.ok).toBe(true);
    expect(result.blockId).toBe(block.id);
    expect(result.blockType).toBe("title");
    expect(result.variantId).toBe("title-centered");
    expect(result.mode).toBe("preview");
    expect(result.target).toBe("browser_preview");
  });

  it("exposes componentProtocol on enriched resolved block style view", () => {
    const resolved = resolvedArticleStyle.blocks[0]!;
    const view = enrichResolvedBlockStyleForRenderer(resolved);

    expect(view.componentProtocol).toEqual(
      getResolvedComponentProtocol(resolved),
    );
    expect(view.componentProtocol.present).toBe(false);
  });

  it("returns invalid_renderer_input when resolved article id mismatches", () => {
    const mismatchedStyle = {
      ...resolvedArticleStyle,
      articleId: "00000000-0000-4000-8000-000000000000",
    };

    const issues = validateBlockRenderInput({
      article,
      block,
      resolvedArticleStyle: mismatchedStyle,
      mode: "copy",
      target: "wechat_copy",
    });

    expect(issues).toEqual([
      expect.objectContaining({ code: "invalid_renderer_input" }),
    ]);
  });

  it("creates structured renderer issues instead of plain strings", () => {
    const issue = createRendererIssue({
      code: "copy_safety_warning",
      message: "preview_only variant",
      blockId: block.id,
      blockType: "title",
    });

    expect(issue).toMatchObject({
      severity: "warning",
      code: "copy_safety_warning",
      message: expect.any(String),
      blockId: block.id,
    });
    expect(typeof issue.message).toBe("string");
  });

  it("covers all render targets", () => {
    expect(RENDER_TARGETS).toEqual(["browser_preview", "wechat_copy"]);
  });
});

describe("resolveRendererOrIssue", () => {
  it("returns structured issue when renderer is missing", () => {
    const registry = createBlockRendererRegistry();
    const resolved = resolveRendererOrIssue(
      registry,
      "paragraph",
      "copy",
      fixtureBlockId(1),
    );

    expect(resolved.renderer).toBeUndefined();
    expect(resolved.issue).toMatchObject({
      code: "renderer_not_registered",
      blockType: "paragraph",
    });
  });
});
