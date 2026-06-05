import type { BlockType } from "@/core/blocks";

export type ExtractedStyleFeature = {
  key: string;
  value: string;
};

export type HtmlStyleExtractionResult = {
  tagName: string | null;
  features: ExtractedStyleFeature[];
  warnings: string[];
  hasInlineStyle: boolean;
  hasForbiddenCss: boolean;
  hasRiskyCss: boolean;
  hasBoxShadow: boolean;
  inlineStyleRaw: string | null;
};

const STYLE_PROPERTY_KEYS = [
  "color",
  "backgroundColor",
  "background-color",
  "border",
  "borderLeft",
  "border-left",
  "borderRadius",
  "border-radius",
  "fontSize",
  "font-size",
  "fontWeight",
  "font-weight",
  "padding",
  "margin",
  "textAlign",
  "text-align",
  "display",
  "boxShadow",
  "box-shadow",
] as const;

function normalizeStyleKey(key: string): string {
  return key.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
}

function parseInlineStyle(style: string): ExtractedStyleFeature[] {
  const features: ExtractedStyleFeature[] = [];
  for (const chunk of style.split(";")) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;
    const colon = trimmed.indexOf(":");
    if (colon <= 0) continue;
    const key = normalizeStyleKey(trimmed.slice(0, colon).trim());
    const value = trimmed.slice(colon + 1).trim();
    if (key && value) {
      features.push({ key, value });
    }
  }
  return features;
}

function scanCssRisk(html: string, inlineStyle: string | null): {
  hasForbiddenCss: boolean;
  hasRiskyCss: boolean;
  hasBoxShadow: boolean;
  warnings: string[];
} {
  const lower = html.toLowerCase();
  const styleLower = (inlineStyle ?? "").toLowerCase();
  const warnings: string[] = [];

  const hasForbiddenCss =
    lower.includes("<style") ||
    lower.includes("class=") ||
    lower.includes("<link") ||
    lower.includes("!important") ||
    lower.includes("calc(") ||
    lower.includes("var(--");

  if (hasForbiddenCss) {
    warnings.push("FORBIDDEN_CSS_DETECTED");
  }

  const hasBoxShadow =
    styleLower.includes("box-shadow") || styleLower.includes("boxshadow");

  const hasRiskyCss =
    !hasForbiddenCss &&
    (styleLower.includes("display:inline-block") ||
      styleLower.includes("display: inline-block") ||
      styleLower.includes("background-color") ||
      hasBoxShadow);

  if (hasRiskyCss) {
    warnings.push("RISKY_CSS_DETECTED");
  }

  if (!inlineStyle) {
    warnings.push("NO_INLINE_STYLE");
  }

  return { hasForbiddenCss, hasRiskyCss, hasBoxShadow, warnings };
}

export function inferBlockTypeFromHtml(html: string): BlockType | null {
  const lower = html.toLowerCase();
  if (/<h[1-6]\b/.test(lower) || lower.includes("chapter")) {
    return "heading";
  }
  if (lower.includes("阅读路径") || lower.includes("info") || /<section\b/.test(lower)) {
    return "info_card";
  }
  if (/<blockquote\b/.test(lower) || lower.includes("quote")) {
    return "quote";
  }
  if (/<p\b/.test(lower)) {
    return "paragraph";
  }
  return null;
}

export function extractStyleFeaturesFromHtml(html: string): HtmlStyleExtractionResult {
  const trimmed = html.trim();
  if (!trimmed) {
    return {
      tagName: null,
      features: [],
      warnings: ["EMPTY_HTML"],
      hasInlineStyle: false,
      hasForbiddenCss: false,
      hasRiskyCss: false,
      hasBoxShadow: false,
      inlineStyleRaw: null,
    };
  }

  const tagMatch = trimmed.match(/<\s*([a-zA-Z0-9]+)/);
  const tagName = tagMatch?.[1]?.toLowerCase() ?? null;
  const styleMatches = [...trimmed.matchAll(/style\s*=\s*["']([^"']*)["']/gi)];
  const inlineStyles = styleMatches.map((match) => match[1]?.trim()).filter(Boolean);
  const inlineStyleRaw = inlineStyles.length > 0 ? inlineStyles.join("; ") : null;
  const features: ExtractedStyleFeature[] = [];
  const seenKeys = new Set<string>();

  for (const style of inlineStyles) {
    for (const row of parseInlineStyle(style)) {
      const keyLower = row.key.toLowerCase();
      if (seenKeys.has(keyLower)) continue;
      seenKeys.add(keyLower);
      features.push(row);
    }
  }

  for (const key of STYLE_PROPERTY_KEYS) {
    const normalized = normalizeStyleKey(key);
    if (seenKeys.has(normalized.toLowerCase())) {
      continue;
    }
    const propMatch = inlineStyleRaw?.match(
      new RegExp(`${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*:\\s*([^;]+)`, "i"),
    );
    if (propMatch?.[1]) {
      seenKeys.add(normalized.toLowerCase());
      features.push({ key: normalized, value: propMatch[1].trim() });
    }
  }

  const risk = scanCssRisk(trimmed, inlineStyleRaw);
  const warnings = [...risk.warnings];

  if (!tagName) {
    warnings.push("TAG_NOT_DETECTED");
  }

  return {
    tagName,
    features,
    warnings,
    hasInlineStyle: inlineStyleRaw != null,
    hasForbiddenCss: risk.hasForbiddenCss,
    hasRiskyCss: risk.hasRiskyCss,
    hasBoxShadow: risk.hasBoxShadow,
    inlineStyleRaw,
  };
}

export function hashSourceHtml(html: string): string {
  let hash = 5381;
  for (let i = 0; i < html.length; i += 1) {
    hash = (hash * 33) ^ html.charCodeAt(i);
  }
  return `html-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function previewSourceHtml(html: string, max = 120): string {
  const flat = html.replace(/\s+/g, " ").trim();
  return flat.length <= max ? flat : `${flat.slice(0, max)}…`;
}
