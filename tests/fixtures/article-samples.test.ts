import { describe, expect, it } from "vitest";

import { parseArticle } from "@/core/article";
import { RELEASE1_FIRST_WAVE_PREVIEW_BLOCK_TYPES } from "@/core/renderer";
import {
  allArticleSampleBlockTypes,
  ARTICLE_SAMPLES,
  articleSampleRawForId,
  ARTICLE_SAMPLE_IDS,
} from "@/fixtures/article-samples";
import { renderArticlePreviewClient } from "@/lib/render-article-preview-client";
import { parseAndNormalizeInputRequest } from "@/core/generation/input.normalize";

const FIXTURE_NORMALIZED_INPUT = parseAndNormalizeInputRequest({
  mode: "topic_only",
  topic: "Article sample fixture",
  styleIntent: { presetHint: "classic-news", densityHint: "medium" },
});

describe("article-samples registry", () => {
  it("registers 8 article samples with stable ids", () => {
    expect(ARTICLE_SAMPLE_IDS).toHaveLength(8);
    expect(ARTICLE_SAMPLES.map((sample) => sample.id)).toEqual([...ARTICLE_SAMPLE_IDS]);
  });

  it("each sample is a complete article with title, lead, and multiple headings", () => {
    for (const sample of ARTICLE_SAMPLES) {
      const raw = articleSampleRawForId(sample.id);
      expect(raw.blocks.length).toBeGreaterThanOrEqual(8);
      expect(sample.blockTypes).toContain("title");
      expect(sample.blockTypes).toContain("lead");
      expect(raw.blocks.filter((block) => block.type === "heading").length).toBeGreaterThanOrEqual(2);
    }
  });

  it("eight samples collectively cover all Release 1 first-wave block types", () => {
    const covered = new Set(allArticleSampleBlockTypes());
    for (const blockType of RELEASE1_FIRST_WAVE_PREVIEW_BLOCK_TYPES) {
      expect(covered.has(blockType)).toBe(true);
    }
  });

  it("parses and renders preview + copy for representative samples", () => {
    for (const sampleId of ["sample-knowledge", "sample-product"] as const) {
      const article = parseArticle(articleSampleRawForId(sampleId));
      const rendered = renderArticlePreviewClient(
        article,
        FIXTURE_NORMALIZED_INPUT,
        { articleStyle: "classic-news", colorPalette: "default" },
      );

      expect(rendered.previewBlocks.length).toBeGreaterThan(0);
      expect(rendered.previewBlocks.every((block) => block.ok)).toBe(true);
      expect(rendered.clipboard.textHtml.length).toBeGreaterThan(0);
      expect(rendered.clipboard.textPlain.length).toBeGreaterThan(0);
    }
  });

  it("all eight samples parse and render without preview failures", () => {
    for (const sampleId of ARTICLE_SAMPLE_IDS) {
      const article = parseArticle(articleSampleRawForId(sampleId));
      const rendered = renderArticlePreviewClient(
        article,
        FIXTURE_NORMALIZED_INPUT,
        { articleStyle: "classic-news", colorPalette: "default" },
      );

      expect(rendered.previewBlocks.every((block) => block.ok)).toBe(true);
    }
  });
});
