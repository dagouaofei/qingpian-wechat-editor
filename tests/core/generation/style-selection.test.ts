import { describe, expect, it } from "vitest";

import { parseArticle } from "@/core/article";
import {
  generateAndApplyStyleSelection,
  generateDeterministicStyleSelection,
  generateStyleAssignmentPatch,
  generateStyleSelectionRequest,
} from "@/core/generation";
import {
  FIRST_WAVE_REQUIRED_VARIANT_IDS,
  STYLE_SCHEMA_VERSION,
  createFirstWaveRequiredVariantRegistry,
  resolveArticleStyle,
  validateStyleSelectionPipeline,
  type VariantDefinition,
} from "@/core/styles";

import { fixtureBlockId } from "../../fixtures/articles/shared";
import {
  STYLE_SELECTION_TIMESTAMP,
  forbiddenModelStylePatchOutput,
  invalidModelStylePatchOutput,
  previewOnlyModelStylePatchOutput,
  styleSelectionArticleFixture,
  styleSelectionForbiddenIntentInput,
  styleSelectionMinimalArticleFixture,
  styleSelectionNormalizedInput,
  validModelStylePatchOutput,
} from "../../fixtures/generation/style-selection";

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

const registry = {
  ...createFirstWaveRequiredVariantRegistry(),
  variants: [...createFirstWaveRequiredVariantRegistry().variants, previewOnlyVariant],
};

