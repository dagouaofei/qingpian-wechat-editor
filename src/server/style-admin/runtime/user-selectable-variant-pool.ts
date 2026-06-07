import type { BlockType } from "@prisma/client";

import { getVariantById, createFirstWaveRequiredVariantRegistry } from "@/core/styles";
import { getUserSelectablePreviewVariantDefinition } from "@/core/style-library/user-selectable-preview-pool";
import type { VariantDefinition } from "@/core/styles/types";
import type { BlockType as CoreBlockType } from "@/core/blocks";

import { isCodeBackedRuntimeVariantAvailable } from "@/lib/runtime-variant-availability";
import { getCodeBackedRuntimeAvailableVariantIds } from "@/lib/runtime-variant-seed-config";

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

function resolveCodeFallbackVariantDefinition(
  runtimeVariantId: string,
): VariantDefinition | undefined {
  const registry = createFirstWaveRequiredVariantRegistry();
  return (
    getVariantById(registry, runtimeVariantId) ??
    getUserSelectablePreviewVariantDefinition(runtimeVariantId)
  );
}

function buildCodeFallbackPool(blockType?: BlockType): UserSelectableVariantPoolResult {
  const variants = [...getCodeBackedRuntimeAvailableVariantIds()]
    .filter((runtimeVariantId) => isCodeBackedRuntimeVariantAvailable(runtimeVariantId))
    .map((runtimeVariantId) => resolveCodeFallbackVariantDefinition(runtimeVariantId))
    .filter((variant): variant is VariantDefinition => {
      if (!variant) {
        return false;
      }
      if (blockType && variant.blockType !== (blockType as CoreBlockType)) {
        return false;
      }
      return true;
    });

  return {
    source: "code_fallback",
    cache: {
      hit: false,
      ttlSeconds: 0,
      generatedAt: new Date().toISOString(),
    },
    variants,
    issues: [],
    notice:
      "Using code-backed user-selectable pool fallback. DB-backed distribution is not active.",
  };
}

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
    const fallback = buildCodeFallbackPool(options.blockType);
    return {
      ...fallback,
      notice:
        "DATABASE_URL is not configured. Preview picker uses code-backed user-selectable pool.",
    };
  }

  try {
    const { variants, definitionJsonByVariantId, issues } = await loadDatabasePool(
      db,
      options.blockType,
    );
    const result: UserSelectableVariantPoolResult = {
      source: variants.length > 0 ? "database" : "empty",
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
          ? "Database user-selectable pool is empty. Import variants or promote user-selectable entries."
          : undefined,
    };

    writeUserSelectablePoolCache(cacheKey, result, ttlSeconds);
    return result;
  } catch {
    const fallback = buildCodeFallbackPool(options.blockType);
    return {
      ...fallback,
      notice: "Database is unavailable. Preview picker uses code-backed fallback.",
    };
  }
}
