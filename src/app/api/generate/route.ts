import { NextResponse } from "next/server";

import type { InputRequest } from "@/core/generation";
import {
  getGenerateProviderStatus,
  runGenerateMainFlow,
} from "@/server/generation/run-generate-main-flow";

export async function GET() {
  const status = await getGenerateProviderStatus();
  return NextResponse.json(status);
}

export async function POST(request: Request) {
  let body: InputRequest;
  try {
    body = (await request.json()) as InputRequest;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: {
          category: "input_validation",
          code: "invalid_json",
          message: "Request body must be valid InputRequest JSON",
          phasesCompleted: [],
        },
      },
      { status: 400 },
    );
  }

  const result = await runGenerateMainFlow({ inputRequest: body });
  if (!result.ok) {
    const status =
      result.error.category === "provider_network"
        ? 502
        : result.error.category === "input_validation"
          ? 400
          : 422;
    return NextResponse.json(result, { status });
  }

  const serialized = JSON.stringify(result);
  if (
    serialized.includes("VOLCENGINE_API_KEY") ||
    serialized.includes("Bearer ")
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          category: "unknown",
          code: "unsafe_response",
          message: "Generate response failed safety check",
          phasesCompleted: result.data.phasesCompleted,
        },
      },
      { status: 500 },
    );
  }

  return NextResponse.json(result);
}
