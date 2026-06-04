import {
  WECHAT_CONTRACT_V1_FORBIDDEN_DECLARATION_PATTERNS,
  WECHAT_SAFE_CONTRACT_V1_PROFILE,
  isComplexFlexDeclaration,
  isYellowCapabilityWaived,
  type CssClassificationContext,
} from "@/core/wechat-compat";

import { weChatCompatibilityProfileSchema } from "./schemas";
import type {
  CompatibilityIssue,
  CssCompatibilityLevel,
  CssCompatibilityResult,
  VariantDefinition,
  WeChatCompatibilityCheckResult,
  WeChatCompatibilityProfile,
} from "./types";

export type CssCompatibilityValidateOptions = {
  profile?: WeChatCompatibilityProfile;
  /** Variant/block context for Contract v1 Yellow waivers */
  waiverContext?: CssClassificationContext;
};

const FORBIDDEN_DECLARATION_PATTERNS =
  WECHAT_CONTRACT_V1_FORBIDDEN_DECLARATION_PATTERNS;

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

/**
 * Default WeChat compatibility profile — profileId `wechat-mp-editor-v1`, contract `wechat-safe-contract-v1`.
 * @see docs/architecture/wechat-safe-html-css-contract.md
 * @see src/core/wechat-compat/wechat-compat-profile.ts
 */
export const WECHAT_MP_COMPATIBILITY_PROFILE: WeChatCompatibilityProfile =
  WECHAT_SAFE_CONTRACT_V1_PROFILE;

export {
  WECHAT_SAFE_CONTRACT_V1_PROFILE,
  WECHAT_SAFE_CONTRACT_VERSION_ID,
} from "@/core/wechat-compat";

export function getWeChatSafeContractProfile() {
  return WECHAT_SAFE_CONTRACT_V1_PROFILE;
}

function applyWaiverToRiskyResult(
  declarationOrCapability: string,
  result: CssCompatibilityResult,
  context?: CssClassificationContext,
): CssCompatibilityResult {
  if (result.level !== "risky" || !context?.variantId) {
    return result;
  }
  if (!isYellowCapabilityWaived(declarationOrCapability, context)) {
    return result;
  }
  return {
    ...result,
    ok: true,
    issues: [
      ...result.issues,
      buildIssue(
        "css_yellow_waiver_applied",
        `Yellow capability waived for variant ${context.variantId}`,
        "risky",
        "warning",
        result.property,
        result.value,
      ),
    ],
  };
}

export function validateCssPropertyCompatibility(
  property: string,
  profileOrOptions:
    | WeChatCompatibilityProfile
    | CssCompatibilityValidateOptions = WECHAT_MP_COMPATIBILITY_PROFILE,
  legacyContext?: CssClassificationContext,
): CssCompatibilityResult {
  const profile =
    "cssRules" in profileOrOptions
      ? profileOrOptions
      : (profileOrOptions.profile ?? WECHAT_MP_COMPATIBILITY_PROFILE);
  const waiverContext =
    "cssRules" in profileOrOptions
      ? legacyContext
      : profileOrOptions.waiverContext;
  const normalizedProperty = normalizeProperty(property);
  const level = classifyPropertyAgainstProfile(profile, normalizedProperty);

  if (level === "allowed") {
    return cssResult("allowed", [], normalizedProperty);
  }

  if (level === "risky") {
    return applyWaiverToRiskyResult(
      normalizedProperty,
      cssResult("risky", [
        buildIssue(
          "css_property_risky",
          `CSS property "${normalizedProperty}" is risky (Contract Yellow) for WeChat copy`,
          "risky",
          "warning",
          normalizedProperty,
        ),
      ], normalizedProperty),
      waiverContext,
    );
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
  profileOrOptions:
    | WeChatCompatibilityProfile
    | CssCompatibilityValidateOptions = WECHAT_MP_COMPATIBILITY_PROFILE,
  legacyContext?: CssClassificationContext,
): CssCompatibilityResult {
  const profile =
    "cssRules" in profileOrOptions
      ? profileOrOptions
      : (profileOrOptions.profile ?? WECHAT_MP_COMPATIBILITY_PROFILE);
  const waiverContext =
    "cssRules" in profileOrOptions
      ? legacyContext
      : profileOrOptions.waiverContext;
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

  if (isComplexFlexDeclaration(property, value)) {
    return cssResult("forbidden", [
      buildIssue(
        "css_complex_flex_forbidden",
        "Complex flex layout is forbidden in WeChat copy (Contract Red)",
        "forbidden",
        "error",
        normalizeProperty(property),
        value,
      ),
    ], normalizeProperty(property), value);
  }

  const propertyResult = validateCssPropertyCompatibility(
    property,
    profile,
    waiverContext,
  );

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
    const capabilityKey =
      value.includes("linear-gradient") || value.includes("gradient")
        ? "linear-gradient"
        : propertyValueKey(property, value);
    return applyWaiverToRiskyResult(
      capabilityKey,
      cssResult("risky", [
        buildIssue(
          "css_declaration_risky",
          `CSS declaration "${propertyValueKey(property, value)}" is risky (Contract Yellow) for WeChat copy`,
          "risky",
          "warning",
          normalizeProperty(property),
          value,
        ),
      ], normalizeProperty(property), value),
      waiverContext,
    );
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
      const isStrict = copySafety === "strict";
      if (result.level === "risky" || result.level === "unknown") {
        issues.push(
          buildIssue(
            "variant_declared_risky_css",
            `Variant declares risky CSS: ${declaration}`,
            result.level,
            isStrict ? "error" : "warning",
            result.property,
            result.value,
          ),
        );
        if (isStrict) {
          blocking = true;
        }
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
        const isStrict = copySafety === "strict";
        const severity =
          result.level === "forbidden" || (isStrict && result.level === "risky")
            ? "error"
            : "warning";
        issues.push(
          buildIssue(
            "variant_allowed_css_not_copy_safe",
            `Variant allowedCssProperties entry is not copy-safe: ${declaration}`,
            result.level,
            severity,
            result.property,
            result.value,
          ),
        );
        if (severity === "error") {
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
