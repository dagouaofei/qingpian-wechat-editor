import type {
  StyleVariant,
  StyleVariantDistribution,
  StyleVariantVersion,
} from "@prisma/client";

import type { StyleAdminDb, StyleAdminPrismaClient } from "../prisma";
import { toDistributionSnapshot } from "../mappers";
import type { CollectedStyleVariant } from "./import-types";

export type ImportWriteResult =
  | { action: "imported" }
  | { action: "updated"; createdVersion: boolean }
  | { action: "skipped_unchanged" };

export class StyleVariantImportWriter {
  constructor(private readonly db: StyleAdminPrismaClient) {}

  async findVariantByRuntimeId(
    runtimeVariantId: string,
  ): Promise<StyleVariant | null> {
    return this.db.styleVariant.findUnique({ where: { runtimeVariantId } });
  }

  async getCurrentVersion(
    variantId: string,
  ): Promise<StyleVariantVersion | null> {
    const variant = await this.db.styleVariant.findUnique({
      where: { id: variantId },
      include: { currentVersion: true },
    });
    return variant?.currentVersion ?? null;
  }

  async getDistribution(
    variantId: string,
  ): Promise<StyleVariantDistribution | null> {
    return this.db.styleVariantDistribution.findUnique({ where: { variantId } });
  }

  async upsertCollectedVariant(
    collected: CollectedStyleVariant,
    actor: string,
  ): Promise<ImportWriteResult> {
    const existing = await this.findVariantByRuntimeId(collected.runtimeVariantId);

    if (!existing) {
      await this.createCollectedVariant(collected, actor);
      return { action: "imported" };
    }

    return this.updateCollectedVariant(existing, collected, actor);
  }

  private async createCollectedVariant(
    collected: CollectedStyleVariant,
    actor: string,
  ): Promise<void> {
    await this.db.$transaction(async (tx) => {
      const variant = await tx.styleVariant.create({
        data: {
          runtimeVariantId: collected.runtimeVariantId,
          blockType: collected.blockType,
          styleFamily: collected.styleFamily,
          label: collected.label,
          description: collected.description,
          lifecycle: collected.lifecycle,
        },
      });

      const version = await tx.styleVariantVersion.create({
        data: {
          variantId: variant.id,
          versionNumber: 1,
          definitionJson: collected.definitionJson,
          componentProtocolJson: collected.componentProtocolJson,
          compatibilityJson: collected.compatibilityJson,
          copySafety: collected.copySafety,
          sourceChecksum: collected.sourceChecksum,
          createdBy: actor,
        },
      });

      await tx.styleVariant.update({
        where: { id: variant.id },
        data: { currentVersionId: version.id },
      });

      await tx.styleVariantDistribution.create({
        data: {
          variantId: variant.id,
          userSelectable: collected.distribution.userSelectable,
          defaultEligible: collected.distribution.defaultEligible,
          release1Required: collected.distribution.release1Required,
          hidden: collected.distribution.hidden,
          deprecated: collected.distribution.deprecated,
          cacheVersion: collected.distribution.cacheVersion,
          updatedBy: actor,
        },
      });

      await this.ensureSourceRecord(tx as StyleAdminDb, variant.id, collected);

      await tx.styleVariantLifecycleEvent.create({
        data: {
          variantId: variant.id,
          fromLifecycle: null,
          toLifecycle: collected.lifecycle,
          reason: `Initial import from ${collected.collectedFrom}`,
          actor,
        },
      });

      await tx.adminAuditLog.create({
        data: {
          action: "import_variant",
          entityType: "style_variant",
          entityId: variant.id,
          afterJson: {
            runtimeVariantId: collected.runtimeVariantId,
            lifecycle: collected.lifecycle,
            distribution: collected.distribution,
            sourceChecksum: collected.sourceChecksum,
          },
          reason: "S10-STORY-003 initial import",
          actor,
        },
      });
    });
  }

