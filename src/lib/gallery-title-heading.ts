import type { Article, BlockStyleOverride } from "@/core/article";
import type { ArticleSampleId } from "@/fixtures/article-samples";

export const GALLERY_TITLE_VARIANT_IDS = [
  "title_plain_minimal",
  "title_left_bar_classic",
  "title_bottom_line_editorial",
] as const;

export const GALLERY_HEADING_VARIANT_IDS = [
  "heading_plain_minimal",
  "heading_numbered_section",
  "heading_top_badge_topic",
  "heading_underline_classic",
  "heading_pill_topic",
  "heading_editorial_plain",
  "heading_keynote_strong",
  "heading_highlight_marker",
  "heading_short_line",
  "heading_icon_prefix",
  "heading_minimal_number",
  "heading_magazine_left_bar",
  "heading_magazine_offset",
] as const;

export type GalleryTitleVariantId = (typeof GALLERY_TITLE_VARIANT_IDS)[number];
export type GalleryHeadingVariantId = (typeof GALLERY_HEADING_VARIANT_IDS)[number];

export type GalleryTitleHeadingAssignment = {
  titleVariantId: GalleryTitleVariantId;
  headingVariantId: GalleryHeadingVariantId;
};

/** Per-sample defaults — avoid title + heading both plain_minimal. */
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
    headingVariantId: "heading_plain_minimal",
  },
  "sample-product": {
    titleVariantId: "title_plain_minimal",
    headingVariantId: "heading_top_badge_topic",
  },
  "sample-brand": {
    titleVariantId: "title_bottom_line_editorial",
    headingVariantId: "heading_top_badge_topic",
  },
  "sample-event": {
    titleVariantId: "title_left_bar_classic",
    headingVariantId: "heading_numbered_section",
  },
  "sample-promo": {
    titleVariantId: "title_bottom_line_editorial",
    headingVariantId: "heading_numbered_section",
  },
  "sample-listicle": {
    titleVariantId: "title_plain_minimal",
    headingVariantId: "heading_numbered_section",
  },
  "sample-seasonal": {
    titleVariantId: "title_left_bar_classic",
    headingVariantId: "heading_plain_minimal",
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
