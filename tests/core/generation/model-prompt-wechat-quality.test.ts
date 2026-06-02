import { describe, expect, it } from "vitest";

import {
  buildVolcengineSystemPrompt,
  buildVolcengineUserPrompt,
} from "@/core/generation/model-prompt";
import { normalizeInputRequest } from "@/core/generation/input.normalize";
import { topicOnlyInputRequestFixture } from "../../fixtures/generation";

describe("Volcengine prompt WeChat article quality", () => {
  it("system prompt requires long-form WeChat structure and block types", () => {
    const prompt = buildVolcengineSystemPrompt();
    expect(prompt).toContain("1200-1500");
    expect(prompt).toContain("title, lead, heading");
    expect(prompt).toContain("highlight OR quote");
    expect(prompt).toContain("cta");
  });

  it("user prompt references styleIntent and section structure", () => {
    const normalized = normalizeInputRequest({
      ...topicOnlyInputRequestFixture,
      styleIntent: {
        notes: "文章用途/场景：知识科普",
        presetHint: "classic-news",
      },
    });
    const prompt = buildVolcengineUserPrompt(normalized);
    expect(prompt).toContain("4-5 sections");
    expect(prompt).toContain("styleIntent");
  });
});
