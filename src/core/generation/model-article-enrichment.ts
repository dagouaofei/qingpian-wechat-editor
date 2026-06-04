import { randomUUID } from "node:crypto";

import { BLOCK_TYPES, type BlockType } from "@/core/blocks";

import type { NormalizedInput } from "./input";
import type {
  ModelArticleEnrichmentInput,
  ModelArticleEnrichmentIssue,
  ModelArticleEnrichmentResult,
  StripForbiddenFieldsResult,
} from "./model-article-candidate";

export type {
  ModelArticleEnrichmentFailure,
  ModelArticleEnrichmentInput,
  ModelArticleEnrichmentIssue,
  ModelArticleEnrichmentResult,
  ModelArticleEnrichmentSuccess,
  StripForbiddenFieldsResult,
} from "./model-article-candidate";

const DEFAULT_STYLE_ASSIGNMENT = {
  themeId: "businessBlue",
  presetId: "business",
} as const;

const FORBIDDEN_FIELDS = ["html", "css", "className", "style"] as const;

const BLOCK_TYPE_SET = new Set<string>(BLOCK_TYPES);

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function defaultGenerateId(): string {
  return randomUUID();
}

export function isValidUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

function pushWarning(
  warnings: ModelArticleEnrichmentIssue[],
  code: string,
  message: string,
  path: Array<string | number>,
): void {
  warnings.push({ severity: "warning", code, message, path });
}

function pushError(
  errors: ModelArticleEnrichmentIssue[],
  code: string,
  message: string,
  path: Array<string | number>,
): void {
  errors.push({ severity: "error", code, message, path });
}

export function resolveEnrichmentUuid(
  value: unknown,
  generateId: () => string,
  warnings: ModelArticleEnrichmentIssue[],
  path: Array<string | number>,
): string {
  if (typeof value === "string" && isValidUuid(value)) {
    return value;
  }

  if (value != null && value !== "") {
    pushWarning(
      warnings,
      "invalid_uuid_replaced",
      "Invalid UUID replaced with generated value",
      path,
    );
  } else {
    pushWarning(
      warnings,
      "missing_uuid_generated",
      "Missing UUID generated deterministically",
      path,
    );
  }

  return generateId();
}

function resolveInputSnapshot(
  input: NormalizedInput,
  capturedAt: string,
): Record<string, unknown> {
  const type =
    input.primaryIntent === "draft"
      ? "draft"
      : input.primaryIntent === "material" || input.primaryIntent === "mixed"
        ? "material"
        : "topic";

  return {
    type,
    raw: input.inputSummary,
    normalized: input.inputSummary,
    capturedAt,
  };
}

function resolveFallbackTitle(
  input: NormalizedInput,
  metadata?: Record<string, unknown>,
): string {
  if (typeof metadata?.title === "string" && metadata.title.trim().length > 0) {
    return metadata.title.trim();
  }
  if (input.topic && input.topic.trim().length > 0) {
    return input.topic.trim();
  }
  if (input.draft && input.draft.trim().length > 0) {
    return input.draft.trim().slice(0, 40);
  }
  return input.inputSummary.slice(0, 40) || "轻篇生成文章";
}

function resolveFallbackParagraph(input: NormalizedInput): string {
  if (input.draft && input.draft.trim().length > 0) {
    return input.draft.trim();
  }
  if (input.materials.length > 0) {
    return input.materials.map((source) => source.text).join("\n\n");
  }
  if (input.topic && input.topic.trim().length > 0) {
    return `围绕「${input.topic.trim()}」展开的 Release 1 生成正文。`;
  }
  return "这是一段由模型 enrichment 补齐的默认正文。";
}

function resolveFallbackQuote(input: NormalizedInput): string {
  return resolveFallbackParagraph(input).slice(0, 120);
}

function stripForbiddenFieldsFromObject(
  value: Record<string, unknown>,
  warnings: ModelArticleEnrichmentIssue[],
  path: Array<string | number>,
): Record<string, unknown> {
  const next: Record<string, unknown> = { ...value };

  for (const field of FORBIDDEN_FIELDS) {
    if (field in next) {
      delete next[field];
      pushWarning(
        warnings,
        "forbidden_field_stripped",
        `Forbidden field "${field}" stripped from model output`,
        [...path, field],
      );
    }
  }

  return next;
}

