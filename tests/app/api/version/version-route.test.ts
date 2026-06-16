import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { unlinkSync } from "node:fs";
import { join } from "node:path";

import { GET } from "@/app/api/version/route";
import { getAppVersionInfo } from "@/server/version/app-version";

const BUILD_METADATA_PATH = join(process.cwd(), "src/generated/build-metadata.json");

describe("GET /api/version", () => {
  const envKeys = [
    "APP_ENV",
    "APP_VERSION",
    "APP_GIT_SHA",
    "APP_BUILD_TIME",
    "DATABASE_URL",
    "STYLE_ADMIN_SESSION_SECRET",
    "STYLE_ADMIN_PASSWORD_HASH",
  ] as const;

  const originalEnv: Partial<Record<(typeof envKeys)[number], string | undefined>> =
    {};

  afterEach(() => {
    for (const key of envKeys) {
      const value = originalEnv[key];
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  });

  beforeEach(() => {
    try {
      unlinkSync(BUILD_METADATA_PATH);
    } catch {
      // no generated build metadata in test
    }
  });

  it("returns environment and version fields from APP_* variables", async () => {
    for (const key of envKeys) {
      originalEnv[key] = process.env[key];
    }

    process.env.APP_ENV = "staging";
    process.env.APP_VERSION = "release-1";
    process.env.APP_GIT_SHA = "8da62e9abc12";
    process.env.APP_BUILD_TIME = "2026-06-16T00:00:00.000Z";
    process.env.DATABASE_URL = "postgresql://user:secret-pass@db-host.internal:5432/db";

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      service: "qingpian-wechat-editor",
      environment: "staging",
      appVersion: "release-1",
      gitSha: "8da62e9abc12",
      buildTime: "2026-06-16T00:00:00.000Z",
    });
  });

  it("degrades safely when APP_* variables are missing", () => {
    for (const key of envKeys) {
      originalEnv[key] = process.env[key];
      delete process.env[key];
    }

    const info = getAppVersionInfo();

    expect(info.service).toBe("qingpian-wechat-editor");
    expect(info.appVersion).toBe("release-1");
    expect(typeof info.gitSha).toBe("string");
    expect(info.gitSha.length).toBeGreaterThan(0);
    expect(typeof info.buildTime).toBe("string");
    expect(info.environment).toBe("test");
  });

  it("does not expose secrets or infrastructure details in the JSON response", async () => {
    for (const key of envKeys) {
      originalEnv[key] = process.env[key];
    }

    process.env.APP_ENV = "production";
    process.env.APP_GIT_SHA = "edc1fd7";
    process.env.DATABASE_URL = "postgresql://user:super-secret@prod-db.rds.aliyuncs.com:5432/prod";
    process.env.STYLE_ADMIN_SESSION_SECRET = "session-secret-value";
    process.env.STYLE_ADMIN_PASSWORD_HASH = "password-hash-value";

    const response = await GET();
    const serialized = JSON.stringify(await response.json());

    expect(serialized).not.toContain("DATABASE_URL");
    expect(serialized).not.toContain("postgresql://");
    expect(serialized).not.toContain("super-secret");
    expect(serialized).not.toContain("session-secret-value");
    expect(serialized).not.toContain("password-hash-value");
    expect(serialized).not.toContain("prod-db.rds.aliyuncs.com");
    expect(serialized).not.toContain("password");
    expect(serialized).not.toContain("secret");
  });
});
