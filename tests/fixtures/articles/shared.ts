/** Shared constants for Sprint 2 schema fixtures */

export const FIXTURE_ARTICLE_ID = "22222222-2222-4222-8222-222222222222";

export const FIXTURE_ISO = "2026-05-31T00:00:00.000Z";

export function fixtureBlockId(index: number): string {
  return `11111111-1111-4111-8111-${String(index).padStart(12, "0")}`;
}

export function articleFixtureBase() {
  return {
    id: FIXTURE_ARTICLE_ID,
    version: 1 as const,
    metadata: {
      title: "文章标题",
      createdAt: FIXTURE_ISO,
      updatedAt: FIXTURE_ISO,
      locale: "zh-CN",
    },
    input: {
      type: "fixture" as const,
      raw: "fixture:article-base",
      capturedAt: FIXTURE_ISO,
    },
    styleAssignment: {
      themeId: "default",
      presetId: "classic-news",
    },
  };
}