export function stripForbiddenFieldsFromCandidate(
  candidate: Record<string, unknown>,
): StripForbiddenFieldsResult {
  const warnings: ModelArticleEnrichmentIssue[] = [];
  const stripped = stripForbiddenFieldsFromObject(candidate, warnings, []);

  if (Array.isArray(stripped.blocks)) {
    stripped.blocks = stripped.blocks.map((block, index) => {
      if (!isPlainObject(block)) {
        return block;
      }
      return stripForbiddenFieldsFromObject(block, warnings, ["blocks", index]);
    });
  }

  return { candidate: stripped, warnings };
}

function coercePlainText(value: unknown, fallback: string): string {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }
  return fallback;
}

function enrichBlockContent(
  blockType: BlockType,
  rawContent: unknown,
  context: {
    input: NormalizedInput;
    title: string;
    paragraph: string;
  },
  warnings: ModelArticleEnrichmentIssue[],
  path: Array<string | number>,
): Record<string, unknown> | null {
  const content = isPlainObject(rawContent) ? { ...rawContent } : {};

  switch (blockType) {
    case "title":
      return {
        text: coercePlainText(content.text, context.title),
      };
    case "lead":
      return {
        text: coercePlainText(
          content.text,
          context.paragraph.slice(0, 160),
        ),
      };
    case "heading": {
      const level = content.level;
      const normalizedLevel =
        level === 1 || level === 2 || level === 3 ? level : 2;
      if (level !== normalizedLevel) {
        pushWarning(
          warnings,
          "heading_level_defaulted",
          "Heading level defaulted to 2",
          [...path, "level"],
        );
      }
      return {
        text: coercePlainText(content.text, context.title),
        level: normalizedLevel,
      };
    }
    case "paragraph":
      return {
        text: coercePlainText(content.text, context.paragraph),
      };
    case "list": {
      let items = content.items;
      if (Array.isArray(items) && items.every((item) => typeof item === "string")) {
        pushWarning(
          warnings,
          "list_items_coerced",
          "List items coerced from string array",
          [...path, "items"],
        );
        items = items.map((item) => ({ text: String(item) }));
      }
      if (!Array.isArray(items) || items.length === 0) {
        pushWarning(
          warnings,
          "list_items_generated",
          "List items generated from fallback paragraph",
          [...path, "items"],
        );
        items = [{ text: context.paragraph.slice(0, 80) }];
      }
      return {
        ordered: typeof content.ordered === "boolean" ? content.ordered : false,
        items,
      };
    }
    case "quote": {
      const text = coercePlainText(content.text, resolveFallbackQuote(context.input));
      if (!isPlainObject(rawContent) || typeof rawContent.text !== "string") {
        pushWarning(
          warnings,
          "quote_text_fallback",
          "Quote text filled from fallback content",
          [...path, "text"],
        );
      }
      return {
        ...(typeof content.attribution === "string"
          ? { attribution: content.attribution }
          : {}),
        text,
      };
    }
    case "highlight":
      return {
        text: coercePlainText(
          content.text,
          context.paragraph.slice(0, 120),
        ),
        ...(typeof content.label === "string" ? { label: content.label } : {}),
      };
    case "info_card": {
      const body = coercePlainText(content.body, context.paragraph.slice(0, 160));
      const title = coercePlainText(content.title, context.title);
      if (typeof content.title !== "string") {
        pushWarning(
          warnings,
          "info_card_title_fallback",
          "Info card title filled from fallback",
          [...path, "title"],
        );
      }
      if (typeof content.body !== "string") {
        pushWarning(
          warnings,
          "info_card_body_fallback",
          "Info card body filled from fallback",
          [...path, "body"],
        );
      }
      return {
        title,
        body,
        ...(typeof content.icon === "string" ? { icon: content.icon } : {}),
      };
    }
    case "cta": {
      const text = coercePlainText(content.text, "了解更多");
      if (typeof content.text !== "string") {
        pushWarning(
          warnings,
          "cta_text_fallback",
          "CTA text filled from fallback",
          [...path, "text"],
        );
      }
      return {
        text,
        ...(typeof content.action === "string" ? { action: content.action } : {}),
      };
    }
    case "divider":
      return {
        ...(content.style === "line" ||
        content.style === "space" ||
        content.style === "dot"
          ? { style: content.style }
          : {}),
      };
    case "image_placeholder":
      return {
        ...(typeof content.caption === "string" ? { caption: content.caption } : {}),
        ...(content.aspectRatio === "16:9" ||
        content.aspectRatio === "4:3" ||
        content.aspectRatio === "1:1" ||
        content.aspectRatio === "free"
          ? { aspectRatio: content.aspectRatio }
          : {}),
        ...(content.position === "full" || content.position === "inline"
          ? { position: content.position }
          : {}),
        ...(typeof content.suggestion === "string"
          ? { suggestion: content.suggestion }
          : {}),
      };
    default:
      return null;
  }
}

