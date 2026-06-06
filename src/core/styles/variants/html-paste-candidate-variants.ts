/**
 * HTML paste candidate variants (S9-STORY-007B).
 * Applied via Cursor code-backed patch — user_selectable · not default preset · not release1_required.
 */

import { STYLE_SCHEMA_VERSION, TITLE_BLOCK_COMPONENT_ID } from "../types";
import type { VariantDefinition } from "../types";

export const HEADING_TEAL_SECTION_LABEL_HTML_PASTE_VARIANT_ID =
  "heading_teal_section_label_html_paste_candidate" as const;

export const headingTealSectionLabelHtmlPasteCandidate: VariantDefinition = {
  id: HEADING_TEAL_SECTION_LABEL_HTML_PASTE_VARIANT_ID,
  schemaVersion: STYLE_SCHEMA_VERSION,
  blockType: "heading",
  family: "htmlPasteCandidate",
  name: "heading-teal-section-label-html-paste-candidate",
  label: "Section Label Heading (HTML Paste · User Selectable)",
  description: "S9-STORY-007B HTML paste E2E · WX-HTML-PASTE-E2E-001",
  status: "experimental",
  componentProtocol: {
    componentId: TITLE_BLOCK_COMPONENT_ID,
    familyId: "htmlPasteCandidate",
    layoutMode: "pill",
  },
  compatibility: { copySafety: "strict" },
  slots: {
    title: {
      id: "title",
      role: "title",
      label: "Title",
      binding: { source: "block.content.text", required: true },
      copySafety: { copySafety: "strict", allowedInCopy: true },
    },
  },
  tokens: {
    "typography.size": "17px",
    "spacing.block": "24px",
  },
};

export const HTML_PASTE_CANDIDATE_VARIANTS = [
  headingTealSectionLabelHtmlPasteCandidate,
] as const;

export const HTML_PASTE_CANDIDATE_VARIANT_IDS = HTML_PASTE_CANDIDATE_VARIANTS.map(
  (variant) => variant.id,
);
