import type { Block, LeadBlock, ParagraphBlock } from "@/core/blocks";

import { articleSchema } from "./article.schema";
import type { Article } from "./article.types";
import { normalizeInlineContent } from "./inline-content.normalize";

function isParagraphOrLeadBlock(
  block: Block,
): block is ParagraphBlock | LeadBlock {
  return block.type === "paragraph" || block.type === "lead";
}

function normalizeBlockText(block: Block): Block {
  if (!isParagraphOrLeadBlock(block)) {
    return block;
  }

  const text = block.content.text;
  if (typeof text === "string" || Array.isArray(text)) {
    return {
      ...block,
      content: {
        ...block.content,
        text: normalizeInlineContent(text),
      },
    };
  }

  return block;
}

/**
 * Schema 层归一：paragraph / lead 的 content.text string → InlineContent。
 * 不修改 id / type，不增删 block，不生成样式或 renderer 字段。
 */
export function normalizeArticle(input: Article): Article {
  const normalized: Article = {
    ...input,
    blocks: input.blocks.map(normalizeBlockText),
  };

  return articleSchema.parse(normalized);
}
