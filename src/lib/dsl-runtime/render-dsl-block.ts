import type { Block } from "@/core/blocks";
import type { Article } from "@/core/article";
import type { DslRenderTarget } from "@/core/dsl/runtime";
import { decodeVariantDsl } from "@/core/dsl/decoder";
import { createRendererIssue } from "@/core/renderer/issues";
import type {
  RendererOutputPlaceholder,
  RendererResult,
  RenderMode,
  RenderTarget,
} from "@/core/renderer/types";

import { parseDefinitionJsonToVariantDsl } from "./parse-variant-dsl";
import { resolveFidelityVariantDslForDecode } from "./resolve-fidelity-variant-dsl";

export type RenderDslBlockInput = {
  article: Article;
  block: Block;
  definitionJson: unknown;
  runtimeVariantId: string;
  target: DslRenderTarget;
  mode: RenderMode;
  renderTarget: RenderTarget;
  sourceHtml?: string | null;
};

export function renderDslBlock(input: RenderDslBlockInput): RendererResult<RendererOutputPlaceholder> {
  const parsed = parseDefinitionJsonToVariantDsl(
    input.definitionJson,
    input.runtimeVariantId,
    input.block.type,
  );

  if (!parsed.ok) {
    return {
      ok: false,
      blockId: input.block.id,
      blockType: input.block.type,
      variantId: input.runtimeVariantId,
      mode: input.mode,
      target: input.renderTarget,
      issues: parsed.issues.map((issue) =>
        createRendererIssue({
          code: "invalid_renderer_input",
          message: `${issue.code}: ${issue.message}`,
          blockId: input.block.id,
          blockType: input.block.type,
          variantId: input.runtimeVariantId,
        }),
      ),
      warnings: [],
    };
  }

  const variantDsl = resolveFidelityVariantDslForDecode(parsed.value, {
    sourceHtml: input.sourceHtml,
    runtimeVariantId: input.runtimeVariantId,
    blockType: input.block.type,
    label: parsed.value.label,
    family: parsed.value.family,
  });

  const decoded = decodeVariantDsl({
    article: input.article,
    block: input.block,
    variantDsl,
    target: input.target,
  });

  if (!decoded.ok) {
    return {
      ok: false,
      blockId: input.block.id,
      blockType: input.block.type,
      variantId: input.runtimeVariantId,
      mode: input.mode,
      target: input.renderTarget,
      issues: [
        createRendererIssue({
          code: "invalid_renderer_input",
          message: `${decoded.code}: ${decoded.message}`,
          blockId: input.block.id,
          blockType: input.block.type,
          variantId: input.runtimeVariantId,
        }),
      ],
      warnings: [],
    };
  }

  if (!decoded.output) {
    return {
      ok: false,
      blockId: input.block.id,
      blockType: input.block.type,
      variantId: input.runtimeVariantId,
      mode: input.mode,
      target: input.renderTarget,
      issues: [
        createRendererIssue({
          code: "invalid_renderer_input",
          message: "dsl_decode_empty_output",
          blockId: input.block.id,
          blockType: input.block.type,
          variantId: input.runtimeVariantId,
        }),
      ],
      warnings: [],
    };
  }

  const substitutionTrace =
    decoded.ok && "substitutionTrace" in decoded ? decoded.substitutionTrace : undefined;

  const output =
    decoded.output?.kind === "dsl_tree_html_preview"
      ? {
          ...decoded.output,
          runtimeTrace: {
            runtimeSource: "database_dsl",
            selectedRuntimeVariantId: input.runtimeVariantId,
            renderedByVariantId: input.runtimeVariantId,
            fallbackUsed: substitutionTrace?.fallbackUsed ?? false,
            fallbackReason: substitutionTrace?.fallbackReason ?? null,
            slotSubstitutionPath: substitutionTrace?.slotSubstitutionPath ?? null,
            slotSubstitutionTargetPath: substitutionTrace?.slotSubstitutionTargetPath ?? null,
            actualTextLeafPath: substitutionTrace?.actualTextLeafPath ?? null,
            substitutedSlot: substitutionTrace?.substitutedSlot ?? null,
            decorativeSlotsPreserved: substitutionTrace?.decorativeSlotsPreserved ?? [],
          },
        }
      : decoded.output;

  return {
    ok: true,
    blockId: input.block.id,
    blockType: input.block.type,
    variantId: input.runtimeVariantId,
    mode: input.mode,
    target: input.renderTarget,
    output,
    issues: [],
    warnings: decoded.issues.map((message) =>
      createRendererIssue({
        code: "copy_safety_warning",
        message,
        blockId: input.block.id,
        blockType: input.block.type,
        variantId: input.runtimeVariantId,
        severity: "warning",
      }),
    ),
  };
}
