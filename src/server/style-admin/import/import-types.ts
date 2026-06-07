import type {
  BlockType,
  CopySafetyTier,
  StyleVariantLifecycle,
  StyleVariantQualityStatus,
  StyleVariantSourceType,
} from "@prisma/client";

import type { DistributionSnapshot, JsonValue } from "../types";

export type CollectedVariantSource =
  | "style_registry"
  | "style_library_manifest"
  | "harvest_candidate"
  | "html_paste_candidate"
  | "deprecated_catalog";

export type CollectedStyleVariant = {
  runtimeVariantId: string;
  blockType: BlockType;
  styleFamily: string;
  label: string;
  description?: string;
  lifecycle: StyleVariantLifecycle;
  distribution: DistributionSnapshot;
  definitionJson: JsonValue;
  componentProtocolJson?: JsonValue;
  compatibilityJson?: JsonValue;
  copySafety: CopySafetyTier;
  sourceChecksum: string;
  sourceType: StyleVariantSourceType;
  sourceCohort?: string;
  sourceRef: string;
  sourceMetadata?: JsonValue;
  qualityStatus: StyleVariantQualityStatus;
  collectedFrom: CollectedVariantSource;
  registryStatus?: string;
  styleLibraryAssetId?: string;
  evidenceIds?: string[];
  tags?: string[];
  isHistoricalFirstWave33?: boolean;
  isDeprecatedCatalogStub?: boolean;
  warnings?: string[];
};

export type ImportExistingVariantsOptions = {
  actor?: string;
  dryRun?: boolean;
};

export type ImportExistingVariantsReport = {
  generatedAt: string;
  dryRun: boolean;
  totalCollected: number;
  totalImported: number;
  totalUpdated: number;
  totalSkippedUnchanged: number;
  totalCreatedVersions: number;
  byBlockType: Record<string, number>;
  byLifecycle: Record<string, number>;
  byDistribution: {
    userSelectable: number;
    defaultEligible: number;
    release1Required: number;
    hidden: number;
    deprecated: number;
  };
  bySourceType: Record<string, number>;
  legacySourceTypeCount: number;
  byQualityStatus: Record<string, number>;
  missingCompatibility: string[];
  missingComponentProtocol: string[];
  deprecatedImported: string[];
  userSelectableImported: string[];
  release1RequiredImported: string[];
  candidateImported: string[];
  historicalFirstWave33Imported: string[];
  warnings: string[];
  errors: string[];
};
