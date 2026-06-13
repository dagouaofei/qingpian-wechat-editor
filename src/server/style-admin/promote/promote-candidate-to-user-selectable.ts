import type { BlockType, StyleVariantDistribution } from "@prisma/client";

import { buildUserSelectablePoolWhere, isEligibleForUserSelectablePool, toDistributionSnapshot } from "../mappers";
import { invalidateUserSelectableVariantPoolCache } from "../runtime/user-selectable-variant-pool-cache";
import type { StyleAdminPrismaClient } from "../prisma";
import { StyleVariantAuditRepository } from "../repositories/style-variant-audit-repository";
import type { DistributionSnapshot } from "../types";

import {
  evaluateCandidatePromoteEligibility,
  wouldBeRuntimeAvailableAfterPromote,
} from "./candidate-promote-eligibility";
import {
  buildCandidatePromoteRuntimeReadiness,
  mergePromoteEligibilityWithRuntimeReadiness,
} from "./candidate-promote-runtime-readiness";

export type PromoteCandidateToUserSelectableInput = {
  runtimeVariantId: string;
  reason: string;
  actor: string;
};

export type PromoteCandidateToUserSelectableResult =
  | {
      ok: true;
      runtimeVariantId: string;
      lifecycle: string;
      distribution: DistributionSnapshot;
      promoteRecordId: string;
    }
  | { ok: false; code: string; message: string };

function normalizeReason(reason: string): string | null {
  const trimmed = reason.trim();
  return trimmed.length > 0 ? trimmed : null;
}

