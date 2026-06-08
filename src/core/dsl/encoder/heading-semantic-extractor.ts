import type { DslNode, DslStyle } from "../runtime/dsl-types";
import type { TraceLossReportItem, TraceIssue } from "../runtime/dsl-trace-types";
import type { SemanticBinding } from "./fidelity-html-tree";
import { buildSemanticBindings, collectTreeTextContent } from "./fidelity-html-tree";

export type HeadingSemanticSlots = {
  eyebrow?: string;
  number?: string;
  title: string;
  subtitle?: string;
};

export type HeadingSemanticMetadata = {
  slots: HeadingSemanticSlots;
  layoutIntent: string;
  decorators: string[];
  tokens: Record<string, string>;
  semanticBindings: Record<string, SemanticBinding>;
};

export type HeadingSemanticExtraction = HeadingSemanticMetadata & {
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

function parseBackgroundColor(style: string): string {
  const match = style.match(/background-color\s*:\s*([^;]+)/i);
  return match ? match[1].trim() : "";
}

function parseTextTransform(style: string): string {
  const match = style.match(/text-transform\s*:\s*([^;]+)/i);
  return match ? match[1].trim().toLowerCase() : "";
}

function parseDimensionPx(style: string, property: string): number {
  const match = style.match(new RegExp(`${property}\\s*:\\s*([\\d.]+)px`, "i"));
  return match ? Number.parseFloat(match[1]) : 0;
}

function colorOpacity(color: string): number {
  const rgba = color.match(/rgba?\([^)]+\)/i)?.[0] ?? color;
  const parts = rgba.replace(/rgba?\(|\)/g, "").split(",").map((p) => p.trim());
  if (parts.length === 4) {
    return Number.parseFloat(parts[3] ?? "1");
  }
  if (/^#[0-9a-f]{6}$/i.test(color.trim())) {
    const hex = color.trim().slice(1);
    const r = Number.parseInt(hex.slice(0, 2), 16);
    const g = Number.parseInt(hex.slice(2, 4), 16);
    const b = Number.parseInt(hex.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance;
  }
  return 1;
}

function isPureNumber(text: string): boolean {
  return /^\d{1,3}$/.test(text.trim());
}

function isCircularRadiusValue(borderRadius: string | undefined): boolean {
  if (!borderRadius) {
    return false;
  }
  const trimmed = borderRadius.trim().toLowerCase();
  return trimmed === "100%" || trimmed === "50%" || trimmed === "9999px";
}

function inferCircularBadgeNumberFromTree(tree: DslNode): string | undefined {
  let found: string | undefined;

  const walk = (node: DslNode) => {
    if (found || node.type !== "element") {
      return;
    }

    const style = node.style;
    if (
      style?.backgroundColor &&
      isCircularRadiusValue(typeof style.borderRadius === "string" ? style.borderRadius : undefined)
    ) {
      const text = collectTreeTextContent(node).trim();
      if (isPureNumber(text)) {
        found = text;
        return;
      }
    }

    node.children?.forEach(walk);
  };

  if (tree.type === "element") {
    walk(tree);
  }

  return found;
}

function isHeadingTag(tag: string): boolean {
  return /^h[1-6]$/i.test(tag);
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
  const pattern = /<(strong|span|h[1-6])\b([^>]*)>([\s\S]*?)<\/\1>/gi;
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

function extractAccentColorFromDecorators(rawHtml: string): string | undefined {
  const sectionPattern = /<section\b([^>]*)>/gi;
  let match: RegExpExecArray | null;
  while ((match = sectionPattern.exec(rawHtml)) !== null) {
    const attrs = match[1] ?? "";
    const styleMatch = attrs.match(/style\s*=\s*"([^"]*)"/i);
    const style = styleMatch?.[1] ?? "";
    const width = parseDimensionPx(style, "width");
    const height = parseDimensionPx(style, "height");
    const backgroundColor = parseBackgroundColor(style);
    if (width > 0 && width <= 120 && height > 0 && height <= 24 && backgroundColor) {
      return backgroundColor;
    }
  }
  return undefined;
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

  const headingBlocks = blocks.filter(
    (b) => isHeadingTag(b.tag) && !isPureNumber(b.text) && b.text.trim().length > 0,
  );
  const titleFromHeading = [...headingBlocks].sort((a, b) => b.fontSizePx - a.fontSizePx)[0];

  const numberCandidate = [...blocks]
    .filter(
      (b) =>
        isPureNumber(b.text) &&
        (b.fontSizePx >= 36 || colorOpacity(b.color) >= 0.85) &&
        b !== titleFromHeading,
    )
    .sort((a, b) => b.fontSizePx - a.fontSizePx)[0];

  const titleCandidate = titleFromHeading
    ?? [...blocks]
      .filter(
        (b) =>
          b !== eyebrowCandidate &&
          b !== numberCandidate &&
          !isPureNumber(b.text) &&
          (isHeadingTag(b.tag) || b.fontWeight >= 700) &&
          b.fontSizePx >= 16 &&
          b.fontSizePx < 60,
      )
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
    blocks.find(
      (b) =>
        b !== numberCandidate &&
        b !== eyebrowCandidate &&
        !isPureNumber(b.text) &&
        b.fontWeight >= 700,
    )?.text ??
    blocks.find(
      (b) => b !== numberCandidate && b !== eyebrowCandidate && !isPureNumber(b.text),
    )?.text ??
    "";

  return {
    eyebrow: eyebrowCandidate?.text,
    number: numberCandidate?.text,
    title,
    subtitle: subtitleCandidate?.text,
  };
}

function extractTokens(
  blocks: StyledTextBlock[],
  slots: HeadingSemanticSlots,
  accentColor?: string,
): Record<string, string> {
  const tokens: Record<string, string> = {};
  const eyebrow = blocks.find((b) => b.text === slots.eyebrow);
  const number = blocks.find((b) => b.text === slots.number);
  const title =
    blocks.find((b) => b.text === slots.title && isHeadingTag(b.tag)) ??
    blocks.find((b) => b.text === slots.title);
  const subtitle = blocks.find((b) => b.text === slots.subtitle);

  if (number?.color) tokens.numberColor = number.color;
  if (title?.color) tokens.titleColor = title.color;
  if (subtitle?.color) tokens.accentColor = subtitle.color;
  if (eyebrow?.color) tokens.mutedColor = eyebrow.color;
  if (accentColor) tokens.accentColor = accentColor;

  return tokens;
}

function resolveLayoutIntent(slots: HeadingSemanticSlots): string {
  if (slots.number && slots.eyebrow) return "chapter_overlay_heading";
  if (slots.number) return "background_number_heading";
  return "simple_heading";
}

function buildDecorators(slots: HeadingSemanticSlots, rawHtml: string): string[] {
  const decorators: string[] = [];
  if (slots.eyebrow && /border-top/i.test(rawHtml)) decorators.push("top_line");
  if (slots.number) decorators.push("background_number");
  if (slots.subtitle) decorators.push("subtitle_row");
  if (extractAccentColorFromDecorators(rawHtml)) decorators.push("accent_bar");
  return decorators;
}

function inferLargeDisplayNumberFromTree(tree: DslNode): string | undefined {
  let found: string | undefined;

  const parseFontSizePx = (style: DslStyle | undefined): number => {
    const value = style?.fontSize;
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const match = value.match(/^([\d.]+)px$/i);
      return match ? Number.parseFloat(match[1]) : 0;
    }
    return 0;
  };

  const walk = (node: DslNode) => {
    if (found || node.type !== "element") {
      return;
    }
    const text = collectTreeTextContent(node).trim();
    const fontSizePx = parseFontSizePx(node.style);
    if (text && isPureNumber(text) && fontSizePx >= 36) {
      found = text;
      return;
    }
    node.children?.forEach(walk);
  };

  if (tree.type === "element") {
    walk(tree);
  }

  return found;
}

