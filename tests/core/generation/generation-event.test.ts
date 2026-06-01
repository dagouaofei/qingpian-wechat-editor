import { describe, expect, it } from "vitest";

import {
  GenerationEventError,
  parseGenerationEvent,
} from "@/core/generation";

import {
  blockCompleteFixture,
  blockDeltaFixture,
  blockStartFixture,
  doneArticleFixture,
  errorEventFixture,
  heartbeatFixture,
  REQUEST_ID,
  TITLE_BLOCK_ID,
} from "../../fixtures/generation";

describe("GenerationEvent schema", () => {
  it("parses block.start", () => {
    expect(parseGenerationEvent(blockStartFixture)).toEqual(blockStartFixture);
  });

  it("parses block.delta", () => {
    expect(parseGenerationEvent(blockDeltaFixture)).toEqual(blockDeltaFixture);
  });

  it("parses block.complete", () => {
    expect(parseGenerationEvent(blockCompleteFixture)).toEqual(
      blockCompleteFixture,
    );
  });

  it("parses done.article", () => {
    expect(parseGenerationEvent(doneArticleFixture)).toEqual(doneArticleFixture);
  });

  it("parses error and heartbeat", () => {
    expect(parseGenerationEvent(errorEventFixture)).toEqual(errorEventFixture);
    expect(parseGenerationEvent(heartbeatFixture)).toEqual(heartbeatFixture);
  });

  it("rejects deprecated event names", () => {
    expect(() =>
      parseGenerationEvent({
        type: "block.append",
        requestId: REQUEST_ID,
        sequence: 1,
        blockId: TITLE_BLOCK_ID,
      }),
    ).toThrow(GenerationEventError);

    expect(() =>
      parseGenerationEvent({
        type: "done_article",
        requestId: REQUEST_ID,
        sequence: 1,
        article: {},
      }),
    ).toThrow(GenerationEventError);
  });

  it("rejects forbidden html/css/className/style fields", () => {
    expect(() =>
      parseGenerationEvent({
        ...blockStartFixture,
        meta: { html: "<p>x</p>" },
      }),
    ).toThrow(GenerationEventError);

    expect(() =>
      parseGenerationEvent({
        type: "block.delta",
        requestId: REQUEST_ID,
        sequence: 2,
        blockId: TITLE_BLOCK_ID,
        delta: "<b>标题</b>",
      }),
    ).toThrow(GenerationEventError);

    expect(() =>
      parseGenerationEvent({
        type: "block.start",
        requestId: REQUEST_ID,
        sequence: 1,
        blockId: TITLE_BLOCK_ID,
        blockType: "title",
        style: "color:red",
      }),
    ).toThrow(GenerationEventError);
  });
});
