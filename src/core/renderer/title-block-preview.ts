import type { HeadingBlock, TitleBlock } from "@/core/blocks";
import type { TitleBlockLayoutMode } from "@/core/styles";

import type { TitleBlockPreviewOutput } from "./types";
import {
  extractTitleBlockText,
  getSlotContent,
  resolveLayoutMode,
  resolveTitleBlockSlotContents,
  resolveTitleBlockTypography,
  slotContentMap,
} from "./text-style";
import type { BlockRenderContext } from "./types";
import { resolveHeadingPublishPaletteFromResolvedStyle } from "./heading-publish-decoration";
import { isHeadingPublishVariantId } from "./title-heading-assets";
import { resolveTitleHeadingPresentation } from "./title-heading-visual";

function buildPreviewSection(
  context: BlockRenderContext,
  layoutMode: TitleBlockLayoutMode,
  slots: ReturnType<typeof resolveTitleBlockSlotContents>,
): TitleBlockPreviewOutput {
  const block = context.block as TitleBlock | HeadingBlock;
  const typography = resolveTitleBlockTypography(
    context.resolvedBlockStyle,
    block.type,
  );
  const slotMap = slotContentMap(slots);
  const presentation = resolveTitleHeadingPresentation(
    layoutMode,
    block.type,
    block,
    slotMap,
    context.resolvedBlockStyle.variantId,
    context.article,
  );

  const variantId = context.resolvedBlockStyle.variantId;
  const themePalette =
    block.type === "heading" && isHeadingPublishVariantId(variantId)
      ? resolveHeadingPublishPaletteFromResolvedStyle(context.resolvedBlockStyle)
      : undefined;

  return {
    kind: "title_block_preview",
    blockId: block.id,
    blockType: block.type,
    variantId,
    familyId: context.resolvedBlockStyle.variant.family,
    layoutMode,
    text: extractTitleBlockText(block),
    headingLevel: block.type === "heading" ? block.content.level : undefined,
    presentation,
    themePalette,
    slots: slotMap,
    typography: {
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      lineHeight: typography.lineHeight,
      fontFamily: typography.fontFamily,
      color: typography.color,
      accentColor: typography.accentColor,
      mutedColor: typography.mutedColor,
    },
  };
}

export function renderTitleBlockPreview(
  context: BlockRenderContext,
): TitleBlockPreviewOutput {
  const layoutMode = resolveLayoutMode(context.resolvedBlockStyle);
  if (layoutMode == null) {
    throw new Error("layoutMode is required for titleBlock preview");
  }

  const slots = resolveTitleBlockSlotContents(
    context.block as TitleBlock | HeadingBlock,
    context.resolvedBlockStyle,
    context.slotStates,
  );

  return buildPreviewSection(context, layoutMode, slots);
}

export function previewDecorationsForLayout(
  layoutMode: TitleBlockLayoutMode,
  slots: ReturnType<typeof resolveTitleBlockSlotContents>,
): Record<string, string | undefined> {
  const badge = getSlotContent(slots, "badge");
  const decoration = getSlotContent(slots, "decoration");

  return {
    badge: badge?.content,
    decoration: decoration?.content,
    divider: layoutMode === "bottom_line" ? "line" : undefined,
    index: getSlotContent(slots, "badge")?.content,
  };
}
