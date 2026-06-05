import { z } from "zod";

import { BLOCK_TYPES } from "@/core/blocks";

import {
  STYLE_LIBRARY_EVIDENCE_KINDS,
  STYLE_LIBRARY_LIFECYCLE_STATES,
  STYLE_LIBRARY_REGISTRY_PATCH_OPERATIONS,
  STYLE_LIBRARY_RULE_KINDS,
  STYLE_LIBRARY_SOURCE_TYPES,
} from "./types";
import { STYLE_LIBRARY_ID, STYLE_LIBRARY_SCHEMA_VERSION } from "./tokens";

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "updatedAt must be YYYY-MM-DD");

const assetIdSchema = z
  .string()
  .min(1)
  .regex(/^[a-z][a-z0-9_-]*$/, "assetId must be a lowercase identifier");

const distributionSchema = z
  .object({
    userSelectable: z.boolean(),
    defaultEligible: z.boolean(),
    release1Required: z.boolean(),
  })
  .strict();

const assetBaseSchema = z.object({
  assetId: assetIdSchema,
  label: z.string().min(1),
  description: z.string().min(1).optional(),
  sourceType: z.enum(STYLE_LIBRARY_SOURCE_TYPES),
  lifecycle: z.enum(STYLE_LIBRARY_LIFECYCLE_STATES),
  distribution: distributionSchema,
  updatedAt: isoDateSchema,
  tags: z.array(z.string().min(1)).optional(),
});

export const styleLibraryVariantAssetSchema = assetBaseSchema
  .extend({
    assetType: z.literal("variant"),
    runtimeVariantId: z.string().min(1),
    blockType: z.enum(BLOCK_TYPES),
    styleFamily: z.string().min(1),
    isSeedAsset: z.boolean().optional(),
    evidenceIds: z.array(z.string().min(1)).optional(),
  })
  .strict();

export const styleLibraryPaletteAssetSchema = assetBaseSchema
  .extend({
    assetType: z.literal("palette"),
    paletteId: z.string().min(1),
    tokenRefs: z.record(z.string().min(1), z.string().min(1)),
    compatibleThemeIds: z.array(z.string().min(1)).optional(),
  })
  .strict();

export const styleLibraryPresetAssetSchema = assetBaseSchema
  .extend({
    assetType: z.literal("preset"),
    presetId: z.string().min(1),
    themeId: z.string().min(1),
    notes: z.string().min(1).optional(),
  })
  .strict();

export const styleLibraryRuleAssetSchema = assetBaseSchema
  .extend({
    assetType: z.literal("rule"),
    ruleId: z.string().min(1),
    ruleKind: z.enum(STYLE_LIBRARY_RULE_KINDS),
    refPath: z.string().min(1).optional(),
  })
  .strict();

export const styleLibraryAssetSchema = z.discriminatedUnion("assetType", [
  styleLibraryVariantAssetSchema,
  styleLibraryPaletteAssetSchema,
  styleLibraryPresetAssetSchema,
  styleLibraryRuleAssetSchema,
]);

export const styleLibraryEvidenceRefSchema = z
  .object({
    evidenceId: z.string().min(1),
    kind: z.enum(STYLE_LIBRARY_EVIDENCE_KINDS),
    refPath: z.string().min(1),
    matrixRowId: z.string().min(1).optional(),
    sessionId: z.string().min(1).optional(),
  })
  .strict();

export const styleLibraryLifecycleRefSchema = z
  .object({
    refId: z.string().min(1),
    variantId: z.string().min(1),
    lifecycle: z.enum(STYLE_LIBRARY_LIFECYCLE_STATES),
    recordedAt: isoDateSchema,
  })
  .strict();

export const styleLibraryRegistryPatchSchema = z
  .object({
    patchId: z.string().min(1),
    operation: z.enum(STYLE_LIBRARY_REGISTRY_PATCH_OPERATIONS),
    variantId: z.string().min(1),
    targetPresetId: z.string().min(1).optional(),
    requiresLifecycle: z.enum(STYLE_LIBRARY_LIFECYCLE_STATES).optional(),
    requiresEvidenceIds: z.array(z.string().min(1)).optional(),
    active: z.boolean(),
    notes: z.string().min(1).optional(),
  })
  .strict();

export const styleLibraryManifestSchema = z
  .object({
    schemaVersion: z.literal(STYLE_LIBRARY_SCHEMA_VERSION),
    libraryId: z.literal(STYLE_LIBRARY_ID),
    updatedAt: isoDateSchema,
    assets: z.array(styleLibraryAssetSchema),
    seedAssetIds: z.array(assetIdSchema),
    registryPatches: z.array(styleLibraryRegistryPatchSchema),
    evidenceRefs: z.array(styleLibraryEvidenceRefSchema),
    lifecycleRefs: z.array(styleLibraryLifecycleRefSchema),
  })
  .strict();

export type StyleLibraryManifestInput = z.input<typeof styleLibraryManifestSchema>;
