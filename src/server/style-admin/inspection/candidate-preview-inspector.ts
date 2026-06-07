import type {
  CandidateInspectionFixture,
  CandidatePreviewInspection,
  DbCandidateInspectionSource,
} from "./candidate-inspection-types";
import { renderCandidateViaDslDecoder } from "./candidate-dsl-render";

export function inspectCandidatePreview(
  source: DbCandidateInspectionSource,
  fixture: CandidateInspectionFixture,
): CandidatePreviewInspection {
  const result = renderCandidateViaDslDecoder(source, fixture, "admin_inspection");

  return {
    ok: result.ok,
    status: result.ok ? "ok" : "error",
    blockType: source.blockType,
    variantId: source.runtimeVariantId,
    fixtureText: fixture.sampleText,
    outputKind: result.ok ? result.output.kind ?? null : null,
    issues: result.ok ? result.issues : result.issues,
    usedAdminFallback: false,
  };
}
