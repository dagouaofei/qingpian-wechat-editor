import type { StyleLibraryLifecycleState } from "./types";

export const LIFECYCLE_FORWARD_PATH: Record<
  StyleLibraryLifecycleState,
  StyleLibraryLifecycleState | null
> = {
  draft: "candidate",
  candidate: "validator_pass",
  validator_pass: "paste_qa_pass",
  paste_qa_pass: "user_selectable",
  user_selectable: "default_eligible",
  default_eligible: null,
  deprecated: null,
};

export const LIFECYCLE_PROMOTE_STORY = "S9-STORY-007";
export const LIFECYCLE_VALIDATOR_STORY = "S9-STORY-006";

export function isPromoteTransition(target: StyleLibraryLifecycleState): boolean {
  return target === "user_selectable" || target === "default_eligible";
}

export function isEvidenceGatedTransition(
  from: StyleLibraryLifecycleState,
  to: StyleLibraryLifecycleState,
): boolean {
  return (
    (from === "candidate" && to === "validator_pass") ||
    (from === "validator_pass" && to === "paste_qa_pass")
  );
}
