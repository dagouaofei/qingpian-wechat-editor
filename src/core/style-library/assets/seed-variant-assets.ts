import type { StyleLibraryVariantAsset } from "../types";

const SEED_DISTRIBUTION = {
  userSelectable: false,
  defaultEligible: false,
  release1Required: false,
} as const;

export const HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET: StyleLibraryVariantAsset = {
  assetId: "seed-variant-heading-purple-chapter-label",
  assetType: "variant",
  label: "Purple Chapter Label (Harvest Seed)",
  description:
    "S8-STORY-006D harvest seed · candidate-paste-pass · not user-selectable",
  sourceType: "code",
  lifecycle: "paste_qa_pass",
  distribution: { ...SEED_DISTRIBUTION },
  updatedAt: "2026-06-05",
  runtimeVariantId: "heading_purple_chapter_label_candidate",
  blockType: "heading",
  styleFamily: "harvestCandidate",
  isSeedAsset: true,
  evidenceIds: ["WX-HARVEST-EVIDENCE-001", "S8M-HARVEST-001", "PASTE-QA-SESSION-006D"],
  tags: ["seed", "harvest", "006d"],
};

export const INFO_CARD_READING_PATH_SEED_ASSET: StyleLibraryVariantAsset = {
  assetId: "seed-variant-info-card-reading-path",
  assetType: "variant",
  label: "Reading Path Info Box (Harvest Seed)",
  description:
    "S8-STORY-006D harvest seed · candidate-paste-pass · not user-selectable",
  sourceType: "code",
  lifecycle: "paste_qa_pass",
  distribution: { ...SEED_DISTRIBUTION },
  updatedAt: "2026-06-05",
  runtimeVariantId: "info_card_reading_path_candidate",
  blockType: "info_card",
  styleFamily: "harvestCandidate",
  isSeedAsset: true,
  evidenceIds: ["WX-HARVEST-EVIDENCE-001", "S8M-HARVEST-002", "PASTE-QA-SESSION-006D"],
  tags: ["seed", "harvest", "006d"],
};

export const STYLE_LIBRARY_SEED_VARIANT_ASSETS = [
  HEADING_PURPLE_CHAPTER_LABEL_SEED_ASSET,
  INFO_CARD_READING_PATH_SEED_ASSET,
] as const;

export const STYLE_LIBRARY_SEED_ASSET_IDS = STYLE_LIBRARY_SEED_VARIANT_ASSETS.map(
  (asset) => asset.assetId,
);

export const STYLE_LIBRARY_SEED_RUNTIME_VARIANT_IDS =
  STYLE_LIBRARY_SEED_VARIANT_ASSETS.map((asset) => asset.runtimeVariantId);
