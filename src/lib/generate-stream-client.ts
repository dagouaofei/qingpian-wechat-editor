import type { GenerateApiResponse } from "@/lib/generate-api-types";
import type { GenerationEvent } from "@/core/generation/events";
import { decodeGenerationEventFromSse } from "@/core/generation/sse";

function decodeStreamEnvelopeFromSseChunk(chunk: string): {
  eventType: string;
  data: unknown;
} | null {
  let eventType: string | undefined;
  let dataLine: string | undefined;

  for (const line of chunk.trim().split("\n")) {
    if (line.startsWith("event:")) {
      eventType = line.slice("event:".length).trim();
      continue;
    }
    if (line.startsWith("data:")) {
      dataLine = line.slice("data:".length).trim();
    }
  }

  if (!eventType || !dataLine) {
    return null;
  }

  try {
    return { eventType, data: JSON.parse(dataLine) };
  } catch {
    return null;
  }
}

function isFlowCompletePayload(
  data: unknown,
): data is Extract<GenerateApiResponse, { ok: true }> {
  return (
    !!data &&
    typeof data === "object" &&
    (data as { ok?: boolean }).ok === true &&
    typeof (data as { data?: unknown }).data === "object"
  );
}

function isFlowErrorPayload(
  data: unknown,
): data is { ok: false; error: Extract<GenerateApiResponse, { ok: false }>["error"] } {
  return (
    !!data &&
    typeof data === "object" &&
    (data as { ok?: boolean }).ok === false &&
    typeof (data as { error?: unknown }).error === "object"
  );
}

export type GenerateStreamHandlers = {
  onEvent: (event: GenerationEvent) => void;
  onComplete: (response: Extract<GenerateApiResponse, { ok: true }>) => void;
  onError: (error: Extract<GenerateApiResponse, { ok: false }>["error"]) => void;
};

function parseSseBuffer(
  buffer: string,
  handlers: GenerateStreamHandlers,
): string {
  const parts = buffer.split("\n\n");
  const remainder = parts.pop() ?? "";

  for (const chunk of parts) {
    if (chunk.trim().length === 0) {
      continue;
    }

    const envelope = decodeStreamEnvelopeFromSseChunk(chunk);
    if (envelope?.eventType === "flow.complete" && isFlowCompletePayload(envelope.data)) {
      handlers.onComplete({ ok: true, data: envelope.data.data });
      continue;
    }
    if (envelope?.eventType === "flow.error" && isFlowErrorPayload(envelope.data)) {
      handlers.onError(envelope.data.error as Extract<GenerateApiResponse, { ok: false }>["error"]);
      continue;
    }

    try {
      const event = decodeGenerationEventFromSse(chunk);
      handlers.onEvent(event);
      if (event.type === "error") {
        handlers.onError({
          category: "provider_network",
          code: event.code,
          message: event.message,
          phasesCompleted: ["generating"],
        });
      }
    } catch {
      // ignore malformed partial chunks
    }
  }

  return remainder;
}

export async function consumeGenerateStream(
  response: Response,
  handlers: GenerateStreamHandlers,
): Promise<void> {
  if (!response.ok || !response.body) {
    let message = `Stream request failed (${response.status})`;
    try {
      const json = (await response.json()) as { error?: { message?: string } };
      if (json.error?.message) {
        message = json.error.message;
      }
    } catch {
      // ignore
    }
    handlers.onError({
      category: "unknown",
      code: "stream_http_error",
      message,
      phasesCompleted: [],
    });
    return;
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
    buffer = parseSseBuffer(buffer, handlers);
  }

  if (buffer.trim().length > 0) {
    parseSseBuffer(`${buffer}\n\n`, handlers);
  }
}
