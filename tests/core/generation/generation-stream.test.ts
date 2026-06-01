import { describe, expect, it } from "vitest";

import {
  collectGenerationStream,
  createDeterministicGenerationEvents,
  createGenerationStream,
  deterministicGenerationStreamProvider,
  parseAndNormalizeInputRequest,
  validateGenerationEventSequence,
} from "@/core/generation";

import {
  REQUEST_ID,
  TITLE_BLOCK_ID,
  topicOnlyInputRequestFixture,
  topicWithMaterialsInputRequestFixture,
} from "../../fixtures/generation";

describe("Generation stream runtime", () => {
  const normalizedTopicOnly = parseAndNormalizeInputRequest(
    topicOnlyInputRequestFixture,
  );

  it("outputs stable deterministic event sequence", () => {
    const first = createDeterministicGenerationEvents(normalizedTopicOnly, {
      requestId: REQUEST_ID,
      startedAt: "2026-06-02T00:00:00.000Z",
    });
    const second = createDeterministicGenerationEvents(normalizedTopicOnly, {
      requestId: REQUEST_ID,
      startedAt: "2026-06-02T00:00:00.000Z",
    });

    expect(first).toEqual(second);
    expect(validateGenerationEventSequence(first).ok).toBe(true);
    expect(first.at(-1)?.type).toBe("done.article");
  });

  it("validates monotonic sequence", () => {
    const events = createDeterministicGenerationEvents(normalizedTopicOnly);
    const invalid = [...events];
    invalid[2] = { ...invalid[2]!, sequence: 2 };

    const result = validateGenerationEventSequence(invalid);
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.issues.some((issue) => issue.code === "sequence_not_monotonic")).toBe(
      true,
    );
  });

  it("fails when block.delta appears before block.start", () => {
    const result = validateGenerationEventSequence([
      {
        type: "block.delta",
        requestId: REQUEST_ID,
        sequence: 1,
        blockId: TITLE_BLOCK_ID,
        delta: "too early",
      },
    ]);

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.issues.some((issue) => issue.code === "delta_before_start")).toBe(
      true,
    );
  });

  it("fails when events continue after error", () => {
    const events = createDeterministicGenerationEvents(normalizedTopicOnly);
    const withError = [
      ...events.slice(0, 2),
      {
        type: "error" as const,
        requestId: REQUEST_ID,
        sequence: 99,
        code: "provider_error",
        message: "failed",
      },
      events[2]!,
    ];

    const result = validateGenerationEventSequence(withError);
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.issues.some((issue) => issue.code === "event_after_error")).toBe(
      true,
    );
  });

  it("fails when done.article is not last non-heartbeat event", () => {
    const events = createDeterministicGenerationEvents(normalizedTopicOnly);
    const doneIndex = events.findIndex((event) => event.type === "done.article");
    const invalid = [
      ...events.slice(0, doneIndex + 1),
      {
        type: "heartbeat" as const,
        requestId: REQUEST_ID,
        sequence: 100,
      },
      {
        type: "block.start" as const,
        requestId: REQUEST_ID,
        sequence: 101,
        blockId: TITLE_BLOCK_ID,
        blockType: "title" as const,
      },
    ];

    const result = validateGenerationEventSequence(invalid);
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.issues.some((issue) => issue.code === "done_not_last")).toBe(true);
  });

  it("collects full stream from deterministic provider", async () => {
    const normalized = parseAndNormalizeInputRequest(
      topicWithMaterialsInputRequestFixture,
    );
    const stream = createGenerationStream(
      normalized,
      deterministicGenerationStreamProvider,
      { requestId: REQUEST_ID, startedAt: "2026-06-02T00:00:00.000Z" },
    );
    const events = await collectGenerationStream(stream);

    expect(events.length).toBeGreaterThan(0);
    expect(events.at(-1)?.type).toBe("done.article");
    expect(validateGenerationEventSequence(events).ok).toBe(true);
  });

  it("rejects raw InputRequest for createGenerationStream", () => {
    expect(() =>
      createGenerationStream(
        topicOnlyInputRequestFixture as never,
        deterministicGenerationStreamProvider,
      ),
    ).toThrow(TypeError);
  });

  it("allows heartbeat without affecting block sequence validation", () => {
    const events = createDeterministicGenerationEvents(normalizedTopicOnly);
    const withHeartbeat = [
      events[0]!,
      {
        type: "heartbeat" as const,
        requestId: REQUEST_ID,
        sequence: 2,
      },
      ...events.slice(1).map((event, index) => ({
        ...event,
        sequence: index + 3,
      })),
    ];

    expect(validateGenerationEventSequence(withHeartbeat).ok).toBe(true);
  });
});
