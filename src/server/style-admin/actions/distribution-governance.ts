import type { BlockType } from "@prisma/client";

import { isRuntimeVariantAvailable } from "@/lib/runtime-variant-availability";

import {
  assertStyleAdminWriteAllowed,
  StyleAdminWriteDisabledError,
} from "../admin-write-guard";
import { invalidateUserSelectableVariantPoolCache } from "../runtime/user-selectable-variant-pool-cache";
import { prisma } from "../prisma";
import { StyleVariantAuditRepository } from "../repositories/style-variant-audit-repository";
import { StyleVariantDistributionRepository } from "../repositories/style-variant-distribution-repository";
import {
  LOCAL_STYLE_ADMIN_ACTOR,
  type DistributionSnapshot,
} from "../types";

export type GovernanceActionResult =
  | { ok: true; action: string; distribution: DistributionSnapshot }
  | { ok: false; code: string; message: string };

export type GovernanceActionInput = {
  runtimeVariantId: string;
  reason: string;
  actor?: string;
};

function normalizeReason(reason: string): string | null {
  const trimmed = reason.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function sanitizeErrorMessage(error: unknown): string {
  if (error instanceof StyleAdminWriteDisabledError) {
    return error.message;
  }
  if (error instanceof Error) {
    if (/DATABASE_URL|postgresql|postgres:\/\//i.test(error.message)) {
      return "Database operation failed";
    }
    return error.message;
  }
  return "Unknown error";
}

async function loadVariantContext(runtimeVariantId: string) {
  return prisma.styleVariant.findUnique({
    where: { runtimeVariantId },
    include: {
      distribution: true,
      currentVersion: true,
    },
  });
}

async function recordGovernanceFailure(input: {
  action: string;
  runtimeVariantId: string;
  message: string;
  code: string;
  alertType?: string;
}) {
  const auditRepo = new StyleVariantAuditRepository(prisma);
  await auditRepo.recordRuntimeError({
    scope: "admin",
    errorCode: input.code,
    message: input.message,
    metadataJson: {
      action: input.action,
      runtimeVariantId: input.runtimeVariantId,
    },
  });
  await auditRepo.recordAlertEvent({
    alertType: input.alertType ?? "admin_write_failed",
    severity: "warning",
    message: input.message,
    metadataJson: {
      action: input.action,
      runtimeVariantId: input.runtimeVariantId,
      code: input.code,
    },
  });
}

async function applyDistributionUpdate(input: {
  variantId: string;
  blockType: BlockType;
  reason: string;
  actor: string;
  action: string;
  patch: Partial<DistributionSnapshot>;
}): Promise<GovernanceActionResult> {
  try {
    assertStyleAdminWriteAllowed();
    const repo = new StyleVariantDistributionRepository(prisma);
    const updated = await repo.updateDistribution({
      variantId: input.variantId,
      reason: input.reason,
      actor: input.actor,
      ...input.patch,
    });
    invalidateUserSelectableVariantPoolCache(input.blockType);
    invalidateUserSelectableVariantPoolCache();
    return {
      ok: true,
      action: input.action,
      distribution: {
        userSelectable: updated.userSelectable,
        defaultEligible: updated.defaultEligible,
        release1Required: updated.release1Required,
        hidden: updated.hidden,
        deprecated: updated.deprecated,
        cacheVersion: updated.cacheVersion,
      },
    };
  } catch (error) {
    const message = sanitizeErrorMessage(error);
    await recordGovernanceFailure({
      action: input.action,
      runtimeVariantId: input.variantId,
      message,
      code: error instanceof StyleAdminWriteDisabledError ? "write_disabled" : "update_failed",
    });
    return { ok: false, code: "update_failed", message };
  }
}

export async function hideVariantFromUserPool(
  input: GovernanceActionInput,
): Promise<GovernanceActionResult> {
  const reason = normalizeReason(input.reason);
  if (!reason) {
    return { ok: false, code: "reason_required", message: "Reason is required" };
  }

  const variant = await loadVariantContext(input.runtimeVariantId);
  if (!variant?.distribution) {
    return { ok: false, code: "not_found", message: "Variant or distribution not found" };
  }

  return applyDistributionUpdate({
    variantId: variant.id,
    blockType: variant.blockType,
    reason,
    actor: input.actor ?? LOCAL_STYLE_ADMIN_ACTOR,
    action: "hide_from_user_pool",
    patch: { hidden: true, userSelectable: false },
  });
}

export async function restoreVariantToUserSelectable(
  input: GovernanceActionInput,
): Promise<GovernanceActionResult> {
  const reason = normalizeReason(input.reason);
  if (!reason) {
    return { ok: false, code: "reason_required", message: "Reason is required" };
  }

  const variant = await loadVariantContext(input.runtimeVariantId);
  if (!variant?.distribution) {
    return { ok: false, code: "not_found", message: "Variant or distribution not found" };
  }

  if (!variant.currentVersion) {
    return { ok: false, code: "missing_version", message: "Current version is required" };
  }

  const proposedDistribution = {
    userSelectable: true,
    hidden: false,
    deprecated: false,
    defaultEligible: variant.distribution.defaultEligible,
    release1Required: variant.distribution.release1Required,
  };

  const available = isRuntimeVariantAvailable({
    runtimeVariantId: variant.runtimeVariantId,
    distribution: proposedDistribution,
    currentVersion: { qualityStatus: variant.currentVersion.qualityStatus },
  });

  if (!available) {
    const message = `Restore blocked by qualityStatus=${variant.currentVersion.qualityStatus}`;
    const auditRepo = new StyleVariantAuditRepository(prisma);
    await auditRepo.recordAlertEvent({
      alertType: "variant_restore_blocked_by_quality",
      severity: "warning",
      message,
      metadataJson: {
        runtimeVariantId: variant.runtimeVariantId,
        qualityStatus: variant.currentVersion.qualityStatus,
      },
    });
    return { ok: false, code: "restore_blocked_by_quality", message };
  }

  return applyDistributionUpdate({
    variantId: variant.id,
    blockType: variant.blockType,
    reason,
    actor: input.actor ?? LOCAL_STYLE_ADMIN_ACTOR,
    action: "restore_to_user_selectable",
    patch: { userSelectable: true, hidden: false, deprecated: false },
  });
}

export async function markVariantDeprecated(
  input: GovernanceActionInput,
): Promise<GovernanceActionResult> {
  const reason = normalizeReason(input.reason);
  if (!reason) {
    return { ok: false, code: "reason_required", message: "Reason is required" };
  }

  const variant = await loadVariantContext(input.runtimeVariantId);
  if (!variant?.distribution) {
    return { ok: false, code: "not_found", message: "Variant or distribution not found" };
  }

  return applyDistributionUpdate({
    variantId: variant.id,
    blockType: variant.blockType,
    reason,
    actor: input.actor ?? LOCAL_STYLE_ADMIN_ACTOR,
    action: "mark_deprecated",
    patch: { deprecated: true, hidden: true, userSelectable: false },
  });
}

export async function restoreVariantFromDeprecated(
  input: GovernanceActionInput,
): Promise<GovernanceActionResult> {
  const reason = normalizeReason(input.reason);
  if (!reason) {
    return { ok: false, code: "reason_required", message: "Reason is required" };
  }

  const variant = await loadVariantContext(input.runtimeVariantId);
  if (!variant?.distribution) {
    return { ok: false, code: "not_found", message: "Variant or distribution not found" };
  }

  return applyDistributionUpdate({
    variantId: variant.id,
    blockType: variant.blockType,
    reason,
    actor: input.actor ?? LOCAL_STYLE_ADMIN_ACTOR,
    action: "restore_from_deprecated",
    patch: { deprecated: false, hidden: false },
  });
}

export async function rollbackLastDistributionChange(
  input: GovernanceActionInput,
): Promise<GovernanceActionResult> {
  const reason = normalizeReason(input.reason);
  if (!reason) {
    return { ok: false, code: "reason_required", message: "Reason is required" };
  }

  try {
    assertStyleAdminWriteAllowed();
    const variant = await loadVariantContext(input.runtimeVariantId);
    if (!variant?.distribution) {
      return { ok: false, code: "not_found", message: "Variant or distribution not found" };
    }

    const repo = new StyleVariantDistributionRepository(prisma);
    const updated = await repo.rollbackLastDistributionChange({
      variantId: variant.id,
      reason,
      actor: input.actor ?? LOCAL_STYLE_ADMIN_ACTOR,
    });

    invalidateUserSelectableVariantPoolCache(variant.blockType);
    invalidateUserSelectableVariantPoolCache();

    return {
      ok: true,
      action: "rollback_last_distribution",
      distribution: {
        userSelectable: updated.userSelectable,
        defaultEligible: updated.defaultEligible,
        release1Required: updated.release1Required,
        hidden: updated.hidden,
        deprecated: updated.deprecated,
        cacheVersion: updated.cacheVersion,
      },
    };
  } catch (error) {
    const message = sanitizeErrorMessage(error);
    await recordGovernanceFailure({
      action: "rollback_last_distribution",
      runtimeVariantId: input.runtimeVariantId,
      message,
      code: error instanceof StyleAdminWriteDisabledError ? "write_disabled" : "rollback_failed",
    });
    return { ok: false, code: "rollback_failed", message };
  }
}
