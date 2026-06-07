import { validateWechatCopyHtml } from "@/core/copy";

import type {
  CandidateCopyInspection,
  CandidatePreviewInspection,
  CandidateValidatorInspection,
  DbCandidateInspectionSource,
} from "./candidate-inspection-types";
import { isSupportedInspectionBlockType } from "./candidate-inspection-eligibility";

function deriveValidatorStatus(
  valid: boolean,
  warningCount: number,
  failed: boolean,
): CandidateValidatorInspection["status"] {
  if (failed || !valid) {
    return "fail";
  }
  if (warningCount > 0) {
    return "warning";
  }
  return "pass";
}

export function inspectCandidateStructure(
  source: DbCandidateInspectionSource,
  preview: CandidatePreviewInspection,
  copy: CandidateCopyInspection,
): string[] {
  const issues: string[] = [];

  if (!isSupportedInspectionBlockType(source.blockType)) {
    issues.push(`blockType ${source.blockType} is not supported in S10-STORY-010`);
  }

  if (!source.componentProtocolJson) {
    issues.push("missing componentProtocolJson");
  }

  if (!source.compatibilityJson) {
    issues.push("missing compatibilityJson");
  }

  if (!preview.ok) {
    issues.push("preview inspection failed");
  }

  if (!copy.ok || copy.html == null) {
    issues.push("copy html inspection failed or empty payload");
  }

  if (copy.html) {
    const lower = copy.html.toLowerCase();
    if (lower.includes("<script")) {
      issues.push("copy html contains script tag");
    }
    if (/\son[a-z]+\s*=/.test(lower)) {
      issues.push("copy html contains event handler attribute");
    }
  }

  return issues;
}

export function inspectCandidateValidator(
  source: DbCandidateInspectionSource,
  preview: CandidatePreviewInspection,
  copy: CandidateCopyInspection,
): CandidateValidatorInspection {
  const structuralIssues = inspectCandidateStructure(source, preview, copy);

  if (!isSupportedInspectionBlockType(source.blockType)) {
    return {
      status: "fail",
      valid: false,
      issueCount: structuralIssues.length,
      blockerCount: structuralIssues.length,
      warningCount: 0,
      structuralIssues,
      issues: structuralIssues.map((message) => ({ level: "error", message })),
    };
  }

  if (!copy.html) {
    return {
      status: "fail",
      valid: false,
      issueCount: structuralIssues.length,
      blockerCount: structuralIssues.length,
      warningCount: 0,
      structuralIssues,
      issues: structuralIssues.map((message) => ({ level: "error", message })),
    };
  }

  const validation = validateWechatCopyHtml({
    html: copy.html,
    blockType: source.blockType,
    variantId: source.runtimeVariantId,
  });

  const blockerCount = validation.errors.length + structuralIssues.length;
  const warningCount = validation.warnings.length;
  const issues = [
    ...structuralIssues.map((message) => ({ level: "error", message, code: "structural" })),
    ...validation.issues.map((issue) => ({
      level: issue.level ?? "error",
      message: issue.message,
      code: issue.code,
    })),
  ];

  const status = deriveValidatorStatus(
    validation.valid && structuralIssues.length === 0,
    warningCount,
    !preview.ok || !copy.ok || !validation.valid || structuralIssues.length > 0,
  );

  return {
    status,
    valid: status !== "fail",
    issueCount: issues.length,
    blockerCount,
    warningCount,
    structuralIssues,
    issues,
  };
}
