import {
  GenerationModelProviderError,
  mapHttpStatusToProviderError,
  mapTransportFailure,
  sanitizeProviderErrorMessage,
} from "./model-provider-errors";
import type { GenerationModelTransportRequest } from "./model-provider";

type FetchLike = typeof fetch;

function buildChatCompletionsUrl(baseUrl: string): string {
  const normalized = baseUrl.replace(/\/+$/, "");
  return `${normalized}/chat/completions`;
}

function extractStreamDelta(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    return "";
  }
  const choices = (payload as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || choices.length === 0) {
    return "";
  }
  const delta = (choices[0] as { delta?: { content?: unknown } }).delta?.content;
  if (typeof delta === "string") {
    return delta;
  }
  if (Array.isArray(delta)) {
    return delta
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }
        if (part && typeof part === "object" && "text" in part) {
          return String((part as { text?: unknown }).text ?? "");
        }
        return "";
      })
      .join("");
  }
  return "";
}

export type VolcengineStreamTransport = {
  streamCompletion: (
    request: GenerationModelTransportRequest,
  ) => AsyncGenerator<string, void, void>;
};

export function createVolcengineStreamTransport(
  fetchImpl: FetchLike = fetch,
): VolcengineStreamTransport {
  return {
    async *streamCompletion(request) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), request.timeoutMs);

      try {
        const response = await fetchImpl(buildChatCompletionsUrl(request.baseUrl), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${request.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: request.model,
            messages: request.messages,
            stream: true,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const bodyText = await response.text();
          throw mapHttpStatusToProviderError(
            response.status,
            sanitizeProviderErrorMessage(bodyText),
          );
        }

        if (!response.body) {
          throw new GenerationModelProviderError(
            "invalid_response",
            "Volcengine stream response has no body",
          );
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          buffer += decoder.decode(value, { stream: true });

          while (true) {
            const lineEnd = buffer.indexOf("\n");
            if (lineEnd < 0) {
              break;
            }
            const line = buffer.slice(0, lineEnd).trim();
            buffer = buffer.slice(lineEnd + 1);

            if (!line.startsWith("data:")) {
              continue;
            }
            const data = line.slice("data:".length).trim();
            if (data === "[DONE]" || data.length === 0) {
              continue;
            }

            let payload: unknown;
            try {
              payload = JSON.parse(data);
            } catch {
              continue;
            }

            const delta = extractStreamDelta(payload);
            if (delta.length > 0) {
              yield delta;
            }
          }
        }
      } catch (error) {
        if (error instanceof GenerationModelProviderError) {
          throw error;
        }
        throw mapTransportFailure(error);
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}
