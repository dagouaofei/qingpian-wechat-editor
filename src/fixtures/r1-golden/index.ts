import { parseArticle, type Article } from "@/core/article";

import defaultGolden from "../../../tests/fixtures/articles/r1-golden-default-article.json";
import longformGolden from "../../../tests/fixtures/articles/r1-golden-longform-article.json";
import structuredGolden from "../../../tests/fixtures/articles/r1-golden-structured-article.json";

export const R1_GOLDEN_FIXTURE_IDS = [
  "r1-golden-default-article",
  "r1-golden-structured-article",
  "r1-golden-longform-article",
] as const;

export type R1GoldenFixtureId = (typeof R1_GOLDEN_FIXTURE_IDS)[number];

export const R1_GOLDEN_PRESET_ID = "business" as const;
export const R1_GOLDEN_THEME_ID = "businessBlue" as const;

export function loadR1GoldenArticle(id: R1GoldenFixtureId): Article {
  switch (id) {
    case "r1-golden-default-article":
      return parseArticle(defaultGolden);
    case "r1-golden-structured-article":
      return parseArticle(structuredGolden);
    case "r1-golden-longform-article":
      return parseArticle(longformGolden);
    default: {
      const _exhaustive: never = id;
      throw new Error(`Unknown golden fixture: ${_exhaustive}`);
    }
  }
}
