import type { ImagePlaceholderBlock } from "@/core/blocks";

import {
  normalizeImagePlaceholderContentForRenderer,
  resolveImagePlaceholderCopySafety,
  resolveImagePlaceholderLayout,
  type NormalizedImagePlaceholderContent,
} from "./image-placeholder-layout";
import type {
  BlockRenderContext,
  ImagePlaceholderPreviewOutput,
  RendererIssue,
} from "./types";

export function renderImagePlaceholderPreview(
  context: BlockRenderContext,
  normalizedContent?: NormalizedImagePlaceholderContent,
): { output: ImagePlaceholderPreviewOutput; warnings: RendererIssue[] } {
  const block = context.block as ImagePlaceholderBlock;
  const layout = resolveImagePlaceholderLayout(context.resolvedBlockStyle.variantId);

  if (layout == null) {
    throw new Error(
      `unsupported image_placeholder variant: ${context.resolvedBlockStyle.variantId}`,
    );
  }

  const normalized =
    normalizedContent == null
      ? normalizeImagePlaceholderContentForRenderer(
          block,
          context.resolvedBlockStyle.variantId,
        )
      : { content: normalizedContent, issues: [] };

  return {
    output: {
      kind: "image_placeholder_preview",
      blockId: block.id,
      blockType: "image_placeholder",
      variantId: context.resolvedBlockStyle.variantId,
      layout,
      caption: normalized.content.caption,
      captionState: normalized.content.caption == null ? "disabled" : "active",
      suggestion: normalized.content.suggestion,
      suggestionState:
        normalized.content.suggestion == null ? "disabled" : "active",
      aspectRatio: normalized.content.aspectRatio,
      position: normalized.content.position,
      placeholderLabel: normalized.content.placeholderLabel,
      copySafety: resolveImagePlaceholderCopySafety(context.resolvedBlockStyle),
    },
    warnings: normalized.issues,
  };
}
