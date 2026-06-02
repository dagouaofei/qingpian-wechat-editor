import { parseArticle } from "@/core/article";
import type { NormalizedInput } from "@/core/generation/input";
import { parseAndNormalizeInputRequest } from "@/core/generation/input.normalize";

import {
  galleryArticleRawForSample,
  type GallerySampleId,
} from "@/fixtures/gallery-articles";
import {
  DEFAULT_PREVIEW_STYLE_CONTROL,
  type PreviewStyleControlState,
} from "@/lib/preview-style-controls";
import { renderArticlePreviewClient } from "@/lib/render-article-preview-client";

import type { SerializedPreviewBlock } from "@/server/generation/generate-flow-types";

const GALLERY_NORMALIZED_INPUT: NormalizedInput = parseAndNormalizeInputRequest({
  mode: "topic_only",
  topic: "Gallery fixture",
  styleIntent: {
    presetHint: "classic-news",
    densityHint: "medium",
  },
});

export type GalleryPreviewResult = {
  sampleId: GallerySampleId;
  previewBlocks: SerializedPreviewBlock[];
  variantIds: string[];
};

export function renderGalleryPreview(
  sampleId: GallerySampleId,
  control: PreviewStyleControlState = DEFAULT_PREVIEW_STYLE_CONTROL,
): GalleryPreviewResult {
  const article = parseArticle(galleryArticleRawForSample(sampleId));
  const rendered = renderArticlePreviewClient(
    article,
    GALLERY_NORMALIZED_INPUT,
    control,
  );

  return {
    sampleId,
    previewBlocks: rendered.previewBlocks,
    variantIds: rendered.previewBlocks
      .map((block) => block.variantId)
      .filter((id): id is string => Boolean(id)),
  };
}

export function galleryNormalizedInputForControl(
  control: PreviewStyleControlState,
): NormalizedInput {
  return {
    ...GALLERY_NORMALIZED_INPUT,
    styleIntent: {
      ...GALLERY_NORMALIZED_INPUT.styleIntent,
      presetHint: control.articleStyle === "classic" ? "classic" : "classic-news",
      densityHint: control.articleStyle === "classic" ? "light" : "medium",
    },
  };
}
