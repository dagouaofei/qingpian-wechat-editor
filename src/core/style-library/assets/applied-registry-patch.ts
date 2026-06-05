import type { StyleLibraryRegistryPatch } from "../types";
import { HEADING_TEAL_SECTION_LABEL_HTML_PASTE_VARIANT_ID } from "@/core/styles/variants/html-paste-candidate-variants";

/** Applied metadata — inactive · documents S9-STORY-007B pool entry without touching default preset. */
export const APPLIED_ADD_HTML_PASTE_TEAL_SECTION_PATCH: StyleLibraryRegistryPatch = {
  patchId: "applied-add-html-paste-teal-section-to-pool",
  operation: "add_to_variant_pool",
  variantId: HEADING_TEAL_SECTION_LABEL_HTML_PASTE_VARIANT_ID,
  targetPresetId: "style_library_inspection_v0",
  requiresLifecycle: "user_selectable",
  requiresEvidenceIds: ["WX-HTML-PASTE-E2E-001", "PASTE-QA-E2E-007B"],
  active: false,
  notes:
    "Applied via S9-STORY-007B · admin inspection preset only · not default preset · not release1_required",
};

export const STYLE_LIBRARY_APPLIED_REGISTRY_PATCHES = [
  APPLIED_ADD_HTML_PASTE_TEAL_SECTION_PATCH,
] as const;
