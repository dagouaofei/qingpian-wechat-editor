/**
 * Copy-safe DOM primitives (S8-STORY-006C).
 * Visual styles on content nodes (`p` / `h1` / `h3`); `section` is margin-only wrapper.
 */

import { wrapInlineElement, type InlineStyleRecord } from "./inline-style";

export function wrapCopySafeMarginSection(
  marginVertical: string,
  innerHtml: string,
): string {
  return wrapInlineElement("section", { margin: marginVertical }, innerHtml);
}

export type CopySafeSurfaceOptions = {
  backgroundColor?: string;
  border?: string;
  borderLeft?: string;
  borderTop?: string;
  borderBottom?: string;
  padding?: string;
};

export function mergeInlineStyles(
  ...parts: Array<InlineStyleRecord | undefined>
): InlineStyleRecord {
  return Object.assign({}, ...parts.filter(Boolean));
}

/** Card / info-box: background + border + padding on the content node (no section shell). */
export function copySafeCardContentStyle(
  base: InlineStyleRecord,
  surface: CopySafeSurfaceOptions,
): InlineStyleRecord {
  return mergeInlineStyles(base, {
    margin: "0",
    padding: surface.padding ?? "12px 16px",
    backgroundColor: surface.backgroundColor,
    border: surface.border,
    borderLeft: surface.borderLeft,
    borderTop: surface.borderTop,
    borderBottom: surface.borderBottom,
  });
}

/** Left border + padding on the same node as text. */
export function copySafeLeftBorderContentStyle(
  base: InlineStyleRecord,
  borderLeft: string,
  options?: { paddingLeft?: string; backgroundColor?: string; padding?: string },
): InlineStyleRecord {
  return mergeInlineStyles(base, {
    margin: "0",
    borderLeft,
    paddingLeft: options?.paddingLeft ?? "12px",
    padding: options?.padding,
    backgroundColor: options?.backgroundColor,
  });
}

export function titleBlockHeadingTag(blockType: "title" | "heading"): "h1" | "h3" {
  return blockType === "title" ? "h1" : "h3";
}

export function wrapTitleHeadingElement(
  blockType: "title" | "heading",
  styles: InlineStyleRecord,
  innerHtml: string,
): string {
  return wrapInlineElement(titleBlockHeadingTag(blockType), styles, innerHtml);
}
