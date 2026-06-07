import type { BlockType } from "@/core/blocks";
import type { DslRuntimeTrace } from "@/core/dsl/runtime/dsl-trace-types";
import { buildRuntimeTraceForVariant } from "@/lib/dsl-runtime/runtime-trace";
import {
  dslRuntimeTraceFixtureArticle,
  pickTraceFixtureBlock,
} from "@/lib/dsl-runtime/trace-fixture-article";

import type { CandidateInspectionPanelViewModel } from "./candidate-inspection-view-model";
import { buildCandidateInspectionPanelViewModel } from "./candidate-inspection-view-model";
import {
  isStyleAdminWriteEnabled,
  STYLE_ADMIN_WRITE_PROTECTION_MESSAGE,
} from "@/server/style-admin/admin-write-guard";
import { STYLE_ADMIN_AUTH_ENABLED_MESSAGE } from "@/server/style-admin/auth";
import type {
  AdminVariantDetail,
  AdminVariantListRow,
  AdminVariantSummary,
  AdminVariantListFilter,
  StyleLibraryAdminQueryResult,
} from "@/server/style-admin/queries/style-library-admin-query";
import { StyleLibraryAdminQuery } from "@/server/style-admin/queries/style-library-admin-query";
import { prisma } from "@/server/style-admin/prisma";

export type StyleLibraryAdminDataStatus =
  | "ready"
  | "db_not_configured"
  | "db_unavailable"
  | "empty"
  | "not_found";

export type DisabledGovernanceAction = {
  id: string;
  label: string;
  storyRef: "S10-STORY-006" | "S10-STORY-010" | "S10-STORY-011";
};

export const LIST_DISABLED_ACTIONS: DisabledGovernanceAction[] = [
  { id: "enable-user-selectable", label: "上架 user-selectable", storyRef: "S10-STORY-006" },
  { id: "hide-variant", label: "下架 hidden", storyRef: "S10-STORY-006" },
  { id: "mark-deprecated", label: "标记 deprecated", storyRef: "S10-STORY-006" },
  { id: "rollback", label: "回滚", storyRef: "S10-STORY-006" },
  { id: "promote", label: "Promote", storyRef: "S10-STORY-006" },
  { id: "mark-default-eligible", label: "Mark default eligible", storyRef: "S10-STORY-006" },
];

export const DETAIL_DISABLED_ACTIONS: DisabledGovernanceAction[] = [
  { id: "preview-inspection", label: "Preview inspection", storyRef: "S10-STORY-010" },
  { id: "copy-inspection", label: "Copy HTML inspection", storyRef: "S10-STORY-010" },
  { id: "validator-run", label: "Validator run", storyRef: "S10-STORY-010" },
  { id: "paste-qa-evidence", label: "Paste QA evidence", storyRef: "S10-STORY-010" },
  { id: "promote-user-selectable", label: "Promote to user-selectable", storyRef: "S10-STORY-011" },
  { id: "rollback-version", label: "Rollback version", storyRef: "S10-STORY-006" },
  { id: "mark-default-eligible", label: "Mark default eligible", storyRef: "S10-STORY-006" },
];

export type AdminVariantTableRow = {
  runtimeVariantId: string;
  label: string;
  blockType: string;
  styleFamily: string;
  lifecycle: string;
  sourceType: string | null;
  sourceCohort: string | null;
  qualityStatus: string | null;
  userSelectable: boolean;
  defaultEligible: boolean;
  release1Required: boolean;
  hidden: boolean;
  deprecated: boolean;
  copySafety: string | null;
  currentVersionNumber: number | null;
  updatedAt: string;
  detailHref: string;
};

export type StyleLibraryAdminListViewModel = {
  page: "list";
  status: StyleLibraryAdminDataStatus;
  statusMessage: string;
  filters: AdminVariantListFilter;
  summary: AdminVariantSummary;
  rows: AdminVariantTableRow[];
  disabledActions: DisabledGovernanceAction[];
  writeEnabled: boolean;
  authProtectionMessage: string;
  writeProtectionMessage: string;
};

