import { afterEach, describe, expect, it, vi } from "vitest";

import { StyleLibraryAdminQuery } from "@/server/style-admin/queries/style-library-admin-query";

const originalDatabaseUrl = process.env.DATABASE_URL;

afterEach(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
  vi.restoreAllMocks();
});

function createMockDb() {
  return {
    styleVariant: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    styleVariantValidationRun: {
      findMany: vi.fn(),
    },
  };
}

describe("StyleLibraryAdminQuery", () => {
  it("returns db_not_configured when DATABASE_URL is missing", async () => {
    delete process.env.DATABASE_URL;
    const query = new StyleLibraryAdminQuery(createMockDb() as never);

    const result = await query.getAdminVariantSummary();
    expect(result).toEqual({ ok: false, error: "db_not_configured" });
  });

  it("summarizes distribution flags independently", async () => {
    process.env.DATABASE_URL = "postgresql://local/test";
    const db = createMockDb();
    db.styleVariant.findMany.mockResolvedValue([
      {
        lifecycle: "release1_required",
        distribution: {
          userSelectable: false,
          release1Required: true,
          defaultEligible: false,
          hidden: false,
          deprecated: false,
        },
        currentVersion: { componentProtocolJson: null },
      },
      {
        lifecycle: "user_selectable",
        distribution: {
          userSelectable: true,
          release1Required: false,
          defaultEligible: false,
          hidden: false,
          deprecated: false,
        },
        currentVersion: { componentProtocolJson: { componentId: "x" } },
      },
      {
        lifecycle: "deprecated",
        distribution: {
          userSelectable: false,
          release1Required: false,
          defaultEligible: false,
          hidden: true,
          deprecated: true,
        },
        currentVersion: { componentProtocolJson: null },
      },
    ]);
    db.styleVariantValidationRun.findMany.mockResolvedValue([]);

    const query = new StyleLibraryAdminQuery(db as never);
    const result = await query.getAdminVariantSummary();

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.total).toBe(3);
    expect(result.data.userSelectable).toBe(1);
    expect(result.data.release1Required).toBe(1);
    expect(result.data.defaultEligible).toBe(0);
    expect(result.data.hidden).toBe(1);
    expect(result.data.deprecated).toBe(1);
    expect(result.data.missingComponentProtocol).toBe(2);
  });

  it("applies distribution filters to list query", async () => {
    process.env.DATABASE_URL = "postgresql://local/test";
    const db = createMockDb();
    db.styleVariant.findMany.mockResolvedValue([]);

    const query = new StyleLibraryAdminQuery(db as never);
    await query.listAdminVariants({
      blockType: "heading",
      lifecycle: "release1_required",
      release1Required: true,
      userSelectable: false,
      search: "chapter",
    });

    expect(db.styleVariant.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          blockType: "heading",
          lifecycle: "release1_required",
          distribution: {
            release1Required: true,
            userSelectable: false,
          },
          OR: expect.arrayContaining([
            expect.objectContaining({ runtimeVariantId: expect.any(Object) }),
          ]),
        }),
      }),
    );
  });

  it("applies defaultEligible and hidden filters independently", async () => {
    process.env.DATABASE_URL = "postgresql://local/test";
    const db = createMockDb();
    db.styleVariant.findMany.mockResolvedValue([]);

    const query = new StyleLibraryAdminQuery(db as never);
    await query.listAdminVariants({
      defaultEligible: false,
      hidden: true,
      deprecated: true,
    });

    expect(db.styleVariant.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          distribution: {
            defaultEligible: false,
            hidden: true,
            deprecated: true,
          },
        }),
      }),
    );
  });

  it("returns db_unavailable on query failure without exposing details", async () => {
    process.env.DATABASE_URL = "postgresql://local/test";
    const db = createMockDb();
    db.styleVariant.findMany.mockRejectedValue(new Error("connection refused host=secret"));

    const query = new StyleLibraryAdminQuery(db as never);
    const result = await query.listAdminVariants();

    expect(result).toEqual({ ok: false, error: "db_unavailable" });
  });
});
