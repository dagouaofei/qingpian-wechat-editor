import type { BlockType } from "@prisma/client";

import { buildCodeFallbackDslRuntime } from "@/lib/dsl-runtime/build-code-fallback-dsl-runtime";
import type { DslRuntimeVariantSourceMeta } from "@/lib/dsl-runtime-context-types";

import { getStyleAdminDbAvailability } from "../db-availability";
import { buildRuntimeVariantPoolWhere } from "../mappers";
import type { StyleAdminPrismaClient } from "../prisma";
import { prisma } from "../prisma";
import { pickInspectionHtmlSource } from "../inspection/pick-inspection-html-source";
import { resolveRuntimePoolDefinitionJson } from "@/lib/dsl-runtime/resolve-runtime-pool-definition";
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
): Promise<
  Pick<
    RuntimeVariantDslPoolResult,
    "definitionJsonByVariantId" | "variantSourceMetaByVariantId" | "variantIds" | "issues"
  >
> {
  const rows = await db.styleVariant.findMany({
    where: buildRuntimeVariantPoolWhere({ blockType }),
    include: {
      distribution: true,
      currentVersion: true,
      sources: true,
    },
    orderBy: { runtimeVariantId: "asc" },
  });

  const definitionJsonByVariantId: Record<string, unknown> = {};
  const variantSourceMetaByVariantId: Record<string, DslRuntimeVariantSourceMeta> = {};
  const variantIds: string[] = [];
  const issues: RuntimeVariantDslPoolResult["issues"] = [];

  for (const row of rows) {
    const mapped = mapDbRowToRuntimeDslDefinition(row);
    if (mapped.issue) {
      issues.push(mapped.issue);
    }
    if (mapped.included && mapped.definitionJson) {
      const htmlSource = pickInspectionHtmlSource(row.sources);
      const resolvedDefinitionJson = resolveRuntimePoolDefinitionJson({
        definitionJson: mapped.definitionJson,
        runtimeVariantId: row.runtimeVariantId,
        blockType: row.blockType,
        label: row.label,
        styleFamily: row.styleFamily,
        primarySourceType: htmlSource?.sourceType ?? null,
        sourceHtml: htmlSource?.rawHtml ?? null,
      });

      definitionJsonByVariantId[row.runtimeVariantId] = resolvedDefinitionJson;
      variantIds.push(row.runtimeVariantId);

      variantSourceMetaByVariantId[row.runtimeVariantId] = {
        blockType: row.blockType,
        styleFamily: row.styleFamily,
        label: row.label,
        primarySourceType: htmlSource?.sourceType ?? null,
        sourceHtml: htmlSource?.rawHtml ?? null,
      };
    }
  }

  return { definitionJsonByVariantId, variantSourceMetaByVariantId, variantIds, issues };
}

function buildCodeFallbackRuntimeResult(notice?: string): RuntimeVariantDslPoolResult {
  const fallback = buildCodeFallbackDslRuntime(notice);
  return {
    source: fallback.source,
    cache: fallback.cache,
    definitionJsonByVariantId: fallback.definitionJsonByVariantId,
    variantSourceMetaByVariantId: fallback.variantSourceMetaByVariantId,
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
    const { definitionJsonByVariantId, variantSourceMetaByVariantId, variantIds, issues } =
      await loadDatabaseRuntimeDslPool(db, options.blockType);

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
      variantSourceMetaByVariantId,
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
