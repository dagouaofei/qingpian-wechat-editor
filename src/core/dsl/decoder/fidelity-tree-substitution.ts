import type { Block } from "@/core/blocks";

import type { DslNode, VariantDslV1 } from "../runtime/dsl-types";
import type { SemanticBinding } from "../encoder/fidelity-html-tree";
import { collectTreeTextContent } from "../encoder/fidelity-html-tree";
import { resolveSlotContentsForBlock } from "./block-slot-bindings";
import { listRequiredTreeSlots } from "./resolve-dsl-slots";

export type FidelitySubstitutionTrace = {
  slotSubstitutionPath: string | null;
  substitutedSlot: string | null;
  decorativeSlotsPreserved: string[];
  fallbackUsed: boolean;
  fallbackReason: string | null;
};

const DECORATIVE_SLOT_ROLES = ["number", "eyebrow", "subtitle", "accent"] as const;

function readExtractedSlots(dsl: VariantDslV1): Record<string, string> {
  const meta = dsl.meta?.extractedSlots;
  if (typeof meta !== "object" || meta === null || Array.isArray(meta)) {
    return {};
  }
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(meta as Record<string, unknown>)) {
    if (typeof value === "string" && value.trim()) {
      result[key] = value.trim();
    }
  }
  return result;
}

function readSemanticBindings(dsl: VariantDslV1): Record<string, SemanticBinding> {
  const bindings = dsl.meta?.semanticBindings;
  if (typeof bindings !== "object" || bindings === null || Array.isArray(bindings)) {
    return {};
  }
  return bindings as Record<string, SemanticBinding>;
}

function cloneDslNode(node: DslNode): DslNode {
  if (node.type === "text") {
    return { type: "text", value: node.value };
  }
  if (node.type === "slot") {
    return {
      type: "slot",
      slot: node.slot,
      tag: node.tag,
      style: node.style ? { ...node.style } : undefined,
    };
  }
  return {
    type: "element",
    tag: node.tag,
    style: node.style ? { ...node.style } : undefined,
    children: node.children?.map(cloneDslNode),
  };
}

function resolveNodeAtPath(root: DslNode, path: string): DslNode | null {
  if (!path.startsWith("tree")) return null;
  const segments = path.replace(/^tree\.?/, "").split(".").filter(Boolean);
  let current: DslNode = root;
  for (const segment of segments) {
    const match = segment.match(/^children\[(\d+)\]$/);
    if (!match || current.type !== "element" || !current.children) {
      return null;
    }
    const child = current.children[Number.parseInt(match[1], 10)];
    if (!child) return null;
    current = child;
  }
  return current;
}

function replaceTextInSubtree(node: DslNode, newText: string): boolean {
  if (node.type === "text") {
    node.value = newText;
    return true;
  }
  if (node.type === "slot") {
    return false;
  }

  const leaves: DslNode[] = [];
  const collectLeaves = (current: DslNode) => {
    if (current.type === "text") {
      leaves.push(current);
      return;
    }
    if (current.type === "element" && current.children) {
      for (const child of current.children) collectLeaves(child);
    }
  };
  collectLeaves(node);

  if (leaves.length === 0) {
    node.children = [{ type: "text", value: newText }];
    return true;
  }

  leaves[0]!.value = newText;
  for (let index = 1; index < leaves.length; index += 1) {
    leaves[index]!.value = "";
  }
  return true;
}

function collectStyledTextElements(
  node: DslNode,
  path: string,
  results: Array<{ text: string; path: string; tag: string }>,
): void {
  if (node.type !== "element") return;

  const nestedText = collectTreeTextContent(node);
  const hasStyle = Boolean(node.style && Object.keys(node.style).length > 0);
  if (hasStyle && nestedText) {
    results.push({ text: nestedText, path, tag: node.tag });
  }

  node.children?.forEach((child, index) => {
    if (child.type === "element") {
      collectStyledTextElements(child, `${path}.children[${index}]`, results);
    }
  });
}

function findFallbackTitlePath(
  tree: DslNode,
  preserveTexts: Set<string>,
): { path: string; tag: string } | null {
  const candidates: Array<{ text: string; path: string; tag: string }> = [];
  if (tree.type === "element") {
    collectStyledTextElements(tree, "tree", candidates);
  }

  for (const candidate of candidates) {
    if (!preserveTexts.has(candidate.text)) {
      return { path: candidate.path, tag: candidate.tag };
    }
  }
  return null;
}

function listDecorativeSlotsPreserved(
  extractedSlots: Record<string, string>,
  bindings: Record<string, SemanticBinding>,
): string[] {
  return DECORATIVE_SLOT_ROLES.filter(
    (role) => Boolean(extractedSlots[role] || bindings[role]),
  );
}

export function applyFidelityTreeArticleSubstitution(
  tree: DslNode,
  dsl: VariantDslV1,
  block: Block,
): { tree: DslNode; trace: FidelitySubstitutionTrace } {
  const articleTitle = resolveSlotContentsForBlock(block).title?.trim() ?? "";
  const extractedSlots = readExtractedSlots(dsl);
  const bindings = readSemanticBindings(dsl);
  const decorativeSlotsPreserved = listDecorativeSlotsPreserved(extractedSlots, bindings);
  const preserveTexts = new Set(
    DECORATIVE_SLOT_ROLES.map((role) => extractedSlots[role]).filter(Boolean),
  );

  const cloned = cloneDslNode(tree);
  const baseTrace: FidelitySubstitutionTrace = {
    slotSubstitutionPath: null,
    substitutedSlot: null,
    decorativeSlotsPreserved,
    fallbackUsed: false,
    fallbackReason: null,
  };

  if (!articleTitle) {
    return { tree: cloned, trace: baseTrace };
  }

  const requiredSlots = listRequiredTreeSlots(dsl);
  if (requiredSlots.includes("title")) {
    return {
      tree: cloned,
      trace: {
        ...baseTrace,
        substitutedSlot: "title",
        slotSubstitutionPath: bindings.title?.path ?? null,
      },
    };
  }

  if (bindings.title?.path) {
    const target = resolveNodeAtPath(cloned, bindings.title.path);
    if (target && replaceTextInSubtree(target, articleTitle)) {
      return {
        tree: cloned,
        trace: {
          ...baseTrace,
          slotSubstitutionPath: bindings.title.path,
          substitutedSlot: "title",
        },
      };
    }
  }

  const fallback = findFallbackTitlePath(cloned, preserveTexts);
  if (fallback) {
    const target = resolveNodeAtPath(cloned, fallback.path);
    if (target && replaceTextInSubtree(target, articleTitle)) {
      return {
        tree: cloned,
        trace: {
          ...baseTrace,
          slotSubstitutionPath: fallback.path,
          substitutedSlot: "title",
          fallbackUsed: true,
          fallbackReason: "semantic_binding_missing_used_first_non_decorative_text",
        },
      };
    }
  }

  return { tree: cloned, trace: baseTrace };
}
