/**
 * Generation path card rhythm — align block hints before orchestrator (S7-STORY-006).
 */

import type { Article } from "@/core/article";
import {
  isCardEmphasisVariantId,
  isCardRhythmBodyBlock,
  resolvePlainRhythmVariantId,
} from "@/core/styles/card-rhythm";
import { getVariantById } from "@/core/styles/registry";
import type { StyleRegistry } from "@/core/styles/types";
import type { StyleSelectionBlockStyleHint } from "@/core/styles/style-assignment";

function isRelease1RequiredCopySafe(
  registry: StyleRegistry,
  blockType: StyleSelectionBlockStyleHint["blockType"],
  variantId: string,
): boolean {
  const variant = getVariantById(registry, variantId);
  if (!variant || variant.blockType !== blockType) {
    return false;
  }
  if (variant.status !== "release1_required") {
    return false;
  }
  return variant.compatibility?.copySafety !== "preview_only";
}

/**
 * Demote card-emphasis variants when consecutive body blocks would exceed maxRun.
 */
export function balanceCardEmphasisInBlockHints(
  article: Article,
  hints: StyleSelectionBlockStyleHint[],
  registry: StyleRegistry,
  maxRun = 2,
): StyleSelectionBlockStyleHint[] {
  const hintByBlockId = new Map(hints.map((hint) => [hint.blockId, hint]));
  let runLength = 0;
  const adjusted = new Map<string, string>();

  for (const block of article.blocks) {
    const hint = hintByBlockId.get(block.id);
    if (!hint?.suggestedVariantId || !isCardRhythmBodyBlock(block)) {
      runLength = 0;
      continue;
    }

    if (!isCardEmphasisVariantId(registry, block.type, hint.suggestedVariantId)) {
      runLength = 0;
      continue;
    }

    runLength += 1;
    if (runLength <= maxRun) {
      continue;
    }

    const plainId = resolvePlainRhythmVariantId(block.type);
    if (
      plainId &&
      plainId !== hint.suggestedVariantId &&
      isRelease1RequiredCopySafe(registry, block.type, plainId)
    ) {
      adjusted.set(block.id, plainId);
      runLength = 0;
    }
  }

  if (adjusted.size === 0) {
    return hints;
  }

  return hints.map((hint) => {
    const variantId = adjusted.get(hint.blockId);
    if (!variantId) {
      return hint;
    }
    return {
      ...hint,
      suggestedVariantId: variantId,
      reason: `${hint.reason ?? ""} · card rhythm plain fallback`.trim(),
    };
  });
}
