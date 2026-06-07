import { describe, expect, it } from "vitest";

import { isEligibleForUserSelectablePool } from "@/server/style-admin/mappers";
import { inspectCandidateCopy } from "@/server/style-admin/inspection/candidate-copy-inspector";
import { buildCandidateInspectionFixture } from "@/server/style-admin/inspection/candidate-inspection-fixtures";
import { isCandidateInspectionEligible } from "@/server/style-admin/inspection/candidate-inspection-eligibility";
import { inspectCandidatePreview } from "@/server/style-admin/inspection/candidate-preview-inspector";
import { inspectCandidateValidator } from "@/server/style-admin/inspection/candidate-validator";
import {
  resolveQualityStatusFromInspection,
  resolveQualityStatusFromPasteQa,
} from "@/server/style-admin/inspection/resolve-quality-status";
import { runCandidateInspectionDryRun } from "@/server/style-admin/inspection/run-candidate-inspection";
import type { DbCandidateInspectionSource } from "@/server/style-admin/inspection/candidate-inspection-types";
import { STYLE_SCHEMA_VERSION, TITLE_BLOCK_COMPONENT_ID } from "@/core/styles/types";

function buildHeadingSource(
  overrides: Partial<DbCandidateInspectionSource> = {},
): DbCandidateInspectionSource {
  const runtimeVariantId = "heading_html_paste_abcdef01_candidate";
  return {
    variantId: "variant-1",
    runtimeVariantId,
    blockType: "heading",
    styleFamily: "htmlPaste",
    label: "Test Heading",
    lifecycle: "candidate",
    definitionJson: {
      id: runtimeVariantId,
      schemaVersion: STYLE_SCHEMA_VERSION,
      blockType: "heading",
      family: "htmlPaste",
      name: "test-heading",
      label: "Test Heading",
      status: "experimental",
      slots: {
        title: {
          id: "title",
          role: "title",
          label: "Title",
          binding: { source: "block.content.text", required: true },
          copySafety: { copySafety: "strict", allowedInCopy: true },
        },
      },
      tokens: {
        "typography.size": "18px",
        "border.left": "4px solid #1677ff",
      },
    },
    componentProtocolJson: {
      componentId: TITLE_BLOCK_COMPONENT_ID,
      familyId: "htmlPaste",
      layoutMode: "pill",
    },
    compatibilityJson: { copySafety: "strict" },
    copySafety: "strict",
    qualityStatus: "not_checked",
    versionId: "version-1",
    versionNumber: 1,
    primarySourceType: "html_paste",
    hasRawHtml: true,
    ...overrides,
  };
}

function buildInfoCardSource(): DbCandidateInspectionSource {
  const runtimeVariantId = "info_card_html_paste_abcdef01_candidate";
  return {
    variantId: "variant-2",
    runtimeVariantId,
    blockType: "info_card",
    styleFamily: "htmlPaste",
    label: "Test Info Card",
    lifecycle: "candidate",
    definitionJson: {
      id: runtimeVariantId,
      schemaVersion: STYLE_SCHEMA_VERSION,
      blockType: "info_card",
      family: "htmlPaste",
      name: "test-info-card",
      label: "Test Info Card",
      status: "experimental",
      slots: {
        title: {
          id: "title",
          role: "title",
          label: "Title",
          binding: { source: "block.content.title" },
          copySafety: { copySafety: "strict", allowedInCopy: true },
        },
        body: {
          id: "body",
          role: "body",
          label: "Body",
          binding: { source: "block.content.body", required: true },
          copySafety: { copySafety: "strict", allowedInCopy: true },
        },
      },
      tokens: {
        "surface.background": "#f7f8fa",
        "border.all": "1px solid #e5e7eb",
      },
    },
    componentProtocolJson: { familyId: "htmlPaste", layoutMode: "card" },
    compatibilityJson: { copySafety: "strict" },
    copySafety: "strict",
    qualityStatus: "not_checked",
    versionId: "version-2",
    versionNumber: 1,
    primarySourceType: "html_paste",
    hasRawHtml: true,
  };
}

