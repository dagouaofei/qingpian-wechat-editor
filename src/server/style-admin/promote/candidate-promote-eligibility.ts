import type {
  StyleVariantDistribution,
  StyleVariantLifecycle,
  StyleVariantQualityStatus,
  StyleVariantSourceType,
} from "@prisma/client";

import { isRuntimeVariantAvailable } from "@/lib/runtime-variant-availability";

export const PROMOTABLE_SOURCE_TYPES: readonly StyleVariantSourceType[] = [
  "html_paste",
  "harvest",
  "manual",
  "ai_generated",
];

export type CandidatePromoteEligibilityInput = {
  lifecycle: StyleVariantLifecycle;
  sourceType: StyleVariantSourceType | null;
  qualityStatus: StyleVariantQualityStatus | null;
  distribution: Pick<
    StyleVariantDistribution,
    "userSelectable" | "hidden" | "deprecated" | "defaultEligible" | "release1Required"
  > | null;
  hasCurrentVersion: boolean;
};

export type CandidatePromoteEligibilityResult = {
  eligible: boolean;
  blockedReasons: string[];
};

export type CandidatePromoteEligibilityOptions = {
  includeRuntimeReadiness?: boolean;
  runtimeBlockedReasons?: string[];
};

function hasPromotableOrigin(input: CandidatePromoteEligibilityInput): boolean {
  if (input.lifecycle === "candidate") {
    return true;
  }
  if (input.sourceType && PROMOTABLE_SOURCE_TYPES.includes(input.sourceType)) {
    return true;
  }
  return false;
}

export function evaluateCandidatePromoteEligibility(
  input: CandidatePromoteEligibilityInput,
  options: CandidatePromoteEligibilityOptions = {},
): CandidatePromoteEligibilityResult {
  const blockedReasons: string[] = [];

  if (!input.hasCurrentVersion) {
    blockedReasons.push("Not eligible: current version is missing.");
  }

  if (!input.distribution) {
    blockedReasons.push("Not eligible: distribution record is missing.");
  } else {
    if (input.distribution.userSelectable) {
      blockedReasons.push("Not eligible: variant is already user-selectable.");
    }
    if (input.distribution.hidden) {
      blockedReasons.push("Not eligible: variant is hidden.");
    }
    if (input.distribution.deprecated) {
      blockedReasons.push("Not eligible: variant is deprecated.");
    }
  }

  if (!hasPromotableOrigin(input)) {
    blockedReasons.push(
      "Not eligible: lifecycle must be candidate or sourceType must be html_paste / harvest / manual / ai_generated.",
    );
  }

  if (!input.qualityStatus) {
    blockedReasons.push("Not eligible: qualityStatus is missing.");
  } else if (input.qualityStatus !== "paste_qa_pass") {
    if (input.qualityStatus === "validator_pass") {
      blockedReasons.push("Not eligible: Paste QA pass is required.");
    } else {
      blockedReasons.push(`Not eligible: qualityStatus=${input.qualityStatus}.`);
    }
  }

  if (options.runtimeBlockedReasons?.length) {
    blockedReasons.push(...options.runtimeBlockedReasons);
  }

  const uniqueReasons = [...new Set(blockedReasons)];

  return {
    eligible: uniqueReasons.length === 0,
    blockedReasons: uniqueReasons,
  };
}

export function isCandidatePromotePanelVisible(input: {
  lifecycle: StyleVariantLifecycle;
  sourceType: StyleVariantSourceType | null;
  userSelectable: boolean;
}): boolean {
  if (input.userSelectable) {
    return true;
  }
  if (input.lifecycle === "candidate") {
    return true;
  }
  if (input.sourceType && PROMOTABLE_SOURCE_TYPES.includes(input.sourceType)) {
    return true;
  }
  return false;
}

export function wouldBeRuntimeAvailableAfterPromote(input: {
  runtimeVariantId: string;
  qualityStatus: StyleVariantQualityStatus;
}): boolean {
  return isRuntimeVariantAvailable({
    runtimeVariantId: input.runtimeVariantId,
    distribution: {
      userSelectable: true,
      hidden: false,
      deprecated: false,
      defaultEligible: false,
      release1Required: false,
    },
    currentVersion: { qualityStatus: input.qualityStatus },
  });
}
