/**
 * HTML paste candidate copy (S9-STORY-007B / 007C-FIX-B).
 * Dynamic section index + theme-aware accent · source HTML color is reference only.
 */

import type { HeadingBlock } from "@/core/blocks";
import {
  extractTitleBlockText,
  resolveCopySafety,
  resolveTitleBlockTypography,
} from "@/core/renderer/text-style";
import type { BlockRenderContext, TitleBlockCopyOutput } from "@/core/renderer/types";
import { resolveHtmlPasteSectionLabelStyleTokens } from "@/core/renderer/html-paste-teal-section-label-shared";
import { HEADING_TEAL_SECTION_LABEL_HTML_PASTE_VARIANT_ID } from "@/core/styles/variants/html-paste-candidate-variants";

import {
  wrapCopySafeMarginSection,
  wrapTitleHeadingElement,
} from "./copy-safe-primitives";
import { assertCopySafeHtml, escapeHtml } from "./html-escape";
import { wrapInlineElement } from "./inline-style";

export const HTML_PASTE_CANDIDATE_SOURCE_EVIDENCE_ID = "WX-HTML-PASTE-E2E-001";

export const HTML_PASTE_CANDIDATE_VARIANT_IDS = [
  HEADING_TEAL_SECTION_LABEL_HTML_PASTE_VARIANT_ID,
] as const;

export type HtmlPasteCandidateVariantId = (typeof HTML_PASTE_CANDIDATE_VARIANT_IDS)[number];

export const HTML_PASTE_CANDIDATE_METADATA = {
  variantType: "html_paste_candidate" as const,
  sourceEvidenceId: HTML_PASTE_CANDIDATE_SOURCE_EVIDENCE_ID,
  sourceMode: "pasted-html" as const,
  release1Eligible: false,
  requiresPasteQa: true,
};

export function renderHtmlPasteTealSectionLabelHeadingCopy(
  context: BlockRenderContext,
): TitleBlockCopyOutput {
  const block = context.block as HeadingBlock;
  const typography = resolveTitleBlockTypography(
    context.resolvedBlockStyle,
    "heading",
  );
  const text = extractTitleBlockText(block);
  const styleTokens = resolveHtmlPasteSectionLabelStyleTokens(context);

  const labelRow = wrapInlineElement(
    "p",
    { margin: "0 0 6px", textAlign: "left" },
    wrapInlineElement(
      "span",
      {
        display: "inline-block",
        backgroundColor: styleTokens.accentColor,
        color: styleTokens.labelTextColor,
        fontSize: "11px",
        fontWeight: "700",
        padding: "2px 10px",
        letterSpacing: "1px",
        lineHeight: "1.5",
      },
      escapeHtml(styleTokens.sectionLabelText),
    ),
  );

  const heading = wrapTitleHeadingElement(
    "heading",
    {
      margin: "0",
      fontSize: typography.fontSize ?? "17px",
      fontWeight: typography.fontWeight,
      lineHeight: typography.lineHeight,
      color: typography.color ?? "#1f2937",
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
    variantId: HEADING_TEAL_SECTION_LABEL_HTML_PASTE_VARIANT_ID,
    layoutMode: "pill",
    html,
    copySafety: resolveCopySafety(context.resolvedBlockStyle),
  };
}
