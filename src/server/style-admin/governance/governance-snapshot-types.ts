import type { StyleVariantLifecycle, StyleVariantQualityStatus } from "@prisma/client";

export const GOVERNANCE_SNAPSHOT_SCHEMA_VERSION = 1 as const;

export type GovernanceSnapshotDistribution = {
  userSelectable: boolean;
  defaultEligible: boolean;
  release1Required: boolean;
  hidden: boolean;
  deprecated: boolean;
};

export type GovernanceSnapshotVariant = {
  runtimeVariantId: string;
  label: string;
  lifecycle: StyleVariantLifecycle;
  distribution: GovernanceSnapshotDistribution;
  qualityStatus: StyleVariantQualityStatus;
};

export type GovernanceSnapshot = {
  schemaVersion: typeof GOVERNANCE_SNAPSHOT_SCHEMA_VERSION;
  exportedAt: string;
  sourceEnvironment: string;
  variantCount: number;
  variants: GovernanceSnapshotVariant[];
};

export type GovernanceSnapshotImportReport = {
  generatedAt: string;
  dryRun: boolean;
  snapshotExportedAt: string;
  snapshotSourceEnvironment: string;
  snapshotVariantCount: number;
  updated: number;
  unchanged: number;
  missing: string[];
  errors: string[];
  warnings: string[];
  legacyLifecycleNormalized: string[];
  byLifecycle: Record<string, number>;
  userSelectableExpectedCount: number;
  userSelectableExpected: string[];
  userSelectableTargetBeforeCount: number;
  userSelectableTargetBefore: string[];
  userSelectableTargetAfterCount: number;
  userSelectableTargetAfter: string[];
  userSelectableOnlyInSnapshot: string[];
  userSelectableOnlyInTarget: string[];
  hiddenDiffCount: number;
  deprecatedDiffCount: number;
  qualityStatusDiffCount: number;
  lifecycleDiffCount: number;
  labelDiffCount: number;
};
