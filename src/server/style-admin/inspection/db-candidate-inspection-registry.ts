import { parseStyleRegistry } from "@/core/styles";
import { STYLE_LIBRARY_INSPECTION_PRESET_ID } from "@/core/style-library/inspection-fixtures";
import type { VariantDefinition } from "@/core/styles/types";
import { STYLE_SCHEMA_VERSION } from "@/core/styles/types";

function buildAdminInspectionRegistry(dbVariant: VariantDefinition) {
  return {
    schemaVersion: STYLE_SCHEMA_VERSION,
    themes: [
      {
        id: "businessBlue",
        name: "Business Blue",
        schemaVersion: STYLE_SCHEMA_VERSION,
        tokens: {
          color: {
            "text.default": "#333333",
            "text.accent": "#2563eb",
          },
          fontSize: { body: "16px" },
        },
      },
    ],
    presets: [
      {
        id: STYLE_LIBRARY_INSPECTION_PRESET_ID,
        name: "Admin Candidate Inspection",
        schemaVersion: STYLE_SCHEMA_VERSION,
        themeId: "businessBlue",
        defaultVariantByBlockType: {
          heading: dbVariant.id,
          info_card: dbVariant.id,
          title: dbVariant.id,
        },
      },
    ],
    variants: [dbVariant],
  };
}

export function parseDbCandidateInspectionRegistry(dbVariant: VariantDefinition) {
  return parseStyleRegistry(buildAdminInspectionRegistry(dbVariant));
}

export { STYLE_LIBRARY_INSPECTION_PRESET_ID };
