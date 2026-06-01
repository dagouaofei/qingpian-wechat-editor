import { DIVIDER_FIRST_WAVE_VARIANTS } from "@/core/styles";

import { renderDividerCopyHtml } from "@/core/copy/divider-copy";
import { createRendererIssue, partitionRendererIssues } from "./issues";
import { renderDividerPreview } from "./divider-preview";
import { resolveDividerLayout } from "./divider-layout";
import type {
  BlockRenderContext,
  BlockRenderer,
  DividerCopyOutput,
  DividerPreviewOutput,
  RendererResult,
} from "./types";

export const DIVIDER_SUPPORTED_VARIANT_IDS = DIVIDER_FIRST_WAVE_VARIANTS.map(
  (variant) => variant.id,
);

export function validateDividerRenderContext(
  context: BlockRenderContext,
): ReturnType<typeof createRendererIssue>[] {
  const issues: ReturnType<typeof createRendererIssue>[] = [];
  const { block, resolvedBlockStyle } = context;

  if (block.type !== "divider") {
    issues.push(
      createRendererIssue({
        code: "unsupported_block_type",
        message: `divider renderer only supports divider, got "${block.type}"`,
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

  if (!DIVIDER_SUPPORTED_VARIANT_IDS.includes(resolvedBlockStyle.variantId)) {
    issues.push(
      createRendererIssue({
        code: "unsupported_variant",
        message: `variant "${resolvedBlockStyle.variantId}" is not supported by divider renderer`,
        blockId: block.id,
        blockType: block.type,
        variantId: resolvedBlockStyle.variantId,
      }),
    );
  }

  if (resolveDividerLayout(resolvedBlockStyle.variantId) == null) {
    issues.push(
      createRendererIssue({
        code: "unsupported_variant",
        message: `variant "${resolvedBlockStyle.variantId}" has no divider layout mapping`,
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

export function renderDivider(
  context: BlockRenderContext,
): RendererResult<DividerPreviewOutput | DividerCopyOutput> {
  const validationIssues = validateDividerRenderContext(context);
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

  const warnings = [
    ...validationWarnings,
    ...collectBalancedCopySafetyWarning(context),
  ];

  const output =
    context.mode === "preview"
      ? renderDividerPreview(context)
      : renderDividerCopyHtml(context);

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

export function createDividerRenderer(
  mode: BlockRenderContext["mode"],
): BlockRenderer<DividerPreviewOutput | DividerCopyOutput> {
  return {
    blockType: "divider",
    mode,
    render: renderDivider,
  };
}
