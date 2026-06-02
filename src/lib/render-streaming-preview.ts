import type { Article } from "@/core/article";
import type { Block, BlockType } from "@/core/blocks";
import { generateDeterministicStyleSelection } from "@/core/generation/style-selection";
import type { NormalizedInput } from "@/core/generation/input";
import {
  createRelease1FirstWavePreviewRendererRegistry,
  RELEASE1_FIRST_WAVE_PREVIEW_BLOCK_TYPES,
  renderArticleBlocks,
  renderTargetForMode,
  type RendererOutputPlaceholder,
} from "@/core/renderer";
import {
  createFirstWaveRequiredVariantRegistry,
  resolveArticleStyle,
} from "@/core/styles";

import type { StreamingPreviewBlock } from "@/app/preview/streaming-preview-panel";
import type { SerializedPreviewBlock } from "@/app/generate/types";

const STREAM_PREVIEW_ARTICLE_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const STREAM_PREVIEW_TIMESTAMP = "2026-06-02T00:00:00.000Z";

const TEXT_FIELD_BLOCK_TYPES = new Set<BlockType>([
  "title",
  "lead",
  "heading",
  "paragraph",
  "highlight",
  "quote",
  "cta",
]);

const BODY_FIELD_BLOCK_TYPES = new Set<BlockType>(["info_card"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function coerceListItemText(item: unknown): string | null {
  if (typeof item === "string") {
    const text = item.trim();
    return text.length > 0 ? text : null;
  }
  if (!isRecord(item) || typeof item.text !== "string") {
    return null;
  }
  const text = item.text.trim();
  return text.length > 0 ? text : null;
}

function normalizeListStreamingContent(
  content: Record<string, unknown>,
): Record<string, unknown> {
  const ordered = typeof content.ordered === "boolean" ? content.ordered : false;
  const rawItems = Array.isArray(content.items) ? content.items : [];
  const items = rawItems.flatMap((item) => {
    const text = coerceListItemText(item);
    if (text == null) {
      return [];
    }
    if (typeof item === "string") {
      return [{ text }];
    }
    if (!isRecord(item)) {
      return [{ text }];
    }
    const subItems = Array.isArray(item.subItems)
      ? item.subItems.filter(
          (subItem): subItem is string =>
            typeof subItem === "string" && subItem.trim().length > 0,
        )
      : undefined;
    return [
      {
        ...item,
        text,
        ...(subItems && subItems.length > 0 ? { subItems } : {}),
      },
    ];
  });

  return { ordered, items };
}

function isListContentReady(content: Record<string, unknown>): boolean {
  const normalized = normalizeListStreamingContent(content);
  const items = normalized.items;
  return Array.isArray(items) && items.length > 0;
}

function isInfoCardContentReady(content: Record<string, unknown>): boolean {
  const body = typeof content.body === "string" ? content.body.trim() : "";
  return body.length > 0;
}

function isStructuredBlockContentReady(
  blockType: BlockType,
  content: Record<string, unknown>,
): boolean {
  switch (blockType) {
    case "list":
      return isListContentReady(content);
    case "info_card":
      return isInfoCardContentReady(content);
    case "divider":
    case "image_placeholder":
      return true;
    default:
      return true;
  }
}

/** Structured blocks need full JSON before Preview Renderer can run. */
const PREVIEW_DEFERRED_UNTIL_COMPLETE = new Set<BlockType>([
  "list",
  "info_card",
  "image_placeholder",
  "divider",
]);

function defaultStreamingBlockContent(blockType: BlockType): Record<string, unknown> {
  switch (blockType) {
    case "heading":
      return { text: "", level: 2 };
    case "info_card":
      return { body: "" };
    case "list":
      return { ordered: false, items: [{ text: "…" }] };
    case "divider":
      return { style: "line" };
    case "image_placeholder":
      return { caption: "", position: "full" };
    default:
      return { text: "" };
  }
}

function normalizeStreamingBlockContentForPreview(
  blockType: BlockType,
  content: Record<string, unknown>,
): Record<string, unknown> {
  const base = defaultStreamingBlockContent(blockType);
  const merged = { ...base, ...content };

  if (TEXT_FIELD_BLOCK_TYPES.has(blockType)) {
    const text =
      typeof merged.text === "string"
        ? merged.text
        : Array.isArray(merged.text)
          ? merged.text
          : "";
    return { ...merged, text };
  }

  if (blockType === "heading" && merged.level == null) {
    return { ...merged, level: 2 };
  }

  if (blockType === "info_card") {
    const body = typeof merged.body === "string" ? merged.body : "";
    return { ...merged, body };
  }

  if (blockType === "list") {
    return normalizeListStreamingContent(merged);
  }

  return merged;
}

function isRenderableStreamingBlock(block: StreamingPreviewBlock): boolean {
  if (PREVIEW_DEFERRED_UNTIL_COMPLETE.has(block.blockType)) {
    if (!block.complete) {
      return false;
    }
    return isStructuredBlockContentReady(block.blockType, block.content);
  }
  return true;
}

function appendDeltaToContent(
  content: Record<string, unknown>,
  blockType: BlockType,
  delta: string,
): Record<string, unknown> {
  if (BODY_FIELD_BLOCK_TYPES.has(blockType)) {
    const body =
      typeof content.body === "string" ? `${content.body}${delta}` : delta;
    return { ...content, body };
  }

  if (!TEXT_FIELD_BLOCK_TYPES.has(blockType)) {
    return content;
  }

  if (typeof content.text === "string") {
    return { ...content, text: `${content.text}${delta}` };
  }
  if (Array.isArray(content.text)) {
    const nodes = [...content.text];
    const lastNode = nodes[nodes.length - 1];
    if (lastNode && typeof lastNode === "object" && "text" in lastNode) {
      const lastText = typeof lastNode.text === "string" ? lastNode.text : "";
      nodes[nodes.length - 1] = { ...lastNode, text: `${lastText}${delta}` };
      return { ...content, text: nodes };
    }
    return { ...content, text: [...nodes, { text: delta }] };
  }
  return { ...content, text: delta };
}

export function buildStreamingBlocksFromEvent(
  blocks: Map<string, StreamingPreviewBlock>,
  event: import("@/core/generation/events").GenerationEvent,
): Map<string, StreamingPreviewBlock> {
  const next = new Map(blocks);

  if (event.type === "block.start") {
    const existing = next.get(event.blockId);
    next.set(event.blockId, {
      blockId: event.blockId,
      blockType: event.blockType,
      content:
        existing?.content ??
        defaultStreamingBlockContent(event.blockType),
      complete: false,
    });
    return next;
  }

  if (event.type === "block.delta") {
    const existing = next.get(event.blockId);
    const blockType = existing?.blockType ?? "paragraph";
    const content = appendDeltaToContent(
      existing?.content ?? defaultStreamingBlockContent(blockType),
      blockType,
      event.delta,
    );
    next.set(event.blockId, {
      blockId: event.blockId,
      blockType,
      content,
      complete: false,
    });
    return next;
  }

  if (event.type === "block.complete") {
    const existing = next.get(event.blockId);
    const content = (event.content as Record<string, unknown> | undefined) ?? existing?.content ?? {};
    next.set(event.blockId, {
      blockId: event.blockId,
      blockType: event.blockType,
      content,
      complete: true,
    });
  }

  return next;
}

function resolveStreamingPresetId(presetHint?: string): string {
  const trimmed = presetHint?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : "classic-news";
}

function buildStreamingArticle(
  blocks: StreamingPreviewBlock[],
  topic: string,
  options?: { locale?: string; presetId?: string },
): Article {
  const locale = options?.locale ?? "zh-CN";
  const presetId = resolveStreamingPresetId(options?.presetId);
  const titleFromBlock = blocks.find((block) => block.blockType === "title");
  const titleText =
    titleFromBlock &&
    typeof titleFromBlock.content.text === "string" &&
    titleFromBlock.content.text.length > 0
      ? titleFromBlock.content.text
      : topic || "未命名文章";

  const articleBlocks: Block[] = blocks
    .filter(isRenderableStreamingBlock)
    .map((block) => ({
      id: block.blockId,
      type: block.blockType,
      content: normalizeStreamingBlockContentForPreview(
        block.blockType,
        block.content,
      ),
    })) as Block[];

  return {
    id: STREAM_PREVIEW_ARTICLE_ID,
    version: 1,
    metadata: {
      title: titleText,
      createdAt: STREAM_PREVIEW_TIMESTAMP,
      updatedAt: STREAM_PREVIEW_TIMESTAMP,
      locale,
    },
    input: {
      type: "topic",
      raw: topic,
      capturedAt: STREAM_PREVIEW_TIMESTAMP,
    },
    styleAssignment: {
      themeId: "default",
      presetId,
    },
    blocks: articleBlocks.length > 0 ? articleBlocks : [],
    generation: {
      status: "streaming",
      mode: "stream",
      startedAt: STREAM_PREVIEW_TIMESTAMP,
    },
  } as Article;
}

function serializePreviewBlocks(
  results: ReturnType<typeof renderArticleBlocks>,
): SerializedPreviewBlock[] {
  return results.map((result) => ({
    blockId: result.blockId,
    blockType: result.blockType,
    variantId:
      result.output && "variantId" in result.output
        ? String((result.output as { variantId?: string }).variantId)
        : undefined,
    ok: result.ok,
    output: result.output as RendererOutputPlaceholder | undefined,
    issues: result.issues,
    warnings: result.warnings,
  }));
}

export function renderStreamingPreviewBlocks(
  blocks: StreamingPreviewBlock[],
  topic: string,
  options?: { presetId?: string; normalizedInput?: NormalizedInput },
): SerializedPreviewBlock[] {
  if (blocks.length === 0) {
    return [];
  }

  const renderableBlocks = blocks.filter(isRenderableStreamingBlock);
  if (renderableBlocks.length === 0) {
    return [];
  }

  const article = buildStreamingArticle(renderableBlocks, topic, {
    presetId: options?.presetId,
  });
  if (article.blocks.length === 0) {
    return [];
  }

  const styleRegistry = createFirstWaveRequiredVariantRegistry();
  let articleToRender = article;

  if (options?.normalizedInput) {
    const styleResult = generateDeterministicStyleSelection({
      article,
      normalizedInput: options.normalizedInput,
      registry: styleRegistry,
      timestamp: STREAM_PREVIEW_TIMESTAMP,
    });
    if (styleResult.applied) {
      articleToRender = styleResult.article;
    }
  }

  const resolvedArticleStyle = resolveArticleStyle(articleToRender, styleRegistry);
  const previewRegistry = createRelease1FirstWavePreviewRendererRegistry();
  const previewResults = renderArticleBlocks({
    article: articleToRender,
    resolvedArticleStyle,
    mode: "preview",
    target: renderTargetForMode("preview"),
    registry: previewRegistry,
    supportedBlockTypes: RELEASE1_FIRST_WAVE_PREVIEW_BLOCK_TYPES,
  });

  return serializePreviewBlocks(previewResults).filter((block) => block.ok);
}

export function computeStreamingPreviewContentRevision(
  blocks: StreamingPreviewBlock[],
): number {
  return blocks.reduce((revision, block) => {
    const text =
      typeof block.content.text === "string" ? block.content.text.length : 0;
    const body =
      typeof block.content.body === "string" ? block.content.body.length : 0;
    return revision + text + body + (block.complete ? 1_000 : 0);
  }, blocks.length * 10);
}
