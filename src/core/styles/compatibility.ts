import { STYLE_SCHEMA_VERSION } from "./tokens";
import { weChatCompatibilityProfileSchema } from "./schemas";
import type {
  CompatibilityIssue,
  CssCompatibilityLevel,
  CssCompatibilityResult,
  VariantDefinition,
  WeChatCompatibilityCheckResult,
  WeChatCompatibilityProfile,
} from "./types";

const FORBIDDEN_DECLARATION_PATTERNS: Array<{
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
    code: "tailwind_class_dependency",
    pattern: /\b(className|class)\s*=/i,
    message: "Tailwind class / className dependencies are forbidden in copy HTML",
  },
];

function normalizeProperty(property: string): string {
  return property.trim().toLowerCase();
}

function normalizeValue(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function propertyValueKey(property: string, value: string): string {
  return `${normalizeProperty(property)}:${normalizeValue(value)}`;
}

function buildIssue(
  code: string,
  message: string,
  level: CssCompatibilityLevel,
  severity: "error" | "warning",
  property?: string,
  value?: string,
): CompatibilityIssue {
  return { code, message, level, severity, property, value };
}

function cssResult(
  level: CssCompatibilityLevel,
  issues: CompatibilityIssue[],
  property?: string,
  value?: string,
): CssCompatibilityResult {
  const ok = level === "allowed";
  const message = issues[0]?.message;
  return { ok, level, issues, property, value, message };
}

function matchRuleList(
  rules: string[],
  property: string,
  value?: string,
): boolean {
  const normalizedProperty = normalizeProperty(property);
  for (const rule of rules) {
    if (rule.includes(":")) {
      if (value !== undefined && rule === propertyValueKey(property, value)) {
        return true;
      }
      continue;
    }
    if (normalizeProperty(rule) === normalizedProperty) {
      return true;
    }
  }
  return false;
}

function classifyPropertyAgainstProfile(
  profile: WeChatCompatibilityProfile,
  property: string,
  value?: string,
): CssCompatibilityLevel {
  if (matchRuleList(profile.cssRules.forbidden, property, value)) {
    return "forbidden";
  }
  if (matchRuleList(profile.cssRules.risky, property, value)) {
    return "risky";
  }
  if (matchRuleList(profile.cssRules.allowed, property)) {
    return "allowed";
  }
  return "unknown";
}

function scanForbiddenDeclarationPatterns(
  declaration: string,
): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];
  for (const { code, pattern, message } of FORBIDDEN_DECLARATION_PATTERNS) {
    if (pattern.test(declaration)) {
      issues.push(buildIssue(code, message, "forbidden", "error"));
    }
  }
  return issues;
}

export const WECHAT_MP_COMPATIBILITY_PROFILE: WeChatCompatibilityProfile = {
  id: "wechat-mp-editor-v1",
  name: "WeChat MP Editor Release 1",
  schemaVersion: STYLE_SCHEMA_VERSION,
  target: "wechat_mp_editor",
  cssRules: {
    allowed: [
      "font-family",
      "font-size",
      "line-height",
      "font-weight",
      "color",
      "background",
      "background-color",
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
      "border",
      "border-top",
      "border-right",
      "border-bottom",
      "border-left",
      "border-radius",
      "text-align",
      "letter-spacing",
      "white-space",
      "word-break",
    ],
    risky: [
      "display:flex",
      "display:grid",
      "position:relative",
      "box-shadow",
      "overflow",
      "min-height",
      "max-width",
      "width",
      "height",
    ],
    forbidden: [
      "position:absolute",
      "position:fixed",
      "animation",
      "transition",
      "transform",
      "hover",
    ],
  },
  fallbackPolicy: {
    onForbiddenCss: "reject",
    onRiskyCss: "warn",
    previewOnlyAllowed: false,
    notes:
      "Release 1 default: forbidden CSS rejected; risky CSS warns; preview_only blocked from copy path",
  },
  notes:
    "Release 1 WeChat MP editor compatibility profile. Does not replace manual paste QA.",
};

weChatCompatibilityProfileSchema.parse(WECHAT_MP_COMPATIBILITY_PROFILE);

export function validateCssPropertyCompatibility(
  property: string,
  profile: WeChatCompatibilityProfile = WECHAT_MP_COMPATIBILITY_PROFILE,
): CssCompatibilityResult {
  const normalizedProperty = normalizeProperty(property);
  const level = classifyPropertyAgainstProfile(profile, normalizedProperty);

  if (level === "allowed") {
    return cssResult("allowed", [], normalizedProperty);
  }

  if (level === "risky") {
    return cssResult("risky", [
      buildIssue(
        "css_property_risky",
        `CSS property "${normalizedProperty}" is risky for WeChat copy`,
        "risky",
        "warning",
        normalizedProperty,
      ),
    ], normalizedProperty);
  }

  if (level === "forbidden") {
    return cssResult("forbidden", [
      buildIssue(
        "css_property_forbidden",
        `CSS property "${normalizedProperty}" is forbidden for WeChat copy`,
        "forbidden",
        "error",
        normalizedProperty,
      ),
    ], normalizedProperty);
  }

  return cssResult("unknown", [
    buildIssue(
      "css_property_unknown",
      `CSS property "${normalizedProperty}" is not in allowed/risky/forbidden lists; must not silent allow`,
      "unknown",
      "warning",
      normalizedProperty,
    ),
  ], normalizedProperty);
}

