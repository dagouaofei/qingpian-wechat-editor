import { describe, expect, it } from "vitest";

import {
  INPUT_LIMITS,
  InputRequestError,
  normalizeInputRequest,
  parseAndNormalizeInputRequest,
  parseInputRequest,
  validateInputRequest,
} from "@/core/generation";

import {
  draftRewriteInputRequestFixture,
  materialsOnlyInputRequestFixture,
  topicOnlyInputRequestFixture,
  topicWithMaterialsInputRequestFixture,
} from "../../fixtures/generation";

describe("InputRequest / NormalizedInput contract", () => {
  it("accepts topic_only valid input", () => {
    const result = validateInputRequest(topicOnlyInputRequestFixture);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    const normalized = normalizeInputRequest(result.data);
    expect(normalized.topic).toBe("如何提高团队执行力");
    expect(normalized.primaryIntent).toBe("topic");
    expect(normalized.hasMaterials).toBe(false);
    expect(normalized.hasDraft).toBe(false);
  });

  it("accepts topic_with_materials valid input", () => {
    const normalized = parseAndNormalizeInputRequest(
      topicWithMaterialsInputRequestFixture,
    );
    expect(normalized.topic).toBe("春季产品发布会");
    expect(normalized.materials).toHaveLength(2);
    expect(normalized.materials[0]?.type).toBe("reference");
    expect(normalized.materials[1]?.type).toBe("outline");
    expect(normalized.primaryIntent).toBe("mixed");
    expect(normalized.sourceCount).toBe(3);
  });

  it("accepts draft_rewrite valid input", () => {
    const normalized = parseAndNormalizeInputRequest(
      draftRewriteInputRequestFixture,
    );
    expect(normalized.draft).toBe("这是一篇需要优化结构和排版的草稿正文。");
    expect(normalized.primaryIntent).toBe("draft");
    expect(normalized.hasDraft).toBe(true);
    expect(normalized.metadata?.requestId).toBe("req-draft-001");
  });

  it("fails when topic, materials, and draft are all empty", () => {
    const result = validateInputRequest({
      mode: "topic_only",
      topic: "   ",
      materials: [{ type: "note", text: "  " }],
      draft: "",
    });
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.issues.some((issue) => issue.code === "empty_input")).toBe(
      true,
    );
  });

  it("fails or warns when mode does not match input", () => {
    const topicOnlyMissing = validateInputRequest({
      mode: "topic_only",
      topic: "",
    });
    expect(topicOnlyMissing.ok).toBe(false);

    const draftMissing = validateInputRequest({
      mode: "draft_rewrite",
      draft: "",
    });
    expect(draftMissing.ok).toBe(false);

    const materialsOnly = validateInputRequest(materialsOnlyInputRequestFixture);
    expect(materialsOnly.ok).toBe(true);
    if (!materialsOnly.ok) {
      return;
    }
    expect(
      materialsOnly.issues.some((issue) => issue.code === "missing_topic_warning"),
    ).toBe(true);
  });

  it("drops empty material text on normalize and records warning on validate", () => {
    const input = {
      mode: "topic_with_materials" as const,
      topic: "主题",
      materials: [
        { type: "note" as const, text: "有效资料" },
        { type: "plain_text" as const, text: "   " },
      ],
    };
    const validation = validateInputRequest(input);
    expect(validation.ok).toBe(true);
    if (!validation.ok) {
      return;
    }
    expect(
      validation.issues.some((issue) => issue.code === "empty_material_dropped"),
    ).toBe(true);

    const normalized = normalizeInputRequest(validation.data);
    expect(normalized.materials).toHaveLength(1);
    expect(normalized.materials[0]?.text).toBe("有效资料");
  });

  it("trims topic, draft, and material text", () => {
    const normalized = parseAndNormalizeInputRequest({
      mode: "topic_with_materials",
      topic: "  主题  ",
      draft: "  不应进入 topic_only  ",
      materials: [{ type: "note", text: "  资料  " }],
    });
    expect(normalized.topic).toBe("主题");
    expect(normalized.materials[0]?.text).toBe("资料");
  });

  it("preserves stable material source order by order then index", () => {
    const normalized = parseAndNormalizeInputRequest({
      mode: "topic_with_materials",
      topic: "排序测试",
      materials: [
        { type: "note", text: "second", order: 2 },
        { type: "outline", text: "first", order: 1 },
        { type: "reference", text: "third-by-index" },
      ],
    });
    expect(normalized.materials.map((source) => source.text)).toEqual([
      "first",
      "second",
      "third-by-index",
    ]);
  });

  it("rejects styleIntent with html / css / className / style / variantId", () => {
    const htmlResult = validateInputRequest({
      mode: "topic_only",
      topic: "主题",
      styleIntent: { tone: "<b>bold</b>" },
    });
    expect(htmlResult.ok).toBe(false);

    const forbiddenField = validateInputRequest({
      mode: "topic_only",
      topic: "主题",
      styleIntent: { variantId: "title_plain_minimal" },
    });
    expect(forbiddenField.ok).toBe(false);

    expect(() =>
      parseInputRequest({
        mode: "topic_only",
        topic: "主题",
        styleIntent: { notes: 'className="x"' },
      }),
    ).toThrow(InputRequestError);
  });

  it("fails or warns on overly long input", () => {
    const longTopic = "a".repeat(INPUT_LIMITS.MAX_TOPIC_LENGTH + 1);
    const topicResult = validateInputRequest({
      mode: "topic_only",
      topic: longTopic,
    });
    expect(topicResult.ok).toBe(false);

    const longDraft = "b".repeat(INPUT_LIMITS.MAX_DRAFT_LENGTH + 1);
    const draftResult = validateInputRequest({
      mode: "draft_rewrite",
      draft: longDraft,
    });
    expect(draftResult.ok).toBe(false);
  });

  it("parseAndNormalizeInputRequest returns stable NormalizedInput", () => {
    const normalized = parseAndNormalizeInputRequest(
      topicWithMaterialsInputRequestFixture,
    );
    expect(normalized.inputSummary).toContain("topic: 春季产品发布会");
    expect(normalized.inputSummary).toContain("materials: 2 source(s)");
    expect(normalized.normalizedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(normalized.materials.every((source) => source.order >= 0)).toBe(
      true,
    );
  });

  it("validateInputRequest does not throw on invalid input", () => {
    expect(() =>
      validateInputRequest({ mode: "invalid-mode", topic: "x" }),
    ).not.toThrow();

    const result = validateInputRequest({ mode: "invalid-mode", topic: "x" });
    expect(result.ok).toBe(false);
  });

  it("allows HTML-like text in topic as plain text without parsing", () => {
    const normalized = parseAndNormalizeInputRequest({
      mode: "topic_only",
      topic: "<p>保留为普通文本</p>",
    });
    expect(normalized.topic).toBe("<p>保留为普通文本</p>");
  });
});
