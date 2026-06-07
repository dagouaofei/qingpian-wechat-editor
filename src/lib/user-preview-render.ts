import type { BlockType } from "@/core/blocks";
import { buildClipboardPayload, type BuildClipboardPayloadOptions } from "@/core/copy/clipboard-payload";
import {
  isStyleLibraryHtmlPasteCandidateVariant,
  renderStyleLibraryHtmlPasteCandidateBlock,
} from "@/core/style-library/inspection-render-adapter";
import { isUserSelectablePreviewVariantId } from "@/core/style-library/user-selectable-preview-pool";

export type UserPreviewPoolContext = {
  userSelectableVariantIds?: readonly string[];
};
import {
  renderBlock,
  type RenderArticleBlocksOptions,
  type RenderBlockOptions,
  type RendererOutputPlaceholder,
  type RendererResult,
} from "@/core/renderer";

function isUserSelectableVariantForPreview(
  variantId: string | undefined,
  poolContext?: UserPreviewPoolContext,
): boolean {
  if (!variantId) {
    return false;
  }
  if (poolContext?.userSelectableVariantIds?.includes(variantId)) {
    return true;
  }
  return isUserSelectablePreviewVariantId(variantId);
}

function shouldUseUserSelectablePreviewAdapter(
  variantId: string | undefined,
  poolContext?: UserPreviewPoolContext,
): boolean {
  return (
    isUserSelectableVariantForPreview(variantId, poolContext) &&
    isStyleLibraryHtmlPasteCandidateVariant(variantId ?? "")
  );
}

export function renderUserPreviewBlock(
  options: RenderBlockOptions & { poolContext?: UserPreviewPoolContext },
): RendererResult<RendererOutputPlaceholder> {
  const resolved = options.input.resolvedArticleStyle.blocks.find(
    (entry) => entry.blockId === options.input.block.id,
  );
  const variantId = resolved?.variantId;

  if (shouldUseUserSelectablePreviewAdapter(variantId, options.poolContext)) {
    return renderStyleLibraryHtmlPasteCandidateBlock(options.input);
  }

  return renderBlock(options);
}

export function renderUserPreviewArticleBlocks(
  options: RenderArticleBlocksOptions & { poolContext?: UserPreviewPoolContext },
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
      poolContext: options.poolContext,
    }),
  );
}

export function buildUserPreviewClipboardPayload(
  options: BuildClipboardPayloadOptions & {
    supportedBlockTypes?: readonly BlockType[];
    poolContext?: UserPreviewPoolContext;
  },
) {
  return buildClipboardPayload({
    ...options,
    renderBlockFn: (renderOptions) =>
      renderUserPreviewBlock({
        ...renderOptions,
        poolContext: options.poolContext,
      }),
  });
}
