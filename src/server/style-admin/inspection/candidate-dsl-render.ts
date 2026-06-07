import type { DslRenderTarget, VariantDslV1 } from "@/core/dsl/runtime";
import { decodeVariantDsl } from "@/core/dsl/decoder";
import { renderTargetForMode } from "@/core/renderer/types";

import { parseDefinitionJsonToVariantDsl } from "@/lib/dsl-runtime";
import type { DbCandidateInspectionSource } from "./candidate-inspection-types";
import { buildDbCandidateInspectionArticle } from "./db-candidate-admin-render";
import type { CandidateInspectionFixture } from "./candidate-inspection-types";

function enrichVariantDslFromSource(
  source: DbCandidateInspectionSource,
  dsl: VariantDslV1,
): VariantDslV1 {
  return {
    ...dsl,
    componentProtocol:
      dsl.componentProtocol ??
      (source.componentProtocolJson as Record<string, unknown> | undefined),
    compatibility:
      dsl.compatibility ?? (source.compatibilityJson as Record<string, unknown> | undefined),
  };
}

export function renderCandidateViaDslDecoder(
  source: DbCandidateInspectionSource,
  fixture: CandidateInspectionFixture,
  target: DslRenderTarget,
) {
  const parsed = parseDefinitionJsonToVariantDsl(
    source.definitionJson,
    source.runtimeVariantId,
    source.blockType,
  );

  if (!parsed.ok) {
    return {
      ok: false as const,
      issues: parsed.issues.map((issue) => issue.message),
      usedAdminFallback: false,
    };
  }

  const article = buildDbCandidateInspectionArticle(source, fixture);
  const block = article.blocks[0]!;
  const variantDsl = enrichVariantDslFromSource(source, parsed.value);

  const decoded = decodeVariantDsl({
    article,
    block,
    variantDsl,
    target,
  });

  if (!decoded.ok) {
    return {
      ok: false as const,
      issues: [decoded.message, ...decoded.issues],
      usedAdminFallback: false,
    };
  }

  if (!decoded.output) {
    return {
      ok: false as const,
      issues: ["dsl_decode_empty_output"],
      usedAdminFallback: false,
    };
  }

  return {
    ok: true as const,
    output: decoded.output,
    html: decoded.html,
    issues: decoded.issues,
    usedAdminFallback: false,
    mode: target === "copy_wechat" || target === "qa_snapshot" ? "copy" : "preview",
    target: renderTargetForMode(target === "copy_wechat" ? "copy" : "preview"),
  };
}
