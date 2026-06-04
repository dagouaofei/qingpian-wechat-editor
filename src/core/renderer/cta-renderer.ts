import type { CtaBlock } from "@/core/blocks";
import { variantIdsForBlockType } from "@/core/styles";

import { renderCtaCopyHtml } from "@/core/copy/cta-copy";
import { createRendererIssue, partitionRendererIssues } from "./issues";
import { normalizeCtaContentForRenderer, resolveCtaLayout } from "./cta-layout";
import { renderCtaPreview } from "./cta-preview";
import type {
  BlockRenderContext,
  BlockRenderer,
  CtaCopyOutput,
  CtaPreviewOutput,
  RendererResult,
} from "./types";

export const CTA_SUPPORTED_VARIANT_IDS = variantIdsForBlockType("cta");

export function validateCtaRenderContext(
  context: BlockRenderContext,
): ReturnType<typeof createRendererIssue>[] {
  const issues: ReturnType<typeof createRendererIssue>[] = [];
  const { block, resolvedBlockStyle } = context;

  if (block.type !== "cta") {
    issues.push(
      createRendererIssue({
        code: "unsupported_block_type",
        message: `cta renderer only supports cta, got "${block.type}"`,
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

  if (!CTA_SUPPORTED_VARIANT_IDS.includes(resolvedBlockStyle.variantId)) {
    issues.push(
      createRendererIssue({
        code: "unsupported_variant",
        message: `variant "${resolvedBlockStyle.variantId}" is not supported by cta renderer`,
        blockId: block.id,
        blockType: block.type,
        variantId: resolvedBlockStyle.variantId,
      }),
    );
  }

  if (resolveCtaLayout(resolvedBlockStyle.variantId) == null) {
    issues.push(
      createRendererIssue({
        code: "unsupported_variant",
        message: `variant "${resolvedBlockStyle.variantId}" has no cta layout mapping`,
        blockId: block.id,
        blockType: block.type,
        variantId: resolvedBlockStyle.variantId,
      }),
    );
  }

  issues.push(
    ...normalizeCtaContentForRenderer(
      block as CtaBlock,
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

export function renderCta(
  context: BlockRenderContext,
): RendererResult<CtaPreviewOutput | CtaCopyOutput> {
  const validationIssues = validateCtaRenderContext(context);
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

  const normalized = normalizeCtaContentForRenderer(
    context.block as CtaBlock,
    context.resolvedBlockStyle.variantId,
  );
  const rendered =
    context.mode === "preview"
      ? renderCtaPreview(context, normalized.content)
      : renderCtaCopyHtml(context, normalized.content);

  return {
    ok: true,
    blockId: context.block.id,
    blockType: context.block.type,
    variantId: context.resolvedBlockStyle.variantId,
    mode: context.mode,
    target: context.target,
    output: rendered.output,
    issues: [],
    warnings: [
      ...validationWarnings,
      ...collectBalancedCopySafetyWarning(context),
      ...rendered.warnings,
    ],
  };
}

export function createCtaRenderer(
  mode: BlockRenderContext["mode"],
): BlockRenderer<CtaPreviewOutput | CtaCopyOutput> {
  return {
    blockType: "cta",
    mode,
    render: renderCta,
  };
}
