import { ZodError } from "zod";

import { formatZodIssues } from "@/core/schema";

import type { InputRequest, InputSource, InputValidationIssue, InputValidationResult, InputValidationSeverity } from "./input";
import { INPUT_LIMITS } from "./input";
import { inputRequestSchema } from "./schemas";

export class InputRequestError extends Error {
  readonly issues: InputValidationIssue[];

  constructor(message: string, issues: InputValidationIssue[]) {
    super(message);
    this.name = "InputRequestError";
    this.issues = issues;
  }
}

function toInputIssue(
  issue: {
    path: Array<string | number>;
    message: string;
    code: string;
  },
  severity: InputValidationSeverity,
): InputValidationIssue {
  return {
    path: issue.path,
    message: issue.message,
    code: issue.code,
    severity,
  };
}

function mapZodIssues(error: ZodError): InputValidationIssue[] {
  return formatZodIssues(error).map((issue) => toInputIssue(issue, "error"));
}

function trimOptional(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function hasEffectiveTopic(input: InputRequest): boolean {
  return trimOptional(input.topic) !== undefined;
}

function hasEffectiveDraft(input: InputRequest): boolean {
  return trimOptional(input.draft) !== undefined;
}

function effectiveMaterials(input: InputRequest): InputSource[] {
  return (input.materials ?? []).filter(
    (source) => trimOptional(source.text) !== undefined,
  );
}

function hasEffectiveMaterials(input: InputRequest): boolean {
  return effectiveMaterials(input).length > 0;
}

function computeTotalInputLength(input: InputRequest): number {
  let total = 0;
  const topic = trimOptional(input.topic);
  const draft = trimOptional(input.draft);
  if (topic) {
    total += topic.length;
  }
  if (draft) {
    total += draft.length;
  }
  for (const source of input.materials ?? []) {
    const text = trimOptional(source.text);
    if (text) {
      total += text.length;
    }
  }
  return total;
}

function collectBusinessIssues(input: InputRequest): InputValidationIssue[] {
  const issues: InputValidationIssue[] = [];
  const topic = trimOptional(input.topic);
  const draft = trimOptional(input.draft);
  const materials = input.materials ?? [];

  if (!hasEffectiveTopic(input) && !hasEffectiveDraft(input) && !hasEffectiveMaterials(input)) {
    issues.push({
      path: [],
      message: "at least one of topic, materials, or draft must be provided",
      code: "empty_input",
      severity: "error",
    });
  }

  if (input.mode === "topic_only" && !topic) {
    issues.push({
      path: ["topic"],
      message: "topic_only mode requires a non-empty topic",
      code: "mode_requires_topic",
      severity: "error",
    });
  }

  if (input.mode === "draft_rewrite" && !draft) {
    issues.push({
      path: ["draft"],
      message: "draft_rewrite mode requires a non-empty draft",
      code: "mode_requires_draft",
      severity: "error",
    });
  }

  if (
    input.mode === "topic_with_materials" &&
    !topic &&
    !hasEffectiveMaterials(input)
  ) {
    issues.push({
      path: ["topic"],
      message:
        "topic_with_materials mode requires topic or at least one non-empty material",
      code: "mode_requires_topic_or_materials",
      severity: "error",
    });
  }

  if (input.mode === "topic_with_materials" && !topic && hasEffectiveMaterials(input)) {
    issues.push({
      path: ["topic"],
      message: "topic_with_materials without topic; materials-only input accepted with warning",
      code: "missing_topic_warning",
      severity: "warning",
    });
  }

  if (topic && topic.length > INPUT_LIMITS.MAX_TOPIC_LENGTH) {
    issues.push({
      path: ["topic"],
      message: `topic exceeds maximum length of ${INPUT_LIMITS.MAX_TOPIC_LENGTH}`,
      code: "input_too_long",
      severity: "error",
    });
  }

  if (draft && draft.length > INPUT_LIMITS.MAX_DRAFT_LENGTH) {
    issues.push({
      path: ["draft"],
      message: `draft exceeds maximum length of ${INPUT_LIMITS.MAX_DRAFT_LENGTH}`,
      code: "input_too_long",
      severity: "error",
    });
  }

  materials.forEach((source, index) => {
    const trimmed = trimOptional(source.text);
    if (source.text.trim().length === 0) {
      issues.push({
        path: ["materials", index, "text"],
        message: "empty material text will be dropped during normalization",
        code: "empty_material_dropped",
        severity: "warning",
      });
    } else if (trimmed && trimmed.length > INPUT_LIMITS.MAX_MATERIAL_TEXT_LENGTH) {
      issues.push({
        path: ["materials", index, "text"],
        message: `material text exceeds maximum length of ${INPUT_LIMITS.MAX_MATERIAL_TEXT_LENGTH}`,
        code: "input_too_long",
        severity: "error",
      });
    }
  });

  const totalLength = computeTotalInputLength(input);
  if (totalLength > INPUT_LIMITS.MAX_TOTAL_INPUT_LENGTH) {
    issues.push({
      path: [],
      message: `total input length ${totalLength} exceeds maximum of ${INPUT_LIMITS.MAX_TOTAL_INPUT_LENGTH}`,
      code: "input_too_long",
      severity: "error",
    });
  }

  return issues;
}

export function parseInputRequest(input: unknown): InputRequest {
  try {
    return inputRequestSchema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) {
      const issues = mapZodIssues(error);
      throw new InputRequestError(
        issues.map((issue) => issue.message).join("; "),
        issues,
      );
    }
    throw error;
  }
}

export function validateInputRequest(input: unknown): InputValidationResult {
  const parsed = inputRequestSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      issues: mapZodIssues(parsed.error),
    };
  }

  const issues = collectBusinessIssues(parsed.data);
  const errors = issues.filter((issue) => issue.severity === "error");
  if (errors.length > 0) {
    return {
      ok: false,
      issues,
    };
  }

  return {
    ok: true,
    data: parsed.data,
    issues,
  };
}

export function isInputRequest(input: unknown): input is InputRequest {
  return inputRequestSchema.safeParse(input).success;
}
