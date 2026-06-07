import { describe, expect, it, vi } from "vitest";

import { StyleVariantDistributionRepository } from "@/server/style-admin/repositories/style-variant-distribution-repository";

function createMockDb() {
  const auditCreate = vi.fn().mockResolvedValue({ id: "audit-1" });
  const distributionUpdate = vi.fn().mockImplementation(
    ({ data }: { data: Record<string, unknown> }) =>
      Promise.resolve({
        id: "dist-1",
        variantId: "variant-1",
        userSelectable: data.userSelectable ?? true,
        defaultEligible: data.defaultEligible ?? false,
        release1Required: data.release1Required ?? false,
        hidden: data.hidden ?? false,
        deprecated: data.deprecated ?? false,
        cacheVersion: 2,
        updatedBy: "admin",
        updatedAt: new Date(),
      }),
  );
  const distributionFindUnique = vi.fn().mockResolvedValue({
    id: "dist-1",
    variantId: "variant-1",
    userSelectable: true,
    defaultEligible: false,
    release1Required: false,
    hidden: false,
    deprecated: false,
    cacheVersion: 1,
    updatedBy: "admin",
    updatedAt: new Date(),
  });

  const rollbackCreate = vi.fn().mockResolvedValue({ id: "rollback-1" });
  const auditFindFirst = vi.fn().mockResolvedValue({
    id: "audit-prev",
    beforeJson: {
      userSelectable: true,
      defaultEligible: false,
      release1Required: false,
      hidden: false,
      deprecated: false,
      cacheVersion: 1,
    },
  });

  const tx = {
    styleVariantDistribution: {
      findUnique: distributionFindUnique,
      update: distributionUpdate,
    },
    adminAuditLog: {
      create: auditCreate,
      findFirst: auditFindFirst,
    },
    styleVariantRollbackRecord: {
      create: rollbackCreate,
    },
  };

  const db = {
    $transaction: vi.fn(async (callback: (client: typeof tx) => unknown) =>
      callback(tx),
    ),
    styleVariantDistribution: {
      findUnique: distributionFindUnique,
      update: distributionUpdate,
    },
    adminAuditLog: {
      create: auditCreate,
      findFirst: auditFindFirst,
    },
    styleVariantRollbackRecord: {
      create: rollbackCreate,
    },
  };

  return {
    db,
    auditCreate,
    distributionUpdate,
    distributionFindUnique,
    rollbackCreate,
    auditFindFirst,
  };
}

describe("StyleVariantDistributionRepository", () => {
  it("records admin audit log when updating distribution", async () => {
    const { db, auditCreate } = createMockDb();
    const repository = new StyleVariantDistributionRepository(db as never);

    const result = await repository.updateDistribution({
      variantId: "variant-1",
      hidden: true,
      reason: "Temporarily hide from user pool",
      actor: "admin",
    });

    expect(result.hidden).toBe(true);
    expect(auditCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        action: "update_distribution",
        entityType: "style_variant_distribution",
        reason: "Temporarily hide from user pool",
        actor: "admin",
      }),
    });
  });

  it("rolls back to previous distribution snapshot with audit and rollback record", async () => {
    const { db, auditCreate, rollbackCreate, distributionUpdate } = createMockDb();
    const repository = new StyleVariantDistributionRepository(db as never);

    const result = await repository.rollbackLastDistributionChange({
      variantId: "variant-1",
      reason: "rollback test",
      actor: "local-admin",
    });

    expect(result.userSelectable).toBe(true);
    expect(distributionUpdate).toHaveBeenCalled();
    expect(rollbackCreate).toHaveBeenCalled();
    expect(auditCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        action: "rollback_distribution",
        reason: "rollback test",
      }),
    });
  });
});
