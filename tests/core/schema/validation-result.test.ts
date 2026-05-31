import { describe, expect, it } from "vitest";
import { z } from "zod";

import { formatZodIssues, validationFailure, validationSuccess } from "@/core/schema";

describe("schema validation result", () => {
  it("validationSuccess returns ok true with empty issues", () => {
    const result = validationSuccess({ id: "1" });
    expect(result).toEqual({ ok: true, data: { id: "1" }, issues: [] });
  });

  it("validationFailure returns ok false with issues", () => {
    const issues = [{ path: ["id"], message: "Required", code: "invalid_type" }];
    expect(validationFailure(issues)).toEqual({ ok: false, issues });
  });

  it("formatZodIssues preserves path, message, and code", () => {
    const schema = z.object({ title: z.string().min(1) }).strict();
    const result = schema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = formatZodIssues(result.error);
      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0]).toMatchObject({
        message: expect.any(String),
        code: expect.any(String),
      });
      expect(Array.isArray(issues[0]?.path)).toBe(true);
    }
  });
});
