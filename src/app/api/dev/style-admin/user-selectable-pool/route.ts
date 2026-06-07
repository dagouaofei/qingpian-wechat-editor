import { NextResponse } from "next/server";

import { isDevApiEnabled } from "@/lib/dev-api-env";
import {
  getUserSelectableVariantPool,
  toUserSelectableVariantPoolSnapshot,
} from "@/server/style-admin/runtime";

import {
  sanitizeDevPoolIssues,
  sanitizeDevPoolNotice,
} from "./sanitize-dev-pool-response";

function createDevApiDisabledResponse() {
  return NextResponse.json(
    { error: "Not found", disabled: true, reason: "dev_only" },
    { status: 404 },
  );
}

export async function GET(request: Request) {
  if (!isDevApiEnabled()) {
    return createDevApiDisabledResponse();
  }

  const { searchParams } = new URL(request.url);
  const blockType = searchParams.get("blockType") ?? "heading";
  const forceRefresh = searchParams.get("forceRefresh") === "true";

  try {
    const pool = await getUserSelectableVariantPool({
      blockType: blockType as "heading",
      forceRefresh,
    });

    const snapshot = toUserSelectableVariantPoolSnapshot(pool);

    return NextResponse.json({
      source: snapshot.source,
      cache: snapshot.cache,
      count: snapshot.poolVariantIds.length,
      poolVariantIds: snapshot.poolVariantIds,
      issues: sanitizeDevPoolIssues(snapshot.issues),
      notice: sanitizeDevPoolNotice(snapshot.notice),
      variants: snapshot.variants.map((variant) => ({
        id: variant.id,
        label: variant.label,
        blockType: variant.blockType,
        family: variant.family,
      })),
    });
  } catch {
    return NextResponse.json(
      {
        error: "User-selectable pool lookup failed",
        disabled: false,
      },
      { status: 500 },
    );
  }
}
