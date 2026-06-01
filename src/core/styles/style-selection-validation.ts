/**
 * Style Selection Validation Pipeline — S3C-STORY-005
 * @see docs/architecture/style-system.md §11.8.3
 */

import type { Article, StyleAssignment } from "@/core/article";

import { orchestrateArticleStyle } from "./style-orchestrator";
import type {
  ArticleStylePlan,
  StyleAssignmentPatch,
  StyleAssignmentValidationStatus,
  StyleSelectionRequest,
} from "./style-assignment";
import {
  patchToArticleStylePlan,
  styleAssignmentToArticleStylePlan,
} from "./style-assignment-patch";
import {
  safeParseArticleStylePlan,
  safeParseStyleAssignmentPatch,
  safeParseStyleSelectionRequest,
} from "./style-assignment-schemas";
import { validateBlockStyleProtocolBundle } from "./protocol-validation";
import {
  validatePresetThemeCombination,
  validateStyleAssignmentBlockOverride,
  validateThemePresetDensitySlotCombination,
} from "./style-combination-validation";
import type { StyleRegistry, StyleValidationIssue } from "./types";
import type { VisualAssetRegistry } from "./visual-assets";
import { RELEASE1_VISUAL_ASSET_REGISTRY } from "./visual-asset-registry";

export const STYLE_SELECTION_VALIDATION_STAGES = [
  "input_schema",
  "plan_conversion",
  "preset_theme_combination",
  "block_protocol",
  "orchestrator",
  "post_orchestrator_validation",
] as const;

export type StyleSelectionValidationStage =
  (typeof STYLE_SELECTION_VALIDATION_STAGES)[number];

export type StyleSelectionValidationInputKind =
  | "style_selection_request"
  | "style_assignment_patch"
  | "article_style_plan";

export type StyleSelectionValidationInput =
  | {
      kind: "style_selection_request";
      request: StyleSelectionRequest;
    }
  | {
      kind: "style_assignment_patch";
      patch: StyleAssignmentPatch;
    }
  | {
      kind: "article_style_plan";
      plan: ArticleStylePlan;
    };

export type StyleSelectionValidationSnapshot = {
  inputKind: StyleSelectionValidationInputKind;
  expectedOk: boolean;
  expectedIssueCodes: string[];
  expectedFallbackBlockIds?: string[];
  expectedFinalVariantIds?: Record<string, string>;
  expectedAssetIssueCodes?: string[];
  stages: StyleSelectionValidationStage[];
  validationStatus?: StyleAssignmentValidationStatus;
  mergeAllowed: boolean;
};

export type ValidateStyleSelectionOptions = {
  assetRegistry?: VisualAssetRegistry;
  requireRelease1RequiredPath?: boolean;
  maxAssetReuse?: number;
  applyRhythmRules?: boolean;
};

export type StyleSelectionValidationResult = {
  ok: boolean;
  plan: ArticleStylePlan;
  styleAssignment: StyleAssignment;
  issues: StyleValidationIssue[];
  validationStatus: StyleAssignmentValidationStatus;
  mergeAllowed: boolean;
  snapshot: StyleSelectionValidationSnapshot;
};

type StagedIssue = StyleValidationIssue & {
  stage: StyleSelectionValidationStage;
};

function tagIssue(
  issue: StyleValidationIssue,
  stage: StyleSelectionValidationStage,
): StagedIssue {
  return { ...issue, stage };
}

function hasErrorSeverity(issues: StyleValidationIssue[]): boolean {
  return issues.some((issue) => issue.severity === "error");
}

function deriveValidationStatus(
  issues: StyleValidationIssue[],
): StyleAssignmentValidationStatus {
  if (hasErrorSeverity(issues)) {
    return "invalid";
  }
  if (issues.some((issue) => issue.severity === "warning")) {
    return "fallback_applied";
  }
  return "valid";
}

function deriveMergeAllowed(
  validationStatus: StyleAssignmentValidationStatus,
): boolean {
  return validationStatus === "valid" || validationStatus === "fallback_applied";
}