export function validateCssDeclarationCompatibility(
  declaration: string,
  profile: WeChatCompatibilityProfile = WECHAT_MP_COMPATIBILITY_PROFILE,
): CssCompatibilityResult {
  const trimmed = declaration.trim();
  if (!trimmed) {
    return cssResult("unknown", [
      buildIssue(
        "css_declaration_empty",
        "Empty CSS declaration is not allowed",
        "unknown",
        "warning",
      ),
    ]);
  }

  const patternIssues = scanForbiddenDeclarationPatterns(trimmed);
  if (patternIssues.length > 0) {
    return cssResult("forbidden", patternIssues);
  }

  const colonIndex = trimmed.indexOf(":");
  if (colonIndex === -1) {
    return cssResult("forbidden", [
      buildIssue(
        "css_declaration_invalid",
        "CSS declaration must be property:value or match a forbidden pattern",
        "forbidden",
        "error",
      ),
    ]);
  }

  const property = trimmed.slice(0, colonIndex);
  const value = trimmed.slice(colonIndex + 1).replace(/;$/, "").trim();
  const propertyResult = validateCssPropertyCompatibility(property, profile);

  const pvLevel = classifyPropertyAgainstProfile(
    profile,
    property,
    value,
  );

  if (pvLevel === "forbidden") {
    return cssResult("forbidden", [
      buildIssue(
        "css_declaration_forbidden",
        `CSS declaration "${propertyValueKey(property, value)}" is forbidden for WeChat copy`,
        "forbidden",
        "error",
        normalizeProperty(property),
        value,
      ),
    ], normalizeProperty(property), value);
  }

  if (pvLevel === "risky") {
    return cssResult("risky", [
      buildIssue(
        "css_declaration_risky",
        `CSS declaration "${propertyValueKey(property, value)}" is risky for WeChat copy`,
        "risky",
        "warning",
        normalizeProperty(property),
        value,
      ),
    ], normalizeProperty(property), value);
  }

  if (propertyResult.level === "unknown") {
    return propertyResult;
  }

  return cssResult("allowed", [], normalizeProperty(property), value);
}

export function validateVariantWechatCompatibility(
  variant: VariantDefinition,
  profile: WeChatCompatibilityProfile = WECHAT_MP_COMPATIBILITY_PROFILE,
): WeChatCompatibilityCheckResult {
  const issues: CompatibilityIssue[] = [];
  const copySafety = variant.compatibility?.copySafety;
  let blocking = false;

  if (
    variant.status === "release1_required" &&
    copySafety === "preview_only"
  ) {
    blocking = true;
    issues.push(
      buildIssue(
        "preview_only_release1_required",
        "release1_required variant must not use copySafety preview_only",
        "forbidden",
        "error",
      ),
    );
  }

  if (copySafety === "preview_only" && !profile.fallbackPolicy.previewOnlyAllowed) {
    issues.push(
      buildIssue(
        "preview_only_copy_path_blocked",
        "preview_only variants are blocked from default copy-safe path in Release 1",
        "forbidden",
        variant.status === "release1_candidate" ? "warning" : "error",
      ),
    );
    if (variant.status !== "release1_candidate") {
      blocking = true;
    }
  }

  const wechat = variant.compatibility?.wechat;
  if (wechat?.forbiddenCssProperties) {
    for (const declaration of wechat.forbiddenCssProperties) {
      const result = validateCssDeclarationCompatibility(declaration, profile);
      if (result.level === "forbidden" || result.level === "unknown") {
        issues.push(
          buildIssue(
            "variant_declared_forbidden_css",
            `Variant declares forbidden CSS: ${declaration}`,
            result.level === "forbidden" ? "forbidden" : "unknown",
            "error",
            result.property,
            result.value,
          ),
        );
        blocking = true;
      }
    }
  }

  if (wechat?.riskyCssProperties) {
    for (const declaration of wechat.riskyCssProperties) {
      const result = validateCssDeclarationCompatibility(declaration, profile);
      if (result.level === "risky" || result.level === "unknown") {
        issues.push(
          buildIssue(
            "variant_declared_risky_css",
            `Variant declares risky CSS: ${declaration}`,
            result.level,
            "warning",
            result.property,
            result.value,
          ),
        );
      } else if (result.level === "forbidden") {
        issues.push(
          buildIssue(
            "variant_declared_forbidden_css",
            `Variant declares forbidden CSS as risky list item: ${declaration}`,
            "forbidden",
            "error",
            result.property,
            result.value,
          ),
        );
        blocking = true;
      }
    }
  }

  if (wechat?.allowedCssProperties) {
    for (const declaration of wechat.allowedCssProperties) {
      const result = validateCssDeclarationCompatibility(declaration, profile);
      if (!result.ok) {
        issues.push(
          buildIssue(
            "variant_allowed_css_not_copy_safe",
            `Variant allowedCssProperties entry is not copy-safe: ${declaration}`,
            result.level,
            result.level === "forbidden" ? "error" : "warning",
            result.property,
            result.value,
          ),
        );
        if (result.level === "forbidden") {
          blocking = true;
        }
      }
    }
  }

  const ok = !blocking && issues.every((issue) => issue.severity !== "error");

  return {
    ok,
    issues,
    variantId: variant.id,
    copySafety,
    blocking,
  };
}

export function parseWeChatCompatibilityProfile(
  input: unknown,
): WeChatCompatibilityProfile {
  return weChatCompatibilityProfileSchema.parse(input);
}
