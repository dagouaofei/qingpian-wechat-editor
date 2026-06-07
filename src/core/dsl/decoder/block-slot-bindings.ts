import type { Block, BlockType } from "@/core/blocks";

export type SlotContentMap = Record<string, string>;

function inlineTextToPlain(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value
      .map((node) => {
        if (typeof node === "object" && node !== null && "text" in node) {
          return String((node as { text?: unknown }).text ?? "");
        }
        return "";
      })
      .join("");
  }
  return "";
}

export function resolveSlotContentsForBlock(block: Block): SlotContentMap {
  const content = block.content as Record<string, unknown>;

  switch (block.type as BlockType) {
    case "title":
    case "heading":
      return { title: String(content.text ?? "") };
    case "lead":
    case "paragraph":
      return { text: inlineTextToPlain(content.text) };
    case "quote":
      return {
        text: String(content.text ?? ""),
        attribution: String(content.attribution ?? ""),
      };
    case "highlight":
      return {
        text: String(content.text ?? ""),
        label: String(content.label ?? ""),
      };
    case "info_card":
      return {
        title: String(content.title ?? ""),
        body: String(content.body ?? ""),
      };
    case "cta":
      return {
        text: String(content.text ?? ""),
        action: String(content.action ?? ""),
      };
    case "list": {
      const items = Array.isArray(content.items) ? content.items : [];
      return {
        items: items
          .map((item) => {
            if (typeof item === "object" && item !== null && "text" in item) {
              return String((item as { text?: unknown }).text ?? "");
            }
            return "";
          })
          .join("\n"),
      };
    }
    case "divider":
      return { style: String(content.style ?? "line") };
    case "image_placeholder":
      return {
        alt: String(content.alt ?? ""),
        caption: String(content.caption ?? ""),
      };
    default:
      return { text: JSON.stringify(content) };
  }
}
