import type { QuoteBlock } from "@/core/blocks";

import {
  normalizeQuoteContentForRenderer,
  resolveQuoteCopySafety,
  resolveQuoteLayout,
  type NormalizedQuoteContent,
} from "./quote-layout";
import type { BlockRenderContext, QuotePreviewOutput, RendererIssue } from "./types";

export function renderQuotePreview(
  context: BlockRenderContext,
  normalizedContent?: NormalizedQuoteContent,
): { output: QuotePreviewOutput; warnings: RendererIssue[] } {
  const block = context.block as QuoteBlock;
  const layout = resolveQuoteLayout(context.resolvedBlockStyle.variantId);

  if (layout == null) {
    throw new Error(`unsupported quote variant: ${context.resolvedBlockStyle.variantId}`);
  }

  const normalized =
    normalizedContent == null
      ? normalizeQuoteContentForRenderer(block, context.resolvedBlockStyle.variantId)
      : { content: normalizedContent, issues: [] };

  return {
    output: {
      kind: "quote_preview",
      blockId: block.id,
      blockType: "quote",
      variantId: context.resolvedBlockStyle.variantId,
      layout,
      text: normalized.content?.text ?? "",
      attribution: normalized.content?.attribution,
      attributionState:
        normalized.content?.attribution == null ? "disabled" : "active",
      copySafety: resolveQuoteCopySafety(context.resolvedBlockStyle),
    },
    warnings: normalized.issues,
  };
}
