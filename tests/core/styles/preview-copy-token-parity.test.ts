import { describe, expect, it } from "vitest";

import {
  buildClipboardPayload,
  createRelease1FirstWaveCopyRendererRegistry,
} from "@/core/copy";
import {
  createRelease1FirstWavePreviewRendererRegistry,
  renderBlock,
  renderTargetForMode,
} from "@/core/renderer";
import { resolveTitleBlockTypography } from "@/core/renderer/text-style";
import {
  createFirstWaveRequiredVariantRegistry,
  resolveArticleStyle,
} from "@/core/styles";

import { loadR1GoldenArticle } from "../../fixtures/articles/r1-golden";

describe("preview / copy token parity (title)", () => {
  const registry = createFirstWaveRequiredVariantRegistry();

  it("title block uses same resolved tokens for preview typography and copy color", () => {
    const article = loadR1GoldenArticle("r1-golden-default-article");
    const resolvedArticle = resolveArticleStyle(article, registry);
    const block = article.blocks.find((entry) => entry.type === "title")!;
    const resolvedBlock = resolvedArticle.blocks.find(
      (entry) => entry.blockId === block.id,
    )!;

    const previewRegistry = createRelease1FirstWavePreviewRendererRegistry();
    const copyRegistry = createRelease1FirstWaveCopyRendererRegistry();

    const preview = renderBlock({
      input: {
        article,
        block,
        resolvedArticleStyle: resolvedArticle,
        mode: "preview",
        target: renderTargetForMode("preview"),
      },
      registry: previewRegistry,
    });

    const copyPayload = buildClipboardPayload({
      article,
      resolvedArticleStyle: resolvedArticle,
      registry: copyRegistry,
    });

    const typography = resolveTitleBlockTypography(resolvedBlock, "title");
    const themeColor = resolvedBlock.tokens.theme.color?.["text.default"];

    expect(typography.color).toBe(themeColor);
    expect(preview.ok).toBe(true);
    expect(copyPayload.textHtml.length).toBeGreaterThan(0);
    if (themeColor) {
      expect(copyPayload.textHtml).toContain(themeColor);
    }
    expect(copyPayload.textHtml).toContain(typography.fontSize);
    expect(copyPayload.textHtml).toContain("font-family");
  });
});
