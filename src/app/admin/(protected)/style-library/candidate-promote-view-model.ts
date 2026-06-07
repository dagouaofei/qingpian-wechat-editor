import type { BlockType } from "@/core/blocks";
import type { AdminVariantDetail } from "@/server/style-admin/queries/style-library-admin-query";
import {
  buildCandidatePromoteRuntimeReadiness,
  evaluateCandidatePromoteEligibility,
  isCandidatePromotePanelVisible,
  mergePromoteEligibilityWithRuntimeReadiness,
} from "@/server/style-admin/promote";

export type CandidatePromotePanelViewModel = {
  visible: boolean;
  alreadyPromoted: boolean;
  eligible: boolean;
  blockedReasons: string[];
  lifecycle: string;
  qualityStatus: string | null;
  distribution: {
    userSelectable: boolean;
    defaultEligible: boolean;
    release1Required: boolean;
    hidden: boolean;
    deprecated: boolean;
  };
  sourceType: string | null;
  readinessOk: boolean;
  previewReady: boolean;
  copyReady: boolean;
  compatibilityReady: boolean;
  compatibilityStatus: string;
  runtimeSource: string | null;
  decoderPath: string | null;
  readinessIssues: string[];
  promoteRecords: Array<{
    id: string;
    fromLifecycle: string;
    toLifecycle: string;
    reason: string;
    actor: string;
    createdAt: string;
  }>;
};

export function buildCandidatePromotePanelViewModel(
  detail: AdminVariantDetail,
  promoteRecords: CandidatePromotePanelViewModel["promoteRecords"] = [],
): CandidatePromotePanelViewModel | null {
  const distribution = detail.distribution;
  if (!distribution) {
    return null;
  }

  const primarySource = detail.sources[0] ?? null;
  const visible = isCandidatePromotePanelVisible({
    lifecycle: detail.variant.lifecycle,
    sourceType: primarySource?.sourceType ?? null,
    userSelectable: distribution.userSelectable,
  });

  if (!visible) {
    return null;
  }

  const baseEligibility = evaluateCandidatePromoteEligibility({
    lifecycle: detail.variant.lifecycle,
    sourceType: primarySource?.sourceType ?? null,
    qualityStatus: detail.currentVersion?.qualityStatus ?? null,
    distribution,
    hasCurrentVersion: Boolean(detail.currentVersion),
  });

  const runtimeReadiness = detail.currentVersion
    ? buildCandidatePromoteRuntimeReadiness({
        runtimeVariantId: detail.variant.runtimeVariantId,
        blockType: detail.variant.blockType as BlockType,
        definitionJson: detail.currentVersion.definitionJson,
      })
    : null;

  const runtimeGate = mergePromoteEligibilityWithRuntimeReadiness(
    baseEligibility.eligible ? [] : baseEligibility.blockedReasons,
    runtimeReadiness,
  );

  const blockedReasons = baseEligibility.eligible
    ? runtimeGate.blockedReasons
    : [...new Set([...baseEligibility.blockedReasons, ...runtimeGate.blockedReasons])];

  const eligible = baseEligibility.eligible && runtimeGate.eligible;

  return {
    visible: true,
    alreadyPromoted: distribution.userSelectable,
    eligible,
    blockedReasons,
    lifecycle: detail.variant.lifecycle,
    qualityStatus: detail.currentVersion?.qualityStatus ?? null,
    distribution: {
      userSelectable: distribution.userSelectable,
      defaultEligible: distribution.defaultEligible,
      release1Required: distribution.release1Required,
      hidden: distribution.hidden,
      deprecated: distribution.deprecated,
    },
    sourceType: primarySource?.sourceType ?? null,
    readinessOk: runtimeReadiness?.ok ?? false,
    previewReady: runtimeReadiness?.previewReady ?? false,
    copyReady: runtimeReadiness?.copyReady ?? false,
    compatibilityReady: runtimeReadiness?.compatibilityReady ?? false,
    compatibilityStatus: runtimeReadiness?.compatibilityStatus ?? "failed",
    runtimeSource: runtimeReadiness?.trace.runtimeSource ?? null,
    decoderPath: runtimeReadiness?.trace.decoderPath ?? null,
    readinessIssues: runtimeReadiness?.issues.map((issue) => issue.message) ?? [],
    promoteRecords,
  };
}
