import type { EncoderIssue } from "@/core/dsl/encoder";
import type { CompatibilityTransformResult } from "@/core/wechat-compatibility";
import type { WechatCompatibilityIssue } from "@/core/wechat-compatibility";

export type HarvestIssueSeverity = "info" | "warning" | "risk" | "blocking";

export type HarvestIssue = {
  severity: HarvestIssueSeverity;
  code: string;
  message: string;
  path?: string;
};

export type HarvestLossReportEntry = {
  code: string;
  message: string;
};

const BLOCKING_ENCODER_CODES = new Set(["no_extractable_text", "invalid_html_structure"]);

function classifyContractIssue(issue: WechatCompatibilityIssue): HarvestIssueSeverity {
  const code = issue.code.toUpperCase();
  const message = issue.message.toLowerCase();

  if (issue.code === "script_forbidden" || issue.code === "event_handler_forbidden") {
    return "risk";
  }

  if (
    message.includes("flex") ||
    message.includes("nesting depth") ||
    message.includes("letter-spacing") ||
    message.includes("yellow") ||
    code.includes("YELLOW") ||
    code.includes("NESTING") ||
    code.includes("FLEX")
  ) {
    return "risk";
  }

  if (message.includes("no inline style") || issue.level === "warning") {
    return "warning";
  }

  if (issue.level === "error") {
    return "risk";
  }

  return "info";
}

export function mapTransformToLossReport(
  transform: CompatibilityTransformResult,
): HarvestLossReportEntry[] {
  const entries: HarvestLossReportEntry[] = [];

  for (const issue of transform.issues) {
    if (issue.startsWith("removed_forbidden_tag:")) {
      entries.push({
        code: "security_removed",
        message: `Removed forbidden tag: ${issue.replace("removed_forbidden_tag:", "")}`,
      });
    } else if (issue.startsWith("downgraded_tag:")) {
      entries.push({
        code: "tag_downgraded",
        message: issue.replace("downgraded_tag:", "Downgraded tag: "),
      });
    } else {
      entries.push({ code: "transform", message: issue });
    }
  }

  for (const tag of transform.downgraded) {
    entries.push({
      code: "style_downgraded",
      message: `Downgraded incompatible element: ${tag}`,
    });
  }

  return entries;
}

export function mapWechatIssuesToHarvestIssues(
  issues: WechatCompatibilityIssue[],
): HarvestIssue[] {
  return issues.map((issue) => ({
    severity: classifyContractIssue(issue),
    code: issue.code,
    message: issue.message,
    path: issue.tag ? `tag:${issue.tag}` : issue.property ? `style:${issue.property}` : undefined,
  }));
}

export function mapEncoderIssuesToHarvestIssues(issues: EncoderIssue[]): HarvestIssue[] {
  return issues.map((issue) => ({
    severity: BLOCKING_ENCODER_CODES.has(issue.code) ? "blocking" : "warning",
    code: issue.code,
    message: issue.message,
  }));
}

export function mergeHarvestIssues(...groups: HarvestIssue[][]): HarvestIssue[] {
  const seen = new Set<string>();
  const merged: HarvestIssue[] = [];
  for (const group of groups) {
    for (const issue of group) {
      const key = `${issue.severity}:${issue.code}:${issue.message}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(issue);
    }
  }
  return merged;
}

export function canCreateHarvestCandidate(issues: HarvestIssue[]): boolean {
  return !issues.some((issue) => issue.severity === "blocking");
}

export function highestHarvestSeverity(
  issues: HarvestIssue[],
): HarvestIssueSeverity | null {
  const order: HarvestIssueSeverity[] = ["blocking", "risk", "warning", "info"];
  for (const severity of order) {
    if (issues.some((issue) => issue.severity === severity)) {
      return severity;
    }
  }
  return null;
}
