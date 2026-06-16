import { describe, expect, it } from "vitest";

import { importExistingStyleVariants } from "@/server/style-admin/import/import-existing-style-variants";
import { HTML_PASTE_TEAL_SECTION_LABEL_ASSET } from "@/core/style-library/assets/html-paste-variant-assets";
import {
  mapStyleLibraryAssetToLifecycle,
  normalizeImportLifecycle,
} from "@/server/style-admin/import/lifecycle-distribution-mapper";
import type { StyleAdminPrismaClient } from "@/server/style-admin/prisma";

describe("normalizeImportLifecycle", () => {
  it("maps legacy user_selectable to paste_qa_pass", () => {
    expect(normalizeImportLifecycle("user_selectable")).toBe("paste_qa_pass");
    expect(normalizeImportLifecycle("paste_qa_pass")).toBe("paste_qa_pass");
    expect(normalizeImportLifecycle("release1_required")).toBe("release1_required");
  });

  it("normalizes manifest asset lifecycle at mapper boundary", () => {
    expect(mapStyleLibraryAssetToLifecycle(HTML_PASTE_TEAL_SECTION_LABEL_ASSET)).toBe(
      "paste_qa_pass",
    );
  });
});

describe("importExistingStyleVariants lifecycle contract", () => {
  it("dry-run reports zero legacy lifecycle user_selectable rows", async () => {
    const result = await importExistingStyleVariants({} as StyleAdminPrismaClient, {
      dryRun: true,
    });

    expect(result.report.byLifecycle.user_selectable ?? 0).toBe(0);
    expect(result.summary).toContain("lifecycle_user_selectable=0");
  });
});
