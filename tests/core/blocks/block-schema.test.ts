import { describe, expect, it } from "vitest";

import { inlineContentSchema } from "@/core/article";
import {
  blockSchema,
  paragraphBlockSchema,
  leadBlockSchema,
} from "@/core/blocks";

const BLOCK_ID = "11111111-1111-4111-8111-111111111111";

describe("block schema contract", () => {
  describe("valid blocks", () => {
    it("parses title block", () => {
      expect(
        blockSchema.parse({
          id: BLOCK_ID,
          type: "title",
          content: { text: "文章标题" },
        }),
      ).toMatchObject({ type: "title" });
    });

    it("parses lead block with string text", () => {
      expect(
        blockSchema.parse({
          id: BLOCK_ID,
          type: "lead",
          content: { text: "导语段落" },
        }),
      ).toMatchObject({ type: "lead" });
    });

    it("parses lead block with InlineContent text", () => {
      const content = [{ text: "导语", marks: [{ type: "bold" as const }] }];
      expect(
        blockSchema.parse({
          id: BLOCK_ID,
          type: "lead",
          content: { text: content },
        }),
      ).toMatchObject({ content: { text: content } });
    });

    it("parses heading block", () => {
      expect(
        blockSchema.parse({
          id: BLOCK_ID,
          type: "heading",
          content: { text: "章节标题", level: 2 },
        }),
      ).toMatchObject({ type: "heading", content: { level: 2 } });
    });

    it("parses paragraph block with string text", () => {
      expect(
        blockSchema.parse({
          id: BLOCK_ID,
          type: "paragraph",
          content: { text: "正文内容" },
        }),
      ).toMatchObject({ type: "paragraph" });
    });

    it("parses paragraph block with InlineContent text", () => {
      const content = [{ text: "关键词", marks: [{ type: "highlight" as const }] }];
      expect(
        blockSchema.parse({
          id: BLOCK_ID,
          type: "paragraph",
          content: { text: content },
        }),
      ).toMatchObject({ content: { text: content } });
    });

    it("parses divider block", () => {
      expect(
        blockSchema.parse({
          id: BLOCK_ID,
          type: "divider",
          content: { style: "line" },
        }),
      ).toMatchObject({ type: "divider" });
    });

    it("parses list block", () => {
      expect(
        blockSchema.parse({
          id: BLOCK_ID,
          type: "list",
          content: {
            ordered: true,
            items: [{ text: "第一项", subItems: ["子项"] }],
          },
        }),
      ).toMatchObject({ type: "list" });
    });

    it("parses quote block", () => {
      expect(
        blockSchema.parse({
          id: BLOCK_ID,
          type: "quote",
          content: { text: "引用内容", attribution: "作者" },
        }),
      ).toMatchObject({ type: "quote" });
    });

    it("parses highlight block", () => {
      expect(
        blockSchema.parse({
          id: BLOCK_ID,
          type: "highlight",
          content: { text: "重点", label: "提示" },
        }),
      ).toMatchObject({ type: "highlight" });
    });

    it("parses info_card block with body field", () => {
      expect(
        blockSchema.parse({
          id: BLOCK_ID,
          type: "info_card",
          content: { title: "卡片标题", body: "卡片正文", icon: "info" },
        }),
      ).toMatchObject({ type: "info_card", content: { body: "卡片正文" } });
    });

    it("parses cta block", () => {
      expect(
        blockSchema.parse({
          id: BLOCK_ID,
          type: "cta",
          content: { text: "立即关注", action: "follow" },
        }),
      ).toMatchObject({ type: "cta" });
    });

    it("parses image_placeholder block", () => {
      expect(
        blockSchema.parse({
          id: BLOCK_ID,
          type: "image_placeholder",
          content: {
            caption: "配图说明",
            aspectRatio: "16:9",
            position: "full",
            suggestion: "团队讨论场景",
          },
        }),
      ).toMatchObject({ type: "image_placeholder" });
    });
  });

  describe("invalid blocks", () => {
    it("rejects unknown block type", () => {
      expect(() =>
        blockSchema.parse({
          id: BLOCK_ID,
          type: "unknown",
          content: { text: "x" },
        }),
      ).toThrow();
    });

    it("rejects missing required content", () => {
      expect(() =>
        blockSchema.parse({
          id: BLOCK_ID,
          type: "paragraph",
          content: {},
        }),
      ).toThrow();
    });

    it("rejects content.body on paragraph", () => {
      expect(() =>
        paragraphBlockSchema.parse({
          id: BLOCK_ID,
          type: "paragraph",
          content: { body: "wrong field" },
        }),
      ).toThrow();
    });

    it("rejects content.body on lead", () => {
      expect(() =>
        leadBlockSchema.parse({
          id: BLOCK_ID,
          type: "lead",
          content: { body: "wrong field" },
        }),
      ).toThrow();
    });

    it("rejects style injection on block", () => {
      expect(() =>
        blockSchema.parse({
          id: BLOCK_ID,
          type: "title",
          content: { text: "标题" },
          style: { color: "red" },
        }),
      ).toThrow();
    });

    it("rejects className injection on block", () => {
      expect(() =>
        blockSchema.parse({
          id: BLOCK_ID,
          type: "title",
          content: { text: "标题" },
          className: "evil",
        }),
      ).toThrow();
    });

    it("rejects html field injection on content", () => {
      expect(() =>
        blockSchema.parse({
          id: BLOCK_ID,
          type: "paragraph",
          content: { text: "ok", html: "<p>x</p>" },
        }),
      ).toThrow();
    });

    it("rejects HTML in plain text content", () => {
      expect(() =>
        blockSchema.parse({
          id: BLOCK_ID,
          type: "title",
          content: { text: "<b>bad</b>" },
        }),
      ).toThrow();
    });

    it("rejects invalid InlineContent in paragraph", () => {
      expect(() =>
        blockSchema.parse({
          id: BLOCK_ID,
          type: "paragraph",
          content: {
            text: [{ text: "x", marks: [{ type: "link", href: "not-url" }] }],
          },
        }),
      ).toThrow();
    });
  });

  describe("InlineContent reuse", () => {
    it("paragraph accepts string via inlineTextInputSchema path", () => {
      expect(
        paragraphBlockSchema.parse({
          id: BLOCK_ID,
          type: "paragraph",
          content: { text: "plain" },
        }).content.text,
      ).toBe("plain");
    });

    it("paragraph accepts InlineContent array", () => {
      const nodes = [{ text: "a" }];
      expect(
        paragraphBlockSchema.parse({
          id: BLOCK_ID,
          type: "paragraph",
          content: { text: nodes },
        }).content.text,
      ).toEqual(nodes);
    });

    it("lead accepts string and InlineContent", () => {
      expect(
        leadBlockSchema.parse({
          id: BLOCK_ID,
          type: "lead",
          content: { text: "导语" },
        }).content.text,
      ).toBe("导语");

      const nodes = [{ text: "导语", marks: [{ type: "italic" as const }] }];
      expect(
        leadBlockSchema.parse({
          id: BLOCK_ID,
          type: "lead",
          content: { text: nodes },
        }).content.text,
      ).toEqual(nodes);
    });

    it("uses @/core/article inlineContentSchema for InlineContent nodes", () => {
      const nodes = [{ text: "ok", marks: [{ type: "bold" as const }] }];
      expect(inlineContentSchema.parse(nodes)).toEqual(nodes);
      expect(
        paragraphBlockSchema.parse({
          id: BLOCK_ID,
          type: "paragraph",
          content: { text: nodes },
        }).content.text,
      ).toEqual(nodes);
    });
  });
});
