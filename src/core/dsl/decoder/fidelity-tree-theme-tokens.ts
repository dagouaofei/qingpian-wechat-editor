import type { ThemePaletteTokens } from "@/core/styles/theme-palette-tokens";

import type { SemanticBinding } from "../encoder/fidelity-html-tree";
import type { DslNode, DslRenderTarget, DslStyle, DslStyleValue, VariantDslV1 } from "../runtime/dsl-types";
import { resolveDslNodeAtPath } from "./fidelity-tree-substitution";

const HTML_PASTE_FAMILIES = new Set(["htmlPaste", "htmlPasteCandidate"]);

const ROLE_COLOR_TOKEN: Record<string, keyof ThemePaletteTokens> = {
  title: "textDefault",
  eyebrow: "textMuted",
  subtitle: "textAccent",
  number: "bgBand",
};

const BORDER_STYLE_PATTERN = /\b(solid|dashed|dotted)\b/i;
const BORDER_COLOR_PATTERN =
  /(#(?:[0-9a-f]{3,8})|rgba?\([^)]+\))/i;

const WEBKIT_TEXT_STROKE_KEYS = ["WebkitTextStroke", "webkitTextStroke"] as const;

function readSemanticBindings(dsl: VariantDslV1): Record<string, SemanticBinding> {
  const bindings = dsl.meta?.semanticBindings;
  if (typeof bindings !== "object" || bindings === null || Array.isArray(bindings)) {
    return {};
  }
  return bindings as Record<string, SemanticBinding>;
}

function readDecorators(dsl: VariantDslV1): string[] {
  const decorators = dsl.meta?.decorators;
  if (!Array.isArray(decorators)) {
    return [];
  }
  return decorators.filter((entry): entry is string => typeof entry === "string");
}

function readSourceTokenColors(dsl: VariantDslV1): string[] {
  const tokens = dsl.tokens;
  if (!tokens || typeof tokens !== "object") {
    return [];
  }
  return Object.values(tokens).filter((value): value is string => typeof value === "string");
}

function parseDimensionPx(value: DslStyleValue | undefined): number {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value !== "string") {
    return 0;
  }
  const match = value.match(/^([\d.]+)px$/i);
  return match ? Number.parseFloat(match[1]) : 0;
}

function normalizeColor(color: string): string {
  return color.trim().toLowerCase().replace(/\s+/g, "");
}

function isZeroStyleValue(value: DslStyleValue | undefined): boolean {
  if (value === 0) {
    return true;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "0" || trimmed === "0px";
  }
  return false;
}

function extractBorderColor(borderValue: string): string | null {
  const match = borderValue.match(BORDER_COLOR_PATTERN);
  return match?.[1] ?? null;
}

function borderColorMatches(borderValue: string, sourceColor: string): boolean {
  const extracted = extractBorderColor(borderValue);
  if (!extracted) {
    return false;
  }
  return normalizeColor(extracted) === normalizeColor(sourceColor);
}

function matchesAnySourceTokenColor(color: string, dsl: VariantDslV1): boolean {
  const normalized = normalizeColor(color);
  return readSourceTokenColors(dsl).some((tokenColor) => normalizeColor(tokenColor) === normalized);
}

export function replaceBorderSolidColor(borderValue: string, newColor: string): string {
  const match = borderValue.match(BORDER_COLOR_PATTERN);
  if (!match?.[0]) {
    return borderValue;
  }
  return borderValue.replace(match[0], newColor);
}

function isMeaningfulBorderValue(value: DslStyleValue | undefined): boolean {
  if (value === undefined || value === null) {
    return false;
  }
  if (typeof value === "string") {
    const trimmed = value.trim().toLowerCase();
    return trimmed.length > 0 && trimmed !== "none" && trimmed !== "0";
  }
  return true;
}

function isBottomOnlyBorderWidth(value: DslStyleValue | undefined): boolean {
  if (typeof value !== "string") {
    return false;
  }
  const normalized = value.trim().replace(/\s+/g, " ");
  return /^0(?:px)?\s+0(?:px)?\s+([1-4])px$/i.test(normalized);
}

function parseBorderBottomWidthFromShorthand(borderBottom: string): number | null {
  const match = borderBottom.match(/^([\d.]+)px\b/i);
  return match ? Number.parseFloat(match[1]) : null;
}

