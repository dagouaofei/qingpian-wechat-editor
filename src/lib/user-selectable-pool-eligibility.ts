import type { BlockType } from "@/core/blocks";

import { isBlockingQualityStatus } from "@/lib/runtime-variant-availability";
import type { RuntimeVariantQualityStatus } from "@/lib/runtime-variant-seed-config";

export type UserSelectablePoolMembershipInput = {
  runtimeVariantId: string;
  blockType: BlockType | string;
  lifecycle: string;
  distribution: {
    userSelectable: boolean;
    hidden: boolean;
    deprecated: boolean;
  } | null;
  currentVersion: {
    qualityStatus: RuntimeVariantQualityStatus | string;
  } | null;
  definitionJson?: unknown;
  /** When loading heading picker pool, non-heading rows are excluded. */
  requiredBlockType?: BlockType;
};

export type UserSelectablePoolMembershipTrace = {
  runtimeVariantId: string;
  blockType: string;
  lifecycle: string;
  distribution: {
    userSelectable: boolean;
    hidden: boolean;
    deprecated: boolean;
  } | null;
  qualityStatus: string | null;
  passesSqlQuery: boolean;
  passesDistributionGate: boolean;
  passesQualityGate: boolean;
  passesLifecycleGate: boolean;
  passesDefinitionGate: boolean;
  eligible: boolean;
  exclusionReasons: string[];
  inMappedPool: boolean;
  inPreviewPicker: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * User-side pool membership — **distribution.userSelectable** is the sole visibility authority.
 * lifecycle must not grant pool access (except lifecycle=deprecated exclusion).
 */
export function evaluateUserSelectablePoolMembership(
  input: UserSelectablePoolMembershipInput,
): UserSelectablePoolMembershipTrace {
  const exclusionReasons: string[] = [];
  const qualityStatus = input.currentVersion?.qualityStatus ?? null;

  const passesBlockTypeGate =
    input.requiredBlockType == null || input.blockType === input.requiredBlockType;
  if (!passesBlockTypeGate) {
    exclusionReasons.push(`block_type_mismatch:${input.blockType}`);
  }

  const passesDistributionGate = Boolean(
    input.distribution?.userSelectable === true &&
      input.distribution.hidden !== true &&
      input.distribution.deprecated !== true,
  );
  if (!input.distribution) {
    exclusionReasons.push("missing_distribution");
  } else {
    if (!input.distribution.userSelectable) {
      exclusionReasons.push("distribution.userSelectable_false");
    }
    if (input.distribution.hidden) {
      exclusionReasons.push("distribution.hidden");
    }
    if (input.distribution.deprecated) {
      exclusionReasons.push("distribution.deprecated");
    }
  }

  const passesQualityGate =
    input.currentVersion != null &&
    !isBlockingQualityStatus(qualityStatus as RuntimeVariantQualityStatus | null | undefined);
  if (!input.currentVersion) {
    exclusionReasons.push("missing_current_version");
  } else if (isBlockingQualityStatus(qualityStatus as RuntimeVariantQualityStatus | null | undefined)) {
    exclusionReasons.push(`quality_status:${qualityStatus}`);
  }

  const passesLifecycleGate = input.lifecycle !== "deprecated";
  if (!passesLifecycleGate) {
    exclusionReasons.push("lifecycle_deprecated");
  }

  const passesDefinitionGate =
    input.currentVersion != null &&
    (input.definitionJson == null || isRecord(input.definitionJson));
  if (input.currentVersion && input.definitionJson != null && !isRecord(input.definitionJson)) {
    exclusionReasons.push("invalid_definition_json");
  }

  const passesSqlQuery =
    passesBlockTypeGate &&
    passesDistributionGate &&
    passesQualityGate &&
    passesLifecycleGate;

  const eligible =
    passesSqlQuery && passesDefinitionGate;

  return {
    runtimeVariantId: input.runtimeVariantId,
    blockType: String(input.blockType),
    lifecycle: input.lifecycle,
    distribution: input.distribution
      ? {
          userSelectable: input.distribution.userSelectable,
          hidden: input.distribution.hidden,
          deprecated: input.distribution.deprecated,
        }
      : null,
    qualityStatus,
    passesSqlQuery,
    passesDistributionGate,
    passesQualityGate,
    passesLifecycleGate,
    passesDefinitionGate,
    eligible,
    exclusionReasons: [...new Set(exclusionReasons)],
    inMappedPool: eligible,
    inPreviewPicker: eligible,
  };
}

export function isUserSelectablePoolMember(
  input: UserSelectablePoolMembershipInput,
): boolean {
  return evaluateUserSelectablePoolMembership(input).eligible;
}
