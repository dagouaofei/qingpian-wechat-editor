import { describe, expect, it } from "vitest";

import {
  buildClipboardPayload,
  buildCopyHtmlSnapshot,
  collectCopySafeHtmlViolations,
  createRelease1FirstWaveCopyRendererRegistry,
  isCopySafeHtmlSnapshot,
  RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES,
} from "@/core/copy";
import { generateDeterministicStyleSelection } from "@/core/generation";
import { parseAndNormalizeInputRequest } from "@/core/generation/input.normalize";
import {
  createFirstWaveRequiredVariantRegistry,
  resolveArticleStyle,
} from "@/core/styles";

import {
  loadR1GoldenArticle,
  R1_GOLDEN_FIXTURE_IDS,
  type R1GoldenFixtureId,
} from "./r1-golden";

const CORE_PLAIN_VARIANTS = [
  "paragraph_plain_body",
  "lead_plain_intro",
  "list_plain_bullets",
] as const;

describe("R1 golden copy snapshot", () => {
  const registry = createFirstWaveRequiredVariantRegistry();

  for (const fixtureId of R1_GOLDEN_FIXTURE_IDS) {
    it(`${fixtureId} produces copy-safe HTML via default style path`, () => {
      const article = loadR1GoldenArticle(fixtureId);
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
      const copyRegistry = createRelease1FirstWaveCopyRendererRegistry();
      const clipboard = buildClipboardPayload({
        article: styled,
        resolvedArticleStyle: resolved,
        registry: copyRegistry,
        supportedBlockTypes: RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES,
      });

      expect(clipboard.issues.filter((i) => i.severity === "error")).toEqual([]);
      expect(collectCopySafeHtmlViolations(clipboard.textHtml)).toEqual([]);
      expect(clipboard.textHtml).not.toMatch(/linear-gradient/i);
      expect(clipboard.textHtml).not.toMatch(/style="[^"]*font-family:"/);
      expect(clipboard.textHtml).toMatch(/font-family:'PingFang SC'/);

      const snapshot = buildCopyHtmlSnapshot({
        article: styled,
        resolvedArticleStyle: resolved,
        registry: copyRegistry,
        supportedBlockTypes: RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES,
      });

      expect(snapshot.issues.filter((i) => i.severity === "error")).toEqual([]);
      for (const entry of snapshot.entries) {
        expect(isCopySafeHtmlSnapshot(entry.html)).toBe(true);
        expect(collectCopySafeHtmlViolations(entry.html)).toEqual([]);
      }
    });
  }

  it("r1-golden-default-article includes core default variants after pipeline", () => {
    const fixtureId: R1GoldenFixtureId = "r1-golden-default-article";
    const article = loadR1GoldenArticle(fixtureId);
    const styled = generateDeterministicStyleSelection({
      article,
      normalizedInput: parseAndNormalizeInputRequest({
        mode: "topic_only",
        topic: article.metadata.title,
        metadata: { locale: "zh-CN", source: "test" },
      }),
      registry,
      timestamp: "2026-06-02T12:00:00.000Z",
    }).article;

    const resolved = resolveArticleStyle(styled, registry);
    const variantIds = resolved.blocks.map((block) => block.variantId);

    for (const expected of CORE_PLAIN_VARIANTS) {
      expect(variantIds).toContain(expected);
    }
    expect(variantIds.filter((id) => id.includes("soft_card")).length).toBeLessThanOrEqual(
      1,
    );
  });
});
