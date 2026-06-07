import { beforeEach, describe, expect, it, vi } from "vitest";

const { promoteCandidateToUserSelectable } = vi.hoisted(() => ({
  promoteCandidateToUserSelectable: vi.fn(),
}));

vi.mock("@/server/style-admin/promote", () => ({
  promoteCandidateToUserSelectable,
}));

const { requireStyleAdmin } = vi.hoisted(() => ({
  requireStyleAdmin: vi.fn(),
}));

const { MockStyleAdminAuthError, MockStyleAdminWriteDisabledError } = vi.hoisted(() => {
  class MockStyleAdminAuthError extends Error {
    readonly code = "style_admin_auth_required";
  }
  class MockStyleAdminWriteDisabledError extends Error {
    readonly code = "style_admin_write_disabled";
  }
  return { MockStyleAdminAuthError, MockStyleAdminWriteDisabledError };
});

vi.mock("@/server/style-admin/auth", () => ({
  requireStyleAdmin,
  getStyleAdminActor: (admin: { actor: string }) => admin.actor,
  StyleAdminAuthError: MockStyleAdminAuthError,
  StyleAdminAuthNotConfiguredError: class extends Error {
    readonly code = "style_admin_auth_not_configured";
  },
}));

vi.mock("@/server/style-admin/admin-write-guard", () => ({
  assertStyleAdminWriteAllowed: vi.fn(() => {
    if (process.env.STYLE_ADMIN_WRITE_ENABLED === "false") {
      throw new MockStyleAdminWriteDisabledError();
    }
  }),
  StyleAdminWriteDisabledError: MockStyleAdminWriteDisabledError,
}));

vi.mock("@/server/style-admin/prisma", () => ({
  prisma: {},
}));

import { promoteCandidateToUserSelectableAction } from "@/server/style-admin/actions/promote-candidate";

describe("promoteCandidateToUserSelectableAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.STYLE_ADMIN_WRITE_ENABLED;
    requireStyleAdmin.mockResolvedValue({ username: "ops", actor: "admin:ops" });
    promoteCandidateToUserSelectable.mockResolvedValue({
      ok: true,
      runtimeVariantId: "heading_html_paste_abcdef01_candidate",
      lifecycle: "user_selectable",
      distribution: {
        userSelectable: true,
        defaultEligible: false,
        release1Required: false,
        hidden: false,
        deprecated: false,
        cacheVersion: 2,
      },
      promoteRecordId: "promote-1",
    });
  });

  it("requires auth", async () => {
    requireStyleAdmin.mockRejectedValue(new MockStyleAdminAuthError());
    const result = await promoteCandidateToUserSelectableAction({
      runtimeVariantId: "heading_html_paste_abcdef01_candidate",
      reason: "manual test",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("auth_required");
    }
  });

  it("delegates to promote service with admin actor", async () => {
    const result = await promoteCandidateToUserSelectableAction({
      runtimeVariantId: "heading_html_paste_abcdef01_candidate",
      reason: "manual local promote test",
    });
    expect(result.ok).toBe(true);
    expect(promoteCandidateToUserSelectable).toHaveBeenCalledWith(
      {},
      expect.objectContaining({
        runtimeVariantId: "heading_html_paste_abcdef01_candidate",
        reason: "manual local promote test",
        actor: "admin:ops",
      }),
    );
  });

  it("blocks when write guard is disabled", async () => {
    process.env.STYLE_ADMIN_WRITE_ENABLED = "false";
    const result = await promoteCandidateToUserSelectableAction({
      runtimeVariantId: "heading_html_paste_abcdef01_candidate",
      reason: "manual test",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("write_disabled");
    }
  });
});
