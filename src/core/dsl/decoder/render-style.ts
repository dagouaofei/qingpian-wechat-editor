import { filterAllowedInlineStyles } from "@/core/wechat-compatibility";
import type { DslStyle } from "../runtime/dsl-types";

export function dslStyleToInlineCss(style: DslStyle | undefined): string {
  if (!style) return "";
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(style)) {
    const cssKey = key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
    normalized[cssKey] = String(value);
  }
  const filtered = filterAllowedInlineStyles(normalized);
  return Object.entries(filtered)
    .map(([key, value]) => `${key}: ${value}`)
    .join("; ");
}
