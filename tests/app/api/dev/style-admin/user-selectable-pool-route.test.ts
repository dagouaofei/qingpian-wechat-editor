import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/dev/style-admin/user-selectable-pool/route";
import {
  sanitizeDevPoolIssues,
  sanitizeDevPoolNotice,
} from "@/app/api/dev/style-admin/user-selectable-pool/sanitize-dev-pool-response";

const poolUrl = "http://localhost:3000/api/dev/style-admin/user-selectable-pool?blockType=heading";

function assertResponseHasNoSecrets(payload: unknown) {
  const serialized = JSON.stringify(payload);
  expect(serialized).not.toMatch(/DATABASE_URL/i);
  expect(serialized).not.toMatch(/postgresql:\/\//i);
  expect(serialized).not.toMatch(/postgres:\/\//i);
  expect(serialized).not.toMatch(/\n\s+at\s+/);
}

vi.mock("@/server/style-admin/runtime", () => ({
  getUserSelectableVariantPool: vi.fn(),
  toUserSelectableVariantPoolSnapshot: vi.fn(),
}));

import {
  getUserSelectableVariantPool,
  toUserSelectableVariantPoolSnapshot,
} from "@/server/style-admin/runtime";

const mockedGetPool = vi.mocked(getUserSelectableVariantPool);
const mockedToSnapshot = vi.mocked(toUserSelectableVariantPoolSnapshot);

describe("GET /api/dev/style-admin/user-selectable-pool", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("returns 404 disabled response in production", async () => {
    process.env.NODE_ENV = "production";

    const response = await GET(new Request(poolUrl));
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({
      error: "Not found",
      disabled: true,
      reason: "dev_only",
    });
    expect(mockedGetPool).not.toHaveBeenCalled();
    assertResponseHasNoSecrets(body);
  });

  it("returns 404 disabled response outside development and test", async () => {
    process.env.NODE_ENV = "staging";

    const response = await GET(new Request(poolUrl));
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.disabled).toBe(true);
    expect(body.reason).toBe("dev_only");
    expect(mockedGetPool).not.toHaveBeenCalled();
  });

  it("returns pool snapshot in development without leaking secrets", async () => {
    process.env.NODE_ENV = "development";

    mockedGetPool.mockResolvedValue({
      source: "code_fallback",
      cache: { hit: false, ttlSeconds: 0, generatedAt: "2026-06-07T00:00:00.000Z" },
      variants: [
        {
          id: "heading_teal_section_label_html_paste_candidate",
          schemaVersion: 1,
          blockType: "heading",
          family: "htmlPasteCandidate",
          name: "teal",
          label: "Teal",
          status: "experimental",
        },
      ],
      issues: [],
      notice: "DATABASE_URL is not configured. Preview picker uses code-backed user-selectable pool.",
    });
    mockedToSnapshot.mockImplementation((result) => ({
      source: result.source,
      cache: result.cache,
      variants: result.variants,
      poolVariantIds: result.variants.map((variant) => variant.id),
      issues: result.issues,
      notice: result.notice,
    }));

    const response = await GET(new Request(poolUrl));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.source).toBe("code_fallback");
    expect(body.count).toBe(1);
    expect(body.notice).toBe("Database is not configured or unavailable.");
    expect(body.variants[0]?.id).toBe("heading_teal_section_label_html_paste_candidate");
    assertResponseHasNoSecrets(body);
  });

  it("returns pool snapshot in test environment", async () => {
    process.env.NODE_ENV = "test";

    mockedGetPool.mockResolvedValue({
      source: "database",
      cache: { hit: false, ttlSeconds: 120, generatedAt: "2026-06-07T00:00:00.000Z" },
      variants: [],
      issues: [],
      notice: undefined,
    });
    mockedToSnapshot.mockImplementation((result) => ({
      source: result.source,
      cache: result.cache,
      variants: result.variants,
      poolVariantIds: [],
      issues: result.issues,
      notice: result.notice,
    }));

    const response = await GET(new Request(poolUrl));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.source).toBe("database");
    expect(mockedGetPool).toHaveBeenCalledWith({
      blockType: "heading",
      forceRefresh: false,
    });
  });

  it("returns generic 500 without stack when pool lookup throws", async () => {
    process.env.NODE_ENV = "development";
    mockedGetPool.mockRejectedValue(
      new Error("connect ECONNREFUSED postgresql://secret:pw@db.internal:5432/app"),
    );

    const response = await GET(new Request(poolUrl));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({
      error: "User-selectable pool lookup failed",
      disabled: false,
    });
    assertResponseHasNoSecrets(body);
  });
});

describe("sanitizeDevPoolResponse", () => {
  it("redacts DATABASE_URL and connection strings from notices", () => {
    expect(
      sanitizeDevPoolNotice(
        "DATABASE_URL is not configured. Preview picker uses code-backed user-selectable pool.",
      ),
    ).toBe("Database is not configured or unavailable.");
  });

  it("redacts sensitive details from issue messages", () => {
    const issues = sanitizeDevPoolIssues([
      {
        runtimeVariantId: "heading_bad",
        code: "invalid_definition",
        message: "Prisma P1001: Can't reach database at postgresql://user:pass@db:5432/main",
      },
    ]);

    expect(issues[0]?.message).toBe("Database is not configured or unavailable.");
  });
});
