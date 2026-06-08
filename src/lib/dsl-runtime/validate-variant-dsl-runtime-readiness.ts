import type { BlockType } from "@/core/blocks";
import type { Article } from "@/core/article";
import type { Block } from "@/core/blocks";
import type {
  CompatibilityReadinessStatus,
  VariantDslRuntimeReadiness,
} from "@/core/dsl/runtime/dsl-trace-types";
import { decodeVariantDsl } from "@/core/dsl/decoder";
import {
  getWechatCompatibilityMode,
  validateHtmlStructureCompatibility,
} from "@/core/wechat-compatibility";
import type { DslRuntimeSource } from "@/lib/dsl-runtime-context-types";

import { parseDefinitionJsonToVariantDsl } from "./parse-variant-dsl";
import { buildRuntimeTraceForVariant } from "./runtime-trace";

export function validateVariantDslRuntimeReadiness(input: {
  runtimeVariantId: string;
  blockType: BlockType;
  definitionJson: unknown;
  poolSource?: DslRuntimeSource;
  article: Article;
  block: Block;
}): VariantDslRuntimeReadiness {
  const trace = buildRuntimeTraceForVariant({
    runtimeVariantId: input.runtimeVariantId,
    blockType: input.blockType,
    definitionJson: input.definitionJson,
    poolSource: input.poolSource,
    article: input.article,
    block: input.block,
    decodeTargets: ["preview", "copy_wechat"],
  });

  const issues = [...trace.decoder?.issues ?? []];
  if (!trace.dslValid) {
    issues.push({
      code: "invalid_variant_dsl",
      message: "Variant DSL failed schema validation",
      severity: "blocking",
    });
  }
  if (trace.runtimeSource !== "database_dsl" && input.poolSource === "database") {
    issues.push({
      code: "runtime_source_mismatch",
      message: `Expected database_dsl but got ${trace.runtimeSource}`,
      severity: "blocking",
    });
  }

  const parsed = parseDefinitionJsonToVariantDsl(
    input.definitionJson,
    input.runtimeVariantId,
    input.blockType,
  );

  let previewReady = false;
  let copyReady = false;
  let compatibilityReady = true;
  let compatibilityStatus: CompatibilityReadinessStatus = "pass";
  const globalCompatibilityMode = getWechatCompatibilityMode();

  if (parsed.ok) {
    const preview = decodeVariantDsl({
      article: input.article,
      block: input.block,
      variantDsl: parsed.value,
      target: "preview",
    });
    const previewVisibleText = (preview.ok ? preview.html ?? "" : "")
      .replace(/<[^>]+>/g, "")
      .trim();
    previewReady =
      preview.ok &&
      Boolean(preview.html?.trim()) &&
      previewVisibleText.length > 0 &&
      !preview.issues.some((issue) => issue.includes("DSL_RENDER_EMPTY"));

    const copy = decodeVariantDsl({
      article: input.article,
      block: input.block,
      variantDsl: parsed.value,
      target: "copy_wechat",
    });
    if (copy.ok) {
      copyReady = Boolean(copy.html?.trim());
      if (copy.html) {
        if (globalCompatibilityMode === "off") {
          compatibilityStatus = "skipped";
          compatibilityReady = true;
          issues.push({
            code: "compatibility_skipped",
            message:
              "Compatibility Spec skipped (global mode=off); Paste QA required before production use.",
            severity: "warning",
          });
        } else {
          const compat = validateHtmlStructureCompatibility(copy.html);
          if (!compat.valid) {
            if (globalCompatibilityMode === "report") {
              compatibilityStatus = "not_enforced";
              compatibilityReady = true;
            } else {
              compatibilityStatus = "failed";
              compatibilityReady = false;
            }
            for (const issue of compat.issues.filter((i) => i.level === "error")) {
              issues.push({
                code: issue.code,
                message: issue.message,
                severity: globalCompatibilityMode === "report" ? "warning" : "risk",
              });
            }
          } else {
            compatibilityStatus = "pass";
            compatibilityReady = true;
          }
        }
      }
    }
  }

  const requiresDatabaseDsl = input.poolSource === "database";
  const ok =
    trace.dslValid &&
    previewReady &&
    copyReady &&
    (!requiresDatabaseDsl || trace.runtimeSource === "database_dsl") &&
    issues.every((issue) => issue.severity !== "blocking");

  return {
    ok,
    previewReady,
    copyReady,
    compatibilityReady,
    compatibilityStatus,
    issues,
    trace,
  };
}
