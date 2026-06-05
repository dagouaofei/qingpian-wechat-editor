import { STYLE_LIBRARY_EVIDENCE_REFS } from "./assets/evidence-refs";
import { STYLE_LIBRARY_PALETTE_ASSETS } from "./palette-assets";
import { STYLE_LIBRARY_RULE_ASSETS } from "./rule-assets";
import { STYLE_LIBRARY_SAMPLE_REGISTRY_PATCHES } from "./assets/sample-registry-patch";
import {
  STYLE_LIBRARY_SEED_ASSET_IDS,
  STYLE_LIBRARY_SEED_VARIANT_ASSETS,
} from "./assets/seed-variant-assets";
import { STYLE_LIBRARY_ID, STYLE_LIBRARY_SCHEMA_VERSION } from "./tokens";
import type { StyleLibraryLifecycleRef, StyleLibraryManifest } from "./types";

export const STYLE_LIBRARY_LIFECYCLE_REFS: StyleLibraryLifecycleRef[] = [
  {
    refId: "lifecycle-heading-purple-chapter-label-seed",
    variantId: "heading_purple_chapter_label_candidate",
    lifecycle: "paste_qa_pass",
    recordedAt: "2026-06-05",
  },
  {
    refId: "lifecycle-info-card-reading-path-seed",
    variantId: "info_card_reading_path_candidate",
    lifecycle: "paste_qa_pass",
    recordedAt: "2026-06-05",
  },
];

export const STYLE_LIBRARY_MANIFEST: StyleLibraryManifest = {
  schemaVersion: STYLE_LIBRARY_SCHEMA_VERSION,
  libraryId: STYLE_LIBRARY_ID,
  updatedAt: "2026-06-05",
  assets: [
    ...STYLE_LIBRARY_SEED_VARIANT_ASSETS,
    ...STYLE_LIBRARY_PALETTE_ASSETS,
    ...STYLE_LIBRARY_RULE_ASSETS,
  ],
  seedAssetIds: [...STYLE_LIBRARY_SEED_ASSET_IDS],
  registryPatches: [...STYLE_LIBRARY_SAMPLE_REGISTRY_PATCHES],
  evidenceRefs: [...STYLE_LIBRARY_EVIDENCE_REFS],
  lifecycleRefs: STYLE_LIBRARY_LIFECYCLE_REFS,
};
