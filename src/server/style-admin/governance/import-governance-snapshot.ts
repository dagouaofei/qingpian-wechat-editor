import type { StyleVariantLifecycle } from "@prisma/client";

import { toDistributionSnapshot } from "../mappers";
import { invalidateUserSelectableVariantPoolCache } from "../runtime/user-selectable-variant-pool-cache";
import type { StyleAdminPrismaClient } from "../prisma";
import type {
  GovernanceSnapshot,
  GovernanceSnapshotImportReport,
  GovernanceSnapshotVariant,
} from "./governance-snapshot-types";

export type ImportGovernanceSnapshotOptions = {
  dryRun?: boolean;
  actor?: string;
  missingVariantMode?: "error" | "skip";
};

function createEmptyReport(
  snapshot: GovernanceSnapshot,
  dryRun: boolean,
): GovernanceSnapshotImportReport {
  return {
    generatedAt: new Date().toISOString(),
    dryRun,
    snapshotExportedAt: snapshot.exportedAt,
    snapshotSourceEnvironment: snapshot.sourceEnvironment,
    snapshotVariantCount: snapshot.variantCount,
    updated: 0,
    unchanged: 0,
    missing: [],
    errors: [],
    warnings: [],
    legacyLifecycleNormalized: [],
    byLifecycle: {},
    userSelectableExpectedCount: 0,
    userSelectableExpected: [],
    userSelectableTargetBeforeCount: 0,
    userSelectableTargetBefore: [],
    userSelectableTargetAfterCount: 0,
    userSelectableTargetAfter: [],
    userSelectableOnlyInSnapshot: [],
    userSelectableOnlyInTarget: [],
    hiddenDiffCount: 0,
    deprecatedDiffCount: 0,
    qualityStatusDiffCount: 0,
    lifecycleDiffCount: 0,
    labelDiffCount: 0,
  };
}

function listUserSelectableRuntimeIds(
  entries: Array<{ runtimeVariantId: string; distribution: { userSelectable: boolean } }>,
): string[] {
  return entries
    .filter((entry) => entry.distribution.userSelectable)
    .map((entry) => entry.runtimeVariantId)
    .sort();
}

function diffSets(expected: string[], actual: string[]) {
  const expectedSet = new Set(expected);
  const actualSet = new Set(actual);
  return {
    onlyInSnapshot: expected.filter((id) => !actualSet.has(id)),
    onlyInTarget: actual.filter((id) => !expectedSet.has(id)),
  };
}

function seedLifecycleCounts(
  report: GovernanceSnapshotImportReport,
  variants: GovernanceSnapshotVariant[],
): void {
  report.byLifecycle = {};
  for (const variant of variants) {
    report.byLifecycle[variant.lifecycle] =
      (report.byLifecycle[variant.lifecycle] ?? 0) + 1;
  }
}

function variantNeedsUpdate(
  existing: {
    label: string;
    lifecycle: StyleVariantLifecycle;
    distribution: {
      userSelectable: boolean;
      defaultEligible: boolean;
      release1Required: boolean;
      hidden: boolean;
      deprecated: boolean;
    } | null;
    currentVersion: { qualityStatus: string } | null;
  },
  desired: GovernanceSnapshotVariant,
): boolean {
  const distribution = existing.distribution;
  if (!distribution) {
    return true;
  }
  return (
    existing.label !== desired.label ||
    existing.lifecycle !== desired.lifecycle ||
    existing.currentVersion?.qualityStatus !== desired.qualityStatus ||
    distribution.userSelectable !== desired.distribution.userSelectable ||
    distribution.defaultEligible !== desired.distribution.defaultEligible ||
    distribution.release1Required !== desired.distribution.release1Required ||
    distribution.hidden !== desired.distribution.hidden ||
    distribution.deprecated !== desired.distribution.deprecated
  );
}

