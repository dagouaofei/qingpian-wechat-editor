import type { Block } from "@/core/blocks";

import type { VariantDslV1 } from "../runtime/dsl-types";
import { resolveSlotContentsForBlock, type SlotContentMap } from "./block-slot-bindings";

function readExtractedSlots(dsl: VariantDslV1): Record<string, string> {
  const meta = dsl.meta?.extractedSlots;
  if (typeof meta === "object" && meta !== null && !Array.isArray(meta)) {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(meta as Record<string, unknown>)) {
      if (typeof value === "string" && value.trim()) {
        result[key] = value;
      }
    }
    return result;
  }
  return {};
}

function hasSemanticTitleBinding(dsl: VariantDslV1): boolean {
  const bindings = dsl.meta?.semanticBindings;
  if (typeof bindings !== "object" || bindings === null || Array.isArray(bindings)) {
    return false;
  }
  const titleBinding = (bindings as Record<string, unknown>).title;
  return typeof titleBinding === "object" && titleBinding !== null;
}

export function resolveSlotsForDslDecode(dsl: VariantDslV1, block: Block): SlotContentMap {
  const fromBlock = resolveSlotContentsForBlock(block);
  const fromMeta = readExtractedSlots(dsl);
  const requiredSlots = listRequiredTreeSlots(dsl);

  if (hasSemanticTitleBinding(dsl) || (dsl.tree && requiredSlots.length === 0)) {
    const slots: SlotContentMap = {};
    for (const slot of requiredSlots) {
      if (slot === "title") {
        slots.title = fromBlock.title ?? "";
      } else {
        slots[slot] = fromMeta[slot] ?? "";
      }
    }
    return slots;
  }

  return {
    ...fromMeta,
    title: fromBlock.title ?? fromMeta.title ?? "",
  };
}

export function listRequiredTreeSlots(dsl: VariantDslV1): string[] {
  if (!dsl.tree) return [];
  const required: string[] = [];
  const walk = (node: { type: string; slot?: string; children?: unknown[] }) => {
    if (node.type === "slot" && node.slot) {
      required.push(node.slot);
    }
    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        if (typeof child === "object" && child !== null && "type" in child) {
          walk(child as { type: string; slot?: string; children?: unknown[] });
        }
      }
    }
  };
  walk(dsl.tree as { type: string; slot?: string; children?: unknown[] });
  return [...new Set(required)];
}
