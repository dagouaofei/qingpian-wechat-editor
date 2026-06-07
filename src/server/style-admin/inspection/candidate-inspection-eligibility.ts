import type { StyleVariantQualityStatus, StyleVariantSourceType } from "@prisma/client";

const INSPECTION_QUALITY_STATUSES: readonly StyleVariantQualityStatus[] = [
  "not_checked",
  "validator_failed",
  "copy_fidelity_failed",
];

export function isCandidateInspectionEligible(input: {
  lifecycle: string;
  sourceType: StyleVariantSourceType | null;
  qualityStatus: StyleVariantQualityStatus;
}): boolean {
  if (input.lifecycle === "candidate") {
    return true;
  }
  if (input.sourceType === "html_paste") {
    return true;
  }
  return INSPECTION_QUALITY_STATUSES.includes(input.qualityStatus);
}

export function isSupportedInspectionBlockType(
  blockType: string,
): blockType is "heading" | "info_card" {
  return blockType === "heading" || blockType === "info_card";
}
