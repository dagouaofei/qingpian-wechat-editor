const EVENT_ATTR_PATTERN =
  /\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const SCRIPT_TAG_PATTERN = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

export function sanitizeHarvestHtml(rawHtml: string): string {
  let sanitized = rawHtml.trim();
  sanitized = sanitized.replace(SCRIPT_TAG_PATTERN, "");
  sanitized = sanitized.replace(EVENT_ATTR_PATTERN, "");
  return sanitized;
}

export function escapeHtmlForDisplay(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
