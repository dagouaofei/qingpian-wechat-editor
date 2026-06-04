/**
 * Harvest-inspired candidate variants (test-only · S8-STORY-006C).
 * Visual intent from WX-HARVEST-EVIDENCE-001; not copied from WeChat article HTML.
 */

import type { HeadingBlock, InfoCardBlock } from "@/core/blocks";
import {
  normalizeInfoCardContentForRenderer,
  resolveInfoCardCopySafety,
  type NormalizedInfoCardContent,
} from "@/core/renderer/info-card-layout";
import type {
  BlockRenderContext,
  InfoCardCopyOutput,
  RendererIssue,
  TitleBlockCopyOutput,
} from "@/core/renderer/types";
import {
  extractTitleBlockText,
  resolveCopySafety,
  resolveTitleBlockTypography,
} from "@/core/renderer/text-style";

import {
  copySafeCardContentStyle,
  wrapCopySafeMarginSection,
  wrapTitleHeadingElement,
} from "./copy-safe-primitives";
import { assertCopySafeHtml, escapeHtml } from "./html-escape";
import { wrapInlineElement } from "./inline-style";
import { resolveThemePaletteTokens } from "@/core/styles/theme-palette-tokens";

/** @see docs/research/wechat-published-article-evidence/WX-HARVEST-EVIDENCE-001.md */
export const HARVEST_CANDIDATE_SOURCE_EVIDENCE_ID = "WX-HARVEST-EVIDENCE-001";

export const HARVEST_CANDIDATE_VARIANT_IDS = [
  "heading_purple_chapter_label_candidate",
  "info_card_reading_path_candidate",
] as const;

export type HarvestCandidateVariantId = (typeof HARVEST_CANDIDATE_VARIANT_IDS)[number];

export const HARVEST_CANDIDATE_METADATA = {
  variantType: "candidate" as const,
  sourceEvidenceId: HARVEST_CANDIDATE_SOURCE_EVIDENCE_ID,
  sourceMode: "visual-intent-only" as const,
  release1Eligible: false,
  requiresPasteQa: true,
};

const HARVEST_PURPLE = "#6c5ce7";

export function renderHarvestChapterLabelHeadingCopy(
  context: BlockRenderContext,
): TitleBlockCopyOutput {
  const block = context.block as HeadingBlock;
  const typography = resolveTitleBlockTypography(
    context.resolvedBlockStyle,
    "heading",
  );
  const text = extractTitleBlockText(block);
  const chapterLabel =
    block.meta?.label?.trim() || `CHAPTER ${String(block.meta?.sourceIndex ?? 1).padStart(2, "0")}`;

  const labelRow = wrapInlineElement(
    "p",
    { margin: "0 0 6px", textAlign: "left" },
    wrapInlineElement(
      "span",
      {
        display: "inline-block",
        backgroundColor: HARVEST_PURPLE,
        color: "#ffffff",
        fontSize: "12px",
        fontWeight: "700",
        padding: "2px 8px",
        lineHeight: "1.5",
      },
      escapeHtml(chapterLabel),
    ),
  );

  const heading = wrapTitleHeadingElement(
    "heading",
    {
      margin: "0",
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      lineHeight: typography.lineHeight,
      color: typography.color,
      ...(typography.fontFamily ? { fontFamily: typography.fontFamily } : {}),
    },
    escapeHtml(text),
  );

  const html = wrapCopySafeMarginSection("24px 0 12px", `${labelRow}${heading}`);
  assertCopySafeHtml(html);

  return {
    kind: "title_block_copy_html",
    blockId: block.id,
    blockType: "heading",
    variantId: "heading_purple_chapter_label_candidate",
    layoutMode: "pill",
    html,
    copySafety: resolveCopySafety(context.resolvedBlockStyle),
  };
}

export function renderHarvestReadingPathInfoCardCopy(
  context: BlockRenderContext,
  normalizedContent?: NormalizedInfoCardContent,
): { output: InfoCardCopyOutput; warnings: RendererIssue[] } {
  const block = context.block as InfoCardBlock;
  const normalized =
    normalizedContent == null
      ? normalizeInfoCardContentForRenderer(
          block,
          "info_card_reading_path_candidate",
        )
      : { content: normalizedContent, issues: [] };

  if (normalized.content == null) {
    throw new Error("info_card reading path candidate requires normalized content");
  }

  const body = normalized.content.body.replace(/\n/g, " / ");
  const inner =
    wrapInlineElement(
      "strong",
      { color: HARVEST_PURPLE },
      escapeHtml(normalized.content.title ?? "阅读路径："),
    ) +
    " " +
    escapeHtml(body);

  const html = wrapCopySafeMarginSection(
    "16px 0",
    wrapInlineElement(
      "p",
      copySafeCardContentStyle(
        {
          color: "#333333",
          fontSize: "16px",
          lineHeight: "1.8",
        },
        {
          backgroundColor: "#f7f5ff",
          border: "1px solid #d8d2ff",
          padding: "12px 14px",
        },
      ),
      inner,
    ),
  );

  assertCopySafeHtml(html);

  return {
    output: {
      kind: "info_card_copy_html",
      blockId: block.id,
      blockType: "info_card",
      variantId: "info_card_reading_path_candidate",
      layout: "key_takeaway",
      html,
      copySafety: resolveInfoCardCopySafety(context.resolvedBlockStyle),
    },
    warnings: normalized.issues,
  };
}