function hasFullBoxBorder(style: DslStyle): boolean {
  if (isMeaningfulBorderValue(style.borderRadius)) {
    return true;
  }
  if (isMeaningfulBorderValue(style.borderLeft)) {
    return true;
  }
  if (isMeaningfulBorderValue(style.border) && typeof style.border === "string") {
    const trimmed = style.border.trim().toLowerCase();
    if (trimmed && trimmed !== "none" && !/^0/.test(trimmed)) {
      return true;
    }
  }
  if (
    typeof style.borderWidth === "string" &&
    !isBottomOnlyBorderWidth(style.borderWidth) &&
    isMeaningfulBorderValue(style.borderWidth)
  ) {
    return true;
  }
  return false;
}

function isDecorativeBorderBottom(style: DslStyle, dsl: VariantDslV1): boolean {
  if (hasFullBoxBorder(style)) {
    return false;
  }

  const borderBottom = style.borderBottom;
  if (typeof borderBottom === "string" && BORDER_STYLE_PATTERN.test(borderBottom)) {
    const width = parseBorderBottomWidthFromShorthand(borderBottom);
    if (width !== null && width >= 1 && width <= 4) {
      return true;
    }
    if (isZeroStyleValue(style.lineHeight) || isZeroStyleValue(style.fontSize)) {
      return true;
    }
    const extracted = extractBorderColor(borderBottom);
    if (extracted && matchesAnySourceTokenColor(extracted, dsl)) {
      return true;
    }
  }

  if (
    isBottomOnlyBorderWidth(style.borderWidth) &&
    typeof style.borderColor === "string" &&
    isMeaningfulBorderValue(style.borderStyle)
  ) {
    return true;
  }

  return false;
}

function remapDecorativeLineAccent(
  style: DslStyle,
  accentColor: string,
  dsl: VariantDslV1,
): DslStyle | undefined {
  if (!isDecorativeBorderBottom(style, dsl)) {
    return undefined;
  }

  const next: DslStyle = { ...style };

  if (typeof next.borderBottom === "string") {
    next.borderBottom = replaceBorderSolidColor(next.borderBottom, accentColor);
    next.display = next.display ?? "inline-block";
    next.width = next.width ?? "auto";
  }

  if (isBottomOnlyBorderWidth(next.borderWidth) && typeof next.borderColor === "string") {
    next.borderColor = accentColor;
    next.display = next.display ?? "inline-block";
    next.width = next.width ?? "auto";
  }

  return next;
}

function isAccentBarNode(node: DslNode): boolean {
  if (node.type !== "element" || !node.style) {
    return false;
  }
  const backgroundColor = node.style.backgroundColor;
  if (!backgroundColor || typeof backgroundColor !== "string") {
    return false;
  }
  const width = parseDimensionPx(node.style.width);
  const height = parseDimensionPx(node.style.height);
  return width > 0 && width <= 120 && height > 0 && height <= 24;
}

function isCircularRadius(borderRadius: DslStyleValue | undefined): boolean {
  if (typeof borderRadius !== "string") {
    return false;
  }
  const trimmed = borderRadius.trim().toLowerCase();
  return trimmed === "100%" || trimmed === "50%" || trimmed === "9999px";
}

function isCircularBadgeNode(node: DslNode): boolean {
  if (node.type !== "element" || !node.style) {
    return false;
  }
  if (!isCircularRadius(node.style.borderRadius)) {
    return false;
  }
  const backgroundColor = node.style.backgroundColor;
  return typeof backgroundColor === "string" && backgroundColor.trim().length > 0;
}

function setElementStyleColor(
  node: DslNode,
  property: "color" | "backgroundColor",
  value: string,
): void {
  if (node.type !== "element" && node.type !== "slot") {
    return;
  }
  node.style = { ...node.style, [property]: value };
}

function remapNumberTextStroke(node: DslNode, palette: ThemePaletteTokens): void {
  if (node.type !== "element" && node.type !== "slot") {
    return;
  }
  if (!node.style) {
    return;
  }

  for (const key of WEBKIT_TEXT_STROKE_KEYS) {
    const stroke = node.style[key];
    if (typeof stroke !== "string" || !stroke.trim()) {
      continue;
    }
    const widthMatch = stroke.match(/^([\d.]+px)\s+/i);
    const widthPrefix = widthMatch?.[1] ?? "1px";
    node.style = {
      ...node.style,
      [key]: `${widthPrefix} ${palette.borderLight}`,
    };
  }
}

