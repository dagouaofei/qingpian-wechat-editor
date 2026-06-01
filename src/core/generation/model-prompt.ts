import { BLOCK_TYPES } from "@/core/blocks";

import type { NormalizedInput } from "./input";

const FORBIDDEN_OUTPUT_FIELDS = ["html", "css", "className", "style"] as const;

export function buildVolcengineSystemPrompt(): string {
  return [
    "You are a structured article generator for the Qingpian WeChat editor.",
    "Return ONLY one JSON object that matches the Release 1 Article candidate schema.",
    "Do not return HTML, Markdown, CSS, className, inline style, or renderer fields.",
    "Required top-level fields: id, version, metadata, input, styleAssignment, blocks.",
    "version must be 1.",
    "metadata must include title, createdAt, updatedAt, locale.",
    "input must include type, raw, capturedAt.",
    "styleAssignment must include themeId and presetId only; do not invent renderer fields.",
    `blocks must use only these block types: ${BLOCK_TYPES.join(", ")}.`,
    "paragraph and lead content.text may be plain string or InlineContent array.",
    "Do not wrap the JSON in markdown fences unless unavoidable.",
    `Never include forbidden fields: ${FORBIDDEN_OUTPUT_FIELDS.join(", ")}.`,
  ].join("\n");
}

function resolveInputType(input: NormalizedInput): "topic" | "material" | "draft" {
  if (input.primaryIntent === "draft") {
    return "draft";
  }
  if (input.primaryIntent === "material" || input.primaryIntent === "mixed") {
    return "material";
  }
  return "topic";
}

export function buildVolcengineUserPrompt(input: NormalizedInput): string {
  const payload = {
    mode: input.mode,
    primaryIntent: input.primaryIntent,
    topic: input.topic,
    draft: input.draft,
    materials: input.materials,
    styleIntent: input.styleIntent,
    inputSummary: input.inputSummary,
    locale: input.metadata?.locale ?? "zh-CN",
    requiredInputType: resolveInputType(input),
    styleAssignmentDefaults: {
      themeId: "default",
      presetId: "classic-news",
    },
    outputContract: {
      version: 1,
      forbiddenFields: FORBIDDEN_OUTPUT_FIELDS,
      allowedBlockTypes: BLOCK_TYPES,
    },
  };

  return [
    "Generate one WeChat article Article candidate JSON from the normalized input below.",
    "Use safe default styleAssignment unless styleIntent clearly suggests another preset.",
    "Include at least one title block and one paragraph or lead block.",
    JSON.stringify(payload, null, 2),
  ].join("\n\n");
}

export function buildVolcenginePromptMessages(input: NormalizedInput): Array<{
  role: "system" | "user";
  content: string;
}> {
  return [
    { role: "system", content: buildVolcengineSystemPrompt() },
    { role: "user", content: buildVolcengineUserPrompt(input) },
  ];
}

export function parseModelJsonContent(content: string): unknown {
  const trimmed = content.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced?.[1]) {
      return JSON.parse(fenced[1].trim());
    }
    throw new Error("model response is not valid JSON");
  }
}

export function findForbiddenArticleFields(
  candidate: Record<string, unknown>,
): string | undefined {
  for (const field of FORBIDDEN_OUTPUT_FIELDS) {
    if (field in candidate) {
      return field;
    }
  }
  return undefined;
}
