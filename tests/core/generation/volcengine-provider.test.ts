import { describe, expect, it } from "vitest";

import {
  collectGenerationStream,
  createVolcengineModelProvider,
  createVolcengineTransport,
  deterministicGenerationStreamProvider,
  finalizeGenerationEvents,
  GenerationModelProviderError,
  loadVolcengineProviderConfig,
  mapHttpStatusToProviderError,
  mapTransportFailure,
  parseAndNormalizeInputRequest,
  sanitizeProviderErrorMessage,
  validateGenerationEventSequence,
} from "@/core/generation";

import {
  createMockFetchResponse,
  createMockVolcengineTransport,
  createMockVolcengineTransportError,
  enabledVolcengineEnv,
  MOCK_VOLCENGINE_API_KEY,
  mockVolcengineArticleJson,
  topicOnlyInputRequestFixture,
  validDoneArticleCandidate,
} from "../../fixtures/generation";

describe("Volcengine model provider", () => {
  const normalizedInput = parseAndNormalizeInputRequest(topicOnlyInputRequestFixture);

  const enabledConfig = {
    provider: "volcengine" as const,
    enabled: true,
    apiKey: MOCK_VOLCENGINE_API_KEY,
    model: "doubao-pro-32k",
    baseUrl: "https://ark.example.com/api/v3",
    timeoutMs: 5_000,
  };

  it("maps auth failures to stable provider errors", () => {
    const error = mapHttpStatusToProviderError(401, "Bearer secret-key invalid");
    expect(error.code).toBe("auth_failed");
    expect(error.message).not.toContain("secret-key");
  });

  it("maps rate limits to stable provider errors", () => {
    const error = mapHttpStatusToProviderError(429, "too many requests");
    expect(error.code).toBe("rate_limited");
    expect(error.recoverable).toBe(true);
  });

  it("maps timeout failures to stable provider errors", () => {
    const error = mapTransportFailure(new Error("The operation was aborted due to timeout"));
    expect(error.code).toBe("timeout");
  });

  it("maps network failures to stable provider errors", () => {
    const error = mapTransportFailure(new Error("fetch failed"));
    expect(error.code).toBe("network_error");
  });

  it("sanitizes bearer tokens from error messages", () => {
    const sanitized = sanitizeProviderErrorMessage(
      `Authorization failed for Bearer ${MOCK_VOLCENGINE_API_KEY}`,
    );
    expect(sanitized).not.toContain(MOCK_VOLCENGINE_API_KEY);
    expect(sanitized).toContain("[REDACTED]");
  });

  it("returns config error events when API key is missing", async () => {
    const provider = createVolcengineModelProvider({
      config: {
        provider: "volcengine",
        enabled: false,
        baseUrl: enabledVolcengineEnv.VOLCENGINE_BASE_URL!,
        timeoutMs: 5_000,
      },
      transport: createMockVolcengineTransport(mockVolcengineArticleJson),
    });

    const events = await collectGenerationStream(provider.generate(normalizedInput));
    expect(events).toHaveLength(1);
    expect(events[0]?.type).toBe("error");
    if (events[0]?.type !== "error") {
      return;
    }
    expect(events[0].code).toBe("config_disabled");
    expect(JSON.stringify(events[0])).not.toContain(MOCK_VOLCENGINE_API_KEY);
  });

  it("yields GenerationEvent stream with done.article from mock transport", async () => {
    const provider = createVolcengineModelProvider({
      config: enabledConfig,
      transport: createMockVolcengineTransport(mockVolcengineArticleJson),
    });

    const events = await collectGenerationStream(
      provider.generate(normalizedInput, {
        requestId: "req-volcengine-001",
        startedAt: "2026-06-02T00:00:00.000Z",
      }),
    );

    expect(events.length).toBeGreaterThan(0);
    expect(events.at(-1)?.type).toBe("done.article");
    expect(validateGenerationEventSequence(events).ok).toBe(true);
  });

  it("finalizes mock Volcengine provider output into a formal Article", async () => {
    const provider = createVolcengineModelProvider({
      config: enabledConfig,
      transport: createMockVolcengineTransport(mockVolcengineArticleJson),
    });
    const events = await collectGenerationStream(provider.generate(normalizedInput));
    const result = finalizeGenerationEvents(events);

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.data.article.id).toBe(validDoneArticleCandidate.id);
    expect(result.data.article.blocks.length).toBeGreaterThanOrEqual(1);
  });

  it("converts malformed JSON into error events", async () => {
    const provider = createVolcengineModelProvider({
      config: enabledConfig,
      transport: createMockVolcengineTransport("not-json"),
    });
    const events = await collectGenerationStream(provider.generate(normalizedInput));
    expect(events[0]?.type).toBe("error");
    if (events[0]?.type !== "error") {
      return;
    }
    expect(events[0].code).toBe("malformed_json");
  });

  it("converts non-object JSON into error events", async () => {
    const provider = createVolcengineModelProvider({
      config: enabledConfig,
      transport: createMockVolcengineTransport(JSON.stringify(["array"])),
    });
    const events = await collectGenerationStream(provider.generate(normalizedInput));
    expect(events[0]?.type).toBe("error");
    if (events[0]?.type !== "error") {
      return;
    }
    expect(events[0].code).toBe("invalid_article_candidate");
  });

  it("rejects forbidden html field in model output", async () => {
    const provider = createVolcengineModelProvider({
      config: enabledConfig,
      transport: createMockVolcengineTransport(
        JSON.stringify({
          ...validDoneArticleCandidate,
          html: "<p>forbidden</p>",
        }),
      ),
    });
    const events = await collectGenerationStream(provider.generate(normalizedInput));
    expect(events[0]?.type).toBe("error");
    if (events[0]?.type !== "error") {
      return;
    }
    expect(events[0].code).toBe("forbidden_output_field");
  });

  it("maps transport auth failures to error events", async () => {
    const provider = createVolcengineModelProvider({
      config: enabledConfig,
      transport: createMockVolcengineTransportError(
        new GenerationModelProviderError("auth_failed", "Volcengine authentication failed"),
      ),
    });
    const events = await collectGenerationStream(provider.generate(normalizedInput));
    expect(events[0]?.type).toBe("error");
    if (events[0]?.type !== "error") {
      return;
    }
    expect(events[0].code).toBe("auth_failed");
  });

  it("maps transport rate limits to error events", async () => {
    const provider = createVolcengineModelProvider({
      config: enabledConfig,
      transport: createMockVolcengineTransportError(
        new GenerationModelProviderError("rate_limited", "Volcengine rate limit exceeded", {
          recoverable: true,
        }),
      ),
    });
    const events = await collectGenerationStream(provider.generate(normalizedInput));
    expect(events[0]?.type).toBe("error");
    if (events[0]?.type !== "error") {
      return;
    }
    expect(events[0].code).toBe("rate_limited");
  });

  it("maps transport timeout failures to error events", async () => {
    const provider = createVolcengineModelProvider({
      config: enabledConfig,
      transport: createMockVolcengineTransportError(
        new GenerationModelProviderError("timeout", "Volcengine request timed out", {
          recoverable: true,
        }),
      ),
    });
    const events = await collectGenerationStream(provider.generate(normalizedInput));
    expect(events[0]?.type).toBe("error");
    if (events[0]?.type !== "error") {
      return;
    }
    expect(events[0].code).toBe("timeout");
  });

  it("maps transport network failures to error events", async () => {
    const provider = createVolcengineModelProvider({
      config: enabledConfig,
      transport: createMockVolcengineTransportError(
        new GenerationModelProviderError("network_error", "Volcengine network request failed", {
          recoverable: true,
        }),
      ),
    });
    const events = await collectGenerationStream(provider.generate(normalizedInput));
    expect(events[0]?.type).toBe("error");
    if (events[0]?.type !== "error") {
      return;
    }
    expect(events[0].code).toBe("network_error");
  });

  it("uses fetch transport without real network in unit tests", async () => {
    const transport = createVolcengineTransport(
      createMockFetchResponse({
        ok: true,
        status: 200,
        body: JSON.stringify({
          choices: [{ message: { content: mockVolcengineArticleJson } }],
        }),
      }),
    );

    const provider = createVolcengineModelProvider({
      config: enabledConfig,
      transport,
    });
    const events = await collectGenerationStream(provider.generate(normalizedInput));
    expect(events.at(-1)?.type).toBe("done.article");
  });

  it("rejects raw InputRequest", async () => {
    const provider = createVolcengineModelProvider({
      config: enabledConfig,
      transport: createMockVolcengineTransport(mockVolcengineArticleJson),
    });
    await expect(async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for await (const _ of provider.generate(
        topicOnlyInputRequestFixture as never,
      )) {
        // consume stream
      }
    }).rejects.toThrow(TypeError);
  });

  it("keeps deterministic provider available as test fallback", async () => {
    const events = await collectGenerationStream(
      deterministicGenerationStreamProvider.generate(normalizedInput),
    );
    const result = finalizeGenerationEvents(events);
    expect(result.ok).toBe(true);
  });

  it("does not require real env vars at module load time", () => {
    expect(() => createVolcengineModelProvider()).not.toThrow();
    expect(loadVolcengineProviderConfig({}).ok).toBe(false);
  });
});
