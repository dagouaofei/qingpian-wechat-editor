import { escapeHtml } from "@/core/copy/html-escape";

import type { DslNode, DslRenderTarget } from "../runtime/dsl-types";
import type { SlotContentMap } from "./block-slot-bindings";
import { dslStyleToInlineCss } from "./render-style";

export type RenderTreeResult = {
  html: string;
  issues: string[];
};

function renderNode(node: DslNode, slots: SlotContentMap, target: DslRenderTarget): string {
  if (node.type === "text") {
    return escapeHtml(node.value);
  }

  if (node.type === "slot") {
    const content = slots[node.slot] ?? "";
    const tag = node.tag ?? "span";
    const styleAttr = dslStyleToInlineCss(node.style);
    const style = styleAttr ? ` style="${styleAttr}"` : "";
    if (target === "admin_inspection" && !content) {
      return `<${tag}${style} data-dsl-slot="${node.slot}"></${tag}>`;
    }
    return `<${tag}${style}>${escapeHtml(content)}</${tag}>`;
  }

  const tag = node.tag;
  const styleAttr = dslStyleToInlineCss(node.style);
  const style = styleAttr ? ` style="${styleAttr}"` : "";
  const children = (node.children ?? []).map((child) => renderNode(child, slots, target)).join("");
  return `<${tag}${style}>${children}</${tag}>`;
}

export function renderDslTreeToHtml(
  tree: DslNode,
  slots: SlotContentMap,
  target: DslRenderTarget,
): RenderTreeResult {
  const issues: string[] = [];
  const html = renderNode(tree, slots, target);
  if (!html.trim()) {
    issues.push("empty_tree_render");
  }
  return { html, issues };
}
