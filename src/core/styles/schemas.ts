import { z } from "zod";

import { blockTypeSchema } from "@/core/blocks/block.schema";

import {
  BODY_CONTENT_SLOT_ROLES,
  SLOT_CONTENT_BINDING_SOURCES,
  SLOT_ROLES,
  TITLE_BLOCK_LAYOUT_MODES,
} from "./types";
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

export const copySafetySchema = z.enum(["strict", "balanced", "preview_only"]);

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

export const slotRoleSchema = z.enum(SLOT_ROLES);

export const slotContentBindingSourceSchema = z.enum(
  SLOT_CONTENT_BINDING_SOURCES,
);

export const slotContentBindingSchema = z
  .object({
    source: slotContentBindingSourceSchema,
    required: z.boolean().optional(),
    fallback: safeStyleStringSchema.optional(),
  })
  .strict();

export const slotCopySafetySchema = z
  .object({
    copySafety: copySafetySchema,
    allowedInCopy: z.boolean(),
    fallbackSlotId: identifierSchema.optional(),
    notes: safeStyleStringSchema.optional(),
  })
  .strict()
  .superRefine((slotCopySafety, ctx) => {
    if (
      slotCopySafety.copySafety === "preview_only" &&
      slotCopySafety.allowedInCopy
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "preview_only slot copySafety must set allowedInCopy=false",
        path: ["allowedInCopy"],
      });
    }
  });

