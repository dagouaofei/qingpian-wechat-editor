import { describe, expect, it } from "vitest";

import {
  assertInfoCardCopySafeCss,
  copyHtmlUsesInlineStyleOnly,
  renderInfoCardCopyHtml,
} from "@/core/copy/info-card-copy";
import {
  buildBlockRenderContext,
  createInfoCardRendererRegistry,
  renderBlock,
  renderTargetForMode,
} from "@/core/renderer";
import { parseStyleRegistry, resolveArticleStyle } from "@/core/styles";
import {
  createInfoCardArticleFixture,
  INFO_CARD_VARIANT_MATRIX,
  INFO_CARD_VARIANT_REGISTRY,
} from "../../fixtures/renderer/info-card-articles";

describe("info_card copy renderer", () => {
  const styleRegistry = parseStyleRegistry(INFO_CARD_VARIANT_REGISTRY);
  const rendererRegistry = createInfoCardRendererRegistry();

  it.each(INFO_CARD_VARIANT_MATRIX)(
    "copy renders $variantId successfully",
    ({ variantId, layout }) => {
      const article = createInfoCardArticleFixture({ variantId });
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
      expect(result.blockType).toBe("info_card");
      expect(result.variantId).toBe(variantId);
      expect(result.output).toMatchObject({
        kind: "info_card_copy_html",
        layout,
      });

      const html = (result.output as { html: string }).html;
      expect(copyHtmlUsesInlineStyleOnly(html)).toBe(true);
      assertInfoCardCopySafeCss(html);
      expect(html).toContain("这是信息卡正文。");
    },
  );

  it("info_card_key_takeaway renders title and body with explicit text styles", () => {
    const article = createInfoCardArticleFixture({
      variantId: "info_card_key_takeaway",
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
    expect(html).toContain("关键结论");
    expect(html).toContain("font-size:16px");
    expect(html).toContain("line-height:1.75");
    expect(html).toContain("border:1px solid #576b95");
  });

  it("info_card_steps uses stable numbered text without new schema", () => {
    const article = createInfoCardArticleFixture({
      variantId: "info_card_steps",
      content: { body: "第一步\n第二步\n第三步" },
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
    expect(html).toContain("1. 第一步");
    expect(html).toContain("2. 第二步");
    expect(html).toContain("3. 第三步");
    expect(html.indexOf("1. 第一步")).toBeLessThan(html.indexOf("2. 第二步"));
  });

  it("info_card_warning_note uses copy-safe warning expression", () => {
    const article = createInfoCardArticleFixture({
      variantId: "info_card_warning_note",
      content: { title: "注意事项", body: "请先确认内容来源。", icon: "风险提示" },
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
    expect(html).toContain("background-color:#fff8e6");
    expect(html).toContain("border-left:4px solid #b36b00");
    expect(html).toContain("风险提示");
  });

  it("escapes title, body, and icon HTML content", () => {
    const article = createInfoCardArticleFixture({
      variantId: "info_card_key_takeaway",
    });
    const content = article.blocks[0]!.content as {
      title: string;
      body: string;
      icon: string;
    };
    content.title = "A < B";
    content.body = "Body & \"quote\"";
    content.icon = "Icon <x>";
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
    expect(html).toContain("A &lt; B");
    expect(html).toContain("Body &amp; &quot;quote&quot;");
    expect(html).not.toContain("A < B");
  });

  it("balanced variants emit copy safety warning without blocking render", () => {
    for (const { variantId } of INFO_CARD_VARIANT_MATRIX) {
      const article = createInfoCardArticleFixture({ variantId });
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
          expect.objectContaining({ code: "copy_safety_warning" }),
        ]),
      );
    }
  });

  it("copy html avoids className, style tag, css vars, absolute, transform, pseudo elements, flex, and grid", () => {
    const article = createInfoCardArticleFixture({
      variantId: "info_card_warning_note",
    });
    const resolved = resolveArticleStyle(article, styleRegistry);
    const { context } = buildBlockRenderContext({
      article,
      blockId: article.blocks[0]!.id,
      resolvedArticleStyle: resolved,
      mode: "copy",
    });

    const { output } = renderInfoCardCopyHtml(context!);
    assertInfoCardCopySafeCss(output.html);
    expect(output.html).not.toMatch(/\bclass\s*=/);
    expect(output.html).not.toMatch(/<style[\s>]/i);
    expect(output.html).not.toMatch(/var\s*\(/i);
    expect(output.html).not.toMatch(/\bposition\s*:\s*absolute/i);
    expect(output.html).not.toMatch(/\btransform\s*:/i);
    expect(output.html).not.toMatch(/::/);
    expect(output.html).not.toMatch(/\bdisplay\s*:\s*(flex|grid)/i);
  });

  it("missing optional title and icon warn but do not block copy output", () => {
    const article = createInfoCardArticleFixture({
      variantId: "info_card_key_takeaway",
      content: { body: "只有正文" },
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
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "optional_slot_disabled", slotId: "title" }),
        expect.objectContaining({ code: "optional_slot_disabled", slotId: "icon" }),
      ]),
    );
    expect((result.output as { html: string }).html).toContain("只有正文");
  });
});
