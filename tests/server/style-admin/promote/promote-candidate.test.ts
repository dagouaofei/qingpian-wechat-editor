import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { clearUserSelectablePoolCache } from "@/server/style-admin/runtime/user-selectable-variant-pool-cache";

const recordAdminAuditLog = vi.fn();
const recordLifecycleEvent = vi.fn();
const recordAlertEvent = vi.fn();
const recordRuntimeError = vi.fn();

const transactionHandlers = vi.hoisted(() => ({
  distributionUpdate: vi.fn(),
  variantUpdate: vi.fn(),
  promoteRecordCreate: vi.fn(),
}));

vi.mock("@/server/style-admin/repositories/style-variant-audit-repository", () => ({
  StyleVariantAuditRepository: class {
    recordAdminAuditLog = recordAdminAuditLog;
    recordLifecycleEvent = recordLifecycleEvent;
    recordAlertEvent = recordAlertEvent;
    recordRuntimeError = recordRuntimeError;
  },
}));

const mockDb = {
  styleVariant: {
    findUnique: vi.fn(),
  },
  $transaction: vi.fn(async (callback: (tx: unknown) => Promise<unknown>) => {
    const tx = {
      styleVariantDistribution: {
        findUnique: vi.fn().mockResolvedValue({
          id: "dist-1",
          variantId: "variant-1",
          userSelectable: false,
          defaultEligible: false,
          release1Required: false,
          hidden: false,
          deprecated: false,
          cacheVersion: 1,
        }),
        update: transactionHandlers.distributionUpdate,
      },
      styleVariant: {
        update: transactionHandlers.variantUpdate,
      },
      styleVariantPromoteRecord: {
        create: transactionHandlers.promoteRecordCreate,
      },
    };
    return callback(tx);
  }),
};

import { promoteCandidateToUserSelectable } from "@/server/style-admin/promote/promote-candidate-to-user-selectable";
import { buildPromoteHeadingVariantDsl } from "../../../fixtures/dsl/promote-heading-variant-dsl";

const RUNTIME_VARIANT_ID = "heading_html_paste_abcdef01_candidate";

function buildEligibleVariant() {
  return {
    id: "variant-1",
    runtimeVariantId: RUNTIME_VARIANT_ID,
    blockType: "heading",
    lifecycle: "candidate",
    distribution: {
      id: "dist-1",
      userSelectable: false,
      defaultEligible: false,
      release1Required: false,
      hidden: false,
      deprecated: false,
      cacheVersion: 1,
    },
    currentVersion: {
      id: "version-1",
      qualityStatus: "paste_qa_pass",
      definitionJson: buildPromoteHeadingVariantDsl(RUNTIME_VARIANT_ID),
    },
    sources: [{ sourceType: "html_paste" }],
  };
}

describe("promoteCandidateToUserSelectable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearUserSelectablePoolCache();
    transactionHandlers.distributionUpdate.mockResolvedValue({
      id: "dist-1",
      userSelectable: true,
      defaultEligible: false,
      release1Required: false,
      hidden: false,
      deprecated: false,
      cacheVersion: 2,
    });
    transactionHandlers.variantUpdate.mockResolvedValue({
      lifecycle: "user_selectable",
    });
    transactionHandlers.promoteRecordCreate.mockResolvedValue({
      id: "promote-1",
    });
  });

  afterEach(() => {
    clearUserSelectablePoolCache();
  });

  it("requires reason", async () => {
    const result = await promoteCandidateToUserSelectable(mockDb as never, {
      runtimeVariantId: "heading_html_paste_abcdef01_candidate",
      reason: "   ",
      actor: "admin:ops",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("reason_required");
    }
  });

  it("blocks validator_pass candidate", async () => {
    mockDb.styleVariant.findUnique.mockResolvedValue({
      ...buildEligibleVariant(),
      currentVersion: { id: "version-1", qualityStatus: "validator_pass" },
    });

    const result = await promoteCandidateToUserSelectable(mockDb as never, {
      runtimeVariantId: "heading_html_paste_abcdef01_candidate",
      reason: "manual test",
      actor: "admin:ops",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("promote_not_eligible");
      expect(result.message).toContain("Paste QA");
    }
    expect(recordAlertEvent).toHaveBeenCalledWith(
      expect.objectContaining({ alertType: "candidate_promote_blocked_by_quality" }),
    );
    expect(mockDb.$transaction).not.toHaveBeenCalled();
  });

  it("blocks paste_qa_pass when DSL preview is not renderable", async () => {
    mockDb.styleVariant.findUnique.mockResolvedValue({
      ...buildEligibleVariant(),
      currentVersion: {
        id: "version-1",
        qualityStatus: "paste_qa_pass",
        definitionJson: {
          version: "s10.variant-dsl.v1",
          id: RUNTIME_VARIANT_ID,
          blockType: "heading",
          copySafety: "strict",
        },
      },
    });

    const result = await promoteCandidateToUserSelectable(mockDb as never, {
      runtimeVariantId: RUNTIME_VARIANT_ID,
      reason: "manual test",
      actor: "admin:ops",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("promote_not_eligible");
      expect(
        result.message.includes("DSL preview") ||
          result.message.includes("schema invalid") ||
          result.message.includes("Variant DSL"),
      ).toBe(true);
    }
    expect(mockDb.$transaction).not.toHaveBeenCalled();
  });

  it("promotes paste_qa_pass candidate and writes records", async () => {
    mockDb.styleVariant.findUnique.mockResolvedValue(buildEligibleVariant());

    const result = await promoteCandidateToUserSelectable(mockDb as never, {
      runtimeVariantId: "heading_html_paste_abcdef01_candidate",
      reason: "manual local promote test",
      actor: "admin:ops",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.distribution.userSelectable).toBe(true);
      expect(result.distribution.defaultEligible).toBe(false);
      expect(result.distribution.release1Required).toBe(false);
      expect(result.lifecycle).toBe("user_selectable");
      expect(result.promoteRecordId).toBe("promote-1");
    }

    expect(transactionHandlers.distributionUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userSelectable: true,
          defaultEligible: false,
          release1Required: false,
          hidden: false,
          deprecated: false,
        }),
      }),
    );
    expect(transactionHandlers.promoteRecordCreate).toHaveBeenCalled();
    expect(recordLifecycleEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        toLifecycle: "user_selectable",
        actor: "admin:ops",
      }),
    );
    expect(recordAdminAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "promote_to_user_selectable",
        entityType: "style_variant",
        actor: "admin:ops",
      }),
    );
  });

  it("returns safe error on transaction failure without leaking secrets", async () => {
    mockDb.styleVariant.findUnique.mockResolvedValue(buildEligibleVariant());
    mockDb.$transaction.mockRejectedValueOnce(new Error("postgresql://secret:pw@host/db"));

    const result = await promoteCandidateToUserSelectable(mockDb as never, {
      runtimeVariantId: "heading_html_paste_abcdef01_candidate",
      reason: "manual test",
      actor: "admin:ops",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe("Promote failed");
      expect(result.message).not.toContain("postgresql://");
    }
    expect(recordRuntimeError).toHaveBeenCalled();
  });
});
