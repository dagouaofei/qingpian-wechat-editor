import { encodeRegistryVariantToDsl } from "@/core/dsl/encoder";
import { createFirstWaveRequiredVariantRegistry } from "@/core/styles";
import { headingTealSectionLabelHtmlPasteCandidate } from "@/core/styles/variants/html-paste-candidate-variants";
import { getUserSelectablePreviewVariantDefinition } from "@/core/style-library/user-selectable-preview-pool";
import type { VariantDefinition } from "@/core/styles/types";
import type { DslRuntimeSnapshot } from "@/lib/dsl-runtime-context-types";
import { USER_SELECTABLE_RELEASE1_HEADING_SEED_IDS } from "@/lib/runtime-variant-seed-config";

function encodeDefinitions(
  variants: VariantDefinition[],
): Record<string, unknown> {
  const definitionJsonByVariantId: Record<string, unknown> = {};
  for (const variant of variants) {
    const encoded = encodeRegistryVariantToDsl(variant);
    if (encoded.ok) {
      definitionJsonByVariantId[variant.id] = encoded.value;
    }
  }
  return definitionJsonByVariantId;
}

/** Simulates DB-available runtime pool using registry-encoded DSL definitions. */
export function buildDatabaseDslRuntimeFixture(
  extraDefinitions?: Record<string, unknown>,
): DslRuntimeSnapshot {
  const registry = createFirstWaveRequiredVariantRegistry();
  const htmlPaste =
    getUserSelectablePreviewVariantDefinition(
      headingTealSectionLabelHtmlPasteCandidate.id,
    ) ?? headingTealSectionLabelHtmlPasteCandidate;

  const definitionJsonByVariantId = {
    ...encodeDefinitions(registry.variants),
    ...encodeDefinitions([htmlPaste]),
    ...extraDefinitions,
  };

  return {
    source: "database",
    cache: { hit: false, ttlSeconds: 120, generatedAt: "2026-06-07T12:00:00.000Z" },
    definitionJsonByVariantId,
    variantIds: Object.keys(definitionJsonByVariantId),
    issues: [],
  };
}

export const USER_SELECTABLE_HEADING_IDS_FOR_TESTS = [
  ...USER_SELECTABLE_RELEASE1_HEADING_SEED_IDS,
  headingTealSectionLabelHtmlPasteCandidate.id,
] as const;
