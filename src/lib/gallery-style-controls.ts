import type { BlockType } from "@/core/blocks";

import {
  DEFAULT_PREVIEW_STYLE_CONTROL,
  applyArticleStyleToPreviewControl,
  type PreviewStyleControlState,
} from "@/lib/preview-style-controls";

import type { GalleryHeadingVariantId, GalleryTitleVariantId } from "./gallery-title-heading";

export type GalleryStyleControlState = PreviewStyleControlState & {
  titleVariantId: GalleryTitleVariantId | "";
  headingVariantId: GalleryHeadingVariantId | "";
  focusTitleHeading: boolean;
  blockVariantOverrides: Partial<Record<BlockType, string>>;
};

export const DEFAULT_GALLERY_STYLE_CONTROL: GalleryStyleControlState = {
  ...DEFAULT_PREVIEW_STYLE_CONTROL,
  titleVariantId: "",
  headingVariantId: "",
  focusTitleHeading: false,
  blockVariantOverrides: {},
};

export function applyGalleryArticleStyle(
  control: GalleryStyleControlState,
  articleStyle: GalleryStyleControlState["articleStyle"],
): GalleryStyleControlState {
  return {
    ...control,
    ...applyArticleStyleToPreviewControl(control, articleStyle),
    blockVariantOverrides: control.lockColorPalette ? control.blockVariantOverrides : {},
    titleVariantId: "",
    headingVariantId: "",
    focusTitleHeading: control.focusTitleHeading,
  };
}
