import type { StyleLibraryVariantAsset } from "../types";
import { HEADING_TEAL_SECTION_LABEL_HTML_PASTE_VARIANT_ID } from "@/core/styles/variants/html-paste-candidate-variants";

export const HTML_PASTE_TEAL_SECTION_LABEL_ASSET_ID =
  "variant-html-paste-teal-section-label" as const;

export const HTML_PASTE_TEAL_SECTION_LABEL_ASSET: StyleLibraryVariantAsset = {
  assetId: HTML_PASTE_TEAL_SECTION_LABEL_ASSET_ID,
  assetType: "variant",
  label: "章节标签标题（HTML 采集 · 用户可选）",
  description:
    "S9-STORY-007B Cursor-applied HTML paste candidate · user_selectable · not default preset",
  sourceType: "code",
  lifecycle: "user_selectable",
  distribution: {
    userSelectable: true,
    defaultEligible: false,
    release1Required: false,
  },
  updatedAt: "2026-06-05",
  runtimeVariantId: HEADING_TEAL_SECTION_LABEL_HTML_PASTE_VARIANT_ID,
  blockType: "heading",
  styleFamily: "htmlPasteCandidate",
  isSeedAsset: false,
  evidenceIds: [
    "WX-HTML-PASTE-E2E-001",
    "PASTE-QA-E2E-007B",
    "S9M-HTML-PASTE-001",
  ],
  tags: ["html-paste", "007b", "user-selectable"],
};

export const STYLE_LIBRARY_HTML_PASTE_VARIANT_ASSETS = [
  HTML_PASTE_TEAL_SECTION_LABEL_ASSET,
] as const;

export const STYLE_LIBRARY_HTML_PASTE_RUNTIME_VARIANT_IDS =
  STYLE_LIBRARY_HTML_PASTE_VARIANT_ASSETS.map((asset) => asset.runtimeVariantId);
