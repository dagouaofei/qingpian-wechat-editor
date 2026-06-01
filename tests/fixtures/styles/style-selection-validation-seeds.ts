/**
 * Style Selection validation snapshot seeds — reusable by Sprint 5 / 6
 * @see docs/architecture/style-system.md §11.8.3
 */

import type { StyleSelectionValidationSnapshot } from "@/core/styles/style-selection-validation";

import {
  STYLE_SELECTION_FIXTURES,
  STYLE_SELECTION_FIXTURES_BY_ID,
  type StyleSelectionFixture,
} from "./style-selection";

export type StyleSelectionValidationSeed = {
  fixtureId: string;
  description: string;
  snapshot: StyleSelectionValidationSnapshot;
};

function fixtureToSeed(fixture: StyleSelectionFixture): StyleSelectionValidationSeed {
  return {
    fixtureId: fixture.id,
    description: fixture.description,
    snapshot: {
      inputKind: fixture.input.kind,
      expectedOk: fixture.expected.ok,
      expectedIssueCodes: fixture.expected.issueCodes,
      expectedFallbackBlockIds: fixture.expected.fallbackBlockIds,
      expectedFinalVariantIds: fixture.expected.finalVariantIds,
      expectedAssetIssueCodes: fixture.expected.assetIssueCodes,
      stages: fixture.expected.stages ?? [
        "input_schema",
        "plan_conversion",
        "preset_theme_combination",
        "block_protocol",
        "orchestrator",
        "post_orchestrator_validation",
      ],
      validationStatus: fixture.expected.validationStatus,
      mergeAllowed: fixture.expected.mergeAllowed,
    },
  };
}

export const STYLE_SELECTION_VALIDATION_SEEDS: StyleSelectionValidationSeed[] =
  STYLE_SELECTION_FIXTURES.map(fixtureToSeed);

export const STYLE_SELECTION_VALIDATION_SEEDS_BY_ID = Object.fromEntries(
  STYLE_SELECTION_VALIDATION_SEEDS.map((seed) => [seed.fixtureId, seed]),
) as Record<string, StyleSelectionValidationSeed>;

export function getStyleSelectionValidationSeed(
  fixtureId: string,
): StyleSelectionValidationSeed | undefined {
  return STYLE_SELECTION_VALIDATION_SEEDS_BY_ID[fixtureId];
}

export { STYLE_SELECTION_FIXTURES_BY_ID };
