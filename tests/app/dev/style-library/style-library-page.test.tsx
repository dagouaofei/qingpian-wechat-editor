import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { StyleLibraryAdminShell } from "@/app/dev/style-library/style-library-admin-shell";
import { buildStyleLibraryAdminViewModel } from "@/app/dev/style-library/style-library-view-model";

describe("StyleLibraryAdminShell", () => {
  it("renders workbench, pipeline, candidate cards, and diagnostics without write controls", () => {
    const viewModel = buildStyleLibraryAdminViewModel();
    const html = renderToStaticMarkup(
      <StyleLibraryAdminShell viewModel={viewModel} />,
    );

    expect(html).toContain('data-testid="style-library-admin-shell"');
    expect(html).toContain('data-testid="style-library-workbench-header"');
    expect(html).toContain('data-testid="style-library-status-summary"');
    expect(html).toContain('data-testid="style-library-lifecycle-pipeline"');
    expect(html).toContain('data-testid="style-library-candidate-review"');
    expect(html).toContain('data-testid="style-library-diagnostics"');
    expect(html).toContain("Style Library v0");
    expect(html).toContain("Not connected to runtime");
    expect(html).toContain("Read-only governance shell");
    expect(html).toContain('data-testid="style-library-lifecycle-column-paste_qa_pass"');
    expect(html).toContain('data-testid="style-library-candidate-card-seed-variant-heading-purple-chapter-label"');
    expect(html).toContain('data-testid="style-library-candidate-card-seed-variant-info-card-reading-path"');
    expect(html).toContain("heading_purple_chapter_label_candidate");
    expect(html).toContain("info_card_reading_path_candidate");
    expect(html).toContain("Needs lifecycle / promote review");
    expect(html).toContain('data-testid="style-library-disabled-action-validate-seed-variant-heading-purple-chapter-label"');
    expect(html).toContain("S9-STORY-004");
    expect(html).toContain("S9-STORY-006");
    expect(html).toContain("S9-STORY-007");
    expect(html).toContain('data-testid="style-library-validation-status"');
    expect(html).toContain("valid");
    expect(html).toContain("sample-add-heading-candidate-to-pool");
    expect(html).toContain("WX-HARVEST-EVIDENCE-001");
    expect(html).not.toContain('type="submit"');
    expect(html).not.toContain("<form");
    expect(html).toContain("not applied to runtime StyleRegistry");
  });

  it("renders disabled action buttons on candidate cards", () => {
    const viewModel = buildStyleLibraryAdminViewModel();
    const html = renderToStaticMarkup(
      <StyleLibraryAdminShell viewModel={viewModel} />,
    );

    expect(html).toContain("Validate");
    expect(html).toContain("Review Evidence");
    expect(html).toContain("Promote to User Selectable");
    expect(html).toContain("Mark Default Eligible");
    expect(html).toContain("disabled");
  });

  it("renders inactive patch row in diagnostics", () => {
    const viewModel = buildStyleLibraryAdminViewModel();
    const html = renderToStaticMarkup(
      <StyleLibraryAdminShell viewModel={viewModel} />,
    );

    expect(html).toContain(
      'data-testid="style-library-patch-row-sample-add-heading-candidate-to-pool"',
    );
    expect(html).toContain("false");
  });
});