function applyRoleColorAtPath(
  tree: DslNode,
  path: string,
  tokenKey: keyof ThemePaletteTokens,
  palette: ThemePaletteTokens,
  dsl: VariantDslV1,
  role: string,
): void {
  const node = resolveDslNodeAtPath(tree, path);
  if (!node) {
    return;
  }
  setElementStyleColor(node, "color", palette[tokenKey]);
  if (role === "number") {
    remapNumberTextStroke(node, palette);
  }
  if (node.type === "element" && node.style) {
    const remapped = remapDecorativeLineAccent(node.style, palette.textAccent, dsl);
    if (remapped) {
      node.style = remapped;
    }
  }
}

function applyDecorativeLineThemeTokens(
  tree: DslNode,
  dsl: VariantDslV1,
  palette: ThemePaletteTokens,
): void {
  const walk = (node: DslNode) => {
    if (node.type !== "element" || !node.style) {
      return;
    }

    const remapped = remapDecorativeLineAccent(node.style, palette.textAccent, dsl);
    if (remapped) {
      node.style = remapped;
    }

    node.children?.forEach(walk);
  };

  walk(tree);
}

function applyCircularBadgeThemeTokens(
  tree: DslNode,
  dsl: VariantDslV1,
  palette: ThemePaletteTokens,
): void {
  const sourceAccent = dsl.tokens?.accentColor;
  const normalizedSource = sourceAccent ? normalizeColor(sourceAccent) : null;

  const walk = (node: DslNode) => {
    if (node.type !== "element") {
      return;
    }

    if (isCircularBadgeNode(node)) {
      const backgroundColor = node.style?.backgroundColor;
      if (typeof backgroundColor === "string") {
        const matchesSource =
          !normalizedSource || normalizeColor(backgroundColor) === normalizedSource;
        const matchesToken = matchesAnySourceTokenColor(backgroundColor, dsl);
        if (matchesSource || matchesToken) {
          setElementStyleColor(node, "backgroundColor", palette.textAccent);
          const borderColor = node.style?.borderColor;
          if (
            typeof borderColor === "string" &&
            (matchesSource ||
              matchesToken ||
              normalizeColor(borderColor) === normalizeColor(backgroundColor))
          ) {
            setElementStyleColor(node, "borderColor", palette.textAccent);
          }
        }
      }
    }

    node.children?.forEach(walk);
  };

  walk(tree);
}

function applyAccentBarThemeTokens(
  tree: DslNode,
  dsl: VariantDslV1,
  palette: ThemePaletteTokens,
): void {
  const sourceAccent = dsl.tokens?.accentColor;
  const normalizedSource = sourceAccent ? normalizeColor(sourceAccent) : null;

  const walk = (node: DslNode) => {
    if (node.type !== "element") {
      return;
    }

    if (isAccentBarNode(node)) {
      const backgroundColor = node.style?.backgroundColor;
      if (typeof backgroundColor === "string") {
        const matchesSource =
          !normalizedSource || normalizeColor(backgroundColor) === normalizedSource;
        if (matchesSource) {
          setElementStyleColor(node, "backgroundColor", palette.textAccent);
        }
      }
    }

    node.children?.forEach(walk);
  };

  walk(tree);
}

export function shouldApplyFidelityThemeTokens(
  dsl: VariantDslV1,
  target: DslRenderTarget,
  themePalette?: ThemePaletteTokens,
): themePalette is ThemePaletteTokens {
  if (!themePalette) {
    return false;
  }
  if (target === "admin_inspection") {
    return false;
  }
  if (!dsl.tree) {
    return false;
  }
  if (!HTML_PASTE_FAMILIES.has(dsl.family ?? "")) {
    return false;
  }
  const bindings = dsl.meta?.semanticBindings;
  if (typeof bindings !== "object" || bindings === null || Array.isArray(bindings)) {
    return false;
  }
  return Object.keys(bindings).length > 0;
}

export function applyFidelityTreeThemeTokens(
  tree: DslNode,
  dsl: VariantDslV1,
  themePalette: ThemePaletteTokens,
): DslNode {
  const bindings = readSemanticBindings(dsl);

  for (const [role, tokenKey] of Object.entries(ROLE_COLOR_TOKEN)) {
    const path = bindings[role]?.path;
    if (path) {
      applyRoleColorAtPath(tree, path, tokenKey, themePalette, dsl, role);
    }
  }

  if (readDecorators(dsl).includes("accent_bar")) {
    applyAccentBarThemeTokens(tree, dsl, themePalette);
  }

  applyCircularBadgeThemeTokens(tree, dsl, themePalette);
  applyDecorativeLineThemeTokens(tree, dsl, themePalette);

  return tree;
}
