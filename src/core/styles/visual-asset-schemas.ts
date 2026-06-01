import { z } from "zod";

import { STYLE_SCHEMA_VERSION } from "./tokens";
import { VISUAL_ASSET_KINDS } from "./visual-assets";

const HTML_PATTERN = /<[^>]*>|&lt;|&gt;|<script\b/i;
const INLINE_STYLE_INJECTION_PATTERN =
  /\b(style|class|className)\s*=|!important\b|url\s*\(/i;
const CSS_SELECTOR_PATTERN = /^\.[a-zA-Z]|^\[|\{[^}]*\}/;

const safeAssetStringSchema = z
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

const assetIdSchema = safeAssetStringSchema.refine(
  (value) => /^[a-z][a-z0-9_-]*$/.test(value),
  { message: "assetId must be a lowercase identifier" },
);

export const visualAssetKindSchema = z.enum(VISUAL_ASSET_KINDS);

export const visualAssetDefinitionSchema = z
  .object({
    assetId: assetIdSchema,
    kind: visualAssetKindSchema,
    name: safeAssetStringSchema,
    label: safeAssetStringSchema,
    copySafe: z.boolean(),
    fallbackAssetId: assetIdSchema.optional(),
    category: safeAssetStringSchema.optional(),
    style: safeAssetStringSchema.optional(),
    suitableFor: z.array(safeAssetStringSchema).optional(),
    aspectRatio: safeAssetStringSchema.optional(),
    defaultColors: z.record(safeAssetStringSchema, safeAssetStringSchema).optional(),
  })
  .strict();

export const visualAssetRegistrySchema = z
  .object({
    schemaVersion: z.literal(STYLE_SCHEMA_VERSION),
    assets: z.array(visualAssetDefinitionSchema).min(1),
  })
  .strict();

export type VisualAssetDefinitionInput = z.input<typeof visualAssetDefinitionSchema>;
export type VisualAssetRegistryInput = z.input<typeof visualAssetRegistrySchema>;
