import type { QuoteBlock } from "@/core/blocks";
import { variantIdsForBlockType } from "@/core/styles";

import { renderQuoteCopyHtml } from "@/core/copy/quote-copy";
import { createRendererIssue, partitionRendererIssues } from "./issues";
import {
  normalizeQuoteContentForRenderer,
  resolveQuoteLayout,
} from "./quote-layout";
import { renderQuotePreview } from "./quote-preview";
import type {
  BlockRenderContext,
  BlockRenderer,
  QuoteCopyOutput,
  QuotePreviewOutput,
  RendererResult,
} from "./types";

export const QUOTE_SUPPORTED_VARIANT_IDS = variantIdsForBlockType("quote");

export function validateQuoteRenderContext(
  context: BlockRenderContext,
): ReturnType<typeof createRendererIssue>[] {
  const issues: ReturnType<typeof createRendererIssue>[] = [];
  const { block, resolvedBlockStyle } = context;

  if (block.type !== "quote") {
    issues.push(
      createRendererIssue({
        code: "unsupported_block_type",
        message: `quote renderer only supports quote, got "${block.type}"`,
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

  if (!QUOTE_SUPPORTED_VARIANT_IDS.includes(resolvedBlockStyle.variantId)) {
    issues.push(
      createRendererIssue({
        code: "unsupported_variant",
        message: `variant "${resolvedBlockStyle.variantId}" is not supported by quote renderer`,
        blockId: block.id,
        blockType: block.type,
        variantId: resolvedBlockStyle.variantId,
      }),
    );
  }

  if (resolveQuoteLayout(resolvedBlockStyle.variantId) == null) {
    issues.push(
      createRendererIssue({
        code: "unsupported_variant",
        message: `variant "${resolvedBlockStyle.variantId}" has no quote layout mapping`,
        blockId: block.id,
        blockType: block.type,
        variantId: resolvedBlockStyle.variantId,
      }),
    );
  }

  issues.push(
    ...normalizeQuoteContentForRenderer(
      block as QuoteBlock,
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

export function renderQuote(
  context: BlockRenderContext,
): RendererResult<QuotePreviewOutput | QuoteCopyOutput> {
  const validationIssues = validateQuoteRenderContext(context);
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

  const normalized = normalizeQuoteContentForRenderer(
    context.block as QuoteBlock,
    context.resolvedBlockStyle.variantId,
  );
  const rendered =
    context.mode === "preview"
      ? renderQuotePreview(context, normalized.content)
      : renderQuoteCopyHtml(context, normalized.content);

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

export function createQuoteRenderer(
  mode: BlockRenderContext["mode"],
): BlockRenderer<QuotePreviewOutput | QuoteCopyOutput> {
  return {
    blockType: "quote",
    mode,
    render: renderQuote,
  };
}
