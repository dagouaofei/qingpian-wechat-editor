import { z } from "zod";

import { articleIdSchema } from "@/core/article/article.schema";
import { blockIdSchema, blockTypeSchema } from "@/core/blocks/block.schema";

import {
  densitySchema,
  styleValidationIssueSchema,
} from "./schemas";
import {
  DECORATION_DENSITIES,
  STYLE_ASSIGNMENT_SOURCES,
  STYLE_ASSIGNMENT_VALIDATION_STATUSES,
} from "./style-assignment";
import type {
  ArticleStylePlan,
  StyleAssignmentPatch,
  StyleSelectionRequest,
} from "./style-assignment";

const HTML_PATTERN = /<[^>]*>|&lt;|&gt;|<script\b/i;
const INLINE_STYLE_INJECTION_PATTERN =
  /\b(style|class|className)\s*=|!important\b|url\s*\(/i;
const CSS_SELECTOR_PATTERN = /^\.[a-zA-Z]|^\[|\{[^}]*\}/;

const FORBIDDEN_RECORD_KEYS = new Set(["html", "css", "className", "style"]);

const identifierSchema = z
  .string()
  .min(1)
  .refine((value) => !HTML_PATTERN.test(value), {
    message: "must not contain HTML",
  });

const safeStyleStringSchema = z
  .string()
  .min(1)
  .refine((value) => !HTML_PATTERN.test(value), {
    message: "must not contain HTML",
  })
  .refine((value) => !INLINE_STYLE_INJECTION_PATTERN.test(value), {
    message: "must not contain inline style or class attributes",
  })
  .refine((value) => !CSS_SELECTOR_PATTERN.test(value), {
    message: "must not contain CSS selector or rule syntax",
  });

const slotOverrideValueSchema = z.union([
  safeStyleStringSchema,
  z.number(),
  z.boolean(),
]);

function addForbiddenRecordKeyIssues(
  record: Record<string, unknown>,
  path: (string | number)[],
  ctx: z.RefinementCtx,
): void {
  for (const key of Object.keys(record)) {
    if (FORBIDDEN_RECORD_KEYS.has(key)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `forbidden field "${key}" is not allowed in style assignment contract`,
        path: [...path, key],
      });
    }
  }
}

const slotOverridesRecordSchema = z
  .record(z.string(), slotOverrideValueSchema)
  .superRefine((record, ctx) => {
    addForbiddenRecordKeyIssues(record, [], ctx);
  });

const assetBindingsRecordSchema = z
  .record(identifierSchema, identifierSchema)
  .superRefine((record, ctx) => {
    addForbiddenRecordKeyIssues(record, [], ctx);
  });

export const styleAssignmentSourceSchema = z.enum(STYLE_ASSIGNMENT_SOURCES);

export const styleAssignmentValidationStatusSchema = z.enum(
  STYLE_ASSIGNMENT_VALIDATION_STATUSES,
);

export const decorationDensitySchema = z.enum(DECORATION_DENSITIES);

export const styleAssignmentValidationMetaSchema = z
  .object({
    source: styleAssignmentSourceSchema,
    validationStatus: styleAssignmentValidationStatusSchema.optional(),
    modelId: identifierSchema.optional(),
    generatedAt: safeStyleStringSchema.optional(),
    issues: z.array(styleValidationIssueSchema).optional(),
  })
  .strict();

export const styleSelectionArticleContextSchema = z
  .object({
    blockCount: z.number().int().nonnegative().optional(),
    headingCount: z.number().int().nonnegative().optional(),
    densityHint: z.union([densitySchema, decorationDensitySchema]).optional(),
  })
  .strict();

export const styleSelectionBlockStyleHintSchema = z
  .object({
    blockId: blockIdSchema,
    blockType: blockTypeSchema,
    suggestedFamilyId: identifierSchema.optional(),
    suggestedVariantId: identifierSchema.optional(),
    suggestedSlotOverrides: slotOverridesRecordSchema.optional(),
    suggestedAssetIds: z.array(identifierSchema).optional(),
    reason: safeStyleStringSchema.optional(),
  })
  .strict();

export const styleSelectionConstraintsSchema = z
  .object({
    mustUseRegisteredVariants: z.literal(true),
    mustUseRegisteredAssets: z.literal(true),
    mustPassWeChatCompatibility: z.literal(true),
    maxDecorationDensity: decorationDensitySchema.optional(),
  })
  .strict();

export const styleSelectionRequestSchema = z
  .object({
    articleId: articleIdSchema,
    articleContext: styleSelectionArticleContextSchema.optional(),
    preferredPresetId: identifierSchema.optional(),
    blockStyleHints: z.array(styleSelectionBlockStyleHintSchema),
    constraints: styleSelectionConstraintsSchema,
    meta: styleAssignmentValidationMetaSchema.optional(),
  })
  .strict();

export const styleAssignmentPatchBlockOverrideSchema = z
  .object({
    blockId: blockIdSchema,
    variantId: identifierSchema.optional(),
    familyId: identifierSchema.optional(),
    slotOverrides: slotOverridesRecordSchema.optional(),
    assetBindings: assetBindingsRecordSchema.optional(),
    density: densitySchema.optional(),
  })
  .strict();

export const styleAssignmentPatchSchema = z
  .object({
    presetId: identifierSchema.optional(),
    themeId: identifierSchema.optional(),
    blockOverrides: z.array(styleAssignmentPatchBlockOverrideSchema).optional(),
    meta: styleAssignmentValidationMetaSchema,
  })
  .strict();

export const articleStylePlanOrchestratorHintsSchema = z
  .object({
    dedupeAdjacentHeadings: z.boolean().optional(),
    maxAssetReuse: z.number().int().positive().optional(),
    avoidTitleFirstHeadingSameFamilyVariant: z.boolean().optional(),
    notes: z.array(safeStyleStringSchema).optional(),
  })
  .strict();

export const blockStyleOverridePlanSchema = z
  .object({
    blockId: blockIdSchema,
    variantId: identifierSchema.optional(),
    slotOverrides: slotOverridesRecordSchema.optional(),
  })
  .strict();

export const articleStylePlanSchema = z
  .object({
    articleId: articleIdSchema,
    presetId: identifierSchema,
    themeId: identifierSchema,
    density: densitySchema.optional(),
    blockOverrides: z.array(blockStyleOverridePlanSchema).optional(),
    orchestratorHints: articleStylePlanOrchestratorHintsSchema.optional(),
    meta: styleAssignmentValidationMetaSchema.optional(),
  })
  .strict();

export type StyleSelectionRequestInput = z.input<typeof styleSelectionRequestSchema>;
export type StyleAssignmentPatchInput = z.input<typeof styleAssignmentPatchSchema>;
export type ArticleStylePlanInput = z.input<typeof articleStylePlanSchema>;

export function parseStyleSelectionRequest(input: unknown): StyleSelectionRequest {
  return styleSelectionRequestSchema.parse(input);
}

export function parseStyleAssignmentPatch(input: unknown): StyleAssignmentPatch {
  return styleAssignmentPatchSchema.parse(input);
}

export function parseArticleStylePlan(input: unknown): ArticleStylePlan {
  return articleStylePlanSchema.parse(input);
}

export function safeParseStyleSelectionRequest(input: unknown) {
  return styleSelectionRequestSchema.safeParse(input);
}

export function safeParseStyleAssignmentPatch(input: unknown) {
  return styleAssignmentPatchSchema.safeParse(input);
}

export function safeParseArticleStylePlan(input: unknown) {
  return articleStylePlanSchema.safeParse(input);
}
