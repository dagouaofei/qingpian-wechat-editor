import { describe, expect, it } from "vitest";

import { HTML_PASTE_TEAL_SECTION_LABEL_ASSET } from "@/core/style-library/assets/html-paste-variant-assets";
import {
  renderStyleLibraryCandidateCopyHtml,
  renderStyleLibraryCandidatePreview,
} from "@/core/style-library";
import { HTML_PASTE_TEAL_SECTION_COLOR } from "@/core/renderer/html-paste-teal-section-label-shared";
import { S9_STORY_007B_VARIANT_ID } from "../../fixtures/style-library/s9-story-007b-html-paste-e2e-sample";

describe("S9-STORY-007C-FIX-A html paste preview/copy alignment", () => {
  it("renders preview with teal section label metadata matching copy intent", () => {
    const preview = renderStyleLibraryCandidatePreview(HTML_PASTE_TEAL_SECTION_LABEL_ASSET);
    const copy = renderStyleLibraryCandidateCopyHtml(HTML_PASTE_TEAL_SECTION_LABEL_ASSET);

    expect(preview.ok).toBe(true);
    expect(copy.ok).toBe(true);
    expect(preview.output?.kind).toBe("title_block_preview");
    if (preview.output?.kind === "title_block_preview") {
      expect(preview.output.variantId).toBe(S9_STORY_007B_VARIANT_ID);
      expect(preview.output.presentation.htmlPasteTealSectionLabel).toBe(true);
      expect(preview.output.typography?.accentColor).toBe(HTML_PASTE_TEAL_SECTION_COLOR);
      expect(preview.output.presentation.badgeText).toMatch(/^SECTION /);
    }
    expect(copy.html).toContain(HTML_PASTE_TEAL_SECTION_COLOR);
  });
});
