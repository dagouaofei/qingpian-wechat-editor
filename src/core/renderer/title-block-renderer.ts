import type { HeadingBlock, TitleBlock } from "@/core/blocks";
import {
  TITLE_BLOCK_COMPONENT_ID,
  TITLE_BLOCK_FIRST_WAVE_VARIANT_IDS,
} from "@/core/styles";

import { HARVEST_CANDIDATE_VARIANT_IDS } from "@/core/copy/harvest-candidate-copy";
import { HTML_PASTE_CANDIDATE_VARIANT_IDS } from "@/core/copy/html-paste-candidate-copy";
import { renderTitleBlockCopyHtml } from "@/core/copy/title-block-copy";
import { createRendererIssue, partitionRendererIssues } from "./issues";
import { renderTitleBlockPreview } from "./title-block-preview";
import { resolveTitleBlockSlotContents } from "./text-style";
import type {
  BlockRenderContext,
  BlockRenderer,
  RendererResult,
  TitleBlockCopyOutput,
  TitleBlockPreviewOutput,
} from "./types";

export const TITLE_BLOCK_SUPPORTED_VARIANT_IDS = [
  ...TITLE_BLOCK_FIRST_WAVE_VARIANT_IDS,
  ...HARVEST_CANDIDATE_VARIANT_IDS.filter((id) => id.startsWith("heading_")),
  ...HTML_PASTE_CANDIDATE_VARIANT_IDS,
] as string[];

const FORBIDDEN_COPY_LAYOUT_MODES = new Set(["overlay", "offset_background"]);

export function validateTitleBlockRenderContext(
  context: BlockRenderContext,
): ReturnType<typeof createRendererIssue>[] {
  const issues: ReturnType<typeof createRendererIssue>[] = [];
  const { block, resolvedBlockStyle } = context;

  if (block.type !== "title" && block.type !== "heading") {
    issues.push(
      createRendererIssue({
        code: "unsupported_block_type",
        message: `titleBlock renderer only supports title / heading, got "${block.type}"`,
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
    !TITLE_BLOCK_SUPPORTED_VARIANT_IDS.includes(resolvedBlockStyle.variantId)
  ) {
    issues.push(
      createRendererIssue({
        code: "unsupported_variant",
        message: `variant "${resolvedBlockStyle.variantId}" is not supported by titleBlock renderer`,
        blockId: block.id,
        blockType: block.type,
        variantId: resolvedBlockStyle.variantId,
      }),
    );
  }

  if (!resolvedBlockStyle.componentProtocol.present) {
    issues.push(
      createRendererIssue({
        code: "missing_component_protocol",
        message: "titleBlock renderer requires componentProtocol on variant",
        blockId: block.id,
        blockType: block.type,
        variantId: resolvedBlockStyle.variantId,
      }),
    );
  } else if (
    resolvedBlockStyle.componentProtocol.componentId !== TITLE_BLOCK_COMPONENT_ID
  ) {
    issues.push(
      createRendererIssue({
        code: "invalid_renderer_input",
        message: `expected componentId "${TITLE_BLOCK_COMPONENT_ID}"`,
        blockId: block.id,
        blockType: block.type,
        variantId: resolvedBlockStyle.variantId,
        details: {
          componentId: resolvedBlockStyle.componentProtocol.componentId ?? "",
        },
      }),
    );
  }

  const layoutMode = resolvedBlockStyle.componentProtocol.layoutMode;
  if (
    context.mode === "copy" &&
    layoutMode != null &&
    FORBIDDEN_COPY_LAYOUT_MODES.has(layoutMode)
  ) {
    issues.push(
      createRendererIssue({
        code: "unsupported_variant",
        message: `layoutMode "${layoutMode}" is forbidden in copy path`,
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
        message: "variant uses balanced copySafety; verify WeChat paste fidelity manually",
        severity: "warning",
        blockId: context.block.id,
        blockType: context.block.type,
        variantId: context.resolvedBlockStyle.variantId,
      }),
    ];
  }

  return [];
}

function collectResolvedSlotWarnings(
  context: BlockRenderContext,
): ReturnType<typeof createRendererIssue>[] {
  const warnings: ReturnType<typeof createRendererIssue>[] = [];
  const slots = resolveTitleBlockSlotContents(
    context.block as TitleBlock | HeadingBlock,
    context.resolvedBlockStyle,
    context.slotStates,
  );

  for (const slot of slots) {
    if (slot.state === "disabled") {
      warnings.push(
        createRendererIssue({
          code: "optional_slot_disabled",
          message: `slot "${slot.slotId}" is disabled (${slot.fallbackReason ?? "unavailable"})`,
          severity: "info",
          blockId: context.block.id,
          blockType: context.block.type,
          variantId: context.resolvedBlockStyle.variantId,
          slotId: slot.slotId,
        }),
      );
    }

    if (slot.state === "fallback") {
      warnings.push(
        createRendererIssue({
          code: "optional_slot_disabled",
          message: `slot "${slot.slotId}" uses fallback (${slot.fallbackReason ?? "fallback"})`,
          severity: "info",
          blockId: context.block.id,
          blockType: context.block.type,
          variantId: context.resolvedBlockStyle.variantId,
          slotId: slot.slotId,
          details: { content: slot.content ?? "" },
        }),
      );
    }
  }

  return warnings;
}

export function renderTitleBlock(
  context: BlockRenderContext,
): RendererResult<TitleBlockPreviewOutput | TitleBlockCopyOutput> {
  const validationIssues = validateTitleBlockRenderContext(context);
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
    ...collectResolvedSlotWarnings(context),
  ];

  const output =
    context.mode === "preview"
      ? renderTitleBlockPreview(context)
      : renderTitleBlockCopyHtml(context);

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

export function createTitleBlockRenderer(
  blockType: "title" | "heading",
  mode: BlockRenderContext["mode"],
): BlockRenderer<TitleBlockPreviewOutput | TitleBlockCopyOutput> {
  return {
    blockType,
    mode,
    render: renderTitleBlock,
  };
}
