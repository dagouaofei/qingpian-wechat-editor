import type { FidelitySubstitutionTrace } from "@/core/dsl/decoder/fidelity-tree-substitution";
import { decodeVariantDsl } from "@/core/dsl/decoder";
import type { DecoderTrace } from "@/core/dsl/runtime/dsl-trace-types";
import type { DslRenderTarget, VariantDslV1 } from "@/core/dsl/runtime";
import type { RendererOutputPlaceholder } from "@/core/renderer/types";
import { renderTargetForMode } from "@/core/renderer/types";

import { parseDefinitionJsonToVariantDsl } from "@/lib/dsl-runtime";
import {
  resolveFidelityVariantDslForDecode,
} from "@/lib/dsl-runtime/resolve-fidelity-variant-dsl";
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

function resolveInspectionVariantDsl(
  source: DbCandidateInspectionSource,
  parsed: VariantDslV1,
): VariantDslV1 {
  const enriched = enrichVariantDslFromSource(source, parsed);

  return resolveFidelityVariantDslForDecode(enriched, {
    sourceHtml: source.rawHtml,
    runtimeVariantId: source.runtimeVariantId,
    blockType: source.blockType,
    label: source.label,
    family: source.styleFamily,
    primarySourceType: source.primarySourceType,
  });
}

export type CandidateDslDecodeResult =
  | {
      ok: true;
      output: RendererOutputPlaceholder;
      html?: string;
      issues: string[];
      usedAdminFallback: false;
      mode: "preview" | "copy";
      target: ReturnType<typeof renderTargetForMode>;
      trace?: DecoderTrace;
      substitutionTrace?: FidelitySubstitutionTrace;
    }
  | {
      ok: false;
      issues: string[];
      usedAdminFallback: false;
      trace?: DecoderTrace;
      substitutionTrace?: FidelitySubstitutionTrace;
    };

export function renderCandidateViaDslDecoder(
  source: DbCandidateInspectionSource,
  fixture: CandidateInspectionFixture,
  target: DslRenderTarget,
): CandidateDslDecodeResult {
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
  const variantDsl = resolveInspectionVariantDsl(source, parsed.value);

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
      trace: decoded.trace,
    };
  }

  if (!decoded.output) {
    return {
      ok: false as const,
      issues: ["dsl_decode_empty_output"],
      usedAdminFallback: false,
      trace: decoded.trace,
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
    trace: decoded.trace,
    substitutionTrace: decoded.substitutionTrace,
  };
}
