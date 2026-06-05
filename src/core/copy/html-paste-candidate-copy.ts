/**
 * HTML paste candidate copy (S9-STORY-007B).
 * Visual intent from pasted WeChat-safe HTML · WX-HTML-PASTE-E2E-001.
 */

import type { HeadingBlock } from "@/core/blocks";
import {
  extractTitleBlockText,
  resolveCopySafety,
  resolveTitleBlockTypography,
} from "@/core/renderer/text-style";
import type { BlockRenderContext, TitleBlockCopyOutput } from "@/core/renderer/types";

import {
  wrapCopySafeMarginSection,
  wrapTitleHeadingElement,
} from "./copy-safe-primitives";
import { assertCopySafeHtml, escapeHtml } from "./html-escape";
import { wrapInlineElement } from "./inline-style";
import { HEADING_TEAL_SECTION_LABEL_HTML_PASTE_VARIANT_ID } from "@/core/styles/variants/html-paste-candidate-variants";

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

const TEAL_SECTION = "#0d9488";

export function renderHtmlPasteTealSectionLabelHeadingCopy(
  context: BlockRenderContext,
): TitleBlockCopyOutput {
  const block = context.block as HeadingBlock;
  const typography = resolveTitleBlockTypography(
    context.resolvedBlockStyle,
    "heading",
  );
  const text = extractTitleBlockText(block);
  const sectionLabel =
    block.meta?.label?.trim() ||
    `SECTION ${String(block.meta?.sourceIndex ?? 2).padStart(2, "0")}`;

  const labelRow = wrapInlineElement(
    "p",
    { margin: "0 0 6px", textAlign: "left" },
    wrapInlineElement(
      "span",
      {
        display: "inline-block",
        backgroundColor: TEAL_SECTION,
        color: "#ffffff",
        fontSize: "11px",
        fontWeight: "700",
        padding: "2px 10px",
        letterSpacing: "1px",
        lineHeight: "1.5",
      },
      escapeHtml(sectionLabel),
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
