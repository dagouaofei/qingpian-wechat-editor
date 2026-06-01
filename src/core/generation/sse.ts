import { GenerationEventError, parseGenerationEvent } from "./event-schemas";
import type { GenerationEvent } from "./events";

function serializeEventData(event: GenerationEvent): string {
  return JSON.stringify(event);
}

function parseEventData(data: string): GenerationEvent {
  let parsed: unknown;
  try {
    parsed = JSON.parse(data);
  } catch {
    throw new GenerationEventError("invalid SSE data JSON", [
      {
        path: ["data"],
        message: "invalid JSON",
        code: "invalid_json",
      },
    ]);
  }
  return parseGenerationEvent(parsed);
}

export function encodeGenerationEventToSse(event: GenerationEvent): string {
  const validated = parseGenerationEvent(event);
  return `event: ${validated.type}\ndata: ${serializeEventData(validated)}\n\n`;
}

export function decodeGenerationEventFromSse(input: string): GenerationEvent {
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    throw new GenerationEventError("empty SSE payload", [
      {
        path: [],
        message: "empty SSE payload",
        code: "empty_sse_payload",
      },
    ]);
  }

  let eventType: string | undefined;
  let dataLine: string | undefined;

  for (const line of trimmed.split("\n")) {
    if (line.trim().length === 0) {
      continue;
    }
    if (line.startsWith("event:")) {
      eventType = line.slice("event:".length).trim();
      continue;
    }
    if (line.startsWith("data:")) {
      dataLine = line.slice("data:".length).trim();
    }
  }

  if (!dataLine) {
    throw new GenerationEventError("missing SSE data line", [
      {
        path: ["data"],
        message: "missing data line",
        code: "missing_sse_data",
      },
    ]);
  }

  const event = parseEventData(dataLine);
  if (eventType && eventType !== event.type) {
    throw new GenerationEventError("SSE event type mismatch", [
      {
        path: ["event"],
        message: `expected ${event.type}, received ${eventType}`,
        code: "sse_event_type_mismatch",
      },
    ]);
  }

  return event;
}

export function encodeGenerationEventsToSse(events: GenerationEvent[]): string {
  return events.map((event) => encodeGenerationEventToSse(event).trimEnd()).join("\n\n") + "\n\n";
}

export function decodeGenerationEventsFromSse(input: string): GenerationEvent[] {
  const normalized = input.replace(/\r\n/g, "\n").trim();
  if (normalized.length === 0) {
    return [];
  }

  const chunks = normalized.split(/\n\n+/);
  const events: GenerationEvent[] = [];

  for (const chunk of chunks) {
    if (chunk.trim().length === 0) {
      continue;
    }
    events.push(decodeGenerationEventFromSse(chunk));
  }

  return events;
}
