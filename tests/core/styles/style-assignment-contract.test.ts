import { describe, expect, it } from "vitest";

import {
  articleStylePlanSchema,
  parseArticleStylePlan,
  parseStyleSelectionRequest,
  safeParseStyleSelectionRequest,
  styleAssignmentPatchSchema,
  styleSelectionRequestSchema,
} from "@/core/styles";

import {
  FIXTURE_ARTICLE_ID,
  FIXTURE_ISO,
  fixtureBlockId,
} from "../../fixtures/articles/shared";

const validConstraints = {
  mustUseRegisteredVariants: true as const,
  mustUseRegisteredAssets: true as const,
  mustPassWeChatCompatibility: true as const,
};

const validSelectionRequest = {
  articleId: FIXTURE_ARTICLE_ID,
  articleContext: {
    blockCount: 3,
    headingCount: 1,
    densityHint: "standard" as const,
  },
  preferredPresetId: "business",
  blockStyleHints: [
    {
      blockId: fixtureBlockId(1),
      blockType: "title" as const,
      suggestedVariantId: "title-centered",
      suggestedFamilyId: "simple",
      reason: "default title styling",
    },
  ],
  constraints: validConstraints,
  meta: {
    source: "system" as const,
    validationStatus: "pending" as const,
  },
};

describe("style assignment contract schemas", () => {
  describe("StyleSelectionRequest", () => {
    it("parses a valid StyleSelectionRequest", () => {
      expect(parseStyleSelectionRequest(validSelectionRequest)).toMatchObject({
        articleId: FIXTURE_ARTICLE_ID,
        preferredPresetId: "business",
      });
    });

    it("rejects unknown fields on StyleSelectionRequest", () => {
      expect(() =>
        styleSelectionRequestSchema.parse({
          ...validSelectionRequest,
          html: "<div></div>",
        }),
      ).toThrow();
    });

    it("rejects forbidden html field inside blockStyleHints", () => {
      expect(() =>
        styleSelectionRequestSchema.parse({
          ...validSelectionRequest,
          blockStyleHints: [
            {
              blockId: fixtureBlockId(1),
              blockType: "title",
              suggestedSlotOverrides: {
                html: "<b>x</b>",
              },
            },
          ],
        }),
      ).toThrow();
    });

    it("rejects forbidden css/className/style keys in suggestedSlotOverrides", () => {
      for (const forbiddenKey of ["css", "className", "style"] as const) {
        expect(() =>
          styleSelectionRequestSchema.parse({
            ...validSelectionRequest,
            blockStyleHints: [
              {
                blockId: fixtureBlockId(1),
                blockType: "title",
                suggestedSlotOverrides: {
                  [forbiddenKey]: "evil",
                },
              },
            ],
          }),
        ).toThrow();
      }
    });

    it("rejects invalid blockType in blockStyleHints", () => {
      const result = safeParseStyleSelectionRequest({
        ...validSelectionRequest,
        blockStyleHints: [
          {
            blockId: fixtureBlockId(1),
            blockType: "unknown_block",
          },
        ],
      });

      expect(result.success).toBe(false);
    });
  });

  describe("StyleAssignmentPatch", () => {
    const validPatch = {
      presetId: "business",
      blockOverrides: [
        {
          blockId: fixtureBlockId(1),
          variantId: "title-left",
          familyId: "simple",
          slotOverrides: {
            badge: "导读",
          },
        },
      ],
      meta: {
        source: "ai_style_selection" as const,
        generatedAt: FIXTURE_ISO,
        validationStatus: "valid" as const,
      },
    };

    it("parses a valid StyleAssignmentPatch", () => {
      expect(styleAssignmentPatchSchema.parse(validPatch)).toMatchObject({
        presetId: "business",
      });
    });

    it("parses block override entries on StyleAssignmentPatch", () => {
      expect(
        styleAssignmentPatchSchema.parse(validPatch).blockOverrides?.[0],
      ).toMatchObject({
        blockId: fixtureBlockId(1),
        variantId: "title-left",
      });
    });

    it("rejects patch payloads that attempt to modify blocks content", () => {
      expect(() =>
        styleAssignmentPatchSchema.parse({
          ...validPatch,
          blocks: [{ id: fixtureBlockId(1), type: "title", content: {} }],
        }),
      ).toThrow();
    });

    it("rejects forbidden style keys on patch blockOverrides", () => {
      expect(() =>
        styleAssignmentPatchSchema.parse({
          ...validPatch,
          blockOverrides: [
            {
              blockId: fixtureBlockId(1),
              slotOverrides: {
                style: "color:red",
              },
            },
          ],
        }),
      ).toThrow();
    });
  });

  describe("ArticleStylePlan", () => {
    it("parses minimal ArticleStylePlan structure", () => {
      expect(
        parseArticleStylePlan({
          articleId: FIXTURE_ARTICLE_ID,
          presetId: "business",
          themeId: "businessBlue",
          density: "standard",
        }),
      ).toMatchObject({
        presetId: "business",
        themeId: "businessBlue",
      });
    });

    it("parses orchestrator hints on ArticleStylePlan", () => {
      expect(
        articleStylePlanSchema.parse({
          articleId: FIXTURE_ARTICLE_ID,
          presetId: "business",
          themeId: "businessBlue",
          orchestratorHints: {
            dedupeAdjacentHeadings: true,
            maxAssetReuse: 2,
            avoidTitleFirstHeadingSameFamilyVariant: true,
            notes: ["R1 enabled"],
          },
        }).orchestratorHints,
      ).toMatchObject({
        dedupeAdjacentHeadings: true,
        maxAssetReuse: 2,
      });
    });
  });
});
