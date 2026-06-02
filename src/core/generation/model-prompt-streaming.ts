import { BLOCK_TYPES } from "@/core/blocks";

import type { NormalizedInput } from "./input";
import { buildVolcengineUserPrompt } from "./model-prompt";

const FORBIDDEN_OUTPUT_FIELDS = ["html", "css", "className", "style"] as const;

export function buildVolcengineStreamingSystemPrompt(): string {
  return [
    "You are a structured article generator for the Qingpian WeChat official-account editor.",
    "Write in Simplified Chinese unless the user explicitly requests another language.",
    "Output ONLY newline-delimited JSON (JSONL): one complete block object per line.",
    "Do NOT wrap lines in Markdown code fences. Do NOT output a single wrapping Article JSON.",
    "Each line must be one JSON object with fields: type, id (UUID string), content.",
    `type must be one of: ${BLOCK_TYPES.join(", ")}.`,
    "content holds block fields only (e.g. text, body, items) — never html/css/className/style.",
    "Emit blocks in reading order: title, lead, heading, paragraph, highlight or quote, list, cta, etc.",
    "Target ~1200-1500 Chinese characters across all text blocks.",
    "Include 4-5 heading sections plus summary and cta.",
    `Never include forbidden fields: ${FORBIDDEN_OUTPUT_FIELDS.join(", ")}.`,
    "Example lines (format only):",
    '{"type":"title","id":"11111111-1111-4111-8111-000000000001","content":{"text":"标题"}}',
    '{"type":"paragraph","id":"22222222-2222-4222-8222-000000000002","content":{"text":"正文段落…"}}',
  ].join("\n");
}

export function buildVolcengineStreamingPromptMessages(input: NormalizedInput): Array<{
  role: "system" | "user";
  content: string;
}> {
  return [
    { role: "system", content: buildVolcengineStreamingSystemPrompt() },
    {
      role: "user",
      content: [
        buildVolcengineUserPrompt(input),
        "",
        "Stream output as JSONL only — one block JSON object per line, in article order.",
      ].join("\n"),
    },
  ];
}
