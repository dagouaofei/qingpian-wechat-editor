import { describe, expect, it } from "vitest";

import {
  assertListCopySafeCss,
  copyHtmlUsesInlineStyleOnly,
  renderListCopyHtml,
} from "@/core/copy/list-copy";
import { parseStyleRegistry, resolveArticleStyle } from "@/core/styles";
import {
  buildBlockRenderContext,
  createListRendererRegistry,
  renderBlock,
  renderTargetForMode,
} from "@/core/renderer";
import {
  createListArticleFixture,
  LIST_VARIANT_MATRIX,
  LIST_VARIANT_REGISTRY,
} from "../../fixtures/renderer/list-articles";

describe("list copy renderer", () => {
  const styleRegistry = parseStyleRegistry(LIST_VARIANT_REGISTRY);
  const rendererRegistry = createListRendererRegistry();

  it.each(LIST_VARIANT_MATRIX)(
    "copy renders $variantId successfully",
    ({ variantId, layout }) => {
      const article = createListArticleFixture({ variantId });
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
      expect(result.blockType).toBe("list");
      expect(result.variantId).toBe(variantId);
      expect(result.output).toMatchObject({
        kind: "list_copy_html",
        layout,
      });

      const html = (result.output as { html: string }).html;
      expect(copyHtmlUsesInlineStyleOnly(html)).toBe(true);
      assertListCopySafeCss(html);
      expect(html).toContain("第一项");
      expect(html).toContain("第二项");
      expect(html.indexOf("第一项")).toBeLessThan(html.indexOf("第二项"));
    },
  );

  it("list_plain_bullets uses stable bullet text and no balanced warning", () => {
    const article = createListArticleFixture({ variantId: "list_plain_bullets" });
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
    expect(html).toContain("• 第一项");
    expect(html).not.toMatch(/<ul|<li/i);
    expect(result.warnings.some((warning) => warning.code === "copy_safety_warning")).toBe(
      false,
    );
  });

  it("list_numbered_steps uses stable numbered text and balanced warning", () => {
    const article = createListArticleFixture({ variantId: "list_numbered_steps" });
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
    expect(html).toContain("1. 第一项");
    expect(html).toContain("2. 第二项");
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "copy_safety_warning" }),
      ]),
    );
  });

  it("list_checklist_cards uses copy-safe lightweight cards and balanced warning", () => {
    const article = createListArticleFixture({ variantId: "list_checklist_cards" });
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
    expect(html).toContain("✓ 第一项");
    expect(html).toContain("background-color:#f9f9f9");
    expect(html).toContain("border:1px solid #eeeeee");
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "copy_safety_warning" }),
      ]),
    );
  });

  it("escapes HTML in item and subItem text", () => {
    const article = createListArticleFixture({
      variantId: "list_plain_bullets",
      content: {
        ordered: false,
        items: [{ text: "A < B & C", subItems: ["Use \"quotes\" safely"] }],
      },
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
    expect(html).toContain("A &lt; B &amp; C");
    expect(html).toContain("&quot;quotes&quot;");
    expect(html).not.toContain("A < B");
  });

  it("copy html avoids className, style tag, css vars, absolute, transform, pseudo elements", () => {
    const article = createListArticleFixture({ variantId: "list_checklist_cards" });
    const resolved = resolveArticleStyle(article, styleRegistry);
    const { context } = buildBlockRenderContext({
      article,
      blockId: article.blocks[0]!.id,
      resolvedArticleStyle: resolved,
      mode: "copy",
    });

    const { output } = renderListCopyHtml(context!);
    assertListCopySafeCss(output.html);
    expect(output.html).not.toMatch(/\bclass\s*=/);
    expect(output.html).not.toMatch(/<style[\s>]/i);
    expect(output.html).not.toMatch(/var\s*\(/i);
    expect(output.html).not.toMatch(/\bposition\s*:\s*absolute/i);
    expect(output.html).not.toMatch(/\btransform\s*:/i);
    expect(output.html).not.toMatch(/::/);
  });

  it("warns and skips invalid item while preserving valid copy output", () => {
    const article = createListArticleFixture({ variantId: "list_numbered_steps" });
    (article.blocks[0]!.content as { items: Array<{ text: string }> }).items[0]!.text =
      "";
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
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "invalid_renderer_input" }),
      ]),
    );
    const html = (result.output as { html: string }).html;
    expect(html).not.toContain("1. 第一项");
    expect(html).toContain("1. 第二项");
    expect(html).toContain("2. 第三项");
  });
});
