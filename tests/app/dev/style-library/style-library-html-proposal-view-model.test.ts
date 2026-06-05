import { describe, expect, it } from "vitest";

import {
  generateHtmlCandidateProposalDisplay,
  getHtmlProposalPanelCopy,
} from "@/app/dev/style-library/style-library-html-proposal-view-model";
import { translateHtmlProposalWarning } from "@/app/dev/style-library/style-library-i18n";

const HEADING_HTML = `<p style="margin:0"><span style="display:inline-block;background-color:#6c5ce7;color:#fff;font-size:12px">CHAPTER</span></p>`;

describe("style-library html proposal view model", () => {
  it("builds zh/en panel copy", () => {
    expect(getHtmlProposalPanelCopy("zh").sectionTitle).toBe("新增候选样式");
    expect(getHtmlProposalPanelCopy("en").sectionTitle).toBe("Create Candidate Variant");
  });

  it("generates localized proposal display", () => {
    const zh = generateHtmlCandidateProposalDisplay(
      { sourceHtml: HEADING_HTML, blockType: "heading" },
      "zh",
    );
    const en = generateHtmlCandidateProposalDisplay(
      { sourceHtml: HEADING_HTML, blockType: "heading", label: "Test Paste" },
      "en",
    );

    expect(zh?.candidateVariantId).toContain("heading");
    expect(en?.label).toBe("Test Paste");
    expect(zh?.distributionSummary).toContain("userSelectable=false");
    expect(zh?.cursorPatchSummary).toContain("S9-STORY-007B");
  });

  it("translates extraction warnings without translating technical ids", () => {
    expect(translateHtmlProposalWarning("zh", "NO_INLINE_STYLE")).toContain("inline style");
    expect(translateHtmlProposalWarning("en", "UNKNOWN_CODE")).toBe("UNKNOWN_CODE");
  });

  it("returns null for empty html", () => {
    expect(generateHtmlCandidateProposalDisplay({ sourceHtml: "  " }, "zh")).toBeNull();
  });
});
