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
  createManualPasteQaEvidence,
  type ManualPasteQaEvidenceResult,
  runCandidateInspectionAndPersist,
  type RunCandidateInspectionResult,
} from "../inspection";
import { prisma } from "../prisma";

export type RunCandidateInspectionActionResult = RunCandidateInspectionResult;
export type ManualPasteQaEvidenceActionResult = ManualPasteQaEvidenceResult;

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
  return "inspection_failed";
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

export async function runCandidateInspectionAction(
  runtimeVariantId: string,
): Promise<RunCandidateInspectionActionResult> {
  try {
    const admin = await requireStyleAdmin();
    assertStyleAdminWriteAllowed();
    const actor = getStyleAdminActor(admin);
    return await runCandidateInspectionAndPersist(prisma, runtimeVariantId, actor);
  } catch (error) {
    return {
      ok: false,
      code: actionFailureCode(error),
      message: sanitizeErrorMessage(error),
    };
  }
}

export type ManualPasteQaEvidenceActionInput = {
  runtimeVariantId: string;
  sourceLabel: string;
  notes?: string;
  sourceUrl?: string;
  status: "not_run" | "pass" | "failed";
};

export async function addManualPasteQaEvidenceAction(
  input: ManualPasteQaEvidenceActionInput,
): Promise<ManualPasteQaEvidenceActionResult> {
  try {
    const admin = await requireStyleAdmin();
    assertStyleAdminWriteAllowed();
    const actor = getStyleAdminActor(admin);
    return await createManualPasteQaEvidence(prisma, {
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
