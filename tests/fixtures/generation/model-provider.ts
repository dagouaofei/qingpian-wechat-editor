import type { GenerationModelTransport } from "@/core/generation";

import { validDoneArticleCandidate } from "./generation-events";

export const MOCK_VOLCENGINE_API_KEY = "test-volcengine-api-key";
export const MOCK_VOLCENGINE_MODEL = "doubao-pro-32k";

export const enabledVolcengineEnv: Record<string, string> = {
  VOLCENGINE_ENABLE_REAL_PROVIDER: "true",
  VOLCENGINE_API_KEY: MOCK_VOLCENGINE_API_KEY,
  VOLCENGINE_MODEL: MOCK_VOLCENGINE_MODEL,
  VOLCENGINE_BASE_URL: "https://ark.example.com/api/v3",
  VOLCENGINE_TIMEOUT_MS: "30000",
};

export const mockVolcengineArticleJson = JSON.stringify(validDoneArticleCandidate);

export function buildMockVolcengineChatResponse(content: string): string {
  return JSON.stringify({
    choices: [
      {
        message: {
          content,
        },
      },
    ],
  });
}

export function createMockVolcengineTransport(
  content: string,
): GenerationModelTransport {
  return {
    async complete() {
      return { ok: true, content };
    },
  };
}

export function createMockVolcengineTransportError(
  error: import("@/core/generation").GenerationModelProviderError,
): GenerationModelTransport {
  return {
    async complete() {
      return { ok: false, error };
    },
  };
}

export function createMockFetchResponse(options: {
  ok: boolean;
  status: number;
  body: string;
}): typeof fetch {
  return async () =>
    ({
      ok: options.ok,
      status: options.status,
      text: async () => options.body,
    }) as Response;
}
