import type { HighlightBlock } from "@/core/blocks";
import { variantIdsForBlockType } from "@/core/styles";

import { renderHighlightCopyHtml } from "@/core/copy/highlight-copy";
import { createRendererIssue, partitionRendererIssues } from "./issues";
import {
  normalizeHighlightContentForRenderer,
  resolveHighlightLayout,
} from "./highlight-layout";
import { renderHighlightPreview } from "./highlight-preview";
import type {
  BlockRenderContext,
  BlockRenderer,
  HighlightCopyOutput,
  HighlightPreviewOutput,
  RendererResult,
} from "./types";

export const HIGHLIGHT_SUPPORTED_VARIANT_IDS = variantIdsForBlockType("highlight");

export function validateHighlightRenderContext(
  context: BlockRenderContext,
): ReturnType<typeof createRendererIssue>[] {
  const issues: ReturnType<typeof createRendererIssue>[] = [];
  const { block, resolvedBlockStyle } = context;

  if (block.type !== "highlight") {
    issues.push(
      createRendererIssue({
        code: "unsupported_block_type",
        message: `highlight renderer only supports highlight, got "${block.type}"`,
        blockId: block.id,
        blockType: block.type,
      }),
    );
    return issues;
  }

  if (resolvedBlockStyle.blockType !== block.type) {
    issues.push(
      createRendererIssue({
        code: "invalid_renderer_input",
        message: "ResolvedBlockStyle.blockType does not match block.type",
        blockId: block.id,
        blockType: block.type,
        variantId: resolvedBlockStyle.variantId,
      }),
    );
  }

  if (!HIGHLIGHT_SUPPORTED_VARIANT_IDS.includes(resolvedBlockStyle.variantId)) {
    issues.push(
      createRendererIssue({
        code: "unsupported_variant",
        message: `variant "${resolvedBlockStyle.variantId}" is not supported by highlight renderer`,
        blockId: block.id,
        blockType: block.type,
        variantId: resolvedBlockStyle.variantId,
      }),
    );
  }

  if (resolveHighlightLayout(resolvedBlockStyle.variantId) == null) {
    issues.push(
      createRendererIssue({
        code: "unsupported_variant",
        message: `variant "${resolvedBlockStyle.variantId}" has no highlight layout mapping`,
        blockId: block.id,
        blockType: block.type,
        variantId: resolvedBlockStyle.variantId,
      }),
    );
  }

  issues.push(
    ...normalizeHighlightContentForRenderer(
      block as HighlightBlock,
      resolvedBlockStyle.variantId,
    ).issues,
  );

  return issues;
}

function collectBalancedCopySafetyWarning(
  context: BlockRenderContext,
): ReturnType<typeof createRendererIssue>[] {
  if (context.mode !== "copy") {
    return [];
  }

  const copySafety =
    context.copySafety ??
    context.resolvedBlockStyle.compatibility?.copySafety ??
    context.resolvedBlockStyle.variant.compatibility?.copySafety;

  if (copySafety === "balanced") {
    return [
      createRendererIssue({
        code: "copy_safety_warning",
        message:
          "variant uses balanced copySafety; verify WeChat paste fidelity manually",
        severity: "warning",
        blockId: context.block.id,
        blockType: context.block.type,
        variantId: context.resolvedBlockStyle.variantId,
      }),
    ];
  }

  return [];
}

export function renderHighlight(
  context: BlockRenderContext,
): RendererResult<HighlightPreviewOutput | HighlightCopyOutput> {
  const validationIssues = validateHighlightRenderContext(context);
  const { errors, warnings: validationWarnings } =
    partitionRendererIssues(validationIssues);

  if (errors.length > 0) {
    return {
      ok: false,
      blockId: context.block.id,
      blockType: context.block.type,
      variantId: context.resolvedBlockStyle.variantId,
      mode: context.mode,
      target: context.target,
      issues: errors,
      warnings: validationWarnings,
    };
  }

  const normalized = normalizeHighlightContentForRenderer(
    context.block as HighlightBlock,
    context.resolvedBlockStyle.variantId,
  );
  const rendered =
    context.mode === "preview"
      ? renderHighlightPreview(context, normalized.content)
      : renderHighlightCopyHtml(context, normalized.content);

  const warnings = [
    ...validationWarnings,
    ...collectBalancedCopySafetyWarning(context),
    ...rendered.warnings,
  ];

  return {
    ok: true,
    blockId: context.block.id,
    blockType: context.block.type,
    variantId: context.resolvedBlockStyle.variantId,
    mode: context.mode,
    target: context.target,
    output: rendered.output,
    issues: [],
    warnings,
  };
}

export function createHighlightRenderer(
  mode: BlockRenderContext["mode"],
): BlockRenderer<HighlightPreviewOutput | HighlightCopyOutput> {
  return {
    blockType: "highlight",
    mode,
    render: renderHighlight,
  };
}