function buildSnapshot(
  inputKind: StyleSelectionValidationInputKind,
  result: Pick<
    StyleSelectionValidationResult,
    "ok" | "issues" | "validationStatus" | "mergeAllowed" | "plan"
  >,
  stages: StyleSelectionValidationStage[],
): StyleSelectionValidationSnapshot {
  const fallbackBlockIds = result.plan.blockOverrides
    ?.filter((override) =>
      result.issues.some(
        (issue) =>
          issue.blockId === override.blockId &&
          (issue.code.includes("fallback") ||
            issue.code === "orchestrator_r1_fallback" ||
            issue.code === "orchestrator_r8_fallback"),
      ),
    )
    .map((override) => override.blockId);

  const finalVariantIds = Object.fromEntries(
    (result.plan.blockOverrides ?? []).map((override) => [
      override.blockId,
      override.variantId ?? "",
    ]),
  );

  return {
    inputKind,
    expectedOk: result.ok,
    expectedIssueCodes: [...new Set(result.issues.map((issue) => issue.code))],
    expectedFallbackBlockIds: fallbackBlockIds?.length
      ? fallbackBlockIds
      : undefined,
    expectedFinalVariantIds:
      Object.keys(finalVariantIds).length > 0 ? finalVariantIds : undefined,
    expectedAssetIssueCodes: [
      ...new Set(
        result.issues
          .filter((issue) => issue.code.includes("asset"))
          .map((issue) => issue.code),
      ),
    ],
    stages,
    validationStatus: result.validationStatus,
    mergeAllowed: result.mergeAllowed,
  };
}

function emptyResult(
  article: Article,
  inputKind: StyleSelectionValidationInputKind,
  issues: StyleValidationIssue[],
  stages: StyleSelectionValidationStage[],
): StyleSelectionValidationResult {
  const validationStatus = deriveValidationStatus(issues);
  const ok = !hasErrorSeverity(issues);
  const plan = styleAssignmentToArticleStylePlan(
    article.id,
    article.styleAssignment,
    {
      source: "system",
      validationStatus,
      issues: issues.length > 0 ? issues : undefined,
    },
  );
  const base = {
    ok,
    plan,
    styleAssignment: { ...article.styleAssignment },
    issues,
    validationStatus,
    mergeAllowed: deriveMergeAllowed(validationStatus),
  };

  return {
    ...base,
    snapshot: buildSnapshot(inputKind, base, stages),
  };
}

function patchBlockOverridesFromInput(
  input: StyleSelectionValidationInput,
): StyleAssignmentPatch["blockOverrides"] | undefined {
  if (input.kind === "style_assignment_patch") {
    return input.patch.blockOverrides;
  }
  if (input.kind === "style_selection_request") {
    return input.request.blockStyleHints.map((hint) => ({
      blockId: hint.blockId,
      variantId: hint.suggestedVariantId,
      familyId: hint.suggestedFamilyId,
      slotOverrides: hint.suggestedSlotOverrides,
      assetBindings: hint.suggestedAssetIds?.reduce<Record<string, string>>(
        (bindings, assetId, index) => {
          bindings[`asset_${index}`] = assetId;
          return bindings;
        },
        {},
      ),
    }));
  }
  return input.plan.blockOverrides?.map((override) => ({
    blockId: override.blockId,
    variantId: override.variantId,
    slotOverrides: override.slotOverrides,
  }));
}

function resolvePresetThemeDensity(
  article: Article,
  input: StyleSelectionValidationInput,
): {
  presetId?: string;
  themeId?: string;
  density?: ArticleStylePlan["density"];
} {
  if (input.kind === "style_assignment_patch") {
    return {
      presetId: input.patch.presetId ?? article.styleAssignment.presetId,
      themeId: input.patch.themeId ?? article.styleAssignment.themeId,
    };
  }
  if (input.kind === "style_selection_request") {
    return {
      presetId:
        input.request.preferredPresetId ?? article.styleAssignment.presetId,
      themeId: article.styleAssignment.themeId,
      density: input.request.articleContext?.densityHint as
        | ArticleStylePlan["density"]
        | undefined,
    };
  }
  return {
    presetId: input.plan.presetId,
    themeId: input.plan.themeId,
    density: input.plan.density,
  };
}

function validateInputSchema(
  input: StyleSelectionValidationInput,
  issues: StagedIssue[],
): boolean {
  if (input.kind === "style_selection_request") {
    const parsed = safeParseStyleSelectionRequest(input.request);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        issues.push(
          tagIssue(
            {
              severity: "error",
              code: "style_selection_request_invalid",
              message: issue.message,
              path: issue.path.map(String),
            },
            "input_schema",
          ),
        );
      }
      return false;
    }
    return true;
  }

  if (input.kind === "style_assignment_patch") {
    const parsed = safeParseStyleAssignmentPatch(input.patch);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        issues.push(
          tagIssue(
            {
              severity: "error",
              code: "style_assignment_patch_invalid",
              message: issue.message,
              path: issue.path.map(String),
            },
            "input_schema",
          ),
        );
      }
      return false;
    }
    return true;
  }

  const parsed = safeParseArticleStylePlan(input.plan);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      issues.push(
        tagIssue(
          {
            severity: "error",
            code: "article_style_plan_invalid",
            message: issue.message,
            path: issue.path.map(String),
          },
          "input_schema",
        ),
      );
    }
    return false;
  }
  return true;
}

