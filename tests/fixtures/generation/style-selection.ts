import { parseArticle } from "@/core/article";
import type { NormalizedInput } from "@/core/generation";
import { parseAndNormalizeInputRequest } from "@/core/generation";

import { fullBlocksArticleFixture } from "../articles/full-blocks-article";
import { minimalArticleFixture } from "../articles/minimal-article";
import { fixtureBlockId } from "../articles/shared";
import { topicOnlyInputRequestFixture } from "../generation/input-requests";

export const STYLE_SELECTION_TIMESTAMP = "2026-06-02T12:00:00.000Z";

export const styleSelectionArticleFixture = parseArticle(fullBlocksArticleFixture);

export const styleSelectionMinimalArticleFixture = parseArticle(minimalArticleFixture);

export const styleSelectionNormalizedInput = parseAndNormalizeInputRequest({
  ...topicOnlyInputRequestFixture,
  styleIntent: {
    tone: "formal editorial",
    presetHint: "classic-news",
    densityHint: "medium",
  },
});

export const styleSelectionForbiddenIntentInput: NormalizedInput = {
  ...styleSelectionNormalizedInput,
  styleIntent: {
    tone: "formal",
    className: "bad-class",
  } as NormalizedInput["styleIntent"],
};

export const invalidModelStylePatchOutput = {
  blockOverrides: [
    {
      blockId: fixtureBlockId(3),
      variantId: "heading_does_not_exist",
    },
  ],
  meta: {
    source: "ai_style_selection",
    generatedAt: STYLE_SELECTION_TIMESTAMP,
  },
};

export const previewOnlyModelStylePatchOutput = {
  blockOverrides: [
    {
      blockId: fixtureBlockId(3),
      variantId: "heading_preview_only_fixture",
    },
  ],
  meta: {
    source: "ai_style_selection",
    generatedAt: STYLE_SELECTION_TIMESTAMP,
  },
};

export const forbiddenModelStylePatchOutput = {
  html: "<p>forbidden</p>",
  meta: {
    source: "ai_style_selection",
    generatedAt: STYLE_SELECTION_TIMESTAMP,
  },
};

export const validModelStylePatchOutput = {
  presetId: "classic-news",
  themeId: "default",
  blockOverrides: [
    {
      blockId: fixtureBlockId(1),
      variantId: "title_left_bar_classic",
    },
    {
      blockId: fixtureBlockId(4),
      variantId: "paragraph_plain_body",
    },
  ],
  meta: {
    source: "ai_style_selection",
    generatedAt: STYLE_SELECTION_TIMESTAMP,
  },
};