export async function importGovernanceSnapshot(
  db: StyleAdminPrismaClient,
  snapshot: GovernanceSnapshot,
  options: ImportGovernanceSnapshotOptions = {},
): Promise<{ report: GovernanceSnapshotImportReport; summary: string }> {
  const dryRun = options.dryRun ?? false;
  const actor = options.actor ?? "governance-snapshot-import";
  const missingVariantMode = options.missingVariantMode ?? "error";
  const report = createEmptyReport(snapshot, dryRun);

  const existingVariants = await db.styleVariant.findMany({
    include: {
      distribution: true,
      currentVersion: {
        select: {
          id: true,
          qualityStatus: true,
        },
      },
    },
  });

  const existingByRuntimeId = new Map(
    existingVariants.map((variant) => [variant.runtimeVariantId, variant]),
  );

  report.userSelectableTargetBefore = listUserSelectableRuntimeIds(
    existingVariants.map((variant) => ({
      runtimeVariantId: variant.runtimeVariantId,
      distribution: {
        userSelectable: variant.distribution?.userSelectable ?? false,
      },
    })),
  );
  report.userSelectableTargetBeforeCount = report.userSelectableTargetBefore.length;

  report.userSelectableExpected = listUserSelectableRuntimeIds(snapshot.variants);
  report.userSelectableExpectedCount = report.userSelectableExpected.length;

  const targetAfter = new Map<string, GovernanceSnapshotVariant>(
    existingVariants.map((variant) => [
      variant.runtimeVariantId,
      {
        runtimeVariantId: variant.runtimeVariantId,
        label: variant.label,
        lifecycle: variant.lifecycle,
        distribution: {
          userSelectable: variant.distribution?.userSelectable ?? false,
          defaultEligible: variant.distribution?.defaultEligible ?? false,
          release1Required: variant.distribution?.release1Required ?? false,
          hidden: variant.distribution?.hidden ?? false,
          deprecated: variant.distribution?.deprecated ?? false,
        },
        qualityStatus: variant.currentVersion?.qualityStatus ?? "not_checked",
      },
    ]),
  );

  for (const desired of snapshot.variants) {
    const existing = existingByRuntimeId.get(desired.runtimeVariantId);
    if (!existing) {
      report.missing.push(desired.runtimeVariantId);
      const message = `Missing variant in target DB: ${desired.runtimeVariantId}`;
      if (missingVariantMode === "error") {
        report.errors.push(message);
      } else {
        report.warnings.push(message);
      }
      continue;
    }

    targetAfter.set(desired.runtimeVariantId, desired);

    if (existing.lifecycle === "user_selectable" && desired.lifecycle === "paste_qa_pass") {
      report.legacyLifecycleNormalized.push(desired.runtimeVariantId);
    }

    if (existing.label !== desired.label) {
      report.labelDiffCount += 1;
    }
    if (existing.lifecycle !== desired.lifecycle) {
      report.lifecycleDiffCount += 1;
    }
    if (existing.currentVersion?.qualityStatus !== desired.qualityStatus) {
      report.qualityStatusDiffCount += 1;
    }
    if ((existing.distribution?.hidden ?? false) !== desired.distribution.hidden) {
      report.hiddenDiffCount += 1;
    }
    if ((existing.distribution?.deprecated ?? false) !== desired.distribution.deprecated) {
      report.deprecatedDiffCount += 1;
    }

    const needsUpdate = variantNeedsUpdate(existing, desired);
    if (!needsUpdate) {
      report.unchanged += 1;
      continue;
    }

    if (dryRun) {
      report.updated += 1;
      continue;
    }

    let applied = false;

    await db.$transaction(async (tx) => {
      if (existing.label !== desired.label || existing.lifecycle !== desired.lifecycle) {
        await tx.styleVariant.update({
          where: { id: existing.id },
          data: {
            label: desired.label,
            lifecycle: desired.lifecycle,
          },
        });

        if (existing.lifecycle !== desired.lifecycle) {
          await tx.styleVariantLifecycleEvent.create({
            data: {
              variantId: existing.id,
              fromLifecycle: existing.lifecycle,
              toLifecycle: desired.lifecycle,
              reason: "Governance snapshot import",
              actor,
            },
          });
        }
      }

      if (
        existing.currentVersion &&
        existing.currentVersion.qualityStatus !== desired.qualityStatus
      ) {
        await tx.styleVariantVersion.update({
          where: { id: existing.currentVersion.id },
          data: { qualityStatus: desired.qualityStatus },
        });
      }

      if (!existing.distribution) {
        report.errors.push(
          `Missing distribution row for variant ${desired.runtimeVariantId}`,
        );
        return;
      }

      const distribution = existing.distribution;
      const distributionChanged =
        distribution.userSelectable !== desired.distribution.userSelectable ||
        distribution.defaultEligible !== desired.distribution.defaultEligible ||
        distribution.release1Required !== desired.distribution.release1Required ||
        distribution.hidden !== desired.distribution.hidden ||
        distribution.deprecated !== desired.distribution.deprecated;

      if (distributionChanged) {
        const updated = await tx.styleVariantDistribution.update({
          where: { variantId: existing.id },
          data: {
            userSelectable: desired.distribution.userSelectable,
            defaultEligible: desired.distribution.defaultEligible,
            release1Required: desired.distribution.release1Required,
            hidden: desired.distribution.hidden,
            deprecated: desired.distribution.deprecated,
            cacheVersion: { increment: 1 },
            updatedBy: actor,
          },
        });

        await tx.adminAuditLog.create({
          data: {
            action: "import_governance_snapshot_distribution",
            entityType: "style_variant_distribution",
            entityId: updated.id,
            beforeJson: toDistributionSnapshot(distribution),
            afterJson: toDistributionSnapshot(updated),
            reason: "S11-STORY-004 governance snapshot import",
            actor,
          },
        });
      }

      applied = true;
    });

    if (applied) {
      report.updated += 1;
      invalidateUserSelectableVariantPoolCache(existing.blockType);
      invalidateUserSelectableVariantPoolCache();
    }
  }

  report.userSelectableTargetAfter = listUserSelectableRuntimeIds(
    [...targetAfter.values()],
  );
  report.userSelectableTargetAfterCount = report.userSelectableTargetAfter.length;

  const userSelectableDiff = diffSets(
    report.userSelectableExpected,
    report.userSelectableTargetBefore,
  );
  report.userSelectableOnlyInSnapshot = userSelectableDiff.onlyInSnapshot;
  report.userSelectableOnlyInTarget = userSelectableDiff.onlyInTarget;

  seedLifecycleCounts(report, [...targetAfter.values()]);

  if ((report.byLifecycle.user_selectable ?? 0) > 0) {
    report.errors.push(
      "Target lifecycle still contains legacy user_selectable after governance import planning",
    );
  }

  return {
    report,
    summary: formatGovernanceSnapshotImportSummary(report),
  };
}

