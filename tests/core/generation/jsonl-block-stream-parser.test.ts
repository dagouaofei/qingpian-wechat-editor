import { describe, expect, it } from "vitest";

import {
  createJsonlBlockStreamParser,
  type JsonlBlockStreamParser,
} from "@/core/generation/jsonl-block-stream-parser";

import { topicOnlyInputRequestFixture } from "../../fixtures/generation";
import { parseAndNormalizeInputRequest } from "@/core/generation";

function createParser(): JsonlBlockStreamParser {
  const input = parseAndNormalizeInputRequest(topicOnlyInputRequestFixture);
  return createJsonlBlockStreamParser({
    requestId: "stream-test",
    input,
    startedAt: "2026-06-02T00:00:00.000Z",
  });
}

describe("JSONL block-aware stream parser", () => {
  it("emits block.start, block.delta, and block.complete for a streamed line", () => {
    const parser = createParser();
    const line =
      '{"type":"title","id":"11111111-1111-4111-8111-000000000001","content":{"text":"轻篇流式标题"}}\n';
    const events = parser.push(line);
    expect(events.some((event) => event.type === "block.start")).toBe(true);
    expect(events.some((event) => event.type === "block.delta")).toBe(true);
    expect(events.some((event) => event.type === "block.complete")).toBe(true);
    expect(parser.getCompletedBlocks()).toHaveLength(1);
  });

  it("emits incremental deltas while a line is still buffering", () => {
    const parser = createParser();
    const partial = '{"type":"paragraph","id":"22222222-2222-4222-8222-000000000002","content":{"text":"第一段';
    const mid = `${partial}继续`;
    const events = [...parser.push(partial), ...parser.push(mid)];
    const deltas = events.filter((event) => event.type === "block.delta");
    expect(deltas.length).toBeGreaterThan(0);
  });

  it("never emits block ids that fail UUID validation while id is still partial", () => {
    const parser = createParser();
    const partial =
      '{"type":"title","id":"11111111-1111-4111-8111-00000000000';
    const events = parser.push(partial);
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    for (const event of events) {
      if (
        event.type === "block.start" ||
        event.type === "block.delta" ||
        event.type === "block.complete"
      ) {
        expect(event.blockId).toMatch(uuidPattern);
      }
    }
  });

  it("keeps monotonic sequence numbers across many deltas", () => {
    const parser = createParser();
    const line =
      '{"type":"paragraph","id":"22222222-2222-4222-8222-000000000002","content":{"text":"';
    const events: ReturnType<JsonlBlockStreamParser["push"]> = [];
    for (let index = 0; index < 50; index += 1) {
      events.push(...parser.push(`${line}字${index}`));
    }
    events.push(
      ...parser.push(
        `${line}完成"}}\n`,
      ),
    );
    const sequences = events.map((event) => event.sequence);
    for (let index = 1; index < sequences.length; index += 1) {
      expect(sequences[index]).toBeGreaterThan(sequences[index - 1]!);
    }
    expect(parser.getLastSequence()).toBe(sequences[sequences.length - 1]);
  });

  it("parses multiple lines in order", () => {
    const parser = createParser();
    const chunk =
      '{"type":"title","id":"11111111-1111-4111-8111-000000000001","content":{"text":"标题"}}\n' +
      '{"type":"paragraph","id":"22222222-2222-4222-8222-000000000002","content":{"text":"正文"}}\n';
    parser.push(chunk);
    expect(parser.getCompletedBlocks()).toHaveLength(2);
  });
});
