import { parseArticle } from "@/core/article";
import type { NormalizedInput } from "@/core/generation/input";
import { parseAndNormalizeInputRequest } from "@/core/generation/input.normalize";

import {
  articleSampleRawForId,
  type ArticleSampleId,
} from "@/fixtures/article-samples";
import {
  DEFAULT_GALLERY_STYLE_CONTROL,
  type GalleryStyleControlState,
} from "@/lib/gallery-style-controls";
import { galleryBlockOverridesForArticle } from "@/lib/gallery-block-variants";
import { applyBlockOverridesToArticle } from "@/lib/gallery-title-heading";
import {
  buildNormalizedInputForPreviewControl,
  type PreviewStyleControlState,
} from "@/lib/preview-style-controls";
import { renderArticlePreviewClient } from "@/lib/render-article-preview-client";

import type { SerializedPreviewBlock } from "@/server/generation/generate-flow-types";

const GALLERY_NORMALIZED_INPUT: NormalizedInput = parseAndNormalizeInputRequest({
  mode: "topic_only",
  topic: "Gallery fixture",
  styleIntent: {
    presetHint: "business",
    densityHint: "medium",
  },
});

export type GalleryPreviewResult = {
  sampleId: ArticleSampleId;
  previewBlocks: SerializedPreviewBlock[];
  displayBlocks: SerializedPreviewBlock[];
  variantIds: string[];
  clipboard: {
    textHtml: string;
    textPlain: string;
    issueCount: number;
    warningCount: number;
  };
};

export function renderGalleryPreview(
  sampleId: ArticleSampleId,
  control: GalleryStyleControlState = DEFAULT_GALLERY_STYLE_CONTROL,
): GalleryPreviewResult {
  const article = parseArticle(articleSampleRawForId(sampleId));

  const rendered = renderArticlePreviewClient(
    article,
    galleryNormalizedInputForControl(control),
    control,
    {
      postStyleSelectionPatch: (styledArticle) =>
        applyBlockOverridesToArticle(
          styledArticle,
          galleryBlockOverridesForArticle(styledArticle, sampleId, control),
        ),
    },
  );

  const previewBlocks = rendered.previewBlocks;
  const displayBlocks = control.focusTitleHeading
    ? previewBlocks.filter(
        (block) => block.blockType === "title" || block.blockType === "heading",
      )
    : previewBlocks;

  return {
    sampleId,
    previewBlocks,
    displayBlocks,
    variantIds: previewBlocks
      .map((block) => block.variantId)
      .filter((id): id is string => Boolean(id)),
    clipboard: rendered.clipboard,
  };
}

export function galleryNormalizedInputForControl(
  control: PreviewStyleControlState,
): NormalizedInput {
  return buildNormalizedInputForPreviewControl(GALLERY_NORMALIZED_INPUT, control);
}