export type JsonSummary = {
  label: string;
  preview: string;
  isEmpty: boolean;
};

export type StyleLibraryAdminDetailViewModel = {
  page: "detail";
  status: StyleLibraryAdminDataStatus;
  statusMessage: string;
  runtimeVariantId: string;
  variant: {
    runtimeVariantId: string;
    label: string;
    description: string | null;
    blockType: string;
    styleFamily: string;
    lifecycle: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  distribution: {
    userSelectable: boolean;
    defaultEligible: boolean;
    release1Required: boolean;
    hidden: boolean;
    deprecated: boolean;
    cacheVersion: number;
  } | null;
  currentVersion: {
    versionNumber: number;
    copySafety: string;
    qualityStatus: string;
    sourceChecksum: string | null;
    definitionSummary: JsonSummary;
    componentProtocolSummary: JsonSummary;
    compatibilitySummary: JsonSummary;
    missingComponentProtocol: boolean;
  } | null;
  sources: Array<{
    id: string;
    sourceType: string;
    sourceCohort: string | null;
    sourceRef: string | null;
    sourceMetadataPreview: string;
    hasRawHtml: boolean;
    createdAt: string;
  }>;
  lifecycleEvents: Array<{
    id: string;
    fromLifecycle: string | null;
    toLifecycle: string;
    reason: string;
    actor: string;
    createdAt: string;
  }>;
  validationRuns: Array<{
    id: string;
    runType: string;
    status: string;
    createdAt: string;
  }>;
  evidence: Array<{
    id: string;
    evidenceType: string;
    sourceLabel: string | null;
    createdAt: string;
  }>;
  disabledActions: DisabledGovernanceAction[];
  writeEnabled: boolean;
  writeProtectionMessage: string;
  listHref: string;
  candidateInspection: CandidateInspectionPanelViewModel | null;
  runtimeTrace: DslRuntimeTrace | null;
};

const EMPTY_SUMMARY: AdminVariantSummary = {
  total: 0,
  userSelectable: 0,
  release1Required: 0,
  defaultEligible: 0,
  hidden: 0,
  deprecated: 0,
  candidateOrPasteQa: 0,
  missingComponentProtocol: 0,
  validationIssueCount: 0,
};

function statusMessageForError(error: "db_not_configured" | "db_unavailable"): string {
  if (error === "db_not_configured") {
    return "DATABASE_URL is not configured. Set a local PostgreSQL URL to load variants from the database.";
  }
  return "Database is unavailable. Check local PostgreSQL connectivity and migrations.";
}

function summarizeJson(value: unknown, label: string): JsonSummary {
  if (value === null || value === undefined) {
    return { label, preview: "—", isEmpty: true };
  }
  const preview = JSON.stringify(value, null, 2);
  const truncated = preview.length > 600 ? `${preview.slice(0, 600)}…` : preview;
  return { label, preview: truncated, isEmpty: false };
}

function mapTableRow(row: AdminVariantListRow): AdminVariantTableRow {
  const primarySource = row.sources?.[0];
  return {
    runtimeVariantId: row.runtimeVariantId,
    label: row.label,
    blockType: row.blockType,
    styleFamily: row.styleFamily,
    lifecycle: row.lifecycle,
    sourceType: primarySource?.sourceType ?? null,
    sourceCohort: primarySource?.sourceCohort ?? null,
    qualityStatus: row.currentVersion?.qualityStatus ?? null,
    userSelectable: row.distribution?.userSelectable ?? false,
    defaultEligible: row.distribution?.defaultEligible ?? false,
    release1Required: row.distribution?.release1Required ?? false,
    hidden: row.distribution?.hidden ?? false,
    deprecated: row.distribution?.deprecated ?? false,
    copySafety: row.currentVersion?.copySafety ?? null,
    currentVersionNumber: row.currentVersion?.versionNumber ?? null,
    updatedAt: row.updatedAt.toISOString(),
    detailHref: `/admin/style-library/${encodeURIComponent(row.runtimeVariantId)}`,
  };
}

function buildAdminProtectionViewModel() {
  return {
    writeEnabled: isStyleAdminWriteEnabled(),
    authProtectionMessage: STYLE_ADMIN_AUTH_ENABLED_MESSAGE,
    writeProtectionMessage: STYLE_ADMIN_WRITE_PROTECTION_MESSAGE,
  };
}

export function buildAdminListViewModelFromQueryResults(input: {
  filters: AdminVariantListFilter;
  summaryResult: StyleLibraryAdminQueryResult<AdminVariantSummary>;
  listResult: StyleLibraryAdminQueryResult<AdminVariantListRow[]>;
}): StyleLibraryAdminListViewModel {
  const { filters, summaryResult, listResult } = input;
  const protection = buildAdminProtectionViewModel();

  if (!summaryResult.ok) {
    return {
      page: "list",
      status: summaryResult.error,
      statusMessage: statusMessageForError(summaryResult.error),
      filters,
      summary: EMPTY_SUMMARY,
      rows: [],
      disabledActions: LIST_DISABLED_ACTIONS,
      ...protection,
    };
  }

  if (!listResult.ok) {
    return {
      page: "list",
      status: listResult.error,
      statusMessage: statusMessageForError(listResult.error),
      filters,
      summary: summaryResult.data,
      rows: [],
      disabledActions: LIST_DISABLED_ACTIONS,
      ...protection,
    };
  }

  const rows = listResult.data.map(mapTableRow);
  const status: StyleLibraryAdminDataStatus =
    summaryResult.data.total === 0 ? "empty" : "ready";

  return {
    page: "list",
    status,
    statusMessage:
      status === "empty"
        ? "No variants in database yet. Run pnpm style-admin:import-existing-variants after configuring DATABASE_URL."
        : "Read from PostgreSQL · distribution writes on detail page (S10-STORY-006).",
    filters,
    summary: summaryResult.data,
    rows,
    disabledActions: LIST_DISABLED_ACTIONS,
    ...protection,
  };
}

export function buildAdminDetailViewModelFromQueryResult(
  runtimeVariantId: string,
  result: StyleLibraryAdminQueryResult<AdminVariantDetail | null>,
): StyleLibraryAdminDetailViewModel {
  const base = {
    page: "detail" as const,
    runtimeVariantId,
    disabledActions: DETAIL_DISABLED_ACTIONS,
    writeEnabled: isStyleAdminWriteEnabled(),
    writeProtectionMessage: STYLE_ADMIN_WRITE_PROTECTION_MESSAGE,
    listHref: "/admin/style-library",
  };

  if (!result.ok) {
    return {
      ...base,
      status: result.error,
      statusMessage: statusMessageForError(result.error),
      variant: null,
      distribution: null,
      currentVersion: null,
      sources: [],
      lifecycleEvents: [],
      validationRuns: [],
      evidence: [],
      candidateInspection: null,
      runtimeTrace: null,
    };
  }

  if (!result.data) {
    return {
      ...base,
      status: "not_found",
      statusMessage: `Variant "${runtimeVariantId}" was not found in the database.`,
      variant: null,
      distribution: null,
      currentVersion: null,
      sources: [],
      lifecycleEvents: [],
      validationRuns: [],
      evidence: [],
      candidateInspection: null,
      runtimeTrace: null,
    };
  }

  const { variant, distribution, currentVersion, sources, lifecycleEvents, validationRuns, evidence } =
    result.data;
  const candidateInspection = buildCandidateInspectionPanelViewModel(result.data);

  const runtimeTrace =
    currentVersion?.definitionJson != null
      ? buildRuntimeTraceForVariant({
          runtimeVariantId: variant.runtimeVariantId,
          blockType: variant.blockType as BlockType,
          definitionJson: currentVersion.definitionJson,
          poolSource: "database",
          article: dslRuntimeTraceFixtureArticle,
          block: pickTraceFixtureBlock(variant.blockType as BlockType),
          decodeTargets: ["preview", "copy_wechat"],
        })
      : null;

  return {
    ...base,
    status: "ready",
    statusMessage:
      "Governance detail view · distribution writes available when STYLE_ADMIN_WRITE_ENABLED (dev/test default on).",
    variant: {
      runtimeVariantId: variant.runtimeVariantId,
      label: variant.label,
      description: variant.description,
      blockType: variant.blockType,
      styleFamily: variant.styleFamily,
      lifecycle: variant.lifecycle,
      createdAt: variant.createdAt.toISOString(),
      updatedAt: variant.updatedAt.toISOString(),
    },
    distribution: distribution
      ? {
          userSelectable: distribution.userSelectable,
          defaultEligible: distribution.defaultEligible,
          release1Required: distribution.release1Required,
          hidden: distribution.hidden,
          deprecated: distribution.deprecated,
          cacheVersion: distribution.cacheVersion,
        }
      : null,
    currentVersion: currentVersion
      ? {
          versionNumber: currentVersion.versionNumber,
          copySafety: currentVersion.copySafety,
          qualityStatus: currentVersion.qualityStatus,
          sourceChecksum: currentVersion.sourceChecksum,
          definitionSummary: summarizeJson(currentVersion.definitionJson, "definitionJson"),
          componentProtocolSummary: summarizeJson(
            currentVersion.componentProtocolJson,
            "componentProtocolJson",
          ),
          compatibilitySummary: summarizeJson(
            currentVersion.compatibilityJson,
            "compatibilityJson",
          ),
          missingComponentProtocol: !currentVersion.componentProtocolJson,
        }
      : null,
    sources: sources.map((source) => ({
      id: source.id,
      sourceType: source.sourceType,
      sourceCohort: source.sourceCohort,
      sourceRef: source.sourceRef,
      sourceMetadataPreview: source.sourceMetadata
        ? JSON.stringify(source.sourceMetadata, null, 2)
        : "—",
      hasRawHtml: Boolean(source.rawHtml),
      createdAt: source.createdAt.toISOString(),
    })),
    lifecycleEvents: lifecycleEvents.map((event) => ({
      id: event.id,
      fromLifecycle: event.fromLifecycle,
      toLifecycle: event.toLifecycle,
      reason: event.reason,
      actor: event.actor,
      createdAt: event.createdAt.toISOString(),
    })),
    validationRuns: validationRuns.map((run) => ({
      id: run.id,
      runType: run.runType,
      status: run.status,
      createdAt: run.createdAt.toISOString(),
    })),
    evidence: evidence.map((item) => ({
      id: item.id,
      evidenceType: item.evidenceType,
      sourceLabel: item.sourceLabel,
      createdAt: item.createdAt.toISOString(),
    })),
    candidateInspection,
    runtimeTrace,
  };
}

export async function buildStyleLibraryAdminListViewModel(
  filters: AdminVariantListFilter = {},
  query: StyleLibraryAdminQuery = new StyleLibraryAdminQuery(prisma),
): Promise<StyleLibraryAdminListViewModel> {
  const [summaryResult, listResult] = await Promise.all([
    query.getAdminVariantSummary(),
    query.listAdminVariants(filters),
  ]);

  return buildAdminListViewModelFromQueryResults({
    filters,
    summaryResult,
    listResult,
  });
}

export async function buildStyleLibraryAdminDetailViewModel(
  runtimeVariantId: string,
  query: StyleLibraryAdminQuery = new StyleLibraryAdminQuery(prisma),
): Promise<StyleLibraryAdminDetailViewModel> {
  const result = await query.getAdminVariantDetail(runtimeVariantId);
  return buildAdminDetailViewModelFromQueryResult(runtimeVariantId, result);
}
