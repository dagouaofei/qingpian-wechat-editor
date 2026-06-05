import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { StyleLibraryAdminShell } from "@/app/dev/style-library/style-library-admin-shell";
import {
  buildStyleLibraryCandidateStyleLinks,
  buildStyleLibraryPaletteCards,
  buildStyleLibraryRuleCards,
  buildStyleLibraryStyleCards,
  buildStyleLibraryStyleRuleSummaryCounts,
} from "@/app/dev/style-library/style-library-style-rule-view-model";
import { buildStyleLibraryAdminViewModel } from "@/app/dev/style-library/style-library-view-model";
import { STYLE_LIBRARY_MANIFEST } from "@/core/style-library";

describe("style-library style rule view model", () => {
  it("builds localized style cards in zh and en", () => {
    const zh = buildStyleLibraryStyleCards("zh");
    const en = buildStyleLibraryStyleCards("en");
    expect(zh[0]?.name).toBe("章节标签");
    expect(en[0]?.name).toBe("Chapter Label");
    expect(zh[0]?.styleId).toBe("style-chapter-label");
  });

  it("builds palette and rule cards", () => {
    expect(buildStyleLibraryPaletteCards("zh")).toHaveLength(2);
    expect(buildStyleLibraryRuleCards("zh")).toHaveLength(4);
  });

  it("links seed candidates to style palette rules", () => {
    const links = buildStyleLibraryCandidateStyleLinks(STYLE_LIBRARY_MANIFEST, "zh");
    expect(links).toHaveLength(2);
    expect(links[0]?.linkedStyleName).toBeTruthy();
    expect(links[0]?.linkedPaletteNames.length).toBeGreaterThan(0);
    expect(links[0]?.linkedRuleNames.length).toBeGreaterThan(0);
  });

  it("wires style rule data into admin view model", () => {
    const viewModel = buildStyleLibraryAdminViewModel(undefined, "zh");
    expect(viewModel.styleRuleSummaryCounts.styleCount).toBe(4);
    expect(viewModel.statusSummary.paletteCount).toBe(2);
    expect(viewModel.styleCards.length).toBe(4);
    expect(viewModel.candidateReviewCards[0]?.styleLinks.linkedStyleId).toBeTruthy();
  });

  it("renders style palette rule sections without form submit", () => {
    const html = renderToStaticMarkup(
      <StyleLibraryAdminShell viewModel={buildStyleLibraryAdminViewModel(undefined, "zh")} />,
    );
    expect(html).toContain('data-testid="style-library-style-rule-summary"');
    expect(html).toContain('data-testid="style-library-style-management"');
    expect(html).toContain('data-testid="style-library-palette-management"');
    expect(html).toContain('data-testid="style-library-rule-management"');
    expect(html).toContain('data-testid="style-library-candidate-style-links-seed-variant-heading-purple-chapter-label"');
    expect(html).toContain("风格管理");
    expect(html).not.toContain("<form");
    expect(html).not.toContain('type="submit"');
  });

  it("renders english style management copy", () => {
    const html = renderToStaticMarkup(
      <StyleLibraryAdminShell viewModel={buildStyleLibraryAdminViewModel(undefined, "en")} />,
    );
    expect(html).toContain("Style Management");
    expect(html).toContain("Palette Management");
    expect(html).toContain("Rule Management");
  });

  it("computes style rule summary counts", () => {
    const counts = buildStyleLibraryStyleRuleSummaryCounts();
    expect(counts.rulesWithWarnings).toBe(1);
    expect(counts.stylesMissingPalette).toBe(1);
  });
});
