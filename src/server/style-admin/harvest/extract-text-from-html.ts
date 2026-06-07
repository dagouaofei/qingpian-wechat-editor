export function stripHtmlTags(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractFirstStrongText(html: string): string | null {
  const match = html.match(/<strong[^>]*>([\s\S]*?)<\/strong>/i);
  if (!match?.[1]) {
    return null;
  }
  return stripHtmlTags(match[1]);
}

export function extractFirstParagraphText(html: string): string | null {
  const match = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (!match?.[1]) {
    return null;
  }
  return stripHtmlTags(match[1]);
}
