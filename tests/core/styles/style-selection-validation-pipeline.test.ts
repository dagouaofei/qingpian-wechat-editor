import { describe, expect, it } from "vitest";

import { parseArticle } from "@/core/article";
import {
  STYLE_SCHEMA_VERSION,
  applyValidatedStyleSelection,
  applyStyleAssignmentPatch,
  canMergeStyleSelectionResult,
  createFirstWaveRequiredVariantRegistry,
  validateDensityValue,
  validatePresetThemeCombination,
  validateStyleSelectionPipeline,
} from "@/core/styles";
import type { StyleRegistry, VariantDefinition } from "@/core/styles";

import { fixtureBlockId } from "../../fixtures/articles/shared";
import {
  STYLE_SELECTION_FIXTURES,
  STYLE_SELECTION_FIXTURES_BY_ID,
  previewOnlyRejectedFixture,
} from "../../fixtures/styles/style-selection";
import {
  STYLE_SELECTION_VALIDATION_SEEDS,
  getStyleSelectionValidationSeed,
} from "../../fixtures/styles/style-selection-validation-seeds";

function buildRegistry(
  extraVariants: VariantDefinition[] = [],
): StyleRegistry {
  const base = createFirstWaveRequiredVariantRegistry();
  return {
    ...base,
    variants: [...base.variants, ...extraVariants],
  };
}

const previewOnlyVariant: VariantDefinition = {
  id: "heading_preview_only_fixture",
  schemaVersion: STYLE_SCHEMA_VERSION,
  blockType: "heading",
  family: "simple",
  name: "heading-preview-only",
  label: "Preview Only Heading",
  status: "release1_candidate",
  componentProtocol: {
    componentId: "titleBlock",
    familyId: "simple",
    layoutMode: "plain",
  },
  compatibility: {
    copySafety: "preview_only",
  },
  slots: {
    title: {
      id: "title",
      role: "title",
      binding: { source: "block.content.text", required: true },
      copySafety: { copySafety: "strict", allowedInCopy: true },
    },
  },
};

const registry = buildRegistry([previewOnlyVariant]);

function runFixture(fixtureId: string) {
  const fixture = STYLE_SELECTION_FIXTURES_BY_ID[fixtureId];
  if (!fixture) {
    throw new Error(`missing fixture ${fixtureId}`);
  }
  const article = parseArticle(fixture.articleInput);
  return validateStyleSelectionPipeline(article, registry, fixture.input);
}

