import type { CompatibilityTransformResult } from "./compatibility-transformer";
import {
  validateHtmlStructureCompatibility,
  type WechatCompatibilityValidationResult,
} from "./compatibility-validator";
import { normalizeAndValidateWechatHtml } from "./wechat-compatibility-spec";

export type HarvestWechatCompatibilityMode = "off" | "report" | "enforce";

export const DEFAULT_HARVEST_WECHAT_COMPATIBILITY_MODE: HarvestWechatCompatibilityMode = "report";

export function parseHarvestWechatCompatibilityMode(
  value: string | undefined,
): HarvestWechatCompatibilityMode {
  if (value === "off" || value === "report" || value === "enforce") {
    return value;
  }
  return DEFAULT_HARVEST_WECHAT_COMPATIBILITY_MODE;
}

export function applyWechatCompatibilityForHarvest(
  html: string,
  mode: HarvestWechatCompatibilityMode,
): {
  html: string;
  transform: CompatibilityTransformResult;
  validation: WechatCompatibilityValidationResult;
} {
  if (mode === "enforce") {
    const enforced = normalizeAndValidateWechatHtml(html);
    return {
      html: enforced.transform.html,
      transform: enforced.transform,
      validation: enforced.validation,
    };
  }

  const trimmed = html.trim();
  const passthroughTransform: CompatibilityTransformResult = {
    html: trimmed,
    issues: [],
    downgraded: [],
  };

  if (mode === "off") {
    return {
      html: trimmed,
      transform: passthroughTransform,
      validation: { valid: true, issues: [] },
    };
  }

  return {
    html: trimmed,
    transform: passthroughTransform,
    validation: validateHtmlStructureCompatibility(trimmed),
  };
}
