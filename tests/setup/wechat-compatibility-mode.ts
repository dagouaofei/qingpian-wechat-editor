import { WECHAT_COMPATIBILITY_MODE_ENV_VARS } from "@/core/wechat-compatibility/resolve-wechat-compatibility-mode";

/**
 * Most tests were authored when compatibility validation was always active.
 * Production default is `off` (DECISION-109); tests opt into `enforce` here unless
 * a file explicitly clears or overrides env (see global-compatibility-mode.test.ts).
 */
if (!process.env[WECHAT_COMPATIBILITY_MODE_ENV_VARS.primary]) {
  process.env[WECHAT_COMPATIBILITY_MODE_ENV_VARS.primary] = "enforce";
}