describe("validateStyleSelectionPipeline", () => {
  it("passes valid StyleSelectionRequest through pipeline", () => {
    const result = runFixture("valid-basic-style-request");
    expect(result.ok).toBe(true);
    expect(result.mergeAllowed).toBe(true);
    expect(result.validationStatus).toBe("valid");
  });

  it("passes valid StyleAssignmentPatch through pipeline", () => {
    const result = runFixture("valid-style-assignment-patch");
    expect(result.ok).toBe(true);
    expect(result.mergeAllowed).toBe(true);
  });

  it("passes valid ArticleStylePlan through pipeline", () => {
    const article = parseArticle(
      STYLE_SELECTION_FIXTURES_BY_ID["valid-basic-style-request"]!.articleInput,
    );
    const result = validateStyleSelectionPipeline(article, registry, {
      kind: "article_style_plan",
      plan: {
        articleId: article.id,
        presetId: "business",
        themeId: "businessBlue",
        blockOverrides: [
          {
            blockId: fixtureBlockId(1),
            variantId: "title_plain_minimal",
          },
        ],
      },
    });
    expect(result.ok).toBe(true);
    expect(result.mergeAllowed).toBe(true);
  });

  it("does not mutate Article", () => {
    const fixture = STYLE_SELECTION_FIXTURES_BY_ID["valid-basic-style-request"]!;
    const article = parseArticle(fixture.articleInput);
    const snapshot = structuredClone(article);
    validateStyleSelectionPipeline(article, registry, fixture.input);
    expect(article).toEqual(snapshot);
  });

  it("does not modify Article.blocks", () => {
    const fixture = STYLE_SELECTION_FIXTURES_BY_ID["valid-basic-style-request"]!;
    const article = parseArticle(fixture.articleInput);
    const blocksSnapshot = structuredClone(article.blocks);
    validateStyleSelectionPipeline(article, registry, fixture.input);
    expect(article.blocks).toEqual(blocksSnapshot);
  });

  it("does not modify block.content", () => {
    const fixture = STYLE_SELECTION_FIXTURES_BY_ID["valid-basic-style-request"]!;
    const article = parseArticle(fixture.articleInput);
    const contentSnapshot = article.blocks.map((block) => block.content);
    validateStyleSelectionPipeline(article, registry, fixture.input);
    expect(article.blocks.map((block) => block.content)).toEqual(contentSnapshot);
  });

  it("errors on unknown variantId", () => {
    const result = runFixture("invalid-unknown-variant");
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.code === "variant_not_registered")).toBe(
      true,
    );
  });

  it("errors on variant blockType mismatch via orchestrator", () => {
    const article = parseArticle({
      ...STYLE_SELECTION_FIXTURES_BY_ID["invalid-unknown-variant"]!.articleInput,
      blocks: [
        {
          id: fixtureBlockId(1),
          type: "title",
          content: { text: "标题" },
        },
      ],
    });
    const result = validateStyleSelectionPipeline(article, registry, {
      kind: "style_assignment_patch",
      patch: {
        blockOverrides: [
          {
            blockId: fixtureBlockId(1),
            variantId: "heading_short_line",
          },
        ],
        meta: { source: "user", generatedAt: "2026-06-01T00:00:00.000Z" },
      },
    });
    expect(result.ok).toBe(false);
    expect(
      result.issues.some(
        (issue) =>
          issue.code === "block_visual_protocol_block_type_mismatch" ||
          issue.code === "orchestrator_variant_block_type_mismatch",
      ),
    ).toBe(true);
  });

  it("errors on unknown familyId", () => {
    const article = parseArticle(
      STYLE_SELECTION_FIXTURES_BY_ID["valid-style-assignment-patch"]!.articleInput,
    );
    const result = validateStyleSelectionPipeline(article, registry, {
      kind: "style_assignment_patch",
      patch: {
        blockOverrides: [
          {
            blockId: fixtureBlockId(1),
            variantId: "title_plain_minimal",
            familyId: "unknown_family",
          },
        ],
        meta: { source: "user", generatedAt: "2026-06-01T00:00:00.000Z" },
      },
    });
    expect(result.ok).toBe(false);
    expect(
      result.issues.some((issue) => issue.code === "family_id_not_registered"),
    ).toBe(true);
  });

  it("errors on unknown assetId", () => {
    const result = runFixture("invalid-unknown-asset");
    expect(result.ok).toBe(false);
    expect(
      result.issues.some((issue) => issue.code === "visual_asset_not_registered"),
    ).toBe(true);
  });

  it("errors when copy-unsafe asset used on required path", () => {
    const article = parseArticle(
      STYLE_SELECTION_FIXTURES_BY_ID["invalid-unknown-asset"]!.articleInput,
    );
    const result = validateStyleSelectionPipeline(article, registry, {
      kind: "style_assignment_patch",
      patch: {
        blockOverrides: [
          {
            blockId: fixtureBlockId(2),
            variantId: "heading_card_centered",
            assetBindings: { badge: "icon-warning-triangle" },
          },
        ],
        meta: { source: "ai_style_selection", generatedAt: "2026-06-01T00:00:00.000Z" },
      },
    });
    expect(result.ok).toBe(false);
    expect(
      result.issues.some((issue) => issue.code === "visual_asset_not_copy_safe"),
    ).toBe(true);
  });

  it("errors on illegal slot override", () => {
    const result = runFixture("invalid-slot-override");
    expect(result.ok).toBe(false);
    expect(
      result.issues.some((issue) => issue.code === "slot_override_slot_not_allowed"),
    ).toBe(true);
  });

  it("errors when slot override generates body semantics", () => {
    const result = runFixture("invalid-body-semantic-from-slot");
    expect(result.ok).toBe(false);
    expect(
      result.issues.some(
        (issue) => issue.code === "slot_override_body_semantics_forbidden",
      ),
    ).toBe(true);
  });

  it("errors when slot override contains html/css/className/style", () => {
    const article = parseArticle(
      STYLE_SELECTION_FIXTURES_BY_ID["invalid-slot-override"]!.articleInput,
    );
    const patchHtmlResult = validateStyleSelectionPipeline(article, registry, {
      kind: "style_assignment_patch",
      patch: {
        blockOverrides: [
          {
            blockId: fixtureBlockId(2),
            variantId: "heading_card_centered",
            slotOverrides: { badge: "<b>01</b>" },
          },
        ],
        meta: { source: "ai_style_selection", generatedAt: "2026-06-01T00:00:00.000Z" },
      },
    });
    expect(
      patchHtmlResult.issues.some(
        (issue) => issue.code === "style_assignment_patch_invalid",
      ),
    ).toBe(true);

    const styleResult = validateStyleSelectionPipeline(article, registry, {
      kind: "style_assignment_patch",
      patch: {
        blockOverrides: [
          {
            blockId: fixtureBlockId(2),
            variantId: "heading_card_centered",
            slotOverrides: { style: "color:red" },
          },
        ],
        meta: { source: "ai_style_selection", generatedAt: "2026-06-01T00:00:00.000Z" },
      },
    });
    expect(
      styleResult.issues.some(
        (issue) =>
          issue.code === "slot_override_forbidden_property" ||
          issue.code === "style_assignment_patch_invalid",
      ),
    ).toBe(true);
  });

  it("errors on unknown density via preset theme combination path", () => {
    const article = parseArticle(
      STYLE_SELECTION_FIXTURES_BY_ID["valid-style-assignment-patch"]!.articleInput,
    );
    const schemaResult = validateStyleSelectionPipeline(article, registry, {
      kind: "article_style_plan",
      plan: {
        articleId: article.id,
        presetId: "business",
        themeId: "businessBlue",
        density: "dense" as never,
      },
    });
    expect(schemaResult.ok).toBe(false);
    expect(
      schemaResult.issues.some((issue) => issue.code === "article_style_plan_invalid"),
    ).toBe(true);

    expect(validateDensityValue("dense")[0]?.code).toBe("unknown_density");

    const combinationResult = validatePresetThemeCombination(
      { presetId: "business", themeId: "businessBlue", density: "dense" as never },
      { registry },
    );
    expect(combinationResult.ok).toBe(false);
    expect(
      combinationResult.issues.some((issue) => issue.code === "unknown_density"),
    ).toBe(true);
  });

  it("rejects preview_only variant on required path", () => {
    const result = runFixture("preview-only-rejected");
    expect(result.ok).toBe(false);
    expect(result.mergeAllowed).toBe(false);
    expect(
      result.issues.some(
        (issue) => issue.code === "variant_preview_only_on_required_path",
      ),
    ).toBe(true);
  });

  it("rejects candidate variant on default required path", () => {
    const result = runFixture("preview-only-rejected");
    expect(
      result.issues.some((issue) => issue.code === "variant_status_not_required_path"),
    ).toBe(true);
  });

  it("keeps unified heading variant for adjacent headings (R1 disabled)", () => {
    const result = runFixture("orchestrator-r1-fallback-applied");
    expect(result.validationStatus).toBe("valid");
    expect(result.mergeAllowed).toBe(true);
    expect(
      result.issues.some((issue) => issue.code === "orchestrator_r1_fallback"),
    ).toBe(false);
    expect(
      result.plan.blockOverrides?.find((entry) => entry.blockId === fixtureBlockId(3))
        ?.variantId,
    ).toBe("heading_short_line");
  });

  it("emits R2 asset reuse issue", () => {
    const result = runFixture("orchestrator-r2-asset-limit");
    expect(
      result.issues.some(
        (issue) => issue.code === "orchestrator_r2_asset_reuse_exceeded",
      ),
    ).toBe(true);
    expect(result.validationStatus).toBe("fallback_applied");
  });

  it("avoids R8 false positive for publish pool title/heading pairing", () => {
    const result = runFixture("orchestrator-r8-title-heading-conflict");
    expect(
      result.issues.some((issue) => issue.code === "orchestrator_r8_fallback"),
    ).toBe(false);
    expect(result.validationStatus).toBe("valid");
    expect(
      result.plan.blockOverrides?.find((entry) => entry.blockId === fixtureBlockId(2))
        ?.variantId,
    ).toBe("heading_numbered_section");
  });

  it("re-validates orchestrator output in post_orchestrator_validation stage", () => {
    const result = runFixture("valid-basic-style-request");
    expect(result.snapshot.stages).toContain("post_orchestrator_validation");
    expect(result.plan.blockOverrides?.length).toBeGreaterThan(0);
  });

  it("treats asset binding on body-content slot as error on required path", () => {
    const article = parseArticle({
      ...STYLE_SELECTION_FIXTURES_BY_ID["invalid-unknown-asset"]!.articleInput,
      blocks: [
        {
          id: fixtureBlockId(1),
          type: "title",
          content: { text: "标题" },
        },
      ],
    });
    const result = validateStyleSelectionPipeline(article, registry, {
      kind: "style_assignment_patch",
      patch: {
        blockOverrides: [
          {
            blockId: fixtureBlockId(1),
            variantId: "title_plain_minimal",
            assetBindings: { title: "mark-step-badge" },
          },
        ],
        meta: { source: "ai_style_selection", generatedAt: "2026-06-01T00:00:00.000Z" },
      },
    });
    const issue = result.issues.find(
      (entry) => entry.code === "asset_binding_body_semantics_forbidden",
    );
    expect(issue?.severity).toBe("error");
    expect(result.ok).toBe(false);
    expect(result.mergeAllowed).toBe(false);
  });

  it("blocks merge for unvalidated invalid patch", () => {
    const fixture = STYLE_SELECTION_FIXTURES_BY_ID["invalid-unknown-variant"]!;
    const article = parseArticle(fixture.articleInput);
    const rawMerge = applyStyleAssignmentPatch(article, fixture.input.patch);
    expect(rawMerge.result.ok).toBe(true);

    const validated = validateStyleSelectionPipeline(
      article,
      registry,
      fixture.input,
    );
    expect(canMergeStyleSelectionResult(validated)).toBe(false);
    const applied = applyValidatedStyleSelection(article, validated);
    expect(applied.applied).toBe(false);
    expect(applied.article.styleAssignment).toEqual(article.styleAssignment);
  });

  it("allows merge only when validation passes or fallback_applied", () => {
    const valid = runFixture("valid-style-assignment-patch");
    expect(canMergeStyleSelectionResult(valid)).toBe(true);
    const article = parseArticle(
      STYLE_SELECTION_FIXTURES_BY_ID["valid-style-assignment-patch"]!.articleInput,
    );
    const applied = applyValidatedStyleSelection(article, valid);
    expect(applied.applied).toBe(true);
    expect(applied.article.styleAssignment.blockOverrides?.[0]?.variantId).toBe(
      "title_left_bar_classic",
    );
  });
});

