import type { InputRequest } from "@/core/generation/input";
import { iterateGenerateStreamSse } from "@/server/generation/run-generate-stream-flow";
import { buildGenerateStreamSseResponseHeaders } from "@/server/generation/stream-sse";

type GenerateStreamApiRequestBody = InputRequest & {
  requireRealProvider?: boolean;
};

/** Long-form Volcengine JSONL stream (default 60s provider timeout + finalize/render). */
export const maxDuration = 150;

export async function POST(request: Request) {
  let body: GenerateStreamApiRequestBody;
  try {
    body = (await request.json()) as GenerateStreamApiRequestBody;
  } catch {
    return new Response(
      `event: flow.error\ndata: ${JSON.stringify({
        ok: false,
        error: {
          category: "input_validation",
          code: "invalid_json",
          message: "Request body must be valid InputRequest JSON",
          phasesCompleted: [],
        },
      })}\n\n`,
      {
        status: 400,
        headers: buildGenerateStreamSseResponseHeaders(),
      },
    );
  }

  const { requireRealProvider, ...inputRequest } = body;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of iterateGenerateStreamSse({
          inputRequest,
          requireRealProvider: requireRealProvider === true,
        })) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Stream generation failed";
        controller.enqueue(
          encoder.encode(
            `event: flow.error\ndata: ${JSON.stringify({
              ok: false,
              error: {
                category: "unknown",
                code: "stream_runtime_failed",
                message,
                phasesCompleted: [],
              },
            })}\n\n`,
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: buildGenerateStreamSseResponseHeaders(),
  });
}
