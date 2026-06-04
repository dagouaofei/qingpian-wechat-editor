/**
 * Style Assignment contract — StyleSelectionRequest / StyleAssignmentPatch / ArticleStylePlan
 * @see docs/architecture/style-system.md §11.8
 */

import type { BlockType } from "@/core/blocks";
import type { BlockStyleOverride, SlotOverrideValue, StyleAssignment } from "@/core/article";

import type { Density, StyleValidationIssue } from "./types";

export const STYLE_ASSIGNMENT_SOURCES = [
  "system",
  "user",
  "ai_style_selection",
  "orchestrator",
] as const;

export type StyleAssignmentSource = (typeof STYLE_ASSIGNMENT_SOURCES)[number];

export const STYLE_ASSIGNMENT_VALIDATION_STATUSES = [
  "pending",
  "valid",
  "fallback_applied",
  "invalid",
] as const;

export type StyleAssignmentValidationStatus =
  (typeof STYLE_ASSIGNMENT_VALIDATION_STATUSES)[number];

export const DECORATION_DENSITIES = ["light", "medium", "strong"] as const;

export type DecorationDensity = (typeof DECORATION_DENSITIES)[number];

export type StyleAssignmentValidationMeta = {
  source: StyleAssignmentSource;
  validationStatus?: StyleAssignmentValidationStatus;
  modelId?: string;
  generatedAt?: string;
  issues?: StyleValidationIssue[];
};

export type StyleSelectionArticleContext = {
  blockCount?: number;
  headingCount?: number;
  densityHint?: Density | DecorationDensity;
};

export type StyleSelectionBlockStyleHint = {
  blockId: string;
  blockType: BlockType;
  suggestedFamilyId?: string;
  suggestedVariantId?: string;
  suggestedSlotOverrides?: Record<string, SlotOverrideValue>;
  suggestedAssetIds?: string[];
  reason?: string;
};

export type StyleSelectionConstraints = {
  mustUseRegisteredVariants: true;
  mustUseRegisteredAssets: true;
  mustPassWeChatCompatibility: true;
  maxDecorationDensity?: DecorationDensity;
};

export type StyleSelectionRequest = {
  articleId: string;
  articleContext?: StyleSelectionArticleContext;
  preferredPresetId?: string;
  blockStyleHints: StyleSelectionBlockStyleHint[];
  constraints: StyleSelectionConstraints;
  meta?: StyleAssignmentValidationMeta;
};

export type StyleAssignmentPatchBlockOverride = {
  blockId: string;
  variantId?: string;
  familyId?: string;
  slotOverrides?: Record<string, SlotOverrideValue>;
  assetBindings?: Record<string, string>;
  density?: Density;
};

export type StyleAssignmentPatch = {
  presetId?: string;
  themeId?: string;
  blockOverrides?: StyleAssignmentPatchBlockOverride[];
  meta: StyleAssignmentValidationMeta;
};

export type ArticleStylePlanOrchestratorHints = {
  dedupeAdjacentHeadings?: boolean;
  maxAssetReuse?: number;
  /** S7-STORY-006 — RCARD consecutive card-emphasis body block limit */
  maxConsecutiveCardEmphasis?: number;
  avoidTitleFirstHeadingSameFamilyVariant?: boolean;
  notes?: string[];
};

/** Runtime style plan consumed by StyleResolver / Orchestrator (S3C-STORY-003+) */
export type ArticleStylePlan = {
  articleId: string;
  presetId: string;
  themeId: string;
  density?: Density;
  blockOverrides?: BlockStyleOverride[];
  orchestratorHints?: ArticleStylePlanOrchestratorHints;
  meta?: StyleAssignmentValidationMeta;
};

export type MergeStyleAssignmentPatchOptions = {
  /** When true, only merge patches with meta.validationStatus valid or fallback_applied */
  requireValidatedMeta?: boolean;
};

export type MergeStyleAssignmentPatchResult = {
  ok: boolean;
  issues: StyleValidationIssue[];
  styleAssignment?: StyleAssignment;
};
