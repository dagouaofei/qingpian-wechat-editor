import { createRelease1FirstWavePreviewRendererRegistry, renderBlock, renderTargetForMode } from "@/core/renderer";
import { resolveArticleStyle } from "@/core/styles";
import {
  isStyleLibraryHtmlPasteCandidateVariant,
  renderStyleLibraryHtmlPasteCandidateBlock,
} from "@/core/style-library/inspection-render-adapter";
import type { SerializedPreviewBlock } from "@/server/generation/generate-flow-types";

import type {
  CandidateInspectionFixture,
  DbCandidateInspectionSource,
} from "./candidate-inspection-types";
import {
  buildDbCandidateInspectionArticle,
  renderAdminDbCandidateBlock,
} from "./db-candidate-admin-render";
import {
  mapDbCandidateToVariantDefinition,
  shouldUseAdminInspectionFallback,
} from "./db-candidate-variant-mapper";
import { parseDbCandidateInspectionRegistry } from "./db-candidate-inspection-registry";

const PREVIEW_REGISTRY = createRelease1FirstWavePreviewRendererRegistry();

export function buildCandidatePreviewBlock(
  source: DbCandidateInspectionSource,
  fixture: CandidateInspectionFixture,
): SerializedPreviewBlock | null {
  const variantDefinition = mapDbCandidateToVariantDefinition(source);
  if (!variantDefinition) {
    return null;
  }

  const article = buildDbCandidateInspectionArticle(source, fixture);
  const styleRegistry = parseDbCandidateInspectionRegistry(variantDefinition);
  const resolved = resolveArticleStyle(article, styleRegistry);
  const block = article.blocks[0]!;
  const input = {
    article,
    block,
    resolvedArticleStyle: resolved,
    mode: "preview" as const,
    target: renderTargetForMode("preview"),
  };

  let result;
  if (isStyleLibraryHtmlPasteCandidateVariant(source.runtimeVariantId)) {
    result = renderStyleLibraryHtmlPasteCandidateBlock(input);
  } else if (shouldUseAdminInspectionFallback(source.runtimeVariantId, source.styleFamily)) {
    result = renderAdminDbCandidateBlock(input, source);
  } else {
    result = renderBlock({ input, registry: PREVIEW_REGISTRY });
    if (!result.ok) {
      result = renderAdminDbCandidateBlock(input, source);
    }
  }

  if (!result.ok || !result.output) {
    return {
      blockId: block.id,
      blockType: source.blockType,
      variantId: source.runtimeVariantId,
      ok: false,
      issues: result.issues,
      warnings: result.warnings ?? [],
    };
  }

  return {
    blockId: block.id,
    blockType: source.blockType,
    variantId: source.runtimeVariantId,
    ok: true,
    output: result.output,
    issues: [],
    warnings: result.warnings ?? [],
  };
}
