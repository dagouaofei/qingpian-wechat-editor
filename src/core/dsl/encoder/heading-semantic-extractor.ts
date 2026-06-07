import type { DslNode, DslStyle } from "../runtime/dsl-types";
import type { TraceLossReportItem, TraceIssue } from "../runtime/dsl-trace-types";

export type HeadingSemanticSlots = {
  eyebrow?: string;
  number?: string;
  title: string;
  subtitle?: string;
};

export type HeadingSemanticExtraction = {
  slots: HeadingSemanticSlots;
  layoutIntent: string;
  decorators: string[];
  tokens: Record<string, string>;
  lossReport: TraceLossReportItem[];
  issues: TraceIssue[];
  normalizedHtml: string;
};

type StyledTextBlock = {
  text: string;
  fontSizePx: number;
  fontWeight: number;
  color: string;
  textTransform: string;
  tag: string;
  hasNegativeMargin: boolean;
};

const LEAF_SPAN_PATTERN = /<span\s+leaf\s*=[^>]*>([\s\S]*?)<\/span>/gi;
const EMPTY_BR_PATTERN = /<span\s+leaf\s*=[^>]*>\s*<br\s*\/?>\s*<\/span>/gi;

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function parseFontSizePx(style: string): number {
  const match = style.match(/font-size\s*:\s*([\d.]+)px/i);
  return match ? Number.parseFloat(match[1]) : 16;
}

function parseFontWeight(style: string): number {
  const match = style.match(/font-weight\s*:\s*(\d+|bold)/i);
  if (!match) return 400;
  if (match[1].toLowerCase() === "bold") return 700;
  return Number.parseInt(match[1], 10);
}

function parseColor(style: string): string {
  const match = style.match(/color\s*:\s*([^;]+)/i);
  return match ? match[1].trim() : "";
}

function parseTextTransform(style: string): string {
  const match = style.match(/text-transform\s*:\s*([^;]+)/i);
  return match ? match[1].trim().toLowerCase() : "";
}

function colorOpacity(color: string): number {
  const rgba = color.match(/rgba?\([^)]+\)/i)?.[0] ?? color;
  const parts = rgba.replace(/rgba?\(|\)/g, "").split(",").map((p) => p.trim());
  if (parts.length === 4) {
    return Number.parseFloat(parts[3] ?? "1");
  }
  return 1;
}

function unwrapLeafSpans(html: string, lossReport: TraceLossReportItem[]): string {
  let output = html;
  if (LEAF_SPAN_PATTERN.test(html)) {
    lossReport.push({ code: "leaf_span_unwrapped", message: "Unwrapped leaf span wrappers" });
  }
  output = output.replace(LEAF_SPAN_PATTERN, "$1");
  if (EMPTY_BR_PATTERN.test(html)) {
    lossReport.push({ code: "empty_br_removed", message: "Removed empty br leaf span" });
  }
  output = output.replace(EMPTY_BR_PATTERN, "");
  return output;
}

function collectStyledTextBlocks(html: string): StyledTextBlock[] {
  const blocks: StyledTextBlock[] = [];
  const pattern = /<(strong|span)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(html)) !== null) {
    const tag = match[1].toLowerCase();
    const attrs = match[2] ?? "";
    const inner = match[3] ?? "";
    const text = stripTags(inner);
    if (!text || text === "<br>" || text === "<br/>") continue;
    const styleMatch = attrs.match(/style\s*=\s*"([^"]*)"/i);
    const style = styleMatch?.[1] ?? "";
    blocks.push({
      text,
      fontSizePx: parseFontSizePx(style),
      fontWeight: parseFontWeight(style),
      color: parseColor(style),
      textTransform: parseTextTransform(style),
      tag,
      hasNegativeMargin: /margin-top\s*:\s*-\d/i.test(style),
    });
  }
  return blocks;
}

function detectStructuralLoss(rawHtml: string, lossReport: TraceLossReportItem[]): void {
  if (/display\s*:\s*flex/i.test(rawHtml)) {
    lossReport.push({
      code: "flex_layout_downgraded",
      message: "display:flex downgraded — layout expressed via normalized DSL tree",
    });
  }
  if (/letter-spacing/i.test(rawHtml)) {
    lossReport.push({
      code: "letter_spacing_risky",
      message: "letter-spacing risky — not preserved in normalized DSL tokens",
    });
  }
  if (/margin-top\s*:\s*-\d/i.test(rawHtml)) {
    lossReport.push({
      code: "negative_margin_normalized",
      message: "negative margin normalized — overlay layout via tokens instead",
    });
  }
  const sectionCount = (rawHtml.match(/<section\b/gi) ?? []).length;
  if (sectionCount > 3) {
    lossReport.push({
      code: "deep_nesting_flattened",
      message: `deep nesting flattened (${sectionCount} section levels)`,
    });
  }
}

