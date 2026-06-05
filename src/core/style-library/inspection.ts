import { createRelease1FirstWaveCopyRendererRegistry, validateWechatCopyHtml } from "@/core/copy";
import { parseStyleRegistry, resolveArticleStyle } from "@/core/styles";
import {
  createRelease1FirstWavePreviewRendererRegistry,
  renderBlock,
  renderTargetForMode,
  type RendererOutputPlaceholder,
} from "@/core/renderer";

import {
  STYLE_LIBRARY_INSPECTION_CONTEXT,
  createCandidatePreviewFixture,
  createStyleLibraryInspectionStyleRegistry,
  getStyleLibraryInspectionFixture,
} from "./inspection-fixtures";
import {
  isStyleLibraryHtmlPasteCandidateVariant,
  renderStyleLibraryHtmlPasteCandidateBlock,
} from "./inspection-render-adapter";
import type {
  PromoteReadiness,
  StyleLibraryCopyInspectionResult,
  StyleLibraryInspectionSummary,
  StyleLibraryInspectionTarget,
  StyleLibraryInspectionValidatorStatus,
  StyleLibraryPreviewInspectionResult,
  StyleLibraryValidatorInspectionResult,
} from "./inspection-result";
import { STYLE_LIBRARY_LIFECYCLE_ORDER } from "./lifecycle";
import { LIFECYCLE_PROMOTE_STORY } from "./lifecycle-rules";
import type { StyleLibraryManifest, StyleLibraryVariantAsset } from "./types";

const INSPECTION_STYLE_REGISTRY = parseStyleRegistry(
  createStyleLibraryInspectionStyleRegistry(),
);
const PREVIEW_REGISTRY = createRelease1FirstWavePreviewRendererRegistry();
const COPY_REGISTRY = createRelease1FirstWaveCopyRendererRegistry();

const HTML_SNIPPET_MAX = 240;

function extractCopyHtml(output: RendererOutputPlaceholder | undefined): string | null {
  if (
    output != null &&
    "html" in output &&
    typeof output.html === "string"
  ) {
    return output.html;
  }
  return null;
}

function summarizeHtml(html: string, max = HTML_SNIPPET_MAX): string {
  const flat = html.replace(/\s+/g, " ").trim();
  return flat.length <= max ? flat : `${flat.slice(0, max)}…`;
}

function deriveValidatorStatus(
  valid: boolean,
  warningCount: number,
): StyleLibraryInspectionValidatorStatus {
  if (!valid) return "FAIL";
  if (warningCount > 0) return "WARNING";
  return "PASS";
}

function hasInlineStyle(html: string | null): boolean {
  return html != null && /style\s*=/.test(html);
}

function scanCopyHtmlRisk(html: string | null): {
  hasForbiddenCapability: boolean;
  hasRiskyCapability: boolean;
} {
  if (html == null) {
    return { hasForbiddenCapability: false, hasRiskyCapability: false };
  }

  const lower = html.toLowerCase();
  const hasForbiddenCapability =
    lower.includes("<style") ||
    lower.includes("class=") ||
    lower.includes("<link") ||
    lower.includes("!important") ||
    lower.includes("calc(") ||
    lower.includes("var(--");

  const hasRiskyCapability =
    !hasForbiddenCapability &&
    (lower.includes("display:inline-block") ||
      lower.includes("display: inline-block") ||
      lower.includes("background-color"));

  return { hasForbiddenCapability, hasRiskyCapability };
}

function hasPasteQaEvidence(
  asset: StyleLibraryVariantAsset,
  manifest: StyleLibraryManifest,
): boolean {
  const pasteQaEvidenceIds = new Set(
    manifest.evidenceRefs
      .filter((ref) => ref.kind === "paste_qa")
      .map((ref) => ref.evidenceId),
  );
  if ((asset.evidenceIds ?? []).some((id) => pasteQaEvidenceIds.has(id))) {
    return true;
  }

  const lifecycleIndex = STYLE_LIBRARY_LIFECYCLE_ORDER.indexOf(asset.lifecycle);
  const pasteQaIndex = STYLE_LIBRARY_LIFECYCLE_ORDER.indexOf("paste_qa_pass");
  return lifecycleIndex >= pasteQaIndex && pasteQaIndex >= 0;
}

