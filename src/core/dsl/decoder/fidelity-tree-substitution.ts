import type { Block } from "@/core/blocks";
import type { Article } from "@/core/article";
import { applyOrdinalToEyebrowLabel, resolveHeadingIndexLabel } from "@/core/renderer/heading-ordinal";

import type { DslNode, VariantDslV1 } from "../runtime/dsl-types";
import type { SemanticBinding } from "../encoder/fidelity-html-tree";
import { collectTreeTextContent, inferSemanticBindingsFromTree } from "../encoder/fidelity-html-tree";
import { resolveSlotContentsForBlock } from "./block-slot-bindings";
import { listRequiredTreeSlots } from "./resolve-dsl-slots";

export type FidelitySubstitutionTrace = {
  slotSubstitutionPath: string | null;
  slotSubstitutionTargetPath: string | null;
  actualTextLeafPath: string | null;
  substitutedSlot: string | null;
  numberSubstitutionTargetPath: string | null;
  substitutedNumber: string | null;
  eyebrowSubstitutionTargetPath: string | null;
  substitutedEyebrow: string | null;
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

function resolveEffectiveSemanticBindings(
  tree: DslNode,
  dsl: VariantDslV1,
): Record<string, SemanticBinding> {
  const stored = readSemanticBindings(dsl);
  const inferred = inferSemanticBindingsFromTree(tree);
  return {
    ...inferred,
    ...Object.fromEntries(
      Object.entries(stored).filter(([, binding]) => Boolean(binding?.path)),
    ),
  };
}

function isWhitespaceOrNbspOnly(text: string): boolean {
  return text.replace(/&nbsp;/gi, " ").replace(/\s+/g, "").length === 0;
}

function isPureNumberText(text: string): boolean {
  return /^\d{1,3}$/.test(text.trim());
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

export function resolveDslNodeAtPath(root: DslNode, path: string): DslNode | null {
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

type ReplaceTextResult = {
  ok: boolean;
  actualTextLeafPath: string | null;
};

function replaceTextInSubtree(
  node: DslNode,
  newText: string,
  nodePath: string,
): ReplaceTextResult {
  if (node.type === "text") {
    node.value = newText;
    return { ok: true, actualTextLeafPath: nodePath };
  }
  if (node.type === "slot") {
    return { ok: false, actualTextLeafPath: null };
  }

  const leaves: Array<{ node: DslNode; path: string }> = [];
  const collectLeaves = (current: DslNode, path: string) => {
    if (current.type === "text") {
      leaves.push({ node: current, path });
      return;
    }
    if (current.type === "element" && current.children) {
      current.children.forEach((child, index) => {
        collectLeaves(child, `${path}.children[${index}]`);
      });
    }
  };
  collectLeaves(node, nodePath);

  if (leaves.length === 0) {
    node.children = [{ type: "text", value: newText }];
    return { ok: true, actualTextLeafPath: `${nodePath}.children[0]` };
  }

  leaves[0]!.node.value = newText;
  for (let index = 1; index < leaves.length; index += 1) {
    leaves[index]!.node.value = "";
  }
  return { ok: true, actualTextLeafPath: leaves[0]!.path };
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

  const scored = candidates
    .filter((candidate) => !preserveTexts.has(candidate.text))
    .map((candidate) => {
      const target = resolveDslNodeAtPath(tree, candidate.path);
      const style = target?.type === "element" ? target.style : undefined;
      let score = candidate.path.split(".children").length * 10;
      if (isWhitespaceOrNbspOnly(candidate.text)) score -= 1000;
      if (isPureNumberText(candidate.text)) score -= 500;
      if (candidate.tag === "span" || candidate.tag === "strong") score += 30;
      const fontSize = typeof style?.fontSize === "string" ? style.fontSize : undefined;
      if (fontSize && /^(1[6-9]|2[0-8])px$/i.test(fontSize)) score += 50;
      if (style?.fontWeight === "bold" || style?.fontWeight === 700) score += 30;
      if (candidate.path === "tree") score -= 80;
      if (candidate.text.length > 24 && /\d{1,3}/.test(candidate.text)) score -= 40;
      return { ...candidate, score };
    })
    .sort((a, b) => b.score - a.score);

  const best = scored.find((candidate) => candidate.score > -500);
  return best ? { path: best.path, tag: best.tag } : null;
}

function treeContainsSlotNodes(node: DslNode): boolean {
  if (node.type === "slot") {
    return true;
  }
  return (node.children ?? []).some((child) => treeContainsSlotNodes(child));
}

export function hasSemanticTitleBinding(dsl: VariantDslV1): boolean {
  const bindings = readSemanticBindings(dsl);
  return typeof bindings.title === "object" && bindings.title !== null;
}

export function semanticBindingsResolveOnTree(dsl: VariantDslV1): boolean {
  return !requiresFidelityTreeRefresh(dsl);
}

export function requiresFidelityTreeRefresh(dsl: VariantDslV1): boolean {
  if (!dsl.tree) {
    return true;
  }

  if (!hasSemanticTitleBinding(dsl)) {
    return false;
  }

  if (treeContainsSlotNodes(dsl.tree)) {
    return true;
  }

  const bindings = readSemanticBindings(dsl);
  const titleBinding = bindings.title;
  if (!titleBinding?.path) {
    return false;
  }

  return resolveDslNodeAtPath(dsl.tree, titleBinding.path) === null;
}

function listDecorativeSlotsPreserved(
  extractedSlots: Record<string, string>,
  bindings: Record<string, SemanticBinding>,
): string[] {
  return DECORATIVE_SLOT_ROLES.filter(
    (role) => Boolean(extractedSlots[role] || bindings[role]),
  );
}

function substituteHeadingNumberInTree(
  tree: DslNode,
  dsl: VariantDslV1,
  block: Block,
  article: Article | undefined,
  bindings: Record<string, SemanticBinding>,
): { targetPath: string | null; label: string | null } {
  if (!article) {
    return { targetPath: null, label: null };
  }

  const numberPath = bindings.number?.path;
  if (!numberPath) {
    return { targetPath: null, label: null };
  }

  const label = resolveHeadingIndexLabel(article, block.id, block.meta?.sourceIndex);
  const target = resolveDslNodeAtPath(tree, numberPath);
  const replaced = target ? replaceTextInSubtree(target, label, numberPath) : null;
  if (!replaced?.ok) {
    return { targetPath: numberPath, label: null };
  }

  return { targetPath: numberPath, label };
}

function substituteEyebrowOrdinalInTree(
  tree: DslNode,
  dsl: VariantDslV1,
  block: Block,
  article: Article | undefined,
  bindings: Record<string, SemanticBinding>,
): { targetPath: string | null; label: string | null } {
  if (!article) {
    return { targetPath: null, label: null };
  }

  const eyebrowPath = bindings.eyebrow?.path;
  if (!eyebrowPath) {
    return { targetPath: null, label: null };
  }

  const sourceEyebrow =
    bindings.eyebrow?.text?.trim() || readExtractedSlots(dsl).eyebrow || "";
  if (!sourceEyebrow || !/\b\d{1,3}\b/.test(sourceEyebrow)) {
    return { targetPath: eyebrowPath, label: null };
  }

  const ordinalLabel = resolveHeadingIndexLabel(article, block.id, block.meta?.sourceIndex);
  const label = applyOrdinalToEyebrowLabel(sourceEyebrow, ordinalLabel);

  const target = resolveDslNodeAtPath(tree, eyebrowPath);
  const replaced = target ? replaceTextInSubtree(target, label, eyebrowPath) : null;
  if (!replaced?.ok) {
    return { targetPath: eyebrowPath, label: null };
  }

  return { targetPath: eyebrowPath, label };
}

export function applyFidelityTreeArticleSubstitution(
  tree: DslNode,
  dsl: VariantDslV1,
  block: Block,
  article?: Article,
): { tree: DslNode; trace: FidelitySubstitutionTrace } {
  const articleTitle = resolveSlotContentsForBlock(block).title?.trim() ?? "";
  const extractedSlots = readExtractedSlots(dsl);
  const cloned = cloneDslNode(tree);
  const bindings = resolveEffectiveSemanticBindings(cloned, dsl);
  const decorativeSlotsPreserved = listDecorativeSlotsPreserved(extractedSlots, bindings);
  const preserveTexts = new Set(
    DECORATIVE_SLOT_ROLES.map((role) => extractedSlots[role] || bindings[role]?.text || "")
      .filter(Boolean),
  );

  const numberSubstitution = substituteHeadingNumberInTree(cloned, dsl, block, article, bindings);
  const eyebrowSubstitution = substituteEyebrowOrdinalInTree(cloned, dsl, block, article, bindings);

  const baseTrace: FidelitySubstitutionTrace = {
    slotSubstitutionPath: null,
    slotSubstitutionTargetPath: null,
    actualTextLeafPath: null,
    substitutedSlot: null,
    numberSubstitutionTargetPath: numberSubstitution.targetPath,
    substitutedNumber: numberSubstitution.label,
    eyebrowSubstitutionTargetPath: eyebrowSubstitution.targetPath,
    substitutedEyebrow: eyebrowSubstitution.label,
    decorativeSlotsPreserved,
    fallbackUsed: false,
    fallbackReason: null,
  };

  if (!articleTitle) {
    return { tree: cloned, trace: baseTrace };
  }

  if (bindings.title?.path) {
    const targetPath = bindings.title.path;
    const target = resolveDslNodeAtPath(cloned, targetPath);
    const replaced = target ? replaceTextInSubtree(target, articleTitle, targetPath) : null;
    if (replaced?.ok) {
      const storedTitlePath = readSemanticBindings(dsl).title?.path;
      return {
        tree: cloned,
        trace: {
          ...baseTrace,
          slotSubstitutionPath: storedTitlePath ? "meta.semanticBindings.title" : "tree.inferred.title",
          slotSubstitutionTargetPath: targetPath,
          actualTextLeafPath: replaced.actualTextLeafPath,
          substitutedSlot: "title",
        },
      };
    }
  }

  const requiredSlots = listRequiredTreeSlots(dsl);
  if (!bindings.title?.path && requiredSlots.includes("title")) {
    return {
      tree: cloned,
      trace: {
        ...baseTrace,
        substitutedSlot: "title",
        slotSubstitutionPath: "slots.title",
        slotSubstitutionTargetPath: null,
      },
    };
  }

  if (!bindings.title?.path) {
    const fallback = findFallbackTitlePath(cloned, preserveTexts);
    if (fallback) {
      const target = resolveDslNodeAtPath(cloned, fallback.path);
      const replaced = target ? replaceTextInSubtree(target, articleTitle, fallback.path) : null;
      if (replaced?.ok) {
        return {
          tree: cloned,
          trace: {
            ...baseTrace,
            slotSubstitutionPath: fallback.path,
            slotSubstitutionTargetPath: fallback.path,
            actualTextLeafPath: replaced.actualTextLeafPath,
            substitutedSlot: "title",
            fallbackUsed: true,
            fallbackReason: "semantic_binding_missing_used_first_non_decorative_text",
          },
        };
      }
    }
  }

  return { tree: cloned, trace: baseTrace };
}
