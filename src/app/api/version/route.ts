import { NextResponse } from "next/server";

import { getAppVersionInfo } from "@/server/version/app-version";

export async function GET() {
  return NextResponse.json(getAppVersionInfo());
}
