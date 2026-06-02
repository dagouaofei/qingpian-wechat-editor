/** Shared helpers for S7-STORY-002 article sample fixtures. */

export const ARTICLE_SAMPLE_ISO = "2026-06-02T00:00:00.000Z";

export function sampleArticleId(index: number): string {
  return `33333333-3333-4333-8333-${String(index).padStart(12, "0")}`;
}

export function sampleBlockId(articleIndex: number, blockIndex: number): string {
  return `55555555-5555-4555-8555-${String(articleIndex).padStart(4, "0")}${String(blockIndex).padStart(8, "0")}`;
}

export function sampleArticleBase(articleIndex: number, title: string, raw: string) {
  return {
    id: sampleArticleId(articleIndex),
    version: 1 as const,
    metadata: {
      title,
      createdAt: ARTICLE_SAMPLE_ISO,
      updatedAt: ARTICLE_SAMPLE_ISO,
      locale: "zh-CN",
    },
    input: {
      type: "fixture" as const,
      raw,
      capturedAt: ARTICLE_SAMPLE_ISO,
    },
    styleAssignment: {
      themeId: "default",
      presetId: "classic-news",
    },
  };
}

export function paragraph(text: string) {
  return {
    type: "paragraph" as const,
    content: { text: [{ text }] },
  };
}
