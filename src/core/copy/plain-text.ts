import type { Article, InlineTextInput } from "@/core/article";
import type { Block } from "@/core/blocks";

function stripHtmlTags(text: string): string {
  return text.replace(/<[^>]*>/g, "");
}

export function inlineTextInputToPlainText(input: InlineTextInput): string {
  if (typeof input === "string") {
    return stripHtmlTags(input);
  }

  return stripHtmlTags(
    input
      .map((node) => node.text)
      .filter((text) => text.length > 0)
      .join(""),
  );
}

export function blockToPlainText(block: Block): string {
  switch (block.type) {
    case "title":
    case "heading":
      return stripHtmlTags(block.content.text);
    case "lead":
    case "paragraph":
      return inlineTextInputToPlainText(block.content.text);
    case "divider":
      return "";
    default:
      return "";
  }
}

export function buildArticlePlainText(article: Article): string {
  return article.blocks
    .map(blockToPlainText)
    .filter((text) => text.length > 0)
    .join("\n\n");
}
