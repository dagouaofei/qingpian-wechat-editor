import {
  GenerationModelProviderError,
  type GenerationModelProviderErrorCode,
} from "./model-provider-errors";

export const VOLCENGINE_ENV_KEYS = {
  API_KEY: "VOLCENGINE_API_KEY",
  BASE_URL: "VOLCENGINE_BASE_URL",
  MODEL: "VOLCENGINE_MODEL",
  TIMEOUT_MS: "VOLCENGINE_TIMEOUT_MS",
  ENABLE: "VOLCENGINE_ENABLE_REAL_PROVIDER",
} as const;

export const DEFAULT_VOLCENGINE_BASE_URL =
  "https://ark.cn-beijing.volces.com/api/v3";
export const DEFAULT_VOLCENGINE_TIMEOUT_MS = 60_000;

export type GenerationModelProviderName = "volcengine" | "deterministic";

export type GenerationModelProviderConfig = {
  provider: GenerationModelProviderName;
  enabled: boolean;
  apiKey?: string;
  baseUrl: string;
  model?: string;
  timeoutMs: number;
};

export type GenerationModelProviderConfigIssue = {
  code: GenerationModelProviderErrorCode;
  message: string;
};

export type GenerationModelProviderConfigResult =
  | { ok: true; config: GenerationModelProviderConfig }
  | { ok: false; issues: GenerationModelProviderConfigIssue[] };

function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (value == null || value.trim() === "") {
    return defaultValue;
  }
  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

function parseTimeoutMs(value: string | undefined): number {
  if (!value || value.trim() === "") {
    return DEFAULT_VOLCENGINE_TIMEOUT_MS;
  }
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_VOLCENGINE_TIMEOUT_MS;
  }
  return parsed;
}

export function loadVolcengineProviderConfig(
  env: Record<string, string | undefined> = process.env,
): GenerationModelProviderConfigResult {
  const enabled = parseBoolean(env[VOLCENGINE_ENV_KEYS.ENABLE], false);
  const apiKey = env[VOLCENGINE_ENV_KEYS.API_KEY]?.trim();
  const model = env[VOLCENGINE_ENV_KEYS.MODEL]?.trim();
  const baseUrl =
    env[VOLCENGINE_ENV_KEYS.BASE_URL]?.trim() || DEFAULT_VOLCENGINE_BASE_URL;
  const timeoutMs = parseTimeoutMs(env[VOLCENGINE_ENV_KEYS.TIMEOUT_MS]);

  const config: GenerationModelProviderConfig = {
    provider: "volcengine",
    enabled,
    apiKey: apiKey || undefined,
    baseUrl,
    model: model || undefined,
    timeoutMs,
  };

  const issues: GenerationModelProviderConfigIssue[] = [];

  if (!enabled) {
    issues.push({
      code: "config_disabled",
      message: "Volcengine real provider is disabled",
    });
  }

  if (!apiKey) {
    issues.push({
      code: "config_missing_api_key",
      message: "VOLCENGINE_API_KEY is required for the Volcengine provider",
    });
  }

  if (!model) {
    issues.push({
      code: "config_missing_model",
      message: "VOLCENGINE_MODEL is required for the Volcengine provider",
    });
  }

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  return { ok: true, config };
}

export function assertVolcengineProviderConfig(
  result: GenerationModelProviderConfigResult,
): GenerationModelProviderConfig {
  if (!result.ok) {
    const primary = result.issues[0]!;
    throw new GenerationModelProviderError(primary.code, primary.message, {
      recoverable: primary.code === "config_disabled",
    });
  }
  return result.config;
}
