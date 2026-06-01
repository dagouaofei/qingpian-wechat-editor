import {
  GenerationModelProviderError,
  mapHttpStatusToProviderError,
  mapTransportFailure,
  sanitizeProviderErrorMessage,
} from "./model-provider-errors";
import type {
  GenerationModelTransport,
  GenerationModelTransportRequest,
  GenerationModelTransportResponse,
} from "./model-provider";

type FetchLike = typeof fetch;

function buildChatCompletionsUrl(baseUrl: string): string {
  const normalized = baseUrl.replace(/\/+$/, "");
  return `${normalized}/chat/completions`;
}

function extractCompletionContent(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    throw new GenerationModelProviderError(
      "invalid_response",
      "Volcengine response payload is not an object",
    );
  }

  const choices = (payload as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || choices.length === 0) {
    throw new GenerationModelProviderError(
      "invalid_response",
      "Volcengine response is missing choices",
    );
  }

  const message = (choices[0] as { message?: { content?: unknown } }).message;
  const content = message?.content;

  if (typeof content === "string" && content.trim().length > 0) {
    return content;
  }

  if (Array.isArray(content)) {
    const textParts = content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }
        if (part && typeof part === "object" && "text" in part) {
          return String((part as { text?: unknown }).text ?? "");
        }
        return "";
      })
      .filter(Boolean);
    if (textParts.length > 0) {
      return textParts.join("\n");
    }
  }

  throw new GenerationModelProviderError(
    "invalid_response",
    "Volcengine response did not include message content",
  );
}

export function createVolcengineTransport(
  fetchImpl: FetchLike = fetch,
): GenerationModelTransport {
  return {
    async complete(
      request: GenerationModelTransportRequest,
    ): Promise<GenerationModelTransportResponse> {
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
            stream: false,
            response_format: { type: "json_object" },
          }),
          signal: controller.signal,
        });

        const bodyText = await response.text();

        if (!response.ok) {
          return {
            ok: false,
            error: mapHttpStatusToProviderError(
              response.status,
              sanitizeProviderErrorMessage(bodyText),
            ),
          };
        }

        let payload: unknown;
        try {
          payload = JSON.parse(bodyText);
        } catch (error) {
          return {
            ok: false,
            error: new GenerationModelProviderError(
              "invalid_response",
              "Volcengine response body is not valid JSON",
              { cause: error },
            ),
          };
        }

        return {
          ok: true,
          content: extractCompletionContent(payload),
        };
      } catch (error) {
        return {
          ok: false,
          error: mapTransportFailure(error),
        };
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}
