import { z } from "zod";

import {
  inlineTextInputSchema,
  plainTextSchema,
} from "@/core/article";

import type { Block } from "./block.types";
import { BLOCK_TYPES } from "./block.types";

export const blockTypeSchema = z.enum(BLOCK_TYPES);

export const blockMetaSchema = z
  .object({
    label: z.string().optional(),
    sourceIndex: z.number().int().nonnegative().optional(),
  })
  .strict();

export const blockIdSchema = z.string().uuid();

const titleBlockContentSchema = z
  .object({
    text: plainTextSchema,
  })
  .strict();

const leadBlockContentSchema = z
  .object({
    text: inlineTextInputSchema,
  })
  .strict();

const headingBlockContentSchema = z
  .object({
    text: plainTextSchema,
    level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  })
  .strict();

const paragraphBlockContentSchema = z
  .object({
    text: inlineTextInputSchema,
  })
  .strict();

const listItemContentSchema = z
  .object({
    text: plainTextSchema,
    subItems: z.array(plainTextSchema).optional(),
  })
  .strict();

const listBlockContentSchema = z
  .object({
    ordered: z.boolean(),
    items: z.array(listItemContentSchema).min(1),
  })
  .strict();

const quoteBlockContentSchema = z
  .object({
    text: plainTextSchema,
    attribution: plainTextSchema.optional(),
  })
  .strict();

const highlightBlockContentSchema = z
  .object({
    text: plainTextSchema,
    label: plainTextSchema.optional(),
  })
  .strict();

const infoCardBlockContentSchema = z
  .object({
    title: plainTextSchema.optional(),
    body: plainTextSchema,
    icon: plainTextSchema.optional(),
  })
  .strict();

const ctaBlockContentSchema = z
  .object({
    text: plainTextSchema,
    action: plainTextSchema.optional(),
  })
  .strict();

const dividerBlockContentSchema = z
  .object({
    style: z.enum(["line", "space", "dot"]).optional(),
  })
  .strict();

const imagePlaceholderBlockContentSchema = z
  .object({
    caption: plainTextSchema.optional(),
    aspectRatio: z.enum(["16:9", "4:3", "1:1", "free"]).optional(),
    position: z.enum(["full", "inline"]).optional(),
    suggestion: plainTextSchema.optional(),
  })
  .strict();

export const titleBlockSchema = z
  .object({
    id: blockIdSchema,
    type: z.literal("title"),
    content: titleBlockContentSchema,
    meta: blockMetaSchema.optional(),
  })
  .strict();

export const leadBlockSchema = z
  .object({
    id: blockIdSchema,
    type: z.literal("lead"),
    content: leadBlockContentSchema,
    meta: blockMetaSchema.optional(),
  })
  .strict();

export const headingBlockSchema = z
  .object({
    id: blockIdSchema,
    type: z.literal("heading"),
    content: headingBlockContentSchema,
    meta: blockMetaSchema.optional(),
  })
  .strict();

export const paragraphBlockSchema = z
  .object({
    id: blockIdSchema,
    type: z.literal("paragraph"),
    content: paragraphBlockContentSchema,
    meta: blockMetaSchema.optional(),
  })
  .strict();

export const listBlockSchema = z
  .object({
    id: blockIdSchema,
    type: z.literal("list"),
    content: listBlockContentSchema,
    meta: blockMetaSchema.optional(),
  })
  .strict();

export const quoteBlockSchema = z
  .object({
    id: blockIdSchema,
    type: z.literal("quote"),
    content: quoteBlockContentSchema,
    meta: blockMetaSchema.optional(),
  })
  .strict();

export const highlightBlockSchema = z
  .object({
    id: blockIdSchema,
    type: z.literal("highlight"),
    content: highlightBlockContentSchema,
    meta: blockMetaSchema.optional(),
  })
  .strict();

export const infoCardBlockSchema = z
  .object({
    id: blockIdSchema,
    type: z.literal("info_card"),
    content: infoCardBlockContentSchema,
    meta: blockMetaSchema.optional(),
  })
  .strict();

export const ctaBlockSchema = z
  .object({
    id: blockIdSchema,
    type: z.literal("cta"),
    content: ctaBlockContentSchema,
    meta: blockMetaSchema.optional(),
  })
  .strict();

export const dividerBlockSchema = z
  .object({
    id: blockIdSchema,
    type: z.literal("divider"),
    content: dividerBlockContentSchema,
    meta: blockMetaSchema.optional(),
  })
  .strict();

export const imagePlaceholderBlockSchema = z
  .object({
    id: blockIdSchema,
    type: z.literal("image_placeholder"),
    content: imagePlaceholderBlockContentSchema,
    meta: blockMetaSchema.optional(),
  })
  .strict();

export const blockSchema: z.ZodType<Block> = z.discriminatedUnion("type", [
  titleBlockSchema,
  leadBlockSchema,
  headingBlockSchema,
  paragraphBlockSchema,
  listBlockSchema,
  quoteBlockSchema,
  highlightBlockSchema,
  infoCardBlockSchema,
  ctaBlockSchema,
  dividerBlockSchema,
  imagePlaceholderBlockSchema,
]);

export type BlockInput = z.input<typeof blockSchema>;
