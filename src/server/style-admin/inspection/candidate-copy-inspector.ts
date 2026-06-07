import { createRelease1FirstWaveCopyRendererRegistry } from "@/core/copy";
import { renderBlock, renderTargetForMode } from "@/core/renderer";
import { resolveArticleStyle } from "@/core/styles";
import {
  isStyleLibraryHtmlPasteCandidateVariant,
  renderStyleLibraryHtmlPasteCandidateBlock,
} from "@/core/style-library/inspection-render-adapter";

import type {
  CandidateCopyInspection,
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

const COPY_REGISTRY = createRelease1FirstWaveCopyRendererRegistry();

function extractCopyHtml(output: unknown): string | null {
  if (
    output != null &&
    typeof output === "object" &&
    "html" in output &&
    typeof (output as { html?: unknown }).html === "string"
  ) {
    return (output as { html: string }).html;
  }
  return null;
}

function summarizeHtml(html: string, max = 240): string {
  const flat = html.replace(/\s+/g, " ").trim();
  return flat.length <= max ? flat : `${flat.slice(0, max)}…`;
}

function extractPlainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function inspectCandidateCopy(
  source: DbCandidateInspectionSource,
  fixture: CandidateInspectionFixture,
): CandidateCopyInspection {
  const variantDefinition = mapDbCandidateToVariantDefinition(source);
  if (!variantDefinition) {
    return {
      ok: false,
      status: "error",
      blockType: source.blockType,
      variantId: source.runtimeVariantId,
      html: null,
      htmlSnippet: null,
      textPlain: null,
      copySafety: source.copySafety,
      usesInlineStyle: false,
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
    mode: "copy" as const,
    target: renderTargetForMode("copy"),
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
      registry: COPY_REGISTRY,
    });
    if (!result.ok) {
      usedAdminFallback = true;
      result = renderAdminDbCandidateBlock(input, source);
    }
  }

  const html = extractCopyHtml(result.output);
  return {
    ok: result.ok && html != null,
    status: result.ok && html != null ? "ok" : "error",
    blockType: source.blockType,
    variantId: source.runtimeVariantId,
    html,
    htmlSnippet: html != null ? summarizeHtml(html) : null,
    textPlain: html != null ? extractPlainText(html) : null,
    copySafety: source.copySafety,
    usesInlineStyle: html != null && /style\s*=/.test(html),
    issues: result.issues.map((issue) => issue.message),
    usedAdminFallback,
  };
}
