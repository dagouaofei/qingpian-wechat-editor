import { describe, expect, it } from "vitest";

import { buildArticlePlainText, inlineTextInputToPlainText } from "@/core/copy";
import type { InlineTextInput } from "@/core/article";
import { createTextFirstCopyArticleFixture } from "../../fixtures/copy/text-first-copy-fixtures";

describe("plain text fallback builder", () => {
  it("renders title / heading / lead / paragraph as plain text", () => {
    const article = createTextFirstCopyArticleFixture();
    const plainText = buildArticlePlainText(article);

    expect(plainText).toContain("轻篇复制快照标题");
    expect(plainText).toContain("章节标题");
    expect(plainText).toContain("这是一段用于复制快照的导语。");
    expect(plainText).toContain("正文包含 加粗、高亮 与 安全链接。");
  });

  it("does not output html tags or divider pollution", () => {
    const article = createTextFirstCopyArticleFixture();
    const plainText = buildArticlePlainText(article);

    expect(plainText).not.toMatch(/<[^>]*>/);
    expect(plainText).not.toContain("divider");
    expect(plainText).not.toContain("border-top");
  });

  it("drops InlineContent marks to their text only", () => {
    const input: InlineTextInput = [
      { text: "bold", marks: [{ type: "bold" }] },
      { text: " link", marks: [{ type: "link", href: "https://example.com" }] },
    ];

    expect(inlineTextInputToPlainText(input)).toBe("bold link");
  });

  it("does not leak unsafe link href into plain text", () => {
    const input = [
      {
        text: "click",
        marks: [{ type: "link", href: "javascript:alert(1)" }],
      },
    ] as unknown as InlineTextInput;

    const plainText = inlineTextInputToPlainText(input);

    expect(plainText).toBe("click");
    expect(plainText).not.toContain("javascript:");
  });
});
