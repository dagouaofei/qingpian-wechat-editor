import { parseArticle } from "@/core/article";
import type { BlockMeta } from "@/core/blocks";

import { articleFixtureBase, fixtureBlockId } from "../articles/shared";

export function createTitleHeadingArticleFixture(options: {
  blockType: "title" | "heading";
  variantId: string;
  text: string;
  meta?: BlockMeta;
  level?: 1 | 2 | 3;
}) {
  const blockId = fixtureBlockId(1);
  const block =
    options.blockType === "title"
      ? {
          id: blockId,
          type: "title" as const,
          content: { text: options.text },
          meta: options.meta,
        }
      : {
          id: blockId,
          type: "heading" as const,
          content: { text: options.text, level: options.level ?? 2 },
          meta: options.meta,
        };

  return parseArticle({
    ...articleFixtureBase(),
    styleAssignment: {
      themeId: "businessBlue",
      presetId: "business",
      blockOverrides: [{ blockId, variantId: options.variantId }],
    },
    blocks: [block],
  });
}
