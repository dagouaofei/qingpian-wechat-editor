import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  buildUserSelectablePoolCacheKey,
  clearUserSelectablePoolCache,
  readUserSelectablePoolCache,
  invalidateUserSelectableVariantPoolCache,
  resolveUserSelectablePoolCacheTtlSeconds,
  writeUserSelectablePoolCache,
} from "@/server/style-admin/runtime/user-selectable-variant-pool-cache";

describe("user-selectable-variant-pool-cache", () => {
  beforeEach(() => {
    clearUserSelectablePoolCache();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    delete process.env.STYLE_ADMIN_USER_POOL_CACHE_TTL_SECONDS;
  });

  it("caps TTL at 300 seconds", () => {
    process.env.STYLE_ADMIN_USER_POOL_CACHE_TTL_SECONDS = "9999";
    expect(resolveUserSelectablePoolCacheTtlSeconds()).toBe(300);
  });

  it("returns cached pool until TTL expires", () => {
    const payload = {
      source: "database" as const,
      cache: { hit: false, ttlSeconds: 60, generatedAt: "2026-06-07T00:00:00.000Z" },
      variants: [],
      issues: [],
    };
    const key = buildUserSelectablePoolCacheKey("heading");
    writeUserSelectablePoolCache(key, payload, 60);

    expect(readUserSelectablePoolCache(key)?.cache.hit).toBe(true);

    vi.advanceTimersByTime(59_000);
    expect(readUserSelectablePoolCache(key)?.cache.hit).toBe(true);

    vi.advanceTimersByTime(2_000);
    expect(readUserSelectablePoolCache(key)).toBeNull();
  });

  it("invalidates cache by blockType", () => {
    const payload = {
      source: "database" as const,
      cache: { hit: false, ttlSeconds: 60, generatedAt: "2026-06-07T00:00:00.000Z" },
      variants: [],
      issues: [],
    };
    const headingKey = buildUserSelectablePoolCacheKey("heading");
    writeUserSelectablePoolCache(headingKey, payload, 60);
    invalidateUserSelectableVariantPoolCache("heading");
    expect(readUserSelectablePoolCache(headingKey)).toBeNull();
  });
});
