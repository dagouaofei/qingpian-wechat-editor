import { describe, expect, it } from "vitest";

import {
  buildUserSelectablePoolWhere,
  defaultDistributionForLifecycle,
  isEligibleForUserSelectablePool,
} from "@/server/style-admin/mappers";

describe("style-admin mappers", () => {
  it("treats userSelectable as independent from defaultEligible", () => {
    expect(
      isEligibleForUserSelectablePool({
        lifecycle: "user_selectable",
        distribution: {
          userSelectable: true,
          defaultEligible: false,
          release1Required: false,
          hidden: false,
          deprecated: false,
        },
      }),
    ).toBe(true);

    expect(
      isEligibleForUserSelectablePool({
        lifecycle: "default_eligible",
        distribution: {
          userSelectable: false,
          defaultEligible: true,
          release1Required: true,
          hidden: false,
          deprecated: false,
        },
      }),
    ).toBe(false);
  });

  it("excludes release1Required-only rows from user-selectable pool", () => {
    expect(
      isEligibleForUserSelectablePool({
        lifecycle: "default_eligible",
        distribution: {
          userSelectable: false,
          defaultEligible: false,
          release1Required: true,
          hidden: false,
          deprecated: false,
        },
      }),
    ).toBe(false);
  });

  it("excludes hidden and deprecated distribution flags", () => {
    expect(
      isEligibleForUserSelectablePool({
        lifecycle: "user_selectable",
        distribution: {
          userSelectable: true,
          defaultEligible: false,
          release1Required: false,
          hidden: true,
          deprecated: false,
        },
      }),
    ).toBe(false);

    expect(
      isEligibleForUserSelectablePool({
        lifecycle: "user_selectable",
        distribution: {
          userSelectable: true,
          defaultEligible: false,
          release1Required: false,
          hidden: false,
          deprecated: true,
        },
      }),
    ).toBe(false);
  });

  it("excludes deprecated lifecycle", () => {
    expect(
      isEligibleForUserSelectablePool({
        lifecycle: "deprecated",
        distribution: {
          userSelectable: true,
          defaultEligible: false,
          release1Required: false,
          hidden: false,
          deprecated: false,
        },
      }),
    ).toBe(false);
  });

  it("builds user-selectable pool query without defaultEligible or release1Required", () => {
    expect(buildUserSelectablePoolWhere({ blockType: "heading" })).toEqual({
      lifecycle: { not: "deprecated" },
      distribution: {
        userSelectable: true,
        hidden: false,
        deprecated: false,
      },
      blockType: "heading",
    });
  });

  it("maps lifecycle defaults without auto defaultEligible on user_selectable", () => {
    const distribution = defaultDistributionForLifecycle("user_selectable");
    expect(distribution.userSelectable).toBe(true);
    expect(distribution.defaultEligible).toBe(false);
    expect(distribution.release1Required).toBe(false);
  });
});
