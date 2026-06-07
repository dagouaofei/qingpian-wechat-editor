import { createHash } from "crypto";

import type { SourceExactTrace } from "@/core/dsl/runtime/dsl-trace-types";

export type { SourceExactTrace };

export function hashTraceContent(value: string | null | undefined): string | null {
  if (!value || !value.trim()) return null;
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

export function hashJsonDefinition(definitionJson: unknown): string | null {
  if (definitionJson == null) return null;
  try {
    return hashTraceContent(JSON.stringify(definitionJson));
  } catch {
    return null;
  }
}

export function buildSourceExactTrace(input: {
  runtimeVariantId: string;
  definitionJson?: unknown;
  decodedPreviewHtml?: string | null;
  decodedCopyHtml?: string | null;
  renderedHtml?: string | null;
  selectedRuntimeVariantId?: string;
  renderedByVariantId?: string;
  fallbackUsed?: boolean;
  fallbackReason?: string | null;
}): SourceExactTrace {
  return {
    runtimeVariantId: input.runtimeVariantId,
    definitionHash: hashJsonDefinition(input.definitionJson),
    decodedPreviewHash: hashTraceContent(input.decodedPreviewHtml ?? null),
    decodedCopyHash: hashTraceContent(input.decodedCopyHtml ?? null),
    renderedHtmlHash: hashTraceContent(input.renderedHtml ?? null),
    selectedRuntimeVariantId: input.selectedRuntimeVariantId ?? input.runtimeVariantId,
    renderedByVariantId: input.renderedByVariantId ?? input.runtimeVariantId,
    fallbackUsed: input.fallbackUsed ?? false,
    fallbackReason: input.fallbackReason ?? null,
  };
}