  private async updateCollectedVariant(
    existing: StyleVariant,
    collected: CollectedStyleVariant,
    actor: string,
  ): Promise<ImportWriteResult> {
    let createdVersion = false;
    let metadataChanged = false;
    let distributionChanged = false;

    await this.db.$transaction(async (tx) => {
      const currentVersion = await tx.styleVariantVersion.findFirst({
        where: { variantId: existing.id, id: existing.currentVersionId ?? undefined },
      });

      const metadataUpdates = {
        blockType: collected.blockType,
        styleFamily: collected.styleFamily,
        label: collected.label,
        description: collected.description,
        lifecycle: collected.lifecycle,
      };

      metadataChanged = Object.entries(metadataUpdates).some(([key, value]) => {
        return existing[key as keyof StyleVariant] !== value;
      });

      if (metadataChanged || existing.lifecycle !== collected.lifecycle) {
        await tx.styleVariant.update({
          where: { id: existing.id },
          data: metadataUpdates,
        });

        if (existing.lifecycle !== collected.lifecycle) {
          await tx.styleVariantLifecycleEvent.create({
            data: {
              variantId: existing.id,
              fromLifecycle: existing.lifecycle,
              toLifecycle: collected.lifecycle,
              reason: `Import sync from ${collected.collectedFrom}`,
              actor,
            },
          });
        }
      }

      if (
        !currentVersion ||
        currentVersion.sourceChecksum !== collected.sourceChecksum
      ) {
        const latest = await tx.styleVariantVersion.findFirst({
          where: { variantId: existing.id },
          orderBy: { versionNumber: "desc" },
        });
        const versionNumber = (latest?.versionNumber ?? 0) + 1;
        const version = await tx.styleVariantVersion.create({
          data: {
            variantId: existing.id,
            versionNumber,
            definitionJson: collected.definitionJson,
            componentProtocolJson: collected.componentProtocolJson,
            compatibilityJson: collected.compatibilityJson,
            copySafety: collected.copySafety,
            sourceChecksum: collected.sourceChecksum,
            createdBy: actor,
          },
        });
        await tx.styleVariant.update({
          where: { id: existing.id },
          data: { currentVersionId: version.id },
        });
        createdVersion = true;
      }

      const distribution = await tx.styleVariantDistribution.findUnique({
        where: { variantId: existing.id },
      });

      if (distribution) {
        const next = collected.distribution;
        distributionChanged =
          distribution.userSelectable !== next.userSelectable ||
          distribution.defaultEligible !== next.defaultEligible ||
          distribution.release1Required !== next.release1Required ||
          distribution.hidden !== next.hidden ||
          distribution.deprecated !== next.deprecated;

        if (distributionChanged) {
          const updated = await tx.styleVariantDistribution.update({
            where: { variantId: existing.id },
            data: {
              userSelectable: next.userSelectable,
              defaultEligible: next.defaultEligible,
              release1Required: next.release1Required,
              hidden: next.hidden,
              deprecated: next.deprecated,
              cacheVersion: { increment: 1 },
              updatedBy: actor,
            },
          });

          await tx.adminAuditLog.create({
            data: {
              action: "import_update_distribution",
              entityType: "style_variant_distribution",
              entityId: updated.id,
              beforeJson: toDistributionSnapshot(distribution),
              afterJson: toDistributionSnapshot(updated),
              reason: "S10-STORY-003 import distribution sync",
              actor,
            },
          });
        }
      }

      await this.ensureSourceRecord(tx as StyleAdminDb, existing.id, collected);

      if (metadataChanged || distributionChanged || createdVersion) {
        await tx.adminAuditLog.create({
          data: {
            action: "import_update_variant",
            entityType: "style_variant",
            entityId: existing.id,
            afterJson: {
              runtimeVariantId: collected.runtimeVariantId,
              lifecycle: collected.lifecycle,
              sourceChecksum: collected.sourceChecksum,
              createdVersion,
              metadataChanged,
              distributionChanged,
            },
            reason: "S10-STORY-003 import sync",
            actor,
          },
        });
      }
    });

    if (!metadataChanged && !distributionChanged && !createdVersion) {
      return { action: "skipped_unchanged" };
    }

    return { action: "updated", createdVersion };
  }

  private async ensureSourceRecord(
    tx: StyleAdminDb,
    variantId: string,
    collected: CollectedStyleVariant,
  ): Promise<void> {
    const existingSource = await tx.styleVariantSource.findFirst({
      where: {
        variantId,
        sourceRef: collected.sourceRef,
      },
      orderBy: { createdAt: "desc" },
    });

    const nextMetadata = collected.sourceMetadata;
    const metadataChanged =
      JSON.stringify(existingSource?.sourceMetadata ?? null) !==
      JSON.stringify(nextMetadata ?? null);

    if (existingSource && !metadataChanged) {
      return;
    }

    await tx.styleVariantSource.create({
      data: {
        variantId,
        sourceType: collected.sourceType,
        sourceRef: collected.sourceRef,
        ...(nextMetadata !== undefined ? { sourceMetadata: nextMetadata } : {}),
      },
    });
  }
}
