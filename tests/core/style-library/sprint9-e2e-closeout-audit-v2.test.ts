import { describe, expect, it } from "vitest";

import { buildMiaopianPresetDefinitions } from "@/config/miaopian-preset-bundles";
import {
  FIRST_WAVE_REQUIRED_VARIANT_IDS,
  RELEASE1_REQUIRED_VARIANT_IDS,
  createFirstWaveRequiredVariantRegistry,
} from "@/core/styles";
import { createHtmlCandidateProposal } from "@/core/style-library";
import { HTML_PASTE_TEAL_SECTION_LABEL_ASSET } from "@/core/style-library/assets/html-paste-variant-assets";
import {
  HTML_PASTE_SOURCE_REFERENCE_COLOR,
  resolveHtmlPasteSectionLabelStyleTokens,
} from "@/core/renderer/html-paste-teal-section-label-shared";
import { TITLE_BLOCK_SUPPORTED_VARIANT_IDS } from "@/core/renderer/title-block-renderer";
import { pickRegisteredVariantForBlock } from "@/core/generation/style-selection-prompt";
import { variantPoolForPresetBlock } from "@/lib/gallery-block-variants";
import {
  getUserSelectablePreviewVariantAssetsForBlockType,
} from "@/core/style-library/user-selectable-preview-pool";
import { headingTealSectionLabelHtmlPasteCandidate } from "@/core/styles/variants/html-paste-candidate-variants";
import type { UserSelectableVariantPoolSnapshot } from "@/lib/user-selectable-variant-pool-types";
import { renderArticlePreviewClient } from "@/lib/render-article-preview-client";
import {
  S9_STORY_007B_HTML_PASTE_E2E_SOURCE_HTML,
  S9_STORY_007B_VARIANT_ID,
} from "../../fixtures/style-library/s9-story-007b-html-paste-e2e-sample";
import { articleFixtureBase, fixtureBlockId } from "../../fixtures/articles/shared";
import { parseArticle } from "@/core/article";
import { styleSelectionNormalizedInput } from "../../fixtures/generation/style-selection";
import { createUserPreviewStyleRegistry } from "@/lib/user-preview-style-registry";
import { resolveArticleStyle } from "@/core/styles";
import { buildBlockRenderContext } from "@/core/renderer/context";
import { renderTargetForMode } from "@/core/renderer/types";
import { renderHtmlPasteTealSectionLabelHeadingCopy } from "@/core/copy/html-paste-candidate-copy";
import { renderHtmlPasteTealSectionLabelHeadingPreview } from "@/core/renderer/html-paste-candidate-preview";

function articleWithThreeHeadings() {
  return parseArticle({
    ...articleFixtureBase(),
    styleAssignment: { themeId: "businessBlue", presetId: "business" },
    blocks: [
      { id: fixtureBlockId(31), type: "heading", content: { text: "H1", level: 2 } },
      { id: fixtureBlockId(32), type: "paragraph", content: { text: [{ text: "p" }] } },
      { id: fixtureBlockId(33), type: "heading", content: { text: "H2", level: 2 } },
      { id: fixtureBlockId(34), type: "heading", content: { text: "H3", level: 2 } },
    ],
  });
}

