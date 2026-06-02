import {
  DEFAULT_PREVIEW_STYLE_CONTROL,
  type PreviewStyleControlState,
} from "@/lib/preview-style-controls";

import type { GalleryHeadingVariantId, GalleryTitleVariantId } from "./gallery-title-heading";

export type GalleryStyleControlState = PreviewStyleControlState & {
  titleVariantId: GalleryTitleVariantId | "";
  headingVariantId: GalleryHeadingVariantId | "";
  focusTitleHeading: boolean;
};

export const DEFAULT_GALLERY_STYLE_CONTROL: GalleryStyleControlState = {
  ...DEFAULT_PREVIEW_STYLE_CONTROL,
  titleVariantId: "",
  headingVariantId: "",
  focusTitleHeading: false,
};
