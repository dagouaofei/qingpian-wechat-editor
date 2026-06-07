import {
  assertStyleAdminWriteAllowed,
  StyleAdminWriteDisabledError,
} from "../admin-write-guard";
import {
  getStyleAdminActor,
  requireStyleAdmin,
  StyleAdminAuthError,
  StyleAdminAuthNotConfiguredError,
} from "../auth";
import {
  createHtmlHarvestCandidate,
  previewHtmlHarvestCandidate,
  type CreateHtmlHarvestCandidateResult,
  type HtmlHarvestSourcePlatform,
  type PreviewHtmlHarvestResult,
} from "../harvest";
import { prisma } from "../prisma";

export type HtmlHarvestActionInput = {
  sourceLabel: string;
  sourceUrl?: string;
  sourcePlatform?: HtmlHarvestSourcePlatform;
  notes?: string;
  rawHtml: string;
  blockType?: "heading" | "info_card";
};

export type HtmlHarvestActionResult = CreateHtmlHarvestCandidateResult;
export type HtmlHarvestPreviewActionResult = PreviewHtmlHarvestResult;

function isStyleAdminAuthFailure(error: unknown): boolean {
  return (
    error instanceof StyleAdminAuthError ||
    error instanceof StyleAdminAuthNotConfiguredError ||
    (typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error.code === "style_admin_auth_required" ||
        error.code === "style_admin_auth_not_configured"))
  );
}

function actionFailureCode(error: unknown): string {
  if (isStyleAdminAuthFailure(error)) {
    return "auth_required";
  }
  if (error instanceof StyleAdminWriteDisabledError) {
    return "write_disabled";
  }
  return "create_failed";
}

function sanitizeErrorMessage(error: unknown): string {
  if (
    error instanceof StyleAdminWriteDisabledError ||
    isStyleAdminAuthFailure(error)
  ) {
    return error instanceof Error ? error.message : "Authentication required";
  }
  if (error instanceof Error) {
    if (/DATABASE_URL|postgresql|postgres:\/\//i.test(error.message)) {
      return "Database operation failed";
    }
    return error.message;
  }
  return "Unknown error";
}

export async function previewHtmlHarvestAction(
  input: HtmlHarvestActionInput,
): Promise<HtmlHarvestPreviewActionResult> {
  try {
    return previewHtmlHarvestCandidate({
      rawHtml: input.rawHtml,
      blockType: input.blockType,
    });
  } catch (error) {
    return {
      ok: false,
      code: "preview_failed",
      message: sanitizeErrorMessage(error),
    };
  }
}

export async function createHtmlHarvestCandidateAction(
  input: HtmlHarvestActionInput,
): Promise<HtmlHarvestActionResult> {
  try {
    const admin = await requireStyleAdmin();
    assertStyleAdminWriteAllowed();
    const actor = getStyleAdminActor(admin);

    return await createHtmlHarvestCandidate(prisma, {
      ...input,
      actor,
    });
  } catch (error) {
    return {
      ok: false,
      code: actionFailureCode(error),
      message: sanitizeErrorMessage(error),
    };
  }
}
