export type InlineStyleRecord = Record<string, string | number | undefined>;

import { formatFontFamilyForInlineStyle } from "./copy-typography";

function formatStyleValue(property: string, value: string | number): string | number {
  if (property === "fontFamily" && typeof value === "string") {
    return formatFontFamilyForInlineStyle(value);
  }
  return value;
}

export function buildInlineStyle(styles: InlineStyleRecord): string {
  return Object.entries(styles)
    .filter(([, value]) => value != null && value !== "")
    .map(([property, value]) => {
      const kebab = property.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
      const formatted = formatStyleValue(property, value as string | number);
      return `${kebab}:${formatted}`;
    })
    .join(";");
}

export function wrapInlineElement(
  tag: keyof HTMLElementTagNameMap | "section" | "p" | "span",
  styles: InlineStyleRecord,
  innerHtml: string,
): string {
  return `<${tag} style="${buildInlineStyle(styles)}">${innerHtml}</${tag}>`;
}
