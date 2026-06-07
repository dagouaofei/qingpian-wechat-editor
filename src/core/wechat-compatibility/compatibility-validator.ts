import { validateWechatCopyHtml } from "@/core/wechat-compat/copy-html-validator";

import { isWechatAllowedTag, isWechatForbiddenTag } from "./allowed-tags";
import { isWechatAllowedStyleProperty } from "./allowed-style-properties";
import { parseInlineStyle } from "./style-normalizer";

export type WechatCompatibilityIssue = {
  code: string;
  message: string;
  level: "error" | "warning";
  tag?: string;
  property?: string;
};

export type WechatCompatibilityValidationResult = {
  valid: boolean;
  issues: WechatCompatibilityIssue[];
};

const TAG_PATTERN = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
const STYLE_ATTR_PATTERN = /style\s*=\s*["']([^"']*)["']/gi;

export function validateHtmlStructureCompatibility(html: string): WechatCompatibilityValidationResult {
  const issues: WechatCompatibilityIssue[] = [];

  if (/<script\b/i.test(html)) {
    issues.push({ code: "script_forbidden", message: "script tags are forbidden", level: "error" });
  }
  if (/\son\w+\s*=/i.test(html)) {
    issues.push({ code: "event_handler_forbidden", message: "event handlers are forbidden", level: "error" });
  }

  let tagMatch: RegExpExecArray | null;
  while ((tagMatch = TAG_PATTERN.exec(html)) !== null) {
    const tag = tagMatch[1].toLowerCase();
    if (isWechatForbiddenTag(tag)) {
      issues.push({
        code: "forbidden_tag",
        message: `Tag <${tag}> is forbidden`,
        level: "error",
        tag,
      });
    } else if (!isWechatAllowedTag(tag)) {
      issues.push({
        code: "unknown_tag",
        message: `Tag <${tag}> is not in allowlist`,
        level: "warning",
        tag,
      });
    }
  }

  let styleMatch: RegExpExecArray | null;
  while ((styleMatch = STYLE_ATTR_PATTERN.exec(html)) !== null) {
    const styles = parseInlineStyle(styleMatch[1]);
    for (const property of Object.keys(styles)) {
      if (!isWechatAllowedStyleProperty(property)) {
        issues.push({
          code: "disallowed_style_property",
          message: `Style property ${property} is not allowed`,
          level: "warning",
          property,
        });
      }
    }
  }

  const contract = validateWechatCopyHtml({ html });
  for (const error of contract.errors) {
    issues.push({
      code: error.code,
      message: error.message,
      level: "error",
      tag: error.tagName,
      property: error.property,
    });
  }
  for (const warning of contract.warnings) {
    issues.push({
      code: warning.code,
      message: warning.message,
      level: "warning",
      tag: warning.tagName,
      property: warning.property,
    });
  }

  return {
    valid: issues.every((issue) => issue.level !== "error"),
    issues,
  };
}
