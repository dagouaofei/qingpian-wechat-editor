/**
 * S7-STORY-007A — article-level layout rhythm (beyond per-variant RCARD).
 * Mutates orchestrator block states only; does not change Article.blocks semantics.
 */

import type { Block, BlockType } from "@/core/blocks";

import { isCardEmphasisVariantId, resolvePlainRhythmVariantId } from "./card-rhythm";
import type { StyleRegistry, StyleValidationIssue } from "./types";
import type { OrchestratorBlockStyleState } from "./style-orchestrator-selection";

export const ORCHESTRATOR_RULE_RLAYOUT = "RLAYOUT" as const;

const STRONG_VISUAL_TYPES = new Set<BlockType>([
  "quote",
  "highlight",
  "info_card",
  "cta",
]);

const CTA_HEAVY_VARIANT_IDS = new Set([
  "cta_button_like",
  "cta_qr_placeholder",
  "cta_card_promo",
  "cta_dual_action",
]);

function createLayoutIssue(
  code: string,
  message: string,
  partial?: Partial<StyleValidationIssue>,
): StyleValidationIssue {
  return {
    severity: "warning",
    code,
    message: `${ORCHESTRATOR_RULE_RLAYOUT} ${message}`,
    ...partial,
  };
}

function applyVariantFallback(
  registry: StyleRegistry,
  state: OrchestratorBlockStyleState,
  variantId: string,
  reason: string,
  issues: StyleValidationIssue[],
): boolean {
  const variant = registry.variants.find((entry) => entry.id === variantId);
  if (!variant || variant.blockType !== state.blockType) {
    return false;
  }
  state.variantId = variant.id;
  state.familyId = variant.family;
  state.layoutMode = variant.componentProtocol?.layoutMode;
  state.source = "fallback";
  issues.push(
    createLayoutIssue("orchestrator_rlayout_fallback", reason, {
      blockId: state.blockId,
      blockType: state.blockType,
      variantId: variant.id,
      fallbackVariantId: variant.id,
    }),
  );
  return true;
}

function isStrongVisualBlock(
  registry: StyleRegistry,
  block: Block,
  state: OrchestratorBlockStyleState,
): boolean {
  if (STRONG_VISUAL_TYPES.has(block.type)) {
    return true;
  }
  return isCardEmphasisVariantId(registry, block.type, state.variantId);
}

function isRhythmBreakerBlock(block: Block): boolean {
  return (
    block.type === "paragraph" ||
    block.type === "lead" ||
    block.type === "list" ||
    block.type === "divider"
  );
}

/** 连续两个强视觉块之间必须有 paragraph / lead / list / divider 隔断 */
export function applyOrchestratorRuleStrongVisualSpacing(
  blocks: Block[],
  states: Map<string, OrchestratorBlockStyleState>,
  registry: StyleRegistry,
  issues: StyleValidationIssue[],
): void {
  let lastStrongBlockId: string | undefined;

  for (const block of blocks) {
    const state = states.get(block.id);
    if (!state) {
      continue;
    }

    if (isRhythmBreakerBlock(block)) {
      lastStrongBlockId = undefined;
      continue;
    }

    if (!isStrongVisualBlock(registry, block, state)) {
      continue;
    }

    if (lastStrongBlockId) {
      const plainId = resolvePlainRhythmVariantId(block.type);
      if (plainId) {
        applyVariantFallback(
          registry,
          state,
          plainId,
          "strong visual blocks must be separated by paragraph or lead",
          issues,
        );
      }
      lastStrongBlockId = undefined;
      continue;
    }

    lastStrongBlockId = block.id;
  }
}

