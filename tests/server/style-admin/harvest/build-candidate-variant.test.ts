import { describe, expect, it } from "vitest";

import { buildCandidateVariantDraft } from "@/server/style-admin/harvest/build-candidate-variant";
import { HTML_HARVEST_SOURCE_COHORT } from "@/server/style-admin/harvest/html-harvest-types";
import { isEligibleForUserSelectablePool } from "@/server/style-admin/mappers";

const HEADING_HTML = `<section style="padding: 8px 0; border-left: 4px solid #1677ff;">
  <span style="font-size: 18px; font-weight: 700; color: #111;">这是一个测试小标题</span>
</section>`;

const INFO_CARD_HTML = `<section style="padding: 14px; background: #f7f8fa; border: 1px solid #e5e7eb; border-radius: 8px;">
  <strong style="display:block; margin-bottom:8px;">核心提示</strong>
  <p style="margin:0;">这里是一段信息卡片正文，用于测试 info_card candidate。</p>
</section>`;

describe("buildCandidateVariantDraft", () => {
  it("builds heading candidate with expected harvest metadata", () => {
    const { draft } = buildCandidateVariantDraft(HEADING_HTML, {
      sourceLabel: "135 编辑器粘贴",
    });
    expect(draft).not.toBeNull();
    expect(draft?.runtimeVariantId).toMatch(/^heading_html_paste_[a-f0-9]{8}_candidate$/);
    expect(draft?.blockType).toBe("heading");
    expect(draft?.styleFamily).toBe("htmlPaste");
    expect(draft?.copySafety).toBe("strict");
  });

  it("builds info_card candidate with expected harvest metadata", () => {
    const { draft } = buildCandidateVariantDraft(INFO_CARD_HTML, {
      sourceLabel: "公众号片段",
    });
    expect(draft).not.toBeNull();
    expect(draft?.runtimeVariantId).toMatch(/^info_card_html_paste_[a-f0-9]{8}_candidate$/);
    expect(draft?.blockType).toBe("info_card");
  });

  it("allows manual heading override when detection is unknown", () => {
    const { draft, detectedBlockType } = buildCandidateVariantDraft(
      "<div>ambiguous</div>",
      { sourceLabel: "manual" },
      "heading",
    );
    expect(detectedBlockType).toBe("unknown");
    expect(draft?.blockType).toBe("heading");
    expect(draft?.selectedBlockType).toBe("heading");
  });

  it("candidate distribution flags exclude user-selectable pool", () => {
    const { draft } = buildCandidateVariantDraft(HEADING_HTML, { sourceLabel: "test" });
    expect(
      isEligibleForUserSelectablePool({
        lifecycle: "candidate",
        distribution: {
          userSelectable: false,
          hidden: false,
          deprecated: false,
          defaultEligible: false,
          release1Required: false,
        },
      }),
    ).toBe(false);
    expect(draft?.runtimeVariantId).toContain("_candidate");
    expect(HTML_HARVEST_SOURCE_COHORT).toBe("s10_html_harvest_v1");
  });
});
