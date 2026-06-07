import type { DslNode, DslStyle } from "../runtime/dsl-types";

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
  return bindings;
}
