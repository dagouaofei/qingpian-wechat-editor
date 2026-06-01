import { describe, expect, it } from "vitest";

import {
  LEAD_FIRST_WAVE_VARIANTS,
  PARAGRAPH_FIRST_WAVE_VARIANTS,
  parseStyleRegistry,
  resolveArticleStyle,
} from "@/core/styles";
import {
  buildBlockRenderContext,
  createTextBlockRendererRegistry,
  renderBlock,
  renderTargetForMode,
} from "@/core/renderer";
import {
  createLeadParagraphArticleFixture,
  LEAD_PARAGRAPH_VARIANT_REGISTRY,
  MARKS_FIXTURE,
} from "../../fixtures/renderer/lead-paragraph-articles";
import { fixtureBlockId } from "../../fixtures/articles/shared";

const LEAD_VARIANTS = LEAD_FIRST_WAVE_VARIANTS.map((variant) => variant.id);
const PARAGRAPH_VARIANTS = PARAGRAPH_FIRST_WAVE_VARIANTS.map((variant) => variant.id);

describe("lead / paragraph preview renderer", () => {
  const styleRegistry = parseStyleRegistry(LEAD_PARAGRAPH_VARIANT_REGISTRY);
  const rendererRegistry = createTextBlockRendererRegistry();

  it.each(LEAD_VARIANTS)("lead preview renders %s", (variantId) => {
    const article = createLeadParagraphArticleFixture({
      blockType: "lead",
      variantId,
      text: `${variantId} 导语`,
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
    expect(result.blockId).toBe(block.id);
    expect(result.blockType).toBe("lead");
    expect(result.variantId).toBe(variantId);
    expect(result.output).toMatchObject({
      kind: "text_block_preview",
      nodes: [{ text: `${variantId} 导语` }],
    });
  });

  it.each(PARAGRAPH_VARIANTS)("paragraph preview renders %s", (variantId) => {
    const article = createLeadParagraphArticleFixture({
      blockType: "paragraph",
      variantId,
      text: MARKS_FIXTURE,
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
      kind: "text_block_preview",
      blockType: "paragraph",
    });
    expect((result.output as { nodes: unknown[] }).nodes.length).toBeGreaterThan(1);
  });

  it("normalizes string content.text for preview", () => {
    const article = createLeadParagraphArticleFixture({
      blockType: "paragraph",
      variantId: "paragraph_plain_body",
      text: "plain string paragraph",
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

    expect(result.output).toMatchObject({
      nodes: [{ text: "plain string paragraph" }],
    });
  });

  it("registers lead / paragraph preview and copy renderers only", () => {
    expect(rendererRegistry.has("lead", "preview")).toBe(true);
    expect(rendererRegistry.has("lead", "copy")).toBe(true);
    expect(rendererRegistry.has("paragraph", "preview")).toBe(true);
    expect(rendererRegistry.has("paragraph", "copy")).toBe(true);
    expect(rendererRegistry.has("divider", "preview")).toBe(false);
    expect(rendererRegistry.has("divider", "copy")).toBe(false);
    expect(rendererRegistry.list()).toHaveLength(4);
  });

  it("returns unsupported_variant for unknown variant id", () => {
    const article = createLeadParagraphArticleFixture({
      blockType: "lead",
      variantId: "lead_plain_intro",
      text: "导语",
    });
    const resolved = resolveArticleStyle(article, styleRegistry);
    resolved.blocks[0]!.variantId = "lead_unknown_variant";
    resolved.blocks[0]!.variant = {
      ...resolved.blocks[0]!.variant,
      id: "lead_unknown_variant",
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
    const article = createLeadParagraphArticleFixture({
      blockType: "lead",
      variantId: "lead_plain_intro",
      text: "导语",
    });
    const resolved = resolveArticleStyle(article, styleRegistry);
    const stripped = {
      ...resolved,
      blocks: [],
    };

    const result = renderBlock({
      input: {
        article,
        block: article.blocks[0]!,
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

  it("uses Article + ResolvedArticleStyle input contract", () => {
    const article = createLeadParagraphArticleFixture({
      blockType: "lead",
      variantId: "lead_plain_intro",
      text: "导语",
    });
    const resolved = resolveArticleStyle(article, styleRegistry);

    const { context } = buildBlockRenderContext({
      article,
      blockId: fixtureBlockId(1),
      resolvedArticleStyle: resolved,
      mode: "preview",
    });

    expect(context?.article).toBe(article);
    expect(context?.resolvedArticleStyle).toBe(resolved);
  });
});