function buildPromoteReadiness(
  asset: StyleLibraryVariantAsset,
  manifest: StyleLibraryManifest,
  validator: StyleLibraryValidatorInspectionResult,
): PromoteReadiness {
  const validatorStatus = validator.status;
  const hasBlockingIssues = validator.blockerCount > 0 || !validator.valid;
  const pasteQaEvidence = hasPasteQaEvidence(asset, manifest);
  const blockedReasons: string[] = [];

  if (validatorStatus === "FAIL") {
    blockedReasons.push("VALIDATOR_FAIL");
  }
  if (hasBlockingIssues) {
    blockedReasons.push("BLOCKING_ISSUES");
  }
  if (!pasteQaEvidence) {
    blockedReasons.push("NEEDS_PASTE_QA");
  }

  const readyForPromoteReview =
    !hasBlockingIssues &&
    validatorStatus !== "FAIL" &&
    pasteQaEvidence &&
    asset.lifecycle === "paste_qa_pass";

  return {
    candidateId: asset.assetId,
    runtimeVariantId: asset.runtimeVariantId,
    validatorStatus,
    hasPasteQaEvidence: pasteQaEvidence,
    hasBlockingIssues,
    readyForPromoteReview,
    blockedReasons,
    nextRequiredStory: readyForPromoteReview ? LIFECYCLE_PROMOTE_STORY : null,
  };
}

function resolveOperatorConclusionKey(
  readiness: PromoteReadiness,
  validator: StyleLibraryValidatorInspectionResult,
): StyleLibraryInspectionSummary["operatorConclusionKey"] {
  if (validator.status === "FAIL" || !validator.valid) {
    return "validator_fail";
  }
  if (readiness.hasBlockingIssues) {
    return "has_blocking_issues";
  }
  if (!readiness.hasPasteQaEvidence) {
    return "needs_paste_qa";
  }
  if (readiness.readyForPromoteReview && validator.status === "WARNING") {
    return "ready_for_promote_review_with_warnings";
  }
  return "ready_for_promote_review";
}

export function buildStyleLibraryInspectionTarget(
  asset: StyleLibraryVariantAsset,
  _manifest?: StyleLibraryManifest,
): StyleLibraryInspectionTarget {
  const fixture = getStyleLibraryInspectionFixture(asset);
  return {
    assetId: asset.assetId,
    runtimeVariantId: asset.runtimeVariantId,
    blockType: asset.blockType,
    fixtureId: fixture.fixtureId,
    fixtureLabel: fixture.fixtureLabel,
    fixtureText: fixture.fixtureText,
    inspectionContext: STYLE_LIBRARY_INSPECTION_CONTEXT,
  };
}

export { createCandidatePreviewFixture } from "./inspection-fixtures";

function renderInspectionBlock(
  asset: StyleLibraryVariantAsset,
  mode: "preview" | "copy",
) {
  const article = createCandidatePreviewFixture(asset);
  const resolved = resolveArticleStyle(article, INSPECTION_STYLE_REGISTRY);
  const block = article.blocks[0]!;
  const input = {
    article,
    block,
    resolvedArticleStyle: resolved,
    mode,
    target: renderTargetForMode(mode),
  };

  if (isStyleLibraryHtmlPasteCandidateVariant(asset.runtimeVariantId)) {
    return renderStyleLibraryHtmlPasteCandidateBlock(input);
  }

  return renderBlock({
    input,
    registry: mode === "preview" ? PREVIEW_REGISTRY : COPY_REGISTRY,
  });
}

