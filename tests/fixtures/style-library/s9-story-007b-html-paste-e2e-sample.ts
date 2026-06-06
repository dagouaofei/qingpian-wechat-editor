/**
 * S9-STORY-007B E2E sample — HTML paste → Cursor apply patch → user_selectable.
 * Not S8 006D harvest seeds.
 */

import { HTML_PASTE_TEAL_SECTION_LABEL_ASSET } from "@/core/style-library/assets/html-paste-variant-assets";
import { HTML_PASTE_CANDIDATE_SOURCE_EVIDENCE_ID } from "@/core/copy/html-paste-candidate-copy";
import { HEADING_TEAL_SECTION_LABEL_HTML_PASTE_VARIANT_ID } from "@/core/styles/variants/html-paste-candidate-variants";

export const S9_STORY_007B_HTML_PASTE_E2E_SOURCE_HTML =
  `<p style="margin:0 0 6px"><span style="display:inline-block;background-color:#0d9488;color:#ffffff;font-size:11px;font-weight:700;padding:2px 10px;letter-spacing:1px">SECTION 02</span></p><h3 style="margin:0;font-size:17px;font-weight:700;color:#1f2937">运营增长指南</h3>`;

export const S9_STORY_007B_VARIANT_ID = HEADING_TEAL_SECTION_LABEL_HTML_PASTE_VARIANT_ID;

export const S9_STORY_007B_ASSET_ID = HTML_PASTE_TEAL_SECTION_LABEL_ASSET.assetId;

export const S9_STORY_007B_EVIDENCE_ID = HTML_PASTE_CANDIDATE_SOURCE_EVIDENCE_ID;

export const S9_STORY_007B_STYLE_ID = "style-teal-section-label" as const;

export const S9_STORY_007B_PALETTE_ID = "palette_teal_section_editorial" as const;

export const S9_STORY_007B_EXTRACTED_STYLE_FEATURES = [
  { key: "margin", value: "0 0 6px" },
  { key: "display", value: "inline-block" },
  { key: "backgroundColor", value: "#0d9488" },
  { key: "color", value: "#ffffff" },
  { key: "fontSize", value: "11px" },
  { key: "fontWeight", value: "700" },
  { key: "padding", value: "2px 10px" },
  { key: "letterSpacing", value: "1px" },
] as const;
