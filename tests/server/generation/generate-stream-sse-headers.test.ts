import { describe, expect, it } from "vitest";

import { buildGenerateStreamSseResponseHeaders } from "@/server/generation/stream-sse";

describe("buildGenerateStreamSseResponseHeaders", () => {
  it("disables nginx buffering and sets SSE cache headers", () => {
    const headers = buildGenerateStreamSseResponseHeaders();

    expect(headers).toEqual({
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });
  });
});
