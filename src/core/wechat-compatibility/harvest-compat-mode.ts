import { analyzeWechatCompatibilityForHarvest } from "./compatibility-analyzer";
import type { CompatibilityTransformResult } from "./compatibility-transformer";
import type { WechatCompatibilityValidationResult } from "./compatibility-validator";
import { normalizeAndValidateWechatHtml } from "./wechat-compatibility-spec";
import {
  parseWechatCompatibilityMode,
  type WechatCompatibilityMode,
} from "./resolve-wechat-compatibility-mode";

export type HarvestWechatCompatibilityMode = WechatCompatibilityMode;

export {
  DEFAULT_WECHAT_COMPATIBILITY_MODE as DEFAULT_HARVEST_WECHAT_COMPATIBILITY_MODE,
  parseWechatCompatibilityMode as parseHarvestWechatCompatibilityMode,
} from "./resolve-wechat-compatibility-mode";

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
    validation: analyzeWechatCompatibilityForHarvest(trimmed, mode),
  };
}
