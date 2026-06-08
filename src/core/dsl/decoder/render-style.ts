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

function synthesizeBottomBorderForCopy(styles: Record<string, string>): Record<string, string> {
  if (styles["border-bottom"]) {
    return styles;
  }

  const borderWidth = styles["border-width"];
  const borderColor = styles["border-color"];
  if (!borderWidth || !borderColor) {
    return styles;
  }

  const widthMatch = borderWidth.trim().match(/^0(?:px)?\s+0(?:px)?\s+([\d.]+px)$/i);
  if (!widthMatch) {
    return styles;
  }

  const borderStyle = styles["border-style"]?.trim() || "solid";
  const next = { ...styles, "border-bottom": `${widthMatch[1]} ${borderStyle} ${borderColor}` };
  delete next["border-width"];
  delete next["border-color"];
  delete next["border-style"];
  return next;
}

export function dslStyleToInlineCss(
  style: DslStyle | undefined,
  target: DslRenderTarget = "preview",
): string {
  if (!style) return "";
  const normalized = dslStyleToCssMap(style);
  const isCopyTarget = target === "copy_wechat" || target === "qa_snapshot";
  const copyReady = isCopyTarget ? synthesizeBottomBorderForCopy(normalized) : normalized;
  let serialized = isCopyTarget ? filterAllowedInlineStyles(copyReady) : copyReady;

  if (isCopyTarget) {
    const display = serialized.display?.trim().toLowerCase();
    if (display === "flex" || display === "inline-flex" || display === "grid") {
      serialized = { ...serialized, display: "block" };
    }

    const borderBottom = serialized["border-bottom"];
    if (borderBottom && /^([1-4])px\s+(solid|dashed|dotted)\b/i.test(borderBottom.trim())) {
      serialized = {
        ...serialized,
        display: serialized.display === "block" ? "inline-block" : (serialized.display ?? "inline-block"),
        width: serialized.width ?? "auto",
      };
    }
  }

  return Object.entries(serialized)
    .map(([key, value]) => `${key}: ${value}`)
    .join("; ");
}
