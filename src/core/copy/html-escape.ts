const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char] ?? char);
}

export function escapeHtmlAttribute(value: string): string {
  return escapeHtml(value);
}

export function assertCopySafeHtml(html: string): void {
  if (/\bclass\s*=/.test(html)) {
    throw new Error("Copy HTML must not use className/class attribute");
  }
  if (/<style[\s>]/i.test(html)) {
    throw new Error("Copy HTML must not use style tags");
  }
}
