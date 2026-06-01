import type { Article } from "@/core/article";
import {
  applyValidatedStyleSelection,
  validateStyleSelectionPipeline,
  type StyleSelectionValidationResult,
  type ValidateStyleSelectionOptions,
} from "@/core/styles/style-selection-validation";
import type {
  StyleAssignmentPatch,
  StyleSelectionRequest,
} from "@/core/styles/style-assignment";
import { resolveArticleStyle } from "@/core/styles/resolver";
import type { ResolvedArticleStyle, StyleRegistry, StyleValidationIssue } from "@/core/styles/types";

import {
  SAFE_STYLE_PRESET_ID,
  SAFE_STYLE_THEME_ID,
} from "./style-selection-prompt";

export type ApplyValidatedStyleAssignmentPatchResult = {
  article: Article;
  applied: boolean;
  validation: StyleSelectionValidationResult;
  resolvedStyle?: ResolvedArticleStyle;
  resolverIssues: StyleValidationIssue[];
};

export function applyValidatedStyleAssignmentPatch(
  article: Article,
  patch: StyleAssignmentPatch,
  registry: StyleRegistry,
  options: ValidateStyleSelectionOptions = {},
): ApplyValidatedStyleAssignmentPatchResult {
  const validation = validateStyleSelectionPipeline(
    article,
    registry,
    { kind: "style_assignment_patch", patch },
    options,
  );

  const { article: nextArticle, applied } = applyValidatedStyleSelection(
    article,
    validation,
  );

  const resolver = verifyArticleStyleResolvable(nextArticle, registry);
  return {
    article: nextArticle,
    applied,
    validation,
    resolvedStyle: resolver.resolvedStyle,
    resolverIssues: resolver.issues,
  };
}

export function applyValidatedStyleSelectionRequest(
  article: Article,
  request: StyleSelectionRequest,
  registry: StyleRegistry,
  options: ValidateStyleSelectionOptions = {},
): ApplyValidatedStyleAssignmentPatchResult {
  const validation = validateStyleSelectionPipeline(
    article,
    registry,
    { kind: "style_selection_request", request },
    options,
  );

  const { article: nextArticle, applied } = applyValidatedStyleSelection(
    article,
    validation,
  );

  const resolver = verifyArticleStyleResolvable(nextArticle, registry);
  return {
    article: nextArticle,
    applied,
    validation,
    resolvedStyle: resolver.resolvedStyle,
    resolverIssues: resolver.issues,
  };
}

export function verifyArticleStyleResolvable(
  article: Article,
  registry: StyleRegistry,
): {
  ok: boolean;
  resolvedStyle?: ResolvedArticleStyle;
  issues: StyleValidationIssue[];
} {
  try {
    const resolvedStyle = resolveArticleStyle(article, registry);
    return { ok: true, resolvedStyle, issues: [] };
  } catch (error) {
    return {
      ok: false,
      issues: [
        {
          severity: "error",
          code: "style_resolver_failed",
          message:
            error instanceof Error
              ? error.message
              : "StyleResolver failed to resolve article style",
          path: ["styleAssignment"],
        },
      ],
    };
  }
}

export function buildSafeFallbackStyleAssignmentPatch(
  timestamp: string,
  reason: string,
): StyleAssignmentPatch {
  return {
    presetId: SAFE_STYLE_PRESET_ID,
    themeId: SAFE_STYLE_THEME_ID,
    meta: {
      source: "system",
      validationStatus: "fallback_applied",
      generatedAt: timestamp,
      issues: [
        {
          severity: "warning",
          code: "style_selection_fallback_applied",
          message: reason,
          path: [],
        },
      ],
    },
  };
}
