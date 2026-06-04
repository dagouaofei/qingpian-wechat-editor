import type { ImagePlaceholderBlock } from "@/core/blocks";
import { variantIdsForBlockType } from "@/core/styles";

import { renderImagePlaceholderCopyHtml } from "@/core/copy/image-placeholder-copy";
import { createRendererIssue, partitionRendererIssues } from "./issues";
import {
  normalizeImagePlaceholderContentForRenderer,
  resolveImagePlaceholderLayout,
} from "./image-placeholder-layout";
import { renderImagePlaceholderPreview } from "./image-placeholder-preview";
import type {
  BlockRenderContext,
  BlockRenderer,
  ImagePlaceholderCopyOutput,
  ImagePlaceholderPreviewOutput,
  RendererResult,
} from "./types";

export const IMAGE_PLACEHOLDER_SUPPORTED_VARIANT_IDS =
  variantIdsForBlockType("image_placeholder");

export function validateImagePlaceholderRenderContext(
  context: BlockRenderContext,
): ReturnType<typeof createRendererIssue>[] {
  const issues: ReturnType<typeof createRendererIssue>[] = [];
  const { block, resolvedBlockStyle } = context;

  if (block.type !== "image_placeholder") {
    issues.push(
      createRendererIssue({
        code: "unsupported_block_type",
        message: `image_placeholder renderer only supports image_placeholder, got "${block.type}"`,
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

  if (
    !IMAGE_PLACEHOLDER_SUPPORTED_VARIANT_IDS.includes(
      resolvedBlockStyle.variantId,
    )
  ) {
    issues.push(
      createRendererIssue({
        code: "unsupported_variant",
        message: `variant "${resolvedBlockStyle.variantId}" is not supported by image_placeholder renderer`,
        blockId: block.id,
        blockType: block.type,
        variantId: resolvedBlockStyle.variantId,
      }),
    );
  }

  if (resolveImagePlaceholderLayout(resolvedBlockStyle.variantId) == null) {
    issues.push(
      createRendererIssue({
        code: "unsupported_variant",
        message: `variant "${resolvedBlockStyle.variantId}" has no image_placeholder layout mapping`,
        blockId: block.id,
        blockType: block.type,
        variantId: resolvedBlockStyle.variantId,
      }),
    );
  }

  issues.push(
    ...normalizeImagePlaceholderContentForRenderer(
      block as ImagePlaceholderBlock,
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

export function renderImagePlaceholder(
  context: BlockRenderContext,
): RendererResult<ImagePlaceholderPreviewOutput | ImagePlaceholderCopyOutput> {
  const validationIssues = validateImagePlaceholderRenderContext(context);
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

  const normalized = normalizeImagePlaceholderContentForRenderer(
    context.block as ImagePlaceholderBlock,
    context.resolvedBlockStyle.variantId,
  );
  const rendered =
    context.mode === "preview"
      ? renderImagePlaceholderPreview(context, normalized.content)
      : renderImagePlaceholderCopyHtml(context, normalized.content);

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

export function createImagePlaceholderRenderer(
  mode: BlockRenderContext["mode"],
): BlockRenderer<ImagePlaceholderPreviewOutput | ImagePlaceholderCopyOutput> {
  return {
    blockType: "image_placeholder",
    mode,
    render: renderImagePlaceholder,
  };
}
