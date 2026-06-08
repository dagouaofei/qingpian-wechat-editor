import type { StyleVariantSource } from "@prisma/client";

export function pickInspectionHtmlSource(
  sources: StyleVariantSource[],
): StyleVariantSource | null {
  const withRawHtml = sources.find((source) => Boolean(source.rawHtml?.trim()));
  if (withRawHtml) {
    return withRawHtml;
  }
  return sources[0] ?? null;
}