function createMinimalBlocks(
  input: NormalizedInput,
  generateId: () => string,
  warnings: ModelArticleEnrichmentIssue[],
): Record<string, unknown>[] {
  const title = resolveFallbackTitle(input);
  const paragraph = resolveFallbackParagraph(input);
  pushWarning(
    warnings,
    "blocks_generated_from_input",
    "Missing blocks replaced with minimal title and paragraph blocks",
    ["blocks"],
  );
  return [
    {
      id: generateId(),
      type: "title",
      content: { text: title },
    },
    {
      id: generateId(),
      type: "paragraph",
      content: { text: paragraph },
    },
  ];
}

function enrichBlocks(
  rawBlocks: unknown,
  input: NormalizedInput,
  generateId: () => string,
  warnings: ModelArticleEnrichmentIssue[],
  errors: ModelArticleEnrichmentIssue[],
): Record<string, unknown>[] | null {
  const title = resolveFallbackTitle(input);
  const paragraph = resolveFallbackParagraph(input);
  const context = { input, title, paragraph };

  if (!Array.isArray(rawBlocks) || rawBlocks.length === 0) {
    return createMinimalBlocks(input, generateId, warnings);
  }

  const enrichedBlocks: Record<string, unknown>[] = [];

  for (let index = 0; index < rawBlocks.length; index += 1) {
    const rawBlock = rawBlocks[index];
    if (!isPlainObject(rawBlock)) {
      pushError(
        errors,
        "invalid_block_object",
        "Block must be an object",
        ["blocks", index],
      );
      return null;
    }

    const blockType = rawBlock.type;
    if (typeof blockType !== "string" || !BLOCK_TYPE_SET.has(blockType)) {
      pushError(
        errors,
        "invalid_block_type",
        `Unsupported block type: ${String(blockType)}`,
        ["blocks", index, "type"],
      );
      return null;
    }

    const content = enrichBlockContent(
      blockType as BlockType,
      rawBlock.content,
      context,
      warnings,
      ["blocks", index, "content"],
    );

    if (content == null) {
      pushError(
        errors,
        "unrecoverable_block_content",
        `Unable to enrich content for block type ${blockType}`,
        ["blocks", index, "content"],
      );
      return null;
    }

    enrichedBlocks.push({
      ...stripForbiddenFieldsFromObject(rawBlock, warnings, ["blocks", index]),
      id: resolveEnrichmentUuid(rawBlock.id, generateId, warnings, [
        "blocks",
        index,
        "id",
      ]),
      type: blockType,
      content,
      ...(isPlainObject(rawBlock.meta) ? { meta: rawBlock.meta } : {}),
    });
  }

  return enrichedBlocks;
}

