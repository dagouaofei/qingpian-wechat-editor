import type { RuntimeVariantPoolIssue } from "@/lib/user-selectable-variant-pool-types";

const SENSITIVE_VALUE_PATTERN =
  /DATABASE_URL|postgresql:\/\/|postgres:\/\/|@(?:[\w.-]+:)?[\w.-]+(?::\d+)?|prisma:|P\d{4,5}/i;

function sanitizeText(value: string): string {
  if (SENSITIVE_VALUE_PATTERN.test(value)) {
    return "Database is not configured or unavailable.";
  }
  return value;
}

export function sanitizeDevPoolNotice(notice?: string): string | undefined {
  if (!notice) {
    return undefined;
  }
  return sanitizeText(notice);
}

export function sanitizeDevPoolIssues(
  issues: RuntimeVariantPoolIssue[],
): RuntimeVariantPoolIssue[] {
  return issues.map((issue) => ({
    runtimeVariantId: issue.runtimeVariantId,
    code: issue.code,
    message: sanitizeText(issue.message),
  }));
}
