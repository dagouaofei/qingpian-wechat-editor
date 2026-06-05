/**
 * Harvest-inspired candidate variants (S8-STORY-006C).
 * Test / Matrix only — not in default preset or release1_required.
 */

import { STYLE_SCHEMA_VERSION, TITLE_BLOCK_COMPONENT_ID } from "../types";
import type { SlotDefinition, VariantDefinition } from "../types";

function infoCardHarvestSlots(): Record<string, SlotDefinition> {
  return {
    title: {
      id: "title",
      role: "title",
      label: "Title",
      binding: { source: "block.content.title" },
      copySafety: { copySafety: "strict", allowedInCopy: true },
    },
    body: {
      id: "body",
      role: "body",
      label: "Body",
      binding: { source: "block.content.body", required: true },
      copySafety: { copySafety: "strict", allowedInCopy: true },
    },
  };
}

export const headingPurpleChapterLabelCandidate: VariantDefinition = {
  id: "heading_purple_chapter_label_candidate",
  schemaVersion: STYLE_SCHEMA_VERSION,
  blockType: "heading",
  family: "harvestCandidate",
  name: "heading-purple-chapter-label-candidate",
  label: "Purple Chapter Label (Harvest Candidate)",
  description: "Harvest visual intent · WX-HARVEST-EVIDENCE-001",
  status: "experimental",
  componentProtocol: {
    componentId: TITLE_BLOCK_COMPONENT_ID,
    familyId: "harvestCandidate",
    layoutMode: "pill",
  },
  compatibility: { copySafety: "strict" },
  slots: {
    title: {
      id: "title",
      role: "title",
      label: "Title",
      binding: { source: "block.content.text", required: true },
      copySafety: { copySafety: "strict", allowedInCopy: true },
    },
  },
  tokens: {
    "typography.size": "20px",
    "spacing.block": "24px",
  },
};

export const infoCardReadingPathCandidate: VariantDefinition = {
  id: "info_card_reading_path_candidate",
  schemaVersion: STYLE_SCHEMA_VERSION,
  blockType: "info_card",
  family: "harvestCandidate",
  name: "info-card-reading-path-candidate",
  label: "Reading Path Info Box (Harvest Candidate)",
  description: "Harvest visual intent · WX-HARVEST-EVIDENCE-001",
  status: "experimental",
  compatibility: { copySafety: "strict" },
  slots: infoCardHarvestSlots(),
  tokens: {
    "spacing.block": "16px",
  },
};

export const HARVEST_CANDIDATE_VARIANTS = [
  headingPurpleChapterLabelCandidate,
  infoCardReadingPathCandidate,
] as const;
