import type { SerializedPreviewBlock } from "@/server/generation/generate-flow-types";
import type { PreviewInlineNode } from "@/core/renderer";

const INSTANT_REVEAL_KINDS = new Set([
  "divider_preview",
  "image_placeholder_preview",
  "preview_placeholder",
]);

export function isInstantRevealPreviewBlock(block: SerializedPreviewBlock): boolean {
  if (!block.ok || !block.output) {
    return true;
  }
  return INSTANT_REVEAL_KINDS.has(block.output.kind);
}

export function extractPreviewBlockPlainText(block: SerializedPreviewBlock): string {
  if (!block.ok || !block.output) {
    return "";
  }

  const output = block.output;

  switch (output.kind) {
    case "title_block_preview":
      return output.text;
    case "text_block_preview":
      return output.nodes.map((node) => node.text).join("");
    case "quote_preview":
      return [output.text, output.attribution].filter(Boolean).join("");
    case "highlight_preview":
      return [output.label, output.text].filter(Boolean).join("");
    case "list_preview":
      return output.items
        .flatMap((item) => [item.text, ...item.subItems])
        .join("");
    case "info_card_preview":
      return [output.title, output.body, ...output.bodyLines].filter(Boolean).join("");
    case "cta_preview":
      return [output.text, output.action, output.placeholderLabel].filter(Boolean).join("");
    case "image_placeholder_preview":
      return [output.caption, output.suggestion].filter(Boolean).join("");
    default:
      return "";
  }
}

function slicePlainText(value: string, maxChars: number): string {
  if (maxChars <= 0) {
    return "";
  }
  return value.slice(0, maxChars);
}

function sliceInlineNodes(
  nodes: PreviewInlineNode[],
  maxChars: number,
): PreviewInlineNode[] {
  if (maxChars <= 0) {
    return [{ text: "" }];
  }

  let remaining = maxChars;
  const result: PreviewInlineNode[] = [];

  for (const node of nodes) {
    if (remaining <= 0) {
      break;
    }
    const text = node.text.slice(0, remaining);
    remaining -= text.length;
    result.push({ ...node, text });
    if (text.length < node.text.length) {
      break;
    }
  }

  return result.length > 0 ? result : [{ text: "" }];
}

export function slicePreviewBlockPlainText(
  block: SerializedPreviewBlock,
  visibleChars: number,
): SerializedPreviewBlock {
  if (!block.ok || !block.output || isInstantRevealPreviewBlock(block)) {
    return block;
  }

  const output = block.output;

  switch (output.kind) {
    case "title_block_preview":
      return {
        ...block,
        output: {
          ...output,
          text: slicePlainText(output.text, visibleChars),
        },
      };
    case "text_block_preview":
      return {
        ...block,
        output: {
          ...output,
          nodes: sliceInlineNodes(output.nodes, visibleChars),
        },
      };
    case "quote_preview": {
      const full = extractPreviewBlockPlainText(block);
      const sliced = slicePlainText(full, visibleChars);
      const textLen = output.text.length;
      return {
        ...block,
        output: {
          ...output,
          text: sliced.slice(0, textLen),
          attribution:
            sliced.length > textLen ? sliced.slice(textLen) : undefined,
        },
      };
    }
    case "highlight_preview": {
      const label = output.label ?? "";
      const labelLen = label.length;
      const sliced = slicePlainText(extractPreviewBlockPlainText(block), visibleChars);
      return {
        ...block,
        output: {
          ...output,
          label: sliced.slice(0, labelLen) || undefined,
          text: sliced.slice(labelLen),
        },
      };
    }
    default:
      return visibleChars >= extractPreviewBlockPlainText(block).length ? block : block;
  }
}

export function buildPreviewBlocksForReveal(
  blocks: SerializedPreviewBlock[],
  revealedBlockCount: number,
  activeBlockIndex: number,
  activeVisibleChars: number,
): SerializedPreviewBlock[] {
  return blocks.flatMap((block, index) => {
    if (index < revealedBlockCount) {
      return [block];
    }
    if (index === activeBlockIndex) {
      if (isInstantRevealPreviewBlock(block)) {
        return [block];
      }
      return [slicePreviewBlockPlainText(block, activeVisibleChars)];
    }
    return [];
  });
}
