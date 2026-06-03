import { describe, expect, it } from "vitest";

import type { SerializedPreviewBlock } from "@/server/generation/generate-flow-types";

import {
  buildPreviewBlocksForReveal,
  extractPreviewBlockPlainText,
  slicePreviewBlockPlainText,
} from "@/lib/preview-block-plain-text";

const titleBlock: SerializedPreviewBlock = {
  blockId: "b1",
  blockType: "title",
  ok: true,
  output: {
    kind: "title_block_preview",
    blockId: "b1",
    blockType: "title",
    variantId: "title-classic",
    layoutMode: "plain",
    text: "春季护肤指南",
    presentation: {},
    slots: {},
  },
  issues: [],
  warnings: [],
};

const paragraphBlock: SerializedPreviewBlock = {
  blockId: "b2",
  blockType: "paragraph",
  ok: true,
  output: {
    kind: "text_block_preview",
    blockId: "b2",
    blockType: "paragraph",
    variantId: "paragraph-classic",
    layout: "body",
    nodes: [{ text: "换季时节，敏感肌需要更温和的护理。" }],
  },
  issues: [],
  warnings: [],
};

describe("preview-block-plain-text", () => {
  it("extracts plain text from title and paragraph blocks", () => {
    expect(extractPreviewBlockPlainText(titleBlock)).toBe("春季护肤指南");
    expect(extractPreviewBlockPlainText(paragraphBlock)).toBe(
      "换季时节，敏感肌需要更温和的护理。",
    );
  });

  it("slices title block text for typewriter reveal", () => {
    const sliced = slicePreviewBlockPlainText(titleBlock, 3);
    expect(sliced.output?.kind).toBe("title_block_preview");
    if (sliced.output?.kind === "title_block_preview") {
      expect(sliced.output.text).toBe("春季护");
    }
  });

  it("builds progressively revealed block list", () => {
    const blocks = [titleBlock, paragraphBlock];
    expect(
      buildPreviewBlocksForReveal(blocks, 1, 1, 4).map((block) =>
        extractPreviewBlockPlainText(block),
      ),
    ).toEqual(["春季护肤指南", "换季时节"]);
  });
});