describe("S9-STORY-009 v2 E2E closeout audit", () => {
  it("chains HTML paste proposal to applied user_selectable asset", () => {
    const proposal = createHtmlCandidateProposal({
      sourceHtml: S9_STORY_007B_HTML_PASTE_E2E_SOURCE_HTML,
      blockType: "heading",
    });
    expect(proposal.proposedLifecycle).toBe("candidate");
    expect(proposal.distribution.userSelectable).toBe(false);
    expect(HTML_PASTE_TEAL_SECTION_LABEL_ASSET.lifecycle).toBe("user_selectable");
    expect(HTML_PASTE_TEAL_SECTION_LABEL_ASSET.runtimeVariantId).toBe(
      S9_STORY_007B_VARIANT_ID,
    );
  });

  it("exposes user-selectable manifest fixture label for dev/test audit", () => {
    const manifestOptions = getUserSelectablePreviewVariantAssetsForBlockType("heading");
    expect(manifestOptions[0]?.label).toBe("章节标签标题（HTML 采集 · 用户可选）");
    expect(manifestOptions[0]?.runtimeVariantId).toBe(S9_STORY_007B_VARIANT_ID);
  });

  it("passes preview/copy parity with dynamic section labels and theme accent", () => {
    const dbUserPool: UserSelectableVariantPoolSnapshot = {
      source: "database",
      cache: { hit: false, ttlSeconds: 120, generatedAt: "2026-06-07T00:00:00.000Z" },
      variants: [headingTealSectionLabelHtmlPasteCandidate],
      poolVariantIds: [headingTealSectionLabelHtmlPasteCandidate.id],
      issues: [],
    };
    const article = articleWithThreeHeadings();
    const rendered = renderArticlePreviewClient(
      article,
      styleSelectionNormalizedInput,
      {
        articleStyle: "business",
        colorPalette: "businessBlue",
        headingVariantId: S9_STORY_007B_VARIANT_ID,
      },
      { userSelectablePool: dbUserPool },
    );

    const headings = rendered.previewBlocks.filter((block) => block.blockType === "heading");
    expect(headings.map((block) => block.variantId)).toEqual([
      S9_STORY_007B_VARIANT_ID,
      S9_STORY_007B_VARIANT_ID,
      S9_STORY_007B_VARIANT_ID,
    ]);

    for (const [index, block] of headings.entries()) {
      const label = `SECTION ${String(index + 1).padStart(2, "0")}`;
      expect(rendered.clipboard.textHtml).toContain(label);
      if (block.output?.kind === "title_block_preview") {
        expect(block.output.presentation.badgeText).toBe(label);
        expect(block.output.typography?.accentColor).toBe("#2563eb");
      }
    }
    expect(rendered.clipboard.textHtml).toContain("#2563eb");
    expect(rendered.clipboard.textHtml).not.toContain(HTML_PASTE_SOURCE_REFERENCE_COLOR);
  });

  it("uses shared token helper for preview and copy renderers", () => {
    const article = articleWithThreeHeadings();
    const registry = createUserPreviewStyleRegistry({
      dbUserSelectableVariants: [headingTealSectionLabelHtmlPasteCandidate],
    });
    const resolved = resolveArticleStyle(
      {
        ...article,
        styleAssignment: {
          ...article.styleAssignment,
          blockOverrides: [{ blockId: fixtureBlockId(33), variantId: S9_STORY_007B_VARIANT_ID }],
        },
      },
      registry,
    );
    const block = article.blocks.find((entry) => entry.id === fixtureBlockId(33))!;
    const previewContext = buildBlockRenderContext({
      article,
      blockId: block.id,
      resolvedArticleStyle: resolved,
      mode: "preview",
      target: renderTargetForMode("preview"),
    }).context!;

    const tokens = resolveHtmlPasteSectionLabelStyleTokens(previewContext);
    const preview = renderHtmlPasteTealSectionLabelHeadingPreview(previewContext);
    const copy = renderHtmlPasteTealSectionLabelHeadingCopy({
      ...previewContext,
      mode: "copy",
      target: renderTargetForMode("copy"),
    });

    expect(tokens.sectionLabelText).toBe("SECTION 02");
    expect(tokens.accentColor).toBe("#2563eb");
    expect(preview.presentation.badgeText).toBe(tokens.sectionLabelText);
    expect(preview.typography?.accentColor).toBe(tokens.accentColor);
    expect(copy.html).toContain(tokens.sectionLabelText);
    expect(copy.html).toContain(tokens.accentColor);
  });

  it("keeps runtime boundaries after 007C merge", () => {
    const releaseRegistry = createFirstWaveRequiredVariantRegistry();
    expect(releaseRegistry.variants.map((variant) => variant.id)).not.toContain(
      S9_STORY_007B_VARIANT_ID,
    );
    expect(FIRST_WAVE_REQUIRED_VARIANT_IDS).not.toContain(S9_STORY_007B_VARIANT_ID);
    expect(RELEASE1_REQUIRED_VARIANT_IDS.length).toBe(92);
    expect(TITLE_BLOCK_SUPPORTED_VARIANT_IDS).not.toContain(S9_STORY_007B_VARIANT_ID);
    expect(variantPoolForPresetBlock("business", "heading")).not.toContain(
      S9_STORY_007B_VARIANT_ID,
    );

    const presets = buildMiaopianPresetDefinitions();
    expect(presets.find((preset) => preset.id === "business")?.defaultVariantByBlockType?.heading).toBe(
      "heading_short_line",
    );

    const pick = pickRegisteredVariantForBlock(
      releaseRegistry,
      presets.find((preset) => preset.id === "business")!,
      "heading",
      undefined,
      [],
    );
    expect(pick.variantId).not.toBe(S9_STORY_007B_VARIANT_ID);
  });
});
