import type { DslNode, DslStyle, DslStyleValue } from "../runtime/dsl-types";

const FIDELITY_TAGS = ["section", "span", "strong", "h1", "h2", "h3", "h4", "h5", "h6", "p"] as const;
type FidelityTag = (typeof FIDELITY_TAGS)[number];

function camelCaseProperty(property: string): string {
  return property
    .trim()
    .toLowerCase()
    .replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
}

export function parseInlineStyleFidelity(styleAttr: string): DslStyle {
  const style: DslStyle = {};
  for (const chunk of styleAttr.split(";")) {
    const colon = chunk.indexOf(":");
    if (colon < 0) continue;
    const key = chunk.slice(0, colon).trim();
    const value = chunk.slice(colon + 1).trim();
    if (!key || !value) continue;
    style[camelCaseProperty(key) as keyof DslStyle] = value;
  }
  return style;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function isFidelityTag(tag: string): tag is FidelityTag {
  return (FIDELITY_TAGS as readonly string[]).includes(tag.toLowerCase());
}

function readOpeningTag(html: string): { tag: FidelityTag; attrs: string; end: number } | null {
  const match = html.match(/^<(section|span|strong|h[1-6]|p)\b([^>]*)>/i);
  if (!match?.[1]) return null;
  const tag = match[1].toLowerCase();
  if (!isFidelityTag(tag)) return null;
  return { tag, attrs: match[2] ?? "", end: match[0].length };
}

function findMatchingClose(html: string, tag: string, startIndex: number): number {
  const openPattern = new RegExp(`<${tag}\\b`, "gi");
  const closePattern = new RegExp(`<\\/${tag}>`, "gi");
  let depth = 1;
  let cursor = startIndex;

  while (depth > 0 && cursor < html.length) {
    openPattern.lastIndex = cursor;
    closePattern.lastIndex = cursor;
    const nextOpen = openPattern.exec(html);
    const nextClose = closePattern.exec(html);
    if (!nextClose) return -1;
    if (nextOpen && nextOpen.index < nextClose.index) {
      depth += 1;
      cursor = nextOpen.index + nextOpen[0].length;
      continue;
    }
    depth -= 1;
    if (depth === 0) {
      return nextClose.index + nextClose[0].length;
    }
    cursor = nextClose.index + nextClose[0].length;
  }
  return -1;
}

function buildNodesFromHtml(html: string): DslNode[] {
  const nodes: DslNode[] = [];
  let cursor = 0;
  const trimmed = html.trim();

  while (cursor < trimmed.length) {
    const rest = trimmed.slice(cursor).trimStart();
    cursor += trimmed.slice(cursor).length - rest.length;
    if (!rest) break;

    const opening = readOpeningTag(rest);
    if (!opening) {
      const text = stripTags(rest);
      if (text) {
        nodes.push({ type: "text", value: text });
      }
      break;
    }

    const innerStart = opening.end;
    const closeEnd = findMatchingClose(rest, opening.tag, innerStart);
    if (closeEnd < 0) {
      break;
    }

    const inner = rest.slice(innerStart, closeEnd - `</${opening.tag}>`.length);
    const styleMatch = opening.attrs.match(/style\s*=\s*"([^"]*)"/i);
    const style = parseInlineStyleFidelity(styleMatch?.[1] ?? "");
    const innerNodes = buildNodesFromHtml(inner);
    const innerText = stripTags(inner);

    if (innerNodes.length === 0 && innerText) {
      nodes.push({
        type: "element",
        tag: opening.tag,
        style: Object.keys(style).length > 0 ? style : undefined,
        children: [{ type: "text", value: innerText }],
      });
    } else if (innerNodes.length === 1 && innerNodes[0]?.type === "text") {
      nodes.push({
        type: "element",
        tag: opening.tag,
        style: Object.keys(style).length > 0 ? style : undefined,
        children: innerNodes,
      });
    } else {
      nodes.push({
        type: "element",
        tag: opening.tag,
        style: Object.keys(style).length > 0 ? style : undefined,
        children: innerNodes.length > 0 ? innerNodes : undefined,
      });
    }

    cursor += closeEnd;
  }

  return nodes;
}

/** Build a fidelity DOM tree — structure and inline styles only, no semantic slot replacement. */
export function buildFidelityTreeFromHtml(html: string): DslNode {
  const children = buildNodesFromHtml(html.trim());
  if (children.length === 1 && children[0]?.type === "element") {
    return children[0];
  }
  return {
    type: "element",
    tag: "section",
    children,
  };
}

export function collectFidelityStyleSnapshot(tree: DslNode): string {
  const chunks: string[] = [];
  const walk = (node: DslNode) => {
    if (node.type === "element" || node.type === "slot") {
      if (node.style) {
        chunks.push(JSON.stringify(node.style));
      }
      if (node.type === "element" && node.children) {
        for (const child of node.children) walk(child);
      }
    }
  };
  walk(tree);
  return chunks.join(" ");
}

