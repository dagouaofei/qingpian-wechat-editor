import type { BlockType } from "@/core/blocks";
import {
  dslRuntimeTraceFixtureArticle,
  pickTraceFixtureBlock,
} from "@/lib/dsl-runtime/trace-fixture-article";
import type { DslRuntimeTrace } from "@/core/dsl/runtime/dsl-trace-types";
import { decodeVariantDsl } from "@/core/dsl/decoder";
import { isVariantDslV1, VARIANT_DSL_VERSION } from "@/core/dsl/runtime";
import { buildRuntimeTraceForVariant } from "@/lib/dsl-runtime/runtime-trace";
import { parseDefinitionJsonToVariantDsl } from "@/lib/dsl-runtime";

import type { JsonValue } from "../types";
import type { HarvestIssue, HarvestLossReportEntry } from "./harvest-compatibility";

export type HarvestDecodeSummary = {
  target: "preview" | "copy_wechat";
  ok: boolean;
  outputLength: number;
  issues: string[];
};

export type HarvestPreviewTrace = {
  extractedSlots: Record<string, string>;
  styleTokens: Record<string, string>;
  layoutIntent?: string;
  decorators?: string[];
  dslVersion?: string;
  variantDslPreview: string;
  decoderPreview: HarvestDecodeSummary;
  decoderCopy: HarvestDecodeSummary;
  runtimeTrace: DslRuntimeTrace;
};

function buildHarvestFixtureArticle(title: string, blockType: BlockType) {
  const article = structuredClone(dslRuntimeTraceFixtureArticle);
  const block = pickTraceFixtureBlock(blockType);
  if (block.type === "heading") {
    (block.content as { text: string }).text = title;
  } else if (block.type === "info_card") {
    (block.content as { title: string }).title = title;
  } else if (block.type === "paragraph") {
    block.content = { text: [{ text: title }] };
  }
  article.blocks = [block];
  return article;
}

export function buildHarvestPreviewTrace(
  definitionJson: JsonValue,
  runtimeVariantId: string,
  blockType: BlockType,
  issues: HarvestIssue[],
  lossReport: HarvestLossReportEntry[],
): HarvestPreviewTrace | null {
  const parsed = parseDefinitionJsonToVariantDsl(definitionJson, runtimeVariantId, blockType);
  if (!parsed.ok) return null;

  const meta = parsed.value.meta ?? {};
  const extractedSlots =
    (typeof meta.extractedSlots === "object" && meta.extractedSlots !== null
      ? meta.extractedSlots
      : { title: "" }) as Record<string, string>;

  const titleText = extractedSlots.title ?? Object.values(extractedSlots)[0] ?? "Preview";
  const article = buildHarvestFixtureArticle(titleText, blockType);
  const block = article.blocks[0]!;

  const decodeFor = (target: "preview" | "copy_wechat"): HarvestDecodeSummary => {
    const decoded = decodeVariantDsl({ article, block, variantDsl: parsed.value, target });
    return {
      target,
      ok: decoded.ok,
      outputLength: decoded.ok && decoded.html ? decoded.html.length : 0,
      issues: decoded.ok ? decoded.issues : [decoded.message, ...decoded.issues],
    };
  };

  const runtimeTrace = buildRuntimeTraceForVariant({
    runtimeVariantId,
    blockType,
    definitionJson,
    poolSource: undefined,
    article,
    block,
    decodeTargets: ["preview", "copy_wechat"],
  });

  if (issues.length > 0) {
    runtimeTrace.encoder = runtimeTrace.encoder ?? {
      inputKind: "html",
      extractedSlots,
      styleTokens: (parsed.value.tokens as Record<string, string>) ?? {},
      lossReport: lossReport.map((entry) => ({ code: entry.code, message: entry.message })),
      issues: issues.map((issue) => ({
        code: issue.code,
        message: issue.message,
        severity: issue.severity,
      })),
    };
  }

  return {
    extractedSlots,
    styleTokens: (parsed.value.tokens as Record<string, string>) ?? {},
    layoutIntent: typeof meta.layoutIntent === "string" ? meta.layoutIntent : undefined,
    decorators: Array.isArray(meta.decorators) ? (meta.decorators as string[]) : undefined,
    dslVersion: isVariantDslV1(parsed.value) ? VARIANT_DSL_VERSION : undefined,
    variantDslPreview: JSON.stringify(parsed.value, null, 2),
    decoderPreview: decodeFor("preview"),
    decoderCopy: decodeFor("copy_wechat"),
    runtimeTrace,
  };
}
