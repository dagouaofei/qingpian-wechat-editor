import {
  buildClipboardPayload,
  collectCopySafeHtmlViolations,
  createRelease1FirstWaveCopyRendererRegistry,
  RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES,
} from "@/core/copy";
import { parseAndNormalizeInputRequest } from "@/core/generation/input.normalize";
import { generateDeterministicStyleSelection } from "@/core/generation/style-selection";
import {
  createRelease1FirstWavePreviewRendererRegistry,
  renderArticleBlocks,
  renderTargetForMode,
} from "@/core/renderer";
import {
  createFirstWaveRequiredVariantRegistry,
  resolveArticleStyle,
} from "@/core/styles";
import type { Article } from "@/core/article";
import {
  loadR1GoldenArticle,
  R1_GOLDEN_FIXTURE_IDS,
  type R1GoldenFixtureId,
} from "@/fixtures/r1-golden";

export type { R1GoldenFixtureId };

export type StyleFidelityBlockRow = {
  blockId: string;
  blockType: string;
  variantId: string;
  familyId: string;
  density?: string;
};

export type StyleFidelityDebugReport = {
  fixtureId: R1GoldenFixtureId;
  presetId: string;
  themeId: string;
  blocks: StyleFidelityBlockRow[];
  copyHtmlLength: number;
  copyViolations: ReturnType<typeof collectCopySafeHtmlViolations>;
  copySafe: boolean;
  snapshotHint: string;
};

export function buildStyleFidelityDebugReport(
  fixtureId: R1GoldenFixtureId,
): StyleFidelityDebugReport {
  const article = loadR1GoldenArticle(fixtureId);
  const registry = createFirstWaveRequiredVariantRegistry();
  const normalizedInput = parseAndNormalizeInputRequest({
    mode: "topic_only",
    topic: article.metadata.title,
    styleIntent: { densityHint: "medium", presetHint: "business" },
    metadata: { locale: "zh-CN", source: "style-fidelity-debug" },
  });

  const styleResult = generateDeterministicStyleSelection({
    article,
    normalizedInput,
    registry,
    timestamp: "2026-06-02T12:00:00.000Z",
  });

  const styledArticle = styleResult.article;
  const resolved = resolveArticleStyle(styledArticle, registry);
  const clipboard = buildClipboardPayload({
    article: styledArticle,
    resolvedArticleStyle: resolved,
    registry: createRelease1FirstWaveCopyRendererRegistry(),
    supportedBlockTypes: RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES,
  });

  const copyHtml = clipboard.textHtml;
  const violations = collectCopySafeHtmlViolations(copyHtml);

  const blocks: StyleFidelityBlockRow[] = styledArticle.blocks.map((block) => {
    const resolvedBlock = resolved.blocks.find((entry) => entry.blockId === block.id);
    return {
      blockId: block.id,
      blockType: block.type,
      variantId: resolvedBlock?.variantId ?? "—",
      familyId: resolvedBlock?.variant.family ?? "—",
      density:
        typeof normalizedInput.styleIntent?.densityHint === "string"
          ? normalizedInput.styleIntent.densityHint
          : undefined,
    };
  });

  return {
    fixtureId,
    presetId: styledArticle.styleAssignment.presetId,
    themeId: styledArticle.styleAssignment.themeId,
    blocks,
    copyHtmlLength: copyHtml.length,
    copyViolations: violations,
    copySafe: violations.length === 0,
    snapshotHint: `tests/fixtures/articles/r1-golden-copy-snapshot.test.ts · fixture ${fixtureId}`,
  };
}

export function listR1GoldenFixtureIds(): readonly R1GoldenFixtureId[] {
  return R1_GOLDEN_FIXTURE_IDS;
}

export function buildGoldenCopyHtml(fixtureId: R1GoldenFixtureId): string {
  const article = loadR1GoldenArticle(fixtureId);
  const registry = createFirstWaveRequiredVariantRegistry();
  const normalizedInput = parseAndNormalizeInputRequest({
    mode: "topic_only",
    topic: article.metadata.title,
    styleIntent: { densityHint: "medium", presetHint: "business" },
    metadata: { locale: "zh-CN", source: "style-fidelity-debug" },
  });
  const styleResult = generateDeterministicStyleSelection({
    article,
    normalizedInput,
    registry,
    timestamp: "2026-06-02T12:00:00.000Z",
  });
  const resolved = resolveArticleStyle(styleResult.article, registry);
  return buildClipboardPayload({
    article: styleResult.article,
    resolvedArticleStyle: resolved,
    registry: createRelease1FirstWaveCopyRendererRegistry(),
    supportedBlockTypes: RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES,
  }).textHtml;
}

export function renderGoldenPreviewHtml(article: Article): string {
  const registry = createFirstWaveRequiredVariantRegistry();
  const resolved = resolveArticleStyle(article, registry);
  const previewRegistry = createRelease1FirstWavePreviewRendererRegistry();
  const results = renderArticleBlocks({
    article,
    resolvedArticleStyle: resolved,
    mode: "preview",
    target: renderTargetForMode("preview"),
    registry: previewRegistry,
    supportedBlockTypes: [
      "title",
      "lead",
      "heading",
      "paragraph",
      "divider",
      "list",
      "quote",
      "highlight",
      "info_card",
      "cta",
      "image_placeholder",
    ],
  });

  return results
    .filter((result) => result.ok && result.output)
    .map((result) => {
      const output = result.output as { html?: string };
      return output.html ?? "";
    })
    .join("\n");
}
