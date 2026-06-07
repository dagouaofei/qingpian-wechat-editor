import type { VariantDefinition } from "@/core/styles/types";

import {
  getCodeBackedRuntimeAvailableVariantIds,
  resolveRuntimeVariantSeedOverride,
  type RuntimeVariantQualityStatus,
} from "./runtime-variant-seed-config";

export const BLOCKING_QUALITY_STATUSES: readonly RuntimeVariantQualityStatus[] = [
  "copy_fidelity_failed",
  "validator_failed",
  "blocked",
];

export type RuntimeVariantAvailabilityInput = {
  runtimeVariantId: string;
  distribution: {
    userSelectable: boolean;
    hidden: boolean;
    deprecated: boolean;
    defaultEligible?: boolean;
    release1Required?: boolean;
  } | null;
  currentVersion: {
    qualityStatus: RuntimeVariantQualityStatus;
  } | null;
};

export type RuntimeVariantAvailabilityResult = {
  available: boolean;
  reasons: string[];
};

export function isBlockingQualityStatus(
  qualityStatus: RuntimeVariantQualityStatus | null | undefined,
): boolean {
  if (!qualityStatus) {
    return false;
  }
  return (BLOCKING_QUALITY_STATUSES as readonly string[]).includes(qualityStatus);
}

export function evaluateRuntimeVariantAvailability(
  input: RuntimeVariantAvailabilityInput,
): RuntimeVariantAvailabilityResult {
  const reasons: string[] = [];

  if (!input.distribution) {
    reasons.push("missing_distribution");
  } else {
    if (!input.distribution.userSelectable) {
      reasons.push("userSelectable_false");
    }
    if (input.distribution.hidden) {
      reasons.push("hidden");
    }
    if (input.distribution.deprecated) {
      reasons.push("deprecated");
    }
  }

  if (!input.currentVersion) {
    reasons.push("missing_current_version");
  } else if (isBlockingQualityStatus(input.currentVersion.qualityStatus)) {
    reasons.push(`quality_status:${input.currentVersion.qualityStatus}`);
  }

  return {
    available: reasons.length === 0,
    reasons,
  };
}

export function isRuntimeVariantAvailable(
  input: RuntimeVariantAvailabilityInput,
): boolean {
  return evaluateRuntimeVariantAvailability(input).available;
}

export function resolveCodeBackedAvailabilityInput(
  runtimeVariantId: string,
): RuntimeVariantAvailabilityInput {
  const seed = resolveRuntimeVariantSeedOverride(runtimeVariantId);
  if (seed) {
    return {
      runtimeVariantId,
      distribution: seed.distribution,
      currentVersion: { qualityStatus: seed.qualityStatus },
    };
  }

  return {
    runtimeVariantId,
    distribution: {
      userSelectable: false,
      defaultEligible: false,
      release1Required: false,
      hidden: false,
      deprecated: false,
    },
    currentVersion: { qualityStatus: "not_checked" },
  };
}

export function isCodeBackedRuntimeVariantAvailable(runtimeVariantId: string): boolean {
  return isRuntimeVariantAvailable(resolveCodeBackedAvailabilityInput(runtimeVariantId));
}

export function isVariantDefinitionRuntimeAvailable(
  variant: VariantDefinition | undefined,
  runtimeAvailableIds?: ReadonlySet<string>,
): variant is VariantDefinition {
  if (!variant) {
    return false;
  }
  if (variant.compatibility?.copySafety === "preview_only") {
    return false;
  }

  if (runtimeAvailableIds) {
    return runtimeAvailableIds.has(variant.id);
  }

  return getCodeBackedRuntimeAvailableVariantIds().has(variant.id);
}

export function resolveRuntimeAvailableVariantId(
  requestedVariantId: string | undefined,
  availableVariantIds: readonly string[],
  fallbackVariantId?: string,
): {
  variantId: string | undefined;
  issue?: string;
} {
  if (!requestedVariantId) {
    return { variantId: fallbackVariantId };
  }

  if (availableVariantIds.includes(requestedVariantId)) {
    return { variantId: requestedVariantId };
  }

  const fallback =
    fallbackVariantId && availableVariantIds.includes(fallbackVariantId)
      ? fallbackVariantId
      : availableVariantIds[0];

  return {
    variantId: fallback,
    issue: `variant_not_runtime_available:${requestedVariantId}`,
  };
}
