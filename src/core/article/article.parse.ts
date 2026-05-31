import { ZodError } from "zod";

import {
  formatZodIssues,
  validationFailure,
  validationSuccess,
  type SchemaValidationIssue,
  type SchemaValidationResult,
} from "@/core/schema";

import { articleSchema } from "./article.schema";
import type { Article } from "./article.types";

export class ArticleSchemaError extends Error {
  readonly issues: SchemaValidationIssue[];

  constructor(message: string, issues: SchemaValidationIssue[]) {
    super(message);
    this.name = "ArticleSchemaError";
    this.issues = issues;
  }
}

export function parseArticle(input: unknown): Article {
  try {
    return articleSchema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      const issues = formatZodIssues(error);
      throw new ArticleSchemaError(
        issues.map((issue) => issue.message).join("; "),
        issues,
      );
    }
    throw error;
  }
}

export function validateArticle(input: unknown): SchemaValidationResult<Article> {
  const result = articleSchema.safeParse(input);
  if (result.success) {
    return validationSuccess(result.data);
  }
  return validationFailure(formatZodIssues(result.error));
}
