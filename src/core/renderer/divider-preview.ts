import {
  resolveDividerCopySafety,
  resolveDividerLayout,
} from "./divider-layout";
import type { BlockRenderContext, DividerPreviewOutput } from "./types";

export function renderDividerPreview(
  context: BlockRenderContext,
): DividerPreviewOutput {
  const layout = resolveDividerLayout(context.resolvedBlockStyle.variantId);

  if (layout == null) {
    throw new Error(
      `unsupported divider variant: ${context.resolvedBlockStyle.variantId}`,
    );
  }

  return {
    kind: "divider_preview",
    blockId: context.block.id,
    blockType: "divider",
    variantId: context.resolvedBlockStyle.variantId,
    layout,
    copySafety: resolveDividerCopySafety(context.resolvedBlockStyle),
  };
}