export function enrichModelArticleCandidate(
  input: ModelArticleEnrichmentInput,
): ModelArticleEnrichmentResult {
  const generateId = input.generateId ?? defaultGenerateId;
  const warnings: ModelArticleEnrichmentIssue[] = [];
  const errors: ModelArticleEnrichmentIssue[] = [];

  if (!isPlainObject(input.rawCandidate)) {
    pushError(
      errors,
      "invalid_raw_candidate",
      "Model output must be a JSON object",
      [],
    );
    return { ok: false, errors, warnings };
  }

  const stripResult = stripForbiddenFieldsFromCandidate(input.rawCandidate);
  warnings.push(...stripResult.warnings);

  const raw = stripResult.candidate;
  const metadata = isPlainObject(raw.metadata) ? { ...raw.metadata } : {};
  const title = resolveFallbackTitle(input.normalizedInput, metadata);
  const timestamp = input.timestamp;

  const blocks = enrichBlocks(
    raw.blocks,
    input.normalizedInput,
    generateId,
    warnings,
    errors,
  );

  if (blocks == null || errors.length > 0) {
    return { ok: false, errors, warnings };
  }

  const candidate: Record<string, unknown> = {
    ...raw,
    id: resolveEnrichmentUuid(raw.id, generateId, warnings, ["id"]),
    version: raw.version === 1 ? 1 : 1,
    metadata: {
      title:
        typeof metadata.title === "string" && metadata.title.trim().length > 0
          ? metadata.title.trim()
          : title,
      createdAt:
        typeof metadata.createdAt === "string" &&
        !Number.isNaN(Date.parse(metadata.createdAt))
          ? metadata.createdAt
          : timestamp,
      updatedAt:
        typeof metadata.updatedAt === "string" &&
        !Number.isNaN(Date.parse(metadata.updatedAt))
          ? metadata.updatedAt
          : timestamp,
      locale:
        typeof metadata.locale === "string" && metadata.locale.trim().length > 0
          ? metadata.locale.trim()
          : input.normalizedInput.metadata?.locale ?? "zh-CN",
      ...(typeof metadata.subtitle === "string"
        ? { subtitle: metadata.subtitle }
        : {}),
      ...(typeof metadata.summary === "string"
        ? { summary: metadata.summary }
        : {}),
      ...(typeof metadata.author === "string" ? { author: metadata.author } : {}),
      ...(Array.isArray(metadata.tags) ? { tags: metadata.tags } : {}),
    },
    input: isPlainObject(raw.input)
      ? raw.input
      : resolveInputSnapshot(input.normalizedInput, timestamp),
    styleAssignment: isPlainObject(raw.styleAssignment)
      ? {
          themeId:
            typeof (raw.styleAssignment as Record<string, unknown>).themeId ===
            "string"
              ? (raw.styleAssignment as Record<string, unknown>).themeId
              : DEFAULT_STYLE_ASSIGNMENT.themeId,
          presetId:
            typeof (raw.styleAssignment as Record<string, unknown>).presetId ===
            "string"
              ? (raw.styleAssignment as Record<string, unknown>).presetId
              : DEFAULT_STYLE_ASSIGNMENT.presetId,
        }
      : DEFAULT_STYLE_ASSIGNMENT,
    generation: isPlainObject(raw.generation)
      ? raw.generation
      : {
          status: "completed",
          mode: "stream",
          modelId: input.modelName,
          startedAt: timestamp,
          completedAt: timestamp,
        },
    blocks,
  };

  if (raw.version !== 1) {
    pushWarning(
      warnings,
      "version_defaulted",
      "Article version defaulted to 1",
      ["version"],
    );
  }

  if (!isPlainObject(raw.input)) {
    pushWarning(
      warnings,
      "input_snapshot_generated",
      "Article input snapshot generated from NormalizedInput",
      ["input"],
    );
  }

  if (!isPlainObject(raw.styleAssignment)) {
    pushWarning(
      warnings,
      "style_assignment_defaulted",
      "Style assignment defaulted to safe preset",
      ["styleAssignment"],
    );
  }

  return { ok: true, candidate, warnings };
}

export const repairModelArticleCandidate = enrichModelArticleCandidate;

export function createArticleCandidateFromModelOutput(
  input: ModelArticleEnrichmentInput,
): ModelArticleEnrichmentResult {
  return enrichModelArticleCandidate(input);
}
