import { NextResponse } from "next/server";

import { isDevApiEnabled } from "@/lib/dev-api-env";
import {
  getRuntimeVariantDslPool,
  getUserSelectableVariantPool,
  toUserSelectableVariantPoolSnapshot,
} from "@/server/style-admin/runtime";
import { validateVariantDslRuntimeReadiness } from "@/lib/dsl-runtime";
import {
  dslRuntimeTraceFixtureArticle,
  pickTraceFixtureBlock,
} from "@/lib/dsl-runtime/trace-fixture-article";
import { buildVariantRuntimeTraceSummary } from "@/server/style-admin/runtime/build-variant-runtime-traces";

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
    const [pool, dslPool] = await Promise.all([
      getUserSelectableVariantPool({
        blockType: blockType as "heading",
        forceRefresh,
      }),
      getRuntimeVariantDslPool({
        blockType: blockType as "heading",
        forceRefresh,
      }),
    ]);

    const snapshot = toUserSelectableVariantPoolSnapshot(pool);

    return NextResponse.json({
      source: snapshot.source,
      cache: snapshot.cache,
      count: snapshot.poolVariantIds.length,
      poolVariantIds: snapshot.poolVariantIds,
      issues: sanitizeDevPoolIssues(snapshot.issues),
      notice: sanitizeDevPoolNotice(snapshot.notice),
      variants: snapshot.variants.map((variant) => {
        const definitionJson = dslPool.definitionJsonByVariantId[variant.id];
        const trace = buildVariantRuntimeTraceSummary({
          runtimeVariantId: variant.id,
          blockType: variant.blockType,
          definitionJson,
          poolSource: dslPool.source,
        });
        const readiness =
          definitionJson != null
            ? validateVariantDslRuntimeReadiness({
                runtimeVariantId: variant.id,
                blockType: variant.blockType,
                definitionJson,
                poolSource: dslPool.source,
                article: dslRuntimeTraceFixtureArticle,
                block: pickTraceFixtureBlock(variant.blockType),
              })
            : null;
        return {
          id: variant.id,
          label: variant.label,
          blockType: variant.blockType,
          family: variant.family,
          runtimeSource: trace.runtimeSource,
          dslVersion: trace.dslVersion ?? null,
          decoderPath: trace.decoderPath,
          definitionSource: trace.definitionSource,
          dslValid: trace.dslValid,
          previewReady: readiness?.previewReady ?? false,
          copyReady: readiness?.copyReady ?? false,
        };
      }),
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