export function collectTreeTextContent(tree: DslNode): string {
  if (tree.type === "text") return tree.value;
  if (tree.type === "slot") return "";
  return (tree.children ?? []).map(collectTreeTextContent).join(" ").trim();
}

export type SemanticBinding = {
  text: string;
  path: string;
  tag: string;
};

function collectStyledTextElements(
  node: DslNode,
  path: string,
  results: Array<{ text: string; path: string; tag: string }>,
): void {
  if (node.type !== "element") return;

  const directText = (node.children ?? [])
    .filter((child) => child.type === "text")
    .map((child) => (child.type === "text" ? child.value.trim() : ""))
    .filter(Boolean)
    .join(" ")
    .trim();
  const nestedText = collectTreeTextContent(node);
  const hasStyle = Boolean(node.style && Object.keys(node.style).length > 0);

  if (hasStyle && nestedText && (directText || nestedText)) {
    results.push({ text: directText || nestedText, path, tag: node.tag });
  }

  node.children?.forEach((child, index) => {
    if (child.type === "element") {
      collectStyledTextElements(child, `${path}.children[${index}]`, results);
    }
  });
}

function bindingPriority(tag: string, path: string, style?: DslStyle): number {
  let score = path.split(".children").length * 10;
  if (tag === "span" || tag === "strong" || /^h[1-6]$/i.test(tag)) score += 100;
  if (style?.fontSize) score += 50;
  if (style?.color) score += 20;
  if (tag === "section") score -= 40;
  return score;
}

function resolveNodeStyle(tree: DslNode, path: string): DslStyle | undefined {
  if (path === "tree" && tree.type === "element") return tree.style;
  const segments = path.replace(/^tree\.?/, "").split(".").filter(Boolean);
  let current: DslNode = tree;
  for (const segment of segments) {
    const match = segment.match(/^children\[(\d+)\]$/);
    if (!match || current.type !== "element" || !current.children) return undefined;
    const child = current.children[Number.parseInt(match[1], 10)];
    if (!child) return undefined;
    current = child;
  }
  return current.type === "element" ? current.style : undefined;
}

function isWhitespaceOrNbspOnly(text: string): boolean {
  return text.replace(/&nbsp;/gi, " ").replace(/\s+/g, "").length === 0;
}

function isPureNumberText(text: string): boolean {
  return /^\d{1,3}$/.test(text.trim());
}

function parseStyleFontSizePx(style: DslStyle | undefined): number {
  const value = style?.fontSize;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const match = value.match(/^([\d.]+)px$/i);
    return match ? Number.parseFloat(match[1]) : 0;
  }
  return 0;
}

function parseStyleFontWeight(style: DslStyle | undefined): number {
  const value = style?.fontWeight;
  if (value === "bold") return 700;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : 400;
  }
  return 400;
}

function parseStyleColor(style: DslStyle | undefined): string {
  const value = style?.color;
  return typeof value === "string" ? value.trim() : "";
}

function isCircularRadiusValue(borderRadius: DslStyleValue | undefined): boolean {
  if (typeof borderRadius !== "string") {
    return false;
  }
  const trimmed = borderRadius.trim().toLowerCase();
  return trimmed === "100%" || trimmed === "50%" || trimmed === "9999px";
}

function isCircularBadgeElement(node: DslNode): boolean {
  if (node.type !== "element" || !node.style) {
    return false;
  }
  return (
    Boolean(node.style.backgroundColor) &&
    isCircularRadiusValue(node.style.borderRadius)
  );
}

/** Align with heading slot classifier — opaque rgb/hex accent colors qualify inline numbers. */
function colorOpacityForNumberInference(color: string): number {
  if (!color.trim()) {
    return 1;
  }
  const rgbaMatch = color.match(
    /rgba\s*\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*([\d.]+)\s*\)/i,
  );
  if (rgbaMatch) {
    return Number.parseFloat(rgbaMatch[1] ?? "1");
  }
  if (/^#[0-9a-f]{6}$/i.test(color.trim())) {
    const hex = color.trim().slice(1);
    const r = Number.parseInt(hex.slice(0, 2), 16);
    const g = Number.parseInt(hex.slice(2, 4), 16);
    const b = Number.parseInt(hex.slice(4, 6), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }
  return 1;
}

function isInferrableNumberLeaf(
  leaf: {
    text: string;
    path: string;
    fontSizePx: number;
    fontWeight: number;
    color: string;
    isCircularBadge: boolean;
  },
  titleBest?: { text: string; path: string },
): boolean {
  if (titleBest && leaf.path === titleBest.path) {
    return false;
  }
  if (!isPureNumberText(leaf.text)) {
    return false;
  }
  if (leaf.isCircularBadge) {
    return true;
  }
  if (leaf.fontSizePx >= 36) {
    return true;
  }
  if (leaf.fontWeight >= 700 && leaf.fontSizePx >= 14) {
    return true;
  }
  return leaf.fontSizePx >= 14 && colorOpacityForNumberInference(leaf.color) >= 0.85;
}

