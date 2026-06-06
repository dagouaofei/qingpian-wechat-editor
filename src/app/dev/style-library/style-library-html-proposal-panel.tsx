"use client";

import { useMemo, useState } from "react";

import type { BlockType } from "@/core/blocks";

import {
  buildHtmlProposalDisplay,
  getHtmlProposalBlockTypeOptions,
  getHtmlProposalPanelCopy,
  type HtmlProposalDisplay,
} from "./style-library-html-proposal-view-model";
import { createHtmlCandidateProposal } from "@/core/style-library";
import type { StyleLibraryLocale } from "./style-library-i18n";

type Props = {
  locale: StyleLibraryLocale;
};

const SAMPLE_HEADING_HTML = `<p style="margin:0 0 6px"><span style="display:inline-block;background-color:#6c5ce7;color:#ffffff;font-size:12px;font-weight:700;padding:2px 8px">CHAPTER 01</span></p><h3 style="margin:0;font-size:18px;font-weight:700;color:#333333">示例章节标题</h3>`;

const SAMPLE_INFO_CARD_HTML = `<section style="margin:16px 0;padding:12px 14px;background-color:#eef5ff;border-left:4px solid #2563eb"><p style="margin:0;font-size:14px;color:#1e3a5f"><strong>阅读路径</strong> · 先读结论，再看细节。</p></section>`;

export function StyleLibraryHtmlProposalPanel({ locale }: Props) {
  const copy = getHtmlProposalPanelCopy(locale);
  const blockTypeOptions = getHtmlProposalBlockTypeOptions(locale);
  const [sourceHtml, setSourceHtml] = useState("");
  const [blockType, setBlockType] = useState<BlockType>("heading");
  const [label, setLabel] = useState("");
  const [proposalDisplay, setProposalDisplay] = useState<HtmlProposalDisplay | null>(null);

  const sampleHtml = useMemo(
    () => (blockType === "info_card" ? SAMPLE_INFO_CARD_HTML : SAMPLE_HEADING_HTML),
    [blockType],
  );

  function handleGenerate() {
    if (!sourceHtml.trim()) {
      setProposalDisplay(null);
      return;
    }
    const proposal = createHtmlCandidateProposal({
      sourceHtml,
      blockType,
      label: label.trim() || undefined,
    });
    setProposalDisplay(buildHtmlProposalDisplay(proposal, locale));
  }

  return (
    <section
      className="space-y-4 rounded-xl border border-teal-200 bg-teal-50/30 p-6"
      data-testid="style-library-html-proposal-panel"
    >
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-teal-900">
          {copy.sectionTitle}
        </h2>
        <p className="mt-1 text-sm text-teal-800">{copy.sectionHint}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700" htmlFor="html-proposal-input">
            {copy.htmlInputLabel}
          </label>
          <textarea
            id="html-proposal-input"
            className="min-h-[160px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-800"
            value={sourceHtml}
            onChange={(event) => setSourceHtml(event.target.value)}
            placeholder={sampleHtml}
            data-testid="style-library-html-proposal-input"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-600" htmlFor="html-proposal-block-type">
                {copy.blockTypeLabel}
              </label>
              <select
                id="html-proposal-block-type"
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
                value={blockType}
                onChange={(event) => setBlockType(event.target.value as BlockType)}
                data-testid="style-library-html-proposal-block-type"
              >
                {blockTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600" htmlFor="html-proposal-label">
                {copy.labelInputLabel}
              </label>
              <input
                id="html-proposal-label"
                type="text"
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                data-testid="style-library-html-proposal-label"
              />
            </div>
          </div>
          <button
            type="button"
            className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
            onClick={handleGenerate}
            data-testid="style-library-html-proposal-generate"
          >
            {copy.generateButton}
          </button>
        </div>

        <div
          className="rounded-lg border border-slate-200 bg-white p-4"
          data-testid="style-library-html-proposal-preview"
        >
          {!proposalDisplay ? (
            <p className="text-sm text-slate-500">{copy.noProposalYet}</p>
          ) : (
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {copy.proposalPreviewTitle}
                </p>
                <dl className="mt-2 space-y-1 font-mono text-xs">
                  <div>
                    proposalId: {proposalDisplay.proposalId}
                  </div>
                  <div>candidateVariantId: {proposalDisplay.candidateVariantId}</div>
                  <div>blockType: {proposalDisplay.blockType}</div>
                  <div>lifecycle: candidate</div>
                  <div>{proposalDisplay.distributionSummary}</div>
                </dl>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {copy.extractedFeaturesTitle}
                </p>
                {proposalDisplay.featureRows.length === 0 ? (
                  <p className="mt-1 text-xs text-amber-700">{copy.emptyHtmlHint}</p>
                ) : (
                  <ul className="mt-1 space-y-0.5 font-mono text-xs">
                    {proposalDisplay.featureRows.map((row) => (
                      <li key={`${row.key}-${row.value}`}>
                        {row.key}: {row.value}
                      </li>
                    ))}
                  </ul>
                )}
                {proposalDisplay.extractionWarnings.length > 0 ? (
                  <ul className="mt-2 space-y-0.5 text-xs text-amber-800">
                    {proposalDisplay.extractionWarnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                ) : null}
                <p className="mt-2 text-xs text-slate-700">{proposalDisplay.copySafeRiskSummary}</p>
              </div>

              <div data-testid="style-library-html-proposal-inspection">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {copy.inspectionTitle}
                </p>
                <dl className="mt-2 space-y-1 text-xs">
                  <div>copyStatus: {proposalDisplay.inspectionCopyStatus}</div>
                  <div>validator: {proposalDisplay.validatorStatus}</div>
                  <div>{proposalDisplay.operatorConclusion}</div>
                  <div>{proposalDisplay.promoteReadinessHint}</div>
                  <div>{proposalDisplay.previewNote}</div>
                </dl>
              </div>

              <details>
                <summary className="cursor-pointer text-xs font-medium text-teal-800">
                  {copy.evidenceDraftTitle}
                </summary>
                <pre className="mt-2 overflow-x-auto rounded border border-slate-100 bg-slate-50 p-2 font-mono text-[10px]">
                  {proposalDisplay.evidenceDraftLines.join("\n")}
                </pre>
              </details>

              <details>
                <summary className="cursor-pointer text-xs font-medium text-teal-800">
                  {copy.cursorPatchTitle}
                </summary>
                <pre
                  className="mt-2 overflow-x-auto rounded border border-slate-100 bg-slate-50 p-2 font-mono text-[10px] whitespace-pre-wrap"
                  data-testid="style-library-html-proposal-cursor-patch"
                >
                  {proposalDisplay.cursorPatchSummary}
                </pre>
              </details>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {copy.nextStepsTitle}
                </p>
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-slate-700">
                  {proposalDisplay.nextSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
