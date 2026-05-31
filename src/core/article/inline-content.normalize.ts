import { z } from "zod";

import {
  inlineContentSchema,
  inlineContentSchemaLenient,
  inlineMarkSchema,
} from "./inline-content.schema";
import type {
  InlineContent,
  InlineMark,
  InlineTextInput,
  InlineTextNode,
  LegacyEmphasis,
} from "./inline-content.types";

export class InlineContentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InlineContentValidationError";
  }
}

function formatZodError(error: z.ZodError): string {
  return error.issues.map((issue) => issue.message).join("; ");
}

/** 旧 emphasis 数组 → InlineMark（文档兼容期） */
export function legacyEmphasisToMarks(
  emphasis: LegacyEmphasis[] | undefined,
): InlineMark[] | undefined {
  if (!emphasis?.length) {
    return undefined;
  }

  const marks: InlineMark[] = [];
  if (emphasis.includes("bold")) {
    marks.push({ type: "bold" });
  }
  if (emphasis.includes("italic")) {
    marks.push({ type: "italic" });
  }

  return marks.length > 0 ? marks : undefined;
}

function sortMarks(marks: InlineMark[] | undefined): InlineMark[] | undefined {
  if (!marks?.length) {
    return undefined;
  }

  return [...marks].sort((a, b) => a.type.localeCompare(b.type));
}

function marksEqual(
  a: InlineMark[] | undefined,
  b: InlineMark[] | undefined,
): boolean {
  return JSON.stringify(sortMarks(a)) === JSON.stringify(sortMarks(b));
}

function normalizeTextNode(node: InlineTextNode): InlineTextNode {
  const marks = sortMarks(node.marks);
  return marks ? { text: node.text, marks } : { text: node.text };
}

function mergeAdjacentNodes(nodes: InlineTextNode[]): InlineContent {
  const merged: InlineTextNode[] = [];

  for (const node of nodes) {
    const normalized = normalizeTextNode(node);
    const last = merged.at(-1);

    if (last && marksEqual(last.marks, normalized.marks)) {
      last.text += normalized.text;
      continue;
    }

    merged.push({ ...normalized });
  }

  return merged;
}

export function isInlineContent(input: unknown): input is InlineContent {
  return inlineContentSchemaLenient.safeParse(input).success;
}

export function parseInlineContent(input: unknown): InlineContent {
  const result = inlineContentSchema.safeParse(input);
  if (!result.success) {
    throw new InlineContentValidationError(formatZodError(result.error));
  }
  return mergeAdjacentNodes(result.data.map(normalizeTextNode));
}

export function parseInlineMark(input: unknown): InlineMark {
  const result = inlineMarkSchema.safeParse(input);
  if (!result.success) {
    throw new InlineContentValidationError(formatZodError(result.error));
  }
  return result.data;
}

/**
 * 将 string | InlineContent 规范化为 InlineContent。
 * 空 string → []；非空 string → 单节点数组。
 */
export function normalizeInlineContent(input: InlineTextInput): InlineContent {
  if (typeof input === "string") {
    if (input === "") {
      return [];
    }
    return parseInlineContent([{ text: input }]);
  }

  const result = inlineContentSchemaLenient.safeParse(input);
  if (!result.success) {
    throw new InlineContentValidationError(formatZodError(result.error));
  }

  const nonEmpty = result.data
    .map(normalizeTextNode)
    .filter((node) => node.text.length > 0);

  if (nonEmpty.length === 0) {
    return [];
  }

  return mergeAdjacentNodes(nonEmpty);
}
