import { beforeEach, describe, expect, it, vi } from "vitest";

const { runCandidateInspectionAndPersist, createManualPasteQaEvidence } = vi.hoisted(() => ({
  runCandidateInspectionAndPersist: vi.fn(),
  createManualPasteQaEvidence: vi.fn(),
}));

vi.mock("@/server/style-admin/inspection/run-candidate-inspection", () => ({
  runCandidateInspectionAndPersist,
  runCandidateInspectionDryRun: vi.fn(),
}));

vi.mock("@/server/style-admin/inspection/candidate-evidence-service", () => ({
  createManualPasteQaEvidence,
}));

import {
  addManualPasteQaEvidenceAction,
  runCandidateInspectionAction,
} from "@/server/style-admin/actions/candidate-inspection";

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

describe("candidate inspection actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.STYLE_ADMIN_WRITE_ENABLED;
    requireStyleAdmin.mockResolvedValue({ username: "ops", actor: "admin:ops" });
    runCandidateInspectionAndPersist.mockResolvedValue({
      ok: true,
      inspection: {},
      validationRunIds: ["run-1"],
      qualityStatus: "validator_pass",
      previousQualityStatus: "not_checked",
    });
    createManualPasteQaEvidence.mockResolvedValue({
      ok: true,
      evidenceId: "evidence-1",
      qualityStatus: "paste_qa_pass",
    });
  });

  it("requires auth for run inspection", async () => {
    requireStyleAdmin.mockRejectedValue(new MockStyleAdminAuthError());
    const result = await runCandidateInspectionAction("heading_html_paste_abcdef01_candidate");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("auth_required");
  });

  it("rejects run when write disabled", async () => {
    process.env.STYLE_ADMIN_WRITE_ENABLED = "false";
    process.env.NODE_ENV = "production";
    const result = await runCandidateInspectionAction("heading_html_paste_abcdef01_candidate");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("write_disabled");
    process.env.NODE_ENV = "test";
  });

  it("passes admin actor to persist inspection", async () => {
    const result = await runCandidateInspectionAction("heading_html_paste_abcdef01_candidate");
    expect(result.ok).toBe(true);
    expect(runCandidateInspectionAndPersist).toHaveBeenCalledWith(
      expect.anything(),
      "heading_html_paste_abcdef01_candidate",
      "admin:ops",
    );
  });

  it("creates manual paste QA evidence with actor", async () => {
    const result = await addManualPasteQaEvidenceAction({
      runtimeVariantId: "heading_html_paste_abcdef01_candidate",
      sourceLabel: "manual local paste qa test",
      status: "pass",
      notes: "manual local paste qa test",
    });
    expect(result.ok).toBe(true);
    expect(createManualPasteQaEvidence).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ actor: "admin:ops", status: "pass" }),
    );
  });
});
