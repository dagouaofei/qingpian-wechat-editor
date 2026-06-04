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
