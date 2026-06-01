import type { ListBlock } from "@/core/blocks";

import {
  normalizeListItemsForRenderer,
  resolveListCopySafety,
  resolveListLayout,
  type NormalizedListItem,
} from "./list-layout";
import type { BlockRenderContext, ListPreviewOutput, RendererIssue } from "./types";

export function renderListPreview(
  context: BlockRenderContext,
  normalizedItems?: NormalizedListItem[],
): { output: ListPreviewOutput; warnings: RendererIssue[] } {
  const block = context.block as ListBlock;
  const layout = resolveListLayout(context.resolvedBlockStyle.variantId);

  if (layout == null) {
    throw new Error(`unsupported list variant: ${context.resolvedBlockStyle.variantId}`);
  }

  const normalized =
    normalizedItems == null
      ? normalizeListItemsForRenderer(block, context.resolvedBlockStyle.variantId)
      : { items: normalizedItems, issues: [] };

  return {
    output: {
      kind: "list_preview",
      blockId: block.id,
      blockType: "list",
      variantId: context.resolvedBlockStyle.variantId,
      layout,
      ordered: block.content.ordered,
      items: normalized.items.map((item, index) => ({
        text: item.text,
        subItems: item.subItems,
        sourceIndex: item.sourceIndex,
        marker:
          layout === "numbered_steps"
            ? `${index + 1}.`
            : layout === "checklist_cards"
              ? "✓"
              : "•",
      })),
      copySafety: resolveListCopySafety(context.resolvedBlockStyle),
    },
    warnings: normalized.issues,
  };
}
