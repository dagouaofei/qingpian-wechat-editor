import type { HtmlHarvestDetectedBlockType } from "./html-harvest-types";
import { sanitizeHarvestHtml } from "./sanitize-harvest-html";

function stripTags(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countTag(html: string, tag: string): number {
  const pattern = new RegExp(`<\\s*${tag}\\b`, "gi");
  return (html.match(pattern) ?? []).length;
}

function hasHeadingDecoration(html: string): boolean {
  const lower = html.toLowerCase();
  return (
    /border-left\s*:\s*\d+px/.test(lower) ||
    /border-bottom\s*:\s*\d+px/.test(lower) ||
    lower.includes("badge") ||
    /font-weight\s*:\s*(700|bold)/.test(lower)
  );
}

function hasCardContainerSignals(html: string): boolean {
  const lower = html.toLowerCase();
  const paragraphCount = countTag(html, "p");
  const strongCount = countTag(html, "strong");
  return (
    (lower.includes("background") && lower.includes("border")) ||
    (lower.includes("padding") && paragraphCount >= 1) ||
    (strongCount >= 1 && paragraphCount >= 1) ||
    lower.includes("核心提示") ||
    lower.includes("info")
  );
}

export function detectHtmlBlockType(rawHtml: string): HtmlHarvestDetectedBlockType {
  const sanitized = sanitizeHarvestHtml(rawHtml);
  if (!sanitized) {
    return "unknown";
  }

  const lower = sanitized.toLowerCase();
  const plainText = stripTags(sanitized);
  const headingTagCount = ["h1", "h2", "h3", "h4", "h5", "h6"].reduce(
    (sum, tag) => sum + countTag(sanitized, tag),
    0,
  );

  const headingScore =
    (headingTagCount > 0 ? 3 : 0) +
    (plainText.length > 0 && plainText.length <= 80 ? 2 : 0) +
    (hasHeadingDecoration(sanitized) ? 2 : 0) +
    (countTag(sanitized, "section") === 1 && countTag(sanitized, "p") === 0 ? 1 : 0);

  const infoCardScore =
    (countTag(sanitized, "p") >= 1 ? 2 : 0) +
    (countTag(sanitized, "strong") >= 1 ? 1 : 0) +
    (hasCardContainerSignals(sanitized) ? 3 : 0) +
    (plainText.length > 40 ? 1 : 0) +
    (lower.includes("border-radius") ? 1 : 0);

  if (headingScore >= 4 && headingScore > infoCardScore) {
    return "heading";
  }
  if (infoCardScore >= 4 && infoCardScore > headingScore) {
    return "info_card";
  }
  if (headingScore >= 3 && infoCardScore >= 3) {
    return "unknown";
  }
  if (headingScore >= 3) {
    return "heading";
  }
  if (infoCardScore >= 3) {
    return "info_card";
  }
  return "unknown";
}
