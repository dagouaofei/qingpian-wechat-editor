import { describe, expect, it } from "vitest";

import { escapeHtml } from "@/core/copy/html-escape";
import { copyHtmlUsesInlineStyleOnly } from "@/core/copy/title-block-copy";
import {
  FIRST_WAVE_TITLE_HEADING_VARIANT_REGISTRY,
  parseStyleRegistry,
  resolveArticleStyle,
} from "@/core/styles";
import {
  createTitleBlockRendererRegistry,
  renderBlock,
  renderTargetForMode,
} from "@/core/renderer";
import { createTitleHeadingArticleFixture } from "../../fixtures/renderer/title-heading-articles";

describe("title / heading copy renderer", () => {
  const styleRegistry = parseStyleRegistry(FIRST_WAVE_TITLE_HEADING_VARIANT_REGISTRY);
  const rendererRegistry = createTitleBlockRendererRegistry();

  it("title_plain_minimal copy render succeeds with inline style html", () => {
    const article = createTitleHeadingArticleFixture({
      blockType: "title",
      variantId: "title_plain_minimal",
      text: "主标题",
    });
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
    expect(result.output).toMatchObject({
      kind: "title_block_copy_html",
      variantId: "title_plain_minimal",
    });

    const html = (result.output as { html: string }).html;
    expect(copyHtmlUsesInlineStyleOnly(html)).toBe(true);
    expect(html).toContain("主标题");
    expect(html).not.toMatch(/\bclass\s*=/);
    expect(html).not.toMatch(/<style[\s>]/i);
  });

  it("title_left_bar_classic copy html avoids className style tag pseudo element", () => {
    const article = createTitleHeadingArticleFixture({
      blockType: "title",
      variantId: "title_left_bar_classic",
      text: "左栏标题",
    });
    const resolved = resolveArticleStyle(article, styleRegistry);
    const block = article.blocks[0]!;

    const result = renderBlock({
      input: {
        article,
        block,
        resolvedArticleStyle: resolved,
        mode: "copy",
        target: "wechat_copy",
      },
      registry: rendererRegistry,
    });

    const html = (result.output as { html: string }).html;
    expect(html).toContain("linear-gradient");
    expect(html).toContain("左栏标题");
    expect(html).not.toMatch(/\bclass\s*=/);
    expect(html).not.toMatch(/::/);
    expect(html).not.toMatch(/<style[\s>]/i);
  });

  it("title_bottom_line_editorial copy html includes bottom divider expression", () => {
    const article = createTitleHeadingArticleFixture({
      blockType: "title",
      variantId: "title_bottom_line_editorial",
      text: "底线标题",
    });
    const resolved = resolveArticleStyle(article, styleRegistry);
    const block = article.blocks[0]!;

    const result = renderBlock({
      input: {
        article,
        block,
        resolvedArticleStyle: resolved,
        mode: "copy",
        target: "wechat_copy",
      },
      registry: rendererRegistry,
    });

    expect(result.warnings.some((warning) => warning.code === "copy_safety_warning")).toBe(
      true,
    );

    const html = (result.output as { html: string }).html;
    expect(html).toContain("linear-gradient");
    expect(html).toContain("底线标题");
  });

  it("heading_plain_minimal copy render succeeds", () => {
    const article = createTitleHeadingArticleFixture({
      blockType: "heading",
      variantId: "heading_plain_minimal",
      text: "小节",
    });
    const resolved = resolveArticleStyle(article, styleRegistry);
    const block = article.blocks[0]!;

    const result = renderBlock({
      input: {
        article,
        block,
        resolvedArticleStyle: resolved,
        mode: "copy",
        target: "wechat_copy",
      },
      registry: rendererRegistry,
    });

    expect(result.ok).toBe(true);
    expect(result.blockType).toBe("heading");
    expect(result.variantId).toBe("heading_plain_minimal");
  });

  it("heading_numbered_section copy html includes numbered prefix fallback", () => {
    const article = createTitleHeadingArticleFixture({
      blockType: "heading",
      variantId: "heading_numbered_section",
      text: "编号章节",
      meta: { sourceIndex: 4 },
    });
    const resolved = resolveArticleStyle(article, styleRegistry);
    const block = article.blocks[0]!;

    const result = renderBlock({
      input: {
        article,
        block,
        resolvedArticleStyle: resolved,
        mode: "copy",
        target: "wechat_copy",
      },
      registry: rendererRegistry,
    });

    const html = (result.output as { html: string }).html;
    expect(html).toContain("04");
    expect(html).toContain("编号章节");
  });

  it("heading_top_badge_topic includes default topic badge in copy", () => {
    const article = createTitleHeadingArticleFixture({
      blockType: "heading",
      variantId: "heading_top_badge_topic",
      text: "徽章标题",
    });
    const resolved = resolveArticleStyle(article, styleRegistry);
    const block = article.blocks[0]!;

    const result = renderBlock({
      input: {
        article,
        block,
        resolvedArticleStyle: resolved,
        mode: "copy",
        target: "wechat_copy",
      },
      registry: rendererRegistry,
    });

    const html = (result.output as { html: string }).html;
    expect(html).toContain("徽章标题");
    expect(html).toContain("话题");
  });

  it("escapes dangerous characters in copy output", () => {
    const article = createTitleHeadingArticleFixture({
      blockType: "title",
      variantId: "title_plain_minimal",
      text: `Tom & Jerry "引号" '单引号'`,
    });
    const resolved = resolveArticleStyle(article, styleRegistry);
    const block = article.blocks[0]!;

    const result = renderBlock({
      input: {
        article,
        block,
        resolvedArticleStyle: resolved,
        mode: "copy",
        target: "wechat_copy",
      },
      registry: rendererRegistry,
    });

    const html = (result.output as { html: string }).html;
    expect(html).toContain(escapeHtml(`Tom & Jerry "引号" '单引号'`));
    expect(html).toContain("&amp;");
    expect(html).toContain("&quot;");
  });

  it("copy mode output does not use class attributes", () => {
    const article = createTitleHeadingArticleFixture({
      blockType: "title",
      variantId: "title_left_bar_classic",
      text: "安全标题",
    });
    const resolved = resolveArticleStyle(article, styleRegistry);
    const block = article.blocks[0]!;

    const result = renderBlock({
      input: {
        article,
        block,
        resolvedArticleStyle: resolved,
        mode: "copy",
        target: "wechat_copy",
      },
      registry: rendererRegistry,
    });

    const html = (result.output as { html: string }).html;
    expect(html).not.toMatch(/\bclass\s*=/);
    expect(html).not.toMatch(/<style[\s>]/i);
  });
});
