/**
 * HTML paste candidate preview (S9-STORY-007C-FIX-A).
 * Mirrors copy structure for user preview explicit-selection path.
 */

import type { HeadingBlock } from "@/core/blocks";
import {
  extractTitleBlockText,
  resolveTitleBlockTypography,
} from "@/core/renderer/text-style";
import type { BlockRenderContext, TitleBlockPreviewOutput } from "@/core/renderer/types";
import { HEADING_TEAL_SECTION_LABEL_HTML_PASTE_VARIANT_ID } from "@/core/styles/variants/html-paste-candidate-variants";

import {
  HTML_PASTE_TEAL_SECTION_COLOR,
  resolveHtmlPasteTealSectionLabel,
} from "./html-paste-teal-section-label-shared";

export function renderHtmlPasteTealSectionLabelHeadingPreview(
  context: BlockRenderContext,
): TitleBlockPreviewOutput {
  const block = context.block as HeadingBlock;
  const typography = resolveTitleBlockTypography(
    context.resolvedBlockStyle,
    "heading",
  );
  const text = extractTitleBlockText(block);
  const sectionLabel = resolveHtmlPasteTealSectionLabel(block);

  return {
    kind: "title_block_preview",
    blockId: block.id,
    blockType: "heading",
    variantId: HEADING_TEAL_SECTION_LABEL_HTML_PASTE_VARIANT_ID,
    familyId: "htmlPasteCandidate",
    layoutMode: "pill",
    text,
    headingLevel: block.content.level,
    presentation: {
      badgeText: sectionLabel,
      htmlPasteTealSectionLabel: true,
    },
    typography: {
      fontSize: typography.fontSize ?? "17px",
      fontWeight: typography.fontWeight,
      lineHeight: typography.lineHeight,
      fontFamily: typography.fontFamily,
      color: typography.color ?? "#1f2937",
      accentColor: HTML_PASTE_TEAL_SECTION_COLOR,
    },
    slots: {},
  };
}
