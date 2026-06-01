import type { HighlightBlock } from "@/core/blocks";

import {
  normalizeHighlightContentForRenderer,
  resolveHighlightCopySafety,
  resolveHighlightLayout,
  type NormalizedHighlightContent,
} from "./highlight-layout";
import type {
  BlockRenderContext,
  HighlightPreviewOutput,
  RendererIssue,
} from "./types";

export function renderHighlightPreview(
  context: BlockRenderContext,
  normalizedContent?: NormalizedHighlightContent,
): { output: HighlightPreviewOutput; warnings: RendererIssue[] } {
  const block = context.block as HighlightBlock;
  const layout = resolveHighlightLayout(context.resolvedBlockStyle.variantId);

  if (layout == null) {
    throw new Error(
      `unsupported highlight variant: ${context.resolvedBlockStyle.variantId}`,
    );
  }

  const normalized =
    normalizedContent == null
      ? normalizeHighlightContentForRenderer(
          block,
          context.resolvedBlockStyle.variantId,
        )
      : { content: normalizedContent, issues: [] };

  return {
    output: {
      kind: "highlight_preview",
      blockId: block.id,
      blockType: "highlight",
      variantId: context.resolvedBlockStyle.variantId,
      layout,
      text: normalized.content?.text ?? "",
      label: normalized.content?.label,
      labelState: normalized.content?.label == null ? "disabled" : "active",
      copySafety: resolveHighlightCopySafety(context.resolvedBlockStyle),
    },
    warnings: normalized.issues,
  };
}
