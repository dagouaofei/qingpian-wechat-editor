import { describe, expect, it } from "vitest";

import {
  buildClipboardPayload,
  createRelease1FirstWaveCopyRendererRegistry,
  RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES,
} from "@/core/copy";
import { generateDeterministicStyleSelection } from "@/core/generation/style-selection";
import { parseAndNormalizeInputRequest } from "@/core/generation/input.normalize";
import {
  createFirstWaveRequiredVariantRegistry,
  resolveArticleStyle,
} from "@/core/styles";

import { loadR1GoldenArticle } from "./r1-golden";

describe("R1 golden copy inline typography", () => {
  it("r1-golden-default-article copy HTML includes font-family on body text blocks", () => {
    const article = loadR1GoldenArticle("r1-golden-default-article");
    const registry = createFirstWaveRequiredVariantRegistry();
    const styled = generateDeterministicStyleSelection({
      article,
      normalizedInput: parseAndNormalizeInputRequest({
        mode: "topic_only",
        topic: article.metadata.title,
        styleIntent: { densityHint: "medium", presetHint: "business" },
        metadata: { locale: "zh-CN", source: "test" },
      }),
      registry,
      timestamp: "2026-06-02T12:00:00.000Z",
    }).article;
    const resolved = resolveArticleStyle(styled, registry);
    const html = buildClipboardPayload({
      article: styled,
      resolvedArticleStyle: resolved,
      registry: createRelease1FirstWaveCopyRendererRegistry(),
      supportedBlockTypes: RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES,
    }).textHtml;

    expect(html).toContain("16px");
    expect(html).toContain("line-height:1.75");
    expect((html.match(/font-family:'PingFang SC'/g) ?? []).length).toBeGreaterThanOrEqual(5);
  });
});
