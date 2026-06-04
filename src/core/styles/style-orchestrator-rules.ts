/**
 * StyleOrchestrator rhythm rules — R1 / R2 / R4 / R8 + S7 card stack (RCARD).
 * @see docs/architecture/style-system.md §11.7
 */

import type { Block } from "@/core/blocks";

import {
  isCardEmphasisVariantId,
  isCardRhythmBodyBlock,
  isTitleHeadingDecorFamily,
} from "./card-rhythm";
import { applyOrchestratorArticleLayoutRules } from "./style-orchestrator-article-layout";
import type { StyleRegistry, StyleValidationIssue } from "./types";
import {
  type OrchestratorBlockStyleState,
  pickOrchestratorFallbackVariant,
} from "./style-orchestrator-selection";

export const ORCHESTRATOR_RULE_R1 = "R1" as const;
export const ORCHESTRATOR_RULE_R2 = "R2" as const;
export const ORCHESTRATOR_RULE_R4 = "R4" as const;
export const ORCHESTRATOR_RULE_R8 = "R8" as const;
/** S7 — 正文连续卡片化强调块不超过 maxConsecutive（默认 2） */
export const ORCHESTRATOR_RULE_RCARD = "RCARD" as const;

export type OrchestratorRuleId =
  | typeof ORCHESTRATOR_RULE_R1
  | typeof ORCHESTRATOR_RULE_R2
  | typeof ORCHESTRATOR_RULE_R4
  | typeof ORCHESTRATOR_RULE_R8
  | typeof ORCHESTRATOR_RULE_RCARD;

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
  preferPlainRhythm = false,
): boolean {
  const fallback = pickOrchestratorFallbackVariant(registry, state.blockType, {
    excludeVariantIds,
    excludeFamilyLayout,
    preferPlainRhythm,
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
    [titleState.variantId, headingState.variantId],
    {
      familyId: titleState.familyId,
      layoutMode: titleState.layoutMode,
    },
    true,
  );
}

/**
 * R1 — 相邻 heading 不得使用同 variant（历史多样性规则）。
 * Miaopian 文章级小标题统一 variant 后不再应用，见 `applyOrchestratorRhythmRules`。
 */
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

/** R4 — title / heading 上 iconDecor / cardTitle 连续不超过 maxRun 次 */
export function applyOrchestratorRuleR4(
  blocks: Block[],
  states: Map<string, OrchestratorBlockStyleState>,
  registry: StyleRegistry,
  issues: StyleValidationIssue[],
  maxRun = 2,
): void {
  let runLength = 0;

  for (const block of blocks) {
    if (block.type !== "title" && block.type !== "heading") {
      runLength = 0;
      continue;
    }

    const state = states.get(block.id);
    if (!state) {
      runLength = 0;
      continue;
    }

    if (!isTitleHeadingDecorFamily(state.familyId)) {
      runLength = 0;
      continue;
    }

    runLength += 1;
    if (runLength <= maxRun) {
      continue;
    }

    const changed = applyFallbackToBlockState(
      registry,
      state,
      ORCHESTRATOR_RULE_R4,
      `iconDecor/cardTitle family run exceeded ${maxRun} for title/heading blocks`,
      issues,
      [state.variantId],
      undefined,
      true,
    );
    if (changed) {
      runLength = 0;
    }
  }
}

/** RCARD — 正文卡片化强调块（含 info_card）连续不超过 maxRun 次 */
export function applyOrchestratorRuleCardStack(
  blocks: Block[],
  states: Map<string, OrchestratorBlockStyleState>,
  registry: StyleRegistry,
  issues: StyleValidationIssue[],
  maxRun = 2,
): void {
  let runLength = 0;

  for (const block of blocks) {
    if (!isCardRhythmBodyBlock(block)) {
      runLength = 0;
      continue;
    }

    const state = states.get(block.id);
    if (!state) {
      runLength = 0;
      continue;
    }

    if (!isCardEmphasisVariantId(registry, block.type, state.variantId)) {
      runLength = 0;
      continue;
    }

    runLength += 1;
    if (runLength <= maxRun) {
      continue;
    }

    const changed = applyFallbackToBlockState(
      registry,
      state,
      ORCHESTRATOR_RULE_RCARD,
      `consecutive card-emphasis body blocks exceeded ${maxRun}`,
      issues,
      [state.variantId],
      undefined,
      true,
    );
    if (changed) {
      runLength = 0;
    }
  }
}

export function applyOrchestratorRhythmRules(
  blocks: Block[],
  states: Map<string, OrchestratorBlockStyleState>,
  registry: StyleRegistry,
  issues: StyleValidationIssue[],
  options?: { maxAssetReuse?: number; maxConsecutiveCardEmphasis?: number },
): void {
  applyOrchestratorRuleR8(blocks, states, registry, issues);
  applyOrchestratorRuleR4(blocks, states, registry, issues);
  applyOrchestratorRuleCardStack(
    blocks,
    states,
    registry,
    issues,
    options?.maxConsecutiveCardEmphasis ?? 2,
  );
  // R1 disabled: article-level heading variant unity (miaopian titleVariantPool model).
  applyOrchestratorRuleR2(states, issues, options?.maxAssetReuse ?? 2);
  applyOrchestratorArticleLayoutRules(blocks, states, registry, issues);
}
