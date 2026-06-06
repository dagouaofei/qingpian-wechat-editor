import type { Article, BlockStyleOverride } from "@/core/article";
import {
  HEADING_PUBLISH_VARIANT_IDS,
  type HeadingPublishVariantId,
} from "@/core/styles/variants/heading-publish-pool";
import {
  getUserSelectablePreviewVariantAssetsForBlockType,
  getUserSelectablePreviewVariantLabel,
  type UserSelectablePreviewHeadingVariantId,
} from "@/core/style-library/user-selectable-preview-pool";

export type { HeadingPublishVariantId };
import { HEADING_PUBLISH_LABELS } from "@/core/renderer/heading-publish-visual";

export type { UserSelectablePreviewHeadingVariantId };

export const DEFAULT_PREVIEW_HEADING_VARIANT_ID: HeadingPublishVariantId =
  "heading_short_line";

export const PREVIEW_HEADING_PUBLISH_STYLE_OPTIONS = HEADING_PUBLISH_VARIANT_IDS.map(
  (id) => ({
    id,
    label: HEADING_PUBLISH_LABELS[id],
    source: "release1_publish_pool" as const,
  }),
);

export const PREVIEW_USER_SELECTABLE_HEADING_STYLE_OPTIONS =
  getUserSelectablePreviewVariantAssetsForBlockType("heading").map((asset) => ({
    id: asset.runtimeVariantId as UserSelectablePreviewHeadingVariantId,
    label: getUserSelectablePreviewVariantLabel(asset.runtimeVariantId),
    source: "user_selectable" as const,
  }));

export const PREVIEW_HEADING_STYLE_OPTIONS = [
  ...PREVIEW_HEADING_PUBLISH_STYLE_OPTIONS,
  ...PREVIEW_USER_SELECTABLE_HEADING_STYLE_OPTIONS,
];

export type PreviewHeadingVariantId =
  | HeadingPublishVariantId
  | UserSelectablePreviewHeadingVariantId;

export function applyHeadingVariantToArticle(
  article: Article,
  headingVariantId: PreviewHeadingVariantId,
): Article {
  const overrides: BlockStyleOverride[] = [];
  for (const block of article.blocks) {
    if (block.type === "heading") {
      overrides.push({ blockId: block.id, variantId: headingVariantId });
    }
  }
  if (overrides.length === 0) {
    return article;
  }

  const merged = new Map(
    (article.styleAssignment.blockOverrides ?? []).map((entry) => [
      entry.blockId,
      entry,
    ]),
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
