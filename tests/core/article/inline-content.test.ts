import { describe, expect, it } from "vitest";

import {
  InlineContentValidationError,
  inlineContentSchema,
  legacyEmphasisToMarks,
  normalizeInlineContent,
  parseInlineContent,
  parseInlineMark,
  isInlineContent,
} from "@/core/article";

describe("inline-content contract", () => {
  describe("normalizeInlineContent", () => {
    it("normalizes plain string to single-node InlineContent", () => {
      expect(normalizeInlineContent("hello")).toEqual([{ text: "hello" }]);
    });

    it("normalizes empty string to empty InlineContent", () => {
      expect(normalizeInlineContent("")).toEqual([]);
    });

    it("merges adjacent nodes with identical marks", () => {
      const input = [
        { text: "hello ", marks: [{ type: "bold" as const }] },
        { text: "world", marks: [{ type: "bold" as const }] },
      ];
      expect(normalizeInlineContent(input)).toEqual([
        { text: "hello world", marks: [{ type: "bold" }] },
      ]);
    });

    it("normalize output passes inlineContentSchema when non-empty", () => {
      const normalized = normalizeInlineContent([
        { text: "a", marks: [{ type: "italic" }] },
        { text: "b", marks: [{ type: "italic" }] },
      ]);
      expect(inlineContentSchema.parse(normalized)).toEqual(normalized);
    });
  });

  describe("parseInlineContent", () => {
    it("parses valid InlineContent", () => {
      const content = [{ text: "段落正文" }];
      expect(parseInlineContent(content)).toEqual(content);
    });

    it("parses content with multiple marks", () => {
      const content = [
        {
          text: "关键词",
          marks: [
            { type: "bold" as const },
            { type: "highlight" as const, semantic: "keyword" as const },
          ],
        },
      ];
      expect(parseInlineContent(content)).toEqual([
        {
          text: "关键词",
          marks: [
            { type: "bold" },
            { type: "highlight", semantic: "keyword" },
          ],
        },
      ]);
    });

    it("rejects empty text segments", () => {
      expect(() => parseInlineContent([{ text: "" }])).toThrow(
        InlineContentValidationError,
      );
    });

    it("rejects HTML in text", () => {
      expect(() =>
        parseInlineContent([{ text: "<span>bad</span>" }]),
      ).toThrow(InlineContentValidationError);
    });

    it("rejects CSS injection in text", () => {
      expect(() =>
        parseInlineContent([{ text: 'foo style="color:red"' }]),
      ).toThrow(InlineContentValidationError);
    });

    it("rejects empty InlineContent array", () => {
      expect(() => parseInlineContent([])).toThrow(
        InlineContentValidationError,
      );
    });
  });

  describe("parseInlineMark", () => {
    it("parses valid bold mark", () => {
      expect(parseInlineMark({ type: "bold" })).toEqual({ type: "bold" });
    });

    it("parses valid link mark with http URL", () => {
      expect(
        parseInlineMark({ type: "link", href: "https://example.com/path" }),
      ).toEqual({ type: "link", href: "https://example.com/path" });
    });

    it("parses color mark with semantic token", () => {
      expect(parseInlineMark({ type: "color", color: "brandPrimary" })).toEqual(
        { type: "color", color: "brandPrimary" },
      );
    });

    it("rejects unknown mark type", () => {
      expect(() => parseInlineMark({ type: "strong" })).toThrow(
        InlineContentValidationError,
      );
    });

    it("rejects className injection on mark", () => {
      expect(() =>
        parseInlineMark({ type: "bold", className: "evil" }),
      ).toThrow(InlineContentValidationError);
    });

    it("rejects style injection on mark", () => {
      expect(() =>
        parseInlineMark({ type: "bold", style: { color: "red" } }),
      ).toThrow(InlineContentValidationError);
    });

    it("rejects invalid link href", () => {
      expect(() =>
        parseInlineMark({ type: "link", href: "not-a-url" }),
      ).toThrow(InlineContentValidationError);
    });

    it("rejects CSS value as semantic color token", () => {
      expect(() =>
        parseInlineMark({ type: "color", color: "#ff0000" }),
      ).toThrow(InlineContentValidationError);
    });
  });

  describe("legacyEmphasisToMarks", () => {
    it("maps bold and italic emphasis to marks", () => {
      expect(legacyEmphasisToMarks(["bold", "italic"])).toEqual([
        { type: "bold" },
        { type: "italic" },
      ]);
    });
  });

  describe("isInlineContent", () => {
    it("returns true for valid array", () => {
      expect(isInlineContent([{ text: "ok" }])).toBe(true);
    });

    it("returns false for string input", () => {
      expect(isInlineContent("plain")).toBe(false);
    });

    it("returns false for wrapper object shape", () => {
      expect(
        isInlineContent({ type: "inline_content", children: [{ text: "x" }] }),
      ).toBe(false);
    });
  });
});
