import type { Article } from "@/core/article";
import type { BlockType } from "@/core/blocks";
import type { CopySafety, ResolvedArticleStyle } from "@/core/styles";
import {
  createRendererIssue,
  renderBlock,
  renderTargetForMode,
  type BlockRendererRegistry,
  type RendererIssue,
  type RendererOutputPlaceholder,
  type RendererResult,
} from "@/core/renderer";

import { HEADING_HIGHLIGHT_MARKER_COPY_SAFE_OPTIONS } from "@/core/renderer/heading-publish-decoration";

import { assertCopySafeHtmlSnapshot } from "./copy-safe-html";
import {
  createSprint4ATextFirstCopyRendererRegistry,
  SPRINT4A_TEXT_FIRST_COPY_BLOCK_TYPES,
} from "./text-first-copy-registry";

export type CopyHtmlSnapshotEntry = {
  blockId: string;
  blockType: string;
  variantId: string;
  html: string;
  copySafety?: CopySafety;
  warnings: RendererIssue[];
  metadata: {
    outputKind: string;
  };
};

export type CopyHtmlSnapshot = {
  entries: CopyHtmlSnapshotEntry[];
  issues: RendererIssue[];
  warnings: RendererIssue[];
  metadata: {
    articleId: string;
    blockCount: number;
    variantIds: string[];
    source: "copy_renderer";
  };
};

export type BuildCopyHtmlSnapshotOptions = {
  article: Article;
  resolvedArticleStyle: ResolvedArticleStyle;
  registry?: BlockRendererRegistry;
  supportedBlockTypes?: readonly BlockType[];
  renderBlockFn?: (options: {
    input: {
      article: Article;
      block: Article["blocks"][number];
      resolvedArticleStyle: ResolvedArticleStyle;
      mode: "copy";
      target: ReturnType<typeof renderTargetForMode>;
    };
    registry: BlockRendererRegistry;
    supportedBlockTypes: readonly BlockType[];
  }) => RendererResult<RendererOutputPlaceholder>;
};

type CopyHtmlRendererOutput = Extract<
  RendererOutputPlaceholder,
  { html: string; variantId: string; copySafety?: CopySafety; kind: string }
>;

function isCopyHtmlRendererOutput(
  output: RendererOutputPlaceholder | undefined,
): output is CopyHtmlRendererOutput {
  return (
    output != null &&
    "html" in output &&
    typeof output.html === "string" &&
    "variantId" in output &&
    typeof output.variantId === "string"
  );
}

export function buildCopyHtmlSnapshot(
  options: BuildCopyHtmlSnapshotOptions,
): CopyHtmlSnapshot {
  const registry =
    options.registry ?? createSprint4ATextFirstCopyRendererRegistry();
  const supportedBlockTypes =
    options.supportedBlockTypes ?? SPRINT4A_TEXT_FIRST_COPY_BLOCK_TYPES;
  const entries: CopyHtmlSnapshotEntry[] = [];
  const issues: RendererIssue[] = [];
  const warnings: RendererIssue[] = [];

  for (const block of options.article.blocks) {
    const render = options.renderBlockFn ?? renderBlock;
    const result = render({
      input: {
        article: options.article,
        block,
        resolvedArticleStyle: options.resolvedArticleStyle,
        mode: "copy",
        target: renderTargetForMode("copy"),
      },
      registry,
      supportedBlockTypes,
    });

    warnings.push(...result.warnings);

    if (!result.ok) {
      issues.push(...result.issues);
      continue;
    }

    if (!isCopyHtmlRendererOutput(result.output)) {
      issues.push(
        createRendererIssue({
          code: "invalid_renderer_input",
          message: "copy renderer did not return HTML output",
          blockId: block.id,
          blockType: block.type,
          variantId: result.variantId,
        }),
      );
      continue;
    }

    try {
      assertCopySafeHtmlSnapshot(
        result.output.html,
        result.output.variantId === "heading_highlight_marker"
          ? HEADING_HIGHLIGHT_MARKER_COPY_SAFE_OPTIONS
          : undefined,
      );
    } catch (error) {
      issues.push(
        createRendererIssue({
          code: "invalid_renderer_input",
          message:
            error instanceof Error
              ? error.message
              : "copy HTML failed copy-safe assertion",
          blockId: block.id,
          blockType: block.type,
          variantId: result.output.variantId,
        }),
      );
      continue;
    }

    entries.push({
      blockId: block.id,
      blockType: block.type,
      variantId: result.output.variantId,
      html: result.output.html,
      copySafety: result.output.copySafety,
      warnings: result.warnings,
      metadata: {
        outputKind: result.output.kind,
      },
    });
  }

  return {
    entries,
    issues,
    warnings,
    metadata: {
      articleId: options.article.id,
      blockCount: options.article.blocks.length,
      variantIds: entries.map((entry) => entry.variantId),
      source: "copy_renderer",
    },
  };
}
