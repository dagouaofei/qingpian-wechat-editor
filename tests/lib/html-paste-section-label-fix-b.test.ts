import { describe, expect, it } from "vitest";

import { parseArticle } from "@/core/article";
import { resolveArticleStyle, createFirstWaveRequiredVariantRegistry } from "@/core/styles";
import { resolveThemePaletteTokens } from "@/core/styles/theme-palette-tokens";
import { renderHtmlPasteTealSectionLabelHeadingCopy } from "@/core/copy/html-paste-candidate-copy";
import { renderHtmlPasteTealSectionLabelHeadingPreview } from "@/core/renderer/html-paste-candidate-preview";
import {
  HTML_PASTE_SOURCE_REFERENCE_COLOR,
  resolveHtmlPasteSectionLabelStyleTokens,
  resolveUserSelectableHeadingAccentColor,
} from "@/core/renderer/html-paste-teal-section-label-shared";
import { buildBlockRenderContext } from "@/core/renderer/context";
import { renderTargetForMode } from "@/core/renderer/types";
import { createUserPreviewStyleRegistry } from "@/lib/user-preview-style-registry";
import { renderArticlePreviewClient } from "@/lib/render-article-preview-client";
import { variantPoolForPresetBlock } from "@/lib/gallery-block-variants";
import { PREVIEW_USER_SELECTABLE_HEADING_STYLE_OPTIONS } from "@/lib/preview-heading-style";
import { HTML_PASTE_TEAL_SECTION_LABEL_ASSET } from "@/core/style-library/assets/html-paste-variant-assets";
import { S9_STORY_007B_VARIANT_ID } from "../fixtures/style-library/s9-story-007b-html-paste-e2e-sample";
import { articleFixtureBase, fixtureBlockId } from "../fixtures/articles/shared";
import { styleSelectionNormalizedInput } from "../fixtures/generation/style-selection";

function articleWithThreeHeadings() {
  return parseArticle({
    ...articleFixtureBase(),
    styleAssignment: {
      themeId: "businessBlue",
      presetId: "business",
    },
    blocks: [
      { id: fixtureBlockId(21), type: "heading", content: { text: "第一节", level: 2 } },
      {
        id: fixtureBlockId(22),
        type: "paragraph",
        content: { text: [{ text: "段落" }] },
      },
      { id: fixtureBlockId(23), type: "heading", content: { text: "第二节", level: 2 } },
      { id: fixtureBlockId(24), type: "heading", content: { text: "第三节", level: 2 } },
    ],
  });
}

function renderHeadingBlockContext(
  article: ReturnType<typeof articleWithThreeHeadings>,
  blockId: string,
  themeId: "businessBlue" | "creamOrange",
) {
  const themedArticle = {
    ...article,
    styleAssignment: {
      ...article.styleAssignment,
      themeId,
      blockOverrides: [{ blockId, variantId: S9_STORY_007B_VARIANT_ID }],
    },
  };
  const registry = createUserPreviewStyleRegistry();
  const resolved = resolveArticleStyle(themedArticle, registry);
  const block = themedArticle.blocks.find((entry) => entry.id === blockId)!;
  const { context } = buildBlockRenderContext({
    article: themedArticle,
    blockId,
    resolvedArticleStyle: resolved,
    mode: "preview",
    target: renderTargetForMode("preview"),
  });
  return { context: context!, themedArticle, resolved };
}

