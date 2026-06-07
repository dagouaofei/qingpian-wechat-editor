import { createRendererIssue } from "@/core/renderer/issues";
import type { SerializedPreviewBlock } from "@/server/generation/generate-flow-types";

import type {
  CandidateInspectionFixture,
  DbCandidateInspectionSource,
} from "./candidate-inspection-types";
import { buildDbCandidateInspectionArticle } from "./db-candidate-admin-render";
import { renderCandidateViaDslDecoder } from "./candidate-dsl-render";

export function buildCandidatePreviewBlock(
  source: DbCandidateInspectionSource,
  fixture: CandidateInspectionFixture,
): SerializedPreviewBlock | null {
  const article = buildDbCandidateInspectionArticle(source, fixture);
  const block = article.blocks[0]!;
  const result = renderCandidateViaDslDecoder(source, fixture, "preview");

  if (!result.ok || !result.output) {
    return {
      blockId: block.id,
      blockType: source.blockType,
      variantId: source.runtimeVariantId,
      ok: false,
      issues: result.issues.map((message) =>
        createRendererIssue({
          code: "invalid_renderer_input",
          message,
          blockId: block.id,
          blockType: source.blockType,
          variantId: source.runtimeVariantId,
        }),
      ),
      warnings: [],
    };
  }

  const substitutionTrace = result.substitutionTrace;
  const output =
    result.output.kind === "dsl_tree_html_preview"
      ? {
          ...result.output,
          runtimeTrace: {
            runtimeSource: "database_dsl",
            selectedRuntimeVariantId: source.runtimeVariantId,
            renderedByVariantId: source.runtimeVariantId,
            fallbackUsed: substitutionTrace?.fallbackUsed ?? false,
            fallbackReason: substitutionTrace?.fallbackReason ?? null,
            slotSubstitutionPath: substitutionTrace?.slotSubstitutionPath ?? null,
            slotSubstitutionTargetPath: substitutionTrace?.slotSubstitutionTargetPath ?? null,
            actualTextLeafPath: substitutionTrace?.actualTextLeafPath ?? null,
            substitutedSlot: substitutionTrace?.substitutedSlot ?? null,
            decorativeSlotsPreserved: substitutionTrace?.decorativeSlotsPreserved ?? [],
          },
        }
      : result.output;

  return {
    blockId: block.id,
    blockType: source.blockType,
    variantId: source.runtimeVariantId,
    ok: true,
    output,
    issues: [],
    warnings: [],
  };
}