describe("candidate inspection", () => {
  it("marks html_paste candidate as inspection eligible", () => {
    expect(
      isCandidateInspectionEligible({
        lifecycle: "user_selectable",
        sourceType: "html_paste",
        qualityStatus: "validator_pass",
      }),
    ).toBe(true);
  });

  it("runs heading preview inspection", () => {
    const source = buildHeadingSource();
    const fixture = buildCandidateInspectionFixture("heading", source.runtimeVariantId)!;
    const preview = inspectCandidatePreview(source, fixture);
    expect(preview.ok).toBe(true);
    expect(preview.status).toBe("ok");
    expect(preview.usedAdminFallback).toBe(true);
  });

  it("runs info_card preview inspection", () => {
    const source = buildInfoCardSource();
    const fixture = buildCandidateInspectionFixture("info_card", source.runtimeVariantId)!;
    const preview = inspectCandidatePreview(source, fixture);
    expect(preview.ok).toBe(true);
  });

  it("generates copy html payload for heading candidate", () => {
    const source = buildHeadingSource();
    const fixture = buildCandidateInspectionFixture("heading", source.runtimeVariantId)!;
    const copy = inspectCandidateCopy(source, fixture);
    expect(copy.ok).toBe(true);
    expect(copy.html).toContain("这是一个测试小标题");
    expect(copy.textPlain).toContain("这是一个测试小标题");
  });

  it("resolves validator_pass when preview/copy/validator pass", () => {
    const source = buildHeadingSource();
    const inspection = runCandidateInspectionDryRun(source);
    expect(inspection.validator.valid).toBe(true);
    expect(inspection.resolvedQualityStatus).toBe("validator_pass");
  });

  it("resolves validator_failed when definition is invalid", () => {
    const source = buildHeadingSource({ definitionJson: null });
    const inspection = runCandidateInspectionDryRun(source);
    expect(inspection.resolvedQualityStatus).toBe("validator_failed");
  });

  it("updates paste_qa_pass without making userSelectable", () => {
    const next = resolveQualityStatusFromPasteQa("pass", "validator_pass");
    expect(next).toBe("paste_qa_pass");
    expect(
      isEligibleForUserSelectablePool({
        lifecycle: "candidate",
        distribution: {
          userSelectable: false,
          hidden: false,
          deprecated: false,
          defaultEligible: false,
          release1Required: false,
        },
      }),
    ).toBe(false);
  });

  it("validator_pass does not imply userSelectable pool membership", () => {
    expect(
      isEligibleForUserSelectablePool({
        lifecycle: "candidate",
        distribution: {
          userSelectable: false,
          hidden: false,
          deprecated: false,
          defaultEligible: false,
          release1Required: false,
        },
      }),
    ).toBe(false);
  });

  it("returns unsupported for paragraph blockType", () => {
    const source = buildHeadingSource({ blockType: "paragraph" });
    const inspection = runCandidateInspectionDryRun(source);
    expect(inspection.supported).toBe(false);
    expect(inspection.unsupportedReason).toContain("not supported");
  });

  it("validator flags missing componentProtocol", () => {
    const source = buildHeadingSource({ componentProtocolJson: null });
    const fixture = buildCandidateInspectionFixture("heading", source.runtimeVariantId)!;
    const preview = inspectCandidatePreview(source, fixture);
    const copy = inspectCandidateCopy(source, fixture);
    const validator = inspectCandidateValidator(source, preview, copy);
    expect(validator.structuralIssues).toContain("missing componentProtocolJson");
  });

  it("resolveQualityStatusFromInspection maps copy failure", () => {
    const status = resolveQualityStatusFromInspection({
      preview: {
        ok: true,
        status: "ok",
        blockType: "heading",
        variantId: "x",
        fixtureText: "",
        outputKind: null,
        issues: [],
        usedAdminFallback: false,
      },
      copy: {
        ok: false,
        status: "error",
        blockType: "heading",
        variantId: "x",
        html: null,
        htmlSnippet: null,
        textPlain: null,
        copySafety: "strict",
        usesInlineStyle: false,
        issues: ["failed"],
        usedAdminFallback: false,
      },
      validator: {
        status: "fail",
        valid: false,
        issueCount: 1,
        blockerCount: 1,
        warningCount: 0,
        structuralIssues: [],
        issues: [],
      },
    });
    expect(status).toBe("copy_fidelity_failed");
  });
});
