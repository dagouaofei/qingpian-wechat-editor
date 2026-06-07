import type { BlockType } from "@prisma/client";

import type { RuntimeVariantDslPoolResult } from "./runtime-variant-dsl-pool-types";

type CacheEntry = {
  expiresAt: number;
  payload: RuntimeVariantDslPoolResult;
};

const poolCache = new Map<string, CacheEntry>();

export function buildRuntimeDslPoolCacheKey(blockType?: BlockType): string {
  return blockType ? `runtime-dsl:blockType:${blockType}` : "runtime-dsl:all";
}

export function readRuntimeDslPoolCache(
  cacheKey: string,
): RuntimeVariantDslPoolResult | null {
  const entry = poolCache.get(cacheKey);
  if (!entry) {
    return null;
  }
  if (Date.now() >= entry.expiresAt) {
    poolCache.delete(cacheKey);
    return null;
  }
  return {
    ...entry.payload,
    cache: {
      ...entry.payload.cache,
      hit: true,
    },
  };
}

export function writeRuntimeDslPoolCache(
  cacheKey: string,
  payload: RuntimeVariantDslPoolResult,
  ttlSeconds: number,
): void {
  poolCache.set(cacheKey, {
    expiresAt: Date.now() + ttlSeconds * 1000,
    payload,
  });
}

export function invalidateRuntimeDslPoolCache(blockType?: BlockType): void {
  if (!blockType) {
    for (const key of poolCache.keys()) {
      if (key.startsWith("runtime-dsl:")) {
        poolCache.delete(key);
      }
    }
    return;
  }
  poolCache.delete(buildRuntimeDslPoolCacheKey(blockType));
  poolCache.delete(buildRuntimeDslPoolCacheKey());
}
