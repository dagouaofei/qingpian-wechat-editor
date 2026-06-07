import type {
  AdminAuditLog,
  Prisma,
  StyleVariant,
  StyleVariantDistribution,
} from "@prisma/client";

import {
  buildUserSelectablePoolWhere,
  isEligibleForUserSelectablePool,
  toDistributionSnapshot,
} from "../mappers";
import type { StyleAdminDb, StyleAdminPrismaClient } from "../prisma";
import type {
  DistributionSnapshot,
  RollbackDistributionInput,
  UpdateDistributionInput,
  UserSelectableVariantFilter,
} from "../types";
import { StyleVariantAuditRepository } from "./style-variant-audit-repository";

function isDistributionSnapshot(value: unknown): value is DistributionSnapshot {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.userSelectable === "boolean" &&
    typeof record.defaultEligible === "boolean" &&
    typeof record.release1Required === "boolean" &&
    typeof record.hidden === "boolean" &&
    typeof record.deprecated === "boolean"
  );
}

export class StyleVariantDistributionRepository {
  constructor(private readonly db: StyleAdminPrismaClient) {}

  getDistribution(variantId: string): Promise<StyleVariantDistribution | null> {
    return this.db.styleVariantDistribution.findUnique({
      where: { variantId },
    });
  }

  async getDistributionSnapshot(
    variantId: string,
  ): Promise<DistributionSnapshot | null> {
    const distribution = await this.getDistribution(variantId);
    return distribution ? toDistributionSnapshot(distribution) : null;
  }

  async getLastDistributionAuditLog(
    distributionId: string,
  ): Promise<AdminAuditLog | null> {
    return this.db.adminAuditLog.findFirst({
      where: {
        entityType: "style_variant_distribution",
        entityId: distributionId,
        action: "update_distribution",
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateDistribution(
    input: UpdateDistributionInput,
  ): Promise<StyleVariantDistribution> {
    return this.db.$transaction(async (tx) => {
      const before = await tx.styleVariantDistribution.findUnique({
        where: { variantId: input.variantId },
      });

      if (!before) {
        throw new Error(`Distribution not found for variant ${input.variantId}`);
      }

      const afterData: Prisma.StyleVariantDistributionUpdateInput = {
        updatedBy: input.actor,
        cacheVersion: { increment: 1 },
        ...(input.userSelectable !== undefined
          ? { userSelectable: input.userSelectable }
          : {}),
        ...(input.defaultEligible !== undefined
          ? { defaultEligible: input.defaultEligible }
          : {}),
        ...(input.release1Required !== undefined
          ? { release1Required: input.release1Required }
          : {}),
        ...(input.hidden !== undefined ? { hidden: input.hidden } : {}),
        ...(input.deprecated !== undefined
          ? { deprecated: input.deprecated }
          : {}),
      };

      const after = await tx.styleVariantDistribution.update({
        where: { variantId: input.variantId },
        data: afterData,
      });

      const auditRepo = new StyleVariantAuditRepository(tx as StyleAdminDb);
      await auditRepo.recordAdminAuditLog({
        action: "update_distribution",
        entityType: "style_variant_distribution",
        entityId: after.id,
        beforeJson: toDistributionSnapshot(before),
        afterJson: toDistributionSnapshot(after),
        reason: input.reason,
        actor: input.actor,
      });

      return after;
    });
  }

  async listUserSelectableVariants(
    filter: UserSelectableVariantFilter = {},
  ): Promise<Array<StyleVariant & { distribution: StyleVariantDistribution }>> {
    const rows = await this.db.styleVariant.findMany({
      where: buildUserSelectablePoolWhere({
        blockType: filter.blockType,
        styleFamily: filter.styleFamily,
      }),
      include: { distribution: true },
      orderBy: { updatedAt: "desc" },
      take: filter.limit,
      skip: filter.offset,
    });

    return rows.filter(
      (
        row,
      ): row is StyleVariant & { distribution: StyleVariantDistribution } => {
        if (!row.distribution) {
          return false;
        }
        return isEligibleForUserSelectablePool({
          lifecycle: row.lifecycle,
          distribution: row.distribution,
        });
      },
    );
  }

  incrementCacheVersion(variantId: string): Promise<StyleVariantDistribution> {
    return this.db.styleVariantDistribution.update({
      where: { variantId },
      data: { cacheVersion: { increment: 1 } },
    });
  }

  async rollbackLastDistributionChange(
    input: RollbackDistributionInput,
  ): Promise<StyleVariantDistribution> {
    return this.db.$transaction(async (tx) => {
      const before = await tx.styleVariantDistribution.findUnique({
        where: { variantId: input.variantId },
      });

      if (!before) {
        throw new Error("Distribution not found");
      }

      const lastAudit = await tx.adminAuditLog.findFirst({
        where: {
          entityType: "style_variant_distribution",
          entityId: before.id,
          action: "update_distribution",
        },
        orderBy: { createdAt: "desc" },
      });

      if (!lastAudit?.beforeJson || !isDistributionSnapshot(lastAudit.beforeJson)) {
        throw new Error("No rollback snapshot available");
      }

      const target = lastAudit.beforeJson;
      const after = await tx.styleVariantDistribution.update({
        where: { variantId: input.variantId },
        data: {
          userSelectable: target.userSelectable,
          defaultEligible: target.defaultEligible,
          release1Required: target.release1Required,
          hidden: target.hidden,
          deprecated: target.deprecated,
          updatedBy: input.actor,
          cacheVersion: { increment: 1 },
        },
      });

      const auditRepo = new StyleVariantAuditRepository(tx as StyleAdminDb);
      await auditRepo.recordAdminAuditLog({
        action: "rollback_distribution",
        entityType: "style_variant_distribution",
        entityId: after.id,
        beforeJson: toDistributionSnapshot(before),
        afterJson: toDistributionSnapshot(after),
        reason: input.reason,
        actor: input.actor,
      });

      await tx.styleVariantRollbackRecord.create({
        data: {
          variantId: input.variantId,
          rollbackType: "distribution",
          distributionBeforeJson: toDistributionSnapshot(before),
          distributionAfterJson: toDistributionSnapshot(after),
          reason: input.reason,
          actor: input.actor,
        },
      });

      return after;
    });
  }
}
