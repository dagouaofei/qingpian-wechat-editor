import type { InfoCardBlock } from "@/core/blocks";
import { variantIdsForBlockType } from "@/core/styles";

import { renderInfoCardCopyHtml } from "@/core/copy/info-card-copy";
import { createRendererIssue, partitionRendererIssues } from "./issues";
import {
  normalizeInfoCardContentForRenderer,
  resolveInfoCardLayout,
} from "./info-card-layout";
import { renderInfoCardPreview } from "./info-card-preview";
import type {
  BlockRenderContext,
  BlockRenderer,
  InfoCardCopyOutput,
  InfoCardPreviewOutput,
  RendererResult,
} from "./types";

export const INFO_CARD_SUPPORTED_VARIANT_IDS = variantIdsForBlockType("info_card");

export function validateInfoCardRenderContext(
  context: BlockRenderContext,
): ReturnType<typeof createRendererIssue>[] {
  const issues: ReturnType<typeof createRendererIssue>[] = [];
  const { block, resolvedBlockStyle } = context;

  if (block.type !== "info_card") {
    issues.push(
      createRendererIssue({
        code: "unsupported_block_type",
        message: `info_card renderer only supports info_card, got "${block.type}"`,
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

  if (!INFO_CARD_SUPPORTED_VARIANT_IDS.includes(resolvedBlockStyle.variantId)) {
    issues.push(
      createRendererIssue({
        code: "unsupported_variant",
        message: `variant "${resolvedBlockStyle.variantId}" is not supported by info_card renderer`,
        blockId: block.id,
        blockType: block.type,
        variantId: resolvedBlockStyle.variantId,
      }),
    );
  }

  if (resolveInfoCardLayout(resolvedBlockStyle.variantId) == null) {
    issues.push(
      createRendererIssue({
        code: "unsupported_variant",
        message: `variant "${resolvedBlockStyle.variantId}" has no info_card layout mapping`,
        blockId: block.id,
        blockType: block.type,
        variantId: resolvedBlockStyle.variantId,
      }),
    );
  }

  issues.push(
    ...normalizeInfoCardContentForRenderer(
      block as InfoCardBlock,
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

export function renderInfoCard(
  context: BlockRenderContext,
): RendererResult<InfoCardPreviewOutput | InfoCardCopyOutput> {
  const validationIssues = validateInfoCardRenderContext(context);
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

  const normalized = normalizeInfoCardContentForRenderer(
    context.block as InfoCardBlock,
    context.resolvedBlockStyle.variantId,
  );
  const rendered =
    context.mode === "preview"
      ? renderInfoCardPreview(context, normalized.content)
      : renderInfoCardCopyHtml(context, normalized.content);

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

export function createInfoCardRenderer(
  mode: BlockRenderContext["mode"],
): BlockRenderer<InfoCardPreviewOutput | InfoCardCopyOutput> {
  return {
    blockType: "info_card",
    mode,
    render: renderInfoCard,
  };
}
