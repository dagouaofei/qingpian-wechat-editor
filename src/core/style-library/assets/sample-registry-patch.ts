import type { StyleLibraryRegistryPatch } from "../types";

/** Inactive sample — documents patch shape; promote applies in S9-STORY-007. */
export const SAMPLE_ADD_HEADING_CANDIDATE_TO_POOL_PATCH: StyleLibraryRegistryPatch =
  {
    patchId: "sample-add-heading-candidate-to-pool",
    operation: "add_to_variant_pool",
    variantId: "heading_purple_chapter_label_candidate",
    targetPresetId: "miaopian-classic",
    requiresLifecycle: "user_selectable",
    requiresEvidenceIds: ["WX-HARVEST-EVIDENCE-001", "PASTE-QA-SESSION-006D"],
    active: false,
    notes: "Sample only · S9-STORY-007 promote applies active patches",
  };

export const STYLE_LIBRARY_SAMPLE_REGISTRY_PATCHES = [
  SAMPLE_ADD_HEADING_CANDIDATE_TO_POOL_PATCH,
] as const;
