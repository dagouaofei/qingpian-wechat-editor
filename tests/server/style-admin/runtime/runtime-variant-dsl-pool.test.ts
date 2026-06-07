import { afterEach, describe, expect, it, vi } from "vitest";

import { VARIANT_DSL_VERSION } from "@/core/dsl/runtime";
import { clearUserSelectablePoolCache } from "@/server/style-admin/runtime/user-selectable-variant-pool-cache";
import { invalidateRuntimeDslPoolCache } from "@/server/style-admin/runtime/runtime-variant-dsl-pool-cache";
import { getRuntimeVariantDslPool } from "@/server/style-admin/runtime/runtime-variant-dsl-pool";

const originalDatabaseUrl = process.env.DATABASE_URL;

afterEach(() => {
  clearUserSelectablePoolCache();
  invalidateRuntimeDslPoolCache();
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

describe("getRuntimeVariantDslPool", () => {
  it("returns code_fallback when DATABASE_URL is missing", async () => {
    delete process.env.DATABASE_URL;
    const pool = await getRuntimeVariantDslPool({}, createMockDb([]) as never);
    expect(pool.source).toBe("code_fallback");
    expect(Object.keys(pool.definitionJsonByVariantId).length).toBeGreaterThan(0);
  });

  it("includes release1_required variants in database runtime DSL pool", async () => {
    process.env.DATABASE_URL = "postgresql://local/test";
    const db = createMockDb([
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
          definitionJson: {
            version: VARIANT_DSL_VERSION,
            id: "heading_short_line",
            blockType: "heading",
            copySafety: "strict",
            renderContract: "title_block_v1",
          },
          componentProtocolJson: {
            componentId: "titleBlock",
            familyId: "editorial",
            layoutMode: "pill",
          },
          compatibilityJson: { copySafety: "strict" },
          copySafety: "strict",
          qualityStatus: "not_checked",
        },
      },
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
            version: VARIANT_DSL_VERSION,
            id: "heading_teal_section_label_html_paste_candidate",
            blockType: "heading",
            copySafety: "strict",
            renderContract: "title_block_v1",
            family: "htmlPasteCandidate",
          },
          copySafety: "strict",
          qualityStatus: "paste_qa_pass",
        },
      },
    ]);

    const pool = await getRuntimeVariantDslPool({ forceRefresh: true }, db as never);

    expect(pool.source).toBe("database");
    expect(pool.variantIds).toContain("heading_short_line");
    expect(pool.variantIds).toContain("heading_teal_section_label_html_paste_candidate");
    expect(pool.definitionJsonByVariantId.heading_short_line).toBeTruthy();
  });
});
