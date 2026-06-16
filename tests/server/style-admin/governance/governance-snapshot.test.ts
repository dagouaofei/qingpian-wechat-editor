import { describe, expect, it, vi } from "vitest";

import { exportGovernanceSnapshot } from "@/server/style-admin/governance/export-governance-snapshot";
import { importGovernanceSnapshot } from "@/server/style-admin/governance/import-governance-snapshot";
import {
  GOVERNANCE_SNAPSHOT_SCHEMA_VERSION,
  type GovernanceSnapshot,
} from "@/server/style-admin/governance/governance-snapshot-types";
import { parseGovernanceSnapshot } from "@/server/style-admin/governance/validate-governance-snapshot";
import type { StyleAdminPrismaClient } from "@/server/style-admin/prisma";

const sampleSnapshot: GovernanceSnapshot = {
  schemaVersion: GOVERNANCE_SNAPSHOT_SCHEMA_VERSION,
  exportedAt: "2026-06-10T00:00:00.000Z",
  sourceEnvironment: "staging",
  variantCount: 2,
  variants: [
    {
      runtimeVariantId: "heading_card_centered",
      label: "Heading Card Centered",
      lifecycle: "paste_qa_pass",
      distribution: {
        userSelectable: true,
        defaultEligible: false,
        release1Required: false,
        hidden: false,
        deprecated: false,
      },
      qualityStatus: "not_checked",
    },
    {
      runtimeVariantId: "heading_plain_minimal",
      label: "Deprecated heading",
      lifecycle: "deprecated",
      distribution: {
        userSelectable: false,
        defaultEligible: false,
        release1Required: false,
        hidden: true,
        deprecated: true,
      },
      qualityStatus: "copy_fidelity_failed",
    },
  ],
};

describe("governance snapshot export/import", () => {
  it("exports governance fields without secret keys", async () => {
    const db = {
      styleVariant: {
        findMany: vi.fn().mockResolvedValue([
          {
            runtimeVariantId: "heading_card_centered",
            label: "Heading Card Centered",
            lifecycle: "user_selectable",
            distribution: {
              userSelectable: true,
              defaultEligible: false,
              release1Required: false,
              hidden: false,
              deprecated: false,
            },
            currentVersion: { qualityStatus: "not_checked" },
          },
        ]),
      },
    } as unknown as StyleAdminPrismaClient;

    const snapshot = await exportGovernanceSnapshot(db, { sourceEnvironment: "staging" });

    expect(snapshot.sourceEnvironment).toBe("staging");
    expect(snapshot.variants[0]?.lifecycle).toBe("paste_qa_pass");
    expect(snapshot.variants[0]?.distribution.userSelectable).toBe(true);
    expect(JSON.stringify(snapshot)).not.toMatch(/DATABASE_URL|password|session/i);
  });

  it("rejects snapshots containing forbidden secret-like keys", () => {
    expect(() =>
      parseGovernanceSnapshot({
        schemaVersion: 1,
        exportedAt: "2026-06-10T00:00:00.000Z",
        sourceEnvironment: "staging",
        variantCount: 0,
        variants: [],
        DATABASE_URL: "postgres://secret",
      }),
    ).toThrow(/forbidden key/i);
  });

  it("dry-run reports expected userSelectable diff against empty production-like DB", async () => {
    const db = {
      styleVariant: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: "v1",
            runtimeVariantId: "heading_card_centered",
            blockType: "heading",
            label: "Old label",
            lifecycle: "candidate",
            distribution: {
              userSelectable: false,
              defaultEligible: false,
              release1Required: false,
              hidden: false,
              deprecated: false,
            },
            currentVersion: { id: "ver1", qualityStatus: "not_checked" },
          },
          {
            id: "v2",
            runtimeVariantId: "heading_plain_minimal",
            blockType: "heading",
            label: "Deprecated heading",
            lifecycle: "deprecated",
            distribution: {
              userSelectable: false,
              defaultEligible: false,
              release1Required: false,
              hidden: false,
              deprecated: false,
            },
            currentVersion: { id: "ver2", qualityStatus: "not_checked" },
          },
        ]),
      },
      $transaction: vi.fn(),
    } as unknown as StyleAdminPrismaClient;

    const result = await importGovernanceSnapshot(db, sampleSnapshot, { dryRun: true });

    expect(result.report.byLifecycle.user_selectable ?? 0).toBe(0);
    expect(result.report.userSelectableExpectedCount).toBe(1);
    expect(result.report.userSelectableTargetBeforeCount).toBe(0);
    expect(result.report.userSelectableTargetAfterCount).toBe(1);
    expect(result.report.userSelectableOnlyInSnapshot).toEqual(["heading_card_centered"]);
    expect(result.report.updated).toBe(2);
    expect(result.report.missing).toEqual([]);
    expect(db.$transaction).not.toHaveBeenCalled();
  });

  it("records missing runtimeVariantId entries", async () => {
    const db = {
      styleVariant: {
        findMany: vi.fn().mockResolvedValue([]),
      },
      $transaction: vi.fn(),
    } as unknown as StyleAdminPrismaClient;

    const result = await importGovernanceSnapshot(db, sampleSnapshot, { dryRun: true });

    expect(result.report.missing).toEqual([
      "heading_card_centered",
      "heading_plain_minimal",
    ]);
    expect(result.report.errors.length).toBeGreaterThan(0);
  });
});
