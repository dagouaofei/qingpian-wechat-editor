import type { WeChatCssRules } from "@/core/styles/types";

/** Properties that with display:flex indicate complex flex (Contract §4.3) */
export const COMPLEX_FLEX_AUXILIARY_PROPERTIES = [
  "flex-direction",
  "flex-wrap",
  "justify-content",
  "align-items",
  "align-content",
  "gap",
  "flex",
  "flex-grow",
  "flex-shrink",
  "flex-basis",
  "order",
] as const;

/**
 * Inline declaration patterns that are always Red (Validator STORY-004 will reuse).
 * @see docs/architecture/wechat-safe-html-css-contract.md §4.3 §6
 */
export const WECHAT_CONTRACT_V1_FORBIDDEN_DECLARATION_PATTERNS: Array<{
  code: string;
  pattern: RegExp;
  message: string;
}> = [
  {
    code: "css_variable",
    pattern: /var\s*\(\s*--/i,
    message: "CSS variables (var(--*)) are forbidden in WeChat copy HTML",
  },
  {
    code: "calc",
    pattern: /\bcalc\s*\(/i,
    message: "calc() is forbidden in WeChat copy HTML",
  },
  {
    code: "important",
    pattern: /!important\b/i,
    message: "!important is forbidden in WeChat copy HTML",
  },
  {
    code: "selector_rule",
    pattern: /(^|[\s,{])(\.[a-zA-Z_][\w-]*|#[a-zA-Z_][\w-]*)\s*\{/,
    message: "CSS selector rules are forbidden in WeChat copy HTML",
  },
  {
    code: "pseudo_selector",
    pattern: /::?(before|after|hover|focus|active|visited)\b/i,
    message: "Pseudo selectors are forbidden in WeChat copy HTML",
  },
  {
    code: "media_query",
    pattern: /@media\b/i,
    message: "@media queries are forbidden in WeChat copy HTML",
  },
  {
    code: "font_face",
    pattern: /@font-face\b/i,
    message: "External fonts (@font-face) are forbidden in WeChat copy HTML",
  },
  {
    code: "clipboard_class_attribute",
    pattern: /\bclass\s*=/i,
    message: "class attributes are forbidden in Clipboard HTML payload",
  },
  {
    code: "tailwind_class_dependency",
    pattern: /\bclassName\s*=/i,
    message: "className dependencies are forbidden in copy HTML",
  },
];

/** Contract v1 Green — property or property:value */
export const WECHAT_CONTRACT_V1_GREEN_CSS: string[] = [
  "font-size",
  "font-weight",
  "font-family",
  "color",
  "line-height",
  "text-align",
  "margin",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "padding",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "background-color",
  "border",
  "border-width",
  "border-style",
  "border-color",
  "border-top",
  "border-right",
  "border-bottom",
  "border-left",
  "display:block",
  "display:inline",
  "display:inline-block",
  "box-sizing:border-box",
];

/** Contract v1 Yellow */
export const WECHAT_CONTRACT_V1_YELLOW_CSS: string[] = [
  "border-radius",
  "box-shadow",
  "background",
  "opacity",
  "letter-spacing",
  "max-width",
  "min-width",
  "width",
  "height",
  "min-height",
  "vertical-align",
  "overflow",
  "word-break",
  "white-space",
  "box-decoration-break",
  "-webkit-box-decoration-break",
  "display:table",
  "display:table-row",
  "display:table-cell",
];

/** Contract v1 Red — property or property:value */
export const WECHAT_CONTRACT_V1_RED_CSS: string[] = [
  "position:absolute",
  "position:fixed",
  "z-index",
  "display:grid",
  "display:flex",
  "display:inline-flex",
  "transform",
  "filter",
  "backdrop-filter",
  "animation",
  "transition",
  "flex",
  "flex-grow",
  "flex-shrink",
  "flex-basis",
  "gap",
  "justify-content",
  "align-items",
  "align-content",
  "flex-wrap",
  "flex-direction",
  "order",
];

export function buildContractV1CssRules(): WeChatCssRules {
  return {
    allowed: [...WECHAT_CONTRACT_V1_GREEN_CSS],
    risky: [...WECHAT_CONTRACT_V1_YELLOW_CSS],
    forbidden: [...WECHAT_CONTRACT_V1_RED_CSS],
  };
}

export function isComplexFlexDeclaration(property: string, value: string): boolean {
  const p = property.trim().toLowerCase();
  const v = value.trim().toLowerCase();
  if (p === "display" && (v === "flex" || v === "inline-flex")) {
    return true;
  }
  return COMPLEX_FLEX_AUXILIARY_PROPERTIES.some((aux) => p === aux);
}