export function formatGovernanceSnapshotImportSummary(
  report: GovernanceSnapshotImportReport,
): string {
  return [
    `Governance Snapshot Import (${report.dryRun ? "dry-run" : "apply"})`,
    `snapshot_variants=${report.snapshotVariantCount}`,
    `updated=${report.updated}`,
    `unchanged=${report.unchanged}`,
    `missing=${report.missing.length}`,
    `lifecycle.user_selectable=${report.byLifecycle.user_selectable ?? 0}`,
    `userSelectable_expected=${report.userSelectableExpectedCount}`,
    `userSelectable_target_before=${report.userSelectableTargetBeforeCount}`,
    `userSelectable_target_after=${report.userSelectableTargetAfterCount}`,
    `userSelectable_only_in_snapshot=${report.userSelectableOnlyInSnapshot.length}`,
    `userSelectable_only_in_target=${report.userSelectableOnlyInTarget.length}`,
    `lifecycle_diffs=${report.lifecycleDiffCount}`,
    `hidden_diffs=${report.hiddenDiffCount}`,
    `deprecated_diffs=${report.deprecatedDiffCount}`,
    `qualityStatus_diffs=${report.qualityStatusDiffCount}`,
    `warnings=${report.warnings.length}`,
    `errors=${report.errors.length}`,
  ].join(" · ");
}
