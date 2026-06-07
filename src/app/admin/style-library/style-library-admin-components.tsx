import Link from "next/link";

import {
  ADMIN_FILTER_PRESETS,
  isAdminFilterPresetActive,
} from "./style-library-admin-filters";
import type { AdminVariantListFilter } from "@/server/style-admin/queries/style-library-admin-query";
import type { AdminVariantSummary } from "@/server/style-admin/queries/style-library-admin-query";

import type {
  AdminVariantTableRow,
  DisabledGovernanceAction,
  StyleLibraryAdminDataStatus,
} from "./style-library-admin-view-model";

export function AdminProtectionBanner() {
  const isProduction = process.env.NODE_ENV === "production";

  return (
    <div
      className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
      data-testid="admin-style-library-protection-banner"
    >
      <p className="font-medium">S10 admin read UI · 数据库版样式管理后台（只读）</p>
      <p className="mt-1 text-amber-900/90">
        Public deployment requires S10-STORY-008 admin login before exposing{" "}
        <code className="rounded bg-amber-100 px-1">/admin/*</code> on the internet.
      </p>
      <p className="mt-2 text-amber-900/90" data-testid="admin-write-protection-message">
        Write actions are temporarily protected until S10-STORY-008 admin login. Do not deploy public
        admin writes without S10-STORY-008.
      </p>
      {isProduction ? (
        <p className="mt-2 font-medium text-amber-950">
          Production mode: enable single-admin authentication before go-live.
        </p>
      ) : null}
    </div>
  );
}

export function AdminStatusPanel({
  status,
  message,
}: {
  status: StyleLibraryAdminDataStatus;
  message: string;
}) {
  if (status === "ready") {
    return (
      <p className="text-sm text-slate-600" data-testid="admin-style-library-status-ready">
        {message}
      </p>
    );
  }

  return (
    <div
      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
      data-testid={`admin-style-library-status-${status}`}
    >
      {message}
    </div>
  );
}

export function SummaryCards({ summary }: { summary: AdminVariantSummary }) {
  const cards = [
    { label: "Total variants", value: summary.total, testId: "summary-total" },
    {
      label: "User selectable",
      value: summary.userSelectable,
      testId: "summary-user-selectable",
    },
    {
      label: "Release 1 required",
      value: summary.release1Required,
      testId: "summary-release1-required",
    },
    {
      label: "Default eligible",
      value: summary.defaultEligible,
      testId: "summary-default-eligible",
    },
    { label: "Hidden", value: summary.hidden, testId: "summary-hidden" },
    { label: "Deprecated", value: summary.deprecated, testId: "summary-deprecated" },
    {
      label: "Candidate / paste QA",
      value: summary.candidateOrPasteQa,
      testId: "summary-candidate",
    },
    {
      label: "Missing component protocol",
      value: summary.missingComponentProtocol,
      testId: "summary-missing-protocol",
    },
    {
      label: "Validation issues",
      value:
        summary.validationIssueCount > 0
          ? summary.validationIssueCount
          : "Not Run",
      testId: "summary-validation-issues",
    },
  ];

  return (
    <dl
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      data-testid="admin-style-library-summary"
    >
      {cards.map((card) => (
        <div
          key={card.testId}
          className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
          data-testid={card.testId}
        >
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {card.label}
          </dt>
          <dd className="mt-2 text-2xl font-semibold tabular-nums text-slate-900">
            {card.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function BoolBadge({
  value,
  trueLabel,
  falseLabel,
  trueClass,
}: {
  value: boolean;
  trueLabel: string;
  falseLabel: string;
  trueClass: string;
}) {
  return (
    <span
      className={
        value
          ? `rounded-full px-2 py-0.5 text-xs font-medium ${trueClass}`
          : "rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500"
      }
    >
      {value ? trueLabel : falseLabel}
    </span>
  );
}

export function LifecycleBadge({ lifecycle }: { lifecycle: string }) {
  const className =
    lifecycle === "release1_required"
      ? "bg-orange-100 text-orange-900"
      : lifecycle === "default_eligible"
        ? "bg-emerald-100 text-emerald-900"
        : lifecycle === "user_selectable"
          ? "bg-sky-100 text-sky-900"
          : lifecycle === "deprecated"
            ? "bg-rose-100 text-rose-900"
            : lifecycle === "paste_qa_pass" || lifecycle === "candidate"
              ? "bg-violet-100 text-violet-900"
              : "bg-slate-100 text-slate-700";

  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
      data-testid={`lifecycle-badge-${lifecycle}`}
    >
      {lifecycle}
    </span>
  );
}

export function VariantTable({ rows }: { rows: AdminVariantTableRow[] }) {
  if (rows.length === 0) {
    return (
      <div
        className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-600"
        data-testid="admin-style-library-empty-table"
      >
        No variants match the current filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm" data-testid="admin-style-library-table">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">runtimeVariantId</th>
            <th className="px-4 py-3">label</th>
            <th className="px-4 py-3">blockType</th>
            <th className="px-4 py-3">styleFamily</th>
            <th className="px-4 py-3">lifecycle</th>
            <th className="px-4 py-3">sourceType</th>
            <th className="px-4 py-3">sourceCohort</th>
            <th className="px-4 py-3">qualityStatus</th>
            <th className="px-4 py-3">userSelectable</th>
            <th className="px-4 py-3">defaultEligible</th>
            <th className="px-4 py-3">release1Required</th>
            <th className="px-4 py-3">hidden</th>
            <th className="px-4 py-3">deprecated</th>
            <th className="px-4 py-3">copySafety</th>
            <th className="px-4 py-3">version</th>
            <th className="px-4 py-3">updatedAt</th>
            <th className="px-4 py-3">detail</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr
              key={row.runtimeVariantId}
              className={row.deprecated || row.hidden ? "bg-rose-50/40" : undefined}
              data-testid={`admin-variant-row-${row.runtimeVariantId}`}
            >
              <td className="px-4 py-3 font-mono text-xs text-slate-800">{row.runtimeVariantId}</td>
              <td className="px-4 py-3 text-slate-900">{row.label}</td>
              <td className="px-4 py-3">{row.blockType}</td>
              <td className="px-4 py-3">{row.styleFamily}</td>
              <td className="px-4 py-3">
                <LifecycleBadge lifecycle={row.lifecycle} />
              </td>
              <td className="px-4 py-3 font-mono text-xs">{row.sourceType ?? "—"}</td>
              <td className="px-4 py-3 font-mono text-xs">{row.sourceCohort ?? "—"}</td>
              <td className="px-4 py-3 font-mono text-xs">{row.qualityStatus ?? "—"}</td>
              <td className="px-4 py-3">
                <BoolBadge
                  value={row.userSelectable}
                  trueLabel="true"
                  falseLabel="false"
                  trueClass="bg-sky-100 text-sky-900"
                />
              </td>
              <td className="px-4 py-3">
                <BoolBadge
                  value={row.defaultEligible}
                  trueLabel="true"
                  falseLabel="false"
                  trueClass="bg-emerald-100 text-emerald-900"
                />
              </td>
              <td className="px-4 py-3">
                <BoolBadge
                  value={row.release1Required}
                  trueLabel="true"
                  falseLabel="false"
                  trueClass="bg-orange-100 text-orange-900"
                />
              </td>
              <td className="px-4 py-3">
                <BoolBadge
                  value={row.hidden}
                  trueLabel="hidden"
                  falseLabel="—"
                  trueClass="bg-amber-100 text-amber-900"
                />
              </td>
              <td className="px-4 py-3">
                <BoolBadge
                  value={row.deprecated}
                  trueLabel="deprecated"
                  falseLabel="—"
                  trueClass="bg-rose-100 text-rose-900"
                />
              </td>
              <td className="px-4 py-3">{row.copySafety ?? "—"}</td>
              <td className="px-4 py-3">{row.currentVersionNumber ?? "—"}</td>
              <td className="px-4 py-3 text-xs text-slate-500">
                {new Date(row.updatedAt).toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={row.detailHref}
                  className="text-indigo-700 hover:text-indigo-900"
                  data-testid={`admin-variant-detail-link-${row.runtimeVariantId}`}
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DisabledActionsPanel({
  actions,
  caption,
}: {
  actions: DisabledGovernanceAction[];
  caption: string;
}) {
  return (
    <section
      className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
      data-testid="admin-style-library-disabled-actions"
    >
      <h2 className="text-sm font-semibold text-slate-900">Governance actions (disabled)</h2>
      <p className="mt-1 text-xs text-slate-500">{caption}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            disabled
            className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500"
            data-testid={`admin-disabled-action-${action.id}`}
            title={action.storyRef}
          >
            {action.label} · {action.storyRef}
          </button>
        ))}
      </div>
    </section>
  );
}

export function FilterLinks({ currentFilters }: { currentFilters: AdminVariantListFilter }) {
  return (
    <div className="space-y-2" data-testid="admin-style-library-filter-links">
      <p className="text-xs text-slate-500">
        Distribution filters are independent: userSelectable ≠ defaultEligible · release1Required ≠
        userSelectable · defaultEligible ≠ default preset · hidden / deprecated excluded from user
        pool (S10-STORY-005).
      </p>
      <div className="flex flex-wrap gap-2">
        {ADMIN_FILTER_PRESETS.map((preset) => (
          <Link
            key={preset.id}
            href={preset.href}
            className={
              isAdminFilterPresetActive(currentFilters, preset.filter)
                ? "rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800"
                : "rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
            }
            data-testid={`admin-filter-preset-${preset.id}`}
          >
            {preset.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
