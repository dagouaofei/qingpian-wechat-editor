import { parseArticle } from "@/core/article";
import type { NormalizedInput } from "@/core/generation/input";
import { parseAndNormalizeInputRequest } from "@/core/generation/input.normalize";

import {
  articleSampleRawForId,
  type ArticleSampleId,
} from "@/fixtures/article-samples";
import type { GalleryStyleControlState } from "@/lib/gallery-style-controls";
import {
  applyBlockOverridesToArticle,
  galleryTitleHeadingOverridesForArticle,
  type GalleryHeadingVariantId,
  type GalleryTitleVariantId,
} from "@/lib/gallery-title-heading";
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

function resolveTitleHeadingOverrideIds(control: GalleryStyleControlState): {
  titleVariantId?: GalleryTitleVariantId;
  headingVariantId?: GalleryHeadingVariantId;
} {
  return {
    titleVariantId: control.titleVariantId || undefined,
    headingVariantId: control.headingVariantId || undefined,
  };
}

export function renderGalleryPreview(
  sampleId: ArticleSampleId,
  control: GalleryStyleControlState = {
    ...DEFAULT_PREVIEW_STYLE_CONTROL,
    titleVariantId: "",
    headingVariantId: "",
    focusTitleHeading: false,
  },
): GalleryPreviewResult {
  const article = parseArticle(articleSampleRawForId(sampleId));
  const overrideIds = resolveTitleHeadingOverrideIds(control);

  const rendered = renderArticlePreviewClient(
    article,
    galleryNormalizedInputForControl(control),
    control,
    {
      postStyleSelectionPatch: (styledArticle) =>
        applyBlockOverridesToArticle(
          styledArticle,
          galleryTitleHeadingOverridesForArticle(
            styledArticle,
            sampleId,
            overrideIds.titleVariantId,
            overrideIds.headingVariantId,
          ),
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
  return {
    ...GALLERY_NORMALIZED_INPUT,
    styleIntent: {
      ...GALLERY_NORMALIZED_INPUT.styleIntent,
      presetHint: control.articleStyle === "classic" ? "classic" : "classic-news",
      densityHint: control.articleStyle === "classic" ? "light" : "medium",
    },
  };
}
