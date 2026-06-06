import {
  HTML_PASTE_CANDIDATE_VARIANT_IDS,
  renderHtmlPasteTealSectionLabelHeadingCopy,
} from "@/core/copy/html-paste-candidate-copy";
import { buildBlockRenderContext } from "@/core/renderer/context";
import { renderHtmlPasteTealSectionLabelHeadingPreview } from "@/core/renderer/html-paste-candidate-preview";
import { partitionRendererIssues } from "@/core/renderer/issues";
import type {
  BlockRenderInput,
  RendererOutputPlaceholder,
  RendererResult,
} from "@/core/renderer/types";

/**
 * Style-library inspection-only render path for HTML paste candidates.
 * Does not register variants on shared release1 title-block renderer/copy allowlists.
 */
export function isStyleLibraryHtmlPasteCandidateVariant(variantId: string): boolean {
  return (HTML_PASTE_CANDIDATE_VARIANT_IDS as readonly string[]).includes(variantId);
}

export function renderStyleLibraryHtmlPasteCandidateBlock(
  input: BlockRenderInput,
): RendererResult<RendererOutputPlaceholder> {
  const { context, issues: contextIssues } = buildBlockRenderContext({
    article: input.article,
    blockId: input.block.id,
    resolvedArticleStyle: input.resolvedArticleStyle,
    mode: input.mode,
    target: input.target,
  });

  if (context == null) {
    const { errors, warnings } = partitionRendererIssues(contextIssues);
    const resolvedBlock = input.resolvedArticleStyle.blocks.find(
      (row) => row.blockId === input.block.id,
    );
    return {
      ok: false,
      blockId: input.block.id,
      blockType: input.block.type,
      variantId: resolvedBlock?.variantId ?? input.block.id,
      mode: input.mode,
      target: input.target,
      issues: errors.length > 0 ? errors : contextIssues,
      warnings,
    };
  }

  const output =
    input.mode === "copy"
      ? renderHtmlPasteTealSectionLabelHeadingCopy(context)
      : renderHtmlPasteTealSectionLabelHeadingPreview(context);

  return {
    ok: true,
    blockId: input.block.id,
    blockType: input.block.type,
    variantId: context.resolvedBlockStyle.variantId,
    mode: input.mode,
    target: input.target,
    output,
    issues: [],
    warnings: contextIssues.filter((issue) => issue.severity !== "error"),
  };
}