function isWhitespaceOrNbspOnly(text: string): boolean {
  return text.replace(/&nbsp;/gi, " ").replace(/\s+/g, "").length === 0;
}

function isPollutedExtractedTitle(title: string, number?: string): boolean {
  if (isWhitespaceOrNbspOnly(title)) {
    return true;
  }
  if (/&nbsp;/i.test(title)) {
    return true;
  }
  if (number && title.includes(number)) {
    return true;
  }
  return false;
}

function parseTreeFontSizePx(style: DslStyle | undefined): number {
  const value = style?.fontSize;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const match = value.match(/^([\d.]+)px$/i);
    return match ? Number.parseFloat(match[1]) : 0;
  }
  return 0;
}

function parseTreeFontWeight(style: DslStyle | undefined): number {
  const value = style?.fontWeight;
  if (value === "bold") return 700;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : 400;
  }
  return 400;
}

function inferTitleTextFromTree(tree: DslNode): string | undefined {
  let best: { text: string; score: number } | undefined;

  const scoreCandidate = (text: string, path: string, tag: string, style: DslStyle | undefined): number => {
    if (isWhitespaceOrNbspOnly(text) || isPureNumber(text)) {
      return -1000;
    }
    const fontSizePx = parseTreeFontSizePx(style);
    if (fontSizePx >= 36) {
      return -500;
    }
    let score = path.split(".children").length * 10;
    if (tag === "span" || tag === "strong" || isHeadingTag(tag)) score += 30;
    if (fontSizePx >= 16 && fontSizePx <= 28) score += 50;
    if (parseTreeFontWeight(style) >= 700) score += 30;
    return score;
  };

  const walk = (node: DslNode, path: string) => {
    if (node.type !== "element") {
      return;
    }
    const text = collectTreeTextContent(node).trim();
    if (node.style && Object.keys(node.style).length > 0 && text && !isWhitespaceOrNbspOnly(text)) {
      const candidateScore = scoreCandidate(text, path, node.tag, node.style);
      if (candidateScore > (best?.score ?? -Infinity)) {
        best = { text, score: candidateScore };
      }
    }
    node.children?.forEach((child, index) => {
      if (child.type === "element") {
        walk(child, `${path}.children[${index}]`);
      }
    });
  };

  if (tree.type === "element") {
    walk(tree, "tree");
  }

  return best?.text;
}

