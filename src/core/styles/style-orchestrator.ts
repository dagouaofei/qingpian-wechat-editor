/**
 * StyleOrchestrator — article-level rhythm before StyleResolver.
 * @see docs/architecture/style-system.md §11.7
 */

import type { Article, BlockStyleOverride, StyleAssignment } from "@/core/article";

import { getThemeById } from "./registry";
import type {
  ArticleStylePlan,
  StyleAssignmentPatch,
  StyleSelectionRequest,
} from "./style-assignment";
import {
  mergeStyleAssignmentPatch,
  styleAssignmentToArticleStylePlan,
} from "./style-assignment-patch";
import { unifyHeadingVariantsInStates } from "./style-orchestrator-heading-unify";
import { applyOrchestratorRhythmRules } from "./style-orchestrator-rules";
import {
  type OrchestratorBlockOverrideInput,
  type OrchestratorBlockStyleState,
  resolveOrchestratorBlockVariant,
  resolveOrchestratorPreset,
} from "./style-orchestrator-selection";
import type { Density, StyleRegistry, StyleValidationIssue } from "./types";
import { buildStyleValidationResult } from "./validation";

export type OrchestrateArticleStyleOptions = {
  seedPlan?: ArticleStylePlan;
  patch?: StyleAssignmentPatch;
  selectionRequest?: StyleSelectionRequest;
  /** Apply R1 / R2 / R8 (default true) */
  applyRhythmRules?: boolean;
  /** R2 reuse limit (default 2) */
  maxAssetReuse?: number;
};

export type OrchestrateArticleStyleResult = {
  ok: boolean;
  plan: ArticleStylePlan;
  issues: StyleValidationIssue[];
  /** Effective assignment for StyleResolver input */
  styleAssignment: StyleAssignment;
};

function mergeOverrideMaps(
  ...sources: Array<OrchestratorBlockOverrideInput[] | undefined>
): Map<string, OrchestratorBlockOverrideInput> {
  const merged = new Map<string, OrchestratorBlockOverrideInput>();

  for (const source of sources) {
    for (const override of source ?? []) {
      const existing = merged.get(override.blockId);
      merged.set(override.blockId, {
        blockId: override.blockId,
        variantId: override.variantId ?? existing?.variantId,
        familyId: override.familyId ?? existing?.familyId,
        slotOverrides: {
          ...existing?.slotOverrides,
          ...override.slotOverrides,
        },
        assetBindings: {
          ...existing?.assetBindings,
          ...override.assetBindings,
        },
      });
    }
  }

  return merged;
}

function assignmentOverridesToOrchestratorInput(
  overrides: BlockStyleOverride[] | undefined,
): OrchestratorBlockOverrideInput[] {
  return (overrides ?? []).map((override) => ({
    blockId: override.blockId,
    variantId: override.variantId,
    slotOverrides: override.slotOverrides,
  }));
}

function patchOverridesToOrchestratorInput(
  patch: StyleAssignmentPatch | undefined,
): OrchestratorBlockOverrideInput[] {
  return (patch?.blockOverrides ?? []).map((override) => ({
    blockId: override.blockId,
    variantId: override.variantId,
    familyId: override.familyId,
    slotOverrides: override.slotOverrides,
    assetBindings: override.assetBindings,
  }));
}