/** Infer title/number bindings from styled tree leaves when exact slot text match fails. */
export function inferSemanticBindingsFromTree(tree: DslNode): Record<string, SemanticBinding> {
  const leaves: Array<{
    text: string;
    path: string;
    tag: string;
    fontSizePx: number;
    fontWeight: number;
    color: string;
    isCircularBadge: boolean;
  }> = [];

  const walk = (node: DslNode, path: string) => {
    if (node.type !== "element") {
      return;
    }
    const nestedText = collectTreeTextContent(node).trim();
    if (node.style && Object.keys(node.style).length > 0 && nestedText && !isWhitespaceOrNbspOnly(nestedText)) {
      leaves.push({
        text: nestedText,
        path,
        tag: node.tag,
        fontSizePx: parseStyleFontSizePx(node.style),
        fontWeight: parseStyleFontWeight(node.style),
        color: parseStyleColor(node.style),
        isCircularBadge: isCircularBadgeElement(node),
      });
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

  const bindings: Record<string, SemanticBinding> = {};

  const titleBest = leaves
    .filter(
      (leaf) =>
        !isPureNumberText(leaf.text) &&
        !isWhitespaceOrNbspOnly(leaf.text) &&
        leaf.fontSizePx >= 14 &&
        leaf.fontSizePx < 36 &&
        (leaf.fontWeight >= 700 || leaf.fontSizePx >= 16),
    )
    .sort((a, b) => {
      let scoreA = a.path.split(".children").length * 10;
      let scoreB = b.path.split(".children").length * 10;
      if (a.fontSizePx >= 16 && a.fontSizePx <= 28) scoreA += 50;
      if (b.fontSizePx >= 16 && b.fontSizePx <= 28) scoreB += 50;
      if (a.fontWeight >= 700) scoreA += 30;
      if (b.fontWeight >= 700) scoreB += 30;
      if (a.tag === "span" || a.tag === "strong") scoreA += 20;
      if (b.tag === "span" || b.tag === "strong") scoreB += 20;
      return scoreB - scoreA;
    })[0];

  const numberBest = leaves
    .filter((leaf) => isInferrableNumberLeaf(leaf, titleBest))
    .sort((a, b) => b.fontSizePx - a.fontSizePx)[0];
  if (numberBest) {
    bindings.number = { text: numberBest.text, path: numberBest.path, tag: numberBest.tag };
  }

  const titleBinding =
    titleBest && titleBest.path !== numberBest?.path
      ? titleBest
      : leaves
          .filter(
            (leaf) =>
              leaf.path !== numberBest?.path &&
              !isPureNumberText(leaf.text) &&
              !isWhitespaceOrNbspOnly(leaf.text) &&
              leaf.fontSizePx >= 14 &&
              leaf.fontSizePx < 36 &&
              (leaf.fontWeight >= 700 || leaf.fontSizePx >= 16),
          )
          .sort((a, b) => {
            const score = (leaf: (typeof leaves)[number]) => {
              let value = leaf.path.split(".children").length * 10;
              if (leaf.fontSizePx >= 16 && leaf.fontSizePx <= 28) value += 50;
              if (leaf.fontWeight >= 700) value += 30;
              if (leaf.tag === "span" || leaf.tag === "strong") value += 20;
              return value;
            };
            return score(b) - score(a);
          })[0];

  if (titleBinding) {
    bindings.title = { text: titleBinding.text, path: titleBinding.path, tag: titleBinding.tag };
  }

  return bindings;
}

/** Map semantic slot roles to tree paths of their styled text elements. */
export function buildSemanticBindings(
  tree: DslNode,
  slots: Record<string, string | undefined>,
): Record<string, SemanticBinding> {
  const leaves: Array<{ text: string; path: string; tag: string }> = [];
  if (tree.type === "element") {
    collectStyledTextElements(tree, "tree", leaves);
  }

  const bindings: Record<string, SemanticBinding> = {};
  for (const [role, text] of Object.entries(slots)) {
    if (!text?.trim()) continue;
    const matches = leaves.filter((leaf) => leaf.text === text.trim());
    if (matches.length === 0) continue;
    const best = matches.reduce((winner, candidate) => {
      const winnerStyle = resolveNodeStyle(tree, winner.path);
      const candidateStyle = resolveNodeStyle(tree, candidate.path);
      return bindingPriority(candidate.tag, candidate.path, candidateStyle) >
        bindingPriority(winner.tag, winner.path, winnerStyle)
        ? candidate
        : winner;
    });
    bindings[role] = { text: best.text, path: best.path, tag: best.tag };
  }

  const inferred = inferSemanticBindingsFromTree(tree);
  for (const role of ["title", "number", "eyebrow", "subtitle"] as const) {
    if (!bindings[role] && inferred[role]) {
      bindings[role] = inferred[role]!;
    }
  }

  return bindings;
}
