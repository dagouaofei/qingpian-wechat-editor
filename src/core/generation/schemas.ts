import { z } from "zod";

import { articleIdSchema } from "@/core/article/article.schema";

import {
  INPUT_DENSITY_HINTS,
  INPUT_LIMITS,
  INPUT_REQUEST_MODES,
  MATERIAL_SOURCE_TYPES,
  type InputRequest,
  type InputSource,
  type InputStyleIntent,
} from "./input";

const HTML_PATTERN = /<[^>]*>|&lt;|&gt;|<script\b/i;
const INLINE_STYLE_INJECTION_PATTERN =
  /\b(style|class|className)\s*=|!important\b|url\s*\(/i;
const VARIANT_ID_PATTERN = /\bvariantId\b/i;

const FORBIDDEN_STYLE_INTENT_KEYS = new Set([
  "html",
  "css",
  "className",
  "style",
  "variantId",
]);

function addForbiddenStyleIntentKeyIssues(
  record: Record<string, unknown>,
  path: (string | number)[],
  ctx: z.RefinementCtx,
): void {
  for (const key of Object.keys(record)) {
    if (FORBIDDEN_STYLE_INTENT_KEYS.has(key)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `forbidden field "${key}" is not allowed in styleIntent`,
        path: [...path, key],
      });
    }
  }
}

export const safeStyleIntentStringSchema = z
  .string()
  .min(1)
  .refine((value) => !HTML_PATTERN.test(value), {
    message: "must not contain HTML",
  })
  .refine((value) => !INLINE_STYLE_INJECTION_PATTERN.test(value), {
    message: "must not contain inline style or class attributes",
  })
  .refine((value) => !VARIANT_ID_PATTERN.test(value), {
    message: "must not bind variantId in styleIntent",
  });

export const inputRequestModeSchema = z.enum(INPUT_REQUEST_MODES);

export const inputSourceTypeSchema = z.enum(MATERIAL_SOURCE_TYPES);

export const inputSourceSchema: z.ZodType<InputSource> = z
  .object({
    type: inputSourceTypeSchema,
    text: z.string(),
    label: z.string().optional(),
    order: z.number().int().nonnegative().optional(),
  })
  .strict();

export const inputStyleIntentSchema: z.ZodType<InputStyleIntent> = z
  .object({
    tone: safeStyleIntentStringSchema.optional(),
    presetHint: safeStyleIntentStringSchema.optional(),
    densityHint: z.enum(INPUT_DENSITY_HINTS).optional(),
    notes: safeStyleIntentStringSchema.optional(),
  })
  .strict()
  .superRefine((record, ctx) => {
    addForbiddenStyleIntentKeyIssues(record, [], ctx);
  });

export const inputRequestMetadataSchema = z
  .object({
    locale: z.string().min(1).optional(),
    createdAt: z.string().min(1).optional(),
    source: z.string().min(1).optional(),
    requestId: z.string().min(1).optional(),
  })
  .strict();

export const inputRequestSchema: z.ZodType<InputRequest> = z
  .object({
    id: articleIdSchema.optional(),
    mode: inputRequestModeSchema,
    topic: z.string().optional(),
    materials: z
      .array(inputSourceSchema)
      .max(INPUT_LIMITS.MAX_MATERIALS_COUNT)
      .optional(),
    draft: z.string().optional(),
    styleIntent: inputStyleIntentSchema.optional(),
    metadata: inputRequestMetadataSchema.optional(),
  })
  .strict();
