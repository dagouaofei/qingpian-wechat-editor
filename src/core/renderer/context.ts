import type { BlockType } from "@/core/blocks";
import type { Article } from "@/core/article";
import type { ResolvedArticleStyle } from "@/core/styles";

import { createRendererIssue } from "./issues";
import {
  enrichResolvedBlockStyleForRenderer,
  resolveSlotRenderStates,
} from "./resolved-view";
import type {
  BlockRenderContext,
  BlockRenderInput,
  RenderMode,
  RenderTarget,
  RendererIssue,
} from "./types";
import { renderTargetForMode } from "./types";

export class RendererInputError extends Error {
  readonly issues: RendererIssue[];

  constructor(message: string, issues: RendererIssue[]) {
    super(message);
    this.name = "RendererInputError";
    this.issues = issues;
  }
}

export type BuildBlockRenderContextOptions = {
  article: Article;
  blockId: string;
  resolvedArticleStyle: ResolvedArticleStyle;
  mode: RenderMode;
  target?: RenderTarget;
};

export function findResolvedBlockStyle(
  resolvedArticleStyle: ResolvedArticleStyle,
  blockId: string,
) {
  return resolvedArticleStyle.blocks.find((entry) => entry.blockId === blockId);
}

export function validateBlockRenderInput(
  input: BlockRenderInput,
): RendererIssue[] {
  const issues: RendererIssue[] = [];

  if (input.resolvedArticleStyle.articleId !== input.article.id) {
    issues.push(
      createRendererIssue({
        code: "invalid_renderer_input",
        message: "resolvedArticleStyle.articleId does not match article.id",
        blockId: input.block.id,
        blockType: input.block.type,
        path: ["resolvedArticleStyle", "articleId"],
        details: {
          articleId: input.article.id,
          resolvedArticleId: input.resolvedArticleStyle.articleId,
        },
      }),
    );
  }

  const blockInArticle = input.article.blocks.some(
    (candidate) => candidate.id === input.block.id,
  );

  if (!blockInArticle) {
    issues.push(
      createRendererIssue({
        code: "invalid_renderer_input",
        message: "block is not present in article.blocks",
        blockId: input.block.id,
        blockType: input.block.type,
        path: ["article", "blocks"],
      }),
    );
  }

  const expectedTarget = renderTargetForMode(input.mode);
  if (input.target !== expectedTarget) {
    issues.push(
      createRendererIssue({
        code: "invalid_renderer_input",
        message: `render target "${input.target}" does not match mode "${input.mode}"`,
        blockId: input.block.id,
        blockType: input.block.type,
        path: ["target"],
        details: {
          expectedTarget,
          actualTarget: input.target,
        },
      }),
    );
  }

  return issues;
}

export function buildBlockRenderContext(
  options: BuildBlockRenderContextOptions,
): { context?: BlockRenderContext; issues: RendererIssue[] } {
  const block = options.article.blocks.find(
    (candidate) => candidate.id === options.blockId,
  );

  if (!block) {
    return {
      issues: [
        createRendererIssue({
          code: "invalid_renderer_input",
          message: `blockId "${options.blockId}" not found in article.blocks`,
          blockId: options.blockId,
          path: ["article", "blocks"],
        }),
      ],
    };
  }

  const target = options.target ?? renderTargetForMode(options.mode);
  const inputIssues = validateBlockRenderInput({
    article: options.article,
    block,
    resolvedArticleStyle: options.resolvedArticleStyle,
    mode: options.mode,
    target,
  });

  if (inputIssues.length > 0) {
    return { issues: inputIssues };
  }

  const resolvedBlockStyle = findResolvedBlockStyle(
    options.resolvedArticleStyle,
    block.id,
  );

  if (!resolvedBlockStyle) {
    return {
      issues: [
        createRendererIssue({
          code: "missing_resolved_style",
          message: `no ResolvedBlockStyle for blockId "${block.id}"`,
          blockId: block.id,
          blockType: block.type,
          path: ["resolvedArticleStyle", "blocks"],
        }),
      ],
    };
  }

  const enriched = enrichResolvedBlockStyleForRenderer(resolvedBlockStyle);
  const { slotStates, issues: slotIssues } = resolveSlotRenderStates(enriched, {
    mode: options.mode,
  });

  return {
    context: {
      article: options.article,
      block,
      resolvedArticleStyle: options.resolvedArticleStyle,
      resolvedBlockStyle: enriched,
      mode: options.mode,
      target,
      slotStates,
      copySafety: enriched.compatibility?.copySafety ?? enriched.variant.compatibility?.copySafety,
    },
    issues: slotIssues,
  };
}

export function assertRendererSupportedBlockType(
  blockType: BlockType,
  supportedBlockTypes: readonly BlockType[] | undefined,
  blockId: string,
): RendererIssue | undefined {
  if (supportedBlockTypes == null) {
    return undefined;
  }

  if (!supportedBlockTypes.includes(blockType)) {
    return createRendererIssue({
      code: "unsupported_block_type",
      message: `block type "${blockType}" is outside renderer supported scope`,
      blockId,
      blockType,
      path: ["block", "type"],
    });
  }

  return undefined;
}

export function buildBlockRenderInputFromContext(
  context: BlockRenderContext,
): BlockRenderInput {
  return {
    article: context.article,
    block: context.block,
    resolvedArticleStyle: context.resolvedArticleStyle,
    mode: context.mode,
    target: context.target,
  };
}
