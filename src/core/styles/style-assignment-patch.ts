/**
 * StyleAssignmentPatch merge helpers — only mutates styleAssignment, never blocks content.
 */

import type { Article, BlockStyleOverride, StyleAssignment } from "@/core/article";

import type {
  ArticleStylePlan,
  MergeStyleAssignmentPatchOptions,
  MergeStyleAssignmentPatchResult,
  StyleAssignmentPatch,
  StyleAssignmentPatchBlockOverride,
} from "./style-assignment";
import {
  safeParseStyleAssignmentPatch,
  styleAssignmentPatchSchema,
} from "./style-assignment-schemas";
import type { StyleValidationIssue } from "./types";
import { buildStyleValidationResult } from "./validation";

const MERGEABLE_PATCH_STATUSES = new Set(["valid", "fallback_applied"]);

function createIssue(
  code: string,
  message: string,
  partial?: Partial<StyleValidationIssue>,
): StyleValidationIssue {
  return {
    severity: "error",
    code,
    message,
    ...partial,
  };
}

function patchBlockOverrideToAssignmentOverride(
  override: StyleAssignmentPatchBlockOverride,
): BlockStyleOverride {
  return {
    blockId: override.blockId,
    ...(override.variantId !== undefined ? { variantId: override.variantId } : {}),
    ...(override.slotOverrides !== undefined
      ? { slotOverrides: override.slotOverrides }
      : {}),
  };
}

function mergeBlockOverrides(
  current: BlockStyleOverride[] | undefined,
  patchOverrides: StyleAssignmentPatchBlockOverride[] | undefined,
): BlockStyleOverride[] | undefined {
  if (!patchOverrides?.length) {
    return current?.length ? [...current] : undefined;
  }

  const merged = new Map<string, BlockStyleOverride>();

  for (const override of current ?? []) {
    merged.set(override.blockId, { ...override });
  }

  for (const patchOverride of patchOverrides) {
    const existing = merged.get(patchOverride.blockId);
    const next = patchBlockOverrideToAssignmentOverride(patchOverride);
    const slotOverrides = {
      ...existing?.slotOverrides,
      ...next.slotOverrides,
    };
    const hasSlotOverrides = Object.keys(slotOverrides).length > 0;

    merged.set(patchOverride.blockId, {
      blockId: patchOverride.blockId,
      ...(next.variantId ?? existing?.variantId
        ? { variantId: next.variantId ?? existing?.variantId }
        : {}),
      ...(hasSlotOverrides ? { slotOverrides } : {}),
    });
  }

  const result = [...merged.values()];
  return result.length > 0 ? result : undefined;
}

function validatePatchMeta(
  patch: StyleAssignmentPatch,
  options?: MergeStyleAssignmentPatchOptions,
): StyleValidationIssue[] {
  const issues: StyleValidationIssue[] = [];

  if (!patch.meta?.source) {
    issues.push(
      createIssue(
        "style_assignment_patch_missing_source",
        "patch meta.source is required",
      ),
    );
  }

  if (options?.requireValidatedMeta) {
    const status = patch.meta?.validationStatus;
    if (!status || !MERGEABLE_PATCH_STATUSES.has(status)) {
      issues.push(
        createIssue(
          "style_assignment_patch_not_validated",
          "patch meta.validationStatus must be valid or fallback_applied before merge",
          { path: ["meta", "validationStatus"] },
        ),
      );
    }
  }

  return issues;
}

export function mergeStyleAssignmentPatch(
  current: StyleAssignment,
  patch: StyleAssignmentPatch,
  options?: MergeStyleAssignmentPatchOptions,
): MergeStyleAssignmentPatchResult {
  const parsed = styleAssignmentPatchSchema.safeParse(patch);
  if (!parsed.success) {
    return {
      ok: false,
      issues: parsed.error.issues.map((issue) =>
        createIssue("style_assignment_patch_invalid", issue.message, {
          path: issue.path.filter(
            (segment): segment is string | number =>
              typeof segment === "string" || typeof segment === "number",
          ),
        }),
      ),
    };
  }

  const metaIssues = validatePatchMeta(parsed.data, options);
  if (metaIssues.length > 0) {
    return buildStyleValidationResult(metaIssues) as MergeStyleAssignmentPatchResult;
  }

  const styleAssignment: StyleAssignment = {
    themeId: parsed.data.themeId ?? current.themeId,
    presetId: parsed.data.presetId ?? current.presetId,
    blockOverrides: mergeBlockOverrides(
      current.blockOverrides,
      parsed.data.blockOverrides,
    ),
  };

  return {
    ok: true,
    issues: [],
    styleAssignment,
  };
}

export function applyStyleAssignmentPatch(
  article: Article,
  patch: StyleAssignmentPatch,
  options?: MergeStyleAssignmentPatchOptions,
): { article: Article; result: MergeStyleAssignmentPatchResult } {
  const mergeResult = mergeStyleAssignmentPatch(
    article.styleAssignment,
    patch,
    options,
  );

  if (!mergeResult.ok || !mergeResult.styleAssignment) {
    return { article, result: mergeResult };
  }

  return {
    article: {
      ...article,
      styleAssignment: mergeResult.styleAssignment,
    },
    result: mergeResult,
  };
}

export function patchToArticleStylePlan(
  articleId: string,
  current: StyleAssignment,
  patch: StyleAssignmentPatch,
  density?: ArticleStylePlan["density"],
): { ok: boolean; issues: StyleValidationIssue[]; plan?: ArticleStylePlan } {
  const parsed = safeParseStyleAssignmentPatch(patch);
  if (!parsed.success) {
    return {
      ok: false,
      issues: parsed.error.issues.map((issue) =>
        createIssue("style_assignment_patch_invalid", issue.message, {
          path: issue.path.filter(
            (segment): segment is string | number =>
              typeof segment === "string" || typeof segment === "number",
          ),
        }),
      ),
    };
  }

  const mergeResult = mergeStyleAssignmentPatch(current, parsed.data);
  if (!mergeResult.ok || !mergeResult.styleAssignment) {
    return { ok: false, issues: mergeResult.issues };
  }

  return {
    ok: true,
    issues: [],
    plan: {
      articleId,
      presetId: mergeResult.styleAssignment.presetId,
      themeId: mergeResult.styleAssignment.themeId,
      density,
      blockOverrides: mergeResult.styleAssignment.blockOverrides,
      meta: parsed.data.meta,
    },
  };
}

export function styleAssignmentToArticleStylePlan(
  articleId: string,
  assignment: StyleAssignment,
  meta?: ArticleStylePlan["meta"],
  orchestratorHints?: ArticleStylePlan["orchestratorHints"],
): ArticleStylePlan {
  return {
    articleId,
    presetId: assignment.presetId,
    themeId: assignment.themeId,
    blockOverrides: assignment.blockOverrides,
    meta,
    orchestratorHints,
  };
}