describe("generation style selection", () => {
  it("generates StyleSelectionRequest from finalized Article", () => {
    const result = generateStyleSelectionRequest({
      article: styleSelectionArticleFixture,
      normalizedInput: styleSelectionNormalizedInput,
      registry,
      timestamp: STYLE_SELECTION_TIMESTAMP,
    });

    expect(result.request.articleId).toBe(styleSelectionArticleFixture.id);
    expect(result.request.blockStyleHints.length).toBe(
      styleSelectionArticleFixture.blocks.length,
    );
    expect(result.request.constraints.mustUseRegisteredVariants).toBe(true);
  });

  it("generates StyleAssignmentPatch from styleIntent heuristics", () => {
    const request = generateStyleSelectionRequest({
      article: styleSelectionArticleFixture,
      normalizedInput: styleSelectionNormalizedInput,
      registry,
      timestamp: STYLE_SELECTION_TIMESTAMP,
    }).request;

    const patchResult = generateStyleAssignmentPatch({
      article: styleSelectionArticleFixture,
      request,
      normalizedInput: styleSelectionNormalizedInput,
      timestamp: STYLE_SELECTION_TIMESTAMP,
      mode: "deterministic",
    });

    expect(patchResult.patch.presetId).toBe("business");
    expect(patchResult.patch.blockOverrides?.length).toBeGreaterThan(0);
  });

  it("passes generated patch through Sprint 3-C validation pipeline", () => {
    const result = generateDeterministicStyleSelection({
      article: styleSelectionArticleFixture,
      normalizedInput: styleSelectionNormalizedInput,
      registry,
      timestamp: STYLE_SELECTION_TIMESTAMP,
    });

    const validation = validateStyleSelectionPipeline(
      styleSelectionArticleFixture,
      registry,
      { kind: "style_assignment_patch", patch: result.patch },
    );

    expect(validation.mergeAllowed).toBe(true);
    expect(validation.ok).toBe(true);
  });

  it("writes validated styleAssignment onto Article", () => {
    const result = generateDeterministicStyleSelection({
      article: styleSelectionArticleFixture,
      normalizedInput: styleSelectionNormalizedInput,
      registry,
      timestamp: STYLE_SELECTION_TIMESTAMP,
    });

    expect(result.applied).toBe(true);
    expect(result.article.styleAssignment.presetId).toBe("business");
    expect(result.article.styleAssignment.blockOverrides?.length).toBeGreaterThan(0);
  });

  it("selects only first-wave required variants", () => {
    const result = generateDeterministicStyleSelection({
      article: styleSelectionArticleFixture,
      normalizedInput: styleSelectionNormalizedInput,
      registry,
      timestamp: STYLE_SELECTION_TIMESTAMP,
    });

    for (const summary of result.selectedVariants) {
      expect(FIRST_WAVE_REQUIRED_VARIANT_IDS).toContain(summary.variantId);
    }
  });

  it("assigns article-aware diverse variants for full block article", () => {
    const result = generateDeterministicStyleSelection({
      article: styleSelectionArticleFixture,
      normalizedInput: styleSelectionNormalizedInput,
      registry,
      timestamp: STYLE_SELECTION_TIMESTAMP,
    });

    const variantIds =
      result.patch.blockOverrides?.map((override) => override.variantId) ?? [];
    expect(new Set(variantIds).size).toBeGreaterThan(5);
    expect(variantIds).toContain("title_bottom_line_editorial");
    expect(variantIds).toContain("lead_accent_band");
  });

  it("falls back when patch references unknown variant", () => {
    const result = generateAndApplyStyleSelection({
      article: styleSelectionArticleFixture,
      normalizedInput: styleSelectionNormalizedInput,
      registry,
      mode: "model_assisted",
      timestamp: STYLE_SELECTION_TIMESTAMP,
      modelPatchOutput: invalidModelStylePatchOutput,
    });

    expect(result.usedFallback).toBe(true);
    expect(result.applied).toBe(true);
    expect(result.article.styleAssignment.presetId).toBe("business");
  });

  it("rejects preview_only variant and applies fallback", () => {
    const result = generateAndApplyStyleSelection({
      article: styleSelectionArticleFixture,
      normalizedInput: styleSelectionNormalizedInput,
      registry,
      mode: "model_assisted",
      timestamp: STYLE_SELECTION_TIMESTAMP,
      modelPatchOutput: previewOnlyModelStylePatchOutput,
    });

    expect(result.usedFallback).toBe(true);
    expect(result.applied).toBe(true);
    const block3Override = result.article.styleAssignment.blockOverrides?.find(
      (entry) => entry.blockId === fixtureBlockId(3),
    );
    expect(block3Override?.variantId).not.toBe("heading_preview_only_fixture");
  });

  it("rejects styleIntent containing forbidden HTML fields", () => {
    const result = generateAndApplyStyleSelection({
      article: styleSelectionMinimalArticleFixture,
      normalizedInput: styleSelectionForbiddenIntentInput,
      registry,
      timestamp: STYLE_SELECTION_TIMESTAMP,
    });

    expect(
      result.issues.some((issue) => issue.code === "style_intent_forbidden_field"),
    ).toBe(true);
    expect(result.applied).toBe(true);
  });

  it("rejects forbidden model style output and keeps Article stable via fallback", () => {
    const beforeBlocks = JSON.stringify(styleSelectionArticleFixture.blocks);
    const result = generateAndApplyStyleSelection({
      article: styleSelectionArticleFixture,
      normalizedInput: styleSelectionNormalizedInput,
      registry,
      mode: "model_assisted",
      timestamp: STYLE_SELECTION_TIMESTAMP,
      modelPatchOutput: forbiddenModelStylePatchOutput,
    });

    expect(result.usedFallback).toBe(true);
    expect(JSON.stringify(result.article.blocks)).toBe(beforeBlocks);
    expect(result.applied).toBe(true);
  });

  it("applies valid model-assisted patch without fallback", () => {
    const result = generateAndApplyStyleSelection({
      article: styleSelectionArticleFixture,
      normalizedInput: styleSelectionNormalizedInput,
      registry,
      mode: "model_assisted",
      timestamp: STYLE_SELECTION_TIMESTAMP,
      modelPatchOutput: validModelStylePatchOutput,
    });

    expect(result.usedFallback).toBe(false);
    expect(result.ok).toBe(true);
    expect(
      result.article.styleAssignment.blockOverrides?.some(
        (override) =>
          override.blockId === fixtureBlockId(1) &&
          override.variantId === "title_left_bar_classic",
      ),
    ).toBe(true);
  });

  it("provides stable deterministic fallback output", () => {
    const first = generateDeterministicStyleSelection({
      article: styleSelectionMinimalArticleFixture,
      normalizedInput: styleSelectionNormalizedInput,
      registry,
      timestamp: STYLE_SELECTION_TIMESTAMP,
    });
    const second = generateDeterministicStyleSelection({
      article: styleSelectionMinimalArticleFixture,
      normalizedInput: styleSelectionNormalizedInput,
      registry,
      timestamp: STYLE_SELECTION_TIMESTAMP,
    });

    expect(first.article.styleAssignment).toEqual(second.article.styleAssignment);
    expect(first.ok).toBe(true);
  });

  it("resolves applied Article through StyleResolver", () => {
    const result = generateDeterministicStyleSelection({
      article: styleSelectionArticleFixture,
      normalizedInput: styleSelectionNormalizedInput,
      registry,
      timestamp: STYLE_SELECTION_TIMESTAMP,
    });

    const resolved = resolveArticleStyle(result.article, registry);
    expect(resolved.blocks).toHaveLength(styleSelectionArticleFixture.blocks.length);
    expect(resolved.blocks.every((block) => block.variantId.length > 0)).toBe(true);
  });

  it("assigns styles for major block types without mutating block content", () => {
    const beforeContent = styleSelectionArticleFixture.blocks.map((block) => block.content);
    const result = generateDeterministicStyleSelection({
      article: styleSelectionArticleFixture,
      normalizedInput: styleSelectionNormalizedInput,
      registry,
      timestamp: STYLE_SELECTION_TIMESTAMP,
    });

    expect(result.article.blocks.map((block) => block.content)).toEqual(beforeContent);
    for (const blockType of ["title", "heading", "paragraph", "list", "cta"] as const) {
      expect(
        result.selectedVariants.some((entry) => entry.blockType === blockType),
      ).toBe(true);
    }
  });

  it("does not create a parallel Article model", () => {
    const result = generateDeterministicStyleSelection({
      article: styleSelectionArticleFixture,
      normalizedInput: styleSelectionNormalizedInput,
      registry,
      timestamp: STYLE_SELECTION_TIMESTAMP,
    });

    expect(result.article.id).toBe(styleSelectionArticleFixture.id);
    expect(result.article.version).toBe(1);
    expect(Array.isArray(result.article.blocks)).toBe(true);
    expect(parseArticle(result.article)).toEqual(result.article);
  });
});
