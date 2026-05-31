import { z } from "zod";

import type { InlineContent, InlineMark, InlineTextNode } from "./inline-content.types";

/** 禁止注入 HTML / CSS 片段的文本 */
const HTML_IN_TEXT_PATTERN = /<[^>]*>|&lt;|&gt;|<script\b/i;
const CSS_IN_TEXT_PATTERN =
  /\b(style|class|className)\s*=|url\s*\(|!important\b/i;

/** 语义色意图：token 名，不允许 CSS 语法 */
const SEMANTIC_COLOR_PATTERN = /^[a-zA-Z][a-zA-Z0-9_-]*$/;

export const inlineMarkTypeSchema = z.enum([
  "bold",
  "italic",
  "highlight",
  "color",
  "link",
]);

export const inlineMarkSemanticSchema = z.enum([
  "keyword",
  "warning",
  "benefit",
  "note",
]);

const semanticColorSchema = z
  .string()
  .min(1)
  .refine(
    (value) => SEMANTIC_COLOR_PATTERN.test(value),
    "color must be a semantic token name, not CSS",
  );

const hrefSchema = z
  .string()
  .min(1)
  .refine(
    (value) => {
      try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    },
    "href must be a valid http(s) URL",
  );

const markBaseSchema = z
  .object({
    color: semanticColorSchema.optional(),
    semantic: inlineMarkSemanticSchema.optional(),
  })
  .strict();

const inlineMarkBoldSchema = markBaseSchema
  .extend({ type: z.literal("bold") })
  .strict();

const inlineMarkItalicSchema = markBaseSchema
  .extend({ type: z.literal("italic") })
  .strict();

const inlineMarkHighlightSchema = markBaseSchema
  .extend({ type: z.literal("highlight") })
  .strict();

const inlineMarkColorSchema = z
  .object({
    type: z.literal("color"),
    color: semanticColorSchema,
    semantic: inlineMarkSemanticSchema.optional(),
  })
  .strict();

const inlineMarkLinkSchema = z
  .object({
    type: z.literal("link"),
    href: hrefSchema,
    color: semanticColorSchema.optional(),
    semantic: inlineMarkSemanticSchema.optional(),
  })
  .strict();

export const inlineMarkSchema: z.ZodType<InlineMark> = z.discriminatedUnion(
  "type",
  [
    inlineMarkBoldSchema,
    inlineMarkItalicSchema,
    inlineMarkHighlightSchema,
    inlineMarkColorSchema,
    inlineMarkLinkSchema,
  ],
);

export const inlineTextNodeSchema: z.ZodType<InlineTextNode> = z
  .object({
    text: z
      .string()
      .min(1, "text segment must not be empty")
      .refine((text) => !HTML_IN_TEXT_PATTERN.test(text), {
        message: "text must not contain HTML",
      })
      .refine((text) => !CSS_IN_TEXT_PATTERN.test(text), {
        message: "text must not contain inline CSS or class attributes",
      }),
    marks: z.array(inlineMarkSchema).optional(),
  })
  .strict();

export const inlineContentSchema: z.ZodType<InlineContent> = z
  .array(inlineTextNodeSchema)
  .min(1, "InlineContent must contain at least one text node");

/** 允许空数组（normalize 空 string 的结果） */
export const inlineContentSchemaLenient: z.ZodType<InlineContent> = z.array(
  inlineTextNodeSchema,
);

/** 纯文本（无 HTML/CSS 注入） */
export const plainTextSchema = z
  .string()
  .min(1)
  .refine((text) => !HTML_IN_TEXT_PATTERN.test(text), {
    message: "text must not contain HTML",
  })
  .refine((text) => !CSS_IN_TEXT_PATTERN.test(text), {
    message: "text must not contain inline CSS or class attributes",
  });

/** paragraph / lead 主文本：`string | InlineContent` */
export const inlineTextInputSchema = z.union([
  plainTextSchema,
  inlineContentSchema,
]);

export type InlineMarkInput = z.input<typeof inlineMarkSchema>;
export type InlineTextNodeInput = z.input<typeof inlineTextNodeSchema>;
export type InlineContentInput = z.input<typeof inlineContentSchema>;
