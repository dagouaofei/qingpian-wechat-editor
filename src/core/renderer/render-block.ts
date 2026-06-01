import { createRendererIssue, partitionRendererIssues } from "./issues";
import {
  assertRendererSupportedBlockType,
  buildBlockRenderContext,
  validateBlockRenderInput,
} from "./context";
import { resolveRendererOrIssue } from "./registry";
import type {
  BlockRenderInput,
  RenderArticleBlocksOptions,
  RenderBlockOptions,
  RendererFallbackInfo,
  RendererOutputPlaceholder,
  RendererResult,
} from "./types";

function buildFailureResult(
  input: Pick<BlockRenderInput, "block" | "mode" | "target">,
  issues: ReturnType<typeof createRendererIssue>[],
  warnings: ReturnType<typeof createRendererIssue>[] = [],
): RendererResult {
  return {
    ok: false,
    blockId: input.block.id,
    blockType: input.block.type,
    mode: input.mode,
    target: input.target,
    issues,
    warnings,
  };
}

function buildPlaceholderOutput(
  input: BlockRenderInput,
): RendererOutputPlaceholder {
  return input.mode === "preview"
    ? { kind: "preview_placeholder", blockId: input.block.id }
    : { kind: "copy_placeholder", blockId: input.block.id };
}

function collectCopySafetyWarnings(
  input: BlockRenderInput,
  resolvedCopySafety: string | undefined,
): ReturnType<typeof createRendererIssue>[] {
  if (input.mode !== "copy") {
    return [];
  }

  if (resolvedCopySafety === "preview_only") {
    return [
      createRendererIssue({
        code: "copy_safety_warning",
        message: `variant copySafety is preview_only; copy path should not ship this variant unchanged`,
        severity: "warning",
        blockId: input.block.id,
        blockType: input.block.type,
        path: ["resolvedBlockStyle", "compatibility", "copySafety"],
      }),
    ];
  }

  return [];
}

function buildFallbackInfo(
  resolvedSource: RendererFallbackInfo["styleSource"],
  resolvedFallbackReason?: string,
  resolvedFallbackVariantId?: string,
): RendererFallbackInfo | undefined {
  if (resolvedSource !== "fallback" && resolvedFallbackReason == null) {
    return undefined;
  }

  return {
    applied: resolvedSource === "fallback" || resolvedFallbackReason != null,
    reason: resolvedFallbackReason,
    styleSource: resolvedSource,
    fallbackVariantId: resolvedFallbackVariantId,
  };
}

export function renderBlock(
  options: RenderBlockOptions,
): RendererResult<RendererOutputPlaceholder> {
  const { input, registry, supportedBlockTypes } = options;
  const inputIssues = validateBlockRenderInput(input);

  if (inputIssues.length > 0) {
    const { errors, warnings } = partitionRendererIssues(inputIssues);
    return buildFailureResult(input, errors, warnings);
  }

  const unsupportedIssue = assertRendererSupportedBlockType(
    input.block.type,
    supportedBlockTypes,
    input.block.id,
  );

  if (unsupportedIssue != null) {
    return buildFailureResult(input, [unsupportedIssue]);
  }

  const { context, issues: contextIssues } = buildBlockRenderContext({
    article: input.article,
    blockId: input.block.id,
    resolvedArticleStyle: input.resolvedArticleStyle,
    mode: input.mode,
    target: input.target,
  });

  const preRenderWarnings = [
    ...contextIssues,
    ...collectCopySafetyWarnings(
      input,
      context?.copySafety ?? context?.resolvedBlockStyle.compatibility?.copySafety,
    ),
  ];

  if (context == null) {
    const blocking = contextIssues.filter((issue) => issue.severity === "error");
    const { errors, warnings } = partitionRendererIssues([
      ...blocking,
      ...preRenderWarnings.filter((issue) => !blocking.includes(issue)),
    ]);
    return buildFailureResult(input, errors.length > 0 ? errors : blocking, warnings);
  }

  const { renderer, issue: registryIssue } = resolveRendererOrIssue(
    registry,
    input.block.type,
    input.mode,
    input.block.id,
  );

  if (registryIssue != null) {
    const { warnings } = partitionRendererIssues(preRenderWarnings);
    return buildFailureResult(input, [registryIssue], warnings);
  }

  const rendered = renderer!.render(context);
  const mergedIssues = [...rendered.issues, ...preRenderWarnings];
  const { errors, warnings } = partitionRendererIssues(mergedIssues);

  return {
    ...rendered,
    ok: rendered.ok && errors.length === 0,
    issues: errors,
    warnings: [...rendered.warnings, ...warnings],
    fallback:
      rendered.fallback ??
      buildFallbackInfo(
        context.resolvedBlockStyle.source,
        context.resolvedBlockStyle.fallbackReason,
        context.resolvedBlockStyle.variant.compatibility?.wechat?.fallbackVariantId,
      ),
    output: rendered.output ?? buildPlaceholderOutput(input),
  };
}

export function renderArticleBlocks(
  options: RenderArticleBlocksOptions,
): RendererResult<RendererOutputPlaceholder>[] {
  return options.article.blocks.map((block) =>
    renderBlock({
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
