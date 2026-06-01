import { describe, expect, it } from "vitest";

import {
  assertDividerCopySafeCss,
  copyHtmlUsesInlineStyleOnly,
  renderDividerCopyHtml,
} from "@/core/copy/divider-copy";
import { parseStyleRegistry, resolveArticleStyle } from "@/core/styles";
import {
  buildBlockRenderContext,
  createDividerRendererRegistry,
  renderBlock,
  renderTargetForMode,
} from "@/core/renderer";
import {
  createDividerArticleFixture,
  DIVIDER_VARIANT_MATRIX,
  DIVIDER_VARIANT_REGISTRY,
} from "../../fixtures/renderer/divider-articles";

describe("divider copy renderer", () => {
  const styleRegistry = parseStyleRegistry(DIVIDER_VARIANT_REGISTRY);
  const rendererRegistry = createDividerRendererRegistry();

  it("divider_simple_line copy render succeeds with inline style html", () => {
    const article = createDividerArticleFixture({
      variantId: "divider_simple_line",
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
    expect(result.blockType).toBe("divider");
    expect(result.variantId).toBe("divider_simple_line");
    expect(result.output).toMatchObject({
      kind: "divider_copy_html",
      layout: "simple_line",
    });

    const html = (result.output as { html: string }).html;
    expect(copyHtmlUsesInlineStyleOnly(html)).toBe(true);
    expect(html).toContain("border-top:1px solid #cccccc");
    expect(html).not.toMatch(/\bclass\s*=/);
    expect(html).not.toMatch(/<style[\s>]/i);
    assertDividerCopySafeCss(html);
  });

  it.each(DIVIDER_VARIANT_MATRIX.filter((item) => item.variantId !== "divider_simple_line"))(
    "copy renders $variantId successfully",
    ({ variantId, layout }) => {
      const article = createDividerArticleFixture({ variantId });
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
      expect(result.output).toMatchObject({
        kind: "divider_copy_html",
        layout,
      });

      const html = (result.output as { html: string }).html;
      expect(copyHtmlUsesInlineStyleOnly(html)).toBe(true);
      assertDividerCopySafeCss(html);

      if (variantId === "divider_dotted_line") {
        expect(html).toContain("border-top:1px dashed #cccccc");
        expect(result.warnings.some((warning) => warning.code === "copy_safety_warning")).toBe(
          true,
        );
      }

      if (variantId === "divider_section_space") {
        expect(html).toContain("height:32px");
        expect(html).not.toContain("border-top");
      }
    },
  );

  it("copy html avoids className, style tag, absolute, transform, pseudo elements", () => {
    const article = createDividerArticleFixture({
      variantId: "divider_dotted_line",
    });
    const resolved = resolveArticleStyle(article, styleRegistry);
    const { context } = buildBlockRenderContext({
      article,
      blockId: article.blocks[0]!.id,
      resolvedArticleStyle: resolved,
      mode: "copy",
    });

    const output = renderDividerCopyHtml(context!);
    assertDividerCopySafeCss(output.html);
    expect(output.html).not.toMatch(/\bclass\s*=/);
    expect(output.html).not.toMatch(/<style[\s>]/i);
    expect(output.html).not.toMatch(/\bposition\s*:\s*absolute/i);
    expect(output.html).not.toMatch(/\btransform\s*:/i);
    expect(output.html).not.toMatch(/::/);
  });

  it("does not depend on divider content.text", () => {
    const article = createDividerArticleFixture({
      variantId: "divider_section_space",
      content: { style: "space" },
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
    expect((result.output as { html: string }).html).toContain("height:32px");
  });
});
