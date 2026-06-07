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

export function resolveSlotsForDslDecode(dsl: VariantDslV1, block: Block): SlotContentMap {
  const fromBlock = resolveSlotContentsForBlock(block);
  const fromMeta = readExtractedSlots(dsl);
  // DSL meta extracted slots override fixture/block sample text for harvest-encoded variants.
  return { ...fromBlock, ...fromMeta };
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
