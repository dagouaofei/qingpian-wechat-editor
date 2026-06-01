/**
 * GenerationEvent types — SSE / streaming runtime contract
 * @see docs/architecture/generation-pipeline.md §4
 * @see docs/architecture/architecture-overview.md §11.2
 */

import type { BlockType } from "@/core/blocks";

import type { NormalizedInput } from "./input";

export const GENERATION_EVENT_TYPES = [
  "block.start",
  "block.delta",
  "block.complete",
  "done.article",
  "error",
  "heartbeat",
] as const;

export type GenerationEventType = (typeof GENERATION_EVENT_TYPES)[number];

/** Article payload candidate; formal validation via finalizeGenerationEvents (S5-STORY-004). */
export type ArticleCandidate = unknown;

export type GenerationEventMeta = Record<string, unknown>;

export type GenerationEventBase = {
  requestId: string;
  sequence: number;
  timestamp?: string;
};

export type BlockStartEvent = GenerationEventBase & {
  type: "block.start";
  blockId: string;
  blockType: BlockType;
  meta?: GenerationEventMeta;
};

export type BlockDeltaEvent = GenerationEventBase & {
  type: "block.delta";
  blockId: string;
  delta: string;
};

export type BlockCompleteEvent = GenerationEventBase & {
  type: "block.complete";
  blockId: string;
  blockType: BlockType;
  content: unknown;
  meta?: GenerationEventMeta;
};

export type DoneArticleEvent = GenerationEventBase & {
  type: "done.article";
  article: ArticleCandidate;
  meta?: GenerationEventMeta;
};

export type GenerationErrorEvent = GenerationEventBase & {
  type: "error";
  code: string;
  message: string;
  recoverable?: boolean;
};

export type HeartbeatEvent = GenerationEventBase & {
  type: "heartbeat";
};

export type GenerationEvent =
  | BlockStartEvent
  | BlockDeltaEvent
  | BlockCompleteEvent
  | DoneArticleEvent
  | GenerationErrorEvent
  | HeartbeatEvent;

export type GenerationSequenceIssue = {
  path: Array<string | number>;
  message: string;
  code: string;
};

export type GenerationSequenceValidationResult =
  | { ok: true; issues: [] }
  | { ok: false; issues: GenerationSequenceIssue[] };

export type GenerationStreamContext = {
  requestId: string;
  input: NormalizedInput;
  startedAt: string;
};

export type GenerationStreamProvider = {
  generate: (
    input: NormalizedInput,
    context?: Partial<GenerationStreamContext>,
  ) => AsyncIterable<GenerationEvent>;
};

export type GenerationStream = AsyncIterable<GenerationEvent>;
