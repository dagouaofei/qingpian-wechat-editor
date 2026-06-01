import type { CtaBlock } from "@/core/blocks";

import {
  normalizeCtaContentForRenderer,
  resolveCtaCopySafety,
  resolveCtaLayout,
  type NormalizedCtaContent,
} from "./cta-layout";
import type { BlockRenderContext, CtaPreviewOutput, RendererIssue } from "./types";

export function renderCtaPreview(
  context: BlockRenderContext,
  normalizedContent?: NormalizedCtaContent,
): { output: CtaPreviewOutput; warnings: RendererIssue[] } {
  const block = context.block as CtaBlock;
  const layout = resolveCtaLayout(context.resolvedBlockStyle.variantId);

  if (layout == null) {
    throw new Error(`unsupported cta variant: ${context.resolvedBlockStyle.variantId}`);
  }

  const normalized =
    normalizedContent == null
      ? normalizeCtaContentForRenderer(block, context.resolvedBlockStyle.variantId)
      : { content: normalizedContent, issues: [] };

  return {
    output: {
      kind: "cta_preview",
      blockId: block.id,
      blockType: "cta",
      variantId: context.resolvedBlockStyle.variantId,
      layout,
      text: normalized.content?.text ?? "",
      action: normalized.content?.action,
      actionState: normalized.content?.action == null ? "disabled" : "active",
      placeholderLabel: normalized.content?.placeholderLabel ?? "",
      copySafety: resolveCtaCopySafety(context.resolvedBlockStyle),
    },
    warnings: normalized.issues,
  };
}
