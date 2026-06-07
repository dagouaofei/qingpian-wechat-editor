import type { BlockType } from "@prisma/client";

import { buildCodeFallbackDslRuntime } from "@/lib/dsl-runtime/build-code-fallback-dsl-runtime";

import { getStyleAdminDbAvailability } from "../db-availability";
import { buildRuntimeVariantPoolWhere } from "../mappers";
import type { StyleAdminPrismaClient } from "../prisma";
import { prisma } from "../prisma";
import { mapDbRowToRuntimeDslDefinition } from "./runtime-variant-dsl-pool-mapper";
import {
  buildRuntimeDslPoolCacheKey,
  readRuntimeDslPoolCache,
  writeRuntimeDslPoolCache,
} from "./runtime-variant-dsl-pool-cache";
import type {
  RuntimeVariantDslPoolOptions,
  RuntimeVariantDslPoolResult,
} from "./runtime-variant-dsl-pool-types";
import { resolveUserSelectablePoolCacheTtlSeconds } from "./user-selectable-variant-pool-cache";

async function loadDatabaseRuntimeDslPool(
  db: StyleAdminPrismaClient,
  blockType?: BlockType,
): Promise<Pick<RuntimeVariantDslPoolResult, "definitionJsonByVariantId" | "variantIds" | "issues">> {
  const rows = await db.styleVariant.findMany({
    where: buildRuntimeVariantPoolWhere({ blockType }),
    include: {
      distribution: true,
      currentVersion: true,
    },
    orderBy: { runtimeVariantId: "asc" },
  });

  const definitionJsonByVariantId: Record<string, unknown> = {};
  const variantIds: string[] = [];
  const issues: RuntimeVariantDslPoolResult["issues"] = [];

  for (const row of rows) {
    const mapped = mapDbRowToRuntimeDslDefinition(row);
    if (mapped.issue) {
      issues.push(mapped.issue);
    }
    if (mapped.included && mapped.definitionJson) {
      definitionJsonByVariantId[row.runtimeVariantId] = mapped.definitionJson;
      variantIds.push(row.runtimeVariantId);
    }
  }

  return { definitionJsonByVariantId, variantIds, issues };
}

function buildCodeFallbackRuntimeResult(notice?: string): RuntimeVariantDslPoolResult {
  const fallback = buildCodeFallbackDslRuntime(notice);
  return {
    source: fallback.source,
    cache: fallback.cache,
    definitionJsonByVariantId: fallback.definitionJsonByVariantId,
    variantIds: fallback.variantIds,
    issues: [],
    notice: fallback.notice,
  };
}

export async function getRuntimeVariantDslPool(
  options: RuntimeVariantDslPoolOptions = {},
  db: StyleAdminPrismaClient = prisma,
): Promise<RuntimeVariantDslPoolResult> {
  const ttlSeconds = resolveUserSelectablePoolCacheTtlSeconds();
  const cacheKey = buildRuntimeDslPoolCacheKey(options.blockType);

  if (!options.forceRefresh) {
    const cached = readRuntimeDslPoolCache(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const availability = getStyleAdminDbAvailability();
  if (!availability.configured) {
    return buildCodeFallbackRuntimeResult(
      "DATABASE_URL is not configured. Preview uses code-backed DSL runtime fallback.",
    );
  }

  try {
    const { definitionJsonByVariantId, variantIds, issues } = await loadDatabaseRuntimeDslPool(
      db,
      options.blockType,
    );

    if (variantIds.length === 0) {
      return buildCodeFallbackRuntimeResult(
        "Database runtime DSL pool is empty. Import variants before preview.",
      );
    }

    const result: RuntimeVariantDslPoolResult = {
      source: "database",
      cache: {
        hit: false,
        ttlSeconds,
        generatedAt: new Date().toISOString(),
      },
      definitionJsonByVariantId,
      variantIds,
      issues,
    };

    writeRuntimeDslPoolCache(cacheKey, result, ttlSeconds);
    return result;
  } catch {
    return buildCodeFallbackRuntimeResult(
      "Database is unavailable. Preview uses code-backed DSL runtime fallback.",
    );
  }
}
