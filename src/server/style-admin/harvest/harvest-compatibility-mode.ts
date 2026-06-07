import {
  DEFAULT_HARVEST_WECHAT_COMPATIBILITY_MODE,
  parseHarvestWechatCompatibilityMode,
  type HarvestWechatCompatibilityMode,
} from "@/core/wechat-compatibility/harvest-compat-mode";

export type { HarvestWechatCompatibilityMode };

export function getHarvestWechatCompatibilityMode(): HarvestWechatCompatibilityMode {
  return parseHarvestWechatCompatibilityMode(process.env.STYLE_HARVEST_WECHAT_COMPATIBILITY_MODE);
}

export const HARVEST_WECHAT_COMPATIBILITY_MODE_LABELS: Record<
  HarvestWechatCompatibilityMode,
  string
> = {
  off: "off",
  report: "report",
  enforce: "enforce",
};

export const HARVEST_WECHAT_COMPATIBILITY_MODE_HINTS: Record<
  HarvestWechatCompatibilityMode,
  string
> = {
  off: "sanitize only; compatibility risks are not enforced.",
  report: "compatibility issues are reported but not enforced.",
  enforce: "compatibility rules may downgrade or block candidate creation.",
};

export function describeHarvestWechatCompatibilityMode(
  mode: HarvestWechatCompatibilityMode = getHarvestWechatCompatibilityMode(),
): {
  mode: HarvestWechatCompatibilityMode;
  label: string;
  hint: string;
  envVar: string;
  defaultMode: HarvestWechatCompatibilityMode;
} {
  return {
    mode,
    label: HARVEST_WECHAT_COMPATIBILITY_MODE_LABELS[mode],
    hint: HARVEST_WECHAT_COMPATIBILITY_MODE_HINTS[mode],
    envVar: "STYLE_HARVEST_WECHAT_COMPATIBILITY_MODE",
    defaultMode: DEFAULT_HARVEST_WECHAT_COMPATIBILITY_MODE,
  };
}
