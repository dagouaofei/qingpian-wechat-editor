import {
  LEAD_FIRST_WAVE_VARIANTS,
  PARAGRAPH_FIRST_WAVE_VARIANTS,
} from "@/core/styles";

import { renderTextBlockCopyHtml } from "@/core/copy/text-block-copy";
import { createRendererIssue, partitionRendererIssues } from "./issues";
import { renderTextBlockPreview } from "./text-block-preview";
import { resolveTextBlockLayout } from "./text-block-typography";
import type {
  BlockRenderContext,
  BlockRenderer,
  RendererResult,
  TextBlockCopyOutput,
  TextBlockPreviewOutput,
} from "./types";

export const TEXT_BLOCK_SUPPORTED_VARIANT_IDS = [
  ...LEAD_FIRST_WAVE_VARIANTS.map((variant) => variant.id),
  ...PARAGRAPH_FIRST_WAVE_VARIANTS.map((variant) => variant.id),
];

export function validateTextBlockRenderContext(
  context: BlockRenderContext,
): ReturnType<typeof createRendererIssue>[] {
  const issues: ReturnType<typeof createRendererIssue>[] = [];
  const { block, resolvedBlockStyle } = context;

  if (block.type !== "lead" && block.type !== "paragraph") {
    issues.push(
      createRendererIssue({
        code: "unsupported_block_type",
        message: `text block renderer only supports lead / paragraph, got "${block.type}"`,
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

  if (!TEXT_BLOCK_SUPPORTED_VARIANT_IDS.includes(resolvedBlockStyle.variantId)) {
    issues.push(
      createRendererIssue({
        code: "unsupported_variant",
        message: `variant "${resolvedBlockStyle.variantId}" is not supported by text block renderer`,
        blockId: block.id,
        blockType: block.type,
        variantId: resolvedBlockStyle.variantId,
      }),
    );
  }

  if (resolveTextBlockLayout(resolvedBlockStyle.variantId) == null) {
    issues.push(
      createRendererIssue({
        code: "unsupported_variant",
        message: `variant "${resolvedBlockStyle.variantId}" has no text block layout mapping`,
        blockId: block.id,
        blockType: block.type,
        variantId: resolvedBlockStyle.variantId,
      }),
    );
  }

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

export function renderTextBlock(
  context: BlockRenderContext,
): RendererResult<TextBlockPreviewOutput | TextBlockCopyOutput> {
  const validationIssues = validateTextBlockRenderContext(context);
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

  const inlineWarnings: ReturnType<typeof createRendererIssue>[] = [];
  const output =
    context.mode === "preview"
      ? (() => {
          const rendered = renderTextBlockPreview(context);
          inlineWarnings.push(...rendered.warnings);
          return rendered.output;
        })()
      : (() => {
          const rendered = renderTextBlockCopyHtml(context);
          inlineWarnings.push(...rendered.warnings);
          return rendered.output;
        })();

  const warnings = [
    ...validationWarnings,
    ...collectBalancedCopySafetyWarning(context),
    ...inlineWarnings,
  ];

  return {
    ok: true,
    blockId: context.block.id,
    blockType: context.block.type,
    variantId: context.resolvedBlockStyle.variantId,
    mode: context.mode,
    target: context.target,
    output,
    issues: [],
    warnings,
  };
}

export function createTextBlockRenderer(
  blockType: "lead" | "paragraph",
  mode: BlockRenderContext["mode"],
): BlockRenderer<TextBlockPreviewOutput | TextBlockCopyOutput> {
  return {
    blockType,
    mode,
    render: renderTextBlock,
  };
}