function buildHeadingSemanticMetadata(
  rawHtml: string,
  tree?: DslNode,
): HeadingSemanticMetadata {
  const htmlForSlotDetection = rawHtml
    .replace(LEAF_SPAN_PATTERN, "$1")
    .replace(EMPTY_BR_PATTERN, "");
  const blocks = collectStyledTextBlocks(htmlForSlotDetection);
  const slots = classifyHeadingSlots(blocks);

  if (!slots.number && tree) {
    const badgeNumber = inferCircularBadgeNumberFromTree(tree);
    if (badgeNumber) {
      slots.number = badgeNumber;
    } else {
      const displayNumber = inferLargeDisplayNumberFromTree(tree);
      if (displayNumber) {
        slots.number = displayNumber;
      }
    }
  }

  if (!slots.title && tree) {
    const titleFromTree = inferTitleTextFromTree(tree);
    if (titleFromTree) {
      slots.title = titleFromTree;
    }
  } else if (tree && (blocks.length === 0 || isPollutedExtractedTitle(slots.title, slots.number))) {
    const titleFromTree = inferTitleTextFromTree(tree);
    if (titleFromTree) {
      slots.title = titleFromTree;
    }
  }

  if (!slots.title) {
    const headingText = blocks.find((b) => isHeadingTag(b.tag))?.text;
    if (headingText) {
      slots.title = headingText;
    } else {
      const fallback = stripTags(rawHtml);
      if (fallback) slots.title = fallback;
    }
  }

  const accentColor = extractAccentColorFromDecorators(rawHtml);
  const tokens = extractTokens(blocks, slots, accentColor);
  const decorators = buildDecorators(slots, rawHtml);
  const layoutIntent = resolveLayoutIntent(slots);
  const semanticBindings = tree ? buildSemanticBindings(tree, slots) : {};

  return { slots, layoutIntent, decorators, tokens, semanticBindings };
}

/** Metadata-only extraction for fidelity encode — does not detect or report structural downgrades. */
export function extractHeadingSemanticsMetadataOnly(
  rawHtml: string,
  tree?: DslNode,
): HeadingSemanticMetadata {
  return buildHeadingSemanticMetadata(rawHtml, tree);
}

export function extractHeadingSemanticsFromHtml(rawHtml: string): HeadingSemanticExtraction {
  const lossReport: TraceLossReportItem[] = [];
  const issues: TraceIssue[] = [];

  detectStructuralLoss(rawHtml, lossReport);

  let normalizedHtml = unwrapLeafSpans(rawHtml, lossReport);
  normalizedHtml = normalizedHtml.replace(/\s+/g, " ").trim();

  const metadata = buildHeadingSemanticMetadata(normalizedHtml);

  if (/display\s*:\s*flex/i.test(rawHtml)) {
    issues.push({
      code: "WECHAT_FLEX_LAYOUT_RISK",
      message: "Complex flex layout normalized to shallow DSL tree",
      severity: "risk",
    });
  }

  return {
    ...metadata,
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
