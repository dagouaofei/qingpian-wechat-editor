import type { BlockType } from "@prisma/client";

import {
  requiresFidelityTreeRefresh,
} from "@/core/dsl/decoder/fidelity-tree-substitution";
import { encodeHtmlToVariantDsl } from "@/core/dsl/encoder";
import type { VariantDslV1 } from "@/core/dsl/runtime";

export type ResolveFidelityVariantDslInput = {
  sourceHtml?: string | null;
  runtimeVariantId: string;
  blockType: BlockType;
  label?: string;
  family?: string;
  primarySourceType?: string | null;
};

export function shouldRefreshVariantDslFromSourceHtml(
  dsl: VariantDslV1,
  input: Pick<
    ResolveFidelityVariantDslInput,
    "blockType" | "family" | "primarySourceType"
  >,
): boolean {
  if (requiresFidelityTreeRefresh(dsl)) {
    return true;
  }

  const headingLike = input.blockType === "heading" || input.blockType === "title";
  if (!headingLike) {
    return false;
  }

  const styleFamily = input.family ?? dsl.family;
  const primarySourceType = input.primarySourceType ?? null;

  return (
    primarySourceType === "html_paste" ||
    styleFamily === "htmlPaste" ||
    styleFamily === "htmlPasteCandidate"
  );
}

export function refreshVariantDslFromSourceHtml(
  dsl: VariantDslV1,
  input: Required<Pick<ResolveFidelityVariantDslInput, "sourceHtml">> &
    Omit<ResolveFidelityVariantDslInput, "sourceHtml">,
): VariantDslV1 {
  const sourceHtml = input.sourceHtml?.trim() ?? "";
  if (!sourceHtml) {
    return dsl;
  }

  const reencoded = encodeHtmlToVariantDsl({
    html: sourceHtml,
    runtimeVariantId: input.runtimeVariantId,
    blockType: input.blockType,
    label: input.label ?? input.runtimeVariantId,
    family: input.family,
    wechatCompatibilityMode: "off",
  });

  if (!reencoded.ok) {
    return dsl;
  }

  return {
    ...reencoded.value,
    componentProtocol: dsl.componentProtocol,
    compatibility: dsl.compatibility,
  };
}

export function resolveFidelityVariantDslForDecode(
  dsl: VariantDslV1,
  input: ResolveFidelityVariantDslInput,
): VariantDslV1 {
  const needsRefresh = shouldRefreshVariantDslFromSourceHtml(dsl, input);

  if (!needsRefresh) {
    return dsl;
  }

  return refreshVariantDslFromSourceHtml(dsl, {
    ...input,
    sourceHtml: input.sourceHtml ?? "",
  });
}