/** 强视觉块（含卡片化 paragraph）默认不超过全文 25% */
export function applyOrchestratorRuleStrongVisualRatioCap(
  blocks: Block[],
  states: Map<string, OrchestratorBlockStyleState>,
  registry: StyleRegistry,
  issues: StyleValidationIssue[],
  maxRatio = 0.25,
): void {
  const bodyBlocks = blocks.filter((block) => block.type !== "title");
  if (bodyBlocks.length === 0) {
    return;
  }

  const strongEntries: Array<{ block: Block; state: OrchestratorBlockStyleState }> =
    [];
  for (const block of bodyBlocks) {
    const state = states.get(block.id);
    if (state && isStrongVisualBlock(registry, block, state)) {
      strongEntries.push({ block, state });
    }
  }

  const maxAllowed = Math.max(1, Math.floor(bodyBlocks.length * maxRatio));
  if (strongEntries.length <= maxAllowed) {
    return;
  }

  const excess = strongEntries.slice(maxAllowed);
  for (const { block, state } of excess) {
    const plainId = resolvePlainRhythmVariantId(block.type);
    if (plainId) {
      applyVariantFallback(
        registry,
        state,
        plainId,
        `strong visual ratio exceeds ${maxRatio * 100}%`,
        issues,
      );
    }
  }
}

/** 非文末 CTA 使用轻量 variant */
export function applyOrchestratorRuleCtaTailOnly(
  blocks: Block[],
  states: Map<string, OrchestratorBlockStyleState>,
  registry: StyleRegistry,
  issues: StyleValidationIssue[],
): void {
  const ctaBlocks = blocks.filter((block) => block.type === "cta");
  if (ctaBlocks.length <= 1) {
    return;
  }

  for (let index = 0; index < ctaBlocks.length - 1; index += 1) {
    const block = ctaBlocks[index]!;
    const state = states.get(block.id);
    if (!state || !CTA_HEAVY_VARIANT_IDS.has(state.variantId)) {
      continue;
    }
    applyVariantFallback(
      registry,
      state,
      "cta_plain_text",
      "heavy CTA variants reserved for article tail",
      issues,
    );
  }
}

/** 连续 divider → 第二段改为 section_space */
export function applyOrchestratorRuleDividerSpacing(
  blocks: Block[],
  states: Map<string, OrchestratorBlockStyleState>,
  registry: StyleRegistry,
  issues: StyleValidationIssue[],
): void {
  let lastWasDivider = false;

  for (const block of blocks) {
    if (block.type !== "divider") {
      lastWasDivider = false;
      continue;
    }

    const state = states.get(block.id);
    if (!state) {
      continue;
    }

    if (lastWasDivider) {
      applyVariantFallback(
        registry,
        state,
        "divider_section_space",
        "consecutive dividers are not allowed",
        issues,
      );
    }
    lastWasDivider = true;
  }
}

/** title 后首屏（前 3 个 body block）避免 image_placeholder 强样式 */
export function applyOrchestratorRuleNoHeroImageAfterTitle(
  blocks: Block[],
  states: Map<string, OrchestratorBlockStyleState>,
  registry: StyleRegistry,
  issues: StyleValidationIssue[],
): void {
  let seenTitle = false;
  let bodyIndexAfterTitle = 0;

  for (const block of blocks) {
    if (block.type === "title") {
      seenTitle = true;
      bodyIndexAfterTitle = 0;
      continue;
    }

    if (!seenTitle) {
      continue;
    }

    bodyIndexAfterTitle += 1;
    if (bodyIndexAfterTitle > 3 || block.type !== "image_placeholder") {
      continue;
    }

    const state = states.get(block.id);
    if (!state || state.variantId === "image_placeholder_simple") {
      continue;
    }

    applyVariantFallback(
      registry,
      state,
      "image_placeholder_simple",
      "image placeholder should not dominate first screen after title",
      issues,
    );
  }
}

export function applyOrchestratorArticleLayoutRules(
  blocks: Block[],
  states: Map<string, OrchestratorBlockStyleState>,
  registry: StyleRegistry,
  issues: StyleValidationIssue[],
): void {
  applyOrchestratorRuleStrongVisualSpacing(blocks, states, registry, issues);
  applyOrchestratorRuleStrongVisualRatioCap(blocks, states, registry, issues);
  applyOrchestratorRuleCtaTailOnly(blocks, states, registry, issues);
  applyOrchestratorRuleDividerSpacing(blocks, states, registry, issues);
  applyOrchestratorRuleNoHeroImageAfterTitle(blocks, states, registry, issues);
}
