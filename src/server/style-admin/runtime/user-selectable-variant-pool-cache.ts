import type { BlockType } from "@prisma/client";

import type { UserSelectableVariantPoolResult } from "./user-selectable-variant-pool-types";

type CacheEntry = {
  expiresAt: number;
  payload: UserSelectableVariantPoolResult;
};

const poolCache = new Map<string, CacheEntry>();

const DEFAULT_TTL_SECONDS = 120;
const MAX_TTL_SECONDS = 300;

export function resolveUserSelectablePoolCacheTtlSeconds(): number {
  const raw = process.env.STYLE_ADMIN_USER_POOL_CACHE_TTL_SECONDS?.trim();
  if (!raw) {
    return DEFAULT_TTL_SECONDS;
  }
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_TTL_SECONDS;
  }
  return Math.min(parsed, MAX_TTL_SECONDS);
}

export function buildUserSelectablePoolCacheKey(blockType?: BlockType): string {
  return blockType ? `blockType:${blockType}` : "all";
}

export function readUserSelectablePoolCache(
  cacheKey: string,
): UserSelectableVariantPoolResult | null {
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

export function writeUserSelectablePoolCache(
  cacheKey: string,
  payload: UserSelectableVariantPoolResult,
  ttlSeconds: number,
): void {
  poolCache.set(cacheKey, {
    expiresAt: Date.now() + ttlSeconds * 1000,
    payload,
  });
}

export function clearUserSelectablePoolCache(): void {
  poolCache.clear();
}

/** Alias for S10-STORY-006 governance writes — clears in-memory pool cache. */
export function invalidateUserSelectableVariantPoolCache(blockType?: BlockType): void {
  if (!blockType) {
    clearUserSelectablePoolCache();
    return;
  }
  poolCache.delete(buildUserSelectablePoolCacheKey(blockType));
  poolCache.delete(buildUserSelectablePoolCacheKey());
}
