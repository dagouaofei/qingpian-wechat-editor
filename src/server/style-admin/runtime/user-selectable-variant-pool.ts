import type { BlockType } from "@prisma/client";

import { getVariantById, createFirstWaveRequiredVariantRegistry } from "@/core/styles";
import { getUserSelectablePreviewVariantDefinition } from "@/core/style-library/user-selectable-preview-pool";
import type { VariantDefinition } from "@/core/styles/types";
import type { BlockType as CoreBlockType } from "@/core/blocks";

import { getStyleAdminDbAvailability } from "../db-availability";
import { buildUserSelectablePoolWhere } from "../mappers";
import type { StyleAdminPrismaClient } from "../prisma";
import { prisma } from "../prisma";
import {
  buildUserSelectablePoolCacheKey,
  readUserSelectablePoolCache,
  resolveUserSelectablePoolCacheTtlSeconds,
  writeUserSelectablePoolCache,
} from "./user-selectable-variant-pool-cache";
import { mapDbPoolRowToVariantDefinition } from "./user-selectable-variant-pool-mapper";
import type {
  RuntimeVariantPoolIssue,
  UserSelectableVariantPoolOptions,
  UserSelectableVariantPoolResult,
} from "./user-selectable-variant-pool-types";

async function loadDatabasePool(
  db: StyleAdminPrismaClient,
  blockType?: BlockType,
): Promise<{
  variants: VariantDefinition[];
  definitionJsonByVariantId: Record<string, unknown>;
  issues: RuntimeVariantPoolIssue[];
}> {
  const rows = await db.styleVariant.findMany({
    where: buildUserSelectablePoolWhere({ blockType }),
    include: {
      distribution: true,
      currentVersion: true,
    },
    orderBy: { label: "asc" },
  });

  const variants: VariantDefinition[] = [];
  const definitionJsonByVariantId: Record<string, unknown> = {};
  const issues: RuntimeVariantPoolIssue[] = [];

  for (const row of rows) {
    const mapped = mapDbPoolRowToVariantDefinition(row);
    if (mapped.issue) {
      issues.push(mapped.issue);
    }
    if (mapped.variant) {
      variants.push(mapped.variant);
      if (row.currentVersion?.definitionJson) {
        definitionJsonByVariantId[row.runtimeVariantId] = row.currentVersion.definitionJson;
      }
    }
  }

  return { variants, definitionJsonByVariantId, issues };
}

function buildDegradedEmptyPool(notice: string): UserSelectableVariantPoolResult {
  return {
    source: "code_fallback",
    cache: {
      hit: false,
      ttlSeconds: 0,
      generatedAt: new Date().toISOString(),
    },
    variants: [],
    issues: [],
    notice,
  };
}

export async function getUserSelectableVariantPool(
  options: UserSelectableVariantPoolOptions = {},
  db: StyleAdminPrismaClient = prisma,
): Promise<UserSelectableVariantPoolResult> {
  const ttlSeconds = resolveUserSelectablePoolCacheTtlSeconds();
  const cacheKey = buildUserSelectablePoolCacheKey(options.blockType);

  if (!options.forceRefresh) {
    const cached = readUserSelectablePoolCache(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const availability = getStyleAdminDbAvailability();
  if (!availability.configured) {
    return buildDegradedEmptyPool(
      "DATABASE_URL is not configured. User preview heading picker is in degraded mode (empty pool).",
    );
  }

  try {
    const { variants, definitionJsonByVariantId, issues } = await loadDatabasePool(
      db,
      options.blockType,
    );
    const result: UserSelectableVariantPoolResult = {
      source: "database",
      cache: {
        hit: false,
        ttlSeconds,
        generatedAt: new Date().toISOString(),
      },
      variants,
      definitionJsonByVariantId,
      issues,
      notice:
        variants.length === 0
          ? "Database user-selectable pool is empty for current filters."
          : undefined,
    };

    writeUserSelectablePoolCache(cacheKey, result, ttlSeconds);
    return result;
  } catch {
    return buildDegradedEmptyPool(
      "Database is unavailable. User preview heading picker is in degraded mode (empty pool).",
    );
  }
}
