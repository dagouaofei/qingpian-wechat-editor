import type { CollectedStyleVariant } from "./import-types";
import type { ImportExistingVariantsReport } from "./import-types";

export function createEmptyImportReport(dryRun: boolean): ImportExistingVariantsReport {
  return {
    generatedAt: new Date().toISOString(),
    dryRun,
    totalCollected: 0,
    totalImported: 0,
    totalUpdated: 0,
    totalSkippedUnchanged: 0,
    totalCreatedVersions: 0,
    byBlockType: {},
    byLifecycle: {},
    byDistribution: {
      userSelectable: 0,
      defaultEligible: 0,
      release1Required: 0,
      hidden: 0,
      deprecated: 0,
    },
    missingCompatibility: [],
    missingComponentProtocol: [],
    deprecatedImported: [],
    userSelectableImported: [],
    release1RequiredImported: [],
    candidateImported: [],
    historicalFirstWave33Imported: [],
    warnings: [],
    errors: [],
  };
}

export function seedReportFromCollected(
  report: ImportExistingVariantsReport,
  collected: CollectedStyleVariant[],
): ImportExistingVariantsReport {
  report.totalCollected = collected.length;

  for (const variant of collected) {
    report.byBlockType[variant.blockType] =
      (report.byBlockType[variant.blockType] ?? 0) + 1;
    report.byLifecycle[variant.lifecycle] =
      (report.byLifecycle[variant.lifecycle] ?? 0) + 1;

    if (variant.distribution.userSelectable) {
      report.byDistribution.userSelectable += 1;
    }
    if (variant.distribution.defaultEligible) {
      report.byDistribution.defaultEligible += 1;
    }
    if (variant.distribution.release1Required) {
      report.byDistribution.release1Required += 1;
    }
    if (variant.distribution.hidden) {
      report.byDistribution.hidden += 1;
    }
    if (variant.distribution.deprecated) {
      report.byDistribution.deprecated += 1;
    }

    if (!variant.compatibilityJson) {
      report.missingCompatibility.push(variant.runtimeVariantId);
    }
    if (!variant.componentProtocolJson) {
      report.missingComponentProtocol.push(variant.runtimeVariantId);
    }
    if (variant.lifecycle === "deprecated" || variant.distribution.deprecated) {
      report.deprecatedImported.push(variant.runtimeVariantId);
    }
    if (variant.distribution.userSelectable) {
      report.userSelectableImported.push(variant.runtimeVariantId);
    }
    if (variant.distribution.release1Required) {
      report.release1RequiredImported.push(variant.runtimeVariantId);
    }
    if (
      variant.lifecycle === "candidate" ||
      variant.lifecycle === "paste_qa_pass" ||
      variant.registryStatus === "experimental"
    ) {
      report.candidateImported.push(variant.runtimeVariantId);
    }
    if (variant.isHistoricalFirstWave33) {
      report.historicalFirstWave33Imported.push(variant.runtimeVariantId);
    }
    if (variant.warnings?.length) {
      report.warnings.push(...variant.warnings);
    }
  }

  return report;
}

export function formatImportReportSummary(
  report: ImportExistingVariantsReport,
): string {
  return [
    `Style Admin Import Report (${report.dryRun ? "dry-run" : "apply"})`,
    `collected=${report.totalCollected}`,
    `imported=${report.totalImported}`,
    `updated=${report.totalUpdated}`,
    `skipped_unchanged=${report.totalSkippedUnchanged}`,
    `created_versions=${report.totalCreatedVersions}`,
    `user_selectable=${report.byDistribution.userSelectable}`,
    `release1_required=${report.byDistribution.release1Required}`,
    `deprecated=${report.byDistribution.deprecated}`,
    `historical_first_wave_33=${report.historicalFirstWave33Imported.length}`,
    `warnings=${report.warnings.length}`,
    `errors=${report.errors.length}`,
  ].join(" · ");
}
