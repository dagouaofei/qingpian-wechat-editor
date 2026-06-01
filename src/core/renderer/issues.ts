import type { BlockType } from "@/core/blocks";

import type {
  RendererIssue,
  RendererIssueCode,
  RendererIssueSeverity,
} from "./types";

export type CreateRendererIssueOptions = {
  code: RendererIssueCode;
  message: string;
  severity?: RendererIssueSeverity;
  blockId?: string;
  blockType?: BlockType;
  variantId?: string;
  slotId?: string;
  path?: Array<string | number>;
  details?: Record<string, string | boolean | number>;
};

export function createRendererIssue(
  options: CreateRendererIssueOptions,
): RendererIssue {
  return {
    severity: options.severity ?? defaultSeverityForCode(options.code),
    code: options.code,
    message: options.message,
    blockId: options.blockId,
    blockType: options.blockType,
    variantId: options.variantId,
    slotId: options.slotId,
    path: options.path,
    details: options.details,
  };
}

function defaultSeverityForCode(code: RendererIssueCode): RendererIssueSeverity {
  switch (code) {
    case "copy_safety_warning":
      return "warning";
    case "optional_slot_disabled":
      return "info";
    default:
      return "error";
  }
}

export function partitionRendererIssues(issues: RendererIssue[]): {
  errors: RendererIssue[];
  warnings: RendererIssue[];
} {
  const errors: RendererIssue[] = [];
  const warnings: RendererIssue[] = [];

  for (const issue of issues) {
    if (issue.severity === "warning" || issue.severity === "info") {
      warnings.push(issue);
    } else {
      errors.push(issue);
    }
  }

  return { errors, warnings };
}
