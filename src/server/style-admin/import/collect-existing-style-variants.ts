import {
  CTA_FIRST_WAVE_VARIANTS,
  DIVIDER_FIRST_WAVE_VARIANTS,
  HIGHLIGHT_FIRST_WAVE_VARIANTS,
  IMAGE_PLACEHOLDER_FIRST_WAVE_VARIANTS,
  INFO_CARD_FIRST_WAVE_VARIANTS,
  LEAD_FIRST_WAVE_VARIANTS,
  LIST_FIRST_WAVE_VARIANTS,
  PARAGRAPH_FIRST_WAVE_VARIANTS,
  QUOTE_FIRST_WAVE_VARIANTS,
  TITLE_FIRST_WAVE_VARIANTS,
  createFirstWaveRequiredVariantRegistry,
} from "@/core/styles";
import { HARVEST_CANDIDATE_VARIANTS } from "@/core/styles/variants/harvest-candidate-variants";
import { HTML_PASTE_CANDIDATE_VARIANTS } from "@/core/styles/variants/html-paste-candidate-variants";
import { STYLE_SCHEMA_VERSION, TITLE_BLOCK_COMPONENT_ID } from "@/core/styles/types";
import type { VariantDefinition } from "@/core/styles/types";
import { getStyleLibraryVariantAssets } from "@/core/style-library/validation";
import { STYLE_LIBRARY_MANIFEST } from "@/core/style-library/manifest";

import type { CollectedStyleVariant } from "./import-types";
import {
  DEPRECATED_HEADING_RUNTIME_VARIANT_IDS,
  HISTORICAL_FIRST_WAVE_33_HEADING_IDS,
  mapDeprecatedHeadingDistribution,
  mapDeprecatedHeadingLifecycle,
  resolveRegistrySourceCohort,
} from "./lifecycle-distribution-mapper";
import { mapVariantDefinitionToCollected } from "./map-style-registry-variant-to-db";

export const HISTORICAL_FIRST_WAVE_33_RUNTIME_IDS = [
  ...TITLE_FIRST_WAVE_VARIANTS.map((variant) => variant.id),
  ...HISTORICAL_FIRST_WAVE_33_HEADING_IDS,
  ...LEAD_FIRST_WAVE_VARIANTS.map((variant) => variant.id),
  ...PARAGRAPH_FIRST_WAVE_VARIANTS.map((variant) => variant.id),
  ...DIVIDER_FIRST_WAVE_VARIANTS.map((variant) => variant.id),
  ...LIST_FIRST_WAVE_VARIANTS.map((variant) => variant.id),
  ...QUOTE_FIRST_WAVE_VARIANTS.map((variant) => variant.id),
  ...HIGHLIGHT_FIRST_WAVE_VARIANTS.map((variant) => variant.id),
  ...INFO_CARD_FIRST_WAVE_VARIANTS.map((variant) => variant.id),
  ...CTA_FIRST_WAVE_VARIANTS.map((variant) => variant.id),
  ...IMAGE_PLACEHOLDER_FIRST_WAVE_VARIANTS.map((variant) => variant.id),
] as const;

const HISTORICAL_FIRST_WAVE_33_SET = new Set<string>(
  HISTORICAL_FIRST_WAVE_33_RUNTIME_IDS,
);

