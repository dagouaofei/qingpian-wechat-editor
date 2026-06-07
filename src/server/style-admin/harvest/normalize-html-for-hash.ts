import { createHash } from "node:crypto";

import type { HtmlHarvestDetectableBlockType } from "./html-harvest-types";
import { sanitizeHarvestHtml } from "./sanitize-harvest-html";

export function normalizeHtmlForHash(rawHtml: string): string {
  return sanitizeHarvestHtml(rawHtml).replace(/\s+/g, " ").trim();
}

export function buildHtmlHarvestShortHash(
  rawHtml: string,
  blockType: HtmlHarvestDetectableBlockType,
): string {
  const normalized = `${blockType}:${normalizeHtmlForHash(rawHtml)}`;
  return createHash("sha256").update(normalized).digest("hex").slice(0, 8);
}

export function buildHtmlHarvestRuntimeVariantId(
  blockType: HtmlHarvestDetectableBlockType,
  rawHtml: string,
): string {
  const shortHash = buildHtmlHarvestShortHash(rawHtml, blockType);
  return `${blockType}_html_paste_${shortHash}_candidate`;
}
