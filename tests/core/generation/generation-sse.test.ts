import { describe, expect, it } from "vitest";

import {
  decodeGenerationEventFromSse,
  decodeGenerationEventsFromSse,
  encodeGenerationEventToSse,
  encodeGenerationEventsToSse,
  GenerationEventError,
} from "@/core/generation";

import {
  blockDeltaFixture,
  blockStartFixture,
  doneArticleFixture,
  validSequenceFixtures,
} from "../../fixtures/generation";

describe("GenerationEvent SSE helpers", () => {
  it("encodes and decodes a single event", () => {
    const encoded = encodeGenerationEventToSse(blockStartFixture);
    expect(encoded).toContain("event: block.start\n");
    expect(encoded).toContain('"type":"block.start"');

    const decoded = decodeGenerationEventFromSse(encoded);
    expect(decoded).toEqual(blockStartFixture);
  });

  it("encodes and decodes multiple events", () => {
    const encoded = encodeGenerationEventsToSse(validSequenceFixtures);
    const decoded = decodeGenerationEventsFromSse(encoded);
    expect(decoded).toEqual(validSequenceFixtures);
  });

  it("ignores empty chunks when decoding multiple events", () => {
    const encoded =
      encodeGenerationEventToSse(blockStartFixture) +
      "\n\n\n" +
      encodeGenerationEventToSse(blockDeltaFixture).trimEnd();
    const decoded = decodeGenerationEventsFromSse(encoded);
    expect(decoded).toHaveLength(2);
  });

  it("fails clearly on invalid SSE data", () => {
    expect(() => decodeGenerationEventFromSse("event: block.start\n")).toThrow(
      GenerationEventError,
    );
    expect(() =>
      decodeGenerationEventFromSse('event: block.start\ndata: {"type":'),
    ).toThrow(GenerationEventError);
    expect(() =>
      decodeGenerationEventFromSse(
        `event: block.delta\ndata: ${JSON.stringify(blockStartFixture)}`,
      ),
    ).toThrow(GenerationEventError);
  });

  it("round-trips done.article candidate payload", () => {
    const encoded = encodeGenerationEventToSse(doneArticleFixture);
    const decoded = decodeGenerationEventFromSse(encoded);
    expect(decoded.type).toBe("done.article");
    if (decoded.type === "done.article") {
      expect(decoded.article).toEqual(doneArticleFixture.article);
    }
  });
});
