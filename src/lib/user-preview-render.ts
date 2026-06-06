import type { BlockType } from "@/core/blocks";
import { buildClipboardPayload, type BuildClipboardPayloadOptions } from "@/core/copy/clipboard-payload";
import {
  isStyleLibraryHtmlPasteCandidateVariant,
  renderStyleLibraryHtmlPasteCandidateBlock,
} from "@/core/style-library/inspection-render-adapter";
import { isUserSelectablePreviewVariantId } from "@/core/style-library/user-selectable-preview-pool";
import {
  renderBlock,
  type RenderArticleBlocksOptions,
  type RenderBlockOptions,
  type RendererOutputPlaceholder,
  type RendererResult,
} from "@/core/renderer";

function shouldUseUserSelectablePreviewAdapter(variantId: string | undefined): boolean {
  return (
    variantId != null &&
    isUserSelectablePreviewVariantId(variantId) &&
    isStyleLibraryHtmlPasteCandidateVariant(variantId)
  );
}

export function renderUserPreviewBlock(
  options: RenderBlockOptions,
): RendererResult<RendererOutputPlaceholder> {
  const resolved = options.input.resolvedArticleStyle.blocks.find(
    (entry) => entry.blockId === options.input.block.id,
  );
  const variantId = resolved?.variantId;

  if (shouldUseUserSelectablePreviewAdapter(variantId)) {
    return renderStyleLibraryHtmlPasteCandidateBlock(options.input);
  }

  return renderBlock(options);
}

export function renderUserPreviewArticleBlocks(
  options: RenderArticleBlocksOptions,
): RendererResult<RendererOutputPlaceholder>[] {
  return options.article.blocks.map((block) =>
    renderUserPreviewBlock({
      input: {
        article: options.article,
        block,
        resolvedArticleStyle: options.resolvedArticleStyle,
        mode: options.mode,
        target: options.target,
      },
      registry: options.registry,
      supportedBlockTypes: options.supportedBlockTypes,
    }),
  );
}

export function buildUserPreviewClipboardPayload(
  options: BuildClipboardPayloadOptions & {
    supportedBlockTypes?: readonly BlockType[];
  },
) {
  return buildClipboardPayload({
    ...options,
    renderBlockFn: renderUserPreviewBlock,
  });
}
