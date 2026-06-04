/**
 * Article-level heading variant consistency (miaopian titleVariantPool model).
 */

import type { Block } from "@/core/blocks";

import { getVariantById } from "./registry";
import type { StyleRegistry } from "./types";
import type { OrchestratorBlockStyleState } from "./style-orchestrator-selection";

export function resolveArticleHeadingVariantId(
  blocks: Block[],
  states: Map<string, OrchestratorBlockStyleState>,
  registry: StyleRegistry,
  presetDefaultHeadingId?: string,
): string | undefined {
  const headingBlocks = blocks.filter((block) => block.type === "heading");
  if (headingBlocks.length === 0) {
    return undefined;
  }

  const explicit = headingBlocks
    .map((block) => states.get(block.id))
    .find((state) => state?.source === "explicit");
  if (explicit?.variantId) {
    return explicit.variantId;
  }

  const firstState = states.get(headingBlocks[0]!.id);
  if (firstState?.variantId && getVariantById(registry, firstState.variantId)) {
    return firstState.variantId;
  }

  if (presetDefaultHeadingId && getVariantById(registry, presetDefaultHeadingId)) {
    return presetDefaultHeadingId;
  }

  return undefined;
}

/** Apply one heading variant to every heading block in the article. */
export function unifyHeadingVariantsInStates(
  blocks: Block[],
  states: Map<string, OrchestratorBlockStyleState>,
  registry: StyleRegistry,
  presetDefaultHeadingId?: string,
): void {
  const unifiedId = resolveArticleHeadingVariantId(
    blocks,
    states,
    registry,
    presetDefaultHeadingId,
  );
  if (!unifiedId) {
    return;
  }

  const variant = getVariantById(registry, unifiedId);
  if (!variant || variant.blockType !== "heading") {
    return;
  }

  for (const block of blocks) {
    if (block.type !== "heading") {
      continue;
    }
    const state = states.get(block.id);
    if (!state) {
      continue;
    }
    state.variantId = variant.id;
    state.familyId = variant.family;
    state.layoutMode = variant.componentProtocol?.layoutMode;
    if (state.source !== "explicit") {
      state.source = "preset_default";
    }
  }
}
