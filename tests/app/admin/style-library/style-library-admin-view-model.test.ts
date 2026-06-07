import { describe, expect, it } from "vitest";

import {
  buildAdminDetailViewModelFromQueryResult,
  buildAdminListViewModelFromQueryResults,
} from "@/app/admin/(protected)/style-library/style-library-admin-view-model";
import { buildPromoteHeadingVariantDsl } from "../../../fixtures/dsl/promote-heading-variant-dsl";

describe("style-library admin view model", () => {
  it("builds list summary with independent distribution columns", () => {
    const viewModel = buildAdminListViewModelFromQueryResults({
      filters: {},
      summaryResult: {
        ok: true,
        data: {
          total: 2,
          userSelectable: 1,
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
          {
            runtimeVariantId: "heading_teal_section_label_html_paste_candidate",
            label: "Teal section",
            blockType: "heading",
            styleFamily: "htmlPaste",
            lifecycle: "user_selectable",
            updatedAt: new Date("2026-06-07T00:00:00.000Z"),
            distribution: {
              userSelectable: true,
              defaultEligible: false,
              release1Required: false,
              hidden: false,
              deprecated: false,
            },
            currentVersion: {
              versionNumber: 1,
              copySafety: "strict",
              componentProtocolJson: { componentId: "titleBlock" },
            },
          },
        ] as never,
      },
    });

    expect(viewModel.status).toBe("ready");
    expect(viewModel.summary.release1Required).toBe(1);
    expect(viewModel.summary.defaultEligible).toBe(0);
    expect(viewModel.rows[0]?.release1Required).toBe(true);
    expect(viewModel.rows[0]?.defaultEligible).toBe(false);
    expect(viewModel.rows[0]?.lifecycle).toBe("release1_required");
    expect(viewModel.rows[1]?.userSelectable).toBe(true);
  });

  it("returns db_not_configured safe state", () => {
    const viewModel = buildAdminListViewModelFromQueryResults({
      filters: {},
      summaryResult: { ok: false, error: "db_not_configured" },
      listResult: { ok: false, error: "db_not_configured" },
    });

    expect(viewModel.status).toBe("db_not_configured");
    expect(viewModel.statusMessage).toContain("DATABASE_URL");
    expect(viewModel.rows).toHaveLength(0);
  });

  it("builds detail view model with distribution explanations and empty sections", () => {
    const viewModel = buildAdminDetailViewModelFromQueryResult("missing_variant", {
      ok: true,
      data: null,
    });

    expect(viewModel.status).toBe("not_found");
    expect(viewModel.variant).toBeNull();
  });

  it("marks missing component protocol on detail view model", () => {
    const viewModel = buildAdminDetailViewModelFromQueryResult("heading_short_line", {
      ok: true,
      data: {
        variant: {
          runtimeVariantId: "heading_short_line",
          label: "Short line",
          description: null,
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
          qualityStatus: "not_checked",
          sourceChecksum: "abc",
          definitionJson: { id: "heading_short_line" },
          componentProtocolJson: null,
          compatibilityJson: { copySafety: "strict" },
        },
        sources: [],
        lifecycleEvents: [],
        validationRuns: [],
        evidence: [],
        promoteRecords: [],
      } as never,
    });

    expect(viewModel.currentVersion?.missingComponentProtocol).toBe(true);
    expect(viewModel.distribution?.release1Required).toBe(true);
    expect(viewModel.distribution?.defaultEligible).toBe(false);
    expect(viewModel.candidatePromote).toBeNull();
    expect(
      viewModel.disabledActions.some((action) => action.id === "promote-user-selectable"),
    ).toBe(false);
  });

  it("builds candidate promote panel for html_paste candidate with paste_qa_pass", () => {
    const viewModel = buildAdminDetailViewModelFromQueryResult(
      "heading_html_paste_abcdef01_candidate",
      {
        ok: true,
        data: {
          variant: {
            id: "variant-1",
            runtimeVariantId: "heading_html_paste_abcdef01_candidate",
            label: "HTML paste candidate",
            description: null,
            blockType: "heading",
            styleFamily: "htmlPaste",
            lifecycle: "candidate",
            createdAt: new Date("2026-06-07T00:00:00.000Z"),
            updatedAt: new Date("2026-06-07T00:00:00.000Z"),
          },
          distribution: {
            userSelectable: false,
            defaultEligible: false,
            release1Required: false,
            hidden: false,
            deprecated: false,
            cacheVersion: 0,
          },
          currentVersion: {
            id: "version-1",
            versionNumber: 1,
            copySafety: "strict",
            qualityStatus: "paste_qa_pass",
            sourceChecksum: "abc",
            definitionJson: buildPromoteHeadingVariantDsl(
              "heading_html_paste_abcdef01_candidate",
            ),
            componentProtocolJson: { componentId: "titleBlock" },
            compatibilityJson: { copySafety: "strict" },
          },
          sources: [
            {
              id: "source-1",
              sourceType: "html_paste",
              sourceCohort: "s10_html_harvest_v1",
              sourceRef: null,
              sourceMetadata: null,
              rawHtml: "<section>test</section>",
              createdAt: new Date("2026-06-07T00:00:00.000Z"),
            },
          ],
          lifecycleEvents: [],
          validationRuns: [],
          evidence: [],
          promoteRecords: [],
        } as never,
      },
    );

    expect(viewModel.candidatePromote?.eligible).toBe(true);
    expect(viewModel.candidatePromote?.alreadyPromoted).toBe(false);
    expect(viewModel.candidatePromote?.runtimeSource).toBe("database_dsl");
    expect(viewModel.candidatePromote?.previewReady).toBe(true);
    expect(viewModel.candidatePromote?.copyReady).toBe(true);
  });
});
