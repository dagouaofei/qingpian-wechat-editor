import { filterAllowedInlineStyles } from "@/core/wechat-compatibility";
import type { DslRenderTarget, DslStyle } from "../runtime/dsl-types";

function dslStyleToCssMap(style: DslStyle): Record<string, string> {
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(style)) {
    const cssKey = key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
    normalized[cssKey] = String(value);
  }
  return normalized;
}

export function dslStyleToInlineCss(
  style: DslStyle | undefined,
  target: DslRenderTarget = "preview",
): string {
  if (!style) return "";
  const normalized = dslStyleToCssMap(style);
  const serialized =
    target === "copy_wechat" ? filterAllowedInlineStyles(normalized) : normalized;
  return Object.entries(serialized)
    .map(([key, value]) => `${key}: ${value}`)
    .join("; ");
}
