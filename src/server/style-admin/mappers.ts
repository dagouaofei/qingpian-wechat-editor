import type {
  BlockType,
  Prisma,
  StyleVariantDistribution,
  StyleVariantLifecycle,
} from "@prisma/client";

import type { DistributionSnapshot } from "./types";

export type UserSelectablePoolCandidate = {
  lifecycle: StyleVariantLifecycle;
  distribution: Pick<
    StyleVariantDistribution,
    "userSelectable" | "hidden" | "deprecated" | "defaultEligible" | "release1Required"
  >;
};

/**
 * User-selectable pool membership is driven only by distribution.userSelectable
 * and exclusion flags — not by defaultEligible or release1Required.
 */
export function isEligibleForUserSelectablePool(
  candidate: UserSelectablePoolCandidate,
): boolean {
  const { lifecycle, distribution } = candidate;

  if (!distribution.userSelectable) {
    return false;
  }
  if (distribution.hidden) {
    return false;
  }
  if (distribution.deprecated) {
    return false;
  }
  if (lifecycle === "deprecated") {
    return false;
  }
  return true;
}

export function buildUserSelectablePoolWhere(
  filter?: { blockType?: BlockType; styleFamily?: string },
): Prisma.StyleVariantWhereInput {
  return {
    lifecycle: { not: "deprecated" },
    distribution: {
      userSelectable: true,
      hidden: false,
      deprecated: false,
    },
    ...(filter?.blockType ? { blockType: filter.blockType } : {}),
    ...(filter?.styleFamily ? { styleFamily: filter.styleFamily } : {}),
  };
}

export function toDistributionSnapshot(
  distribution: StyleVariantDistribution,
): DistributionSnapshot {
  return {
    userSelectable: distribution.userSelectable,
    defaultEligible: distribution.defaultEligible,
    release1Required: distribution.release1Required,
    hidden: distribution.hidden,
    deprecated: distribution.deprecated,
    cacheVersion: distribution.cacheVersion,
  };
}

export function defaultDistributionForLifecycle(
  lifecycle: StyleVariantLifecycle,
): DistributionSnapshot {
  const base: DistributionSnapshot = {
    userSelectable: false,
    defaultEligible: false,
    release1Required: false,
    hidden: false,
    deprecated: false,
    cacheVersion: 0,
  };

  switch (lifecycle) {
    case "user_selectable":
      return { ...base, userSelectable: true };
    case "default_eligible":
      return {
        ...base,
        userSelectable: true,
        defaultEligible: true,
      };
    case "release1_required":
      return {
        ...base,
        release1Required: true,
      };
    case "deprecated":
      return {
        ...base,
        hidden: true,
        deprecated: true,
      };
    default:
      return base;
  }
}