function classifyHeadingSlots(blocks: StyledTextBlock[]): HeadingSemanticSlots {
  if (blocks.length === 0) {
    return { title: "" };
  }

  const sorted = [...blocks].sort((a, b) => a.fontSizePx - b.fontSizePx);
  const eyebrowCandidate = sorted.find(
    (b) =>
      b.fontSizePx <= 12 &&
      (b.textTransform === "uppercase" || b.text === b.text.toUpperCase()),
  );

  const numberCandidate = [...blocks]
    .filter((b) => b.fontSizePx >= 40 || colorOpacity(b.color) < 0.5)
    .sort((a, b) => b.fontSizePx - a.fontSizePx)[0];

  const titleCandidate = [...blocks]
    .filter((b) => b.fontWeight >= 700 && b.fontSizePx >= 20 && b.fontSizePx < 50)
    .sort((a, b) => b.fontSizePx - a.fontSizePx)[0];

  const subtitleCandidate = blocks.find(
    (b) =>
      b !== eyebrowCandidate &&
      b !== numberCandidate &&
      b !== titleCandidate &&
      (b.textTransform === "uppercase" || b.fontSizePx <= 14),
  );

  const title =
    titleCandidate?.text ??
    blocks.find((b) => b.fontWeight >= 700)?.text ??
    blocks[blocks.length - 1]?.text ??
    "";

  return {
    eyebrow: eyebrowCandidate?.text,
    number: numberCandidate?.text,
    title,
    subtitle: subtitleCandidate?.text,
  };
}

function extractTokens(blocks: StyledTextBlock[], slots: HeadingSemanticSlots): Record<string, string> {
  const tokens: Record<string, string> = {};
  const eyebrow = blocks.find((b) => b.text === slots.eyebrow);
  const number = blocks.find((b) => b.text === slots.number);
  const title = blocks.find((b) => b.text === slots.title);
  const subtitle = blocks.find((b) => b.text === slots.subtitle);

  if (subtitle?.color) tokens.accentColor = subtitle.color;
  if (eyebrow?.color) tokens.mutedColor = eyebrow.color;
  if (title?.color) tokens.titleColor = title.color;
  if (number?.color) tokens.numberColor = number.color;

  return tokens;
}

export function extractHeadingSemanticsFromHtml(rawHtml: string): HeadingSemanticExtraction {
  const lossReport: TraceLossReportItem[] = [];
  const issues: TraceIssue[] = [];

  detectStructuralLoss(rawHtml, lossReport);

  let normalizedHtml = unwrapLeafSpans(rawHtml, lossReport);
  normalizedHtml = normalizedHtml.replace(/\s+/g, " ").trim();

  const blocks = collectStyledTextBlocks(normalizedHtml);
  const slots = classifyHeadingSlots(blocks);

  if (!slots.title) {
    const fallback = stripTags(normalizedHtml);
    if (fallback) slots.title = fallback;
  }

  const tokens = extractTokens(blocks, slots);
  const decorators: string[] = [];
  if (slots.eyebrow && /border-top/i.test(rawHtml)) decorators.push("top_line");
  if (slots.number) decorators.push("background_number");
  if (slots.subtitle) decorators.push("subtitle_row");

  const layoutIntent =
    slots.number && slots.eyebrow ? "chapter_overlay_heading" : "simple_heading";

  if (/display\s*:\s*flex/i.test(rawHtml)) {
    issues.push({
      code: "WECHAT_FLEX_LAYOUT_RISK",
      message: "Complex flex layout normalized to shallow DSL tree",
      severity: "risk",
    });
  }

  return {
    slots,
    layoutIntent,
    decorators,
    tokens,
    lossReport,
    issues,
    normalizedHtml,
  };
}

export function buildSemanticHeadingTree(
  extraction: HeadingSemanticExtraction,
): DslNode {
  const { slots, tokens, layoutIntent } = extraction;
  const accent = tokens.accentColor ?? "#6c5ce7";
  const muted = tokens.mutedColor ?? "#94a3b8";
  const titleColor = tokens.titleColor ?? "#111827";
  const numberColor = tokens.numberColor ?? "rgba(108,92,231,0.25)";

  const eyebrowStyle: DslStyle = {
    display: "block",
    fontSize: "10px",
    fontWeight: 800,
    color: muted,
    textTransform: "uppercase",
    letterSpacing: "1px",
  };

  const children: DslNode[] = [];

  if (slots.eyebrow || layoutIntent === "chapter_overlay_heading") {
    children.push({
      type: "element",
      tag: "section",
      style: { paddingBottom: "12px", borderBottom: "1px solid #e5e7eb", marginBottom: "8px" },
      children: [{ type: "slot", slot: "eyebrow", tag: "span", style: eyebrowStyle }],
    });
  }

  const bodyChildren: DslNode[] = [];

  if (slots.number) {
    bodyChildren.push({
      type: "slot",
      slot: "number",
      tag: "span",
      style: {
        display: "block",
        fontSize: "48px",
        lineHeight: "1",
        color: numberColor,
        fontWeight: 700,
      },
    });
  }

  bodyChildren.push({
    type: "slot",
    slot: "title",
    tag: "strong",
    style: {
      display: "block",
      fontSize: "30px",
      fontWeight: 900,
      color: titleColor,
      lineHeight: "1.26",
      marginTop: slots.number ? "4px" : "0",
    },
  });

  if (slots.subtitle) {
    bodyChildren.push({
      type: "slot",
      slot: "subtitle",
      tag: "span",
      style: {
        display: "block",
        fontSize: "11px",
        fontWeight: 700,
        color: accent,
        textTransform: "uppercase",
        marginTop: "6px",
      },
    });
  }

  children.push({
    type: "element",
    tag: "section",
    style: { margin: "0" },
    children: bodyChildren,
  });

  return {
    type: "element",
    tag: "section",
    style: { margin: "24px 0" },
    children,
  };
}
