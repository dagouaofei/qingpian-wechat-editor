import type { Article } from "@/core/article";
import {
  collectCopySafeHtmlViolations,
  type CopySafeHtmlViolation,
} from "@/core/copy/copy-safe-html";
import { parseAndNormalizeInputRequest } from "@/core/generation/input.normalize";
import { resolveArticleStyle } from "@/core/styles";
import { createFirstWaveRequiredVariantRegistry } from "@/core/styles";
import {
  loadR1GoldenArticle,
  R1_GOLDEN_FIXTURE_IDS,
  R1_GOLDEN_PRESET_ID,
  R1_GOLDEN_THEME_ID,
  type R1GoldenFixtureId,
} from "@/fixtures/r1-golden";
import type { PreviewColorPaletteId } from "@/lib/preview-color-palette";
import {
  DEFAULT_PREVIEW_STYLE_CONTROL,
  type PreviewStyleControlState,
} from "@/lib/preview-style-controls";
import { renderArticlePreviewClient } from "@/lib/render-article-preview-client";
import type { SerializedPreviewBlock } from "@/server/generation/generate-flow-types";

export type { R1GoldenFixtureId };

export type StyleFidelityBlockRow = {
  blockId: string;
  blockType: string;
  variantId: string;
  familyId: string;
};

/** Same pipeline as /preview and /gallery: style selection + Preview renderer + Copy payload. */
export const STYLE_FIDELITY_PIPELINE_LABEL =
  "generateDeterministicStyleSelection → resolveArticleStyle → Preview/Copy renderer (business + businessBlue)";

const GOLDEN_PREVIEW_CONTROL: PreviewStyleControlState = {
  ...DEFAULT_PREVIEW_STYLE_CONTROL,
  articleStyle: R1_GOLDEN_PRESET_ID,
  colorPalette: R1_GOLDEN_THEME_ID,
  lockColorPalette: true,
};

const COPY_HTML_EXCERPT_MAX = 6000;

export type StyleFidelityPageData = {
  fixtureId: R1GoldenFixtureId;
  presetId: string;
  themeId: string;
  colorPalette: PreviewColorPaletteId;
  pipelineLabel: string;
  blocks: StyleFidelityBlockRow[];
  previewBlocks: SerializedPreviewBlock[];
  previewBlockCount: number;
  copyHtml: string;
  copyHtmlExcerpt: string;
  copyHtmlLength: number;
  copyViolations: CopySafeHtmlViolation[];
  copySafe: boolean;
  snapshotHint: string;
};

function goldenNormalizedInput(article: Article) {
  return parseAndNormalizeInputRequest({
    mode: "topic_only",
    topic: article.metadata.title,
    styleIntent: {
      densityHint: "medium",
      presetHint: R1_GOLDEN_PRESET_ID,
    },
    metadata: { locale: "zh-CN", source: "style-fidelity-debug" },
  });
}

export function parseR1GoldenFixtureId(
  value: string | undefined,
): R1GoldenFixtureId {
  if (value && (R1_GOLDEN_FIXTURE_IDS as readonly string[]).includes(value)) {
    return value as R1GoldenFixtureId;
  }
  return "r1-golden-default-article";
}

export function listR1GoldenFixtureIds(): readonly R1GoldenFixtureId[] {
  return R1_GOLDEN_FIXTURE_IDS;
}

/**
 * Server-only entry: builds Preview blocks + Copy HTML with the real preview pipeline.
 */
export function buildStyleFidelityPageData(
  fixtureId: R1GoldenFixtureId,
): StyleFidelityPageData {
  const article = loadR1GoldenArticle(fixtureId);
  const rendered = renderArticlePreviewClient(
    article,
    goldenNormalizedInput(article),
    GOLDEN_PREVIEW_CONTROL,
  );

  const registry = createFirstWaveRequiredVariantRegistry();
  const resolved = resolveArticleStyle(rendered.article, registry);
  const copyHtml = rendered.clipboard.textHtml;
  const violations = collectCopySafeHtmlViolations(copyHtml);

  const blocks: StyleFidelityBlockRow[] = rendered.article.blocks.map((block) => {
    const resolvedBlock = resolved.blocks.find((entry) => entry.blockId === block.id);
    const previewRow = rendered.previewBlocks.find((row) => row.blockId === block.id);
    return {
      blockId: block.id,
      blockType: block.type,
      variantId: resolvedBlock?.variantId ?? previewRow?.variantId ?? "—",
      familyId: resolvedBlock?.variant.family ?? "—",
    };
  });

  return {
    fixtureId,
    presetId: rendered.article.styleAssignment.presetId,
    themeId: rendered.article.styleAssignment.themeId,
    colorPalette: GOLDEN_PREVIEW_CONTROL.colorPalette,
    pipelineLabel: STYLE_FIDELITY_PIPELINE_LABEL,
    blocks,
    previewBlocks: rendered.previewBlocks,
    previewBlockCount: rendered.previewBlocks.length,
    copyHtml,
    copyHtmlExcerpt:
      copyHtml.length > COPY_HTML_EXCERPT_MAX
        ? `${copyHtml.slice(0, COPY_HTML_EXCERPT_MAX)}\n… (${copyHtml.length} chars total)`
        : copyHtml,
    copyHtmlLength: copyHtml.length,
    copyViolations: violations,
    copySafe: violations.length === 0,
    snapshotHint: `tests/fixtures/articles/r1-golden-copy-snapshot.test.ts · fixture ${fixtureId}`,
  };
}

/** @deprecated Use buildStyleFidelityPageData on the server. */
export function buildStyleFidelityDebugReport(fixtureId: R1GoldenFixtureId) {
  const data = buildStyleFidelityPageData(fixtureId);
  return {
    fixtureId: data.fixtureId,
    presetId: data.presetId,
    themeId: data.themeId,
    blocks: data.blocks,
    copyHtmlLength: data.copyHtmlLength,
    copyViolations: data.copyViolations,
    copySafe: data.copySafe,
    snapshotHint: data.snapshotHint,
  };
}

export function buildGoldenCopyHtml(fixtureId: R1GoldenFixtureId): string {
  return buildStyleFidelityPageData(fixtureId).copyHtml;
}
