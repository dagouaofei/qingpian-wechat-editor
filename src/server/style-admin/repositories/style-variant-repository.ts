import type { Prisma, StyleVariant, StyleVariantVersion } from "@prisma/client";

import {
  defaultDistributionForLifecycle,
} from "../mappers";
import type { StyleAdminDb, StyleAdminPrismaClient } from "../prisma";
import type {
  CreateVariantVersionInput,
  CreateVariantWithVersionInput,
  StyleVariantListFilter,
} from "../types";
import { StyleVariantAuditRepository } from "./style-variant-audit-repository";

export class StyleVariantRepository {
  constructor(private readonly db: StyleAdminPrismaClient) {}

  getVariantByRuntimeId(runtimeVariantId: string): Promise<StyleVariant | null> {
    return this.db.styleVariant.findUnique({
      where: { runtimeVariantId },
    });
  }

  getVariantById(id: string): Promise<StyleVariant | null> {
    return this.db.styleVariant.findUnique({
      where: { id },
    });
  }

  listVariants(filter: StyleVariantListFilter = {}): Promise<StyleVariant[]> {
    const where: Prisma.StyleVariantWhereInput = {
      ...(filter.blockType ? { blockType: filter.blockType } : {}),
      ...(filter.lifecycle ? { lifecycle: filter.lifecycle } : {}),
      ...(filter.styleFamily ? { styleFamily: filter.styleFamily } : {}),
      ...(filter.runtimeVariantId
        ? { runtimeVariantId: filter.runtimeVariantId }
        : {}),
    };

    return this.db.styleVariant.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: filter.limit,
      skip: filter.offset,
    });
  }

  async createVariantWithVersion(
    input: CreateVariantWithVersionInput,
  ): Promise<{ variant: StyleVariant; version: StyleVariantVersion }> {
    const distributionDefaults = {
      ...defaultDistributionForLifecycle(input.lifecycle),
      ...input.distribution,
    };

    return this.db.$transaction(async (tx) => {
      const variant = await tx.styleVariant.create({
        data: {
          runtimeVariantId: input.runtimeVariantId,
          blockType: input.blockType,
          styleFamily: input.styleFamily,
          label: input.label,
          description: input.description,
          lifecycle: input.lifecycle,
        },
      });

      const version = await tx.styleVariantVersion.create({
        data: {
          variantId: variant.id,
          versionNumber: 1,
          definitionJson: input.definitionJson,
          componentProtocolJson: input.componentProtocolJson,
          compatibilityJson: input.compatibilityJson,
          copySafety: input.copySafety,
          sourceChecksum: input.sourceChecksum,
          createdBy: input.createdBy,
        },
      });

      await tx.styleVariant.update({
        where: { id: variant.id },
        data: { currentVersionId: version.id },
      });

      await tx.styleVariantDistribution.create({
        data: {
          variantId: variant.id,
          userSelectable: distributionDefaults.userSelectable,
          defaultEligible: distributionDefaults.defaultEligible,
          release1Required: distributionDefaults.release1Required,
          hidden: distributionDefaults.hidden,
          deprecated: distributionDefaults.deprecated,
          cacheVersion: distributionDefaults.cacheVersion,
          updatedBy: input.actor,
        },
      });

      if (input.source) {
        await tx.styleVariantSource.create({
          data: {
            variantId: variant.id,
            sourceType: input.source.sourceType,
            sourceRef: input.source.sourceRef,
            sourceMetadata: input.source.sourceMetadata,
            rawHtml: input.source.rawHtml,
          },
        });
      }

      const auditRepo = new StyleVariantAuditRepository(tx as StyleAdminDb);
      await auditRepo.recordAdminAuditLog({
        action: "create_variant_with_version",
        entityType: "style_variant",
        entityId: variant.id,
        afterJson: {
          runtimeVariantId: variant.runtimeVariantId,
          lifecycle: variant.lifecycle,
          versionId: version.id,
          distribution: distributionDefaults,
        },
        reason: "Initial variant import",
        actor: input.actor,
      });

      return {
        variant: { ...variant, currentVersionId: version.id },
        version,
      };
    });
  }

  async createVariantVersion(
    input: CreateVariantVersionInput,
  ): Promise<StyleVariantVersion> {
    return this.db.$transaction(async (tx) => {
      const latest = await tx.styleVariantVersion.findFirst({
        where: { variantId: input.variantId },
        orderBy: { versionNumber: "desc" },
      });
      const versionNumber = (latest?.versionNumber ?? 0) + 1;

      const version = await tx.styleVariantVersion.create({
        data: {
          variantId: input.variantId,
          versionNumber,
          definitionJson: input.definitionJson,
          componentProtocolJson: input.componentProtocolJson,
          compatibilityJson: input.compatibilityJson,
          copySafety: input.copySafety,
          sourceChecksum: input.sourceChecksum,
          createdBy: input.createdBy,
        },
      });

      const auditRepo = new StyleVariantAuditRepository(tx as StyleAdminDb);
      await auditRepo.recordAdminAuditLog({
        action: "create_variant_version",
        entityType: "style_variant_version",
        entityId: version.id,
        afterJson: {
          variantId: input.variantId,
          versionNumber,
        },
        actor: input.actor,
      });

      return version;
    });
  }

  getCurrentVersion(variantId: string): Promise<StyleVariantVersion | null> {
    return this.db.styleVariant
      .findUnique({
        where: { id: variantId },
        include: { currentVersion: true },
      })
      .then((variant) => variant?.currentVersion ?? null);
  }

  async setCurrentVersion(
    variantId: string,
    versionId: string,
    actor: string,
  ): Promise<StyleVariant> {
    return this.db.$transaction(async (tx) => {
      const before = await tx.styleVariant.findUnique({ where: { id: variantId } });
      const version = await tx.styleVariantVersion.findFirst({
        where: { id: versionId, variantId },
      });

      if (!version) {
        throw new Error(
          `Version ${versionId} does not belong to variant ${variantId}`,
        );
      }

      const variant = await tx.styleVariant.update({
        where: { id: variantId },
        data: { currentVersionId: versionId },
      });

      const auditRepo = new StyleVariantAuditRepository(tx as StyleAdminDb);
      await auditRepo.recordAdminAuditLog({
        action: "set_current_version",
        entityType: "style_variant",
        entityId: variantId,
        beforeJson: { currentVersionId: before?.currentVersionId ?? null },
        afterJson: { currentVersionId: versionId },
        actor,
      });

      return variant;
    });
  }
}
