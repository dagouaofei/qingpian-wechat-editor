import type {
  StyleLibraryAdminViewModel,
  StyleLibraryCandidateReviewCard,
  StyleLibraryLifecycleGroup,
} from "./style-library-view-model";

type Props = {
  viewModel: StyleLibraryAdminViewModel;
};

function boolLabel(viewModel: StyleLibraryAdminViewModel, value: boolean): string {
  return value ? viewModel.ui.boolTrue : viewModel.ui.boolFalse;
}

function SummaryCard({
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
      className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
      data-testid={testId}
    >
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-2 text-2xl font-semibold tabular-nums text-slate-900">
        {value}
      </dd>
    </div>
  );
}

function LanguageToggle({ viewModel }: { viewModel: StyleLibraryAdminViewModel }) {
  const { ui, locale } = viewModel;

  return (
    <div
      className="flex items-center gap-2"
      data-testid="style-library-language-toggle"
    >
      <span className="text-xs text-slate-500">{ui.languageToggleLabel}</span>
      <a
        href="?lang=zh"
        className={
          locale === "zh"
            ? "rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800"
            : "rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
        }
        data-testid="style-library-language-zh"
      >
        {ui.languageZh}
      </a>
      <a
        href="?lang=en"
        className={
          locale === "en"
            ? "rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800"
            : "rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
        }
        data-testid="style-library-language-en"
      >
        {ui.languageEn}
      </a>
    </div>
  );
}

function LifecycleBadge({
  label,
  rawKey,
}: {
  label: string;
  rawKey: string;
}) {
  return (
    <span
      className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-800"
      title={rawKey}
    >
      {label}
    </span>
  );
}

function SeedBadge({ badge }: { badge: string }) {
  return (
    <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-800">
      {badge}
    </span>
  );
}

