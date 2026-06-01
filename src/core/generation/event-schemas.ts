import { z } from "zod";

import { blockIdSchema, blockTypeSchema } from "@/core/blocks/block.schema";
import { formatZodIssues } from "@/core/schema";

import {
  GENERATION_EVENT_TYPES,
  type GenerationEvent,
  type GenerationEventMeta,
} from "./events";

const FORBIDDEN_RECORD_KEYS = new Set(["html", "css", "className", "style"]);
const HTML_PATTERN = /<[^>]*>|&lt;|&gt;|<script\b/i;

function addForbiddenMetaKeyIssues(
  record: Record<string, unknown>,
  path: (string | number)[],
  ctx: z.RefinementCtx,
): void {
  for (const key of Object.keys(record)) {
    if (FORBIDDEN_RECORD_KEYS.has(key)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `forbidden field "${key}" is not allowed in generation event meta`,
        path: [...path, key],
      });
    }
  }
}

const generationEventMetaSchema: z.ZodType<GenerationEventMeta> = z
  .record(z.string(), z.unknown())
  .superRefine((record, ctx) => {
    addForbiddenMetaKeyIssues(record, [], ctx);
  });

const generationEventBaseSchema = z.object({
  requestId: z.string().min(1),
  sequence: z.number().int().nonnegative(),
  timestamp: z.string().min(1).optional(),
});

export const safeGenerationDeltaSchema = z
  .string()
  .refine((value) => !HTML_PATTERN.test(value), {
    message: "delta must not contain HTML markup",
  });

export const blockStartEventSchema = generationEventBaseSchema
  .extend({
    type: z.literal("block.start"),
    blockId: blockIdSchema,
    blockType: blockTypeSchema,
    meta: generationEventMetaSchema.optional(),
  })
  .strict();

export const blockDeltaEventSchema = generationEventBaseSchema
  .extend({
    type: z.literal("block.delta"),
    blockId: blockIdSchema,
    delta: safeGenerationDeltaSchema,
  })
  .strict();

export const blockCompleteEventSchema = generationEventBaseSchema
  .extend({
    type: z.literal("block.complete"),
    blockId: blockIdSchema,
    blockType: blockTypeSchema,
    content: z.unknown(),
    meta: generationEventMetaSchema.optional(),
  })
  .strict();

export const doneArticleEventSchema = generationEventBaseSchema
  .extend({
    type: z.literal("done.article"),
    article: z.unknown(),
    meta: generationEventMetaSchema.optional(),
  })
  .strict();

export const generationErrorEventSchema = generationEventBaseSchema
  .extend({
    type: z.literal("error"),
    code: z.string().min(1),
    message: z.string().min(1),
    recoverable: z.boolean().optional(),
  })
  .strict();

export const heartbeatEventSchema = generationEventBaseSchema
  .extend({
    type: z.literal("heartbeat"),
  })
  .strict();

export const generationEventSchema: z.ZodType<GenerationEvent> = z.discriminatedUnion(
  "type",
  [
    blockStartEventSchema,
    blockDeltaEventSchema,
    blockCompleteEventSchema,
    doneArticleEventSchema,
    generationErrorEventSchema,
    heartbeatEventSchema,
  ],
);

export const generationEventTypeSchema = z.enum(GENERATION_EVENT_TYPES);

export class GenerationEventError extends Error {
  readonly issues: ReturnType<typeof formatZodIssues>;

  constructor(message: string, issues: ReturnType<typeof formatZodIssues>) {
    super(message);
    this.name = "GenerationEventError";
    this.issues = issues;
  }
}

export function parseGenerationEvent(input: unknown): GenerationEvent {
  try {
    return generationEventSchema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = formatZodIssues(error);
      throw new GenerationEventError(
        issues.map((issue) => issue.message).join("; "),
        issues,
      );
    }
    throw error;
  }
}

export function isGenerationEvent(input: unknown): input is GenerationEvent {
  return generationEventSchema.safeParse(input).success;
}
