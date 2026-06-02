import type { InlineContent, InlineMark } from "@/core/article";
import type { ThemeTokens } from "@/core/styles";
import { resolveThemePaletteTokens } from "@/core/styles/theme-palette-tokens";

import {
  resolveInlineMarkColor,
  resolveInlineMarkLink,
} from "@/core/renderer/inline-content-marks";
import type { RendererIssue } from "@/core/renderer/types";
import { escapeHtml, escapeHtmlAttribute } from "./html-escape";
import { wrapInlineElement } from "./inline-style";

export type RenderInlineContentCopyOptions = {
  content: InlineContent;
  themeTokens: ThemeTokens;
  defaultColor: string;
  blockId: string;
  blockType: "lead" | "paragraph";
  variantId: string;
};

export type RenderInlineContentCopyResult = {
  html: string;
  warnings: RendererIssue[];
};

export function renderInlineContentToCopyHtml(
  options: RenderInlineContentCopyOptions,
): RenderInlineContentCopyResult {
  const warnings: RendererIssue[] = [];
  const html = options.content
    .map((node) => renderTextNode(node.text, node.marks, options, warnings))
    .join("");

  return { html, warnings };
}

function renderTextNode(
  text: string,
  marks: InlineMark[] | undefined,
  options: RenderInlineContentCopyOptions,
  warnings: RendererIssue[],
): string {
  let html = escapeHtml(text);

  if (marks == null || marks.length === 0) {
    return html;
  }

  for (const mark of marks) {
    html = wrapMark(html, mark, options, warnings);
  }

  return html;
}

function wrapMark(
  innerHtml: string,
  mark: InlineMark,
  options: RenderInlineContentCopyOptions,
  warnings: RendererIssue[],
): string {
  switch (mark.type) {
    case "bold":
      return wrapInlineElement("span", { fontWeight: "bold" }, innerHtml);
    case "italic":
      return wrapInlineElement("span", { fontStyle: "italic" }, innerHtml);
    case "highlight":
      return wrapInlineElement(
        "span",
        {
          backgroundColor: "#fff3cd",
          padding: "0 2px",
        },
        innerHtml,
      );
    case "color": {
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
      return wrapInlineElement("span", { color: resolved.cssColor }, innerHtml);
    }
    case "link": {
      const resolved = resolveInlineMarkLink({
        href: mark.href,
        blockId: options.blockId,
        blockType: options.blockType,
        variantId: options.variantId,
      });
      if (resolved.issue) {
        warnings.push(resolved.issue);
      }
      if (resolved.state === "stripped" || resolved.href == null) {
        return innerHtml;
      }
      const linkColor = resolveThemePaletteTokens(options.themeTokens).textAccent;
      return `<a href="${escapeHtmlAttribute(resolved.href)}" style="color:${linkColor};text-decoration:underline">${innerHtml}</a>`;
    }
    default:
      return innerHtml;
  }
}
