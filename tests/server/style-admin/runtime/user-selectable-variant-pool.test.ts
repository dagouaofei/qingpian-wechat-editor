import { afterEach, describe, expect, it, vi } from "vitest";

import { clearUserSelectablePoolCache } from "@/server/style-admin/runtime/user-selectable-variant-pool-cache";
import { getUserSelectableVariantPool } from "@/server/style-admin/runtime/user-selectable-variant-pool";

const originalDatabaseUrl = process.env.DATABASE_URL;

afterEach(() => {
  clearUserSelectablePoolCache();
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
  vi.restoreAllMocks();
});

function createMockDb(rows: unknown[]) {
  return {
    styleVariant: {
      findMany: vi.fn().mockResolvedValue(rows),
    },
  };
}

describe("getUserSelectableVariantPool", () => {
  it("returns degraded empty pool when DATABASE_URL is missing", async () => {
    delete process.env.DATABASE_URL;
    const pool = await getUserSelectableVariantPool({ blockType: "heading" }, createMockDb([]) as never);
    expect(pool.source).toBe("db_unavailable");
    expect(pool.variants).toHaveLength(0);
    expect(pool.notice).toContain("degraded");
  });

  it("returns database variants for eligible rows only", async () => {
    process.env.DATABASE_URL = "postgresql://local/test";
    const db = createMockDb([
      {
        runtimeVariantId: "heading_teal_section_label_html_paste_candidate",
        blockType: "heading",
        styleFamily: "htmlPasteCandidate",
        label: "Teal",
        lifecycle: "user_selectable",
        distribution: {
          userSelectable: true,
          defaultEligible: false,
          release1Required: false,
          hidden: false,
          deprecated: false,
        },
        currentVersion: {
          definitionJson: {
            id: "heading_teal_section_label_html_paste_candidate",
            schemaVersion: 1,
            blockType: "heading",
            family: "htmlPasteCandidate",
            name: "teal",
            label: "Teal",
            status: "experimental",
          },
          componentProtocolJson: {
            componentId: "titleBlock",
            familyId: "htmlPasteCandidate",
            layoutMode: "pill",
          },
          compatibilityJson: { copySafety: "strict" },
          copySafety: "strict",
        },
      },
      {
        runtimeVariantId: "heading_short_line",
        blockType: "heading",
        styleFamily: "editorial",
        label: "Short",
        lifecycle: "release1_required",
        distribution: {
          userSelectable: false,
          defaultEligible: false,
          release1Required: true,
          hidden: false,
          deprecated: false,
        },
        currentVersion: {
          definitionJson: { id: "heading_short_line", blockType: "heading" },
          copySafety: "strict",
        },
      },
    ]);

    const pool = await getUserSelectableVariantPool(
      { blockType: "heading", forceRefresh: true },
      db as never,
    );

    expect(pool.source).toBe("database");
    expect(pool.variants).toHaveLength(1);
    expect(pool.variants[0]?.id).toBe("heading_teal_section_label_html_paste_candidate");
    expect(pool.issues.some((issue) => issue.runtimeVariantId === "heading_short_line")).toBe(
      true,
    );
  });

  it("uses cache on second call unless forceRefresh", async () => {
    process.env.DATABASE_URL = "postgresql://local/test";
    const db = createMockDb([]);

    await getUserSelectableVariantPool({ blockType: "heading", forceRefresh: true }, db as never);
    await getUserSelectableVariantPool({ blockType: "heading" }, db as never);

    expect(db.styleVariant.findMany).toHaveBeenCalledTimes(1);
  });

  it("forceRefresh bypasses cache", async () => {
    process.env.DATABASE_URL = "postgresql://local/test";
    const db = createMockDb([]);

    await getUserSelectableVariantPool({ blockType: "heading", forceRefresh: true }, db as never);
    await getUserSelectableVariantPool({ blockType: "heading", forceRefresh: true }, db as never);

    expect(db.styleVariant.findMany).toHaveBeenCalledTimes(2);
  });
});
