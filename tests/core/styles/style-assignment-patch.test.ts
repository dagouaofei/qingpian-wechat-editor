import { describe, expect, it } from "vitest";

import { articleSchema } from "@/core/article";
import {
  applyStyleAssignmentPatch,
  mergeStyleAssignmentPatch,
  styleAssignmentToArticleStylePlan,
} from "@/core/styles";

import { minimalArticleFixture } from "../../fixtures/articles/minimal-article";
import {
  FIXTURE_ARTICLE_ID,
  FIXTURE_ISO,
  fixtureBlockId,
} from "../../fixtures/articles/shared";

const baseArticle = articleSchema.parse(minimalArticleFixture);

const validPatchMeta = {
  source: "ai_style_selection" as const,
  generatedAt: FIXTURE_ISO,
  validationStatus: "valid" as const,
};

describe("style assignment patch merge", () => {
  it("merges patch into styleAssignment without touching blocks content", () => {
    const patch = {
      presetId: "editorial-clean",
      themeId: "businessBlue",
      blockOverrides: [
        {
          blockId: fixtureBlockId(1),
          variantId: "title-left",
        },
      ],
      meta: validPatchMeta,
    };

    const { article, result } = applyStyleAssignmentPatch(baseArticle, patch);

    expect(result.ok).toBe(true);
    expect(article.styleAssignment).toMatchObject({
      presetId: "editorial-clean",
      themeId: "businessBlue",
      blockOverrides: [{ blockId: fixtureBlockId(1), variantId: "title-left" }],
    });
    expect(article.blocks).toEqual(baseArticle.blocks);
    expect(article.blocks[0]?.content).toEqual(baseArticle.blocks[0]?.content);
  });

  it("does not mutate the original Article when applying a patch", () => {
    const original = articleSchema.parse(minimalArticleFixture);
    const snapshot = structuredClone(original);

    applyStyleAssignmentPatch(original, {
      presetId: "editorial-clean",
      meta: validPatchMeta,
    });

    expect(original).toEqual(snapshot);
  });

  it("returns explicit validation issues for invalid patch schema input", () => {
    const result = mergeStyleAssignmentPatch(baseArticle.styleAssignment, {
      presetId: "business",
      meta: {
        source: "ai_style_selection",
        generatedAt: FIXTURE_ISO,
        validationStatus: "valid",
      },
      blockOverrides: [
        {
          blockId: fixtureBlockId(1),
          slotOverrides: {
            className: "evil",
          },
        },
      ],
    });

    expect(result.ok).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
    expect(result.issues[0]?.code).toBe("style_assignment_patch_invalid");
  });

  it("requires validated meta when requireValidatedMeta is enabled", () => {
    const result = mergeStyleAssignmentPatch(
      baseArticle.styleAssignment,
      {
        presetId: "editorial-clean",
        meta: {
          source: "ai_style_selection",
          generatedAt: FIXTURE_ISO,
          validationStatus: "pending",
        },
      },
      { requireValidatedMeta: true },
    );

    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "style_assignment_patch_not_validated")).toBe(
      true,
    );
  });

  it("merges slotOverrides for an existing block override entry", () => {
    const current = {
      themeId: "businessBlue",
      presetId: "business",
      blockOverrides: [
        {
          blockId: fixtureBlockId(1),
          variantId: "title-centered",
          slotOverrides: {
            badge: "原徽章",
          },
        },
      ],
    };

    const result = mergeStyleAssignmentPatch(current, {
      blockOverrides: [
        {
          blockId: fixtureBlockId(1),
          slotOverrides: {
            badge: "新徽章",
          },
        },
      ],
      meta: validPatchMeta,
    });

    expect(result.ok).toBe(true);
    expect(result.styleAssignment?.blockOverrides?.[0]?.slotOverrides).toEqual({
      badge: "新徽章",
    });
  });

  it("builds ArticleStylePlan compatible with existing StyleAssignment", () => {
    const plan = styleAssignmentToArticleStylePlan(
      FIXTURE_ARTICLE_ID,
      baseArticle.styleAssignment,
      {
        source: "system",
        validationStatus: "valid",
      },
      {
        dedupeAdjacentHeadings: true,
      },
    );

    expect(plan).toMatchObject({
      articleId: FIXTURE_ARTICLE_ID,
      presetId: baseArticle.styleAssignment.presetId,
      themeId: baseArticle.styleAssignment.themeId,
      orchestratorHints: {
        dedupeAdjacentHeadings: true,
      },
    });
  });
});
