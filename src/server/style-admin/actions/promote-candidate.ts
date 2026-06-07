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
import { prisma } from "../prisma";
import {
  promoteCandidateToUserSelectable,
  type PromoteCandidateToUserSelectableResult,
} from "../promote";

export type PromoteCandidateActionInput = {
  runtimeVariantId: string;
  reason: string;
};

export type PromoteCandidateActionResult = PromoteCandidateToUserSelectableResult;

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
  return "promote_failed";
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

export async function promoteCandidateToUserSelectableAction(
  input: PromoteCandidateActionInput,
): Promise<PromoteCandidateActionResult> {
  try {
    const admin = await requireStyleAdmin();
    assertStyleAdminWriteAllowed();
    const actor = getStyleAdminActor(admin);
    return await promoteCandidateToUserSelectable(prisma, {
      runtimeVariantId: input.runtimeVariantId,
      reason: input.reason,
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