async function loadVariantForPromote(db: StyleAdminPrismaClient, runtimeVariantId: string) {
  return db.styleVariant.findUnique({
    where: { runtimeVariantId },
    include: {
      distribution: true,
      currentVersion: true,
      sources: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
}

export async function promoteCandidateToUserSelectable(
  db: StyleAdminPrismaClient,
  input: PromoteCandidateToUserSelectableInput,
): Promise<PromoteCandidateToUserSelectableResult> {
  const reason = normalizeReason(input.reason);
  if (!reason) {
    return { ok: false, code: "reason_required", message: "Reason is required" };
  }

  const variant = await loadVariantForPromote(db, input.runtimeVariantId);
  if (!variant?.distribution) {
    return { ok: false, code: "not_found", message: "Variant or distribution not found" };
  }

  const primarySource = variant.sources[0] ?? null;
  const baseEligibility = evaluateCandidatePromoteEligibility({
    lifecycle: variant.lifecycle,
    sourceType: primarySource?.sourceType ?? null,
    qualityStatus: variant.currentVersion?.qualityStatus ?? null,
    distribution: variant.distribution,
    hasCurrentVersion: Boolean(variant.currentVersion),
  });

  const runtimeReadiness = variant.currentVersion
    ? buildCandidatePromoteRuntimeReadiness({
        runtimeVariantId: variant.runtimeVariantId,
        blockType: variant.blockType as BlockType,
        definitionJson: variant.currentVersion.definitionJson,
      })
    : null;

  const runtimeGate = mergePromoteEligibilityWithRuntimeReadiness(
    baseEligibility.eligible ? [] : baseEligibility.blockedReasons,
    runtimeReadiness,
  );

  const finalEligible = baseEligibility.eligible && runtimeGate.eligible;
  const blockedReasons = finalEligible
    ? []
    : [...new Set([...baseEligibility.blockedReasons, ...runtimeGate.blockedReasons])];

  if (!finalEligible) {
    const message = blockedReasons[0] ?? "Promote is not allowed for this variant.";
    const auditRepo = new StyleVariantAuditRepository(db);
    await auditRepo.recordAlertEvent({
      alertType: "candidate_promote_blocked_by_quality",
      severity: "warning",
      message,
      metadataJson: {
        runtimeVariantId: variant.runtimeVariantId,
        qualityStatus: variant.currentVersion?.qualityStatus ?? null,
        blockedReasons,
        runtimeReadiness: runtimeReadiness
          ? {
              ok: runtimeReadiness.ok,
              previewReady: runtimeReadiness.previewReady,
              copyReady: runtimeReadiness.copyReady,
              runtimeSource: runtimeReadiness.trace.runtimeSource,
              decoderPath: runtimeReadiness.trace.decoderPath,
            }
          : null,
      },
    });
    return { ok: false, code: "promote_not_eligible", message };
  }

  const fromLifecycle = variant.lifecycle;
  const distributionBefore = toDistributionSnapshot(variant.distribution);

  try {
    const result = await db.$transaction(async (tx) => {
      const before = await tx.styleVariantDistribution.findUnique({
        where: { variantId: variant.id },
      });
      if (!before) {
        throw new Error("Distribution not found");
      }

      const after = await tx.styleVariantDistribution.update({
        where: { variantId: variant.id },
        data: {
          userSelectable: true,
          hidden: false,
          deprecated: false,
          defaultEligible: false,
          release1Required: false,
          updatedBy: input.actor,
          cacheVersion: { increment: 1 },
        },
      });

      const updatedVariant = await tx.styleVariant.update({
        where: { id: variant.id },
        data: {
          lifecycle:
            variant.lifecycle === "candidate" || variant.lifecycle === "validator_pass"
              ? "paste_qa_pass"
              : variant.lifecycle,
        },
      });

      const auditRepo = new StyleVariantAuditRepository(tx);
      await auditRepo.recordAdminAuditLog({
        action: "update_distribution",
        entityType: "style_variant_distribution",
        entityId: after.id,
        beforeJson: toDistributionSnapshot(before),
        afterJson: toDistributionSnapshot(after),
        reason,
        actor: input.actor,
      });

      const promoteRecord = await tx.styleVariantPromoteRecord.create({
        data: {
          variantId: variant.id,
          fromLifecycle,
          toLifecycle: "paste_qa_pass",
          distributionBeforeJson: distributionBefore,
          distributionAfterJson: toDistributionSnapshot(after),
          reason,
          actor: input.actor,
        },
      });

      await auditRepo.recordLifecycleEvent({
        variantId: variant.id,
        fromLifecycle,
        toLifecycle: "paste_qa_pass",
        reason,
        actor: input.actor,
      });

      await auditRepo.recordAdminAuditLog({
        action: "promote_to_user_selectable",
        entityType: "style_variant",
        entityId: variant.id,
        beforeJson: {
          lifecycle: fromLifecycle,
          distribution: distributionBefore,
        },
        afterJson: {
          lifecycle: updatedVariant.lifecycle,
          distribution: toDistributionSnapshot(after),
          promoteRecordId: promoteRecord.id,
          readinessSummary: runtimeReadiness
            ? {
                ok: runtimeReadiness.ok,
                previewReady: runtimeReadiness.previewReady,
                copyReady: runtimeReadiness.copyReady,
                compatibilityReady: runtimeReadiness.compatibilityReady,
                runtimeSource: runtimeReadiness.trace.runtimeSource,
                decoderPath: runtimeReadiness.trace.decoderPath,
              }
            : null,
        },
        reason,
        actor: input.actor,
      });

      return { after, promoteRecordId: promoteRecord.id, lifecycle: updatedVariant.lifecycle };
    });

    invalidateUserSelectableVariantPoolCache(variant.blockType as BlockType);
    invalidateUserSelectableVariantPoolCache();

    const poolEligible = isEligibleForUserSelectablePool({
      runtimeVariantId: variant.runtimeVariantId,
      blockType: variant.blockType,
      lifecycle: result.lifecycle,
      distribution: result.after,
      currentVersion: variant.currentVersion
        ? { qualityStatus: variant.currentVersion.qualityStatus }
        : null,
      definitionJson: variant.currentVersion?.definitionJson,
    });
    const runtimeAvailable = wouldBeRuntimeAvailableAfterPromote({
      runtimeVariantId: variant.runtimeVariantId,
      qualityStatus: variant.currentVersion!.qualityStatus,
    });

    if (!poolEligible || !runtimeAvailable) {
      const auditRepo = new StyleVariantAuditRepository(db);
      await auditRepo.recordAlertEvent({
        alertType: "candidate_promoted_but_pool_missing",
        severity: "warning",
        message: `Promoted variant ${variant.runtimeVariantId} may not appear in user pool immediately`,
        metadataJson: {
          runtimeVariantId: variant.runtimeVariantId,
          poolEligible,
          runtimeAvailable,
        },
      });
    }

    return {
      ok: true,
      runtimeVariantId: variant.runtimeVariantId,
      lifecycle: result.lifecycle,
      distribution: toDistributionSnapshot(result.after),
      promoteRecordId: result.promoteRecordId,
    };
  } catch (error) {
    const auditRepo = new StyleVariantAuditRepository(db);
    const message =
      error instanceof Error && /DATABASE_URL|postgresql|postgres:\/\//i.test(error.message)
        ? "Database operation failed"
        : error instanceof Error
          ? error.message
          : "Promote failed";
    await auditRepo.recordRuntimeError({
      scope: "admin",
      errorCode: "promote_failed",
      message,
      metadataJson: {
        runtimeVariantId: variant.runtimeVariantId,
        action: "promote_to_user_selectable",
      },
    });
    return { ok: false, code: "promote_failed", message: "Promote failed" };
  }
}

export function isVariantInUserSelectablePoolAfterPromote(input: {
  lifecycle: string;
  distribution: StyleVariantDistribution;
}): boolean {
  return isEligibleForUserSelectablePool({
    runtimeVariantId: input.distribution.variantId,
    lifecycle: input.lifecycle as Parameters<typeof isEligibleForUserSelectablePool>[0]["lifecycle"],
    distribution: input.distribution,
  });
}
