"use server";

import { revalidatePath } from "next/cache";

import {
  addManualPasteQaEvidenceAction,
  runCandidateInspectionAction,
  type ManualPasteQaEvidenceActionInput,
  type ManualPasteQaEvidenceActionResult,
  type RunCandidateInspectionActionResult,
} from "@/server/style-admin/actions/candidate-inspection";

function revalidateDetail(runtimeVariantId: string) {
  revalidatePath("/admin/style-library");
  revalidatePath(`/admin/style-library/${encodeURIComponent(runtimeVariantId)}`);
}

export async function runCandidateInspectionFormAction(
  runtimeVariantId: string,
): Promise<RunCandidateInspectionActionResult> {
  const result = await runCandidateInspectionAction(runtimeVariantId);
  if (result.ok) {
    revalidateDetail(runtimeVariantId);
  }
  return result;
}

export async function addManualPasteQaEvidenceFormAction(
  input: ManualPasteQaEvidenceActionInput,
): Promise<ManualPasteQaEvidenceActionResult> {
  const result = await addManualPasteQaEvidenceAction(input);
  if (result.ok) {
    revalidateDetail(input.runtimeVariantId);
  }
  return result;
}
