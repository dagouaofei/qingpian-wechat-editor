import { describe, expect, it } from "vitest";

import {
  buildCopyHtmlSnapshot,
  createSprint4BStructuredCopyRendererRegistry,
  isCopySafeHtmlSnapshot,
  SPRINT4B_STRUCTURED_COPY_BLOCK_TYPES,
} from "@/core/copy";
import {
  createBlockRendererRegistry,
  renderBlock,
  renderTargetForMode,
} from "@/core/renderer";
import { parseStyleRegistry, resolveArticleStyle } from "@/core/styles";
import { fixtureBlockId } from "../../fixtures/articles/shared";
import {
  createStructuredCopyArticleFixture,
  STRUCTURED_COPY_SNAPSHOT_VARIANTS,
  STRUCTURED_COPY_STYLE_REGISTRY,
} from "../../fixtures/copy/structured-copy-fixtures";

describe("structured copy html snapshot seed", () => {
  const styleRegistry = parseStyleRegistry(STRUCTURED_COPY_STYLE_REGISTRY);
  const registry = createSprint4BStructuredCopyRendererRegistry();

  it("builds structured snapshot seed from existing copy renderer outputs", () => {
    const article = createStructuredCopyArticleFixture();
    const resolved = resolveArticleStyle(article, styleRegistry);
    const snapshot = buildCopyHtmlSnapshot({
      article,
      resolvedArticleStyle: resolved,
      registry,
      supportedBlockTypes: SPRINT4B_STRUCTURED_COPY_BLOCK_TYPES,
    });

    expect(snapshot.issues).toEqual([]);
    expect(snapshot.entries).toHaveLength(18);
    expect(snapshot.entries.map((entry) => entry.variantId)).toEqual(
      STRUCTURED_COPY_SNAPSHOT_VARIANTS,
    );
    expect(snapshot.metadata).toMatchObject({
      articleId: article.id,
      blockCount: 18,
      source: "copy_renderer",
    });

    const direct = renderBlock({
      input: {
        article,
        block: article.blocks[0]!,
        resolvedArticleStyle: resolved,
        mode: "copy",
        target: renderTargetForMode("copy"),
      },
      registry,
      supportedBlockTypes: SPRINT4B_STRUCTURED_COPY_BLOCK_TYPES,
    });

    expect(snapshot.entries[0]!.html).toBe((direct.output as { html: string }).html);
  });

  it("keeps all Sprint 4-B structured block types in the fixture", () => {
    const article = createStructuredCopyArticleFixture();

    expect(new Set(article.blocks.map((block) => block.type))).toEqual(
      new Set([
        "list",
        "quote",
        "highlight",
        "info_card",
        "cta",
        "image_placeholder",
      ]),
    );
  });

  it("asserts structured snapshot html is copy-safe", () => {
    const article = createStructuredCopyArticleFixture();
    const resolved = resolveArticleStyle(article, styleRegistry);
    const snapshot = buildCopyHtmlSnapshot({
      article,
      resolvedArticleStyle: resolved,
      registry,
      supportedBlockTypes: SPRINT4B_STRUCTURED_COPY_BLOCK_TYPES,
    });

    for (const entry of snapshot.entries) {
      expect(isCopySafeHtmlSnapshot(entry.html)).toBe(true);
      expect(entry.html).not.toMatch(/\bclass(?:Name)?\s*=/i);
      expect(entry.html).not.toMatch(/<style[\s>]/i);
      expect(entry.html).not.toMatch(/<script[\s>]/i);
      expect(entry.html).not.toMatch(/\son[a-z]+\s*=/i);
      expect(entry.html).not.toMatch(/<link\b[^>]*stylesheet/i);
      expect(entry.html).not.toMatch(/\bposition\s*:\s*absolute/i);
      expect(entry.html).not.toMatch(/\btransform\s*:/i);
      expect(entry.html).not.toMatch(/::|:before|:after/i);
      expect(entry.html).not.toMatch(/\bdisplay\s*:\s*(flex|grid)/i);
    }
  });

  it("keeps structured balanced copySafety warning metadata", () => {
    const article = createStructuredCopyArticleFixture();
    const resolved = resolveArticleStyle(article, styleRegistry);
    const snapshot = buildCopyHtmlSnapshot({
      article,
      resolvedArticleStyle: resolved,
      registry,
      supportedBlockTypes: SPRINT4B_STRUCTURED_COPY_BLOCK_TYPES,
    });

    const balanced = snapshot.entries.find(
      (entry) => entry.variantId === "cta_button_like",
    );

    expect(balanced?.copySafety).toBe("balanced");
    expect(
      balanced?.warnings.some((warning) => warning.code === "copy_safety_warning"),
    ).toBe(true);
  });

  it("returns structured issue when structured renderer is missing", () => {
    const article = createStructuredCopyArticleFixture();
    const resolved = resolveArticleStyle(article, styleRegistry);
    const snapshot = buildCopyHtmlSnapshot({
      article,
      resolvedArticleStyle: resolved,
      registry: createBlockRendererRegistry(),
      supportedBlockTypes: SPRINT4B_STRUCTURED_COPY_BLOCK_TYPES,
    });

    expect(snapshot.entries).toHaveLength(0);
    expect(snapshot.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "renderer_not_registered" }),
      ]),
    );
  });

  it("returns structured issue when resolved style is missing", () => {
    const article = createStructuredCopyArticleFixture();
    const resolved = resolveArticleStyle(article, styleRegistry);
    resolved.blocks = resolved.blocks.filter(
      (blockStyle) => blockStyle.blockId !== fixtureBlockId(1),
    );

    const snapshot = buildCopyHtmlSnapshot({
      article,
      resolvedArticleStyle: resolved,
      registry,
      supportedBlockTypes: SPRINT4B_STRUCTURED_COPY_BLOCK_TYPES,
    });

    expect(snapshot.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "missing_resolved_style" }),
      ]),
    );
  });

  it("returns structured issue for unsupported structured variant", () => {
    const article = createStructuredCopyArticleFixture();
    const resolved = resolveArticleStyle(article, styleRegistry);
    resolved.blocks[0]!.variantId = "list_unknown_variant";
    resolved.blocks[0]!.variant = {
      ...resolved.blocks[0]!.variant,
      id: "list_unknown_variant",
    };

    const snapshot = buildCopyHtmlSnapshot({
      article,
      resolvedArticleStyle: resolved,
      registry,
      supportedBlockTypes: SPRINT4B_STRUCTURED_COPY_BLOCK_TYPES,
    });

    expect(snapshot.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "unsupported_variant" }),
      ]),
    );
  });

  it("does not output real CTA links, buttons, QR images, or image placeholders as img", () => {
    const article = createStructuredCopyArticleFixture();
    const resolved = resolveArticleStyle(article, styleRegistry);
    const snapshot = buildCopyHtmlSnapshot({
      article,
      resolvedArticleStyle: resolved,
      registry,
      supportedBlockTypes: SPRINT4B_STRUCTURED_COPY_BLOCK_TYPES,
    });

    const ctaHtml = snapshot.entries
      .filter((entry) => entry.blockType === "cta")
      .map((entry) => entry.html)
      .join("\n");
    const imagePlaceholderHtml = snapshot.entries
      .filter((entry) => entry.blockType === "image_placeholder")
      .map((entry) => entry.html)
      .join("\n");

    expect(ctaHtml).not.toMatch(/<button\b/i);
    expect(ctaHtml).not.toMatch(/<a\b|href\s*=/i);
    expect(ctaHtml).not.toMatch(/<img\b/i);
    expect(imagePlaceholderHtml).not.toMatch(/<img\b/i);
  });
});