function validateBlockOverridesPreOrchestrator(
  article: Article,
  blockOverrides: StyleAssignmentPatch["blockOverrides"],
  context: {
    registry: StyleRegistry;
    assetRegistry: VisualAssetRegistry;
    requireRelease1RequiredPath: boolean;
  },
  issues: StagedIssue[],
): void {
  if (!blockOverrides?.length) {
    return;
  }

  for (const override of blockOverrides) {
    const block = article.blocks.find((entry) => entry.id === override.blockId);
    if (!block) {
      issues.push(
        tagIssue(
          {
            severity: "error",
            code: "block_override_block_not_found",
            message: `Block override references unknown block "${override.blockId}"`,
            blockId: override.blockId,
            path: ["blockOverrides", override.blockId],
          },
          "block_protocol",
        ),
      );
      continue;
    }

    if (!override.variantId) {
      continue;
    }

    const combinationResult = validateStyleAssignmentBlockOverride(
      override,
      block.type,
      context,
    );
    for (const issue of combinationResult.issues) {
      issues.push(tagIssue(issue, "block_protocol"));
    }
  }
}

function validatePostOrchestratorPlan(
  article: Article,
  plan: ArticleStylePlan,
  context: {
    registry: StyleRegistry;
    assetRegistry: VisualAssetRegistry;
    requireRelease1RequiredPath: boolean;
  },
  issues: StagedIssue[],
): void {
  const combinationResult = validateThemePresetDensitySlotCombination({
    presetId: plan.presetId,
    themeId: plan.themeId,
    density: plan.density,
    context,
  });
  for (const issue of combinationResult.issues) {
    issues.push(tagIssue(issue, "post_orchestrator_validation"));
  }

  for (const block of article.blocks) {
    const override = plan.blockOverrides?.find(
      (entry) => entry.blockId === block.id,
    );
    if (!override?.variantId) {
      continue;
    }

    const bundleResult = validateBlockStyleProtocolBundle({
      blockType: block.type,
      blockId: block.id,
      variantId: override.variantId,
      slotOverrides: override.slotOverrides,
      context: {
        registry: context.registry,
        assetRegistry: context.assetRegistry,
        requireRelease1RequiredPath: context.requireRelease1RequiredPath,
        blockType: block.type,
        blockId: block.id,
      },
    });
    for (const issue of bundleResult.issues) {
      issues.push(tagIssue(issue, "post_orchestrator_validation"));
    }
  }
}

