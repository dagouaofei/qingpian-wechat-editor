import { validateVariantDsl } from "../runtime/dsl-validation";
import type { DecodeVariantDslInput, DecodeVariantDslResult } from "./dsl-decoder-types";
import { buildDecoderTrace, resolveDecoderPath } from "./decoder-trace";
import { decodeRenderContract } from "./decode-contract";
import { decodeTreeToOutput } from "./decode-tree";
import { listRequiredTreeSlots, resolveSlotsForDslDecode } from "./resolve-dsl-slots";

function buildFailureTrace(
  input: DecodeVariantDslInput,
  decoderPath: ReturnType<typeof resolveDecoderPath>,
  issues: string[],
): DecodeVariantDslResult {
  const slots = resolveSlotsForDslDecode(input.variantDsl, input.block);
  return {
    ok: false,
    code: "decode_failed",
    message: issues[0] ?? "DSL decode failed",
    issues,
    trace: buildDecoderTrace({
      target: input.target,
      decoderPath,
      rendered: false,
      outputLength: 0,
      requiredSlots: listRequiredTreeSlots(input.variantDsl),
      slots,
      issues,
    }),
  };
}

export function decodeVariantDsl(input: DecodeVariantDslInput): DecodeVariantDslResult {
  const decoderPath = resolveDecoderPath(
    Boolean(input.variantDsl.tree),
    Boolean(input.variantDsl.renderContract),
  );
  const slots = resolveSlotsForDslDecode(input.variantDsl, input.block);

  const validation = validateVariantDsl(input.variantDsl);
  if (!validation.valid) {
    return {
      ok: false,
      code: "invalid_variant_dsl",
      message: validation.issues[0]?.message ?? "Invalid Variant DSL",
      issues: validation.issues.map((issue) => issue.message),
      trace: buildDecoderTrace({
        target: input.target,
        decoderPath,
        rendered: false,
        outputLength: 0,
        requiredSlots: listRequiredTreeSlots(input.variantDsl),
        slots,
        issues: validation.issues.map((issue) => issue.message),
      }),
    };
  }

  if (input.variantDsl.blockType !== input.block.type) {
    return {
      ok: false,
      code: "block_type_mismatch",
      message: `Variant DSL blockType ${input.variantDsl.blockType} does not match block ${input.block.type}`,
      issues: [],
      trace: buildDecoderTrace({
        target: input.target,
        decoderPath,
        rendered: false,
        outputLength: 0,
        issues: ["block_type_mismatch"],
      }),
    };
  }

  const decoded = input.variantDsl.tree
    ? decodeTreeToOutput(
        input.variantDsl,
        input.block,
        input.target,
        input.article,
        input.themePalette,
      )
    : decodeRenderContract(input.variantDsl, input.block, input.article, input.target);

  if (!decoded.ok || !decoded.output) {
    return buildFailureTrace(input, decoderPath, decoded.issues);
  }

  const htmlLength = decoded.html?.length ?? 0;
  const visibleText = (decoded.html ?? "").replace(/<[^>]+>/g, "").trim();
  const isTreePreviewTarget =
    Boolean(input.variantDsl.tree) &&
    (input.target === "preview" ||
      input.target === "admin_inspection" ||
      input.target === "qa_snapshot");
  const rendered = isTreePreviewTarget
    ? Boolean(visibleText && htmlLength > 0)
    : Boolean(decoded.output) && (htmlLength > 0 || Boolean(decoded.output));

  if (isTreePreviewTarget && !rendered) {
    return buildFailureTrace(input, decoderPath, ["DSL_RENDER_EMPTY", ...decoded.issues]);
  }

  return {
    ok: true,
    output: decoded.output,
    html: decoded.html,
    issues: decoded.issues,
    substitutionTrace: input.variantDsl.tree
      ? (decoded as ReturnType<typeof decodeTreeToOutput>).substitutionTrace
      : undefined,
    trace: buildDecoderTrace({
      target: input.target,
      decoderPath,
      rendered,
      outputLength: htmlLength || (decoded.output ? 1 : 0),
      requiredSlots: listRequiredTreeSlots(input.variantDsl),
      slots,
      issues: decoded.issues,
    }),
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
