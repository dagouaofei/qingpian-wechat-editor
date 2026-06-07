import { NextResponse } from "next/server";

import { getHealthCheckResult } from "@/server/health/health-check";

export async function GET() {
  const result = await getHealthCheckResult();
  const status = result.ok ? 200 : 503;

  return NextResponse.json(result, { status });
}