function selectionHintsToOrchestratorInput(
  request: StyleSelectionRequest | undefined,
): OrchestratorBlockOverrideInput[] {
  return (request?.blockStyleHints ?? []).map((hint) => ({
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

function statesToBlockOverrides(
  states: Map<string, OrchestratorBlockStyleState>,
): BlockStyleOverride[] {
  return [...states.values()].map((state) => ({
    blockId: state.blockId,
    variantId: state.variantId,
    ...(state.slotOverrides ? { slotOverrides: state.slotOverrides } : {}),
  }));
}

function buildStyleAssignmentFromPlan(
  base: StyleAssignment,
  planPresetId: string,
  planThemeId: string,
  blockOverrides: BlockStyleOverride[],
): StyleAssignment {
  return {
    themeId: planThemeId,
    presetId: planPresetId,
    blockOverrides: blockOverrides.length > 0 ? blockOverrides : undefined,
  };
}

export function orchestrateArticleStyle(
  article: Article,
  registry: StyleRegistry,
  options?: OrchestrateArticleStyleOptions,
): OrchestrateArticleStyleResult {
  const issues: StyleValidationIssue[] = [];
  let assignment: StyleAssignment = {
    ...article.styleAssignment,
    blockOverrides: article.styleAssignment.blockOverrides
      ? [...article.styleAssignment.blockOverrides]
      : undefined,
  };

  if (options?.seedPlan) {
    assignment = buildStyleAssignmentFromPlan(
      assignment,
      options.seedPlan.presetId,
      options.seedPlan.themeId,
      options.seedPlan.blockOverrides ?? assignment.blockOverrides ?? [],
    );
  }

  if (options?.patch) {
    const patchResult = mergeStyleAssignmentPatch(assignment, options.patch);
    issues.push(...patchResult.issues);
    if (!patchResult.ok || !patchResult.styleAssignment) {
      const validation = buildStyleValidationResult(issues);
      return {
        ok: validation.ok,
        plan: styleAssignmentToArticleStylePlan(
          article.id,
          assignment,
          options.patch.meta,
        ),
        issues: validation.issues,
        styleAssignment: assignment,
      };
    }
    assignment = patchResult.styleAssignment;
  }

  const requestedPresetId =
    options?.selectionRequest?.preferredPresetId ?? assignment.presetId;
  const preset = resolveOrchestratorPreset(registry, requestedPresetId, issues);
  const themeId =
    assignment.themeId ??
    getThemeById(registry, preset.themeId)?.id ??
    preset.themeId;
  const density: Density | undefined = preset.density;

  const overrideMap = mergeOverrideMaps(
    assignmentOverridesToOrchestratorInput(assignment.blockOverrides),
    assignmentOverridesToOrchestratorInput(options?.seedPlan?.blockOverrides),
    patchOverridesToOrchestratorInput(options?.patch),
    selectionHintsToOrchestratorInput(options?.selectionRequest),
  );

  const states = new Map<string, OrchestratorBlockStyleState>();
  for (const block of article.blocks) {
    const state = resolveOrchestratorBlockVariant(
      block,
      registry,
      preset,
      overrideMap.get(block.id),
      issues,
    );
    states.set(block.id, state);
  }

  unifyHeadingVariantsInStates(
    article.blocks,
    states,
    registry,
    preset.defaultVariantByBlockType?.heading,
  );

  if (options?.applyRhythmRules !== false) {
    applyOrchestratorRhythmRules(
      article.blocks,
      states,
      registry,
      issues,
      { maxAssetReuse: options?.maxAssetReuse },
    );
  }

  const blockOverrides = statesToBlockOverrides(states);
  const styleAssignment = buildStyleAssignmentFromPlan(
    assignment,
    preset.id,
    themeId,
    blockOverrides,
  );

  const plan = styleAssignmentToArticleStylePlan(
    article.id,
    styleAssignment,
    {
      source: "orchestrator",
      validationStatus: issues.some((issue) => issue.severity === "error")
        ? "invalid"
        : issues.some((issue) => issue.severity === "warning")
          ? "fallback_applied"
          : "valid",
      issues: issues.length > 0 ? issues : undefined,
    },
    {
      dedupeAdjacentHeadings: true,
      maxAssetReuse: options?.maxAssetReuse ?? 2,
      avoidTitleFirstHeadingSameFamilyVariant: true,
    },
  );

  if (density) {
    plan.density = density;
  }

  const validation = buildStyleValidationResult(issues);

  return {
    ok: validation.ok,
    plan,
    issues: validation.issues,
    styleAssignment,
  };
}
