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
  const colors: string[] = [];
  const tokens = dsl.tokens;
  if (tokens && typeof tokens === "object") {
    for (const value of Object.values(tokens)) {
      if (typeof value === "string") {
        colors.push(value);
      }
    }
  }

  const styleTokens = dsl.meta?.styleTokens;
  if (styleTokens && typeof styleTokens === "object" && !Array.isArray(styleTokens)) {
    for (const value of Object.values(styleTokens as Record<string, unknown>)) {
      if (typeof value !== "string") {
        continue;
      }
      const borderColor = extractBorderColor(value);
      if (borderColor) {
        colors.push(borderColor);
      } else if (/^(#|rgb)/i.test(value.trim())) {
        colors.push(value.trim());
      }
    }
  }

  return colors;
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

function parseBorderWidthFromShorthand(borderShorthand: string): number | null {
  const match = borderShorthand.match(/^([\d.]+)px\b/i);
  return match ? Number.parseFloat(match[1]) : null;
}

type BorderSide = "top" | "right" | "bottom" | "left";

const BORDER_SIDE_CSS: Record<
  BorderSide,
  {
    shorthand: keyof DslStyle;
    width: keyof DslStyle;
    color: keyof DslStyle;
    style: keyof DslStyle;
    maxWidthPx: number;
  }
> = {
  top: {
    shorthand: "borderTop",
    width: "borderTopWidth",
    color: "borderTopColor",
    style: "borderTopStyle",
    maxWidthPx: 4,
  },
  right: {
    shorthand: "borderRight",
    width: "borderRightWidth",
    color: "borderRightColor",
    style: "borderRightStyle",
    maxWidthPx: 4,
  },
  bottom: {
    shorthand: "borderBottom",
    width: "borderBottomWidth",
    color: "borderBottomColor",
    style: "borderBottomStyle",
    maxWidthPx: 4,
  },
  left: {
    shorthand: "borderLeft",
    width: "borderLeftWidth",
    color: "borderLeftColor",
    style: "borderLeftStyle",
    maxWidthPx: 6,
  },
};

function isSideOnlyBorderWidth(value: DslStyleValue | undefined, side: BorderSide): boolean {
  if (typeof value !== "string") {
    return false;
  }
  const normalized = value.trim().replace(/\s+/g, " ");
  switch (side) {
    case "bottom":
      return /^0(?:px)?\s+0(?:px)?\s+([1-4])px$/i.test(normalized);
    case "top":
      return /^([1-4])px\s+0(?:px)?\s+0(?:px)?\s+0(?:px)?$/i.test(normalized);
    case "left":
      return /^([1-6])px\s+0(?:px)?\s+0(?:px)?\s+0(?:px)?$/i.test(normalized);
    case "right":
      return /^0(?:px)?\s+([1-4])px\s+0(?:px)?\s+0(?:px)?$/i.test(normalized);
  }
}

function isFullCardBorder(style: DslStyle): boolean {
  if (!isMeaningfulBorderValue(style.borderRadius)) {
    return false;
  }
  if (isMeaningfulBorderValue(style.border)) {
    return true;
  }
  return (
    isMeaningfulBorderValue(style.borderTop) ||
    isMeaningfulBorderValue(style.borderRight) ||
    isMeaningfulBorderValue(style.borderBottom) ||
    isMeaningfulBorderValue(style.borderLeft)
  );
}

function readStyleString(style: DslStyle, key: keyof DslStyle): string | undefined {
  const value = style[key];
  return typeof value === "string" ? value : undefined;
}

function isDecorativeBorderSide(style: DslStyle, side: BorderSide, dsl: VariantDslV1): boolean {
  if (side === "bottom" && isFullCardBorder(style)) {
    return false;
  }

  const sideCss = BORDER_SIDE_CSS[side];
  const shorthand = readStyleString(style, sideCss.shorthand);
  if (shorthand && BORDER_STYLE_PATTERN.test(shorthand)) {
    const width = parseBorderWidthFromShorthand(shorthand);
    if (width !== null && width >= 1 && width <= sideCss.maxWidthPx) {
      return true;
    }
    if (
      side === "bottom" &&
      (isZeroStyleValue(style.lineHeight) || isZeroStyleValue(style.fontSize))
    ) {
      return true;
    }
    const extracted = extractBorderColor(shorthand);
    if (extracted && matchesAnySourceTokenColor(extracted, dsl)) {
      return true;
    }
  }

  const splitWidth = style[sideCss.width];
  const splitColor = readStyleString(style, sideCss.color);
  if (isMeaningfulBorderValue(splitWidth) && splitColor) {
    const widthPx = parseDimensionPx(typeof splitWidth === "string" ? splitWidth : undefined);
    if (widthPx >= 1 && widthPx <= sideCss.maxWidthPx) {
      return true;
    }
    if (matchesAnySourceTokenColor(splitColor, dsl)) {
      return true;
    }
  }

  if (
    isSideOnlyBorderWidth(style.borderWidth, side) &&
    typeof style.borderColor === "string" &&
    isMeaningfulBorderValue(style.borderStyle)
  ) {
    return true;
  }

  return false;
}

function applyInlineBlockForDecorativeLine(style: DslStyle, side: BorderSide): void {
  if (side === "bottom" || side === "top") {
    style.display = style.display ?? "inline-block";
    style.width = style.width ?? "auto";
  }
}

function remapDecorativeBorderAccents(
  style: DslStyle,
  accentColor: string,
  dsl: VariantDslV1,
): DslStyle | undefined {
  const next: DslStyle = { ...style };
  let changed = false;

  for (const side of ["top", "right", "bottom", "left"] as const) {
    if (!isDecorativeBorderSide(style, side, dsl)) {
      continue;
    }

    const sideCss = BORDER_SIDE_CSS[side];
    const shorthandKey = sideCss.shorthand;
    const shorthand = readStyleString(next, shorthandKey);
    if (shorthand) {
      next[shorthandKey] = replaceBorderSolidColor(shorthand, accentColor);
      applyInlineBlockForDecorativeLine(next, side);
      changed = true;
    }

    const splitColorKey = sideCss.color;
    const splitWidth = next[sideCss.width];
    if (isMeaningfulBorderValue(splitWidth) && typeof next[splitColorKey] === "string") {
      next[splitColorKey] = accentColor;
      applyInlineBlockForDecorativeLine(next, side);
      changed = true;
    }
  }

  for (const side of ["top", "right", "bottom", "left"] as const) {
    if (
      isSideOnlyBorderWidth(next.borderWidth, side) &&
      typeof next.borderColor === "string" &&
      isMeaningfulBorderValue(next.borderStyle) &&
      isDecorativeBorderSide(next, side, dsl)
    ) {
      next.borderColor = accentColor;
      applyInlineBlockForDecorativeLine(next, side);
      changed = true;
    }
  }

  return changed ? next : undefined;
}

const TOKEN_MATCHED_BORDER_PROPS = [
  "border",
  "borderTop",
  "borderRight",
  "borderBottom",
  "borderLeft",
  "borderColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
] as const satisfies readonly (keyof DslStyle)[];

function remapTokenMatchedBorderColors(
  style: DslStyle,
  accentColor: string,
  dsl: VariantDslV1,
): DslStyle | undefined {
  const next: DslStyle = { ...style };
  let changed = false;

  for (const prop of TOKEN_MATCHED_BORDER_PROPS) {
    const value = readStyleString(next, prop);
    if (!value) {
      continue;
    }

    const colorValue =
      prop === "borderColor" || prop.endsWith("Color") ? value : extractBorderColor(value);
    if (!colorValue || !matchesAnySourceTokenColor(colorValue, dsl)) {
      continue;
    }

    if (prop === "borderColor" || prop.endsWith("Color")) {
      next[prop] = accentColor;
    } else {
      next[prop] = replaceBorderSolidColor(value, accentColor);
    }
    changed = true;
  }

  return changed ? next : undefined;
}

function remapBorderThemeAccents(
  style: DslStyle,
  accentColor: string,
  dsl: VariantDslV1,
): DslStyle | undefined {
  const decorative = remapDecorativeBorderAccents(style, accentColor, dsl);
  const tokenMatched = remapTokenMatchedBorderColors(decorative ?? style, accentColor, dsl);
  return tokenMatched ?? decorative;
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

function hasWebkitTextStroke(style: DslStyle): boolean {
  for (const key of WEBKIT_TEXT_STROKE_KEYS) {
    const stroke = style[key];
    if (typeof stroke === "string" && stroke.trim()) {
      return true;
    }
  }
  return false;
}

function colorHasSubstantialTransparency(color: string | undefined): boolean {
  if (!color) {
    return false;
  }
  const rgbaMatch = color.match(/rgba\s*\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*([\d.]+)\s*\)/i);
  if (rgbaMatch) {
    return Number.parseFloat(rgbaMatch[1]) < 1;
  }
  return false;
}

/** Large stroke/outlined numbers use bgBand; inline accent numbers use textAccent. */
function shouldUseBgBandNumberToken(node: DslNode, beforeColor: string | undefined): boolean {
  if (node.type !== "element" && node.type !== "slot") {
    return false;
  }
  const style = node.style;
  if (!style) {
    return false;
  }
  if (hasWebkitTextStroke(style)) {
    return true;
  }
  if (parseDimensionPx(style.fontSize) >= 40) {
    return true;
  }
  return colorHasSubstantialTransparency(beforeColor);
}

function resolveNumberRoleColorToken(
  node: DslNode,
  beforeColor: string | undefined,
): keyof ThemePaletteTokens {
  return shouldUseBgBandNumberToken(node, beforeColor) ? "bgBand" : "textAccent";
}

function remapNumberTextStroke(node: DslNode, palette: ThemePaletteTokens): void {
  if (node.type !== "element" && node.type !== "slot") {
    return;
  }
  if (!node.style) {
    return;
  }

  for (const key of WEBKIT_TEXT_STROKE_KEYS) {
    const stroke: DslStyleValue | undefined = node.style[key];
    if (typeof stroke !== "string" || !stroke.trim()) {
      continue;
    }
    const widthMatch: RegExpMatchArray | null = stroke.match(/^([\d.]+px)\s+/i);
    const widthPrefix: string = widthMatch?.[1] ?? "1px";
    const remappedStroke = `${widthPrefix} ${palette.borderLight}`;
    node.style = {
      ...node.style,
      [key]: remappedStroke,
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
  const beforeColorRaw =
    node.type === "element" || node.type === "slot" ? node.style?.color : undefined;
  const beforeColor = typeof beforeColorRaw === "string" ? beforeColorRaw : undefined;
  const effectiveTokenKey =
    role === "number" ? resolveNumberRoleColorToken(node, beforeColor) : tokenKey;
  setElementStyleColor(node, "color", palette[effectiveTokenKey]);
  if (role === "number") {
    remapNumberTextStroke(node, palette);
  }
  if (node.type === "element" && node.style) {
    const remapped = remapBorderThemeAccents(node.style, palette.textAccent, dsl);
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
  const walkChildren = (node: DslNode) => {
    if (node.type === "element") {
      node.children?.forEach(walk);
    }
  };

  const walk = (node: DslNode) => {
    if ((node.type !== "element" && node.type !== "slot") || !node.style) {
      walkChildren(node);
      return;
    }

    const remapped = remapBorderThemeAccents(node.style, palette.textAccent, dsl);
    if (remapped) {
      node.style = remapped;
    }

    walkChildren(node);
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
            node.style = { ...node.style, borderColor: palette.textAccent };
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

function hasThemeRemappableMetadata(dsl: VariantDslV1): boolean {
  const bindings = dsl.meta?.semanticBindings;
  if (
    typeof bindings === "object" &&
    bindings !== null &&
    !Array.isArray(bindings) &&
    Object.keys(bindings).length > 0
  ) {
    return true;
  }

  const styleTokens = dsl.meta?.styleTokens;
  return (
    typeof styleTokens === "object" &&
    styleTokens !== null &&
    !Array.isArray(styleTokens) &&
    Object.keys(styleTokens as Record<string, unknown>).length > 0
  );
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
  return hasThemeRemappableMetadata(dsl);
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
