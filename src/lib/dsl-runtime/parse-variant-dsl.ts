import type { BlockType } from "@/core/blocks";
import {
  encodeLegacyDefinitionToVariantDsl,
  type EncoderResult,
} from "@/core/dsl/encoder";
import { isVariantDslV1, validateVariantDsl, type VariantDslV1 } from "@/core/dsl/runtime";

export function parseDefinitionJsonToVariantDsl(
  definitionJson: unknown,
  runtimeVariantId: string,
  blockType: BlockType,
): EncoderResult<VariantDslV1> {
  if (isVariantDslV1(definitionJson)) {
    const validation = validateVariantDsl(definitionJson);
    if (!validation.valid) {
      return {
        ok: false,
        issues: validation.issues.map((issue) => ({
          code: issue.code,
          message: issue.message,
        })),
      };
    }
    return { ok: true, value: definitionJson, issues: [] };
  }

  if (typeof definitionJson === "object" && definitionJson !== null && !Array.isArray(definitionJson)) {
    return encodeLegacyDefinitionToVariantDsl(
      definitionJson as Record<string, unknown>,
      runtimeVariantId,
      blockType,
    );
  }

  return {
    ok: false,
    issues: [{ code: "invalid_definition", message: "definitionJson must be object or Variant DSL" }],
  };
}
