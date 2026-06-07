import type { BlockType } from "@/core/blocks";
import type { DslRenderTarget } from "@/core/dsl/runtime";
import type {
  DslDefinitionSourceTrace,
  DslRuntimeSourceTrace,
  DslRuntimeTrace,
  EncoderTrace,
} from "@/core/dsl/runtime/dsl-trace-types";
import { isVariantDslV1, validateVariantDsl, VARIANT_DSL_VERSION } from "@/core/dsl/runtime";
import { buildDecoderTrace, resolveDecoderPath } from "@/core/dsl/decoder/decoder-trace";
import { decodeVariantDsl } from "@/core/dsl/decoder";
import { listRequiredTreeSlots, resolveSlotsForDslDecode } from "@/core/dsl/decoder/resolve-dsl-slots";
import type { DslRuntimeSource } from "@/lib/dsl-runtime-context-types";

import { parseDefinitionJsonToVariantDsl } from "./parse-variant-dsl";
import { buildSourceExactTrace } from "./source-exact-trace";
import type { Article } from "@/core/article";
import type { Block } from "@/core/blocks";

export function mapPoolSourceToRuntimeSource(
  source: DslRuntimeSource | undefined,
  hasDefinition: boolean,
): DslRuntimeSourceTrace {
  if (!hasDefinition) return "missing_dsl";
  if (source === "database") return "database_dsl";
  if (source === "code_fallback") return "code_fallback";
  if (source === "db_unavailable") return "code_fallback";
  return "unsupported";
}

export function mapDefinitionSource(
  runtimeSource: DslRuntimeSourceTrace,
): DslDefinitionSourceTrace {
  if (runtimeSource === "database_dsl") return "db.definitionJson";
  if (runtimeSource === "code_fallback") return "code_fallback_encoded_registry";
  return "unknown";
}

export function readEncoderTraceFromDslMeta(meta: unknown): EncoderTrace | undefined {
  if (typeof meta !== "object" || meta === null) return undefined;
  const encoderTrace = (meta as Record<string, unknown>).encoderTrace;
  if (typeof encoderTrace !== "object" || encoderTrace === null) return undefined;
  return encoderTrace as EncoderTrace;
}

export function buildRuntimeTraceForVariant(input: {
  runtimeVariantId: string;
  blockType: BlockType;
  definitionJson: unknown;
  poolSource?: DslRuntimeSource;
  article?: Article;
  block?: Block;
  decodeTargets?: DslRenderTarget[];
}): DslRuntimeTrace {
  const decodeTargets = input.decodeTargets ?? ["preview", "copy_wechat"];
  const parsed = parseDefinitionJsonToVariantDsl(
    input.definitionJson,
    input.runtimeVariantId,
    input.blockType,
  );

  const runtimeSource = mapPoolSourceToRuntimeSource(
    input.poolSource,
    parsed.ok,
  );

  if (!parsed.ok) {
    return {
      runtimeVariantId: input.runtimeVariantId,
      blockType: input.blockType,
      runtimeSource,
      decoderPath: "none",
      definitionSource: mapDefinitionSource(runtimeSource),
      dslValid: false,
      decoder: buildDecoderTrace({
        target: "preview",
        decoderPath: "none",
        rendered: false,
        outputLength: 0,
        issues: parsed.issues.map((i) => `${i.code}: ${i.message}`),
      }),
    };
  }

  const dsl = parsed.value;
  const validation = validateVariantDsl(dsl);
  const decoderPath = resolveDecoderPath(Boolean(dsl.tree), Boolean(dsl.renderContract));
  const encoder = readEncoderTraceFromDslMeta(dsl.meta);

  let decoderTrace = buildDecoderTrace({
    target: decodeTargets[0] ?? "preview",
    decoderPath,
    rendered: false,
    outputLength: 0,
    issues: validation.valid ? [] : validation.issues.map((i) => i.message),
  });

  let decodedPreviewHtml: string | undefined;
  let decodedCopyHtml: string | undefined;

  if (input.article && input.block && validation.valid) {
    for (const target of decodeTargets) {
      const slots = resolveSlotsForDslDecode(dsl, input.block);
      const decoded = decodeVariantDsl({
        article: input.article,
        block: input.block,
        variantDsl: dsl,
        target,
      });

      if (target === "preview" && decoded.ok && decoded.html) {
        decodedPreviewHtml = decoded.html;
      }
      if (target === "copy_wechat" && decoded.ok && decoded.html) {
        decodedCopyHtml = decoded.html;
      }

      const decodedHtml = decoded.ok ? decoded.html ?? "" : "";
      const htmlLength = decodedHtml.length;
      const visibleText = decodedHtml.replace(/<[^>]+>/g, "").trim();
      const previewRendered =
        target === "preview" || target === "admin_inspection" || target === "qa_snapshot"
          ? decoded.ok && htmlLength > 0 && visibleText.length > 0
          : decoded.ok && htmlLength > 0;
      decoderTrace = buildDecoderTrace({
        target,
        decoderPath,
        rendered: previewRendered,
        outputLength: htmlLength,
        requiredSlots: listRequiredTreeSlots(dsl),
        slots,
        issues: decoded.ok ? decoded.issues : [decoded.message, ...decoded.issues],
      });
      if (!decoded.ok) break;
    }
  }

  const sourceExact = buildSourceExactTrace({
    runtimeVariantId: input.runtimeVariantId,
    definitionJson: input.definitionJson,
    decodedPreviewHtml,
    decodedCopyHtml,
    renderedHtml: decodedPreviewHtml,
    selectedRuntimeVariantId: input.runtimeVariantId,
    renderedByVariantId: input.runtimeVariantId,
    fallbackUsed: false,
  });

  return {
    runtimeVariantId: input.runtimeVariantId,
    blockType: input.blockType,
    runtimeSource,
    decoderPath,
    dslVersion: isVariantDslV1(dsl) ? VARIANT_DSL_VERSION : undefined,
    definitionSource: mapDefinitionSource(runtimeSource),
    dslValid: validation.valid,
    encoder,
    decoder: decoderTrace,
    sourceExact,
  };
}
