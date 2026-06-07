import type {
  CandidateCopyInspection,
  CandidateInspectionFixture,
  DbCandidateInspectionSource,
} from "./candidate-inspection-types";
import { renderCandidateViaDslDecoder } from "./candidate-dsl-render";

function summarizeHtml(html: string, max = 240): string {
  const flat = html.replace(/\s+/g, " ").trim();
  return flat.length <= max ? flat : `${flat.slice(0, max)}…`;
}

function extractPlainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function inspectCandidateCopy(
  source: DbCandidateInspectionSource,
  fixture: CandidateInspectionFixture,
): CandidateCopyInspection {
  const result = renderCandidateViaDslDecoder(source, fixture, "copy_wechat");
  const html = result.ok ? result.html ?? null : null;

  return {
    ok: result.ok && html != null,
    status: result.ok && html != null ? "ok" : "error",
    blockType: source.blockType,
    variantId: source.runtimeVariantId,
    html,
    htmlSnippet: html != null ? summarizeHtml(html) : null,
    textPlain: html != null ? extractPlainText(html) : null,
    copySafety: source.copySafety,
    usesInlineStyle: html != null && /style\s*=/.test(html),
    issues: result.ok ? result.issues : result.issues,
    usedAdminFallback: false,
  };
}
