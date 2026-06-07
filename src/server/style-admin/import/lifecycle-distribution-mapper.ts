import type {
  CopySafetyTier,
  StyleVariantLifecycle,
} from "@prisma/client";

import type { StyleLibraryVariantAsset } from "@/core/style-library/types";
import type { CopySafety, VariantDefinition, VariantStatus } from "@/core/styles/types";

import type { DistributionSnapshot } from "../types";

export const DEPRECATED_HEADING_RUNTIME_VARIANT_IDS = [
  "heading_plain_minimal",
  "heading_underline_classic",
  "heading_pill_topic",
  "heading_editorial_plain",
  "heading_keynote_strong",
] as const;

export const HISTORICAL_FIRST_WAVE_33_HEADING_IDS = [
  "heading_short_line",
  "heading_numbered_section",
  "heading_card_centered",
] as const;

export function mapCopySafetyTier(copySafety: CopySafety | undefined): CopySafetyTier {
  switch (copySafety) {
    case "balanced":
      return "balanced";
    case "preview_only":
      return "experimental";
    case "strict":
    default:
      return "strict";
  }
}

export function mapVariantStatusToLifecycle(
  status: VariantStatus,
): StyleVariantLifecycle {
  switch (status) {
    case "release1_required":
      return "release1_required";
    case "release1_candidate":
      return "candidate";
    case "experimental":
    default:
      return "candidate";
  }
}

export function mapRegistryStatusToDistribution(
  status: VariantStatus,
): DistributionSnapshot {
  const base: DistributionSnapshot = {
    userSelectable: false,
    defaultEligible: false,
    release1Required: false,
    hidden: false,
    deprecated: false,
    cacheVersion: 0,
  };

  if (status === "release1_required") {
    return {
      ...base,
      release1Required: true,
    };
  }

  return base;
}

export function mapStyleLibraryAssetToLifecycle(
  asset: StyleLibraryVariantAsset,
): StyleVariantLifecycle {
  return asset.lifecycle;
}

export function mapStyleLibraryAssetToDistribution(
  asset: StyleLibraryVariantAsset,
): DistributionSnapshot {
  const deprecated = asset.lifecycle === "deprecated";
  return {
    userSelectable: asset.distribution.userSelectable,
    defaultEligible: asset.distribution.defaultEligible,
    release1Required: asset.distribution.release1Required,
    hidden: deprecated,
    deprecated,
    cacheVersion: 0,
  };
}

export function mergeDistribution(
  base: DistributionSnapshot,
  overlay?: Partial<DistributionSnapshot>,
): DistributionSnapshot {
  if (!overlay) {
    return base;
  }
  return {
    userSelectable: overlay.userSelectable ?? base.userSelectable,
    defaultEligible: overlay.defaultEligible ?? base.defaultEligible,
    release1Required: overlay.release1Required ?? base.release1Required,
    hidden: overlay.hidden ?? base.hidden,
    deprecated: overlay.deprecated ?? base.deprecated,
    cacheVersion: overlay.cacheVersion ?? base.cacheVersion,
  };
}

export function mapDeprecatedHeadingLifecycle(): StyleVariantLifecycle {
  return "deprecated";
}

export function mapDeprecatedHeadingDistribution(): DistributionSnapshot {
  return {
    userSelectable: false,
    defaultEligible: false,
    release1Required: false,
    hidden: true,
    deprecated: true,
    cacheVersion: 0,
  };
}
