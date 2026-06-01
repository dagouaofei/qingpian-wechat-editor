export type InlineStyleRecord = Record<string, string | number | undefined>;

export function buildInlineStyle(styles: InlineStyleRecord): string {
  return Object.entries(styles)
    .filter(([, value]) => value != null && value !== "")
    .map(([property, value]) => {
      const kebab = property.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
      return `${kebab}:${value}`;
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
