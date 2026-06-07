import { describe, expect, it } from "vitest";

import { previewHtmlHarvestCandidate } from "@/server/style-admin/harvest/create-html-harvest-candidate";
import { buildCandidateVariantDraft } from "@/server/style-admin/harvest/build-candidate-variant";
import { previewHtmlHarvestAction } from "@/server/style-admin/actions/html-harvest-candidate";
import { isEligibleForUserSelectablePool } from "@/server/style-admin/mappers";

/** User-reported complex WeChat heading HTML (S10-STORY-011A FIX-A regression fixture). */
export const COMPLEX_HEADING_HTML = `<section style="margin:48px 0px 30px;"><section style="clear:both;"><section style="display:flex;align-items:center;margin:0;padding-bottom:12px;"><span style="font-size:10px;font-weight:800;color:rgb(148,163,184);letter-spacing:2.6px;text-transform:uppercase;"><span leaf="">CHAPTER 03</span></span><section style="flex:1;border-top:1px solid rgb(229,231,235);margin:0 0 0 12px;height:0;"><span leaf=""><br></span></section></section><section style="margin:0;"><strong style="display:block;font-size:60px;line-height:1;color:rgba(108,92,231,0.25);letter-spacing:-3px;white-space:nowrap;"><span leaf="">03</span></strong><strong style="display:block;font-size:30px;font-weight:900;color:rgb(17,24,39);line-height:1.26;letter-spacing:-0.8px;margin-top:-60px;margin-left:50px;"><span leaf="">怎么用</span></strong><span style="display:block;margin-left:50px;font-size:11px;color:#6c5ce7;font-weight:700;text-transform:uppercase;letter-spacing:1.6px;"><span leaf="">HOW TO · 使用指南</span></span></section></section></section>`;

describe("harvest compatibility — no 500 on WeChat issues", () => {
  it("complex heading HTML detect returns structured preview without throw", () => {
    expect(() =>
      previewHtmlHarvestCandidate({ rawHtml: COMPLEX_HEADING_HTML }),
    ).not.toThrow();

    const preview = previewHtmlHarvestCandidate({ rawHtml: COMPLEX_HEADING_HTML });
    expect(preview.ok).toBe(true);
    if (!preview.ok) return;

    expect(preview.detectedBlockType).toBe("heading");
    expect(preview.effectiveBlockType).toBe("heading");
    expect(preview.draftPreview).not.toBeNull();
    expect(preview.canCreateCandidate).toBe(true);
    expect(preview.partial).toBe(true);
    expect(preview.issues.length).toBeGreaterThan(0);
    expect(preview.guidance).toContain("WeChat compatibility risks");
  });

  it("reports flex, section yellow, letter-spacing, nesting depth, and span style issues", () => {
    const { issues } = buildCandidateVariantDraft(COMPLEX_HEADING_HTML, {
      sourceLabel: "complex heading",
    });

    const messages = issues.map((issue) => issue.message.toLowerCase()).join(" ");
    expect(messages).toMatch(/flex|letter-spacing|nesting|section|inline style/);
    expect(issues.some((issue) => issue.severity === "risk" || issue.severity === "warning")).toBe(
      true,
    );
  });

  it("generates candidate draft with not_checked quality path and userSelectable=false", () => {
    const { draft, canCreateCandidate } = buildCandidateVariantDraft(COMPLEX_HEADING_HTML, {
      sourceLabel: "complex heading",
    });

    expect(draft).not.toBeNull();
    expect(draft?.blockType).toBe("heading");
    expect(canCreateCandidate).toBe(true);
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
  });

  it("records script removal in lossReport without throw", () => {
    const html = `<section onclick="alert(1)"><script>alert(1)</script><span style="font-size:18px;font-weight:700;">标题</span></section>`;
    const { lossReport, draft } = buildCandidateVariantDraft(html, { sourceLabel: "security" });

    expect(draft).not.toBeNull();
    expect(lossReport.some((entry) => entry.code === "security_removed")).toBe(true);
    expect(lossReport.some((entry) => entry.message.toLowerCase().includes("script"))).toBe(true);
    expect(lossReport.some((entry) => entry.message.toLowerCase().includes("event handler"))).toBe(
      true,
    );
  });

  it("returns blocking structured result for empty HTML without throw", () => {
    expect(() => previewHtmlHarvestCandidate({ rawHtml: "   " })).not.toThrow();

    const preview = previewHtmlHarvestCandidate({ rawHtml: "   " });
    expect(preview.ok).toBe(false);
    if (preview.ok) return;
    expect(preview.code).toBe("invalid_raw_html");
    expect(preview.blocking).toBe(true);
  });

  it("returns blocking result for HTML with no extractable text without throw", () => {
    const html = `<section style="padding:8px;"><span style="font-size:18px;"></span></section>`;
    const built = buildCandidateVariantDraft(html, { sourceLabel: "empty text" }, "heading");

    expect(built.draft).toBeNull();
    expect(built.extract?.ok).toBe(false);
    if (built.extract?.ok) return;
    expect(built.extract.code).toBe("encode_blocked");

    const preview = previewHtmlHarvestCandidate({ rawHtml: html, blockType: "heading" });
    expect(preview.ok).toBe(false);
    if (preview.ok) return;
    expect(preview.blocking).toBe(true);
  });

  it("previewHtmlHarvestAction returns safe structured result on success", async () => {
    const result = await previewHtmlHarvestAction({ rawHtml: COMPLEX_HEADING_HTML });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.detectedBlockType).toBe("heading");
    expect(result.issues.length).toBeGreaterThan(0);
  });
});
