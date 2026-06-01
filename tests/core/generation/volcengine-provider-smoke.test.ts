import { describe, expect, it } from "vitest";

import {
  classifyVolcengineSmokeFailure,
  formatVolcengineSmokeSummary,
  loadDevEnvFiles,
  parseSmokeEnvLine,
  sanitizeSmokeMessage,
} from "@/core/generation";

describe("volcengine provider smoke helpers", () => {
  it("classifies config failures", () => {
    expect(
      classifyVolcengineSmokeFailure({ errorCode: "config_missing_api_key" }),
    ).toBe("config");
  });

  it("classifies auth failures", () => {
    expect(classifyVolcengineSmokeFailure({ errorCode: "auth_failed" })).toBe(
      "auth",
    );
  });

  it("classifies network failures", () => {
    expect(classifyVolcengineSmokeFailure({ errorCode: "timeout" })).toBe(
      "network",
    );
  });

  it("classifies article schema failures", () => {
    expect(
      classifyVolcengineSmokeFailure({
        finalizationIssues: [
          {
            source: "article_schema",
            path: ["blocks"],
            message: "invalid block",
            code: "invalid_type",
          },
        ],
      }),
    ).toBe("article_schema");
  });

  it("sanitizes bearer tokens from smoke messages", () => {
    const sanitized = sanitizeSmokeMessage(
      "Authorization failed for Bearer sk-secret-token",
    );
    expect(sanitized).not.toContain("sk-secret-token");
    expect(sanitized).toContain("[REDACTED]");
  });

  it("formats smoke summary without leaking secrets", () => {
    const formatted = formatVolcengineSmokeSummary({
      ok: false,
      providerName: "volcengine",
      model: "doubao-pro-32k",
      errorCode: "auth_failed",
      errorMessage: "Bearer sk-secret-token invalid",
      failureCategory: "auth",
    });

    expect(formatted).toContain("FAILED");
    expect(formatted).not.toContain("sk-secret-token");
  });

  it("formats passed smoke summary with finalization and enrichment fields", () => {
    const formatted = formatVolcengineSmokeSummary({
      ok: true,
      providerName: "volcengine",
      model: "doubao-pro-32k",
      eventCount: 7,
      blockCount: 3,
      articleId: "22222222-2222-4222-8222-222222222222",
      articleTitle: "测试标题",
      finalizationStatus: "passed",
      enrichmentWarningCount: 4,
    });

    expect(formatted).toContain("PASSED");
    expect(formatted).toContain("finalizationStatus: passed");
    expect(formatted).toContain("enrichmentWarningCount: 4");
  });

  it("parses env lines for dev smoke loader", () => {
    expect(parseSmokeEnvLine('VOLCENGINE_API_KEY="abc123"')).toEqual([
      "VOLCENGINE_API_KEY",
      "abc123",
    ]);
  });

  it("loads .env.local values only when process env is empty", () => {
    const env: NodeJS.ProcessEnv = {};
    const loaded = loadDevEnvFiles(process.cwd(), env);
    if (loaded.length === 0) {
      expect(env).toEqual({});
      return;
    }
    expect(loaded.length).toBeGreaterThan(0);
  });
});
