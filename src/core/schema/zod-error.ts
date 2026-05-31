import type { ZodError } from "zod";

import type { SchemaValidationIssue } from "./validation-result";

export function formatZodIssues(error: ZodError): SchemaValidationIssue[] {
  return error.issues.map((issue) => ({
    path: issue.path.filter(
      (segment): segment is string | number =>
        typeof segment === "string" || typeof segment === "number",
    ),
    message: issue.message,
    code: issue.code,
  }));
}
