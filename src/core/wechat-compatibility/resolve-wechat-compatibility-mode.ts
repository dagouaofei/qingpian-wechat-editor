export type WechatCompatibilityMode = "off" | "report" | "enforce";

export type HarvestWechatCompatibilityMode = WechatCompatibilityMode;

export const DEFAULT_WECHAT_COMPATIBILITY_MODE: WechatCompatibilityMode = "off";

/** @deprecated Use DEFAULT_WECHAT_COMPATIBILITY_MODE */
export const DEFAULT_HARVEST_WECHAT_COMPATIBILITY_MODE = DEFAULT_WECHAT_COMPATIBILITY_MODE;

export const WECHAT_COMPATIBILITY_MODE_ENV_VARS = {
  primary: "QINGPIAN_WECHAT_COMPATIBILITY_MODE",
  public: "NEXT_PUBLIC_QINGPIAN_WECHAT_COMPATIBILITY_MODE",
  legacyHarvest: "STYLE_HARVEST_WECHAT_COMPATIBILITY_MODE",
} as const;

export function parseWechatCompatibilityMode(
  value: string | undefined,
): WechatCompatibilityMode {
  if (value === "off" || value === "report" || value === "enforce") {
    return value;
  }
  return DEFAULT_WECHAT_COMPATIBILITY_MODE;
}

/** @deprecated Use parseWechatCompatibilityMode */
export const parseHarvestWechatCompatibilityMode = parseWechatCompatibilityMode;

function readEnvMode(value: string | undefined): WechatCompatibilityMode | null {
  if (value === undefined) {
    return null;
  }
  if (value === "off" || value === "report" || value === "enforce") {
    return value;
  }
  return null;
}

function readConfiguredWechatCompatibilityMode(): WechatCompatibilityMode | null {
  const env =
    typeof process !== "undefined" && process.env ? process.env : ({} as NodeJS.ProcessEnv);

  return (
    readEnvMode(env[WECHAT_COMPATIBILITY_MODE_ENV_VARS.primary]) ??
    readEnvMode(env[WECHAT_COMPATIBILITY_MODE_ENV_VARS.public]) ??
    readEnvMode(env[WECHAT_COMPATIBILITY_MODE_ENV_VARS.legacyHarvest])
  );
}

export function getWechatCompatibilityMode(): WechatCompatibilityMode {
  return readConfiguredWechatCompatibilityMode() ?? DEFAULT_WECHAT_COMPATIBILITY_MODE;
}

export function isWechatCompatibilityActive(
  mode: WechatCompatibilityMode = getWechatCompatibilityMode(),
): boolean {
  return mode === "report" || mode === "enforce";
}

export function describeWechatCompatibilityMode(
  mode: WechatCompatibilityMode = getWechatCompatibilityMode(),
): {
  mode: WechatCompatibilityMode;
  envVar: string;
  publicEnvVar: string;
  legacyEnvVar: string;
  defaultMode: WechatCompatibilityMode;
} {
  return {
    mode,
    envVar: WECHAT_COMPATIBILITY_MODE_ENV_VARS.primary,
    publicEnvVar: WECHAT_COMPATIBILITY_MODE_ENV_VARS.public,
    legacyEnvVar: WECHAT_COMPATIBILITY_MODE_ENV_VARS.legacyHarvest,
    defaultMode: DEFAULT_WECHAT_COMPATIBILITY_MODE,
  };
}
