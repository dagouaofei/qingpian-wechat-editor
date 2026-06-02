import type { GenerateMainFlowSuccess } from "./generate-flow-types";

export type GenerateStreamFlowCompletePayload = {
  ok: true;
  data: GenerateMainFlowSuccess;
};

export type GenerateStreamFlowErrorPayload = {
  ok: false;
  error: {
    category: string;
    code: string;
    message: string;
    phasesCompleted: string[];
  };
};

export function encodeFlowCompleteToSse(payload: GenerateStreamFlowCompletePayload): string {
  return `event: flow.complete\ndata: ${JSON.stringify(payload)}\n\n`;
}

export function encodeFlowErrorToSse(payload: GenerateStreamFlowErrorPayload): string {
  return `event: flow.error\ndata: ${JSON.stringify(payload)}\n\n`;
}

export function decodeStreamEnvelopeFromSseChunk(chunk: string): {
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

export function isFlowCompletePayload(
  data: unknown,
): data is GenerateStreamFlowCompletePayload {
  return (
    !!data &&
    typeof data === "object" &&
    (data as GenerateStreamFlowCompletePayload).ok === true &&
    typeof (data as GenerateStreamFlowCompletePayload).data === "object"
  );
}

export function isFlowErrorPayload(data: unknown): data is GenerateStreamFlowErrorPayload {
  return (
    !!data &&
    typeof data === "object" &&
    (data as GenerateStreamFlowErrorPayload).ok === false &&
    typeof (data as GenerateStreamFlowErrorPayload).error === "object"
  );
}
