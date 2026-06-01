import type { GenerationEvent } from "@/core/generation";

export const REQUEST_ID = "33333333-3333-4333-8333-333333333333";
export const TITLE_BLOCK_ID = "11111111-1111-4111-8111-000000000001";
export const PARAGRAPH_BLOCK_ID = "11111111-1111-4111-8111-000000000002";
export const TIMESTAMP = "2026-06-02T00:00:00.000Z";

export const blockStartFixture: GenerationEvent = {
  type: "block.start",
  requestId: REQUEST_ID,
  sequence: 1,
  blockId: TITLE_BLOCK_ID,
  blockType: "title",
  timestamp: TIMESTAMP,
};

export const blockDeltaFixture: GenerationEvent = {
  type: "block.delta",
  requestId: REQUEST_ID,
  sequence: 2,
  blockId: TITLE_BLOCK_ID,
  delta: "轻篇示例标题",
  timestamp: TIMESTAMP,
};

export const blockCompleteFixture: GenerationEvent = {
  type: "block.complete",
  requestId: REQUEST_ID,
  sequence: 3,
  blockId: TITLE_BLOCK_ID,
  blockType: "title",
  content: { text: "轻篇示例标题" },
  timestamp: TIMESTAMP,
};

export const doneArticleFixture: GenerationEvent = {
  type: "done.article",
  requestId: REQUEST_ID,
  sequence: 4,
  article: {
    id: "22222222-2222-4222-8222-222222222222",
    version: 1,
    candidate: true,
  },
  timestamp: TIMESTAMP,
};

export const errorEventFixture: GenerationEvent = {
  type: "error",
  requestId: REQUEST_ID,
  sequence: 5,
  code: "generation_failed",
  message: "deterministic provider failure",
  recoverable: false,
  timestamp: TIMESTAMP,
};

export const heartbeatFixture: GenerationEvent = {
  type: "heartbeat",
  requestId: REQUEST_ID,
  sequence: 6,
  timestamp: TIMESTAMP,
};

export const validSequenceFixtures: GenerationEvent[] = [
  blockStartFixture,
  blockDeltaFixture,
  blockCompleteFixture,
  doneArticleFixture,
];
