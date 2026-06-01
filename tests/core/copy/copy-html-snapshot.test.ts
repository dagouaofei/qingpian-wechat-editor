import { describe, expect, it } from "vitest";

import {
  buildCopyHtmlSnapshot,
  createSprint4ATextFirstCopyRendererRegistry,
  isCopySafeHtmlSnapshot,
} from "@/core/copy";
import {
  createBlockRendererRegistry,
  renderBlock,
  renderTargetForMode,
} from "@/core/renderer";
import { parseStyleRegistry, resolveArticleStyle } from "@/core/styles";
import { fixtureBlockId } from "../../fixtures/articles/shared";
import {
  createTextFirstCopyArticleFixture,
  TEXT_FIRST_COPY_SNAPSHOT_VARIANTS,
  TEXT_FIRST_COPY_STYLE_REGISTRY,
} from "../../fixtures/copy/text-first-copy-fixtures";

describe("copy html snapshot seed", () => {
  const styleRegistry = parseStyleRegistry(TEXT_FIRST_COPY_STYLE_REGISTRY);

  it("builds snapshot seed from existing copy renderer outputs", () => {
    const article = createTextFirstCopyArticleFixture();
    const resolved = resolveArticleStyle(article, styleRegistry);
    const snapshot = buildCopyHtmlSnapshot({ article, resolvedArticleStyle: resolved });

    expect(snapshot.issues).toEqual([]);
    expect(snapshot.entries.map((entry) => entry.variantId)).toEqual(
      TEXT_FIRST_COPY_SNAPSHOT_VARIANTS,
    );
    expect(snapshot.metadata).toMatchObject({
      articleId: article.id,
      blockCount: 6,
      source: "copy_renderer",
    });

    const registry = createSprint4ATextFirstCopyRendererRegistry();
    const direct = renderBlock({
      input: {
        article,
        block: article.blocks[0]!,
        resolvedArticleStyle: resolved,
        mode: "copy",
        target: renderTargetForMode("copy"),
      },
      registry,
    });

    expect(snapshot.entries[0]!.html).toBe((direct.output as { html: string }).html);
  });

  it("keeps title / heading / lead / paragraph / divider in the fixture", () => {
    const article = createTextFirstCopyArticleFixture();

    expect(article.blocks.map((block) => block.type)).toEqual([
      "title",
      "heading",
      "lead",
      "paragraph",
      "divider",
      "divider",
    ]);
  });

  it("asserts snapshot html is copy-safe", () => {
    const article = createTextFirstCopyArticleFixture();
    const resolved = resolveArticleStyle(article, styleRegistry);
    const snapshot = buildCopyHtmlSnapshot({ article, resolvedArticleStyle: resolved });

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
    }
  });

  it("keeps balanced copySafety warning metadata", () => {
    const article = createTextFirstCopyArticleFixture();
    const resolved = resolveArticleStyle(article, styleRegistry);
    const snapshot = buildCopyHtmlSnapshot({ article, resolvedArticleStyle: resolved });

    const dotted = snapshot.entries.find(
      (entry) => entry.variantId === "divider_dotted_line",
    );

    expect(dotted?.copySafety).toBe("balanced");
    expect(
      dotted?.warnings.some((warning) => warning.code === "copy_safety_warning"),
    ).toBe(true);
  });

  it("returns structured issue when renderer is missing", () => {
    const article = createTextFirstCopyArticleFixture();
    const resolved = resolveArticleStyle(article, styleRegistry);
    const snapshot = buildCopyHtmlSnapshot({
      article,
      resolvedArticleStyle: resolved,
      registry: createBlockRendererRegistry(),
    });

    expect(snapshot.entries).toHaveLength(0);
    expect(snapshot.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "renderer_not_registered" }),
      ]),
    );
  });

  it("returns structured issue when resolved style is missing", () => {
    const article = createTextFirstCopyArticleFixture();
    const resolved = resolveArticleStyle(article, styleRegistry);
    resolved.blocks = resolved.blocks.filter(
      (blockStyle) => blockStyle.blockId !== fixtureBlockId(1),
    );

    const snapshot = buildCopyHtmlSnapshot({ article, resolvedArticleStyle: resolved });

    expect(snapshot.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "missing_resolved_style" }),
      ]),
    );
  });

  it("does not register structured block renderers", () => {
    const registry = createSprint4ATextFirstCopyRendererRegistry();

    expect(registry.has("title", "copy")).toBe(true);
    expect(registry.has("divider", "copy")).toBe(true);
    expect(registry.has("list", "copy")).toBe(false);
    expect(registry.has("quote", "copy")).toBe(false);
    expect(registry.has("highlight", "copy")).toBe(false);
    expect(registry.has("info_card", "copy")).toBe(false);
    expect(registry.has("cta", "copy")).toBe(false);
    expect(registry.has("image_placeholder", "copy")).toBe(false);
  });
});
