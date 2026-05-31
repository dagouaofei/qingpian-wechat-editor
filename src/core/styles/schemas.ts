import { z } from "zod";

import { blockTypeSchema } from "@/core/blocks/block.schema";

import {
  COLOR_TOKEN_REFS,
  STYLE_SCHEMA_VERSION,
} from "./tokens";

const HTML_PATTERN = /<[^>]*>|&lt;|&gt;|<script\b/i;
const INLINE_STYLE_INJECTION_PATTERN =
  /\b(style|class|className)\s*=|!important\b|url\s*\(/i;
/** 拒绝 CSS 选择器 / 规则片段；允许 #hex 色值 */
const CSS_SELECTOR_PATTERN = /^\.[a-zA-Z]|^\[|\{[^}]*\}/;

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

const tokenKeySchema = z
  .string()
  .min(1)
  .refine((value) => /^[a-zA-Z][a-zA-Z0-9._-]*$/.test(value), {
    message: "token key must be a valid identifier",
  });

const themeTokenMapSchema = z.record(tokenKeySchema, safeStyleStringSchema);

export const styleSchemaVersionSchema = z.literal(STYLE_SCHEMA_VERSION);

export const colorTokenRefSchema = z.enum(COLOR_TOKEN_REFS);

export const themeTokensSchema = z
  .object({
    color: themeTokenMapSchema.optional(),
    fontSize: themeTokenMapSchema.optional(),
    fontWeight: themeTokenMapSchema.optional(),
    lineHeight: themeTokenMapSchema.optional(),
    spacing: themeTokenMapSchema.optional(),
    radius: themeTokenMapSchema.optional(),
    borderWidth: themeTokenMapSchema.optional(),
  })
  .strict();

export const themeDefinitionSchema = z
  .object({
    id: identifierSchema,
    name: safeStyleStringSchema,
    schemaVersion: styleSchemaVersionSchema,
    tokens: themeTokensSchema,
  })
  .strict();

export const densitySchema = z.enum(["compact", "standard", "relaxed"]);

export const variantStatusSchema = z.enum([
  "release1_required",
  "release1_candidate",
  "experimental",
]);

const defaultVariantByBlockTypeSchema = z
  .object({
    title: identifierSchema.optional(),
    lead: identifierSchema.optional(),
    heading: identifierSchema.optional(),
    paragraph: identifierSchema.optional(),
    list: identifierSchema.optional(),
    quote: identifierSchema.optional(),
    highlight: identifierSchema.optional(),
    info_card: identifierSchema.optional(),
    cta: identifierSchema.optional(),
    divider: identifierSchema.optional(),
    image_placeholder: identifierSchema.optional(),
  })
  .strict();

export const presetDefinitionSchema = z
  .object({
    id: identifierSchema,
    name: safeStyleStringSchema,
    schemaVersion: styleSchemaVersionSchema,
    themeId: identifierSchema,
    description: safeStyleStringSchema.optional(),
    defaultVariantByBlockType: defaultVariantByBlockTypeSchema.optional(),
    density: densitySchema.optional(),
    tone: safeStyleStringSchema.optional(),
  })
  .strict();

export const variantSlotDefinitionSchema = z
  .object({
    id: identifierSchema,
    label: safeStyleStringSchema.optional(),
  })
  .strict();

export const variantComponentProtocolSchema = z
  .object({
    componentId: identifierSchema.optional(),
    familyId: identifierSchema.optional(),
    layoutMode: identifierSchema.optional(),
  })
  .strict();

const variantMetadataValueSchema = z.union([
  safeStyleStringSchema,
  z.number(),
  z.boolean(),
]);

export const variantDefinitionSchema = z
  .object({
    id: identifierSchema,
    schemaVersion: styleSchemaVersionSchema,
    blockType: blockTypeSchema,
    family: identifierSchema,
    name: safeStyleStringSchema,
    label: safeStyleStringSchema,
    description: safeStyleStringSchema.optional(),
    status: variantStatusSchema,
    slots: z.record(identifierSchema, variantSlotDefinitionSchema).optional(),
    tokens: z.record(tokenKeySchema, safeStyleStringSchema).optional(),
    compatibility: z
      .record(identifierSchema, variantMetadataValueSchema)
      .optional(),
    componentProtocol: variantComponentProtocolSchema.optional(),
    metadata: z.record(identifierSchema, variantMetadataValueSchema).optional(),
  })
  .strict()
  .superRefine((variant, ctx) => {
    if (
      variant.id === "magazine_left_bar_title" &&
      variant.status === "release1_required"
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "magazine_left_bar_title must not be release1_required (candidate only)",
        path: ["status"],
      });
    }
  });

export const styleRegistrySchema = z
  .object({
    schemaVersion: styleSchemaVersionSchema,
    themes: z.array(themeDefinitionSchema).min(1),
    presets: z.array(presetDefinitionSchema).min(1),
    variants: z.array(variantDefinitionSchema),
  })
  .strict();

export type ThemeDefinitionInput = z.input<typeof themeDefinitionSchema>;
export type PresetDefinitionInput = z.input<typeof presetDefinitionSchema>;
export type VariantDefinitionInput = z.input<typeof variantDefinitionSchema>;
export type StyleRegistryInput = z.input<typeof styleRegistrySchema>;

/** 校验 InlineMark color：token ref 为推荐路径；其它 string 为 legacy */
export const inlineMarkColorInputSchema = z.union([
  colorTokenRefSchema,
  safeStyleStringSchema,
]);
