import { describe, expect, it } from "vitest";

import {
  DEFAULT_VOLCENGINE_BASE_URL,
  DEFAULT_VOLCENGINE_TIMEOUT_MS,
  loadVolcengineProviderConfig,
} from "@/core/generation";

import {
  enabledVolcengineEnv,
  MOCK_VOLCENGINE_API_KEY,
} from "../../fixtures/generation";

describe("Volcengine provider config", () => {
  it("parses a valid config from environment variables", () => {
    const result = loadVolcengineProviderConfig(enabledVolcengineEnv);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.config.provider).toBe("volcengine");
    expect(result.config.enabled).toBe(true);
    expect(result.config.apiKey).toBe(MOCK_VOLCENGINE_API_KEY);
    expect(result.config.model).toBe("doubao-pro-32k");
    expect(result.config.baseUrl).toBe("https://ark.example.com/api/v3");
    expect(result.config.timeoutMs).toBe(30_000);
  });

  it("returns stable errors when API key is missing", () => {
    const result = loadVolcengineProviderConfig({
      ...enabledVolcengineEnv,
      VOLCENGINE_API_KEY: "",
    });
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.issues.some((issue) => issue.code === "config_missing_api_key")).toBe(
      true,
    );
  });

  it("returns stable errors when model is missing", () => {
    const result = loadVolcengineProviderConfig({
      ...enabledVolcengineEnv,
      VOLCENGINE_MODEL: "",
    });
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.issues.some((issue) => issue.code === "config_missing_model")).toBe(
      true,
    );
  });

  it("returns stable errors when real provider is disabled", () => {
    const result = loadVolcengineProviderConfig({
      ...enabledVolcengineEnv,
      VOLCENGINE_ENABLE_REAL_PROVIDER: "false",
    });
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.issues.some((issue) => issue.code === "config_disabled")).toBe(true);
  });

  it("uses defaults for base URL and timeout", () => {
    const result = loadVolcengineProviderConfig({
      VOLCENGINE_ENABLE_REAL_PROVIDER: "true",
      VOLCENGINE_API_KEY: "key",
      VOLCENGINE_MODEL: "model",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.config.baseUrl).toBe(DEFAULT_VOLCENGINE_BASE_URL);
    expect(result.config.timeoutMs).toBe(DEFAULT_VOLCENGINE_TIMEOUT_MS);
  });

  it("does not expose API key in config error messages beyond env key name", () => {
    const result = loadVolcengineProviderConfig({
      VOLCENGINE_ENABLE_REAL_PROVIDER: "true",
      VOLCENGINE_MODEL: "model",
    });
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    const serialized = JSON.stringify(result.issues);
    expect(serialized).not.toContain("sk-");
    expect(serialized).toContain("VOLCENGINE_API_KEY");
  });
});
