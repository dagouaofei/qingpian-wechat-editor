import type {
  BlockType,
  Prisma,
  StyleVariantDistribution,
  StyleVariantLifecycle,
  StyleVariantQualityStatus,
} from "@prisma/client";

import { BLOCKING_QUALITY_STATUSES } from "@/lib/runtime-variant-availability";
import { isUserSelectablePoolMember } from "@/lib/user-selectable-pool-eligibility";
import type { DistributionSnapshot } from "./types";

export type UserSelectablePoolCandidate = {
  runtimeVariantId?: string;
  blockType?: BlockType | string;
  lifecycle: StyleVariantLifecycle;
  distribution: Pick<
    StyleVariantDistribution,
    "userSelectable" | "hidden" | "deprecated" | "defaultEligible" | "release1Required"
  >;
  currentVersion?: { qualityStatus: StyleVariantQualityStatus | string } | null;
  definitionJson?: unknown;
};

/** Delegates to shared runtime pool membership — distribution.userSelectable is sole visibility authority. */
export function isEligibleForUserSelectablePool(
  candidate: UserSelectablePoolCandidate,
): boolean {
  return isUserSelectablePoolMember({
    runtimeVariantId: candidate.runtimeVariantId ?? "__pool_eligibility__",
    blockType: candidate.blockType ?? "heading",
    lifecycle: candidate.lifecycle,
    distribution: candidate.distribution,
    currentVersion: candidate.currentVersion ?? { qualityStatus: "paste_qa_pass" },
    definitionJson: candidate.definitionJson,
  });
}

/**
 * Runtime DSL pool — all non-hidden, non-deprecated variants with a current version.
 * Includes release1_required / release1 seed; excludes userSelectable-only filter.
 */
export function buildRuntimeVariantPoolWhere(
  filter?: { blockType?: BlockType; styleFamily?: string },
): Prisma.StyleVariantWhereInput {
  return {
    lifecycle: { not: "deprecated" },
    distribution: {
      hidden: false,
      deprecated: false,
    },
    currentVersion: {
      is: {
        qualityStatus: {
          notIn: [...BLOCKING_QUALITY_STATUSES] as StyleVariantQualityStatus[],
        },
      },
    },
    ...(filter?.blockType ? { blockType: filter.blockType } : {}),
    ...(filter?.styleFamily ? { styleFamily: filter.styleFamily } : {}),
  };
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
    currentVersion: {
      is: {
        qualityStatus: {
          notIn: [...BLOCKING_QUALITY_STATUSES] as StyleVariantQualityStatus[],
        },
      },
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
      // Deprecated lifecycle value — visibility is distribution.userSelectable only.
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