describe("style selection validation snapshot seeds", () => {
  it("exports at least 10 fixture seeds", () => {
    expect(STYLE_SELECTION_VALIDATION_SEEDS.length).toBeGreaterThanOrEqual(10);
  });

  it("matches stable expected issue codes for each seed", () => {
    for (const seed of STYLE_SELECTION_VALIDATION_SEEDS) {
      const result = runFixture(seed.fixtureId);
      expect(result.ok).toBe(seed.snapshot.expectedOk);
      expect(result.mergeAllowed).toBe(seed.snapshot.mergeAllowed);
      for (const code of seed.snapshot.expectedIssueCodes) {
        expect(result.issues.some((issue) => issue.code === code)).toBe(true);
      }
    }
  });

  it("documents publish-safe title/heading pairing in orchestrator-r8 seed", () => {
    const seed = getStyleSelectionValidationSeed(
      "orchestrator-r8-title-heading-conflict",
    );
    expect(seed?.snapshot.expectedIssueCodes).toHaveLength(0);
    expect(seed?.description).toContain("distinct family");
  });

  it("covers preview-only rejection seed", () => {
    const seed = getStyleSelectionValidationSeed("preview-only-rejected");
    expect(seed?.snapshot.expectedOk).toBe(false);
    expect(previewOnlyRejectedFixture.expected.issueCodes).toContain(
      "variant_preview_only_on_required_path",
    );
  });
});

describe("style selection fixtures catalog", () => {
  it("includes all required fixture ids", () => {
    const ids = STYLE_SELECTION_FIXTURES.map((fixture) => fixture.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        "valid-basic-style-request",
        "valid-style-assignment-patch",
        "invalid-unknown-variant",
        "invalid-unknown-asset",
        "invalid-slot-override",
        "invalid-body-semantic-from-slot",
        "orchestrator-r1-fallback-applied",
        "orchestrator-r2-asset-limit",
        "orchestrator-r8-title-heading-conflict",
        "preview-only-rejected",
      ]),
    );
  });
});
