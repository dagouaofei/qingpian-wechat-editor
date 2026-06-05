import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { StyleLibraryAdminShell } from "@/app/dev/style-library/style-library-admin-shell";
import { buildStyleLibraryAdminViewModel } from "@/app/dev/style-library/style-library-view-model";

describe("StyleLibraryAdminShell", () => {
  it("renders overview, validation panel, and seed asset rows without write controls", () => {
    const viewModel = buildStyleLibraryAdminViewModel();
    const html = renderToStaticMarkup(
      <StyleLibraryAdminShell viewModel={viewModel} />,
    );

    expect(html).toContain('data-testid="style-library-admin-shell"');
    expect(html).toContain("qingpian-style-library-v0");
    expect(html).toContain('data-testid="style-library-validation-status"');
    expect(html).toContain("valid");
    expect(html).toContain("seed-variant-heading-purple-chapter-label");
    expect(html).toContain("heading_purple_chapter_label_candidate");
    expect(html).toContain("sample-add-heading-candidate-to-pool");
    expect(html).toContain("WX-HARVEST-EVIDENCE-001");
    expect(html).not.toContain('type="submit"');
    expect(html).not.toContain("<form");
    expect(html).toContain("not applied to runtime StyleRegistry");
  });

  it("renders inactive patch row", () => {
    const viewModel = buildStyleLibraryAdminViewModel();
    const html = renderToStaticMarkup(
      <StyleLibraryAdminShell viewModel={viewModel} />,
    );

    expect(html).toContain('data-testid="style-library-patch-row-sample-add-heading-candidate-to-pool"');
    expect(html).toContain("false");
  });
});
