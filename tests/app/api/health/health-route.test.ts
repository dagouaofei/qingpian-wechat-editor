import { afterEach, describe, expect, it, vi } from "vitest";

const { queryRaw } = vi.hoisted(() => ({
  queryRaw: vi.fn(),
}));

vi.mock("@/server/style-admin/prisma", () => ({
  prisma: {
    $queryRaw: queryRaw,
  },
}));

import { getHealthCheckResult } from "@/server/health/health-check";

describe("GET /api/health", () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;

  afterEach(() => {
    if (originalDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }
    vi.clearAllMocks();
  });

  it("returns not_configured when DATABASE_URL is missing", async () => {
    delete process.env.DATABASE_URL;

    const result = await getHealthCheckResult();

    expect(result).toEqual({
      ok: true,
      service: "qingpian-wechat-editor",
      database: "not_configured",
      time: expect.any(String),
    });
    expect(queryRaw).not.toHaveBeenCalled();
  });

  it("returns ok when database query succeeds", async () => {
    process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/db?schema=public";
    queryRaw.mockResolvedValue([{ "?column?": 1 }]);

    const result = await getHealthCheckResult();

    expect(result.ok).toBe(true);
    expect(result.database).toBe("ok");
    expect(result.service).toBe("qingpian-wechat-editor");
  });

  it("returns unavailable without leaking connection details when query fails", async () => {
    process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/db?schema=public";
    queryRaw.mockRejectedValue(
      new Error("Can't reach database server at `secret-host.example.com:5432`"),
    );

    const result = await getHealthCheckResult();

    expect(result.ok).toBe(false);
    expect(result.database).toBe("unavailable");
    expect(JSON.stringify(result)).not.toContain("secret-host");
    expect(JSON.stringify(result)).not.toContain("DATABASE_URL");
    expect(JSON.stringify(result)).not.toContain("postgresql://");
  });
});