export const slotDefinitionSchema = z
  .object({
    id: identifierSchema,
    role: slotRoleSchema,
    label: safeStyleStringSchema.optional(),
    binding: slotContentBindingSchema,
    copySafety: slotCopySafetySchema,
  })
  .strict()
  .superRefine((slot, ctx) => {
    if (slot.binding.source === "disabled" && slot.copySafety.allowedInCopy) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "disabled slot must set copySafety.allowedInCopy=false",
        path: ["copySafety", "allowedInCopy"],
      });
    }

    if (
      (BODY_CONTENT_SLOT_ROLES as readonly string[]).includes(slot.role) &&
      (slot.binding.source === "variant.presentation" ||
        slot.binding.source === "assetRegistry")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${slot.role} slot must not bind variant.presentation or assetRegistry as body content source`,
        path: ["binding", "source"],
      });
    }
  });

/** @deprecated Use slotDefinitionSchema */
export const variantSlotDefinitionSchema = slotDefinitionSchema;

export const titleBlockLayoutModeSchema = z.enum(TITLE_BLOCK_LAYOUT_MODES);

export const titleBlockLayoutRiskLevelSchema = z.enum([
  "low",
  "medium",
  "high",
  "forbidden",
]);

export const titleBlockLayoutCompatibilitySchema = z
  .object({
    layoutMode: titleBlockLayoutModeSchema,
    allowedInCopy: z.boolean(),
    riskLevel: titleBlockLayoutRiskLevelSchema,
    fallbackLayoutMode: titleBlockLayoutModeSchema.optional(),
    allowedCopySafety: z.array(copySafetySchema).min(1),
    allowedVariantStatus: z.array(variantStatusSchema).min(1),
    notes: safeStyleStringSchema.optional(),
  })
  .strict()
  .superRefine((entry, ctx) => {
    if (
      entry.fallbackLayoutMode &&
      entry.fallbackLayoutMode === entry.layoutMode
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "fallbackLayoutMode must not equal layoutMode",
        path: ["fallbackLayoutMode"],
      });
    }
  });

export const titleBlockLayoutCompatibilityTableSchema = z
  .object(
    Object.fromEntries(
      TITLE_BLOCK_LAYOUT_MODES.map((mode) => [
        mode,
        titleBlockLayoutCompatibilitySchema,
      ]),
    ) as Record<
      (typeof TITLE_BLOCK_LAYOUT_MODES)[number],
      typeof titleBlockLayoutCompatibilitySchema
    >,
  )
  .strict();

export const variantComponentProtocolSchema = z
  .object({
    componentId: identifierSchema.optional(),
    familyId: identifierSchema.optional(),
    layoutMode: titleBlockLayoutModeSchema.optional(),
  })
  .strict();

const variantMetadataValueSchema = z.union([
  safeStyleStringSchema,
  z.number(),
  z.boolean(),
]);

export const variantWeChatCompatibilitySchema = z
  .object({
    allowedCssProperties: z.array(safeStyleStringSchema).optional(),
    riskyCssProperties: z.array(safeStyleStringSchema).optional(),
    forbiddenCssProperties: z.array(safeStyleStringSchema).optional(),
    fallbackVariantId: identifierSchema.optional(),
    notes: safeStyleStringSchema.optional(),
  })
  .strict();

export const variantCompatibilitySchema = z
  .object({
    copySafety: copySafetySchema.optional(),
    wechat: variantWeChatCompatibilitySchema.optional(),
  })
  .strict();

export const forbiddenCssFallbackActionSchema = z.enum([
  "reject",
  "fallback_variant",
  "strip_property",
]);

export const riskyCssFallbackActionSchema = z.enum([
  "warn",
  "fallback_variant",
  "allow",
]);

export const fallbackPolicySchema = z
  .object({
    onForbiddenCss: forbiddenCssFallbackActionSchema,
    onRiskyCss: riskyCssFallbackActionSchema,
    defaultFallbackVariantId: identifierSchema.optional(),
    previewOnlyAllowed: z.boolean(),
    notes: safeStyleStringSchema.optional(),
  })
  .strict();

export const weChatCompatibilityTargetSchema = z.enum(["wechat_mp_editor"]);

export const weChatCssRulesSchema = z
  .object({
    allowed: z.array(safeStyleStringSchema),
    risky: z.array(safeStyleStringSchema),
    forbidden: z.array(safeStyleStringSchema),
  })
  .strict();

export const weChatCompatibilityProfileSchema = z
  .object({
    id: identifierSchema,
    name: safeStyleStringSchema,
    schemaVersion: styleSchemaVersionSchema,
    target: weChatCompatibilityTargetSchema,
    cssRules: weChatCssRulesSchema,
    fallbackPolicy: fallbackPolicySchema,
    notes: safeStyleStringSchema.optional(),
  })
  .strict();

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
    slots: z.record(identifierSchema, slotDefinitionSchema).optional(),
    tokens: z.record(tokenKeySchema, safeStyleStringSchema).optional(),
    compatibility: variantCompatibilitySchema.optional(),
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

    if (
      variant.status === "release1_required" &&
      variant.compatibility?.copySafety === "preview_only"
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "release1_required variant must not declare copySafety preview_only",
        path: ["compatibility", "copySafety"],
      });
    }

    if (variant.status === "release1_required" && variant.slots) {
      for (const [slotKey, slot] of Object.entries(variant.slots)) {
        if (slot.id !== slotKey) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `slot id "${slot.id}" must match record key "${slotKey}"`,
            path: ["slots", slotKey, "id"],
          });
        }

        if (slot.copySafety.copySafety === "preview_only") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "release1_required variant slot must not use preview_only copySafety",
            path: ["slots", slotKey, "copySafety", "copySafety"],
          });
        }

        if (
          !slot.copySafety.allowedInCopy &&
          slot.binding.source !== "disabled"
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "release1_required variant slot must allow copy unless binding source is disabled",
            path: ["slots", slotKey, "copySafety", "allowedInCopy"],
          });
        }

        if (
          slot.binding.required &&
          slot.copySafety.copySafety === "preview_only"
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "required slot must not use preview_only copySafety",
            path: ["slots", slotKey, "copySafety", "copySafety"],
          });
        }
      }
    }
  });

export const styleValidationSeveritySchema = z.enum([
  "error",
  "warning",
  "info",
]);

export const styleValidationIssueSchema = z
  .object({
    severity: styleValidationSeveritySchema,
    code: identifierSchema,
    message: safeStyleStringSchema,
    path: z.array(z.union([identifierSchema, z.number()])).optional(),
    blockId: identifierSchema.optional(),
    blockType: blockTypeSchema.optional(),
    variantId: identifierSchema.optional(),
    property: safeStyleStringSchema.optional(),
    value: safeStyleStringSchema.optional(),
    fallbackVariantId: identifierSchema.optional(),
  })
  .strict();

export const styleValidationResultSchema = z
  .object({
    ok: z.boolean(),
    issues: z.array(styleValidationIssueSchema),
  })
  .strict();

export const missingVariantFallbackActionSchema = z.enum([
  "error",
  "fallback_to_preset",
  "fallback_to_registry_default",
]);

export const blockTypeMismatchFallbackActionSchema = z.enum([
  "error",
  "fallback_to_preset",
  "fallback_to_registry_default",
]);

export const forbiddenCssPolicyActionSchema = z.enum([
  "error",
  "fallback_variant",
  "strip_property",
]);

export const riskyCssPolicyActionSchema = z.enum([
  "warning",
  "fallback_variant",
  "allow",
]);

export const fallbackVariantPolicySchema = z
  .object({
    onMissingVariant: missingVariantFallbackActionSchema,
    onBlockTypeMismatch: blockTypeMismatchFallbackActionSchema,
    onForbiddenCss: forbiddenCssPolicyActionSchema,
    onRiskyCss: riskyCssPolicyActionSchema,
    allowExperimentalFallback: z.boolean(),
    allowPreviewOnlyInCopy: z.boolean(),
    defaultFallbackVariantId: identifierSchema.optional(),
  })
  .strict();

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
export type WeChatCompatibilityProfileInput = z.input<
  typeof weChatCompatibilityProfileSchema
>;

/** 校验 InlineMark color：token ref 为推荐路径；其它 string 为 legacy */
export const inlineMarkColorInputSchema = z.union([
  colorTokenRefSchema,
  safeStyleStringSchema,
]);
