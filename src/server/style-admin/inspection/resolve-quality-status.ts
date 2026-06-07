import type { StyleVariantQualityStatus } from "@prisma/client";

import type { CandidateInspectionResult } from "./candidate-inspection-types";

export function resolveQualityStatusFromInspection(
  inspection: Pick<CandidateInspectionResult, "preview" | "copy" | "validator">,
): StyleVariantQualityStatus {
  if (!inspection.preview.ok) {
    return "validator_failed";
  }
  if (!inspection.copy.ok || inspection.copy.html == null) {
    return "copy_fidelity_failed";
  }
  if (inspection.validator.status === "fail" || !inspection.validator.valid) {
    return "validator_failed";
  }
  return "validator_pass";
}

export function resolveQualityStatusFromPasteQa(
  status: "not_run" | "pass" | "failed",
  current: StyleVariantQualityStatus,
): StyleVariantQualityStatus {
  if (status === "pass") {
    return "paste_qa_pass";
  }
  if (status === "failed") {
    return "copy_fidelity_failed";
  }
  return current;
}
