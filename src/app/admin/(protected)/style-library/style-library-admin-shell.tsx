import Link from "next/link";

import { ADMIN_FILTER_OPTIONS } from "./style-library-admin-filters";
import {
  AdminProtectionBanner,
  AdminStatusPanel,
  DisabledActionsPanel,
  FilterLinks,
  LifecycleBadge,
  SummaryCards,
  VariantTable,
} from "./style-library-admin-components";
import { CandidateInspectionPanel } from "./candidate-inspection-panel";
import { StyleLibraryGovernanceActions } from "./style-library-governance-actions";
import type {
  StyleLibraryAdminDetailViewModel,
  StyleLibraryAdminListViewModel,
} from "./style-library-admin-view-model";

export function StyleLibraryAdminListShell({
  viewModel,
}: {
  viewModel: StyleLibraryAdminListViewModel;
}) {
  return (
    <div className="space-y-6" data-testid="admin-style-library-list-shell">
      <header className="space-y-3" data-testid="admin-style-library-header">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
              Sprint 10 · S10-STORY-008
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Database-backed Style Library Admin
            </h1>
            <p className="mt-1 text-base text-slate-600">数据库版样式管理后台</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Link
              href="/admin/style-library/harvest"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              data-testid="admin-harvest-from-html-link"
            >
              Harvest from HTML
            </Link>
            <Link
              href="/dev/style-library"
              className="text-sm text-slate-500 hover:text-slate-800"
            >
              S9 diagnostics: /dev/style-library
            </Link>
          </div>
        </div>
        <AdminProtectionBanner
          writeEnabled={viewModel.writeEnabled}
          writeProtectionMessage={viewModel.writeProtectionMessage}
        />
        <AdminStatusPanel status={viewModel.status} message={viewModel.statusMessage} />
      </header>

      <SummaryCards summary={viewModel.summary} />

      <section className="space-y-3" data-testid="admin-style-library-filters">
        <h2 className="text-sm font-semibold text-slate-900">Filters</h2>
        <FilterLinks currentFilters={viewModel.filters} />
        <form
          action="/admin/style-library"
          method="get"
          className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4"
        >
          <label className="text-xs text-slate-600">
            blockType
            <select
              name="blockType"
              defaultValue={viewModel.filters.blockType ?? ""}
              className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
            >
              <option value="">All</option>
              {ADMIN_FILTER_OPTIONS.blockTypes.map((blockType) => (
                <option key={blockType} value={blockType}>
                  {blockType}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-slate-600">
            lifecycle
            <select
              name="lifecycle"
              defaultValue={viewModel.filters.lifecycle ?? ""}
              className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
            >
              <option value="">All</option>
              {ADMIN_FILTER_OPTIONS.lifecycles.map((lifecycle) => (
                <option key={lifecycle} value={lifecycle}>
                  {lifecycle}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-slate-600 md:col-span-2">
            search (runtimeVariantId / label / family)
            <input
              name="q"
              defaultValue={viewModel.filters.search ?? ""}
              className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
              placeholder="heading_teal_section_label_html_paste_candidate"
            />
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Apply filters
            </button>
          </div>
        </form>
      </section>

      <VariantTable rows={viewModel.rows} />

      <DisabledActionsPanel
        actions={viewModel.disabledActions}
        caption="List-level bulk actions remain disabled. Use variant detail page for distribution writes."
      />
    </div>
  );
}

export function StyleLibraryAdminDetailShell({
  viewModel,
}: {
  viewModel: StyleLibraryAdminDetailViewModel;
}) {
  return (
    <div className="space-y-6" data-testid="admin-style-library-detail-shell">
      <header className="space-y-3">
        <Link href={viewModel.listHref} className="text-sm text-indigo-700 hover:text-indigo-900">
          ← Back to list
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
            Sprint 10 · S10-STORY-010
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            {viewModel.variant?.label ?? viewModel.runtimeVariantId}
          </h1>
          <p className="mt-1 font-mono text-sm text-slate-600">{viewModel.runtimeVariantId}</p>
        </div>
        <AdminProtectionBanner
          writeEnabled={viewModel.writeEnabled}
          writeProtectionMessage={viewModel.writeProtectionMessage}
        />
        <AdminStatusPanel status={viewModel.status} message={viewModel.statusMessage} />
      </header>

      {viewModel.variant ? (
        <>
          {viewModel.candidateInspection && viewModel.currentVersion ? (
            <CandidateInspectionPanel
              runtimeVariantId={viewModel.runtimeVariantId}
              qualityStatus={viewModel.currentVersion.qualityStatus}
              inspection={viewModel.candidateInspection}
              writeEnabled={viewModel.writeEnabled}
              writeProtectionMessage={viewModel.writeProtectionMessage}
            />
          ) : null}

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Basic info</h2>
            <dl className="mt-3 grid gap-2 text-sm md:grid-cols-2">
              <div>
                <dt className="text-slate-500">blockType</dt>
                <dd>{viewModel.variant.blockType}</dd>
              </div>
              <div>
                <dt className="text-slate-500">styleFamily</dt>
                <dd>{viewModel.variant.styleFamily}</dd>
              </div>
              <div>
                <dt className="text-slate-500">lifecycle</dt>
                <dd>
                  <LifecycleBadge lifecycle={viewModel.variant.lifecycle} />
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">description</dt>
                <dd>{viewModel.variant.description ?? "—"}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Distribution</h2>
            <p className="mt-1 text-xs text-slate-500">
              userSelectable ≠ defaultEligible · release1Required ≠ userSelectable · defaultEligible
              ≠ default preset · hidden / deprecated excluded from user pool (S10-STORY-005).
            </p>
            {viewModel.distribution ? (
              <dl className="mt-3 grid gap-2 text-sm md:grid-cols-3">
                <div>
                  <dt className="text-slate-500">userSelectable</dt>
                  <dd>{String(viewModel.distribution.userSelectable)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">defaultEligible</dt>
                  <dd>{String(viewModel.distribution.defaultEligible)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">release1Required</dt>
                  <dd>{String(viewModel.distribution.release1Required)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">hidden</dt>
                  <dd>{String(viewModel.distribution.hidden)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">deprecated</dt>
                  <dd>{String(viewModel.distribution.deprecated)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">cacheVersion</dt>
                  <dd>{viewModel.distribution.cacheVersion}</dd>
                </div>
              </dl>
            ) : (
              <p className="mt-3 text-sm text-slate-600">No distribution record.</p>
            )}
          </section>

          {viewModel.runtimeTrace ? (
            <section
              className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4 shadow-sm"
              data-testid="admin-runtime-trace"
            >
              <h2 className="text-sm font-semibold text-slate-900">Runtime trace</h2>
              <dl className="mt-3 grid gap-2 text-sm md:grid-cols-3">
                <div>
                  <dt className="text-slate-500">runtimeSource</dt>
                  <dd className="font-mono text-xs">{viewModel.runtimeTrace.runtimeSource}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">decoderPath</dt>
                  <dd className="font-mono text-xs">{viewModel.runtimeTrace.decoderPath}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">dslVersion</dt>
                  <dd className="font-mono text-xs">{viewModel.runtimeTrace.dslVersion ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">definitionSource</dt>
                  <dd className="font-mono text-xs">{viewModel.runtimeTrace.definitionSource}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">dslValid</dt>
                  <dd>{String(viewModel.runtimeTrace.dslValid)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">decoder rendered</dt>
                  <dd>{String(viewModel.runtimeTrace.decoder?.rendered ?? false)}</dd>
                </div>
              </dl>
              {viewModel.runtimeTrace.encoder?.extractedSlots ? (
                <details className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                  <summary className="cursor-pointer text-xs font-medium text-slate-800">
                    Extracted slots
                  </summary>
                  <pre className="mt-2 overflow-x-auto text-xs">
                    {JSON.stringify(viewModel.runtimeTrace.encoder.extractedSlots, null, 2)}
                  </pre>
                </details>
              ) : null}
            </section>
          ) : null}

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Current version</h2>
            {viewModel.currentVersion ? (
              <div className="mt-3 space-y-3 text-sm">
                <p>
                  v{viewModel.currentVersion.versionNumber} · copySafety:{" "}
                  {viewModel.currentVersion.copySafety} · qualityStatus:{" "}
                  {viewModel.currentVersion.qualityStatus}
                </p>
                <p className="font-mono text-xs text-slate-500">
                  checksum: {viewModel.currentVersion.sourceChecksum ?? "—"}
                </p>
                {viewModel.currentVersion.missingComponentProtocol ? (
                  <p
                    className="rounded-lg bg-amber-50 px-3 py-2 text-amber-900"
                    data-testid="admin-detail-missing-component-protocol"
                  >
                    Missing componentProtocolJson
                  </p>
                ) : null}
                {[
                  viewModel.currentVersion.definitionSummary,
                  viewModel.currentVersion.componentProtocolSummary,
                  viewModel.currentVersion.compatibilitySummary,
                ].map((summary) => (
                  <details key={summary.label} className="rounded-lg border border-slate-200 p-3">
                    <summary className="cursor-pointer font-medium text-slate-800">
                      {summary.label}
                    </summary>
                    <pre className="mt-2 overflow-x-auto text-xs text-slate-700">
                      {summary.preview}
                    </pre>
                  </details>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-600">No current version.</p>
            )}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Source</h2>
            {viewModel.sources.length > 0 ? (
              <ul className="mt-3 space-y-3 text-sm">
                {viewModel.sources.map((source) => (
                  <li key={source.id} className="rounded-lg border border-slate-100 p-3">
                    <p>
                      {source.sourceType}
                      {source.sourceCohort ? ` · cohort=${source.sourceCohort}` : ""} ·{" "}
                      {source.sourceRef ?? "—"}
                    </p>
                    <p className="text-xs text-slate-500">
                      rawHtml: {source.hasRawHtml ? "present" : "none"} · {source.createdAt}
                    </p>
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-slate-600">
                        sourceMetadata
                      </summary>
                      <pre className="mt-1 overflow-x-auto text-xs">{source.sourceMetadataPreview}</pre>
                    </details>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-600">No sources yet.</p>
            )}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Lifecycle timeline</h2>
            {viewModel.lifecycleEvents.length > 0 ? (
              <ul className="mt-3 space-y-2 text-sm">
                {viewModel.lifecycleEvents.map((event) => (
                  <li key={event.id} className="rounded-lg bg-slate-50 px-3 py-2">
                    {event.fromLifecycle ?? "—"} → {event.toLifecycle} · {event.reason} ·{" "}
                    {event.actor}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-600" data-testid="admin-detail-no-lifecycle-events">
                No lifecycle events yet
              </p>
            )}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Validation / Evidence</h2>
            {viewModel.validationRuns.length > 0 ? (
              <ul className="mt-3 space-y-2 text-sm">
                {viewModel.validationRuns.map((run) => (
                  <li key={run.id}>
                    {run.runType} · {run.status} · {run.createdAt}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-600" data-testid="admin-detail-no-validation-runs">
                No validation runs yet
              </p>
            )}
            {viewModel.evidence.length > 0 ? (
              <ul className="mt-3 space-y-2 text-sm">
                {viewModel.evidence.map((item) => (
                  <li key={item.id}>
                    {item.evidenceType} · {item.sourceLabel ?? "—"} · {item.createdAt}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-600" data-testid="admin-detail-no-evidence">
                No evidence yet
              </p>
            )}
          </section>
        </>
      ) : null}

      {viewModel.variant && viewModel.distribution ? (
        <StyleLibraryGovernanceActions
          runtimeVariantId={viewModel.runtimeVariantId}
          writeEnabled={viewModel.writeEnabled}
          writeProtectionMessage={viewModel.writeProtectionMessage}
        />
      ) : null}

      <DisabledActionsPanel
        actions={viewModel.disabledActions}
        caption="Preview / Copy / Validator: S10-STORY-010. Promote: S10-STORY-011. Governance rollback: S10-STORY-006."
      />
    </div>
  );
}
