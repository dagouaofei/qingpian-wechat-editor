import { parseArticle } from "@/core/article";
import type { Article } from "@/core/article";
import type { BlockType } from "@/core/blocks";
import {
  INFO_CARD_FIRST_WAVE_VARIANTS,
  STYLE_SCHEMA_VERSION,
  TITLE_BLOCK_FIRST_WAVE_VARIANTS,
  type StyleRegistry,
} from "@/core/styles";
import { HARVEST_CANDIDATE_VARIANTS } from "@/core/styles/variants/harvest-candidate-variants";

import type { StyleLibraryVariantAsset } from "./types";

export const STYLE_LIBRARY_INSPECTION_PRESET_ID = "style_library_inspection_v0";
export const STYLE_LIBRARY_INSPECTION_CONTEXT = "style-library-inspection" as const;

const INSPECTION_BLOCK_ID = "11111111-1111-4111-8111-000000000901";
const INSPECTION_ARTICLE_ID = "22222222-2222-4222-8222-222222229006";
const INSPECTION_ISO = "2026-06-05T00:00:00.000Z";

export type StyleLibraryInspectionFixture = {
  fixtureId: string;
  fixtureLabel: string;
  fixtureText: string;
};

const HEADING_FIXTURE: StyleLibraryInspectionFixture = {
  fixtureId: "style-library-inspection-heading-purple-chapter-label",
  fixtureLabel: "章节标签 + 标题（运营检查样本）",
  fixtureText: "章节 · heading_purple_chapter_label_candidate",
};

const INFO_CARD_FIXTURE: StyleLibraryInspectionFixture = {
  fixtureId: "style-library-inspection-info-card-reading-path",
  fixtureLabel: "阅读路径信息块（运营检查样本）",
  fixtureText: "阅读路径：要点一 / 要点二 / 要点三",
};

export function getStyleLibraryInspectionFixture(
  asset: StyleLibraryVariantAsset,
): StyleLibraryInspectionFixture {
  if (asset.runtimeVariantId === "heading_purple_chapter_label_candidate") {
    return HEADING_FIXTURE;
  }
  if (asset.runtimeVariantId === "info_card_reading_path_candidate") {
    return INFO_CARD_FIXTURE;
  }

  return {
    fixtureId: `style-library-inspection-${asset.assetId}`,
    fixtureLabel: asset.label,
    fixtureText: `${asset.blockType} · ${asset.runtimeVariantId}`,
  };
}

function blockContentForInspection(
  blockType: BlockType,
  variantId: string,
  fixture: StyleLibraryInspectionFixture,
): Record<string, unknown> {
  switch (blockType) {
    case "heading":
      return {
        text: fixture.fixtureText,
        level: 2,
      };
    case "info_card":
      return variantId === "info_card_reading_path_candidate"
        ? {
            title: "阅读路径：",
            body: "要点一 / 要点二 / 要点三",
          }
        : {
            title: fixture.fixtureLabel,
            body: fixture.fixtureText,
          };
    default:
      return { text: fixture.fixtureText };
  }
}

export function createCandidatePreviewFixture(
  asset: StyleLibraryVariantAsset,
): Article {
  const fixture = getStyleLibraryInspectionFixture(asset);
  const block = {
    id: INSPECTION_BLOCK_ID,
    type: asset.blockType,
    content: blockContentForInspection(
      asset.blockType,
      asset.runtimeVariantId,
      fixture,
    ),
    ...(asset.blockType === "heading" &&
    asset.runtimeVariantId === "heading_purple_chapter_label_candidate"
      ? {
          meta: { sourceIndex: 1, label: "CHAPTER 01" },
        }
      : {}),
  };

  return parseArticle({
    id: INSPECTION_ARTICLE_ID,
    version: 1,
    metadata: {
      title: `Style Library Inspection · ${asset.assetId}`,
      createdAt: INSPECTION_ISO,
      updatedAt: INSPECTION_ISO,
      locale: "zh-CN",
    },
    input: {
      type: "fixture",
      raw: `style-library-inspection:${asset.assetId}`,
      capturedAt: INSPECTION_ISO,
    },
    styleAssignment: {
      themeId: "businessBlue",
      presetId: STYLE_LIBRARY_INSPECTION_PRESET_ID,
      blockOverrides: [{ blockId: INSPECTION_BLOCK_ID, variantId: asset.runtimeVariantId }],
    },
    blocks: [block],
  });
}

/**
 * Inspection-only style registry — includes harvest candidates for workbench checks.
 * Not used by Gallery, Preview page, or createFirstWaveRequiredVariantRegistry().
 */
export function createStyleLibraryInspectionStyleRegistry(): StyleRegistry {
  return {
    schemaVersion: STYLE_SCHEMA_VERSION,
    themes: [
      {
        id: "businessBlue",
        name: "商务蓝",
        schemaVersion: STYLE_SCHEMA_VERSION,
        tokens: {
          color: { "text.default": "#333333", "brand.primary": "#576b95" },
          fontSize: { body: "16px" },
        },
      },
    ],
    presets: [
      {
        id: STYLE_LIBRARY_INSPECTION_PRESET_ID,
        name: "Style Library Inspection (admin-only)",
        schemaVersion: STYLE_SCHEMA_VERSION,
        themeId: "businessBlue",
        defaultVariantByBlockType: {
          title: "title_plain_minimal",
          heading: "heading_short_line",
          info_card: "info_card_key_takeaway",
        },
      },
    ],
    variants: [
      ...TITLE_BLOCK_FIRST_WAVE_VARIANTS,
      ...INFO_CARD_FIRST_WAVE_VARIANTS,
      ...HARVEST_CANDIDATE_VARIANTS,
    ],
  };
}
