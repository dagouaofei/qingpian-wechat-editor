import type { DslNode, DslStyle } from "../runtime/dsl-types";
import type { HeadingSemanticSlots } from "./heading-semantic-extractor";

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
  openPattern.lastIndex = startIndex;
  closePattern.lastIndex = startIndex;

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

function resolveSlotForText(text: string, slots: HeadingSemanticSlots): string | null {
  const normalized = text.trim();
  if (!normalized) return null;
  const entries: [string, string | undefined][] = [
    ["eyebrow", slots.eyebrow],
    ["number", slots.number],
    ["title", slots.title],
    ["subtitle", slots.subtitle],
  ];
  for (const [slot, value] of entries) {
    if (value?.trim() === normalized) return slot;
  }
  return null;
}

function buildNodesFromHtml(html: string, slots: HeadingSemanticSlots): DslNode[] {
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
    const innerText = stripTags(inner);
    const hasStructuralChild = /<section\b/i.test(inner);
    const slotName = !hasStructuralChild ? resolveSlotForText(innerText, slots) : null;

    if (slotName) {
      nodes.push({
        type: "slot",
        slot: slotName,
        tag: opening.tag,
        style: Object.keys(style).length > 0 ? style : undefined,
      });
    } else {
    const innerNodes = buildNodesFromHtml(inner, slots);
    if (innerNodes.length === 1 && innerNodes[0]?.type === "text") {
      nodes.push({
        type: "element",
        tag: opening.tag,
        style,
        children: innerNodes,
      });
    } else {
      nodes.push({
        type: "element",
        tag: opening.tag,
        style: Object.keys(style).length > 0 ? style : undefined,
        children: innerNodes.length > 0 ? innerNodes : innerText ? [{ type: "text", value: innerText }] : [],
      });
    }
    }

    cursor += closeEnd;
  }

  return nodes;
}

export function buildFidelityTreeFromHtml(
  html: string,
  slots: HeadingSemanticSlots,
): DslNode {
  const children = buildNodesFromHtml(html.trim(), slots);
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
