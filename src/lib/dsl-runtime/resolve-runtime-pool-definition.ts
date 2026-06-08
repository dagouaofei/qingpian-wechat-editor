import type { BlockType } from "@/core/blocks";

import type { DslRuntimeVariantSourceMeta } from "../dsl-runtime-context-types";
import { parseDefinitionJsonToVariantDsl } from "./parse-variant-dsl";
import { resolveFidelityVariantDslForDecode } from "./resolve-fidelity-variant-dsl";

export type ResolveRuntimePoolDefinitionInput = {
  definitionJson: unknown;
  runtimeVariantId: string;
  blockType: BlockType;
  label: string;
  styleFamily: string;
  primarySourceType?: string | null;
  sourceHtml?: string | null;
};

/**
 * Server-side runtime pool step — refresh stale html_paste DSL from sourceHtml
 * before the snapshot is sent to client preview (encoder uses node:crypto).
 */
export function resolveRuntimePoolDefinitionJson(
  input: ResolveRuntimePoolDefinitionInput,
): unknown {
  const parsed = parseDefinitionJsonToVariantDsl(
    input.definitionJson,
    input.runtimeVariantId,
    input.blockType,
  );

  if (!parsed.ok) {
    return input.definitionJson;
  }

  const refreshed = resolveFidelityVariantDslForDecode(parsed.value, {
    sourceHtml: input.sourceHtml,
    runtimeVariantId: input.runtimeVariantId,
    blockType: input.blockType,
    label: input.label,
    family: input.styleFamily,
    primarySourceType: input.primarySourceType,
  });

  return refreshed;
}

export function resolveRuntimePoolDefinitionFromMeta(
  definitionJson: unknown,
  runtimeVariantId: string,
  meta: DslRuntimeVariantSourceMeta,
): unknown {
  return resolveRuntimePoolDefinitionJson({
    definitionJson,
    runtimeVariantId,
    blockType: meta.blockType,
    label: meta.label,
    styleFamily: meta.styleFamily,
    primarySourceType: meta.primarySourceType,
    sourceHtml: meta.sourceHtml,
  });
}

/** Strip raw HTML before serializing runtime snapshot to the browser. */
export function stripSourceHtmlFromRuntimeMeta(
  metaByVariantId: Record<string, DslRuntimeVariantSourceMeta> | undefined,
): Record<string, DslRuntimeVariantSourceMeta> | undefined {
  if (!metaByVariantId) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(metaByVariantId).map(([variantId, meta]) => [
      variantId,
      {
        blockType: meta.blockType,
        styleFamily: meta.styleFamily,
        label: meta.label,
        primarySourceType: meta.primarySourceType,
      },
    ]),
  );
}
