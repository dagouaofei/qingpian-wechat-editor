import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { StyleLibraryAdminShell } from "@/app/dev/style-library/style-library-admin-shell";
import { buildStyleLibraryAdminViewModel } from "@/app/dev/style-library/style-library-view-model";

describe("StyleLibraryAdminShell", () => {
  it("renders zh workbench by default without write controls", () => {
    const viewModel = buildStyleLibraryAdminViewModel(undefined, "zh");
    const html = renderToStaticMarkup(
      <StyleLibraryAdminShell viewModel={viewModel} />,
    );

    expect(html).toContain('data-testid="style-library-admin-shell"');
    expect(html).toContain('data-testid="style-library-workbench-header"');
    expect(html).toContain('data-testid="style-library-language-toggle"');
    expect(html).toContain('data-testid="style-library-language-zh"');
    expect(html).toContain('data-testid="style-library-language-en"');
    expect(html).toContain("样式管理工作台");
    expect(html).toContain("样式资产管理后台 v0");
    expect(html).toContain("未接入运行时");
    expect(html).toContain("只读治理模式");
    expect(html).toContain("已通过粘贴 QA 的候选样式");
    expect(html).toContain("尚未用户可选 / 尚不可进入默认推荐");
    expect(html).toContain('href="?lang=zh"');
    expect(html).toContain('href="?lang=en"');
    expect(html).toContain('data-testid="style-library-lifecycle-column-paste_qa_pass"');
    expect(html).toContain('data-testid="style-library-lifecycle-management"');
    expect(html).toContain('data-testid="style-library-lifecycle-panel-seed-variant-heading-purple-chapter-label"');
    expect(html).toContain('data-testid="style-library-blocked-transition-user_selectable-seed-variant-heading-purple-chapter-label"');
    expect(html).toContain('data-testid="style-library-candidate-review"');
    expect(html).toContain("粘贴 QA 通过");
    expect(html).toContain("paste_qa_pass");
    expect(html).toContain('data-testid="style-library-candidate-card-seed-variant-heading-purple-chapter-label"');
    expect(html).toContain("heading_purple_chapter_label_candidate");
    expect(html).toContain("info_card_reading_path_candidate");
    expect(html).toContain("seed-variant-heading-purple-chapter-label");
    expect(html).toContain('data-testid="style-library-disabled-action-validate-seed-variant-heading-purple-chapter-label"');
    expect(html).toContain("S9-STORY-004");
    expect(html).toContain("S9-STORY-006");
    expect(html).toContain("S9-STORY-007");
    expect(html).not.toContain('type="submit"');
    expect(html).not.toContain("<form");
    expect(html).toContain('data-testid="style-library-diagnostics"');
    expect(html).toContain('data-testid="style-library-asset-row-seed-variant-heading-purple-chapter-label"');
    expect(html).toContain("WX-HARVEST-EVIDENCE-001");
  });

  it("renders English workbench copy when locale is en", () => {
    const viewModel = buildStyleLibraryAdminViewModel(undefined, "en");
    const html = renderToStaticMarkup(
      <StyleLibraryAdminShell viewModel={viewModel} />,
    );

    expect(html).toContain("Style Library Workbench");
    expect(html).toContain("Not connected to runtime");
    expect(html).toContain("Read-only governance shell");
    expect(html).toContain("Candidate / Paste QA passed");
    expect(html).toContain("Not user selectable / Not default eligible");
    expect(html).toContain("Paste QA Pass");
    expect(html).not.toContain("样式管理工作台");
  });

  it("renders disabled action buttons in zh and en", () => {
    const zhHtml = renderToStaticMarkup(
      <StyleLibraryAdminShell
        viewModel={buildStyleLibraryAdminViewModel(undefined, "zh")}
      />,
    );
    const enHtml = renderToStaticMarkup(
      <StyleLibraryAdminShell
        viewModel={buildStyleLibraryAdminViewModel(undefined, "en")}
      />,
    );

    expect(zhHtml).toContain("校验");
    expect(zhHtml).toContain("查看证据");
    expect(enHtml).toContain("Validate");
    expect(enHtml).toContain("Review Evidence");
    expect(zhHtml).toContain("disabled");
    expect(enHtml).toContain("disabled");
  });

  it("renders inactive patch row in diagnostics", () => {
    const viewModel = buildStyleLibraryAdminViewModel(undefined, "zh");
    const html = renderToStaticMarkup(
      <StyleLibraryAdminShell viewModel={viewModel} />,
    );

    expect(html).toContain(
      'data-testid="style-library-patch-row-sample-add-heading-candidate-to-pool"',
    );
    expect(html).toContain("sample-add-heading-candidate-to-pool");
  });
});
