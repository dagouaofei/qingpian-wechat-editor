import type { StyleVariantSourceType } from "@prisma/client";

import { encodeRegistryVariantToDsl } from "@/core/dsl/encoder";
import { VARIANT_DSL_VERSION } from "@/core/dsl/runtime";
import type { StyleLibraryVariantAsset } from "@/core/style-library/types";
import type { VariantDefinition } from "@/core/styles/types";

import type { DistributionSnapshot, JsonValue } from "../types";
import { stableJsonChecksum } from "./checksum";
import type { CollectedStyleVariant, CollectedVariantSource } from "./import-types";
import {
  mapCopySafetyTier,
  mapRegistryStatusToDistribution,
  mapStyleLibraryAssetToDistribution,
  mapStyleLibraryAssetToLifecycle,
  mapVariantStatusToLifecycle,
  mergeDistribution,
  resolveImportSeedFields,
} from "./lifecycle-distribution-mapper";

export type MapVariantToDbInput = {
  variant: VariantDefinition;
  collectedFrom: CollectedVariantSource;
  sourceType: StyleVariantSourceType;
  sourceCohort?: string;
  sourceRef: string;
  styleLibraryAsset?: StyleLibraryVariantAsset;
  lifecycleOverride?: CollectedStyleVariant["lifecycle"];
  distributionOverride?: Partial<DistributionSnapshot>;
  isHistoricalFirstWave33?: boolean;
  isDeprecatedCatalogStub?: boolean;
  warnings?: string[];
};

export function mapVariantDefinitionToCollected(
  input: MapVariantToDbInput,
): CollectedStyleVariant {
  const { variant, styleLibraryAsset } = input;
  const encoded = encodeRegistryVariantToDsl(variant);
  const definitionPayload = encoded.ok
    ? encoded.value
    : {
        id: variant.id,
        schemaVersion: variant.schemaVersion,
        blockType: variant.blockType,
        family: variant.family,
        name: variant.name,
        label: variant.label,
        description: variant.description,
        status: variant.status,
        slots: variant.slots,
        tokens: variant.tokens,
      };

  const componentProtocolJson = {
    ...(variant.componentProtocol ?? {}),
    dslVersion: encoded.ok ? VARIANT_DSL_VERSION : undefined,
  };
  const compatibilityJson = {
    ...(variant.compatibility ?? {}),
    dslVersion: encoded.ok ? VARIANT_DSL_VERSION : undefined,
    dslEncoderIssues: encoded.ok ? encoded.issues : undefined,
  };

  const lifecycle =
    input.lifecycleOverride ??
    (styleLibraryAsset
      ? mapStyleLibraryAssetToLifecycle(styleLibraryAsset)
      : mapVariantStatusToLifecycle(variant.status));

  const baseDistribution = styleLibraryAsset
    ? mapStyleLibraryAssetToDistribution(styleLibraryAsset)
    : mapRegistryStatusToDistribution(variant.status);

  const seedFields = resolveImportSeedFields(variant.id);
  const distribution = mergeDistribution(
    mergeDistribution(baseDistribution, seedFields.distribution),
    input.distributionOverride,
  );
  const qualityStatus = seedFields.qualityStatus ?? "not_checked";

  const warnings = [...(input.warnings ?? [])];
  if (!encoded.ok) {
    warnings.push(`dsl_encode_failed:${variant.id}`);
  } else if (encoded.issues.length > 0) {
    warnings.push(`dsl_encode_warnings:${variant.id}:${encoded.issues.length}`);
  }
  if (!variant.compatibility) {
    warnings.push(`missing_compatibility:${variant.id}`);
  }
  if (!variant.componentProtocol) {
    warnings.push(`missing_component_protocol:${variant.id}`);
  }
  if (distribution.userSelectable && distribution.defaultEligible) {
    warnings.push(
      `userSelectable_with_defaultEligible:${variant.id}:allowed_when_explicit`,
    );
  }
  if (distribution.release1Required && distribution.userSelectable) {
    warnings.push(
      `release1Required_with_userSelectable:${variant.id}:release1Required_does_not_imply_userSelectable`,
    );
  }

  return {
    runtimeVariantId: variant.id,
    blockType: variant.blockType,
    styleFamily: variant.family,
    label: variant.label,
    description: variant.description,
    lifecycle,
    distribution,
    definitionJson: definitionPayload as JsonValue,
    componentProtocolJson,
    compatibilityJson,
    copySafety: mapCopySafetyTier(variant.compatibility?.copySafety),
    sourceChecksum: stableJsonChecksum({
      definition: definitionPayload,
      componentProtocol: componentProtocolJson,
      compatibility: compatibilityJson,
    }),
    sourceType: input.sourceType,
    sourceCohort: input.sourceCohort ?? seedFields.sourceCohort,
    sourceRef: input.sourceRef,
    sourceMetadata: {
      collectedFrom: input.collectedFrom,
      registryStatus: variant.status,
      governanceSource: styleLibraryAsset ? "style_library_manifest" : undefined,
      styleLibraryAssetId: styleLibraryAsset?.assetId,
      evidenceIds: styleLibraryAsset?.evidenceIds,
      tags: styleLibraryAsset?.tags,
    },
    qualityStatus,
    collectedFrom: input.collectedFrom,
    registryStatus: variant.status,
    styleLibraryAssetId: styleLibraryAsset?.assetId,
    evidenceIds: styleLibraryAsset?.evidenceIds,
    tags: styleLibraryAsset?.tags,
    isHistoricalFirstWave33: input.isHistoricalFirstWave33,
    isDeprecatedCatalogStub: input.isDeprecatedCatalogStub,
    warnings,
  };
}
