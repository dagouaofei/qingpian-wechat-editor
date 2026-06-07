import { describe, expect, it } from "vitest";

import { previewHtmlHarvestCandidate } from "@/server/style-admin/harvest/create-html-harvest-candidate";
import { buildCandidateVariantDraft } from "@/server/style-admin/harvest/build-candidate-variant";
import { previewHtmlHarvestAction } from "@/server/style-admin/actions/html-harvest-candidate";
import { isEligibleForUserSelectablePool } from "@/server/style-admin/mappers";

import { COMPLEX_HEADING_HTML } from "../../../fixtures/dsl/complex-heading-html";

export { COMPLEX_HEADING_HTML };

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
