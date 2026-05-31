import { ZodError } from "zod";

import {
  formatZodIssues,
  validationFailure,
  validationSuccess,
  type SchemaValidationIssue,
  type SchemaValidationResult,
} from "@/core/schema";

import { blockSchema } from "./block.schema";
import type { Block } from "./block.types";

export class BlockSchemaError extends Error {
  readonly issues: SchemaValidationIssue[];

  constructor(message: string, issues: SchemaValidationIssue[]) {
    super(message);
    this.name = "BlockSchemaError";
    this.issues = issues;
  }
}

export function parseBlock(input: unknown): Block {
  try {
    return blockSchema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      const issues = formatZodIssues(error);
      throw new BlockSchemaError(
        issues.map((issue) => issue.message).join("; "),
        issues,
      );
    }
    throw error;
  }
}

export function validateBlock(input: unknown): SchemaValidationResult<Block> {
  const result = blockSchema.safeParse(input);
  if (result.success) {
    return validationSuccess(result.data);
  }
  return validationFailure(formatZodIssues(result.error));
}
