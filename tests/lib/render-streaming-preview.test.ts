import { describe, expect, it } from "vitest";

import { normalizeInputRequest } from "@/core/generation/input.normalize";
import {
  computeStreamingPreviewContentRevision,
  renderStreamingPreviewBlocks,
} from "@/lib/render-streaming-preview";
import type { StreamingPreviewBlock } from "@/app/preview/streaming-preview-panel";

const STREAM_STYLE_INPUT = normalizeInputRequest({
  mode: "topic_only",
  topic: "测试主题",
  styleIntent: { densityHint: "medium" },
  metadata: { locale: "zh-CN", source: "test" },
});

describe("renderStreamingPreviewBlocks", () => {
  it("renders lead block at block.start before any delta (text defaults to empty string)", () => {
    const blocks: StreamingPreviewBlock[] = [
      {
        blockId: "11111111-1111-4111-8111-000000000002",
        blockType: "lead",
        content: { text: "" },
        complete: false,
      },
    ];

    expect(() => renderStreamingPreviewBlocks(blocks, "测试主题")).not.toThrow();
    const previewBlocks = renderStreamingPreviewBlocks(blocks, "测试主题");
    expect(previewBlocks[0]?.ok).toBe(true);
  });

  it("defers list block preview until complete", () => {
    const partial: StreamingPreviewBlock[] = [
      {
        blockId: "33333333-3333-4333-8333-333333333333",
        blockType: "list",
        content: {},
        complete: false,
      },
    ];
    expect(renderStreamingPreviewBlocks(partial, "测试")).toHaveLength(0);

    const complete: StreamingPreviewBlock[] = [
      {
        blockId: "33333333-3333-4333-8333-333333333333",
        blockType: "list",
        content: {
          ordered: false,
          items: [{ text: "要点一" }],
        },
        complete: true,
      },
    ];
    expect(renderStreamingPreviewBlocks(complete, "测试").length).toBeGreaterThan(0);
  });

  it("defers list block when complete payload still has no renderable items", () => {
    const invalidComplete: StreamingPreviewBlock[] = [
      {
        blockId: "33333333-3333-4333-8333-333333333333",
        blockType: "list",
        content: {
          ordered: false,
          items: [{ text: "" }, { text: "   " }],
        },
        complete: true,
      },
    ];

    expect(renderStreamingPreviewBlocks(invalidComplete, "测试")).toHaveLength(0);
  });

  it("normalizes string list items from model output", () => {
    const complete: StreamingPreviewBlock[] = [
      {
        blockId: "33333333-3333-4333-8333-333333333333",
        blockType: "list",
        content: {
          ordered: false,
          items: ["要点一", "要点二"],
        },
        complete: true,
      },
    ];

    const previewBlocks = renderStreamingPreviewBlocks(complete, "测试", {
      normalizedInput: STREAM_STYLE_INPUT,
    });
    expect(previewBlocks).toHaveLength(1);
    expect(previewBlocks[0]?.ok).toBe(true);
    expect(previewBlocks[0]?.output?.kind).toBe("list_preview");
  });

  it("renders styled preview output for a streaming title block", () => {
    const blocks: StreamingPreviewBlock[] = [
      {
        blockId: "11111111-1111-4111-8111-000000000001",
        blockType: "title",
        content: { text: "轻篇流式标题" },
        complete: false,
      },
    ];

    const previewBlocks = renderStreamingPreviewBlocks(blocks, "测试主题");
    expect(previewBlocks).toHaveLength(1);
    expect(previewBlocks[0]?.ok).toBe(true);
    expect(previewBlocks[0]?.output?.kind).toBe("title_block_preview");
  });

  it("applies style-system variant selection during streaming preview", () => {
    const blocks: StreamingPreviewBlock[] = [
      {
        blockId: "11111111-1111-4111-8111-000000000001",
        blockType: "title",
        content: { text: "带控件样式的标题" },
        complete: false,
      },
      {
        blockId: "22222222-2222-4222-8222-000000000002",
        blockType: "paragraph",
        content: { text: "正文段落" },
        complete: false,
      },
    ];

    const withoutStyleSelection = renderStreamingPreviewBlocks(blocks, "测试主题");
    const withStyleSelection = renderStreamingPreviewBlocks(blocks, "测试主题", {
      normalizedInput: STREAM_STYLE_INPUT,
    });

    expect(withStyleSelection[0]?.variantId).toBe("title_plain_minimal");
    expect(withStyleSelection[0]?.variantId).not.toBe(withoutStyleSelection[0]?.variantId);
    expect(withStyleSelection[1]?.variantId).toBe("paragraph_plain_body");
    expect(withStyleSelection[1]?.output?.kind).toBe("text_block_preview");
  });

  it("uses the requested preset during streaming preview render", () => {
    const blocks: StreamingPreviewBlock[] = [
      {
        blockId: "11111111-1111-4111-8111-000000000001",
        blockType: "title",
        content: { text: "经典简约标题" },
        complete: false,
      },
    ];

    const previewBlocks = renderStreamingPreviewBlocks(blocks, "测试主题", {
      presetId: "classic",
    });

    expect(previewBlocks[0]?.variantId).toBeTruthy();
    expect(previewBlocks[0]?.ok).toBe(true);
  });

  it("tracks streaming content revision from text and body fields", () => {
    const revision = computeStreamingPreviewContentRevision([
      {
        blockId: "11111111-1111-4111-8111-000000000001",
        blockType: "paragraph",
        content: { text: "abc" },
        complete: false,
      },
      {
        blockId: "22222222-2222-4222-8222-000000000002",
        blockType: "info_card",
        content: { body: "xy" },
        complete: true,
      },
    ]);

    expect(revision).toBeGreaterThan(0);
  });
});
