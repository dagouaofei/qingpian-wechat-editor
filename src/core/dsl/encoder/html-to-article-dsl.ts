import type { Article } from "@/core/article";
import type { Block } from "@/core/blocks";

import { ARTICLE_DSL_VERSION, type ArticleDslV1 } from "../runtime/dsl-types";

export function encodeArticleToDsl(article: Article): ArticleDslV1 {
  return {
    version: ARTICLE_DSL_VERSION,
    blocks: article.blocks.map((block: Block) => ({
      blockId: block.id,
      blockType: block.type,
      content: block.content as Record<string, unknown>,
      styleRef: {
        runtimeVariantId:
          article.styleAssignment?.blockOverrides?.find((entry) => entry.blockId === block.id)
            ?.variantId ?? "",
      },
    })),
  };
}
