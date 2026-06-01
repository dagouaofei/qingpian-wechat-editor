import type { InlineContent, InlineMark } from "@/core/article";
import type { ThemeTokens } from "@/core/styles";

import { resolveInlineMarkColor, resolveInlineMarkLink } from "./inline-content-marks";
import type { PreviewInlineMark, PreviewInlineNode, RendererIssue } from "./types";

export function renderInlineContentPreviewNodes(options: {
  content: InlineContent;
  themeTokens: ThemeTokens;
  defaultColor: string;
  blockId: string;
  blockType: "lead" | "paragraph";
  variantId: string;
}): { nodes: PreviewInlineNode[]; warnings: RendererIssue[] } {
  const warnings: RendererIssue[] = [];
  const nodes: PreviewInlineNode[] = options.content.map((node) => ({
    text: node.text,
    marks: node.marks?.map((mark) => previewMark(mark, options, warnings)),
  }));

  return { nodes, warnings };
}

function previewMark(
  mark: InlineMark,
  options: {
    themeTokens: ThemeTokens;
    defaultColor: string;
    blockId: string;
    blockType: "lead" | "paragraph";
    variantId: string;
  },
  warnings: RendererIssue[],
): PreviewInlineMark {
  if (mark.type === "color") {
    const resolved = resolveInlineMarkColor({
      colorInput: mark.color,
      themeTokens: options.themeTokens,
      defaultColor: options.defaultColor,
      blockId: options.blockId,
      blockType: options.blockType,
      variantId: options.variantId,
    });
    if (resolved.issue) {
      warnings.push(resolved.issue);
    }
    return {
      type: mark.type,
      color: mark.color,
      resolvedColor: resolved.cssColor,
      state: resolved.state,
      fallbackReason: resolved.fallbackReason,
    };
  }

  if (mark.type === "link") {
    const resolved = resolveInlineMarkLink({
      href: mark.href,
      blockId: options.blockId,
      blockType: options.blockType,
      variantId: options.variantId,
    });
    if (resolved.issue) {
      warnings.push(resolved.issue);
    }
    return {
      type: mark.type,
      href: mark.href,
      state: resolved.state,
      fallbackReason: resolved.fallbackReason,
    };
  }

  return { type: mark.type, state: "active" };
}
