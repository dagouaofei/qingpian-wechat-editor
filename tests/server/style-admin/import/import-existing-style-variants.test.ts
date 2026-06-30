import { describe, expect, it, vi } from "vitest";

import { collectExistingStyleVariants } from "@/server/style-admin/import/collect-existing-style-variants";
import { importExistingStyleVariants } from "@/server/style-admin/import/import-existing-style-variants";
import type { StyleAdminPrismaClient } from "@/server/style-admin/prisma";
import { StyleVariantImportWriter } from "@/server/style-admin/import/style-variant-import-writer";

describe("importExistingStyleVariants", () => {
  it("dry-run does not write to DB", async () => {
    const db = {
      styleVariant: { findUnique: vi.fn() },
      $transaction: vi.fn(),
    } as unknown as StyleAdminPrismaClient;

    const result = await importExistingStyleVariants(db, { dryRun: true });

    expect(result.report.dryRun).toBe(true);
    expect(result.report.totalCollected).toBeGreaterThan(0);
    expect(db.$transaction).not.toHaveBeenCalled();
  });

  it("builds report summary with collected counts", async () => {
    const result = await importExistingStyleVariants({} as StyleAdminPrismaClient, {
      dryRun: true,
    });

    expect(result.summary).toContain("collected=");
    expect(result.report.historicalFirstWave33Imported.length).toBe(33);
    expect(result.report.userSelectableImported).toHaveLength(0);
  });

  it("reports release1_required lifecycle separately from default_eligible", async () => {
    const result = await importExistingStyleVariants({} as StyleAdminPrismaClient, {
      dryRun: true,
    });

    expect(result.report.byLifecycle.release1_required).toBe(92);
    expect(result.report.byLifecycle.default_eligible ?? 0).toBe(0);
    expect(result.report.byDistribution.release1Required).toBe(92);
    expect(result.report.byDistribution.defaultEligible).toBe(0);
    expect(result.report.byDistribution.userSelectable).toBe(0);
    expect(result.report.byLifecycle.user_selectable ?? 0).toBe(0);
    expect(result.report.legacySourceTypeCount).toBe(0);
  });

  it("does not seed userSelectable from legacy lifecycle during code import", async () => {
    const result = await importExistingStyleVariants({} as StyleAdminPrismaClient, {
      dryRun: true,
    });

    expect(result.report.userSelectableImported).not.toContain(
      "heading_teal_section_label_html_paste_candidate",
    );
  });

  it("repeated import skips unchanged variants", async () => {
    const collected = collectExistingStyleVariants().variants[0]!;
    const existingVariant = {
      id: "variant-1",
      runtimeVariantId: collected.runtimeVariantId,
      blockType: collected.blockType,
      styleFamily: collected.styleFamily,
      label: collected.label,
      description: collected.description,
      lifecycle: collected.lifecycle,
      currentVersionId: "version-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const writer = new StyleVariantImportWriter({
      styleVariant: {
        findUnique: vi.fn().mockResolvedValue(existingVariant),
      },
      styleVariantVersion: {
        findFirst: vi.fn().mockResolvedValue({
          id: "version-1",
          variantId: "variant-1",
          versionNumber: 1,
          sourceChecksum: collected.sourceChecksum,
          qualityStatus: collected.qualityStatus,
        }),
      },
      styleVariantDistribution: {
        findUnique: vi.fn().mockResolvedValue({
          id: "dist-1",
          variantId: "variant-1",
          userSelectable: collected.distribution.userSelectable,
          defaultEligible: collected.distribution.defaultEligible,
          release1Required: collected.distribution.release1Required,
          hidden: collected.distribution.hidden,
          deprecated: collected.distribution.deprecated,
          cacheVersion: 0,
          updatedBy: "admin",
          updatedAt: new Date(),
        }),
      },
      styleVariantSource: {
        findFirst: vi.fn().mockResolvedValue({
          id: "source-1",
          variantId: "variant-1",
          sourceRef: collected.sourceRef,
          sourceMetadata: collected.sourceMetadata,
        }),
      },
      $transaction: vi.fn(async (callback) =>
        callback({
          styleVariant: {
            update: vi.fn(),
          },
          styleVariantVersion: {
            findFirst: vi.fn().mockResolvedValue({
              id: "version-1",
              versionNumber: 1,
              sourceChecksum: collected.sourceChecksum,
              qualityStatus: collected.qualityStatus,
            }),
            update: vi.fn(),
            create: vi.fn(),
          },
          styleVariantDistribution: {
            findUnique: vi.fn().mockResolvedValue({
              id: "dist-1",
              variantId: "variant-1",
              userSelectable: collected.distribution.userSelectable,
              defaultEligible: collected.distribution.defaultEligible,
              release1Required: collected.distribution.release1Required,
              hidden: collected.distribution.hidden,
              deprecated: collected.distribution.deprecated,
              cacheVersion: 0,
              updatedBy: "admin",
              updatedAt: new Date(),
            }),
            update: vi.fn(),
          },
          styleVariantSource: {
            findFirst: vi.fn().mockResolvedValue({
              sourceMetadata: collected.sourceMetadata,
            }),
            create: vi.fn(),
          },
          styleVariantLifecycleEvent: { create: vi.fn() },
          adminAuditLog: { create: vi.fn() },
        }),
      ),
    } as unknown as StyleAdminPrismaClient);

    const first = await writer.upsertCollectedVariant(collected, "tester");
    const second = await writer.upsertCollectedVariant(collected, "tester");

    expect(first.action).toBe("skipped_unchanged");
    expect(second.action).toBe("skipped_unchanged");
  });
});
