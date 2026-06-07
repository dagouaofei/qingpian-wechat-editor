import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import {
  StyleLibraryAdminDetailShell,
  StyleLibraryAdminListShell,
} from "@/app/admin/style-library/style-library-admin-shell";
import {
  buildAdminDetailViewModelFromQueryResult,
  buildAdminListViewModelFromQueryResults,
} from "@/app/admin/style-library/style-library-admin-view-model";

describe("Admin style-library shells", () => {
  it("renders list shell with protection banner and disabled actions", () => {
    const viewModel = buildAdminListViewModelFromQueryResults({
      filters: { lifecycle: "release1_required" },
      summaryResult: {
        ok: true,
        data: {
          total: 1,
          userSelectable: 0,
          release1Required: 1,
          defaultEligible: 0,
          hidden: 0,
          deprecated: 0,
          candidateOrPasteQa: 0,
          missingComponentProtocol: 1,
          validationIssueCount: 0,
        },
      },
      listResult: {
        ok: true,
        data: [
          {
            runtimeVariantId: "heading_short_line",
            label: "Short line",
            blockType: "heading",
            styleFamily: "editorial",
            lifecycle: "release1_required",
            updatedAt: new Date("2026-06-07T00:00:00.000Z"),
            distribution: {
              userSelectable: false,
              defaultEligible: false,
              release1Required: true,
              hidden: false,
              deprecated: false,
            },
            currentVersion: {
              versionNumber: 1,
              copySafety: "strict",
              componentProtocolJson: null,
            },
          },
        ] as never,
      },
    });

    const html = renderToStaticMarkup(<StyleLibraryAdminListShell viewModel={viewModel} />);

    expect(html).toContain('data-testid="admin-style-library-list-shell"');
    expect(html).toContain("Database-backed Style Library Admin");
    expect(html).toContain("数据库版样式管理后台");
    expect(html).toContain("S10-STORY-008");
    expect(html).toContain("S10-STORY-006");
    expect(html).toContain('data-testid="summary-release1-required"');
    expect(html).toContain('data-testid="lifecycle-badge-release1_required"');
    expect(html).toContain('data-testid="admin-filter-preset-default-eligible-true"');
    expect(html).toContain('data-testid="admin-filter-preset-default-eligible-false"');
    expect(html).toContain('data-testid="admin-filter-preset-hidden-true"');
    expect(html).toContain('data-testid="admin-filter-preset-hidden-false"');
    expect(html).toContain('data-testid="admin-filter-preset-release1-required-true"');
    expect(html).toContain("userSelectable ≠ defaultEligible");
    expect(html).toContain('data-testid="admin-disabled-action-promote"');
    expect(html).not.toContain("connection refused");
    expect(html).not.toContain("DATABASE_URL=postgresql");
  });

  it("renders db_not_configured state without secrets", () => {
    const viewModel = buildAdminListViewModelFromQueryResults({
      filters: {},
      summaryResult: { ok: false, error: "db_not_configured" },
      listResult: { ok: false, error: "db_not_configured" },
    });

    const html = renderToStaticMarkup(<StyleLibraryAdminListShell viewModel={viewModel} />);
    expect(html).toContain('data-testid="admin-style-library-status-db_not_configured"');
    expect(html).toContain("DATABASE_URL is not configured");
  });

  it("renders detail shell with governance placeholders", () => {
    const viewModel = buildAdminDetailViewModelFromQueryResult("heading_short_line", {
      ok: true,
      data: {
        variant: {
          runtimeVariantId: "heading_short_line",
          label: "Short line",
          description: "desc",
          blockType: "heading",
          styleFamily: "editorial",
          lifecycle: "release1_required",
          createdAt: new Date("2026-06-07T00:00:00.000Z"),
          updatedAt: new Date("2026-06-07T00:00:00.000Z"),
        },
        distribution: {
          userSelectable: false,
          defaultEligible: false,
          release1Required: true,
          hidden: false,
          deprecated: false,
          cacheVersion: 0,
        },
        currentVersion: {
          versionNumber: 1,
          copySafety: "strict",
          sourceChecksum: "abc",
          definitionJson: { id: "heading_short_line" },
          componentProtocolJson: null,
          compatibilityJson: null,
        },
        sources: [],
        lifecycleEvents: [],
        validationRuns: [],
        evidence: [],
      } as never,
    });

    const html = renderToStaticMarkup(<StyleLibraryAdminDetailShell viewModel={viewModel} />);

    expect(html).toContain('data-testid="admin-style-library-detail-shell"');
    expect(html).toContain("userSelectable ≠ defaultEligible");
    expect(html).toContain('data-testid="admin-detail-no-lifecycle-events"');
    expect(html).toContain('data-testid="admin-detail-no-validation-runs"');
    expect(html).toContain('data-testid="admin-detail-no-evidence"');
    expect(html).toContain('data-testid="admin-detail-missing-component-protocol"');
    expect(html).toContain('data-testid="admin-disabled-action-promote-user-selectable"');
  });
});
