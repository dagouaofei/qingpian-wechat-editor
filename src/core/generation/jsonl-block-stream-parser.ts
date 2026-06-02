import { randomUUID } from "node:crypto";

import type { BlockType } from "@/core/blocks";
import { blockTypeSchema } from "@/core/blocks/block.schema";

import type { GenerationEvent, GenerationStreamContext } from "./events";
import { isValidUuid } from "./model-article-enrichment";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function unescapeJsonStringFragment(raw: string): string {
  return raw
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
}

function extractStreamableText(line: string): string {
  const patterns = [
    /"text"\s*:\s*"((?:[^"\\]|\\.)*)(?:")?/,
    /"body"\s*:\s*"((?:[^"\\]|\\.)*)(?:")?/,
    /"label"\s*:\s*"((?:[^"\\]|\\.)*)(?:")?/,
  ];
  for (const pattern of patterns) {
    const match = line.match(pattern);
    if (match?.[1] != null) {
      return unescapeJsonStringFragment(match[1]);
    }
  }
  return "";
}

function tryParseBlockLine(line: string): Record<string, unknown> | null {
  const trimmed = line.trim();
  if (!trimmed.startsWith("{")) {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(trimmed);
    return isPlainObject(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function resolveBlockType(raw: unknown): BlockType | null {
  const parsed = blockTypeSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

/** SSE events require RFC UUID; ignore partial/invalid ids while JSONL line is still streaming. */
function resolveStreamBlockId(
  candidate: string | undefined,
  establishedId: string | null,
): string {
  if (candidate && isValidUuid(candidate)) {
    return candidate;
  }
  if (establishedId && isValidUuid(establishedId)) {
    return establishedId;
  }
  return randomUUID();
}

export type JsonlBlockStreamParser = {
  push: (chunk: string) => GenerationEvent[];
  flush: () => GenerationEvent[];
  getCompletedBlocks: () => Record<string, unknown>[];
  /** Highest sequence number already assigned to a parser event. */
  getLastSequence: () => number;
};

export function createJsonlBlockStreamParser(
  context: GenerationStreamContext,
): JsonlBlockStreamParser {
  let sequence = 0;
  let lineBuffer = "";
  let currentBlockId: string | null = null;
  let startedCurrentLine = false;
  let lastStreamedText = "";
  const completedBlocks: Record<string, unknown>[] = [];
  const timestamp = context.startedAt;
  const requestId = context.requestId;

  function nextSequence(): number {
    sequence += 1;
    return sequence;
  }

  function resetCurrentLine(): void {
    currentBlockId = null;
    startedCurrentLine = false;
    lastStreamedText = "";
  }

  function emitBlockStart(blockId: string, blockType: BlockType): GenerationEvent {
    currentBlockId = blockId;
    startedCurrentLine = true;
    return {
      type: "block.start",
      requestId,
      sequence: nextSequence(),
      blockId,
      blockType,
      timestamp,
    };
  }

  function emitBlockDelta(blockId: string, delta: string): GenerationEvent | null {
    if (delta.length === 0) {
      return null;
    }
    return {
      type: "block.delta",
      requestId,
      sequence: nextSequence(),
      blockId,
      delta,
      timestamp,
    };
  }

  function emitBlockComplete(
    blockId: string,
    blockType: BlockType,
    content: unknown,
  ): GenerationEvent {
    return {
      type: "block.complete",
      requestId,
      sequence: nextSequence(),
      blockId,
      blockType,
      content,
      timestamp,
    };
  }

  function processPartialLine(line: string): GenerationEvent[] {
    const events: GenerationEvent[] = [];
    const blockType = resolveBlockType(
      line.match(/"type"\s*:\s*"([a-z_]+)"/)?.[1],
    );

    if (blockType && !startedCurrentLine) {
      const blockId = resolveStreamBlockId(undefined, currentBlockId);
      events.push(emitBlockStart(blockId, blockType));
    }

    const streamText = extractStreamableText(line);
    if (currentBlockId && streamText.length > lastStreamedText.length) {
      const delta = streamText.slice(lastStreamedText.length);
      lastStreamedText = streamText;
      const deltaEvent = emitBlockDelta(currentBlockId, delta);
      if (deltaEvent) {
        events.push(deltaEvent);
      }
    }

    return events;
  }

  function processCompleteLine(line: string): GenerationEvent[] {
    const events: GenerationEvent[] = [];
    const parsed = tryParseBlockLine(line);
    if (!parsed) {
      resetCurrentLine();
      return events;
    }

    const blockType = resolveBlockType(parsed.type);
    if (!blockType) {
      resetCurrentLine();
      return events;
    }

    const blockId = resolveStreamBlockId(
      typeof parsed.id === "string" ? parsed.id : undefined,
      currentBlockId,
    );
    const content = isPlainObject(parsed.content) ? parsed.content : {};

    if (!startedCurrentLine) {
      events.push(emitBlockStart(blockId, blockType));
    }

    const streamText = extractStreamableText(line);
    if (streamText.length > lastStreamedText.length) {
      const deltaEvent = emitBlockDelta(
        currentBlockId ?? blockId,
        streamText.slice(lastStreamedText.length),
      );
      if (deltaEvent) {
        events.push(deltaEvent);
      }
    }

    const finalizedBlockId = currentBlockId ?? blockId;
    const blockRecord = {
      id: finalizedBlockId,
      type: blockType,
      content,
      ...(isPlainObject(parsed.meta) ? { meta: parsed.meta } : {}),
    };
    completedBlocks.push(blockRecord);
    events.push(emitBlockComplete(finalizedBlockId, blockType, content));
    resetCurrentLine();
    return events;
  }

  function push(chunk: string): GenerationEvent[] {
    const events: GenerationEvent[] = [];
    lineBuffer += chunk;

    while (true) {
      const newlineIndex = lineBuffer.indexOf("\n");
      if (newlineIndex < 0) {
        events.push(...processPartialLine(lineBuffer));
        break;
      }

      const line = lineBuffer.slice(0, newlineIndex);
      lineBuffer = lineBuffer.slice(newlineIndex + 1);
      const trimmed = line.trim();
      if (trimmed.length === 0) {
        resetCurrentLine();
        continue;
      }
      events.push(...processCompleteLine(trimmed));
    }

    return events;
  }

  function flush(): GenerationEvent[] {
    const trimmed = lineBuffer.trim();
    lineBuffer = "";
    if (trimmed.length === 0) {
      return [];
    }
    return processCompleteLine(trimmed);
  }

  return {
    push,
    flush,
    getCompletedBlocks: () => [...completedBlocks],
    getLastSequence: () => sequence,
  };
}

export function buildArticleCandidateFromStreamBlocks(
  blocks: Record<string, unknown>[],
  context: GenerationStreamContext,
): Record<string, unknown> {
  const titleBlock = blocks.find((block) => block.type === "title");
  const titleText =
    titleBlock &&
    isPlainObject(titleBlock.content) &&
    typeof titleBlock.content.text === "string"
      ? titleBlock.content.text
      : context.input.topic ?? "未命名文章";

  return {
    version: 1,
    metadata: {
      title: titleText,
      createdAt: context.startedAt,
      updatedAt: context.startedAt,
      locale: context.input.metadata?.locale ?? "zh-CN",
    },
    input: {
      type:
        context.input.primaryIntent === "draft"
          ? "draft"
          : context.input.hasMaterials
            ? "material"
            : "topic",
      raw: context.input.inputSummary,
      capturedAt: context.input.normalizedAt,
    },
    styleAssignment: {
      themeId: "default",
      presetId: "classic-news",
    },
    blocks,
    generation: {
      status: "completed",
      mode: "stream",
      startedAt: context.startedAt,
      completedAt: new Date().toISOString(),
    },
  };
}