export function renderStyleLibraryCandidatePreview(
  asset: StyleLibraryVariantAsset,
  _manifest?: StyleLibraryManifest,
): StyleLibraryPreviewInspectionResult {
  const fixture = getStyleLibraryInspectionFixture(asset);
  const result = renderInspectionBlock(asset, "preview");

  return {
    ok: result.ok,
    status: result.ok ? "ok" : "error",
    blockType: asset.blockType,
    variantId: asset.runtimeVariantId,
    fixtureText: fixture.fixtureText,
    outputKind: result.output?.kind ?? null,
    output: result.output ?? null,
    issues: result.issues.map((issue) => issue.message),
  };
}

export function renderStyleLibraryCandidateCopyHtml(
  asset: StyleLibraryVariantAsset,
  _manifest?: StyleLibraryManifest,
): StyleLibraryCopyInspectionResult {
  const result = renderInspectionBlock(asset, "copy");
  const html = extractCopyHtml(result.output ?? undefined);
  const risk = scanCopyHtmlRisk(html);

  return {
    ok: result.ok && html != null,
    status: result.ok && html != null ? "ok" : "error",
    blockType: asset.blockType,
    variantId: asset.runtimeVariantId,
    html,
    htmlSnippet: html != null ? summarizeHtml(html) : null,
    usesInlineStyle: hasInlineStyle(html),
    hasForbiddenCapability: risk.hasForbiddenCapability,
    hasRiskyCapability: risk.hasRiskyCapability,
    issues: result.issues.map((issue) => issue.message),
  };
}

export function validateStyleLibraryCandidateCopyHtml(
  asset: StyleLibraryVariantAsset,
  manifest: StyleLibraryManifest = {} as StyleLibraryManifest,
): StyleLibraryValidatorInspectionResult {
  const copy = renderStyleLibraryCandidateCopyHtml(asset, manifest);
  if (copy.html == null) {
    return {
      status: "FAIL",
      valid: false,
      issueCount: 1,
      blockerCount: 1,
      warningCount: 0,
      noteCount: 0,
      issues: [],
      validation: null,
    };
  }

  const validation = validateWechatCopyHtml({
    html: copy.html,
    blockType: asset.blockType,
    variantId: asset.runtimeVariantId,
  });

  const blockerCount = validation.errors.length;
  const warningCount = validation.warnings.length;
  const noteCount = validation.notes.length;

  return {
    status: deriveValidatorStatus(validation.valid, warningCount),
    valid: validation.valid,
    issueCount: validation.issues.length,
    blockerCount,
    warningCount,
    noteCount,
    issues: validation.issues,
    validation,
  };
}

export function getStyleLibraryInspectionSummary(
  asset: StyleLibraryVariantAsset,
  manifest: StyleLibraryManifest,
): StyleLibraryInspectionSummary {
  const target = buildStyleLibraryInspectionTarget(asset);
  const preview = renderStyleLibraryCandidatePreview(asset);
  const copy = renderStyleLibraryCandidateCopyHtml(asset);
  const validator = validateStyleLibraryCandidateCopyHtml(asset, manifest);
  const promoteReadiness = buildPromoteReadiness(asset, manifest, validator);

  return {
    target,
    preview,
    copy,
    validator,
    promoteReadiness,
    operatorConclusionKey: resolveOperatorConclusionKey(promoteReadiness, validator),
  };
}

export function getStyleLibraryInspectionSummaries(
  manifest: StyleLibraryManifest,
): StyleLibraryInspectionSummary[] {
  return manifest.assets
    .filter((asset): asset is StyleLibraryVariantAsset => asset.assetType === "variant")
    .filter(
      (asset) =>
        asset.isSeedAsset === true || asset.lifecycle === "user_selectable",
    )
    .map((asset) => getStyleLibraryInspectionSummary(asset, manifest));
}
