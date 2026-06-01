import type { ListBlock } from "@/core/blocks";
import { LIST_FIRST_WAVE_VARIANTS } from "@/core/styles";

import { renderListCopyHtml } from "@/core/copy/list-copy";
import { createRendererIssue, partitionRendererIssues } from "./issues";
import {
  normalizeListItemsForRenderer,
  resolveListLayout,
} from "./list-layout";
import { renderListPreview } from "./list-preview";
import type {
  BlockRenderContext,
  BlockRenderer,
  ListCopyOutput,
  ListPreviewOutput,
  RendererResult,
} from "./types";

export const LIST_SUPPORTED_VARIANT_IDS = LIST_FIRST_WAVE_VARIANTS.map(
  (variant) => variant.id,
);

export function validateListRenderContext(
  context: BlockRenderContext,
): ReturnType<typeof createRendererIssue>[] {
  const issues: ReturnType<typeof createRendererIssue>[] = [];
  const { block, resolvedBlockStyle } = context;

  if (block.type !== "list") {
    issues.push(
      createRendererIssue({
        code: "unsupported_block_type",
        message: `list renderer only supports list, got "${block.type}"`,
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

  if (!LIST_SUPPORTED_VARIANT_IDS.includes(resolvedBlockStyle.variantId)) {
    issues.push(
      createRendererIssue({
        code: "unsupported_variant",
        message: `variant "${resolvedBlockStyle.variantId}" is not supported by list renderer`,
        blockId: block.id,
        blockType: block.type,
        variantId: resolvedBlockStyle.variantId,
      }),
    );
  }

  if (resolveListLayout(resolvedBlockStyle.variantId) == null) {
    issues.push(
      createRendererIssue({
        code: "unsupported_variant",
        message: `variant "${resolvedBlockStyle.variantId}" has no list layout mapping`,
        blockId: block.id,
        blockType: block.type,
        variantId: resolvedBlockStyle.variantId,
      }),
    );
  }

  const normalized = normalizeListItemsForRenderer(
    block as ListBlock,
    resolvedBlockStyle.variantId,
  );
  issues.push(...normalized.issues);

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

export function renderList(
  context: BlockRenderContext,
): RendererResult<ListPreviewOutput | ListCopyOutput> {
  const validationIssues = validateListRenderContext(context);
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

  const normalized = normalizeListItemsForRenderer(
    context.block as ListBlock,
    context.resolvedBlockStyle.variantId,
  );
  const rendered =
    context.mode === "preview"
      ? renderListPreview(context, normalized.items)
      : renderListCopyHtml(context, normalized.items);

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

export function createListRenderer(
  mode: BlockRenderContext["mode"],
): BlockRenderer<ListPreviewOutput | ListCopyOutput> {
  return {
    blockType: "list",
    mode,
    render: renderList,
  };
}
