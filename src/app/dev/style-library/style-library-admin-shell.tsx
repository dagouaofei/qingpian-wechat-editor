import type { StyleLibraryAdminViewModel } from "./style-library-view-model";

type Props = {
  viewModel: StyleLibraryAdminViewModel;
};

function boolLabel(value: boolean): string {
  return value ? "true" : "false";
}

function MetricCard({
  label,
  value,
  testId,
}: {
  label: string;
  value: string | number;
  testId?: string;
}) {
  return (
    <div
      className="rounded-lg border border-slate-200 bg-white px-4 py-3"
      data-testid={testId}
    >
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-lg font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

export function StyleLibraryAdminShell({ viewModel }: Props) {
  const { overview, assets, patches, evidence, validation, runtimeNotice } =
    viewModel;

  return (
    <div className="space-y-8" data-testid="style-library-admin-shell">
      <section
        aria-labelledby="style-library-runtime-notice"
        className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        data-testid="style-library-runtime-notice"
      >
        <p id="style-library-runtime-notice">{runtimeNotice}</p>
      </section>

      <section aria-labelledby="style-library-overview-heading">
        <h2
          id="style-library-overview-heading"
          className="mb-4 text-sm font-semibold text-slate-800"
        >
          Overview
        </h2>
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Library ID" value={overview.libraryId} />
          <MetricCard
            label="Schema Version"
            value={overview.schemaVersion}
            testId="style-library-schema-version"
          />
          <MetricCard label="Updated At" value={overview.updatedAt} />
          <MetricCard
            label="Total Assets"
            value={overview.totalAssets}
            testId="style-library-total-assets"
          />
          <MetricCard label="Variant Assets" value={overview.variantAssetCount} />
          <MetricCard
            label="Seed Assets"
            value={overview.seedAssetCount}
            testId="style-library-seed-count"
          />
          <MetricCard
            label="Registry Patches"
            value={overview.registryPatchCount}
          />
          <MetricCard
            label="Active Patches"
            value={overview.activePatchCount}
            testId="style-library-active-patches"
          />
          <MetricCard
            label="Evidence Refs"
            value={overview.evidenceRefCount}
          />
        </dl>

        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Lifecycle Distribution (assets)
          </h3>
          <ul className="mt-2 grid gap-1 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(overview.lifecycleDistribution).map(([state, count]) => (
              <li key={state} className="text-sm text-slate-700">
                <span className="font-mono text-xs text-slate-500">{state}</span>
                {": "}
                {count}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="style-library-validation-heading">
        <h2
          id="style-library-validation-heading"
          className="mb-4 text-sm font-semibold text-slate-800"
        >
          Validation Panel
        </h2>
        <div
          className="rounded-lg border border-slate-200 bg-white p-4"
          data-testid="style-library-validation-panel"
        >
          <p className="text-sm">
            Status:{" "}
            <span
              className={
                validation.ok
                  ? "font-semibold text-emerald-700"
                  : "font-semibold text-red-700"
              }
              data-testid="style-library-validation-status"
            >
              {validation.ok ? "valid" : "invalid"}
            </span>
            {" · "}
            Issue count:{" "}
            <span data-testid="style-library-validation-issue-count">
              {validation.issueCount}
            </span>
          </p>
          {validation.issues.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {validation.issues.map((issue, index) => (
                <li
                  key={`${issue.code}-${index}`}
                  className="rounded border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-800"
                >
                  <span className="font-mono text-xs">{issue.code}</span>
                  {": "}
                  {issue.message}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-600">
              No validation issues. Manifest passes schema and semantic checks.
            </p>
          )}
        </div>
      </section>

      <section aria-labelledby="style-library-assets-heading">
        <h2
          id="style-library-assets-heading"
          className="mb-4 text-sm font-semibold text-slate-800"
        >
          Asset List
        </h2>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">assetId</th>
                <th className="px-3 py-2">type</th>
                <th className="px-3 py-2">label</th>
                <th className="px-3 py-2">runtimeVariantId</th>
                <th className="px-3 py-2">blockType</th>
                <th className="px-3 py-2">family</th>
                <th className="px-3 py-2">lifecycle</th>
                <th className="px-3 py-2">userSelectable</th>
                <th className="px-3 py-2">defaultEligible</th>
                <th className="px-3 py-2">release1Required</th>
                <th className="px-3 py-2">seed</th>
                <th className="px-3 py-2">evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {assets.map((asset) => (
                <tr
                  key={asset.assetId}
                  data-testid={`style-library-asset-row-${asset.assetId}`}
                >
                  <td className="px-3 py-2 font-mono text-xs">{asset.assetId}</td>
                  <td className="px-3 py-2">{asset.assetType}</td>
                  <td className="px-3 py-2">{asset.label}</td>
                  <td className="px-3 py-2 font-mono text-xs">
                    {asset.runtimeVariantId ?? "—"}
                  </td>
                  <td className="px-3 py-2">{asset.blockType ?? "—"}</td>
                  <td className="px-3 py-2">{asset.styleFamily ?? "—"}</td>
                  <td className="px-3 py-2">{asset.lifecycle}</td>
                  <td className="px-3 py-2">{boolLabel(asset.userSelectable)}</td>
                  <td className="px-3 py-2">{boolLabel(asset.defaultEligible)}</td>
                  <td className="px-3 py-2">{boolLabel(asset.release1Required)}</td>
                  <td className="px-3 py-2">
                    {asset.seedBadge ? (
                      <span className="rounded bg-violet-100 px-2 py-0.5 text-xs text-violet-800">
                        {asset.seedBadge}
                      </span>
                    ) : (
                      boolLabel(asset.isSeedAsset)
                    )}
                  </td>
                  <td className="px-3 py-2">{asset.evidenceCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="style-library-patches-heading">
        <h2
          id="style-library-patches-heading"
          className="mb-4 text-sm font-semibold text-slate-800"
        >
          Registry Patch List
        </h2>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">patchId</th>
                <th className="px-3 py-2">operation</th>
                <th className="px-3 py-2">variantId</th>
                <th className="px-3 py-2">active</th>
                <th className="px-3 py-2">requiresLifecycle</th>
                <th className="px-3 py-2">requiresEvidenceIds</th>
                <th className="px-3 py-2">validation issues</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {patches.map((patch) => (
                <tr
                  key={patch.patchId}
                  data-testid={`style-library-patch-row-${patch.patchId}`}
                >
                  <td className="px-3 py-2 font-mono text-xs">{patch.patchId}</td>
                  <td className="px-3 py-2">{patch.operation}</td>
                  <td className="px-3 py-2 font-mono text-xs">{patch.variantId}</td>
                  <td className="px-3 py-2">{boolLabel(patch.active)}</td>
                  <td className="px-3 py-2">{patch.requiresLifecycle ?? "—"}</td>
                  <td className="px-3 py-2 font-mono text-xs">
                    {patch.requiresEvidenceIds.join(", ") || "—"}
                  </td>
                  <td className="px-3 py-2">{patch.validationIssueCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="style-library-evidence-heading">
        <h2
          id="style-library-evidence-heading"
          className="mb-4 text-sm font-semibold text-slate-800"
        >
          Evidence List
        </h2>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">evidenceId</th>
                <th className="px-3 py-2">kind</th>
                <th className="px-3 py-2">refPath</th>
                <th className="px-3 py-2">matrixRowId</th>
                <th className="px-3 py-2">sessionId</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {evidence.map((row) => (
                <tr
                  key={row.evidenceId}
                  data-testid={`style-library-evidence-row-${row.evidenceId}`}
                >
                  <td className="px-3 py-2 font-mono text-xs">{row.evidenceId}</td>
                  <td className="px-3 py-2">{row.kind}</td>
                  <td className="px-3 py-2 font-mono text-xs">{row.refPath}</td>
                  <td className="px-3 py-2">{row.matrixRowId ?? "—"}</td>
                  <td className="px-3 py-2">{row.sessionId ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
