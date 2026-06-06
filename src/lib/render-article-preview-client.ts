import type { Article } from "@/core/article";
import {
  createRelease1FirstWaveCopyRendererRegistry,
  RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES,
} from "@/core/copy/first-wave-copy-registry";
import type { NormalizedInput } from "@/core/generation/input";
import { generateDeterministicStyleSelection } from "@/core/generation/style-selection";
import {
  createRelease1FirstWavePreviewRendererRegistry,
  RELEASE1_FIRST_WAVE_PREVIEW_BLOCK_TYPES,
  renderTargetForMode,
  type RendererOutputPlaceholder,
} from "@/core/renderer";
import {
  createFirstWaveRequiredVariantRegistry,
  resolveArticleStyle,
} from "@/core/styles";

import type { SerializedPreviewBlock } from "@/server/generation/generate-flow-types";

import {
  applyPreviewThemeToArticle,
  buildNormalizedInputForPreviewControl,
  type PreviewStyleControlState,
} from "./preview-style-controls";
import {
  applyHeadingVariantToArticle,
  type PreviewHeadingVariantId,
} from "./preview-heading-style";
import { createUserPreviewStyleRegistry } from "./user-preview-style-registry";
import {
  buildUserPreviewClipboardPayload,
  renderUserPreviewArticleBlocks,
} from "./user-preview-render";

function serializePreviewBlocks(
  results: ReturnType<typeof renderUserPreviewArticleBlocks>,
): SerializedPreviewBlock[] {
  return results.map((result) => ({
    blockId: result.blockId,
    blockType: result.blockType,
    variantId:
      result.output && "variantId" in result.output
        ? String((result.output as { variantId?: string }).variantId)
        : undefined,
    ok: result.ok,
    output: result.output as RendererOutputPlaceholder | undefined,
    issues: result.issues,
    warnings: result.warnings,
  }));
}

export type RenderArticlePreviewClientResult = {
  article: Article;
  previewBlocks: SerializedPreviewBlock[];
  clipboard: {
    textHtml: string;
    textPlain: string;
    issueCount: number;
    warningCount: number;
  };
};

export function renderArticlePreviewClient(
  article: Article,
  normalizedInput: NormalizedInput,
  control: PreviewStyleControlState,
  options?: {
    postStyleSelectionPatch?: (article: Article) => Article;
  },
): RenderArticlePreviewClientResult {
  const generationRegistry = createFirstWaveRequiredVariantRegistry();
  const previewStyleRegistry = createUserPreviewStyleRegistry();
  const themedArticle = applyPreviewThemeToArticle(article, control.colorPalette);
  const styleInput = buildNormalizedInputForPreviewControl(normalizedInput, control);

  const styleResult = generateDeterministicStyleSelection({
    article: themedArticle,
    normalizedInput: styleInput,
    registry: generationRegistry,
  });

  const styledArticleBase = styleResult.applied
    ? applyPreviewThemeToArticle(styleResult.article, control.colorPalette)
    : themedArticle;

  let styledArticle = options?.postStyleSelectionPatch
    ? options.postStyleSelectionPatch(styledArticleBase)
    : styledArticleBase;

  if (control.headingVariantId) {
    styledArticle = applyHeadingVariantToArticle(
      styledArticle,
      control.headingVariantId as PreviewHeadingVariantId,
    );
  }

  const resolvedArticleStyle = resolveArticleStyle(styledArticle, previewStyleRegistry);
  const previewRegistry = createRelease1FirstWavePreviewRendererRegistry();
  const previewResults = renderUserPreviewArticleBlocks({
    article: styledArticle,
    resolvedArticleStyle,
    mode: "preview",
    target: renderTargetForMode("preview"),
    registry: previewRegistry,
    supportedBlockTypes: RELEASE1_FIRST_WAVE_PREVIEW_BLOCK_TYPES,
  });

  const copyRegistry = createRelease1FirstWaveCopyRendererRegistry();
  const clipboardPayload = buildUserPreviewClipboardPayload({
    article: styledArticle,
    resolvedArticleStyle,
    registry: copyRegistry,
    supportedBlockTypes: RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES,
  });

  return {
    article: styledArticle,
    previewBlocks: serializePreviewBlocks(previewResults).filter((block) => block.ok),
    clipboard: {
      textHtml: clipboardPayload.textHtml,
      textPlain: clipboardPayload.textPlain,
      issueCount: clipboardPayload.issues.length,
      warningCount: clipboardPayload.warnings.length,
    },
  };
}
