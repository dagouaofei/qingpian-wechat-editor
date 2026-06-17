import {
  StyleVariantQualityStatus,
  type StyleVariantQualityStatus as StyleVariantQualityStatusType,
} from "@prisma/client";

/** Canonical qualityStatus values — derived from Prisma StyleVariantQualityStatus enum. */
export const STYLE_VARIANT_QUALITY_STATUSES = Object.values(
  StyleVariantQualityStatus,
) as StyleVariantQualityStatusType[];

export const STYLE_VARIANT_QUALITY_STATUS_SET = new Set<string>(
  STYLE_VARIANT_QUALITY_STATUSES,
);

export type { StyleVariantQualityStatusType as StyleVariantQualityStatus };

export function isStyleVariantQualityStatus(
  value: unknown,
): value is StyleVariantQualityStatusType {
  return typeof value === "string" && STYLE_VARIANT_QUALITY_STATUS_SET.has(value);
}

export function assertGovernanceSnapshotQualityStatus(
  value: unknown,
  runtimeVariantId: string,
): StyleVariantQualityStatusType {
  if (isStyleVariantQualityStatus(value)) {
    return value;
  }

  throw new Error(
    `Governance snapshot invalid qualityStatus for ${runtimeVariantId}: ${String(value)}`,
  );
}
