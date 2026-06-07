"use server";

import { revalidatePath } from "next/cache";

import {
  promoteCandidateToUserSelectableAction,
  type PromoteCandidateActionInput,
  type PromoteCandidateActionResult,
} from "@/server/style-admin/actions/promote-candidate";

function revalidateDetail(runtimeVariantId: string) {
  revalidatePath("/admin/style-library");
  revalidatePath(`/admin/style-library/${encodeURIComponent(runtimeVariantId)}`);
  revalidatePath("/preview");
}

export async function promoteCandidateFormAction(
  input: PromoteCandidateActionInput,
): Promise<PromoteCandidateActionResult> {
  const result = await promoteCandidateToUserSelectableAction(input);
  if (result.ok) {
    revalidateDetail(input.runtimeVariantId);
  }
  return result;
}
