import type { ThemePaletteTokens } from "@/core/styles/theme-palette-tokens";

import type { SemanticBinding } from "../encoder/fidelity-html-tree";
import type { DslNode, DslRenderTarget, DslStyleValue, VariantDslV1 } from "../runtime/dsl-types";
import { resolveDslNodeAtPath } from "./fidelity-tree-substitution";

const HTML_PASTE_FAMILIES = new Set(["htmlPaste", "htmlPasteCandidate"]);

const ROLE_COLOR_TOKEN: Record<string, keyof ThemePaletteTokens> = {
  title: "textDefault",
  eyebrow: "textMuted",
  subtitle: "textAccent",
  number: "bgBand",
};

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

function applyRoleColorAtPath(
  tree: DslNode,
  path: string,
  tokenKey: keyof ThemePaletteTokens,
  palette: ThemePaletteTokens,
): void {
  const node = resolveDslNodeAtPath(tree, path);
  if (!node) {
    return;
  }
  setElementStyleColor(node, "color", palette[tokenKey]);
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
      applyRoleColorAtPath(tree, path, tokenKey, themePalette);
    }
  }

  if (readDecorators(dsl).includes("accent_bar")) {
    applyAccentBarThemeTokens(tree, dsl, themePalette);
  }

  return tree;
}
