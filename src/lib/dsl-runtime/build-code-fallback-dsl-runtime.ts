import { encodeRegistryVariantToDsl } from "@/core/dsl/encoder";
import { createFirstWaveRequiredVariantRegistry } from "@/core/styles";
import type { VariantDefinition } from "@/core/styles/types";

import type { DslRuntimeSnapshot } from "../dsl-runtime-context-types";

function encodeVariantDefinition(variant: VariantDefinition): unknown | undefined {
  const encoded = encodeRegistryVariantToDsl(variant);
  return encoded.ok ? encoded.value : undefined;
}

/**
 * DB unavailable fallback — encodes code registry variants into DSL for Decoder Core.
 * Registry is seed/migration source only; output still flows through DSL Decoder.
 */
export function buildCodeFallbackDslRuntime(notice?: string): DslRuntimeSnapshot {
  const registry = createFirstWaveRequiredVariantRegistry();
  const definitionJsonByVariantId: Record<string, unknown> = {};
  const variantIds: string[] = [];

  for (const variant of registry.variants) {
    const dsl = encodeVariantDefinition(variant);
    if (dsl) {
      definitionJsonByVariantId[variant.id] = dsl;
      variantIds.push(variant.id);
    }
  }

  return {
    source: "code_fallback",
    cache: { hit: false, ttlSeconds: 0, generatedAt: new Date().toISOString() },
    definitionJsonByVariantId,
    variantIds,
    issues: [],
    notice:
      notice ??
      "Using code-backed DSL runtime fallback. DB-backed variant definitions are not active.",
  };
}
