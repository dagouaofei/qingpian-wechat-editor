import { describe, expect, it } from "vitest";

import {
  buildHomeInputRequest,
  homeFormFromSearchParams,
  homeFormToSearchParams,
  validateHomeForm,
} from "@/lib/home-input";

describe("home input", () => {
  it("rejects empty topic", () => {
    const result = validateHomeForm({
      topic: "   ",
      scene: "",
      audience: "",
      basicStyle: "",
    });
    expect(result.ok).toBe(false);
  });

  it("builds topic_only InputRequest with context in styleIntent.notes", () => {
    const request = buildHomeInputRequest({
      topic: "春季护肤指南",
      scene: "knowledge",
      audience: "parents",
      basicStyle: "classic-news",
    });

    expect(request.mode).toBe("topic_only");
    expect(request.topic).toBe("春季护肤指南");
    expect(request.styleIntent?.presetHint).toBe("classic-news");
    expect(request.styleIntent?.notes).toContain("知识科普");
    expect(request.styleIntent?.notes).toContain("宝妈");
    expect(request.metadata?.source).toBe("home-ui");
  });

  it("round-trips search params", () => {
    const params = homeFormToSearchParams({
      topic: "测试主题",
      scene: "opinion",
      audience: "office_workers",
      basicStyle: "classic",
    });
    const restored = homeFormFromSearchParams(params);
    expect(restored.topic).toBe("测试主题");
    expect(restored.scene).toBe("opinion");
    expect(restored.audience).toBe("office_workers");
    expect(restored.basicStyle).toBe("classic");
  });
});
