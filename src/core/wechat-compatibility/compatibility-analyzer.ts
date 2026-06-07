import {
  validateHtmlStructureCompatibility,
  type WechatCompatibilityValidationResult,
} from "./compatibility-validator";
import type { HarvestWechatCompatibilityMode } from "./harvest-compat-mode";

export function analyzeWechatCompatibilityForHarvest(
  html: string,
  mode: HarvestWechatCompatibilityMode,
): WechatCompatibilityValidationResult {
  if (mode === "off") {
    return { valid: true, issues: [] };
  }
  return validateHtmlStructureCompatibility(html.trim());
}
