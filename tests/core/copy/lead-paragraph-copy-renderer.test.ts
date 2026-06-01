import { describe, expect, it } from "vitest";

import type { InlineContent } from "@/core/article";
import { copyHtmlUsesInlineStyleOnly } from "@/core/copy/title-block-copy";
import { renderInlineContentToCopyHtml } from "@/core/copy/inline-content-html";
import { parseStyleRegistry, resolveArticleStyle } from "@/core/styles";
import {
  createTextBlockRendererRegistry,
  renderBlock,
  renderTargetForMode,
} from "@/core/renderer";
import {
  createLeadParagraphArticleFixture,
  LEAD_PARAGRAPH_VARIANT_REGISTRY,
  MARKS_FIXTURE,
} from "../../fixtures/renderer/lead-paragraph-articles";

describe("lead / paragraph copy renderer", () => {
  const styleRegistry = parseStyleRegistry(LEAD_PARAGRAPH_VARIANT_REGISTRY);
  const rendererRegistry = createTextBlockRendererRegistry();

  it("lead_plain_intro copy render succeeds", () => {
    const article = createLeadParagraphArticleFixture({
      blockType: "lead",
      variantId: "lead_plain_intro",
      text: "文章导语",
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
    expect(result.blockId).toBe(block.id);
    expect(result.blockType).toBe("lead");
    expect(result.variantId).toBe("lead_plain_intro");
    expect(result.output).toMatchObject({ kind: "text_block_copy_html" });

    const html = (result.output as { html: string }).html;
    expect(copyHtmlUsesInlineStyleOnly(html)).toBe(true);
    expect(html).toContain("文章导语");
  });

  it("lead_accent_band copy html avoids className and style tag", () => {
    const article = createLeadParagraphArticleFixture({
      blockType: "lead",
      variantId: "lead_accent_band",
      text: "强调导语",
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
    expect(html).toContain("background-color:#f5f5f5");
    expect(html).not.toMatch(/\bclass\s*=/);
    expect(html).not.toMatch(/<style[\s>]/i);
    expect(result.warnings.some((warning) => warning.code === "copy_safety_warning")).toBe(
      true,
    );
  });

  it("lead_quote_intro copy html uses copy-safe inline style", () => {
    const article = createLeadParagraphArticleFixture({
      blockType: "lead",
      variantId: "lead_quote_intro",
      text: "引用导语",
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
    expect(html).toContain("font-style:italic");
    expect(html).toContain("border-left:3px solid #cccccc");
  });

  it("paragraph_plain_body preview and copy succeed", () => {
    const article = createLeadParagraphArticleFixture({
      blockType: "paragraph",
      variantId: "paragraph_plain_body",
      text: MARKS_FIXTURE,
    });
    const resolved = resolveArticleStyle(article, styleRegistry);
    const block = article.blocks[0]!;

    const preview = renderBlock({
      input: {
        article,
        block,
        resolvedArticleStyle: resolved,
        mode: "preview",
        target: "browser_preview",
      },
      registry: rendererRegistry,
    });
    const copy = renderBlock({
      input: {
        article,
        block,
        resolvedArticleStyle: resolved,
        mode: "copy",
        target: "wechat_copy",
      },
      registry: rendererRegistry,
    });

    expect(preview.ok).toBe(true);
    expect(copy.ok).toBe(true);
    expect(copy.output).toMatchObject({ kind: "text_block_copy_html" });
  });

  it("paragraph_accent_left copy html uses left accent", () => {
    const article = createLeadParagraphArticleFixture({
      blockType: "paragraph",
      variantId: "paragraph_accent_left",
      text: "左强调段落",
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
    expect(html).toContain("border-left:3px solid #576b95");
  });

  it("paragraph_soft_card copy html uses card expression", () => {
    const article = createLeadParagraphArticleFixture({
      blockType: "paragraph",
      variantId: "paragraph_soft_card",
      text: "卡片段落",
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
    expect(html).toContain("background-color:#f9f9f9");
    expect(html).toContain("border-radius:8px");
  });

  it("warns on unsafe color in copy path", () => {
    const article = createLeadParagraphArticleFixture({
      blockType: "paragraph",
      variantId: "paragraph_plain_body",
      text: [{ text: "bad color", marks: [{ type: "color", color: "evil-token" }] }],
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
    expect(result.warnings.some((warning) => warning.code === "unsafe_inline_color")).toBe(
      true,
    );
  });

  it("warns and strips unsafe href in copy path", () => {
    const unsafeContent = [
      { text: "click", marks: [{ type: "link", href: "javascript:alert(1)" }] },
    ] as InlineContent;

    const { html, warnings } = renderInlineContentToCopyHtml({
      content: unsafeContent,
      themeTokens: { color: { "text.default": "#333333" } },
      defaultColor: "#333333",
      blockId: "block-1",
      blockType: "paragraph",
      variantId: "paragraph_plain_body",
    });

    expect(warnings.some((warning) => warning.code === "unsafe_link_href")).toBe(
      true,
    );
    expect(html).not.toContain("javascript:");
    expect(html).toContain("click");
  });
});
