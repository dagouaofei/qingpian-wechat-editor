import { isWechatAllowedStyleProperty } from "./allowed-style-properties";
import { isWechatCompatibilityActive } from "./resolve-wechat-compatibility-mode";

export function normalizeStyleValue(value: string): string {
  const trimmed = value.trim();
  if (/^url\s*\(/i.test(trimmed)) {
    return "none";
  }
  if (/expression\s*\(/i.test(trimmed)) {
    return "inherit";
  }
  return trimmed.replace(/\s*!important\s*$/i, "");
}

export function parseInlineStyle(styleRaw: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const part of styleRaw.split(";")) {
    const colon = part.indexOf(":");
    if (colon <= 0) continue;
    const key = part.slice(0, colon).trim();
    const value = part.slice(colon + 1).trim();
    if (!key || !value) continue;
    result[key] = normalizeStyleValue(value);
  }
  return result;
}

export function serializeInlineStyle(styles: Record<string, string>): string {
  return Object.entries(styles)
    .filter(([key, value]) => key && value && isWechatAllowedStyleProperty(key))
    .map(([key, value]) => `${key}: ${value}`)
    .join("; ");
}

export function filterAllowedInlineStyles(styles: Record<string, string>): Record<string, string> {
  if (!isWechatCompatibilityActive()) {
    return styles;
  }

  const filtered: Record<string, string> = {};
  for (const [key, value] of Object.entries(styles)) {
    if (isWechatAllowedStyleProperty(key)) {
      filtered[key] = normalizeStyleValue(value);
    }
  }
  return filtered;
}