describe("S9-STORY-007C-FIX-B dynamic section label + theme tokens", () => {
  it("numbers headings 01/02/03 consistently in preview and copy", () => {
    const article = articleWithThreeHeadings();
    const labels: string[] = [];
    const copyLabels: string[] = [];

    for (const blockId of [fixtureBlockId(21), fixtureBlockId(23), fixtureBlockId(24)]) {
      const { context } = renderHeadingBlockContext(article, blockId, "businessBlue");
      const preview = renderHtmlPasteTealSectionLabelHeadingPreview(context);
      const copy = renderHtmlPasteTealSectionLabelHeadingCopy({
        ...context,
        mode: "copy",
        target: renderTargetForMode("copy"),
      });

      expect(preview.presentation.badgeText).toMatch(/^SECTION \d{2}$/);
      labels.push(preview.presentation.badgeText ?? "");
      copyLabels.push(copy.html.match(/SECTION \d{2}/)?.[0] ?? "");
    }

    expect(labels).toEqual(["SECTION 01", "SECTION 02", "SECTION 03"]);
    expect(copyLabels).toEqual(["SECTION 01", "SECTION 02", "SECTION 03"]);
  });

  it("uses theme accent color instead of source reference #0d9488", () => {
    const article = articleWithThreeHeadings();
    const { context } = renderHeadingBlockContext(article, fixtureBlockId(21), "businessBlue");
    const tokens = resolveHtmlPasteSectionLabelStyleTokens(context);
    const themeAccent = resolveThemePaletteTokens(context.resolvedBlockStyle.tokens.theme)
      .textAccent;

    expect(tokens.accentColor).toBe(themeAccent);
    expect(tokens.accentColor).toBe("#2563eb");
    expect(tokens.accentColor).not.toBe(HTML_PASTE_SOURCE_REFERENCE_COLOR);

    const copy = renderHtmlPasteTealSectionLabelHeadingCopy({
      ...context,
      mode: "copy",
      target: renderTargetForMode("copy"),
    });
    expect(copy.html).toContain("#2563eb");
    expect(copy.html).not.toContain(HTML_PASTE_SOURCE_REFERENCE_COLOR);
  });

  it("changes section label color when preview palette changes", () => {
    const article = articleWithThreeHeadings();
    const blue = renderArticlePreviewClient(article, styleSelectionNormalizedInput, {
      articleStyle: "business",
      colorPalette: "businessBlue",
      headingVariantId: S9_STORY_007B_VARIANT_ID,
    });
    const orange = renderArticlePreviewClient(article, styleSelectionNormalizedInput, {
      articleStyle: "business",
      colorPalette: "creamOrange",
      headingVariantId: S9_STORY_007B_VARIANT_ID,
    });

    expect(blue.clipboard.textHtml).toContain("#2563eb");
    expect(orange.clipboard.textHtml).toContain("#ea580c");
    expect(blue.clipboard.textHtml).not.toContain(HTML_PASTE_SOURCE_REFERENCE_COLOR);
    expect(orange.clipboard.textHtml).not.toContain(HTML_PASTE_SOURCE_REFERENCE_COLOR);

    const blueHeading = blue.previewBlocks.find((block) => block.blockId === fixtureBlockId(21));
    const orangeHeading = orange.previewBlocks.find((block) => block.blockId === fixtureBlockId(21));
    if (
      blueHeading?.output?.kind === "title_block_preview" &&
      orangeHeading?.output?.kind === "title_block_preview"
    ) {
      expect(blueHeading.output.typography?.accentColor).toBe("#2563eb");
      expect(orangeHeading.output.typography?.accentColor).toBe("#ea580c");
    }
  });

  it("keeps default heading styles when variant is not selected", () => {
    const article = articleWithThreeHeadings();
    const rendered = renderArticlePreviewClient(article, styleSelectionNormalizedInput, {
      articleStyle: "business",
      colorPalette: "businessBlue",
      headingVariantId: "",
    });

    for (const block of rendered.previewBlocks.filter((entry) => entry.blockType === "heading")) {
      expect(block.variantId).not.toBe(S9_STORY_007B_VARIANT_ID);
    }
  });

  it("keeps gallery and style-library boundaries", () => {
    expect(variantPoolForPresetBlock("business", "heading")).not.toContain(
      S9_STORY_007B_VARIANT_ID,
    );
    expect(PREVIEW_USER_SELECTABLE_HEADING_STYLE_OPTIONS[0]?.label).toBe(
      "章节标签标题（HTML 采集 · 用户可选）",
    );
    expect(HTML_PASTE_TEAL_SECTION_LABEL_ASSET.distribution.userSelectable).toBe(true);
    expect(HTML_PASTE_TEAL_SECTION_LABEL_ASSET.distribution.defaultEligible).toBe(false);
    expect(HTML_PASTE_TEAL_SECTION_LABEL_ASSET.distribution.release1Required).toBe(false);
  });

  it("resolves accent color via shared helper from render context", () => {
    const article = articleWithThreeHeadings();
    const { context } = renderHeadingBlockContext(article, fixtureBlockId(23), "creamOrange");
    expect(resolveUserSelectableHeadingAccentColor(context)).toBe("#ea580c");
  });
});
