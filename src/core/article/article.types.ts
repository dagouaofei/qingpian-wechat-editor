/**
 * Release 1 Article 类型 — 唯一文章主模型
 * @see docs/architecture/article-schema.md
 */

import type { Block } from "@/core/blocks";

export type InputSourceType = "topic" | "material" | "draft" | "fixture";

export type InputSource = {
  type: InputSourceType;
  raw: string;
  normalized?: string;
  capturedAt: string;
};

/** @alias InputSource */
export type ArticleInput = InputSource;

export type ArticleMetadata = {
  title: string;
  subtitle?: string;
  summary?: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
  locale: string;
  tags?: string[];
};

export type SlotOverrideValue = string | number | boolean;

export type BlockStyleOverride = {
  blockId: string;
  variantId?: string;
  slotOverrides?: Record<string, SlotOverrideValue>;
};

export type StyleAssignment = {
  themeId: string;
  presetId: string;
  blockOverrides?: BlockStyleOverride[];
};

/** @alias StyleAssignment */
export type ArticleStyleAssignment = StyleAssignment;

export type GenerationStatus = "idle" | "streaming" | "completed" | "failed";
export type GenerationMode = "batch" | "stream";

export type GenerationMeta = {
  status: GenerationStatus;
  mode: GenerationMode;
  modelId?: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
};

export type Article = {
  id: string;
  version: 1;
  metadata: ArticleMetadata;
  input: InputSource;
  styleAssignment: StyleAssignment;
  blocks: Block[];
  generation?: GenerationMeta;
};
