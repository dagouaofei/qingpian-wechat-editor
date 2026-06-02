"use client";

import { useEffect, useState } from "react";

import type { SerializedPreviewBlock } from "@/server/generation/generate-flow-types";

import {
  buildPreviewBlocksForReveal,
  extractPreviewBlockPlainText,
  isInstantRevealPreviewBlock,
} from "./preview-block-plain-text";

export type TypewriterRevealPhase = "idle" | "revealing" | "complete";

export type TypewriterRevealState = {
  phase: TypewriterRevealPhase;
  revealedBlockCount: number;
  activeBlockIndex: number;
  activeVisibleChars: number;
  displayBlocks: SerializedPreviewBlock[];
  activeBlockId: string | null;
  completedBlockCount: number;
};

const CHARS_PER_TICK = 2;
const TICK_MS = 28;
const BLOCK_GAP_MS = 320;

function createInitialState(): TypewriterRevealState {
  return {
    phase: "idle",
    revealedBlockCount: 0,
    activeBlockIndex: 0,
    activeVisibleChars: 0,
    displayBlocks: [],
    activeBlockId: null,
    completedBlockCount: 0,
  };
}

export function usePreviewTypewriterReveal(
  blocks: SerializedPreviewBlock[] | null,
  enabled: boolean,
  onComplete?: () => void,
): TypewriterRevealState {
  const [state, setState] = useState<TypewriterRevealState>(createInitialState);

  useEffect(() => {
    if (!enabled || !blocks || blocks.length === 0) {
      return;
    }

    let cancelled = false;
    let blockIndex = 0;
    let visibleChars = 0;
    let revealedCount = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const publish = (phase: TypewriterRevealPhase) => {
      setState({
        phase,
        revealedBlockCount: revealedCount,
        activeBlockIndex: blockIndex,
        activeVisibleChars: visibleChars,
        displayBlocks: buildPreviewBlocksForReveal(
          blocks,
          revealedCount,
          blockIndex,
          visibleChars,
        ),
        activeBlockId: blocks[blockIndex]?.blockId ?? null,
        completedBlockCount: revealedCount,
      });
    };

    const schedule = (delay: number, fn: () => void) => {
      timer = setTimeout(() => {
        if (!cancelled) {
          fn();
        }
      }, delay);
    };

    const finishBlock = () => {
      revealedCount += 1;
      blockIndex += 1;
      visibleChars = 0;
    };

    const tick = () => {
      if (blockIndex >= blocks.length) {
        publish("complete");
        onComplete?.();
        return;
      }

      const block = blocks[blockIndex];
      if (isInstantRevealPreviewBlock(block)) {
        publish("revealing");
        finishBlock();
        schedule(BLOCK_GAP_MS, tick);
        return;
      }

      const totalChars = extractPreviewBlockPlainText(block);
      const totalLength = totalChars.length;
      if (totalLength === 0) {
        publish("revealing");
        finishBlock();
        schedule(BLOCK_GAP_MS, tick);
        return;
      }

      if (visibleChars < totalLength) {
        visibleChars = Math.min(totalLength, visibleChars + CHARS_PER_TICK);
        publish("revealing");
        schedule(TICK_MS, tick);
        return;
      }

      publish("revealing");
      finishBlock();
      schedule(BLOCK_GAP_MS, tick);
    };

    publish("revealing");
    schedule(BLOCK_GAP_MS, tick);

    return () => {
      cancelled = true;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [blocks, enabled, onComplete]);

  if (!enabled || !blocks || blocks.length === 0) {
    return createInitialState();
  }

  return state;
}
