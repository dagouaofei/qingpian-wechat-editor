import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  hideVariantFromUserPool,
  restoreVariantToUserSelectable,
  rollbackLastDistributionChange,
} from "@/server/style-admin/actions/distribution-governance";
import { clearUserSelectablePoolCache } from "@/server/style-admin/runtime/user-selectable-variant-pool-cache";

const updateDistribution = vi.fn();
const rollbackLastDistributionChangeRepo = vi.fn();
const recordAlertEvent = vi.fn();
const recordRuntimeError = vi.fn();

vi.mock("@/server/style-admin/prisma", () => ({
  prisma: {
    styleVariant: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("@/server/style-admin/repositories/style-variant-distribution-repository", () => ({
  StyleVariantDistributionRepository: class {
    updateDistribution = updateDistribution;
    rollbackLastDistributionChange = rollbackLastDistributionChangeRepo;
  },
}));

vi.mock("@/server/style-admin/repositories/style-variant-audit-repository", () => ({
  StyleVariantAuditRepository: class {
    recordAlertEvent = recordAlertEvent;
    recordRuntimeError = recordRuntimeError;
  },
}));

import { prisma } from "@/server/style-admin/prisma";

const mockedFindUnique = vi.mocked(prisma.styleVariant.findUnique);

describe("distribution governance actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearUserSelectablePoolCache();
    process.env.NODE_ENV = "test";
    delete process.env.STYLE_ADMIN_WRITE_ENABLED;
  });

  afterEach(() => {
    clearUserSelectablePoolCache();
  });

  it("requires reason for hide operation", async () => {
    const result = await hideVariantFromUserPool({
      runtimeVariantId: "heading_teal_section_label_html_paste_candidate",
      reason: "   ",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("reason_required");
    }
  });

  it("hides variant and relies on repository update", async () => {
    mockedFindUnique.mockResolvedValue({
      id: "variant-1",
      runtimeVariantId: "heading_teal_section_label_html_paste_candidate",
      blockType: "heading",
      distribution: {
        id: "dist-1",
        userSelectable: true,
        hidden: false,
        deprecated: false,
        defaultEligible: false,
        release1Required: false,
      },
      currentVersion: {
        qualityStatus: "paste_qa_pass",
      },
    } as never);

    updateDistribution.mockResolvedValue({
      userSelectable: false,
      defaultEligible: false,
      release1Required: false,
      hidden: true,
      deprecated: false,
      cacheVersion: 2,
    });

    const result = await hideVariantFromUserPool({
      runtimeVariantId: "heading_teal_section_label_html_paste_candidate",
      reason: "manual local test hide",
    });

    expect(result.ok).toBe(true);
    expect(updateDistribution).toHaveBeenCalledWith(
      expect.objectContaining({
        hidden: true,
        userSelectable: false,
        reason: "manual local test hide",
      }),
    );
  });

  it("blocks restore when qualityStatus is copy_fidelity_failed", async () => {
    mockedFindUnique.mockResolvedValue({
      id: "variant-2",
      runtimeVariantId: "heading_magazine_left_bar",
      blockType: "heading",
      distribution: {
        id: "dist-2",
        userSelectable: false,
        hidden: true,
        deprecated: false,
        defaultEligible: false,
        release1Required: true,
      },
      currentVersion: {
        qualityStatus: "copy_fidelity_failed",
      },
    } as never);

    const result = await restoreVariantToUserSelectable({
      runtimeVariantId: "heading_magazine_left_bar",
      reason: "should fail",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("restore_blocked_by_quality");
    }
    expect(recordAlertEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        alertType: "variant_restore_blocked_by_quality",
      }),
    );
    expect(updateDistribution).not.toHaveBeenCalled();
  });

  it("rolls back last distribution change via repository", async () => {
    mockedFindUnique.mockResolvedValue({
      id: "variant-1",
      runtimeVariantId: "heading_teal_section_label_html_paste_candidate",
      blockType: "heading",
      distribution: { id: "dist-1" },
      currentVersion: { qualityStatus: "paste_qa_pass" },
    } as never);

    rollbackLastDistributionChangeRepo.mockResolvedValue({
      userSelectable: true,
      defaultEligible: false,
      release1Required: false,
      hidden: false,
      deprecated: false,
      cacheVersion: 3,
    });

    const result = await rollbackLastDistributionChange({
      runtimeVariantId: "heading_teal_section_label_html_paste_candidate",
      reason: "rollback test",
    });

    expect(result.ok).toBe(true);
    expect(rollbackLastDistributionChangeRepo).toHaveBeenCalled();
  });
});
