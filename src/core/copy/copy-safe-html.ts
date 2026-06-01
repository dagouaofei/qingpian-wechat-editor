import { assertCopySafeHtml } from "./html-escape";

export const COPY_SAFE_HTML_VIOLATION_CODES = [
  "class_attribute",
  "style_tag",
  "script_tag",
  "event_handler",
  "external_stylesheet",
  "absolute_position",
  "transform",
  "pseudo_element",
  "flex_or_grid_layout",
] as const;

export type CopySafeHtmlViolationCode =
  (typeof COPY_SAFE_HTML_VIOLATION_CODES)[number];

export type CopySafeHtmlViolation = {
  code: CopySafeHtmlViolationCode;
  message: string;
};

const COPY_SAFE_HTML_PATTERNS: Array<{
  code: CopySafeHtmlViolationCode;
  pattern: RegExp;
  message: string;
}> = [
  {
    code: "class_attribute",
    pattern: /\bclass(?:Name)?\s*=/i,
    message: "Copy HTML must not use class/className attributes",
  },
  {
    code: "style_tag",
    pattern: /<style[\s>]/i,
    message: "Copy HTML must not use style tags",
  },
  {
    code: "script_tag",
    pattern: /<script[\s>]/i,
    message: "Copy HTML must not use script tags",
  },
  {
    code: "event_handler",
    pattern: /\son[a-z]+\s*=/i,
    message: "Copy HTML must not use event handler attributes",
  },
  {
    code: "external_stylesheet",
    pattern: /<link\b[^>]*\brel\s*=\s*["']?stylesheet|href\s*=\s*["'][^"']+\.css["']/i,
    message: "Copy HTML must not use external stylesheets",
  },
  {
    code: "absolute_position",
    pattern: /\bposition\s*:\s*absolute/i,
    message: "Copy HTML must not use absolute positioning",
  },
  {
    code: "transform",
    pattern: /\btransform\s*:/i,
    message: "Copy HTML must not use transform",
  },
  {
    code: "pseudo_element",
    pattern: /::|:before|:after/i,
    message: "Copy HTML must not rely on pseudo elements",
  },
  {
    code: "flex_or_grid_layout",
    pattern: /\bdisplay\s*:\s*(flex|grid)/i,
    message: "Copy HTML must not depend on flex/grid layout",
  },
];

export function collectCopySafeHtmlViolations(
  html: string,
): CopySafeHtmlViolation[] {
  return COPY_SAFE_HTML_PATTERNS.filter(({ pattern }) => pattern.test(html)).map(
    ({ code, message }) => ({ code, message }),
  );
}

export function assertCopySafeHtmlSnapshot(html: string): void {
  assertCopySafeHtml(html);

  const violations = collectCopySafeHtmlViolations(html);
  if (violations.length > 0) {
    throw new Error(violations.map((violation) => violation.message).join("; "));
  }
}

export function isCopySafeHtmlSnapshot(html: string): boolean {
  return collectCopySafeHtmlViolations(html).length === 0;
}
