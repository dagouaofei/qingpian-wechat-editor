import type { LeadBlock, ParagraphBlock } from "@/core/blocks";
import { normalizeInlineContent } from "@/core/article";

import { renderInlineContentPreviewNodes } from "./inline-content-preview";
import {
  resolveTextBlockCopySafety,
  resolveTextBlockLayout,
  resolveTextBlockTypography,
} from "./text-block-typography";
import type { BlockRenderContext, TextBlockPreviewOutput } from "./types";

export function renderTextBlockPreview(
  context: BlockRenderContext,
): { output: TextBlockPreviewOutput; warnings: ReturnType<typeof renderInlineContentPreviewNodes>["warnings"] } {
  const block = context.block as LeadBlock | ParagraphBlock;
  const layout = resolveTextBlockLayout(context.resolvedBlockStyle.variantId);

  if (layout == null) {
    throw new Error(`unsupported text block variant: ${context.resolvedBlockStyle.variantId}`);
  }

  const typography = resolveTextBlockTypography(
    context.resolvedBlockStyle,
    block.type,
  );
  const inlineContent = normalizeInlineContent(block.content.text);
  const { nodes, warnings } = renderInlineContentPreviewNodes({
    content: inlineContent,
    themeTokens: context.resolvedBlockStyle.tokens.theme,
    defaultColor: typography.color,
    blockId: block.id,
    blockType: block.type,
    variantId: context.resolvedBlockStyle.variantId,
  });

  return {
    output: {
      kind: "text_block_preview",
      blockId: block.id,
      blockType: block.type,
      variantId: context.resolvedBlockStyle.variantId,
      layout,
      nodes,
      copySafety: resolveTextBlockCopySafety(context.resolvedBlockStyle),
    },
    warnings,
  };
}
