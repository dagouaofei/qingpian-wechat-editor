import { describe, expect, it } from "vitest";

import {
  ADMIN_FILTER_OPTIONS,
  ADMIN_FILTER_PRESETS,
  buildAdminListHref,
  isAdminFilterPresetActive,
  parseAdminVariantListFilter,
} from "@/app/admin/(protected)/style-library/style-library-admin-filters";

describe("parseAdminVariantListFilter", () => {
  it("parses blockType, lifecycle, and boolean distribution filters", () => {
    const filter = parseAdminVariantListFilter({
      blockType: "heading",
      lifecycle: "release1_required",
      userSelectable: "true",
      release1Required: "true",
      deprecated: "false",
      q: "teal",
    });

    expect(filter).toEqual({
      blockType: "heading",
      lifecycle: "release1_required",
      userSelectable: true,
      release1Required: true,
      defaultEligible: undefined,
      deprecated: false,
      hidden: undefined,
      search: "teal",
    });
  });

  it("parses defaultEligible and hidden true/false", () => {
    expect(
      parseAdminVariantListFilter({
        defaultEligible: "true",
        hidden: "false",
      }),
    ).toEqual({
      blockType: undefined,
      lifecycle: undefined,
      userSelectable: undefined,
      release1Required: undefined,
      defaultEligible: true,
      deprecated: undefined,
      hidden: false,
      search: undefined,
    });

    expect(
      parseAdminVariantListFilter({
        defaultEligible: "false",
        hidden: "true",
      }),
    ).toMatchObject({
      defaultEligible: false,
      hidden: true,
    });
  });

  it("builds list href with query string", () => {
    expect(
      buildAdminListHref({
        lifecycle: "release1_required",
        userSelectable: true,
      }),
    ).toBe("/admin/style-library?lifecycle=release1_required&userSelectable=true");

    expect(buildAdminListHref({ defaultEligible: false })).toBe(
      "/admin/style-library?defaultEligible=false",
    );
    expect(buildAdminListHref({ hidden: true })).toBe(
      "/admin/style-library?hidden=true",
    );
  });
});

describe("ADMIN_FILTER_PRESETS", () => {
  it("admin lifecycle filter dropdown excludes legacy user_selectable", () => {
    expect(ADMIN_FILTER_OPTIONS.lifecycles).not.toContain("user_selectable");
    expect(ADMIN_FILTER_OPTIONS.lifecycles).toContain("paste_qa_pass");
  });

  it("includes defaultEligible and hidden presets", () => {
    const ids = ADMIN_FILTER_PRESETS.map((preset) => preset.id);
    expect(ids).toContain("default-eligible-true");
    expect(ids).toContain("default-eligible-false");
    expect(ids).toContain("hidden-true");
    expect(ids).toContain("hidden-false");
    expect(ids).toContain("user-selectable-true");
    expect(ids).toContain("release1-required-true");
    expect(ids).toContain("deprecated-true");
  });

  it("keeps distribution presets independent in hrefs", () => {
    const userSelectable = ADMIN_FILTER_PRESETS.find(
      (preset) => preset.id === "user-selectable-true",
    );
    const release1Required = ADMIN_FILTER_PRESETS.find(
      (preset) => preset.id === "release1-required-true",
    );
    const defaultEligible = ADMIN_FILTER_PRESETS.find(
      (preset) => preset.id === "default-eligible-true",
    );

    expect(userSelectable?.href).toBe("/admin/style-library?userSelectable=true");
    expect(release1Required?.href).toBe("/admin/style-library?release1Required=true");
    expect(defaultEligible?.href).toBe("/admin/style-library?defaultEligible=true");
    expect(userSelectable?.href).not.toContain("defaultEligible");
    expect(release1Required?.href).not.toContain("userSelectable");
  });

  it("detects active preset from current filters", () => {
    const current = parseAdminVariantListFilter({ hidden: "true" });
    const hiddenPreset = ADMIN_FILTER_PRESETS.find((preset) => preset.id === "hidden-true")!;

    expect(isAdminFilterPresetActive(current, hiddenPreset.filter)).toBe(true);
    expect(
      isAdminFilterPresetActive(current, { defaultEligible: true }),
    ).toBe(false);
  });
});
