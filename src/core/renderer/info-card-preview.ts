import type { InfoCardBlock } from "@/core/blocks";

import {
  normalizeInfoCardContentForRenderer,
  resolveInfoCardCopySafety,
  resolveInfoCardLayout,
  type NormalizedInfoCardContent,
} from "./info-card-layout";
import type {
  BlockRenderContext,
  InfoCardPreviewOutput,
  RendererIssue,
} from "./types";

export function renderInfoCardPreview(
  context: BlockRenderContext,
  normalizedContent?: NormalizedInfoCardContent,
): { output: InfoCardPreviewOutput; warnings: RendererIssue[] } {
  const block = context.block as InfoCardBlock;
  const layout = resolveInfoCardLayout(context.resolvedBlockStyle.variantId);

  if (layout == null) {
    throw new Error(
      `unsupported info_card variant: ${context.resolvedBlockStyle.variantId}`,
    );
  }

  const normalized =
    normalizedContent == null
      ? normalizeInfoCardContentForRenderer(
          block,
          context.resolvedBlockStyle.variantId,
        )
      : { content: normalizedContent, issues: [] };

  return {
    output: {
      kind: "info_card_preview",
      blockId: block.id,
      blockType: "info_card",
      variantId: context.resolvedBlockStyle.variantId,
      layout,
      title: normalized.content?.title,
      titleState: normalized.content?.title == null ? "disabled" : "active",
      body: normalized.content?.body ?? "",
      bodyLines: normalized.content?.bodyLines ?? [],
      icon: normalized.content?.icon,
      iconState: normalized.content?.icon == null ? "disabled" : "active",
      copySafety: resolveInfoCardCopySafety(context.resolvedBlockStyle),
    },
    warnings: normalized.issues,
  };
}
