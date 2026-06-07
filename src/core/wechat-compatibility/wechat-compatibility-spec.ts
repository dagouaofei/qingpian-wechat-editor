import { WECHAT_ALLOWED_TAGS, WECHAT_FORBIDDEN_TAGS } from "./allowed-tags";
import {
  WECHAT_ALLOWED_STYLE_PROPERTIES,
  WECHAT_FORBIDDEN_STYLE_PROPERTIES,
} from "./allowed-style-properties";
import {
  transformHtmlToWechatCompatible,
  type CompatibilityTransformResult,
} from "./compatibility-transformer";
import {
  validateHtmlStructureCompatibility,
  type WechatCompatibilityValidationResult,
} from "./compatibility-validator";

export type WechatCompatibilitySpec = {
  version: "s10.wechat-compatibility.v1";
  allowedTags: readonly string[];
  forbiddenTags: readonly string[];
  allowedStyleProperties: readonly string[];
  forbiddenStyleProperties: readonly string[];
};

export const WECHAT_COMPATIBILITY_SPEC: WechatCompatibilitySpec = {
  version: "s10.wechat-compatibility.v1",
  allowedTags: WECHAT_ALLOWED_TAGS,
  forbiddenTags: WECHAT_FORBIDDEN_TAGS,
  allowedStyleProperties: WECHAT_ALLOWED_STYLE_PROPERTIES,
  forbiddenStyleProperties: WECHAT_FORBIDDEN_STYLE_PROPERTIES,
};

export function getWechatCompatibilityPromptRules(): string[] {
  return [
    "Use only allowlisted HTML tags for WeChat MP editor output.",
    `Allowed tags: ${WECHAT_ALLOWED_TAGS.join(", ")}`,
    `Forbidden tags: ${WECHAT_FORBIDDEN_TAGS.join(", ")}`,
    "Use inline styles only; no class attributes; no script; no event handlers.",
    `Allowed style properties: ${WECHAT_ALLOWED_STYLE_PROPERTIES.slice(0, 12).join(", ")}...`,
    "Prefer px/em/% color values; avoid calc(), !important, and url() in styles.",
  ];
}

export function normalizeAndValidateWechatHtml(html: string): {
  transform: CompatibilityTransformResult;
  validation: WechatCompatibilityValidationResult;
} {
  const transform = transformHtmlToWechatCompatible(html);
  const validation = validateHtmlStructureCompatibility(transform.html);
  return { transform, validation };
}
