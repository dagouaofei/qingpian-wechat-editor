import type {
  EncoderTrace,
  EncoderInputKindTrace,
  TraceIssue,
  TraceLossReportItem,
} from "../runtime/dsl-trace-types";
import type { BorderedHeadingExtraction } from "./bordered-heading-extractor";
import type { EncoderIssue } from "./encoder-types";
import type { HeadingSemanticExtraction } from "./heading-semantic-extractor";

export function mapEncoderIssuesToTraceIssues(issues: EncoderIssue[]): TraceIssue[] {
  return issues.map((issue) => ({
    code: issue.code,
    message: issue.message,
    severity: issue.code === "no_extractable_text" ? "blocking" : "warning",
  }));
}

export function buildBorderedHeadingEncoderTrace(
  extraction: BorderedHeadingExtraction,
  encoderIssues: EncoderIssue[],
): EncoderTrace {
  return {
    inputKind: "html",
    extractedSlots: { title: extraction.title },
    styleTokens: extraction.styleTokens,
    layoutIntent: extraction.layoutIntent,
    decorators: [],
    lossReport: [...extraction.lossReport],
    issues: mapEncoderIssuesToTraceIssues(encoderIssues),
  };
}

export function buildHtmlEncoderTrace(
  extraction: HeadingSemanticExtraction,
  encoderIssues: EncoderIssue[],
): EncoderTrace {
  const extractedSlots: Record<string, string> = {};
  if (extraction.slots.eyebrow) extractedSlots.eyebrow = extraction.slots.eyebrow;
  if (extraction.slots.number) extractedSlots.number = extraction.slots.number;
  extractedSlots.title = extraction.slots.title;
  if (extraction.slots.subtitle) extractedSlots.subtitle = extraction.slots.subtitle;

  return {
    inputKind: "html",
    extractedSlots,
    styleTokens: extraction.tokens,
    layoutIntent: extraction.layoutIntent,
    decorators: extraction.decorators,
    lossReport: [...extraction.lossReport],
    issues: [...extraction.issues, ...mapEncoderIssuesToTraceIssues(encoderIssues)],
  };
}

export function mergeLossReports(
  ...groups: TraceLossReportItem[][]
): TraceLossReportItem[] {
  const seen = new Set<string>();
  const merged: TraceLossReportItem[] = [];
  for (const group of groups) {
    for (const entry of group) {
      const key = `${entry.code}:${entry.message}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(entry);
    }
  }
  return merged;
}

export function buildRegistryEncoderTrace(
  runtimeVariantId: string,
  blockType: string,
): EncoderTrace {
  return {
    inputKind: "registry",
    extractedSlots: { title: runtimeVariantId },
    styleTokens: { blockType },
    lossReport: [],
    issues: [],
  };
}

export function encoderInputKindForSource(
  source: "html" | "registry" | "manual" | "ai",
): EncoderInputKindTrace {
  return source;
}
