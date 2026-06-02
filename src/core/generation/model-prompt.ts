import { BLOCK_TYPES } from "@/core/blocks";

import type { NormalizedInput } from "./input";

const FORBIDDEN_OUTPUT_FIELDS = ["html", "css", "className", "style"] as const;

export function buildVolcengineSystemPrompt(): string {
  return [
    "You are a structured article generator for the Qingpian WeChat editor.",
    "Return ONLY one JSON object (Article candidate). Do not wrap output in Markdown code fences.",
    "Do not return HTML, CSS, className, inline style, renderer fields, or copy-ready HTML.",
    "Required top-level fields: id, version, metadata, input, styleAssignment, blocks.",
    "version must be 1.",
    "metadata must include title, createdAt, updatedAt, locale.",
    "input must include type, raw, capturedAt.",
    "styleAssignment may use themeId=default and presetId=classic-news; system can fill safe defaults.",
    `blocks must use only these Release 1 block types: ${BLOCK_TYPES.join(", ")}.`,
    "Include UUID strings for article id and block ids when possible; system will repair missing or invalid UUIDs.",
    "paragraph and lead content.text may be plain string or InlineContent array.",
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
    "Generate one WeChat article Article candidate JSON object from the normalized input below.",
    "Output JSON only — no Markdown fences, no HTML/CSS/className/style fields, no copy HTML.",
    "Use safe default styleAssignment unless styleIntent clearly suggests another preset.",
    "Include at least one title block and one paragraph or lead block with Release 1 block types.",
    "Prefer valid UUIDs for id fields; missing machine fields may be repaired by the provider.",
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

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function looksLikeArticleCandidate(value: unknown): boolean {
  return isPlainObject(value) && Array.isArray(value.blocks);
}

export function extractBalancedJsonObject(content: string): string | undefined {
  const start = content.indexOf("{");
  if (start < 0) {
    return undefined;
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < content.length; index += 1) {
    const char = content[index]!;

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === "\\") {
        escaped = true;
        continue;
      }
      if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }
    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return content.slice(start, index + 1);
      }
    }
  }

  return undefined;
}

function removeTrailingCommas(json: string): string {
  return json.replace(/,\s*([}\]])/g, "$1");
}

function stripReasoningPrefix(content: string): string {
  return content.replace(/^[\s\S]*?<\/think>\s*/i, "").trim();
}

export function normalizeModelArticleRoot(parsed: unknown): unknown {
  if (looksLikeArticleCandidate(parsed)) {
    return parsed;
  }

  if (!isPlainObject(parsed)) {
    return parsed;
  }

  for (const key of ["article", "data", "result", "output"] as const) {
    const nested = parsed[key];
    if (looksLikeArticleCandidate(nested)) {
      return nested;
    }
  }

  return parsed;
}

function collectModelJsonCandidates(content: string): string[] {
  const trimmed = content.replace(/^\uFEFF/, "").trim();
  const withoutReasoning = stripReasoningPrefix(trimmed);
  const candidates = new Set<string>([trimmed, withoutReasoning]);

  const fencedMatches = trimmed.matchAll(/```(?:json)?\s*([\s\S]*?)```/gi);
  for (const match of fencedMatches) {
    if (match[1]?.trim()) {
      candidates.add(match[1].trim());
    }
  }

  for (const source of [trimmed, withoutReasoning]) {
    const balanced = extractBalancedJsonObject(source);
    if (balanced) {
      candidates.add(balanced);
    }
  }

  return [...candidates];
}

export function parseModelJsonContent(content: string): unknown {
  const candidates = collectModelJsonCandidates(content);
  let lastError: Error | undefined;

  for (const candidate of candidates) {
    for (const jsonText of [candidate, removeTrailingCommas(candidate)]) {
      try {
        return normalizeModelArticleRoot(JSON.parse(jsonText));
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }
  }

  throw lastError ?? new Error("model response is not valid JSON");
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
