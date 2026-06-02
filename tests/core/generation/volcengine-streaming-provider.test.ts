import { describe, expect, it } from "vitest";

import { validateGenerationEventSequence } from "@/core/generation/stream";
import { collectGenerationStream } from "@/core/generation/stream";
import { parseAndNormalizeInputRequest } from "@/core/generation/input.normalize";
import {
  createVolcengineStreamingModelProvider,
  type CreateVolcengineStreamingModelProviderOptions,
} from "@/core/generation/volcengine-streaming-provider";
import type { VolcengineStreamTransport } from "@/core/generation/volcengine-stream-transport";

import { topicOnlyInputRequestFixture } from "../../fixtures/generation";

describe("Volcengine streaming provider sequences", () => {
  it("assigns done.article sequence after all parser events", async () => {
    const input = parseAndNormalizeInputRequest(topicOnlyInputRequestFixture);
    const jsonl =
      '{"type":"title","id":"11111111-1111-4111-8111-000000000001","content":{"text":"标题"}}\n' +
      '{"type":"paragraph","id":"22222222-2222-4222-8222-000000000002","content":{"text":"正文"}}\n';

    const mockStreamTransport: VolcengineStreamTransport = {
      async *streamCompletion() {
        yield jsonl;
      },
    };

    const providerOptions: CreateVolcengineStreamingModelProviderOptions = {
      config: {
        provider: "volcengine",
        enabled: true,
        apiKey: "test-key",
        model: "test-model",
        baseUrl: "https://ark.example.com/api/v3",
        timeoutMs: 5_000,
      },
      streamTransport: mockStreamTransport,
    };
    const provider = createVolcengineStreamingModelProvider(providerOptions);

    const events = await collectGenerationStream(provider.generate(input));
    const validation = validateGenerationEventSequence(events);
    expect(validation.ok).toBe(true);

    const sequences = events.map((event) => event.sequence);
    const done = events.find((event) => event.type === "done.article");
    expect(done).toBeDefined();
    if (done) {
      expect(done.sequence).toBeGreaterThan(Math.max(...sequences.filter((s) => s !== done.sequence)));
    }
  });
});
