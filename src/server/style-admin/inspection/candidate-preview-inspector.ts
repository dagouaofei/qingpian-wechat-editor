import { createRelease1FirstWavePreviewRendererRegistry, renderBlock, renderTargetForMode } from "@/core/renderer";
import { resolveArticleStyle } from "@/core/styles";
import {
  isStyleLibraryHtmlPasteCandidateVariant,
  renderStyleLibraryHtmlPasteCandidateBlock,
} from "@/core/style-library/inspection-render-adapter";

import type {
  CandidateInspectionFixture,
  CandidatePreviewInspection,
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

export function inspectCandidatePreview(
  source: DbCandidateInspectionSource,
  fixture: CandidateInspectionFixture,
): CandidatePreviewInspection {
  const variantDefinition = mapDbCandidateToVariantDefinition(source);
  if (!variantDefinition) {
    return {
      ok: false,
      status: "error",
      blockType: source.blockType,
      variantId: source.runtimeVariantId,
      fixtureText: fixture.sampleText,
      outputKind: null,
      issues: ["definitionJson is invalid or missing"],
      usedAdminFallback: false,
    };
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
  let usedAdminFallback = false;

  if (isStyleLibraryHtmlPasteCandidateVariant(source.runtimeVariantId)) {
    result = renderStyleLibraryHtmlPasteCandidateBlock(input);
  } else if (shouldUseAdminInspectionFallback(source.runtimeVariantId, source.styleFamily)) {
    usedAdminFallback = true;
    result = renderAdminDbCandidateBlock(input, source);
  } else {
    result = renderBlock({
      input,
      registry: PREVIEW_REGISTRY,
    });
    if (!result.ok && shouldUseAdminInspectionFallback(source.runtimeVariantId, source.styleFamily)) {
      usedAdminFallback = true;
      result = renderAdminDbCandidateBlock(input, source);
    }
  }

  return {
    ok: result.ok,
    status: result.ok ? "ok" : "error",
    blockType: source.blockType,
    variantId: source.runtimeVariantId,
    fixtureText: fixture.sampleText,
    outputKind: result.output?.kind ?? null,
    issues: result.issues.map((issue) => issue.message),
    usedAdminFallback,
  };
}