export function validateStyleSelectionPipeline(
  article: Article,
  registry: StyleRegistry,
  input: StyleSelectionValidationInput,
  options: ValidateStyleSelectionOptions = {},
): StyleSelectionValidationResult {
  const stagesRun: StyleSelectionValidationStage[] = [];
  const stagedIssues: StagedIssue[] = [];
  const assetRegistry = options.assetRegistry ?? RELEASE1_VISUAL_ASSET_REGISTRY;
  const requireRelease1RequiredPath = options.requireRelease1RequiredPath ?? true;
  const validationContext = {
    registry,
    assetRegistry,
    requireRelease1RequiredPath,
  };

  stagesRun.push("input_schema");
  const schemaOk = validateInputSchema(input, stagedIssues);
  if (!schemaOk) {
    return emptyResult(
      article,
      input.kind,
      stagedIssues,
      stagesRun,
    );
  }

  stagesRun.push("plan_conversion");
  const { presetId, themeId, density } = resolvePresetThemeDensity(
    article,
    input,
  );

  stagesRun.push("preset_theme_combination");
  const presetThemeResult = validatePresetThemeCombination(
    { presetId, themeId, density },
    validationContext,
  );
  for (const issue of presetThemeResult.issues) {
    stagedIssues.push(tagIssue(issue, "preset_theme_combination"));
  }

  const blockOverrides = patchBlockOverridesFromInput(input);
  validateBlockOverridesPreOrchestrator(
    article,
    blockOverrides,
    validationContext,
    stagedIssues,
  );
  stagesRun.push("block_protocol");

  stagesRun.push("orchestrator");
  const orchestratorResult = orchestrateArticleStyle(article, registry, {
    seedPlan: input.kind === "article_style_plan" ? input.plan : undefined,
    patch: input.kind === "style_assignment_patch" ? input.patch : undefined,
    selectionRequest:
      input.kind === "style_selection_request" ? input.request : undefined,
    applyRhythmRules: options.applyRhythmRules ?? true,
    maxAssetReuse: options.maxAssetReuse,
  });

  for (const issue of orchestratorResult.issues) {
    stagedIssues.push(tagIssue(issue, "orchestrator"));
  }

  stagesRun.push("post_orchestrator_validation");
  validatePostOrchestratorPlan(
    article,
    orchestratorResult.plan,
    validationContext,
    stagedIssues,
  );

  const issues: StyleValidationIssue[] = stagedIssues.map((entry) => {
    const { stage, ...issue } = entry;
    void stage;
    return issue;
  });
  const validationStatus = deriveValidationStatus(issues);
  const ok = !hasErrorSeverity(issues);
  const mergeAllowed = deriveMergeAllowed(validationStatus);

  const plan: ArticleStylePlan = {
    ...orchestratorResult.plan,
    meta: {
      source:
        input.kind === "style_assignment_patch"
          ? input.patch.meta.source
          : input.kind === "style_selection_request"
            ? (input.request.meta?.source ?? "ai_style_selection")
            : (input.plan.meta?.source ?? "system"),
      validationStatus,
      issues: issues.length > 0 ? issues : undefined,
      ...(input.kind === "style_assignment_patch"
        ? {
            modelId: input.patch.meta.modelId,
            generatedAt: input.patch.meta.generatedAt,
          }
        : {}),
    },
  };

  const base = {
    ok,
    plan,
    styleAssignment: orchestratorResult.styleAssignment,
    issues,
    validationStatus,
    mergeAllowed,
  };

  return {
    ...base,
    snapshot: buildSnapshot(input.kind, base, stagesRun),
  };
}

export const validateStyleSelection = validateStyleSelectionPipeline;

export function buildValidatedStyleAssignmentPatch(
  article: Article,
  patch: StyleAssignmentPatch,
  registry: StyleRegistry,
  options?: ValidateStyleSelectionOptions,
): StyleSelectionValidationResult {
  return validateStyleSelectionPipeline(
    article,
    registry,
    { kind: "style_assignment_patch", patch },
    options,
  );
}

export function canMergeStyleSelectionResult(
  result: StyleSelectionValidationResult,
): boolean {
  return result.mergeAllowed;
}

export function applyValidatedStyleSelection(
  article: Article,
  result: StyleSelectionValidationResult,
): { article: Article; applied: boolean } {
  if (!result.mergeAllowed) {
    return { article, applied: false };
  }

  return {
    article: {
      ...article,
      styleAssignment: result.styleAssignment,
    },
    applied: true,
  };
}

export function selectionRequestToPlanSeed(
  articleId: string,
  assignment: StyleAssignment,
  request: StyleSelectionRequest,
): { ok: boolean; issues: StyleValidationIssue[]; plan?: ArticleStylePlan } {
  const parsed = safeParseStyleSelectionRequest(request);
  if (!parsed.success) {
    return {
      ok: false,
      issues: parsed.error.issues.map((issue) => ({
        severity: "error" as const,
        code: "style_selection_request_invalid",
        message: issue.message,
        path: issue.path.map(String),
      })),
    };
  }

  const patchLike: StyleAssignmentPatch = {
    presetId: parsed.data.preferredPresetId,
    blockOverrides: parsed.data.blockStyleHints.map((hint) => ({
      blockId: hint.blockId,
      variantId: hint.suggestedVariantId,
      familyId: hint.suggestedFamilyId,
      slotOverrides: hint.suggestedSlotOverrides,
      assetBindings: hint.suggestedAssetIds?.reduce<Record<string, string>>(
        (bindings, assetId, index) => {
          bindings[`asset_${index}`] = assetId;
          return bindings;
        },
        {},
      ),
    })),
    meta: parsed.data.meta ?? {
      source: "ai_style_selection",
      validationStatus: "pending",
    },
  };

  return patchToArticleStylePlan(articleId, assignment, patchLike);
}
