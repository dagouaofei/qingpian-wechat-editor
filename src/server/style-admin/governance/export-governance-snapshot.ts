import { normalizeImportLifecycle } from "../import/lifecycle-distribution-mapper";
import type { StyleAdminPrismaClient } from "../prisma";
import {
  GOVERNANCE_SNAPSHOT_SCHEMA_VERSION,
  type GovernanceSnapshot,
} from "./governance-snapshot-types";

export type ExportGovernanceSnapshotOptions = {
  sourceEnvironment?: string;
};

export async function exportGovernanceSnapshot(
  db: StyleAdminPrismaClient,
  options: ExportGovernanceSnapshotOptions = {},
): Promise<GovernanceSnapshot> {
  const variants = await db.styleVariant.findMany({
    include: {
      distribution: true,
      currentVersion: {
        select: {
          qualityStatus: true,
        },
      },
    },
    orderBy: { runtimeVariantId: "asc" },
  });

  return {
    schemaVersion: GOVERNANCE_SNAPSHOT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    sourceEnvironment: options.sourceEnvironment ?? process.env.APP_ENV ?? "unknown",
    variantCount: variants.length,
    variants: variants.map((variant) => ({
      runtimeVariantId: variant.runtimeVariantId,
      label: variant.label,
      lifecycle: normalizeImportLifecycle(variant.lifecycle),
      distribution: {
        userSelectable: variant.distribution?.userSelectable ?? false,
        defaultEligible: variant.distribution?.defaultEligible ?? false,
        release1Required: variant.distribution?.release1Required ?? false,
        hidden: variant.distribution?.hidden ?? false,
        deprecated: variant.distribution?.deprecated ?? false,
      },
      qualityStatus: variant.currentVersion?.qualityStatus ?? "not_checked",
    })),
  };
}
