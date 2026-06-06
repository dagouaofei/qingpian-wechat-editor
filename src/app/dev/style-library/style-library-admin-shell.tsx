import type {
  StyleLibraryAdminViewModel,
  StyleLibraryCandidateReviewCard,
  StyleLibraryLifecycleGroup,
} from "./style-library-view-model";
import { StyleLibraryHtmlProposalPanel } from "./style-library-html-proposal-panel";
import { StyleLibraryInspectionPreviewShell } from "./style-library-inspection-preview";

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
        <p className="mt-2 text-[11px] leading-snug text-slate-600">
          <span className="font-medium text-slate-500">{ui.lifecycleColumnMeaning}: </span>
          {group.businessMeaning}
        </p>
        <p className="mt-1 text-[11px] leading-snug text-slate-600">
          <span className="font-medium text-slate-500">{ui.lifecycleColumnNextAction}: </span>
          {group.nextAction}
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

function InspectionPanel({
  card,
  viewModel,
}: {
  card: StyleLibraryCandidateReviewCard;
  viewModel: StyleLibraryAdminViewModel;
}) {
  const { ui } = viewModel;
  const panel = card.inspectionPanel;

  return (
    <div
      className="mt-4 space-y-4 rounded-lg border border-emerald-100 bg-emerald-50/40 px-3 py-3"
      data-testid={`style-library-inspection-panel-${card.assetId}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-900">
        {ui.sectionPreviewCopyValidator}
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <div data-testid={`style-library-inspection-preview-${card.assetId}`}>
          <p className="text-xs font-medium text-slate-600">{ui.inspectionPreviewTitle}</p>
          <dl className="mt-2 space-y-1 text-sm">
            <div>
              <dt className="text-xs text-slate-500">{ui.inspectionFixtureLabel}</dt>
              <dd>{panel.fixtureLabel}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">{ui.candidateBlockType}</dt>
              <dd>{panel.blockType}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">variantId</dt>
              <dd className="font-mono text-xs">{panel.runtimeVariantId}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">{ui.inspectionPreviewStatus}</dt>
              <dd>{panel.previewStatus}</dd>
            </div>
          </dl>
          <div className="mt-3">
            <StyleLibraryInspectionPreviewShell
              previewBlock={panel.previewBlock}
              fallbackText={panel.previewStatus}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div data-testid={`style-library-inspection-copy-${card.assetId}`}>
            <p className="text-xs font-medium text-slate-600">{ui.inspectionCopyTitle}</p>
            <dl className="mt-2 space-y-1 text-sm">
              <div>
                <dt className="text-xs text-slate-500">{ui.inspectionCopyStatus}</dt>
                <dd>{panel.copyStatus}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">{ui.inspectionInlineStyle}</dt>
                <dd>{boolLabel(viewModel, panel.usesInlineStyle)}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">{ui.inspectionForbiddenCapability}</dt>
                <dd>{boolLabel(viewModel, panel.hasForbiddenCapability)}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">{ui.inspectionRiskyCapability}</dt>
                <dd>{boolLabel(viewModel, panel.hasRiskyCapability)}</dd>
              </div>
            </dl>
            {panel.copyHtmlSnippet ? (
              <p className="mt-2 rounded border border-slate-200 bg-white px-2 py-2 font-mono text-[10px] leading-relaxed text-slate-600">
                {panel.copyHtmlSnippet}
              </p>
            ) : null}
          </div>

          <div data-testid={`style-library-inspection-validator-${card.assetId}`}>
            <p className="text-xs font-medium text-slate-600">{ui.inspectionValidatorTitle}</p>
            <dl className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-slate-500">{ui.validationStatus}</dt>
                <dd className="font-semibold">{panel.validatorStatusLabel}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">{ui.inspectionIssueCount}</dt>
                <dd>{panel.issueCount}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">{ui.inspectionBlockerCount}</dt>
                <dd>{panel.blockerCount}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">{ui.inspectionWarningCount}</dt>
                <dd>{panel.warningCount}</dd>
              </div>
            </dl>
            {panel.validatorIssueSummaries.length > 0 ? (
              <ul className="mt-2 space-y-1 text-xs text-slate-700">
                {panel.validatorIssueSummaries.map((issue) => (
                  <li key={issue} className="rounded border border-slate-200 bg-white px-2 py-1">
                    {issue}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>

      <div
        className="rounded-lg border border-amber-100 bg-white px-3 py-3"
        data-testid={`style-library-promote-readiness-${card.assetId}`}
      >
        <p className="text-xs font-medium text-slate-600">{ui.inspectionPromoteReadinessTitle}</p>
        <p
          className={
            panel.promoteReadiness.readyForPromoteReview
              ? "mt-2 text-sm font-semibold text-emerald-800"
              : "mt-2 text-sm font-semibold text-amber-800"
          }
        >
          {panel.promoteReadinessLabel}
        </p>
        <p className="mt-2 text-sm text-slate-800">
          <span className="font-medium text-slate-500">{ui.inspectionOperatorConclusion}: </span>
          {panel.operatorConclusion}
        </p>
        {panel.promoteBlockedReasons.length > 0 ? (
          <ul className="mt-2 space-y-1 text-xs text-rose-700">
            {panel.promoteBlockedReasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        ) : null}
        {panel.nextRequiredStory ? (
          <p className="mt-2 text-xs text-slate-600">
            {ui.inspectionNextStory}: {panel.nextRequiredStory}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function PromoteReviewPanel({
  card,
  viewModel,
}: {
  card: StyleLibraryCandidateReviewCard;
  viewModel: StyleLibraryAdminViewModel;
}) {
  const { ui } = viewModel;
  const panel = card.promotePanel;
  const badgeClass =
    panel.eligibilityStatus === "blocked"
      ? "bg-rose-100 text-rose-800"
      : panel.eligibilityStatus === "ready_with_warnings"
        ? "bg-amber-100 text-amber-900"
        : "bg-emerald-100 text-emerald-800";

  return (
    <div
      className="mt-4 space-y-4 rounded-lg border border-violet-100 bg-violet-50/40 px-3 py-3"
      data-testid={`style-library-promote-panel-${card.assetId}`}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-900">
          {ui.sectionPromoteReview}
        </p>
        <p className="mt-1 text-[11px] text-violet-800">{ui.promoteReviewHint}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeClass}`}
          data-testid={`style-library-promote-badge-${card.assetId}`}
        >
          {panel.badgeLabel}
        </span>
        <span className="text-sm font-medium text-slate-800">
          {panel.eligibilityStatusLabel}
        </span>
      </div>

      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs text-slate-500">{ui.promoteEligibilityStatus}</dt>
          <dd>{panel.eligibilityStatusLabel}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">{ui.promoteValidatorStatus}</dt>
          <dd>{panel.validatorStatus}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">{ui.promotePasteQaStatus}</dt>
          <dd>{panel.pasteQaStatus}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">{ui.promoteTargetLabel}</dt>
          <dd className="font-mono text-xs">{panel.promoteTarget}</dd>
        </div>
      </dl>

      {panel.blockedReasons.length > 0 ? (
        <div>
          <p className="text-xs font-medium text-slate-600">{ui.promoteBlockedReasons}</p>
          <ul className="mt-1 space-y-1 text-xs text-rose-700">
            {panel.blockedReasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {panel.warningReasons.length > 0 ? (
        <div>
          <p className="text-xs font-medium text-slate-600">{ui.promoteWarningReasons}</p>
          <ul className="mt-1 space-y-1 text-xs text-amber-800">
            {panel.warningReasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div>
        <p className="text-xs font-medium text-slate-600">{ui.promoteEvidenceChecklist}</p>
        <ul className="mt-1 space-y-1 font-mono text-xs text-slate-700">
          {panel.evidenceChecklist.map((row) => (
            <li key={row.evidenceId}>
              {row.label} {row.evidenceId}
            </li>
          ))}
        </ul>
      </div>

      <dl className="space-y-2 text-sm">
        <div>
          <dt className="text-xs text-slate-500">{ui.promoteDistributionImpact}</dt>
          <dd>{panel.distributionImpactSummary}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">{ui.promoteRuntimeImpact}</dt>
          <dd>{panel.runtimeImpactSummary}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">{ui.promoteDefaultPresetImpact}</dt>
          <dd>{panel.defaultPresetImpactSummary}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">{ui.promoteNextDecision}</dt>
          <dd>{panel.nextDecisionRequired}</dd>
        </div>
      </dl>

      {panel.eligible ? (
        <details
          open={panel.proposalPreviewOpen}
          data-testid={`style-library-promote-proposal-${card.assetId}`}
        >
          <summary className="cursor-pointer text-sm font-medium text-violet-800">
            {ui.promoteGenerateProposal}
          </summary>
          <div className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm">
            <p className="text-xs font-medium text-slate-600">{ui.promoteProposalPreview}</p>
            <dl className="mt-2 space-y-1 text-xs">
              <div>
                <dt className="text-slate-500">{ui.promoteProposalId}</dt>
                <dd className="font-mono">{panel.proposal.proposalId}</dd>
              </div>
              <div>
                <dt className="text-slate-500">{ui.promoteTargetLabel}</dt>
                <dd className="font-mono">{panel.promoteTarget}</dd>
              </div>
              <div>
                <dt className="text-slate-500">{ui.promotePatchPreview}</dt>
                <dd className="mt-1 rounded border border-slate-100 bg-slate-50 p-2 font-mono text-[10px] leading-relaxed">
                  patchId: {panel.proposal.patchPreview.patchId}
                  <br />
                  operation: {panel.proposal.patchPreview.operation}
                  <br />
                  variantId: {panel.proposal.patchPreview.variantId}
                  <br />
                  active: {String(panel.proposal.patchPreview.active)}
                  <br />
                  status: {panel.proposal.patchPreview.status}
                </dd>
              </div>
            </dl>
          </div>
        </details>
      ) : (
        <button
          type="button"
          disabled
          className="cursor-not-allowed rounded-md border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-400"
          data-testid={`style-library-promote-generate-disabled-${card.assetId}`}
        >
          {ui.promoteGenerateProposal}
        </button>
      )}
    </div>
  );
}

function ColorSwatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className="inline-block h-4 w-4 rounded border border-slate-200"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      <span className="text-slate-600">{label}</span>
      <span className="font-mono text-[10px] text-slate-400">{color}</span>
    </div>
  );
}

function CandidateStyleLinksPanel({
  card,
  viewModel,
}: {
  card: StyleLibraryCandidateReviewCard;
  viewModel: StyleLibraryAdminViewModel;
}) {
  const { ui } = viewModel;
  const links = card.styleLinks;

  return (
    <div
      className="mt-4 rounded-lg border border-sky-100 bg-sky-50/40 px-3 py-3"
      data-testid={`style-library-candidate-style-links-${card.assetId}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-sky-900">
        {ui.sectionCandidateStyleLinks}
      </p>
      <dl className="mt-3 space-y-2 text-sm">
        <div>
          <dt className="text-xs text-slate-500">{ui.candidateLinkedStyle}</dt>
          <dd>
            {links.linkedStyleName ? (
              <>
                {links.linkedStyleName}{" "}
                <span className="font-mono text-[10px] text-slate-400">
                  ({links.linkedStyleId})
                </span>
              </>
            ) : (
              <span className="text-amber-800">{links.unlinkedStyleLabel}</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">{ui.candidateLinkedPalette}</dt>
          <dd>
            {links.linkedPaletteNames.length > 0 ? (
              <ul className="space-y-0.5">
                {links.linkedPaletteNames.map((name, index) => (
                  <li key={links.linkedPaletteIds[index]}>
                    {name}{" "}
                    <span className="font-mono text-[10px] text-slate-400">
                      ({links.linkedPaletteIds[index]})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-amber-800">{links.unlinkedPaletteLabel}</span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">{ui.candidateLinkedRules}</dt>
          <dd>
            {links.linkedRuleNames.length > 0 ? (
              <ul className="space-y-0.5">
                {links.linkedRuleNames.map((name, index) => (
                  <li key={links.linkedRuleIds[index]}>
                    {name}{" "}
                    <span className="font-mono text-[10px] text-slate-400">
                      ({links.linkedRuleIds[index]})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-amber-800">{links.unlinkedRuleLabel}</span>
            )}
          </dd>
        </div>
      </dl>
    </div>
  );
}

function LifecycleTransitionPanel({
  card,
  viewModel,
}: {
  card: StyleLibraryCandidateReviewCard;
  viewModel: StyleLibraryAdminViewModel;
}) {
  const { ui } = viewModel;
  const panel = card.lifecyclePanel;

  return (
    <div
      className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50/40 px-3 py-3"
      data-testid={`style-library-lifecycle-panel-${card.assetId}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-800">
        {ui.sectionLifecycleManagement}
      </p>
      <p className="mt-1 text-[11px] text-indigo-700">{ui.lifecycleTransitionPanelHint}</p>

      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs text-slate-500">{ui.lifecycleCurrentState}</dt>
          <dd>{panel.currentStateDescription}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">{ui.lifecycleStatusExplanation}</dt>
          <dd>{panel.statusExplanation}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">{ui.lifecycleNextStepSuggestion}</dt>
          <dd className="text-amber-800">{panel.nextStepSuggestion}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">{ui.lifecycleRuntimeImpact}</dt>
          <dd>{panel.runtimeImpactSummary}</dd>
        </div>
        {panel.blockedReason ? (
          <div className="sm:col-span-2">
            <dt className="text-xs text-slate-500">{ui.lifecycleBlockedReason}</dt>
            <dd className="font-medium text-rose-800">{panel.blockedReason}</dd>
          </div>
        ) : null}
        <div>
          <dt className="text-xs text-slate-500">{ui.lifecycleRequiredEvidence}</dt>
          <dd className="font-mono text-xs">
            {panel.requiredEvidenceIds.join(", ") || "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">{ui.lifecycleLinkedStory}</dt>
          <dd>{panel.linkedFutureStory ?? "—"}</dd>
        </div>
      </dl>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-slate-600">{ui.lifecycleBlockedTransitions}</p>
          <ul className="mt-2 space-y-2">
            {panel.blockedTransitions.map((transition) => (
              <li
                key={transition.targetState}
                className="rounded border border-rose-100 bg-white px-2 py-2 text-xs"
                data-testid={`style-library-blocked-transition-${transition.targetState}-${card.assetId}`}
              >
                <p className="font-medium text-slate-800">
                  {transition.targetLabel}{" "}
                  <span className="font-mono text-[10px] text-slate-400">
                    ({transition.rawKey})
                  </span>
                </p>
                <ul className="mt-1 space-y-0.5 text-rose-700">
                  {transition.blockedReasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
                {transition.requiredStory ? (
                  <p className="mt-1 text-slate-500">{transition.requiredStory}</p>
                ) : null}
                <details className="mt-2">
                  <summary className="cursor-pointer text-indigo-700">
                    {ui.lifecycleProposalPreview}
                  </summary>
                  <ProposalPreview proposal={transition.proposal} ui={ui} />
                </details>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-600">{ui.lifecycleAllowedTransitions}</p>
          {panel.allowedTransitions.length === 0 ? (
            <p className="mt-2 text-xs text-slate-500">—</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {panel.allowedTransitions.map((transition) => (
                <li
                  key={transition.targetState}
                  className="rounded border border-emerald-100 bg-white px-2 py-2 text-xs"
                  data-testid={`style-library-allowed-transition-${transition.targetState}-${card.assetId}`}
                >
                  <p className="font-medium text-slate-800">
                    {transition.targetLabel}{" "}
                    <span className="font-mono text-[10px] text-slate-400">
                      ({transition.rawKey})
                    </span>
                  </p>
                  <details className="mt-2" open>
                    <summary className="cursor-pointer text-indigo-700">
                      {ui.lifecycleProposalPreview}
                    </summary>
                    <ProposalPreview proposal={transition.proposal} ui={ui} />
                  </details>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function ProposalPreview({
  proposal,
  ui,
}: {
  proposal: StyleLibraryCandidateReviewCard["lifecyclePanel"]["blockedTransitions"][number]["proposal"];
  ui: StyleLibraryAdminViewModel["ui"];
}) {
  return (
    <div
      className="mt-2 rounded border border-slate-200 bg-slate-50 p-2 text-[11px] text-slate-700"
      data-testid={`style-library-proposal-${proposal.proposalId}`}
    >
      <p className="font-mono text-[10px] text-slate-500">{proposal.proposalId}</p>
      <p className="mt-1">
        {proposal.fromLifecycle} → {proposal.toLifecycle}
      </p>
      <p className="mt-1">
        {proposal.allowed ? ui.lifecycleProposalAllowed : ui.lifecycleProposalBlocked}
      </p>
      <p className="mt-1">
        {ui.lifecycleDistributionImpact}: userSelectable=
        {String(proposal.distributionImpact.userSelectable)}, defaultEligible=
        {String(proposal.distributionImpact.defaultEligible)}, release1Required=
        {String(proposal.distributionImpact.release1Required)}
      </p>
      <p className="mt-1">
        {ui.lifecycleRuntimeImpact}: {ui.lifecycleNoRuntimeChange}
      </p>
      {proposal.requiredStory ? (
        <p className="mt-1">{ui.lifecycleLinkedStory}: {proposal.requiredStory}</p>
      ) : null}
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

      <CandidateStyleLinksPanel card={card} viewModel={viewModel} />

      <LifecycleTransitionPanel card={card} viewModel={viewModel} />
      <InspectionPanel card={card} viewModel={viewModel} />
      <PromoteReviewPanel card={card} viewModel={viewModel} />

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
    candidateInspectionPanels,
    assets,
    patches,
    evidence,
    validation,
    styleCards,
    paletteCards,
    ruleCards,
    styleManagementDisabledActions,
    locale,
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

        <h3 className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wide text-slate-600">
          {ui.sectionInspectionSummary}
        </h3>
        <dl
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          data-testid="style-library-inspection-summary"
        >
          <SummaryCard
            label={ui.summaryAutoValidationPassed}
            value={statusSummary.autoValidationPassed}
            testId="style-library-auto-validation-passed"
          />
          <SummaryCard
            label={ui.summaryNeedsPasteQa}
            value={statusSummary.needsPasteQa}
            testId="style-library-needs-paste-qa"
          />
          <SummaryCard
            label={ui.summaryReadyForPromoteReview}
            value={statusSummary.readyForPromoteReview}
            testId="style-library-ready-for-promote-review"
          />
          <SummaryCard
            label={ui.summaryBlockedCandidates}
            value={statusSummary.blockedCandidates}
            testId="style-library-blocked-candidates"
          />
          <SummaryCard
            label={ui.summaryCompatibilityWarnings}
            value={statusSummary.compatibilityWarnings}
            testId="style-library-compatibility-warnings"
          />
        </dl>

        <h3 className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wide text-slate-600">
          {ui.sectionPromoteSummary}
        </h3>
        <dl
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          data-testid="style-library-promote-summary"
        >
          <SummaryCard
            label={ui.summaryReadyForPromoteReview}
            value={statusSummary.readyForPromoteReview}
            testId="style-library-promote-ready-count"
          />
          <SummaryCard
            label={ui.summaryCompatibilityWarnings}
            value={statusSummary.compatibilityWarnings}
            testId="style-library-promote-warnings-count"
          />
          <SummaryCard
            label={ui.summaryBlockedCandidates}
            value={statusSummary.blockedCandidates}
            testId="style-library-promote-blocked-count"
          />
          <SummaryCard
            label={ui.summaryPromoteProposalsAvailable}
            value={statusSummary.promoteProposalsAvailable}
            testId="style-library-promote-proposals-available"
          />
        </dl>

        <h3 className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wide text-slate-600">
          {ui.sectionStyleRuleSummary}
        </h3>
        <dl
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8"
          data-testid="style-library-style-rule-summary"
        >
          <SummaryCard label={ui.summaryStyleCount} value={statusSummary.styleCount} testId="style-library-style-count" />
          <SummaryCard label={ui.summaryPaletteCount} value={statusSummary.paletteCount} testId="style-library-palette-count" />
          <SummaryCard label={ui.summaryRuleCount} value={statusSummary.ruleCount} testId="style-library-rule-count" />
          <SummaryCard label={ui.summaryCopySafeRules} value={statusSummary.copySafeRuleCount} testId="style-library-copy-safe-rule-count" />
          <SummaryCard label={ui.summarySelectionRules} value={statusSummary.selectionRuleCount} testId="style-library-selection-rule-count" />
          <SummaryCard label={ui.summaryStylesReadyForExpansion} value={statusSummary.stylesReadyForExpansion} testId="style-library-styles-ready-expansion" />
          <SummaryCard label={ui.summaryStylesMissingPalette} value={statusSummary.stylesMissingPalette} testId="style-library-styles-missing-palette" />
          <SummaryCard label={ui.summaryRulesWithWarnings} value={statusSummary.rulesWithWarnings} testId="style-library-rules-with-warnings" />
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
        aria-labelledby="style-library-lifecycle-management-heading"
        data-testid="style-library-lifecycle-management"
        className="space-y-4"
      >
        <h2
          id="style-library-lifecycle-management-heading"
          className="text-sm font-semibold uppercase tracking-wide text-slate-700"
        >
          {ui.sectionLifecycleManagement}
        </h2>
        <p className="text-sm text-slate-600">{ui.lifecycleTransitionPanelHint}</p>
      </section>

      <section
        aria-labelledby="style-library-style-management-heading"
        data-testid="style-library-style-management"
        className="space-y-6"
      >
        <div>
          <h2
            id="style-library-style-management-heading"
            className="text-sm font-semibold uppercase tracking-wide text-slate-700"
          >
            {ui.sectionStyleManagement}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{ui.styleManagementHint}</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {styleCards.map((style) => (
            <article
              key={style.styleId}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              data-testid={`style-library-style-card-${style.styleId}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-base font-semibold text-slate-900">{style.name}</h3>
                <span className="font-mono text-[10px] text-slate-400">{style.styleId}</span>
              </div>
              <p className="mt-2 text-sm text-slate-700">{style.description}</p>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-slate-500">{ui.styleTone}</dt>
                  <dd>{style.tone}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">{ui.styleDensity}</dt>
                  <dd>{style.density}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs text-slate-500">{ui.styleIntendedUseCases}</dt>
                  <dd>{style.intendedUseCases.join(" · ")}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs text-slate-500">{ui.styleTargetArticleTypes}</dt>
                  <dd className="font-mono text-xs">{style.targetArticleTypes.join(", ")}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">{ui.styleLinkedPalettes}</dt>
                  <dd className="font-mono text-xs">{style.linkedPaletteIds.join(", ") || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">{ui.styleLinkedVariants}</dt>
                  <dd className="font-mono text-xs">{style.linkedVariantAssetIds.join(", ") || "—"}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs text-slate-500">{ui.styleLinkedRules}</dt>
                  <dd className="font-mono text-xs">{style.linkedRuleIds.join(", ") || "—"}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs text-slate-500">{ui.styleS10Hint}</dt>
                  <dd className="text-sky-800">{style.s10ExpansionHint}</dd>
                </div>
              </dl>
              <p className="mt-2 text-xs font-medium text-emerald-800">
                {style.readyForExpansion ? ui.styleReadyForExpansion : ui.styleNotReadyForExpansion}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="style-library-palette-management-heading"
        data-testid="style-library-palette-management"
      >
        <h2
          id="style-library-palette-management-heading"
          className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-700"
        >
          {ui.sectionPaletteManagement}
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {paletteCards.map((palette) => (
            <article
              key={palette.paletteId}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              data-testid={`style-library-palette-card-${palette.paletteId}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-base font-semibold text-slate-900">{palette.name}</h3>
                <span className="font-mono text-[10px] text-slate-400">{palette.paletteId}</span>
              </div>
              <p className="mt-2 text-sm text-slate-700">{palette.description}</p>
              <div className="mt-3 space-y-1">
                <ColorSwatch color={palette.primaryColor} label={ui.palettePrimaryColor} />
                <ColorSwatch color={palette.accentColor} label={ui.paletteAccentColor} />
                <ColorSwatch color={palette.backgroundColor} label={ui.paletteBackgroundColor} />
                <ColorSwatch color={palette.textColor} label={ui.paletteTextColor} />
                <ColorSwatch color={palette.borderColor} label={ui.paletteBorderColor} />
              </div>
              <dl className="mt-3 space-y-1 text-sm">
                <div>
                  <dt className="text-xs text-slate-500">{ui.paletteCopySafeNotes}</dt>
                  <dd>{palette.copySafeNotes}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">{ui.paletteContrastNotes}</dt>
                  <dd>{palette.contrastNotes}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">{ui.paletteCompatibleStyles}</dt>
                  <dd className="font-mono text-xs">{palette.compatibleStyleIds.join(", ") || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">{ui.paletteLinkedVariants}</dt>
                  <dd className="font-mono text-xs">{palette.linkedVariantAssetIds.join(", ") || "—"}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="style-library-rule-management-heading"
        data-testid="style-library-rule-management"
      >
        <h2
          id="style-library-rule-management-heading"
          className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-700"
        >
          {ui.sectionRuleManagement}
        </h2>
        <div className="grid gap-4">
          {ruleCards.map((rule) => (
            <article
              key={rule.ruleId}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              data-testid={`style-library-rule-card-${rule.ruleId}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{rule.name}</h3>
                  <p className="mt-1 font-mono text-[10px] text-slate-400">{rule.ruleId}</p>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5">{rule.ruleTypeLabel}</span>
                  <span
                    className={
                      rule.hasWarning
                        ? "rounded-full bg-amber-100 px-2 py-0.5 text-amber-900"
                        : "rounded-full bg-slate-100 px-2 py-0.5"
                    }
                  >
                    {rule.severityLabel}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-800">{rule.operatorSummary}</p>
              <p className="mt-1 text-sm text-slate-600">{rule.description}</p>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-slate-500">{ui.ruleAppliesTo}</dt>
                  <dd>{rule.appliesTo}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">{ui.ruleRelatedContract}</dt>
                  <dd className="font-mono text-xs">{rule.relatedContract}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">{ui.ruleLinkedStyles}</dt>
                  <dd className="font-mono text-xs">{rule.linkedStyleIds.join(", ") || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">{ui.ruleLinkedVariants}</dt>
                  <dd className="font-mono text-xs">{rule.linkedVariantAssetIds.join(", ") || "—"}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs text-slate-500">{ui.ruleEvidenceRefs}</dt>
                  <dd className="font-mono text-xs">{rule.evidenceRefs.join(", ") || "—"}</dd>
                </div>
                {rule.relatedStory ? (
                  <div>
                    <dt className="text-xs text-slate-500">{ui.ruleRelatedStory}</dt>
                    <dd>{rule.relatedStory}</dd>
                  </div>
                ) : null}
              </dl>
            </article>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2" data-testid="style-library-style-management-actions">
          <p className="w-full text-xs font-medium uppercase tracking-wide text-slate-500">
            {ui.styleManagementDisabledActionsTitle}
          </p>
          {styleManagementDisabledActions.map((action) => (
            <button
              key={action.actionId}
              type="button"
              disabled
              className="cursor-not-allowed rounded-md border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-400"
              data-testid={`style-library-disabled-action-${action.actionId}`}
              title={`${action.disabledReason} · ${action.deferredStory}`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </section>

      <StyleLibraryHtmlProposalPanel locale={locale} />

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
          <section aria-labelledby="style-library-inspection-advanced-heading">
            <h3
              id="style-library-inspection-advanced-heading"
              className="mb-4 text-sm font-semibold text-slate-800"
            >
              {ui.sectionPreviewCopyValidator} · Advanced
            </h3>
            <div className="space-y-4">
              {candidateInspectionPanels.map((panel) => (
                <details
                  key={panel.assetId}
                  className="rounded-lg border border-slate-200 bg-white p-4"
                  data-testid={`style-library-inspection-advanced-${panel.assetId}`}
                >
                  <summary className="cursor-pointer text-sm font-medium text-slate-800">
                    {panel.runtimeVariantId}
                  </summary>
                  <div className="mt-3 space-y-3">
                    <div>
                      <p className="text-xs font-medium text-slate-500">{ui.inspectionRawCopyHtml}</p>
                      <pre className="mt-1 max-h-48 overflow-auto rounded border border-slate-100 bg-slate-50 p-2 text-[10px] text-slate-700">
                        {panel.rawCopyHtml ?? "—"}
                      </pre>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        {ui.inspectionRawValidatorIssues}
                      </p>
                      <pre className="mt-1 max-h-48 overflow-auto rounded border border-slate-100 bg-slate-50 p-2 text-[10px] text-slate-700">
                        {panel.rawValidatorIssues.join("\n") || "—"}
                      </pre>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>

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
