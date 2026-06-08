/** Inline style properties allowed in WeChat-compatible Copy HTML. */
export const WECHAT_ALLOWED_STYLE_PROPERTIES = [
  "display",
  "margin",
  "margin-top",
  "margin-bottom",
  "margin-left",
  "margin-right",
  "padding",
  "padding-top",
  "padding-bottom",
  "padding-left",
  "padding-right",
  "border",
  "border-left",
  "border-right",
  "border-top",
  "border-bottom",
  "border-radius",
  "border-left-width",
  "border-left-style",
  "border-left-color",
  "background",
  "background-color",
  "color",
  "font-size",
  "font-weight",
  "font-style",
  "line-height",
  "text-align",
  "text-decoration",
  "letter-spacing",
  "width",
  "height",
  "max-width",
  "box-sizing",
] as const;

export const WECHAT_FORBIDDEN_STYLE_PROPERTIES = [
  "position",
  "z-index",
  "transform",
  "animation",
  "filter",
  "backdrop-filter",
  "box-shadow",
  "float",
  "overflow",
] as const;

export function normalizeStylePropertyName(property: string): string {
  return property.trim().toLowerCase();
}

export function isWechatAllowedStyleProperty(property: string): boolean {
  const normalized = normalizeStylePropertyName(property);
  return (WECHAT_ALLOWED_STYLE_PROPERTIES as readonly string[]).includes(normalized);
}