function LifecyclePipelineColumn({
  group,
  viewModel,
}: {
  group: StyleLibraryLifecycleGroup;
  viewModel: StyleLibraryAdminViewModel;
}) {
  const { ui } = viewModel;

  return (
    <div
      className="flex min-w-[10rem] flex-1 flex-col rounded-xl border border-slate-200 bg-slate-50"
      data-testid={`style-library-lifecycle-column-${group.lifecycle}`}
    >
      <div className="border-b border-slate-200 px-3 py-2">
        <h3 className="text-xs font-semibold tracking-wide text-slate-700">
          {group.label}
        </h3>
        <p className="font-mono text-[10px] text-slate-400">{group.rawKey}</p>
        <p className="mt-0.5 text-xs text-slate-500">
          {ui.pipelineAssetsCount(group.assets.length)}
        </p>
      </div>
      <ul className="flex flex-1 flex-col gap-2 p-2">
        {group.assets.length === 0 ? (
          <li className="rounded-lg border border-dashed border-slate-200 bg-white px-2 py-3 text-center text-xs text-slate-400">
            {ui.pipelineEmpty}
          </li>
        ) : (
          group.assets.map((asset) => (
            <li
              key={asset.assetId}
              className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs"
              data-testid={`style-library-pipeline-asset-${asset.assetId}`}
            >
              <p className="font-medium text-slate-800">{asset.label}</p>
              <p className="mt-1 font-mono text-[10px] text-slate-500">
                {asset.runtimeVariantId ?? asset.assetId}
              </p>
              {asset.isSeedAsset ? (
                <span className="mt-1 inline-block rounded bg-violet-50 px-1.5 py-0.5 text-[10px] text-violet-700">
                  {ui.pipelineSeedBadge}
                </span>
              ) : null}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function CandidateReviewCard({
  card,
  viewModel,
}: {
  card: StyleLibraryCandidateReviewCard;
  viewModel: StyleLibraryAdminViewModel;
}) {
  const { ui } = viewModel;

  return (
    <article
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      data-testid={`style-library-candidate-card-${card.assetId}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{card.label}</h3>
          <p className="mt-1 font-mono text-xs text-slate-500">
            {card.runtimeVariantId}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <LifecycleBadge label={card.lifecycleLabel} rawKey={card.lifecycle} />
          {card.seedBadge ? <SeedBadge badge={card.seedBadge} /> : null}
        </div>
      </div>

      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs text-slate-500">{ui.candidateBlockType}</dt>
          <dd>{card.blockType ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">{ui.candidateStyleFamily}</dt>
          <dd>{card.styleFamily ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">{ui.candidateEvidenceCount}</dt>
          <dd data-testid={`style-library-candidate-evidence-${card.assetId}`}>
            {card.evidenceCount}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">{ui.candidateCurrentConclusion}</dt>
          <dd
            className="font-medium text-rose-800"
            data-testid={`style-library-candidate-conclusion-${card.assetId}`}
          >
            {card.currentConclusion}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs text-slate-500">{ui.candidateNextStep}</dt>
          <dd className="text-amber-800">{card.nextStepHint}</dd>
        </div>
      </dl>

      <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs">
        <p className="font-medium text-slate-600">{ui.candidateDistributionFlags}</p>
        <ul className="mt-1 space-y-0.5 text-slate-700">
          <li>
            {ui.candidateUserSelectable}: {boolLabel(viewModel, card.userSelectable)}
          </li>
          <li>
            {ui.candidateDefaultEligible}:{" "}
            {boolLabel(viewModel, card.defaultEligible)}
          </li>
          <li>
            {ui.candidateRelease1Required}:{" "}
            {boolLabel(viewModel, card.release1Required)}
          </li>
        </ul>
      </div>

      <div
        className="mt-4 space-y-2"
        data-testid={`style-library-candidate-actions-${card.assetId}`}
      >
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {ui.candidateDisabledActionsTitle}
        </p>
        <div className="flex flex-wrap gap-2">
          {card.disabledActions.map((action) => (
            <div key={action.actionId} className="flex flex-col gap-1">
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-md border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-400"
                data-testid={`style-library-disabled-action-${action.actionId}-${card.assetId}`}
                title={`${action.disabledReason} · ${action.deferredStory}`}
              >
                {action.label}
              </button>
              <span className="max-w-[12rem] text-[10px] leading-snug text-slate-500">
                {action.disabledReason}
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export function StyleLibraryAdminShell({ viewModel }: Props) {
  const {
    ui,
    workbench,
    statusSummary,
    lifecycleGroups,
    candidateReviewCards,
    assets,
    patches,
    evidence,
    validation,
    runtimeNotice,
  } = viewModel;

  return (
    <div className="space-y-10" data-testid="style-library-admin-shell">
      <section
        aria-labelledby="style-library-workbench-heading"
        className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm"
        data-testid="style-library-workbench-header"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2
              id="style-library-workbench-heading"
              className="text-2xl font-semibold text-slate-900"
            >
              {workbench.title}
            </h2>
            <p className="mt-1 text-base font-medium text-slate-700">
              {workbench.subtitle}
            </p>
            <p className="mt-2 text-sm text-slate-600">{workbench.description}</p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <LanguageToggle viewModel={viewModel} />
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
              {workbench.mode}
            </span>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-slate-500">{ui.libraryIdLabel}</dt>
            <dd className="font-mono text-sm text-slate-900">{workbench.libraryId}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">{ui.schemaVersionLabel}</dt>
            <dd
              className="text-sm font-semibold text-slate-900"
              data-testid="style-library-schema-version"
            >
              {workbench.schemaVersion}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">{ui.updatedAtLabel}</dt>
            <dd className="text-sm text-slate-900">{workbench.updatedAt}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">{ui.runtimeStatusLabel}</dt>
            <dd
              className="text-sm font-medium text-rose-700"
              data-testid="style-library-runtime-status"
            >
              {workbench.runtimeStatus}
            </dd>
          </div>
        </dl>
      </section>

      <section
        aria-labelledby="style-library-status-summary-heading"
        data-testid="style-library-status-summary"
      >
        <h2
          id="style-library-status-summary-heading"
          className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-700"
        >
          {ui.sectionStatusSummary}
        </h2>
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          <SummaryCard
            label={ui.summaryTotalAssets}
            value={statusSummary.totalAssets}
            testId="style-library-total-assets"
          />
          <SummaryCard
            label={ui.summarySeedCandidates}
            value={statusSummary.seedCandidates}
            testId="style-library-seed-count"
          />
          <SummaryCard
            label={ui.summaryPasteQaPassed}
            value={statusSummary.pasteQaPassed}
            testId="style-library-paste-qa-passed"
          />
          <SummaryCard
            label={ui.summaryUserSelectable}
            value={statusSummary.userSelectable}
            testId="style-library-user-selectable"
          />
          <SummaryCard
            label={ui.summaryDefaultEligible}
            value={statusSummary.defaultEligible}
            testId="style-library-default-eligible"
          />
          <SummaryCard
            label={ui.summaryActivePatches}
            value={statusSummary.activePatches}
            testId="style-library-active-patches"
          />
          <SummaryCard
            label={ui.summaryValidationIssues}
            value={statusSummary.validationIssues}
            testId="style-library-validation-issue-count"
          />
        </dl>
      </section>

      <section
        aria-labelledby="style-library-lifecycle-pipeline-heading"
        data-testid="style-library-lifecycle-pipeline"
      >
        <h2
          id="style-library-lifecycle-pipeline-heading"
          className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-700"
        >
          {ui.sectionLifecyclePipeline}
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {lifecycleGroups.map((group) => (
            <LifecyclePipelineColumn
              key={group.lifecycle}
              group={group}
              viewModel={viewModel}
            />
          ))}
        </div>
      </section>

      <section
        aria-labelledby="style-library-candidate-review-heading"
        data-testid="style-library-candidate-review"
      >
        <h2
          id="style-library-candidate-review-heading"
          className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-700"
        >
          {ui.sectionCandidateReview}
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {candidateReviewCards.map((card) => (
            <CandidateReviewCard key={card.assetId} card={card} viewModel={viewModel} />
          ))}
        </div>
      </section>

      <section
        aria-labelledby="style-library-diagnostics-heading"
        className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 p-6"
        data-testid="style-library-diagnostics"
      >
        <h2
          id="style-library-diagnostics-heading"
          className="text-sm font-semibold uppercase tracking-wide text-slate-600"
        >
          {ui.sectionDiagnostics}
        </h2>
        <p className="mt-1 text-sm text-slate-500">{ui.sectionDiagnosticsDescription}</p>

        <div
          aria-labelledby="style-library-runtime-notice"
          className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          data-testid="style-library-runtime-notice"
        >
          <p className="text-xs font-medium text-amber-800">{ui.sectionRuntimeNotice}</p>
          <p id="style-library-runtime-notice" className="mt-1">
            {runtimeNotice}
          </p>
        </div>

        <div className="mt-8 space-y-8">
          <section aria-labelledby="style-library-validation-heading">
            <h3
              id="style-library-validation-heading"
              className="mb-4 text-sm font-semibold text-slate-800"
            >
              {ui.sectionValidationPanel}
            </h3>
            <div
              className="rounded-lg border border-slate-200 bg-white p-4"
              data-testid="style-library-validation-panel"
            >
              <p className="text-sm">
                {ui.validationStatus}:{" "}
                <span
                  className={
                    validation.ok
                      ? "font-semibold text-emerald-700"
                      : "font-semibold text-red-700"
                  }
                  data-testid="style-library-validation-status"
                >
                  {validation.ok ? ui.validationValid : ui.validationInvalid}
                </span>
                {" · "}
                {ui.validationIssueCount}: {validation.issueCount}
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
                <p className="mt-2 text-sm text-slate-600">{ui.validationNoIssues}</p>
              )}
            </div>
          </section>

          <section aria-labelledby="style-library-assets-heading">
            <h3
              id="style-library-assets-heading"
              className="mb-4 text-sm font-semibold text-slate-800"
            >
              {ui.sectionAssetList}
            </h3>
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
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
                <tbody className="divide-y divide-slate-100">
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
                      <td className="px-3 py-2">
                        {boolLabel(viewModel, asset.userSelectable)}
                      </td>
                      <td className="px-3 py-2">
                        {boolLabel(viewModel, asset.defaultEligible)}
                      </td>
                      <td className="px-3 py-2">
                        {boolLabel(viewModel, asset.release1Required)}
                      </td>
                      <td className="px-3 py-2">
                        {asset.seedBadge ? (
                          <span className="rounded bg-violet-100 px-2 py-0.5 text-xs text-violet-800">
                            {asset.seedBadge}
                          </span>
                        ) : (
                          boolLabel(viewModel, asset.isSeedAsset)
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
            <h3
              id="style-library-patches-heading"
              className="mb-4 text-sm font-semibold text-slate-800"
            >
              {ui.sectionPatchList}
            </h3>
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
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
                <tbody className="divide-y divide-slate-100">
                  {patches.map((patch) => (
                    <tr
                      key={patch.patchId}
                      data-testid={`style-library-patch-row-${patch.patchId}`}
                    >
                      <td className="px-3 py-2 font-mono text-xs">{patch.patchId}</td>
                      <td className="px-3 py-2">{patch.operation}</td>
                      <td className="px-3 py-2 font-mono text-xs">{patch.variantId}</td>
                      <td className="px-3 py-2">{boolLabel(viewModel, patch.active)}</td>
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
            <h3
              id="style-library-evidence-heading"
              className="mb-4 text-sm font-semibold text-slate-800"
            >
              {ui.sectionEvidenceList}
            </h3>
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
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
                <tbody className="divide-y divide-slate-100">
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
      </section>
    </div>
  );
}
