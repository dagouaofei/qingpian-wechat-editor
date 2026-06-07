import type { BlockType } from "@/core/blocks";
import type { Article } from "@/core/article";
import { createFirstWaveRequiredVariantRegistry } from "@/core/styles";
import { safeParseStyleAssignmentPatch } from "@/core/styles/style-assignment-schemas";
import type {
  StyleAssignmentPatch,
  StyleSelectionRequest,
} from "@/core/styles/style-assignment";
import type { ResolvedArticleStyle, StyleRegistry, StyleValidationIssue } from "@/core/styles/types";

import type { NormalizedInput } from "./input";
import {
  applyValidatedStyleAssignmentPatch,
  buildSafeFallbackStyleAssignmentPatch,
} from "./style-selection-apply";
import {
  buildStyleSelectionRequestFromArticle,
  containsForbiddenStyleFields,
  SAFE_STYLE_PRESET_ID,
  SAFE_STYLE_THEME_ID,
  validateStyleIntentForGeneration,
} from "./style-selection-prompt";

export type StyleSelectionProviderMode = "deterministic" | "model_assisted";

export type StyleSelectionGenerationInput = {
  article: Article;
  normalizedInput: NormalizedInput;
  registry?: StyleRegistry;
  mode?: StyleSelectionProviderMode;
  timestamp?: string;
  modelId?: string;
  modelPatchOutput?: unknown;
  /** Heading variants must be runtime-available (userSelectable pool). */
  runtimeAvailableVariantIds?: readonly string[];
};

export type StyleSelectionVariantSummary = {
  blockId: string;
  blockType: BlockType;
  variantId: string;
  source: "style_intent" | "article_diversity" | "preset_default" | "model_assisted" | "fallback";
};

export type StyleSelectionGenerationResult = {
  ok: boolean;
  article: Article;
  request: StyleSelectionRequest;
  patch: StyleAssignmentPatch;
  applied: boolean;
  usedFallback: boolean;
  warnings: StyleValidationIssue[];
  issues: StyleValidationIssue[];
  selectedVariants: StyleSelectionVariantSummary[];
};

function defaultRegistry(): StyleRegistry {
  return createFirstWaveRequiredVariantRegistry();
}

function mergeIssues(...groups: StyleValidationIssue[][]): StyleValidationIssue[] {
  return groups.flat();
}

export function generateStyleSelectionRequest(
  input: StyleSelectionGenerationInput,
): {
  request: StyleSelectionRequest;
  warnings: StyleValidationIssue[];
  issues: StyleValidationIssue[];
} {
  const registry = input.registry ?? defaultRegistry();
  const timestamp = input.timestamp ?? new Date().toISOString();
  const intentIssues = validateStyleIntentForGeneration(input.normalizedInput.styleIntent);
  if (intentIssues.some((issue) => issue.severity === "error")) {
    const fallback = buildStyleSelectionRequestFromArticle(input.article, registry, {
      styleIntent: undefined,
      timestamp,
      modelId: input.modelId,
      source: input.mode === "deterministic" ? "system" : "ai_style_selection",
      runtimeAvailableVariantIds: input.runtimeAvailableVariantIds,
    });
    return {
      request: fallback.request,
      warnings: mergeIssues(fallback.warnings, intentIssues),
      issues: intentIssues,
    };
  }

  const built = buildStyleSelectionRequestFromArticle(input.article, registry, {
    styleIntent: input.normalizedInput.styleIntent,
    timestamp,
    modelId: input.modelId,
    source: input.mode === "deterministic" ? "system" : "ai_style_selection",
    runtimeAvailableVariantIds: input.runtimeAvailableVariantIds,
  });

  return {
    request: built.request,
    warnings: mergeIssues(built.warnings, intentIssues),
    issues: intentIssues.filter((issue) => issue.severity === "error"),
  };
}

