"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createHtmlHarvestCandidateAction,
  previewHtmlHarvestAction,
  type HtmlHarvestActionInput,
  type HtmlHarvestActionResult,
  type HtmlHarvestPreviewActionResult,
} from "@/server/style-admin/actions/html-harvest-candidate";

export async function previewHarvestCandidateAction(
  input: HtmlHarvestActionInput,
): Promise<HtmlHarvestPreviewActionResult> {
  return previewHtmlHarvestAction(input);
}

export async function createHarvestCandidateAction(
  input: HtmlHarvestActionInput,
): Promise<HtmlHarvestActionResult> {
  const result = await createHtmlHarvestCandidateAction(input);
  if (result.ok) {
    revalidatePath("/admin/style-library");
    redirect(`/admin/style-library/${encodeURIComponent(result.runtimeVariantId)}`);
  }
  return result;
}
