import { z } from "zod";

import { blockIdSchema, blockSchema } from "@/core/blocks/block.schema";

import { plainTextSchema } from "./inline-content.schema";
import type {
  Article,
  ArticleMetadata,
  GenerationMeta,
  InputSource,
  StyleAssignment,
} from "./article.types";

const iso8601DateTimeSchema = z
  .string()
  .min(1)
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "must be a valid ISO 8601 datetime string",
  });

const identifierSchema = z
  .string()
  .min(1)
  .refine((value) => !/<[^>]*>/.test(value), {
    message: "must not contain HTML",
  });

export const articleIdSchema = z.string().uuid();

export const articleVersionSchema = z.literal(1);

export const inputSourceTypeSchema = z.enum([
  "topic",
  "material",
  "draft",
  "fixture",
]);

export const inputSourceSchema: z.ZodType<InputSource> = z
  .object({
    type: inputSourceTypeSchema,
    raw: plainTextSchema,
    normalized: plainTextSchema.optional(),
    capturedAt: iso8601DateTimeSchema,
  })
  .strict();

/** @alias inputSourceSchema */
export const articleInputSchema = inputSourceSchema;

export const articleMetadataSchema: z.ZodType<ArticleMetadata> = z
  .object({
    title: plainTextSchema,
    subtitle: plainTextSchema.optional(),
    summary: plainTextSchema.optional(),
    author: plainTextSchema.optional(),
    createdAt: iso8601DateTimeSchema,
    updatedAt: iso8601DateTimeSchema,
    locale: plainTextSchema,
    tags: z.array(plainTextSchema).optional(),
  })
  .strict();

const slotOverrideValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
]);

const slotOverridesSchema = z.record(z.string(), slotOverrideValueSchema);

export const blockStyleOverrideSchema = z
  .object({
    blockId: blockIdSchema,
    variantId: identifierSchema.optional(),
    slotOverrides: slotOverridesSchema.optional(),
  })
  .strict();

export const styleAssignmentSchema: z.ZodType<StyleAssignment> = z
  .object({
    themeId: identifierSchema,
    presetId: identifierSchema,
    blockOverrides: z.array(blockStyleOverrideSchema).optional(),
  })
  .strict();

/** @alias styleAssignmentSchema */
export const articleStyleAssignmentSchema = styleAssignmentSchema;

export const generationStatusSchema = z.enum([
  "idle",
  "streaming",
  "completed",
  "failed",
]);

export const generationModeSchema = z.enum(["batch", "stream"]);

export const generationMetaSchema: z.ZodType<GenerationMeta> = z
  .object({
    status: generationStatusSchema,
    mode: generationModeSchema,
    modelId: identifierSchema.optional(),
    startedAt: iso8601DateTimeSchema.optional(),
    completedAt: iso8601DateTimeSchema.optional(),
    error: plainTextSchema.optional(),
  })
  .strict();

export const articleSchema: z.ZodType<Article> = z
  .object({
    id: articleIdSchema,
    version: articleVersionSchema,
    metadata: articleMetadataSchema,
    input: inputSourceSchema,
    styleAssignment: styleAssignmentSchema,
    blocks: z.array(blockSchema).min(1),
    generation: generationMetaSchema.optional(),
  })
  .strict();

export type ArticleMetadataInput = z.input<typeof articleMetadataSchema>;
export type ArticleStyleAssignmentInput = z.input<typeof styleAssignmentSchema>;
