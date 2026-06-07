import type { BlockType } from "@prisma/client";

import type { FidelitySubstitutionTrace } from "@/core/dsl/decoder/fidelity-tree-substitution";
import { semanticBindingsResolveOnTree } from "@/core/dsl/decoder/fidelity-tree-substitution";
import { decodeVariantDsl } from "@/core/dsl/decoder";
import { encodeHtmlToVariantDsl } from "@/core/dsl/encoder";
import type { DecoderTrace } from "@/core/dsl/runtime/dsl-trace-types";
import type { DslRenderTarget, VariantDslV1 } from "@/core/dsl/runtime";
import type { RendererOutputPlaceholder } from "@/core/renderer/types";
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

function shouldRefreshInspectionTreeFromRawHtml(
  source: DbCandidateInspectionSource,
  dsl: VariantDslV1,
): boolean {
  const rawHtml = source.rawHtml?.trim();
  if (!rawHtml) {
    return false;
  }

  const headingLike = source.blockType === "heading" || source.blockType === "title";
  if (!headingLike) {
    return false;
  }

  return !semanticBindingsResolveOnTree(dsl);
}

function resolveInspectionVariantDsl(
  source: DbCandidateInspectionSource,
  parsed: VariantDslV1,
): VariantDslV1 {
  const enriched = enrichVariantDslFromSource(source, parsed);
  if (!shouldRefreshInspectionTreeFromRawHtml(source, enriched)) {
    return enriched;
  }

  const rawHtml = source.rawHtml?.trim();
  if (!rawHtml) {
    return enriched;
  }

  const reencoded = encodeHtmlToVariantDsl({
    html: rawHtml,
    runtimeVariantId: source.runtimeVariantId,
    blockType: source.blockType as BlockType,
    label: source.label,
    family: source.styleFamily,
    wechatCompatibilityMode: "off",
  });

  if (!reencoded.ok) {
    return enriched;
  }

  return {
    ...reencoded.value,
    componentProtocol: enriched.componentProtocol,
    compatibility: enriched.compatibility,
  };
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
      substitutionTrace: decoded.substitutionTrace,
    };
  }

  if (!decoded.output) {
    return {
      ok: false as const,
      issues: ["dsl_decode_empty_output"],
      usedAdminFallback: false,
      trace: decoded.trace,
      substitutionTrace: decoded.substitutionTrace,
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
