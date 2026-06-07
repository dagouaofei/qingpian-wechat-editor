import { describe, expect, it } from "vitest";

import { detectHtmlBlockType } from "@/server/style-admin/harvest/detect-html-block-type";

const HEADING_HTML = `<section style="padding: 8px 0; border-left: 4px solid #1677ff;">
  <span style="font-size: 18px; font-weight: 700; color: #111;">这是一个测试小标题</span>
</section>`;

const INFO_CARD_HTML = `<section style="padding: 14px; background: #f7f8fa; border: 1px solid #e5e7eb; border-radius: 8px;">
  <strong style="display:block; margin-bottom:8px;">核心提示</strong>
  <p style="margin:0;">这里是一段信息卡片正文，用于测试 info_card candidate。</p>
</section>`;

describe("detectHtmlBlockType", () => {
  it("detects heading HTML as heading", () => {
    expect(detectHtmlBlockType(HEADING_HTML)).toBe("heading");
  });

  it("detects info_card HTML as info_card", () => {
    expect(detectHtmlBlockType(INFO_CARD_HTML)).toBe("info_card");
  });

  it("returns unknown for ambiguous HTML", () => {
    expect(detectHtmlBlockType("<div>plain</div>")).toBe("unknown");
  });
});
