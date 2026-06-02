import { describe, expect, it } from "vitest";

import { topicOnlyInputRequestFixture } from "../../fixtures/generation";
import { runGenerateMainFlow } from "@/server/generation/run-generate-main-flow";

describe("runGenerateMainFlow", () => {
  it("returns a finalized Article through deterministic fallback provider", async () => {
    const result = await runGenerateMainFlow({
      inputRequest: topicOnlyInputRequestFixture,
      requestId: "generate-flow-test",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.data.providerMode).toBe("deterministic");
    expect(result.data.article.version).toBe(1);
    expect(result.data.article.blocks.length).toBeGreaterThan(0);
    expect(result.data.phasesCompleted).toContain("ready");
  });

  it("applies style selection before preview rendering", async () => {
    const result = await runGenerateMainFlow({
      inputRequest: topicOnlyInputRequestFixture,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.data.article.styleAssignment.blockOverrides?.length).toBeGreaterThan(0);
    expect(result.data.previewBlocks.length).toBeGreaterThan(0);
    expect(result.data.previewBlocks.every((block) => block.ok)).toBe(true);
  });

  it("builds clipboard payload with html and plain text", async () => {
    const result = await runGenerateMainFlow({
      inputRequest: topicOnlyInputRequestFixture,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.data.clipboard.textHtml.length).toBeGreaterThan(0);
    expect(result.data.clipboard.textPlain.length).toBeGreaterThan(0);
    expect(result.data.clipboard.textHtml).not.toEqual(result.data.clipboard.textPlain);
  });

  it("does not leak API key material in success payload", async () => {
    const result = await runGenerateMainFlow({
      inputRequest: topicOnlyInputRequestFixture,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    const serialized = JSON.stringify(result.data);
    expect(serialized).not.toContain("VOLCENGINE_API_KEY");
    expect(serialized).not.toMatch(/Bearer\s+[A-Za-z0-9._-]+/);
  });

  it("returns provider_config when requireRealProvider and Volcengine is not configured", async () => {
    const result = await runGenerateMainFlow({
      inputRequest: topicOnlyInputRequestFixture,
      requireRealProvider: true,
    });

    if (process.env.VOLCENGINE_ENABLE_REAL_PROVIDER === "true" && process.env.VOLCENGINE_API_KEY) {
      expect(result.ok).toBe(true);
      return;
    }

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.category).toBe("provider_config");
    expect(result.error.code).toBe("real_provider_not_configured");
  });

  it("returns input_validation for empty topic-only requests", async () => {
    const result = await runGenerateMainFlow({
      inputRequest: {
        mode: "topic_only",
        topic: "",
      },
    });

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.category).toBe("input_validation");
  });

  it("preserves block content semantics during style selection", async () => {
    const result = await runGenerateMainFlow({
      inputRequest: topicOnlyInputRequestFixture,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    for (const block of result.data.article.blocks) {
      expect(block.content).toBeTruthy();
    }
  });
});
