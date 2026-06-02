import { describe, expect, it } from "vitest";

import { decodeGenerationEventsFromSse } from "@/core/generation";
import { topicOnlyInputRequestFixture } from "../../fixtures/generation";
import { iterateGenerateStreamSse } from "@/server/generation/run-generate-stream-flow";
import {
  decodeStreamEnvelopeFromSseChunk,
  isFlowCompletePayload,
} from "@/server/generation/stream-sse";

describe("runGenerateStreamFlow", () => {
  it("streams deterministic events and ends with flow.complete", async () => {
    const chunks: string[] = [];
    for await (const chunk of iterateGenerateStreamSse({
      inputRequest: topicOnlyInputRequestFixture,
      requireRealProvider: false,
    })) {
      chunks.push(chunk);
    }

    const generationSse = chunks
      .filter((chunk) => !chunk.includes("flow.complete") && !chunk.includes("flow.error"))
      .join("");
    const generationEvents = decodeGenerationEventsFromSse(generationSse);
    expect(generationEvents.some((event) => event.type === "block.start")).toBe(true);
    expect(generationEvents.some((event) => event.type === "block.delta")).toBe(true);
    expect(generationEvents.some((event) => event.type === "done.article")).toBe(true);

    const flowChunk = chunks.find((chunk) => chunk.includes("flow.complete"));
    expect(flowChunk).toBeDefined();
    const envelope = decodeStreamEnvelopeFromSseChunk(flowChunk!);
    expect(envelope?.eventType).toBe("flow.complete");
    expect(isFlowCompletePayload(envelope?.data)).toBe(true);
    if (isFlowCompletePayload(envelope?.data)) {
      expect(envelope.data.data.previewBlocks.length).toBeGreaterThan(0);
      expect(envelope.data.data.article.blocks.length).toBeGreaterThan(0);
    }
  });
});
