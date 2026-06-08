import {
  describeWechatCompatibilityMode,
  getWechatCompatibilityMode,
  type WechatCompatibilityMode,
} from "@/core/wechat-compatibility/resolve-wechat-compatibility-mode";

export type HarvestWechatCompatibilityMode = WechatCompatibilityMode;

export {
  DEFAULT_WECHAT_COMPATIBILITY_MODE as DEFAULT_HARVEST_WECHAT_COMPATIBILITY_MODE,
  parseWechatCompatibilityMode as parseHarvestWechatCompatibilityMode,
} from "@/core/wechat-compatibility/resolve-wechat-compatibility-mode";

export function getHarvestWechatCompatibilityMode(): HarvestWechatCompatibilityMode {
  return getWechatCompatibilityMode();
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
  off: "sanitize only; compatibility validation and copy shaping are disabled globally.",
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
  publicEnvVar: string;
  legacyEnvVar: string;
  defaultMode: HarvestWechatCompatibilityMode;
} {
  const described = describeWechatCompatibilityMode(mode);
  return {
    mode,
    label: HARVEST_WECHAT_COMPATIBILITY_MODE_LABELS[mode],
    hint: HARVEST_WECHAT_COMPATIBILITY_MODE_HINTS[mode],
    envVar: described.envVar,
    publicEnvVar: described.publicEnvVar,
    legacyEnvVar: described.legacyEnvVar,
    defaultMode: described.defaultMode,
  };
}