export function generateStyleAssignmentPatch(input: {
  article: Article;
  request: StyleSelectionRequest;
  normalizedInput: NormalizedInput;
  timestamp?: string;
  modelId?: string;
  mode?: StyleSelectionProviderMode;
  modelPatchOutput?: unknown;
}): {
  patch?: StyleAssignmentPatch;
  warnings: StyleValidationIssue[];
  issues: StyleValidationIssue[];
  modelOutputRejected?: boolean;
} {
  const timestamp = input.timestamp ?? new Date().toISOString();
  const warnings: StyleValidationIssue[] = [];
  const issues: StyleValidationIssue[] = [];

  if (input.mode === "model_assisted" && input.modelPatchOutput != null) {
    const parsed = parseModelStyleAssignmentPatch(input.modelPatchOutput, timestamp);
    warnings.push(...parsed.warnings);
    issues.push(...parsed.issues);
    if (parsed.patch) {
      return { patch: parsed.patch, warnings, issues };
    }
    return { patch: undefined, warnings, issues, modelOutputRejected: true };
  }

  const patch: StyleAssignmentPatch = {
    presetId: input.request.preferredPresetId ?? SAFE_STYLE_PRESET_ID,
    themeId: SAFE_STYLE_THEME_ID,
    blockOverrides: input.request.blockStyleHints.map((hint) => ({
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
    meta: {
      source: input.mode === "deterministic" ? "system" : "ai_style_selection",
      validationStatus: "pending",
      generatedAt: timestamp,
      modelId: input.modelId,
    },
  };

  return { patch, warnings, issues };
}

function parseModelStyleAssignmentPatch(
  raw: unknown,
  timestamp: string,
): {
  patch?: StyleAssignmentPatch;
  warnings: StyleValidationIssue[];
  issues: StyleValidationIssue[];
} {
  const warnings: StyleValidationIssue[] = [];
  const issues: StyleValidationIssue[] = [];

  const forbidden = containsForbiddenStyleFields(raw);
  if (forbidden) {
    issues.push({
      severity: "error",
      code: "model_style_output_forbidden_field",
      message: `Model style output must not include forbidden field "${forbidden}"`,
      path: [forbidden],
    });
    return { warnings, issues };
  }

  const parsed = safeParseStyleAssignmentPatch(raw);
  if (!parsed.success) {
    issues.push({
      severity: "error",
      code: "model_style_output_invalid",
      message: "Model style output is not a valid StyleAssignmentPatch",
      path: [],
    });
    return { warnings, issues };
  }

  return {
    patch: {
      ...parsed.data,
      meta: {
        ...parsed.data.meta,
        source: "ai_style_selection",
        validationStatus: "pending",
        generatedAt: parsed.data.meta.generatedAt ?? timestamp,
      },
    },
    warnings,
    issues,
  };
}

function summarizeSelectedVariants(
  resolvedStyle: ResolvedArticleStyle | undefined,
  usedFallback: boolean,
  mode: StyleSelectionProviderMode,
): StyleSelectionVariantSummary[] {
  if (!resolvedStyle) {
    return [];
  }

  return resolvedStyle.blocks.map((blockStyle) => ({
    blockId: blockStyle.blockId,
    blockType: blockStyle.blockType,
    variantId: blockStyle.variantId,
    source: usedFallback
      ? "fallback"
      : mode === "model_assisted"
        ? "model_assisted"
        : "preset_default",
  }));
}

export function generateAndApplyStyleSelection(
  input: StyleSelectionGenerationInput,
): StyleSelectionGenerationResult {
  const registry = input.registry ?? defaultRegistry();
  const timestamp = input.timestamp ?? new Date().toISOString();
  const mode = input.mode ?? "deterministic";

  const requestResult = generateStyleSelectionRequest({ ...input, mode });
  const patchResult = generateStyleAssignmentPatch({
    article: input.article,
    request: requestResult.request,
    normalizedInput: input.normalizedInput,
    timestamp,
    modelId: input.modelId,
    mode,
    modelPatchOutput: input.modelPatchOutput,
  });

  let warnings = mergeIssues(requestResult.warnings, patchResult.warnings);
  let issues = mergeIssues(requestResult.issues, patchResult.issues);
  let usedFallback = false;

  let currentPatch = patchResult.patch;
  let applyResult: ReturnType<typeof applyValidatedStyleAssignmentPatch>;

  if (patchResult.modelOutputRejected || !currentPatch) {
    usedFallback = true;
    currentPatch = buildSafeFallbackStyleAssignmentPatch(
      timestamp,
      "Model style output rejected; applied safe preset fallback",
    );
    applyResult = applyValidatedStyleAssignmentPatch(
      input.article,
      currentPatch,
      registry,
    );
  } else {
    applyResult = applyValidatedStyleAssignmentPatch(
      input.article,
      currentPatch,
      registry,
    );

    if (!applyResult.applied || !applyResult.validation.ok) {
      usedFallback = true;
      currentPatch = buildSafeFallbackStyleAssignmentPatch(
        timestamp,
        "Style selection patch failed validation; applied safe preset fallback",
      );
      applyResult = applyValidatedStyleAssignmentPatch(
        input.article,
        currentPatch,
        registry,
      );
    }
  }

  if (usedFallback) {
    warnings = mergeIssues(warnings, applyResult.validation.issues);
  }

  issues = mergeIssues(issues, applyResult.validation.issues, applyResult.resolverIssues);

  const selectedVariants = summarizeSelectedVariants(
    applyResult.resolvedStyle,
    usedFallback,
    mode,
  );

  if (applyResult.resolvedStyle) {
    for (const blockStyle of applyResult.resolvedStyle.blocks) {
      if (blockStyle.variant.status !== "release1_required") {
        warnings.push({
          severity: "warning",
          code: "resolved_variant_not_release1_required",
          message: `Resolved variant "${blockStyle.variantId}" is not release1_required`,
          path: ["styleAssignment", blockStyle.blockId],
        });
      }
    }
  }

  return {
    ok: applyResult.applied && applyResult.validation.mergeAllowed,
    article: applyResult.article,
    request: requestResult.request,
    patch: currentPatch,
    applied: applyResult.applied,
    usedFallback,
    warnings,
    issues,
    selectedVariants,
  };
}

export function generateDeterministicStyleSelection(
  input: Omit<StyleSelectionGenerationInput, "mode">,
): StyleSelectionGenerationResult {
  return generateAndApplyStyleSelection({ ...input, mode: "deterministic" });
}

export {
  applyValidatedStyleAssignmentPatch,
  applyValidatedStyleSelectionRequest,
  buildSafeFallbackStyleAssignmentPatch,
  verifyArticleStyleResolvable,
} from "./style-selection-apply";

export {
  SAFE_STYLE_PRESET_ID,
  SAFE_STYLE_THEME_ID,
  buildStyleSelectionRequestFromArticle,
  validateStyleIntentForGeneration,
} from "./style-selection-prompt";
