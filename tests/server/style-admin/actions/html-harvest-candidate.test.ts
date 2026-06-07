import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { createHtmlHarvestCandidate } = vi.hoisted(() => ({
  createHtmlHarvestCandidate: vi.fn(),
}));

vi.mock("@/server/style-admin/harvest", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/server/style-admin/harvest")>();
  return {
    ...actual,
    createHtmlHarvestCandidate,
    previewHtmlHarvestCandidate: vi.fn(),
  };
});

import { createHtmlHarvestCandidateAction } from "@/server/style-admin/actions/html-harvest-candidate";

const { requireStyleAdmin } = vi.hoisted(() => ({
  requireStyleAdmin: vi.fn(),
}));

const { MockStyleAdminAuthError, MockStyleAdminWriteDisabledError } = vi.hoisted(() => {
  class MockStyleAdminAuthError extends Error {
    readonly code = "style_admin_auth_required";
    constructor(message = "Admin authentication is required for this action.") {
      super(message);
      this.name = "StyleAdminAuthError";
    }
  }

  class MockStyleAdminWriteDisabledError extends Error {
    readonly code = "style_admin_write_disabled";
    constructor(message = "Write disabled") {
      super(message);
      this.name = "StyleAdminWriteDisabledError";
    }
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

const HEADING_HTML = `<section style="padding: 8px 0; border-left: 4px solid #1677ff;">
  <span style="font-size: 18px; font-weight: 700; color: #111;">测试</span>
</section>`;

describe("createHtmlHarvestCandidateAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.STYLE_ADMIN_WRITE_ENABLED;
    requireStyleAdmin.mockResolvedValue({
      username: "ops",
      actor: "admin:ops",
    });
    createHtmlHarvestCandidate.mockResolvedValue({
      ok: true,
      action: "created",
      runtimeVariantId: "heading_html_paste_abcdef01_candidate",
      draft: {},
    });
  });

  afterEach(() => {
    delete process.env.STYLE_ADMIN_WRITE_ENABLED;
  });

  it("rejects unauthenticated create", async () => {
    requireStyleAdmin.mockRejectedValue(new MockStyleAdminAuthError());
    const result = await createHtmlHarvestCandidateAction({
      sourceLabel: "test",
      rawHtml: HEADING_HTML,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe("auth_required");
    expect(createHtmlHarvestCandidate).not.toHaveBeenCalled();
  });

  it("rejects create when write is disabled", async () => {
    process.env.STYLE_ADMIN_WRITE_ENABLED = "false";
    process.env.NODE_ENV = "production";
    const result = await createHtmlHarvestCandidateAction({
      sourceLabel: "test",
      rawHtml: HEADING_HTML,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe("write_disabled");
    expect(createHtmlHarvestCandidate).not.toHaveBeenCalled();
    process.env.NODE_ENV = "test";
  });

  it("passes admin actor to harvest create", async () => {
    const result = await createHtmlHarvestCandidateAction({
      sourceLabel: "test",
      rawHtml: HEADING_HTML,
    });
    expect(result.ok).toBe(true);
    expect(createHtmlHarvestCandidate).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ actor: "admin:ops" }),
    );
  });
});
