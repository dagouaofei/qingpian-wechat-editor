import { validateHtmlStructureCompatibility } from "@/core/wechat-compatibility";

import { validateVariantDsl } from "../runtime/dsl-validation";
import type { DecodeVariantDslInput, DecodeVariantDslResult } from "./dsl-decoder-types";
import { decodeRenderContract } from "./decode-contract";
import { decodeTreeToOutput } from "./decode-tree";

export function decodeVariantDsl(input: DecodeVariantDslInput): DecodeVariantDslResult {
  const validation = validateVariantDsl(input.variantDsl);
  if (!validation.valid) {
    return {
      ok: false,
      code: "invalid_variant_dsl",
      message: validation.issues[0]?.message ?? "Invalid Variant DSL",
      issues: validation.issues.map((issue) => issue.message),
    };
  }

  if (input.variantDsl.blockType !== input.block.type) {
    return {
      ok: false,
      code: "block_type_mismatch",
      message: `Variant DSL blockType ${input.variantDsl.blockType} does not match block ${input.block.type}`,
      issues: [],
    };
  }

  const decoded = input.variantDsl.tree
    ? decodeTreeToOutput(input.variantDsl, input.block, input.target)
    : decodeRenderContract(input.variantDsl, input.block, input.article, input.target);

  if (!decoded.ok || !decoded.output) {
    return {
      ok: false,
      code: "decode_failed",
      message: decoded.issues[0] ?? "DSL decode failed",
      issues: decoded.issues,
    };
  }

  if (decoded.html) {
    const compat = validateHtmlStructureCompatibility(decoded.html);
    if (!compat.valid) {
      return {
        ok: false,
        code: "wechat_compatibility_failed",
        message: compat.issues.find((issue) => issue.level === "error")?.message ?? "WeChat compatibility failed",
        issues: compat.issues.map((issue) => issue.message),
      };
    }
  }

  return {
    ok: true,
    output: decoded.output,
    html: decoded.html,
    issues: decoded.issues,
  };
}

export function isVariantDslRenderable(
  input: Omit<DecodeVariantDslInput, "target">,
  targets: DecodeVariantDslInput["target"][] = ["preview", "copy_wechat"],
): { renderable: boolean; issues: string[] } {
  const issues: string[] = [];
  for (const target of targets) {
    const result = decodeVariantDsl({ ...input, target });
    if (!result.ok) {
      issues.push(`${target}: ${result.message}`);
    }
  }
  return { renderable: issues.length === 0, issues };
}
