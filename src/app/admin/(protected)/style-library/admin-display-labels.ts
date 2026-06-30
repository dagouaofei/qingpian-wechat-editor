import type { StyleVariantLifecycle } from "@prisma/client";

const LIFECYCLE_LABELS: Record<StyleVariantLifecycle, string> = {
  draft: "Draft",
  candidate: "Candidate",
  validator_pass: "Validator Pass",
  paste_qa_pass: "Paste QA Pass",
  user_selectable: "Legacy (migrating)",
  default_eligible: "Default Eligible",
  release1_required: "Release 1 Required",
  deprecated: "Deprecated",
};

export function formatAdminLifecycleLabel(lifecycle: string): string {
  return LIFECYCLE_LABELS[lifecycle as StyleVariantLifecycle] ?? lifecycle;
}

export function formatAdminBooleanLabel(value: boolean): string {
  return value ? "Yes" : "No";
}
