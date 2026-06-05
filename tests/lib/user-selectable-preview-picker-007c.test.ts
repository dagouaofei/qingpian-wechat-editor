import { describe, expect, it } from "vitest";

import { buildMiaopianPresetDefinitions } from "@/config/miaopian-preset-bundles";
import {
  FIRST_WAVE_REQUIRED_VARIANT_IDS,
  RELEASE1_REQUIRED_VARIANT_COUNT_BY_BLOCK,
  RELEASE1_REQUIRED_VARIANT_IDS,
  createFirstWaveRequiredVariantRegistry,
} from "@/core/styles";
import { TITLE_BLOCK_SUPPORTED_VARIANT_IDS } from "@/core/renderer/title-block-renderer";
import { pickRegisteredVariantForBlock } from "@/core/generation/style-selection-prompt";
import {
  getUserSelectablePreviewVariantAssets,
  getUserSelectablePreviewVariantIds,
  isUserSelectablePreviewVariantId,
} from "@/core/style-library/user-selectable-preview-pool";
import { HTML_PASTE_TEAL_SECTION_LABEL_ASSET } from "@/core/style-library/assets/html-paste-variant-assets";
import { variantPoolForPresetBlock } from "@/lib/gallery-block-variants";
import {
  PREVIEW_HEADING_STYLE_OPTIONS,
  PREVIEW_USER_SELECTABLE_HEADING_STYLE_OPTIONS,
} from "@/lib/preview-heading-style";
import { createUserPreviewStyleRegistry } from "@/lib/user-preview-style-registry";
import { renderArticlePreviewClient } from "@/lib/render-article-preview-client";
import { S9_STORY_007B_VARIANT_ID } from "../fixtures/style-library/s9-story-007b-html-paste-e2e-sample";
import {
  styleSelectionArticleFixture,
  styleSelectionNormalizedInput,
} from "../fixtures/generation/style-selection";

describe("S9-STORY-007C user-selectable preview picker", () => {
  it("exposes user_selectable heading variant in preview style options", () => {
    expect(PREVIEW_USER_SELECTABLE_HEADING_STYLE_OPTIONS).toHaveLength(1);
    expect(PREVIEW_USER_SELECTABLE_HEADING_STYLE_OPTIONS[0]?.id).toBe(
      S9_STORY_007B_VARIANT_ID,
    );
    expect(PREVIEW_HEADING_STYLE_OPTIONS.some((option) => option.id === S9_STORY_007B_VARIANT_ID)).toBe(
      true,
    );
  });

  it("keeps style library asset metadata boundaries", () => {
    const asset = HTML_PASTE_TEAL_SECTION_LABEL_ASSET;
    expect(asset.lifecycle).toBe("user_selectable");
    expect(asset.distribution.userSelectable).toBe(true);
    expect(asset.distribution.defaultEligible).toBe(false);
    expect(asset.distribution.release1Required).toBe(false);
    expect(getUserSelectablePreviewVariantAssets()).toContainEqual(asset);
  });

  it("extends user preview registry without polluting release1 required registry", () => {
    const releaseRegistry = createFirstWaveRequiredVariantRegistry();
    const previewRegistry = createUserPreviewStyleRegistry();

    expect(releaseRegistry.variants.map((variant) => variant.id)).not.toContain(
      S9_STORY_007B_VARIANT_ID,
    );
    expect(previewRegistry.variants.map((variant) => variant.id)).toContain(
      S9_STORY_007B_VARIANT_ID,
    );
    expect(FIRST_WAVE_REQUIRED_VARIANT_IDS).not.toContain(S9_STORY_007B_VARIANT_ID);
    expect(RELEASE1_REQUIRED_VARIANT_IDS.length).toBe(92);
    expect(RELEASE1_REQUIRED_VARIANT_COUNT_BY_BLOCK.heading).toBe(8);
  });

  it("does not add user_selectable variant to gallery pools or shared title renderer allowlist", () => {
    for (const presetId of ["business", "warm"]) {
      expect(variantPoolForPresetBlock(presetId, "heading")).not.toContain(
        S9_STORY_007B_VARIANT_ID,
      );
    }
    expect(TITLE_BLOCK_SUPPORTED_VARIANT_IDS).not.toContain(S9_STORY_007B_VARIANT_ID);
  });

  it("keeps default preset heading defaults unchanged", () => {
    const presets = buildMiaopianPresetDefinitions();
    expect(presets.find((preset) => preset.id === "business")?.defaultVariantByBlockType?.heading).toBe(
      "heading_short_line",
    );
    expect(presets.find((preset) => preset.id === "warm")?.defaultVariantByBlockType?.heading).toBe(
      "heading_highlight_marker",
    );
  });

  it("does not pick user_selectable variant on AI generation path", () => {
    const registry = createFirstWaveRequiredVariantRegistry();
    const preset = buildMiaopianPresetDefinitions().find((entry) => entry.id === "business")!;
    const warnings: never[] = [];
    const pick = pickRegisteredVariantForBlock(
      registry,
      preset,
      "heading",
      undefined,
      warnings,
    );
    expect(pick.variantId).not.toBe(S9_STORY_007B_VARIANT_ID);
    expect(isUserSelectablePreviewVariantId(pick.variantId)).toBe(false);
  });

  it("renders preview and copy when user manually selects user_selectable heading", () => {
    const defaultRendered = renderArticlePreviewClient(
      styleSelectionArticleFixture,
      styleSelectionNormalizedInput,
      { articleStyle: "business", colorPalette: "businessBlue", headingVariantId: "" },
    );
    const selectedRendered = renderArticlePreviewClient(
      styleSelectionArticleFixture,
      styleSelectionNormalizedInput,
      {
        articleStyle: "business",
        colorPalette: "businessBlue",
        headingVariantId: S9_STORY_007B_VARIANT_ID,
      },
    );

    const defaultHeadingVariants = defaultRendered.previewBlocks
      .filter((block) => block.blockType === "heading")
      .map((block) => block.variantId);
    const selectedHeadingVariants = selectedRendered.previewBlocks
      .filter((block) => block.blockType === "heading")
      .map((block) => block.variantId);

    expect(defaultHeadingVariants.every((id) => id !== S9_STORY_007B_VARIANT_ID)).toBe(true);
    expect(selectedHeadingVariants.every((id) => id === S9_STORY_007B_VARIANT_ID)).toBe(true);
    expect(selectedRendered.clipboard.textHtml).toContain("#0d9488");

    const selectedHeadingPreview = selectedRendered.previewBlocks.find(
      (block) => block.blockType === "heading",
    );
    expect(selectedHeadingPreview?.output?.kind).toBe("title_block_preview");
    if (selectedHeadingPreview?.output?.kind === "title_block_preview") {
      expect(selectedHeadingPreview.output.variantId).toBe(S9_STORY_007B_VARIANT_ID);
      expect(selectedHeadingPreview.output.presentation.htmlPasteTealSectionLabel).toBe(true);
      expect(selectedHeadingPreview.output.typography?.accentColor).toBe("#0d9488");
      expect(selectedHeadingPreview.output.presentation.badgeText).toMatch(/^SECTION /);
    }

    expect(getUserSelectablePreviewVariantIds()).toContain(S9_STORY_007B_VARIANT_ID);
  });
});