function createDeprecatedHeadingStub(runtimeVariantId: string): VariantDefinition {
  return {
    id: runtimeVariantId,
    schemaVersion: STYLE_SCHEMA_VERSION,
    blockType: "heading",
    family: "deprecatedCatalog",
    name: runtimeVariantId,
    label: `Deprecated heading (${runtimeVariantId})`,
    description:
      "S7-STORY-008 DECISION-087 deprecated heading ID · catalog stub for governance import",
    status: "experimental",
    componentProtocol: {
      componentId: TITLE_BLOCK_COMPONENT_ID,
      familyId: "deprecatedCatalog",
      layoutMode: "plain",
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
  };
}

export type CollectExistingStyleVariantsResult = {
  variants: CollectedStyleVariant[];
  sources: {
    registryRelease1Required: number;
    harvestCandidates: number;
    htmlPasteCandidates: number;
    deprecatedCatalogStubs: number;
    styleLibraryManifestAssets: number;
  };
  historicalFirstWave33Count: number;
  release1RequiredCount: number;
};

export function collectExistingStyleVariants(): CollectExistingStyleVariantsResult {
  const registry = createFirstWaveRequiredVariantRegistry();
  const manifestAssets = getStyleLibraryVariantAssets(STYLE_LIBRARY_MANIFEST);
  const manifestByRuntimeId = new Map(
    manifestAssets.map((asset) => [asset.runtimeVariantId, asset]),
  );

  const byRuntimeId = new Map<string, CollectedStyleVariant>();

  for (const variant of registry.variants) {
    const asset = manifestByRuntimeId.get(variant.id);
    const collected = mapVariantDefinitionToCollected({
      variant,
      collectedFrom: asset ? "style_library_manifest" : "style_registry",
      sourceType: "registry",
      sourceCohort: resolveRegistrySourceCohort(
        variant,
        HISTORICAL_FIRST_WAVE_33_SET.has(variant.id),
      ),
      sourceRef: asset?.assetId ?? `registry:${variant.id}`,
      styleLibraryAsset: asset,
      isHistoricalFirstWave33: HISTORICAL_FIRST_WAVE_33_SET.has(variant.id),
    });
    byRuntimeId.set(collected.runtimeVariantId, collected);
  }

  for (const variant of HARVEST_CANDIDATE_VARIANTS) {
    if (byRuntimeId.has(variant.id)) {
      continue;
    }
    const asset = manifestByRuntimeId.get(variant.id);
    const collected = mapVariantDefinitionToCollected({
      variant,
      collectedFrom: "harvest_candidate",
      sourceType: "harvest",
      sourceCohort: "s8_harvest_seed",
      sourceRef: asset?.assetId ?? `harvest:${variant.id}`,
      styleLibraryAsset: asset,
      lifecycleOverride: asset?.lifecycle,
      distributionOverride: asset
        ? undefined
        : {
            userSelectable: false,
            defaultEligible: false,
            release1Required: false,
            hidden: false,
            deprecated: false,
            cacheVersion: 0,
          },
    });
    byRuntimeId.set(collected.runtimeVariantId, collected);
  }

  for (const variant of HTML_PASTE_CANDIDATE_VARIANTS) {
    const asset = manifestByRuntimeId.get(variant.id);
    const collected = mapVariantDefinitionToCollected({
      variant,
      collectedFrom: "html_paste_candidate",
      sourceType: "html_paste",
      sourceCohort: "s9_html_paste",
      sourceRef: asset?.assetId ?? `html_paste:${variant.id}`,
      styleLibraryAsset: asset,
    });
    byRuntimeId.set(collected.runtimeVariantId, collected);
  }

  for (const runtimeVariantId of DEPRECATED_HEADING_RUNTIME_VARIANT_IDS) {
    if (byRuntimeId.has(runtimeVariantId)) {
      continue;
    }
    const stub = createDeprecatedHeadingStub(runtimeVariantId);
    const collected = mapVariantDefinitionToCollected({
      variant: stub,
      collectedFrom: "deprecated_catalog",
      sourceType: "unknown",
      sourceCohort: "legacy_deprecated",
      sourceRef: `deprecated-catalog:${runtimeVariantId}`,
      lifecycleOverride: mapDeprecatedHeadingLifecycle(),
      distributionOverride: mapDeprecatedHeadingDistribution(),
      isDeprecatedCatalogStub: true,
      warnings: [`deprecated_catalog_stub:${runtimeVariantId}`],
    });
    byRuntimeId.set(collected.runtimeVariantId, collected);
  }

  const variants = [...byRuntimeId.values()].sort((a, b) =>
    a.runtimeVariantId.localeCompare(b.runtimeVariantId),
  );

  return {
    variants,
    sources: {
      registryRelease1Required: registry.variants.length,
      harvestCandidates: HARVEST_CANDIDATE_VARIANTS.length,
      htmlPasteCandidates: HTML_PASTE_CANDIDATE_VARIANTS.length,
      deprecatedCatalogStubs: DEPRECATED_HEADING_RUNTIME_VARIANT_IDS.length,
      styleLibraryManifestAssets: manifestAssets.length,
    },
    historicalFirstWave33Count: variants.filter(
      (variant) => variant.isHistoricalFirstWave33,
    ).length,
    release1RequiredCount: variants.filter(
      (variant) => variant.registryStatus === "release1_required",
    ).length,
  };
}
