import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { evaluateUserSelectablePoolMembership } from "@/lib/user-selectable-pool-eligibility";
import { buildUserSelectablePoolWhere } from "@/server/style-admin/mappers";
import { ADMIN_FILTER_OPTIONS } from "@/app/admin/(protected)/style-library/style-library-admin-filters";

const repoRoot = join(__dirname, "../..");

function readSrc(relativePath: string): string {
  return readFileSync(join(repoRoot, relativePath), "utf8");
}

describe("legacy path guards (Gate B LP-001～007, LP-009, LP-010)", () => {
  it("LP-001: preview user pool resolver does not fall back to static PREVIEW_HEADING_STYLE_OPTIONS", () => {
    const source = readSrc("src/lib/preview-user-selectable-pool.ts");
    expect(source).not.toMatch(/return PREVIEW_HEADING_STYLE_OPTIONS/);
    expect(source).not.toContain("PREVIEW_HEADING_STYLE_OPTIONS");
  });

  it("LP-002: preview heading style module does not import manifest preview fixtures", () => {
    const source = readSrc("src/lib/preview-heading-style.ts");
    expect(source).not.toContain("user-selectable-preview-pool");
    expect(source).not.toContain("style-library-manifest-preview-fixtures");
  });

  it("LP-002: user preview registry does not merge manifest user_selectable variants by default", () => {
    const source = readSrc("src/lib/user-preview-style-registry.ts");
    expect(source).not.toContain("getUserSelectablePreviewVariantAssets");
    expect(source).not.toContain("getCodeBackedUserSelectableVariants");
  });

  it("LP-003: degraded user pool uses db_unavailable source label", () => {
    const source = readSrc("src/server/style-admin/runtime/user-selectable-variant-pool.ts");
    expect(source).toContain('source: "db_unavailable"');
    expect(source).not.toMatch(/buildDegradedEmptyPool[\s\S]*source: "code_fallback"/);
  });

  it("LP-004: code fallback DSL runtime does not inject html-paste manifest variant", () => {
    const source = readSrc("src/lib/dsl-runtime/build-code-fallback-dsl-runtime.ts");
    expect(source).not.toContain("getUserSelectablePreviewVariantDefinition");
    expect(source).not.toContain("heading_teal_section_label_html_paste_candidate");
  });

  it("LP-005: preview client resolves heading ids from pool snapshot only", () => {
    const source = readSrc("src/lib/render-article-preview-client.ts");
    expect(source).not.toContain("getCodeBackedRuntimeAvailableVariantIds");
    expect(source).toMatch(/poolVariantIds/);
  });

  it("LP-006: manifest fixtures filter by distribution only (no lifecycle user_selectable gate)", () => {
    const source = readSrc("src/core/style-library/style-library-manifest-preview-fixtures.ts");
    expect(source).not.toContain('lifecycle === "user_selectable"');
    expect(source).toContain("distribution.userSelectable");
  });

  it("LP-007: admin lifecycle filter dropdown excludes legacy user_selectable", () => {
    expect(ADMIN_FILTER_OPTIONS.lifecycles).not.toContain("user_selectable");
  });

  it("LP-009: mappers delegate pool eligibility to shared membership module", () => {
    const source = readSrc("src/server/style-admin/mappers.ts");
    expect(source).toContain("isUserSelectablePoolMember");
    expect(source).toMatch(
      /export function isEligibleForUserSelectablePool[\s\S]*?return isUserSelectablePoolMember/,
    );
  });

  it("LP-009: lifecycle alone does not grant user pool membership", () => {
    const trace = evaluateUserSelectablePoolMembership({
      runtimeVariantId: "heading_test",
      blockType: "heading",
      lifecycle: "user_selectable",
      distribution: {
        userSelectable: false,
        hidden: false,
        deprecated: false,
      },
      currentVersion: { qualityStatus: "paste_qa_pass" },
    });
    expect(trace.eligible).toBe(false);
    expect(trace.exclusionReasons).toContain("distribution.userSelectable_false");
  });

  it("LP-010: server user pool loader has no dead manifest import", () => {
    const source = readSrc("src/server/style-admin/runtime/user-selectable-variant-pool.ts");
    expect(source).not.toContain("getUserSelectablePreviewVariantDefinition");
  });

  it("admin filter distribution preset aligns with buildUserSelectablePoolWhere userSelectable flag", () => {
    const where = buildUserSelectablePoolWhere();
    expect(where.distribution).toMatchObject({ userSelectable: true });
    expect(ADMIN_FILTER_OPTIONS.lifecycles).toContain("paste_qa_pass");
  });
});
