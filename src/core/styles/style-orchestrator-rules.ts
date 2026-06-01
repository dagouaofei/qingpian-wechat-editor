/**
 * StyleOrchestrator rhythm rules — R1 / R2 / R8 (Sprint 3-C minimum).
 * @see docs/architecture/style-system.md §11.7
 */

import type { Block } from "@/core/blocks";

import type { StyleRegistry, StyleValidationIssue } from "./types";
import {
  type OrchestratorBlockStyleState,
  pickOrchestratorFallbackVariant,
} from "./style-orchestrator-selection";

export const ORCHESTRATOR_RULE_R1 = "R1" as const;
export const ORCHESTRATOR_RULE_R2 = "R2" as const;
export const ORCHESTRATOR_RULE_R8 = "R8" as const;

export type OrchestratorRuleId =
  | typeof ORCHESTRATOR_RULE_R1
  | typeof ORCHESTRATOR_RULE_R2
  | typeof ORCHESTRATOR_RULE_R8;

function createRhythmIssue(
  ruleId: OrchestratorRuleId,
  code: string,
  message: string,
  partial?: Partial<StyleValidationIssue>,
): StyleValidationIssue {
  return {
    severity: "warning",
    code,
    message: `${ruleId} ${message}`,
    ...partial,
  };
}

function applyFallbackToBlockState(
  registry: StyleRegistry,
  state: OrchestratorBlockStyleState,
  ruleId: OrchestratorRuleId,
  reason: string,
  issues: StyleValidationIssue[],
  excludeVariantIds: string[],
  excludeFamilyLayout?: { familyId: string; layoutMode?: string },
): boolean {
  const fallback = pickOrchestratorFallbackVariant(registry, state.blockType, {
    excludeVariantIds,
    excludeFamilyLayout,
  });

  if (!fallback) {
    issues.push({
      severity: "error",
      code: "orchestrator_rhythm_no_fallback",
      message: `[${ruleId}] ${reason}; no copy-safe release1_required fallback available`,
      blockId: state.blockId,
      blockType: state.blockType,
      variantId: state.variantId,
    });
    return false;
  }

  state.variantId = fallback.id;
  state.familyId = fallback.family;
  state.layoutMode = fallback.componentProtocol?.layoutMode;
  state.source = "fallback";

  issues.push(
    createRhythmIssue(ruleId, `orchestrator_${ruleId.toLowerCase()}_fallback`, reason, {
      blockId: state.blockId,
      blockType: state.blockType,
      variantId: fallback.id,
      fallbackVariantId: fallback.id,
    }),
  );

  return true;
}

/** R8 — title 与首个 heading 避免同 family + layoutMode */
export function applyOrchestratorRuleR8(
  blocks: Block[],
  states: Map<string, OrchestratorBlockStyleState>,
  registry: StyleRegistry,
  issues: StyleValidationIssue[],
): void {
  const titleBlock = blocks.find((block) => block.type === "title");
  const firstHeading = blocks.find((block) => block.type === "heading");
  if (!titleBlock || !firstHeading) {
    return;
  }

  const titleState = states.get(titleBlock.id);
  const headingState = states.get(firstHeading.id);
  if (!titleState || !headingState) {
    return;
  }

  const sameFamily =
    titleState.familyId === headingState.familyId &&
    titleState.layoutMode === headingState.layoutMode &&
    titleState.layoutMode !== undefined;

  if (!sameFamily) {
    return;
  }

  applyFallbackToBlockState(
    registry,
    headingState,
    ORCHESTRATOR_RULE_R8,
    `title and first heading must not share family "${headingState.familyId}" with layout "${headingState.layoutMode}"`,
    issues,
    [titleState.variantId],
    {
      familyId: titleState.familyId,
      layoutMode: titleState.layoutMode,
    },
  );
}

/** R1 — 相邻 heading 不得使用同 variant */
export function applyOrchestratorRuleR1(
  blocks: Block[],
  states: Map<string, OrchestratorBlockStyleState>,
  registry: StyleRegistry,
  issues: StyleValidationIssue[],
): void {
  const headingBlocks = blocks.filter((block) => block.type === "heading");

  for (let index = 1; index < headingBlocks.length; index += 1) {
    const previous = headingBlocks[index - 1]!;
    const current = headingBlocks[index]!;
    const previousState = states.get(previous.id);
    const currentState = states.get(current.id);
    if (!previousState || !currentState) {
      continue;
    }

    if (previousState.variantId !== currentState.variantId) {
      continue;
    }

    applyFallbackToBlockState(
      registry,
      currentState,
      ORCHESTRATOR_RULE_R1,
      `adjacent headings must not share variant "${currentState.variantId}"`,
      issues,
      [previousState.variantId],
    );
  }
}

/** R2 — 同一 assetId 默认最多出现 maxReuse 次 */
export function applyOrchestratorRuleR2(
  states: Map<string, OrchestratorBlockStyleState>,
  issues: StyleValidationIssue[],
  maxReuse = 2,
): void {
  const assetUsage = new Map<
    string,
    Array<{ blockId: string; slotKey: string }>
  >();

  for (const state of states.values()) {
    if (!state.assetBindings) {
      continue;
    }
    for (const [slotKey, assetId] of Object.entries(state.assetBindings)) {
      const entries = assetUsage.get(assetId) ?? [];
      entries.push({ blockId: state.blockId, slotKey });
      assetUsage.set(assetId, entries);
    }
  }

  for (const [assetId, usages] of assetUsage.entries()) {
    if (usages.length <= maxReuse) {
      continue;
    }

    const excess = usages.slice(maxReuse);
    for (const usage of excess) {
      const state = states.get(usage.blockId);
      if (!state?.assetBindings) {
        continue;
      }

      delete state.assetBindings[usage.slotKey];
      if (Object.keys(state.assetBindings).length === 0) {
        delete state.assetBindings;
      }

      issues.push(
        createRhythmIssue(
          ORCHESTRATOR_RULE_R2,
          "orchestrator_r2_asset_reuse_exceeded",
          `assetId "${assetId}" exceeded reuse limit ${maxReuse}; removed binding "${usage.slotKey}" from block ${usage.blockId}`,
          {
            blockId: usage.blockId,
            property: usage.slotKey,
            value: assetId,
          },
        ),
      );
    }
  }
}

export function applyOrchestratorRhythmRules(
  blocks: Block[],
  states: Map<string, OrchestratorBlockStyleState>,
  registry: StyleRegistry,
  issues: StyleValidationIssue[],
  options?: { maxAssetReuse?: number },
): void {
  applyOrchestratorRuleR8(blocks, states, registry, issues);
  applyOrchestratorRuleR1(blocks, states, registry, issues);
  applyOrchestratorRuleR2(states, issues, options?.maxAssetReuse ?? 2);
}
