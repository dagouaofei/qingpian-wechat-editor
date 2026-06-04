import { describe, expect, it } from "vitest";

import {
  buildClipboardPayload,
  collectCopySafeHtmlViolations,
} from "@/core/copy";
import { createTitleBlockRendererRegistry } from "@/core/renderer";
import {
  createRelease1FirstWavePreviewRendererRegistry,
  renderBlock,
  renderTargetForMode,
} from "@/core/renderer";
import {
  assertHeadingPublishCopyContract,
  HEADING_HIGHLIGHT_MARKER_COPY_SAFE_OPTIONS,
} from "@/core/renderer/heading-publish-decoration";
import { resolveTitleBlockTypography } from "@/core/renderer/text-style";
import {
  HEADING_PUBLISH_VARIANT_IDS,
  createFirstWaveRequiredVariantRegistry,
  resolveArticleStyle,
} from "@/core/styles";

import { createTitleHeadingArticleFixture } from "../../fixtures/renderer/title-heading-articles";

describe("heading publish pool parity", () => {
  const registry = createFirstWaveRequiredVariantRegistry();
  const previewRegistry = createRelease1FirstWavePreviewRendererRegistry();
  const copyRegistry = createTitleBlockRendererRegistry();

  for (const variantId of HEADING_PUBLISH_VARIANT_IDS) {
    it(`${variantId} preview/copy typography, copy-safe html, decoration contract`, () => {
      const article = createTitleHeadingArticleFixture({
        blockType: "heading",
        variantId,
        text: "小节标题",
        meta:
          variantId === "heading_numbered_section"
            ? { sourceIndex: 2 }
            : variantId === "heading_minimal_number"
              ? { sourceIndex: 3 }
              : variantId === "heading_card_centered"
                ? { sourceIndex: 1 }
                : undefined,
      });
      const resolvedArticle = resolveArticleStyle(article, registry);
      const block = article.blocks[0]!;
      const resolvedBlock = resolvedArticle.blocks.find(
        (entry) => entry.blockId === block.id,
      )!;

      const preview = renderBlock({
        input: {
          article,
          block,
          resolvedArticleStyle: resolvedArticle,
          mode: "preview",
          target: renderTargetForMode("preview"),
        },
        registry: previewRegistry,
      });

      const copyPayload = buildClipboardPayload({
        article,
        resolvedArticleStyle: resolvedArticle,
        registry: copyRegistry,
      });

      const typography = resolveTitleBlockTypography(resolvedBlock, "heading");
      const themeColor = resolvedBlock.tokens.theme.color?.["text.default"];

      expect(preview.ok).toBe(true);
      if (preview.ok && preview.output.kind === "title_block_preview") {
        expect(preview.output.themePalette?.textAccent).toBeTruthy();
      }
      expect(typography.fontSize).toBeTruthy();
      expect(typography.color).toBe(themeColor);
      expect(copyPayload.textHtml.length).toBeGreaterThan(0);
      expect(copyPayload.textHtml).toMatch(/font-size/i);
      expect(copyPayload.textHtml).toMatch(/font-family/i);
      if (themeColor) {
        expect(copyPayload.textHtml).toContain(themeColor);
      }
      expect(
        collectCopySafeHtmlViolations(
          copyPayload.textHtml,
          variantId === "heading_highlight_marker"
            ? HEADING_HIGHLIGHT_MARKER_COPY_SAFE_OPTIONS
            : undefined,
        ),
      ).toHaveLength(0);
      if (variantId === "heading_highlight_marker") {
        expect(copyPayload.textHtml).toMatch(/linear-gradient\s*\(\s*180deg/i);
        expect(copyPayload.textHtml).toMatch(/<h3\b/i);
        expect(copyPayload.textHtml).toMatch(/display:\s*inline/i);
      } else {
        expect(copyPayload.textHtml).not.toMatch(/linear-gradient/i);
      }

      const contractErrors = assertHeadingPublishCopyContract(
        copyPayload.textHtml,
        variantId,
      );
      expect(contractErrors, contractErrors.join("\n")).toEqual([]);
    });
  }
});
