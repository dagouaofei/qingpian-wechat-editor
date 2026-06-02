import type { Article } from "@/core/article";
import { buildClipboardPayload } from "@/core/copy/clipboard-payload";
import {
  createRelease1FirstWaveCopyRendererRegistry,
  RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES,
} from "@/core/copy/first-wave-copy-registry";
import type { NormalizedInput } from "@/core/generation/input";
import { generateDeterministicStyleSelection } from "@/core/generation/style-selection";
import {
  createRelease1FirstWavePreviewRendererRegistry,
  RELEASE1_FIRST_WAVE_PREVIEW_BLOCK_TYPES,
  renderArticleBlocks,
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

function serializePreviewBlocks(
  results: ReturnType<typeof renderArticleBlocks>,
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
  const registry = createFirstWaveRequiredVariantRegistry();
  const themedArticle = applyPreviewThemeToArticle(article, control.colorPalette);
  const styleInput = buildNormalizedInputForPreviewControl(normalizedInput, control);

  const styleResult = generateDeterministicStyleSelection({
    article: themedArticle,
    normalizedInput: styleInput,
    registry,
  });

  const styledArticleBase = styleResult.applied
    ? applyPreviewThemeToArticle(styleResult.article, control.colorPalette)
    : themedArticle;

  const styledArticle = options?.postStyleSelectionPatch
    ? options.postStyleSelectionPatch(styledArticleBase)
    : styledArticleBase;

  const resolvedArticleStyle = resolveArticleStyle(styledArticle, registry);
  const previewRegistry = createRelease1FirstWavePreviewRendererRegistry();
  const previewResults = renderArticleBlocks({
    article: styledArticle,
    resolvedArticleStyle,
    mode: "preview",
    target: renderTargetForMode("preview"),
    registry: previewRegistry,
    supportedBlockTypes: RELEASE1_FIRST_WAVE_PREVIEW_BLOCK_TYPES,
  });

  const copyRegistry = createRelease1FirstWaveCopyRendererRegistry();
  const clipboardPayload = buildClipboardPayload({
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
