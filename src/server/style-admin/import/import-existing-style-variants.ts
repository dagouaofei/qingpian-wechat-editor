import type { StyleAdminPrismaClient } from "../prisma";
import { collectExistingStyleVariants } from "./collect-existing-style-variants";
import type {
  CollectedStyleVariant,
  ImportExistingVariantsOptions,
  ImportExistingVariantsReport,
} from "./import-types";
import {
  createEmptyImportReport,
  formatImportReportSummary,
  seedReportFromCollected,
} from "./import-existing-style-variants-report";
import { StyleVariantImportWriter } from "./style-variant-import-writer";

export type ImportExistingStyleVariantsResult = {
  report: ImportExistingVariantsReport;
  summary: string;
  collected: CollectedStyleVariant[];
};

export async function importExistingStyleVariants(
  db: StyleAdminPrismaClient,
  options: ImportExistingVariantsOptions = {},
): Promise<ImportExistingStyleVariantsResult> {
  const actor = options.actor ?? "style-admin-importer";
  const dryRun = options.dryRun ?? false;
  const collectedResult = collectExistingStyleVariants();
  const collected = collectedResult.variants;

  const report = seedReportFromCollected(
    createEmptyImportReport(dryRun),
    collected,
  );

  if (dryRun) {
    return {
      report,
      summary: formatImportReportSummary(report),
      collected,
    };
  }

  const writer = new StyleVariantImportWriter(db);

  for (const variant of collected) {
    try {
      const result = await writer.upsertCollectedVariant(variant, actor);
      switch (result.action) {
        case "imported":
          report.totalImported += 1;
          break;
        case "updated":
          report.totalUpdated += 1;
          if (result.createdVersion) {
            report.totalCreatedVersions += 1;
          }
          break;
        case "skipped_unchanged":
          report.totalSkippedUnchanged += 1;
          break;
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown import error";
      report.errors.push(`${variant.runtimeVariantId}: ${message}`);
    }
  }

  return {
    report,
    summary: formatImportReportSummary(report),
    collected,
  };
}
