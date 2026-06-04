import type { Article, BlockStyleOverride } from "@/core/article";
import {
  HEADING_PUBLISH_VARIANT_IDS,
  type HeadingPublishVariantId,
} from "@/core/styles/variants/heading-publish-pool";
import type { ArticleSampleId } from "@/fixtures/article-samples";

export const GALLERY_TITLE_VARIANT_IDS = [
  "title_plain_minimal",
  "title_left_bar_classic",
  "title_bottom_line_editorial",
] as const;

export const GALLERY_HEADING_VARIANT_IDS = HEADING_PUBLISH_VARIANT_IDS;

export type GalleryTitleVariantId = (typeof GALLERY_TITLE_VARIANT_IDS)[number];
export type GalleryHeadingVariantId = HeadingPublishVariantId;

export type GalleryTitleHeadingAssignment = {
  titleVariantId: GalleryTitleVariantId;
  headingVariantId: GalleryHeadingVariantId;
};

/** Per-sample defaults — showcase distinct heading styles from publish pool. */
export const GALLERY_SAMPLE_TITLE_HEADING_ASSIGNMENTS: Record<
  ArticleSampleId,
  GalleryTitleHeadingAssignment
> = {
  "sample-knowledge": {
    titleVariantId: "title_bottom_line_editorial",
    headingVariantId: "heading_numbered_section",
  },
  "sample-industry": {
    titleVariantId: "title_left_bar_classic",
    headingVariantId: "heading_short_line",
  },
  "sample-product": {
    titleVariantId: "title_plain_minimal",
    headingVariantId: "heading_card_centered",
  },
  "sample-brand": {
    titleVariantId: "title_bottom_line_editorial",
    headingVariantId: "heading_magazine_left_bar",
  },
  "sample-event": {
    titleVariantId: "title_left_bar_classic",
    headingVariantId: "heading_highlight_marker",
  },
  "sample-promo": {
    titleVariantId: "title_bottom_line_editorial",
    headingVariantId: "heading_icon_prefix",
  },
  "sample-listicle": {
    titleVariantId: "title_plain_minimal",
    headingVariantId: "heading_minimal_number",
  },
  "sample-seasonal": {
    titleVariantId: "title_left_bar_classic",
    headingVariantId: "heading_magazine_offset",
  },
};

export function galleryTitleHeadingOverridesForArticle(
  article: Article,
  sampleId: ArticleSampleId,
  titleVariantId?: GalleryTitleVariantId,
  headingVariantId?: GalleryHeadingVariantId,
): BlockStyleOverride[] {
  const defaults = GALLERY_SAMPLE_TITLE_HEADING_ASSIGNMENTS[sampleId];
  const resolvedTitle = titleVariantId ?? defaults.titleVariantId;
  const resolvedHeading = headingVariantId ?? defaults.headingVariantId;
  const overrides: BlockStyleOverride[] = [];

  const titleBlock = article.blocks.find((block) => block.type === "title");
  if (titleBlock) {
    overrides.push({ blockId: titleBlock.id, variantId: resolvedTitle });
  }

  for (const block of article.blocks) {
    if (block.type === "heading") {
      overrides.push({ blockId: block.id, variantId: resolvedHeading });
    }
  }

  return overrides;
}

export function applyBlockOverridesToArticle(
  article: Article,
  overrides: BlockStyleOverride[],
): Article {
  const merged = new Map(
    (article.styleAssignment.blockOverrides ?? []).map((entry) => [entry.blockId, entry]),
  );
  for (const override of overrides) {
    merged.set(override.blockId, override);
  }
  return {
    ...article,
    styleAssignment: {
      ...article.styleAssignment,
      blockOverrides: [...merged.values()],
    },
  };
}
