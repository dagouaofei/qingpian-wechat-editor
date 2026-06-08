import type { Article } from "@/core/article";

/** 1-based index of a heading block within the article (for auto 01, 02, …). */
export function resolveHeadingOrdinalInArticle(article: Article, blockId: string): number {
  const headings = article.blocks.filter((block) => block.type === "heading");
  const index = headings.findIndex((block) => block.id === blockId);
  return index >= 0 ? index + 1 : 1;
}

export function formatHeadingOrdinalLabel(ordinal: number): string {
  return String(Math.max(1, ordinal)).padStart(2, "0");
}

export function resolveHeadingIndexLabel(
  article: Article | undefined,
  blockId: string,
  metaSourceIndex?: number,
): string {
  if (metaSourceIndex != null) {
    return formatHeadingOrdinalLabel(metaSourceIndex);
  }
  if (article) {
    return formatHeadingOrdinalLabel(resolveHeadingOrdinalInArticle(article, blockId));
  }
  return "01";
}

const EYEBROW_ORDINAL_DIGIT_PATTERN = /\b\d{1,3}\b/g;

/** Replace every 1–3 digit run in eyebrow label with chapter ordinal (e.g. CHAPTER 03 → CHAPTER 01). */
export function applyOrdinalToEyebrowLabel(
  sourceEyebrow: string,
  ordinalLabel: string,
): string {
  if (!sourceEyebrow.trim() || !/\b\d{1,3}\b/.test(sourceEyebrow)) {
    return sourceEyebrow;
  }
  return sourceEyebrow.replace(EYEBROW_ORDINAL_DIGIT_PATTERN, ordinalLabel);
}
