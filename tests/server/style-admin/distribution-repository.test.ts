import { describe, expect, it, vi } from "vitest";

import { StyleVariantDistributionRepository } from "@/server/style-admin/repositories/style-variant-distribution-repository";

function createMockDb() {
  const auditCreate = vi.fn().mockResolvedValue({ id: "audit-1" });
  const distributionUpdate = vi.fn().mockResolvedValue({
    id: "dist-1",
    variantId: "variant-1",
    userSelectable: false,
    defaultEligible: false,
    release1Required: false,
    hidden: true,
    deprecated: false,
    cacheVersion: 2,
    updatedBy: "admin",
    updatedAt: new Date(),
  });
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

  const tx = {
    styleVariantDistribution: {
      findUnique: distributionFindUnique,
      update: distributionUpdate,
    },
    adminAuditLog: {
      create: auditCreate,
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
    },
  };

  return { db, auditCreate, distributionUpdate, distributionFindUnique };
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
});
