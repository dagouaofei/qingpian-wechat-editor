import { describe, expect, it } from "vitest";

import {
  buildVolcengineSystemPrompt,
  buildVolcengineUserPrompt,
  createVolcengineModelProvider,
  createVolcengineTransport,
  GenerationModelProviderError,
  loadVolcengineProviderConfig,
  parseAndNormalizeInputRequest,
  parseModelJsonContent,
} from "@/core/generation";

import {
  enabledVolcengineEnv,
  topicOnlyInputRequestFixture,
} from "../../fixtures/generation";

describe("Generation model provider contracts", () => {
  it("builds prompts that require Article JSON instead of HTML", () => {
    const normalized = parseAndNormalizeInputRequest(topicOnlyInputRequestFixture);
    const systemPrompt = buildVolcengineSystemPrompt();
    const userPrompt = buildVolcengineUserPrompt(normalized);

    expect(systemPrompt).toContain("JSON object");
    expect(systemPrompt).not.toContain("<html>");
    expect(systemPrompt).toContain("styleAssignment");
    expect(userPrompt).toContain("allowedBlockTypes");
  });

  it("parses fenced JSON model responses", () => {
    const parsed = parseModelJsonContent(
      "```json\n{\"id\":\"22222222-2222-4222-8222-222222222222\",\"version\":1}\n```",
    );
    expect(parsed).toEqual({
      id: "22222222-2222-4222-8222-222222222222",
      version: 1,
    });
  });

  it("exposes volcengine provider with injectable transport", () => {
    const provider = createVolcengineModelProvider({
      config: loadConfigFromFixture(),
      transport: {
        async complete() {
          return {
            ok: false,
            error: new GenerationModelProviderError("provider_error", "mock"),
          };
        },
      },
    });

    expect(provider.name).toBe("volcengine");
    expect(provider.config.provider).toBe("volcengine");
    expect(typeof provider.generate).toBe("function");
  });

  it("creates runtime fetch transport without calling network in this test", () => {
    expect(typeof createVolcengineTransport).toBe("function");
  });
});

function loadConfigFromFixture() {
  const result = loadVolcengineProviderConfig(enabledVolcengineEnv);
  if (!result.ok) {
    throw new Error("fixture config should be valid");
  }
  return result.config;
}
