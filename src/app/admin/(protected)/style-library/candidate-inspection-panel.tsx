"use client";

import { useState, useTransition } from "react";

import { StyleLibraryInspectionPreviewShell } from "@/app/dev/style-library/style-library-inspection-preview";
import type { CandidateInspectionPanelViewModel } from "./candidate-inspection-view-model";
import {
  addManualPasteQaEvidenceFormAction,
  runCandidateInspectionFormAction,
} from "./[runtimeVariantId]/inspection-actions";

type CandidateInspectionPanelProps = {
  runtimeVariantId: string;
  qualityStatus: string;
  inspection: CandidateInspectionPanelViewModel;
  writeEnabled: boolean;
  writeProtectionMessage: string;
};

export function CandidateInspectionPanel({
  runtimeVariantId,
  qualityStatus,
  inspection,
  writeEnabled,
  writeProtectionMessage,
}: CandidateInspectionPanelProps) {
  const [runResult, setRunResult] = useState<string | null>(null);
  const [evidenceResult, setEvidenceResult] = useState<string | null>(null);
  const [sourceLabel, setSourceLabel] = useState("Manual Paste QA");
  const [notes, setNotes] = useState("");
  const [pasteQaStatus, setPasteQaStatus] = useState<"not_run" | "pass" | "failed">("pass");
  const [isRunPending, startRun] = useTransition();
  const [isEvidencePending, startEvidence] = useTransition();

  const qualityBadgeClass =
    qualityStatus === "validator_failed" || qualityStatus === "copy_fidelity_failed"
      ? "bg-rose-100 text-rose-900"
      : qualityStatus === "validator_pass" || qualityStatus === "paste_qa_pass"
        ? "bg-emerald-100 text-emerald-900"
        : "bg-amber-100 text-amber-900";

  function handleRunInspection() {
    if (!writeEnabled) return;
    startRun(async () => {
      setRunResult(null);
      const result = await runCandidateInspectionFormAction(runtimeVariantId);
      if (!result.ok) {
        setRunResult(result.message);
        return;
      }
      setRunResult(
        `Inspection complete · qualityStatus ${result.previousQualityStatus} → ${result.qualityStatus}`,
      );
    });
  }

  function handleAddEvidence() {
    if (!writeEnabled) return;
    startEvidence(async () => {
      setEvidenceResult(null);
      const result = await addManualPasteQaEvidenceFormAction({
        runtimeVariantId,
        sourceLabel,
        notes: notes.trim() || undefined,
        status: pasteQaStatus,
      });
      if (!result.ok) {
        setEvidenceResult(result.message);
        return;
      }
      setEvidenceResult(`Evidence saved · qualityStatus=${result.qualityStatus}`);
    });
  }

  return (
    <section
      className="space-y-4 rounded-xl border border-indigo-100 bg-indigo-50/30 p-4 shadow-sm"
      data-testid="admin-candidate-inspection-panel"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Candidate Inspection</h2>
          <p className="mt-1 text-xs text-slate-600">
            Inspection required before promote · Promote: S10-STORY-011
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${qualityBadgeClass}`}>
          qualityStatus: {qualityStatus}
        </span>
      </div>

      {!inspection.supported ? (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {inspection.unsupportedReason ??
            "Inspection for this blockType is not supported in S10-STORY-010."}
        </p>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
              <h3 className="font-medium text-slate-900">Preview inspection</h3>
              <p className="mt-1 text-xs text-slate-500">Sample: {inspection.sampleText}</p>
              <p className="mt-2">
                status: {inspection.previewOk ? "ok" : "error"}
                {inspection.usedAdminFallback ? " · admin fallback path" : ""}
              </p>
              {inspection.previewIssues.length > 0 ? (
                <ul className="mt-2 list-disc pl-4 text-xs text-rose-700">
                  {inspection.previewIssues.map((issue) => (
                    <li key={issue}>{issue}</li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-3">
                <StyleLibraryInspectionPreviewShell
                  previewBlock={inspection.previewBlock}
                  fallbackText="Preview inspection failed"
                />
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
              <h3 className="font-medium text-slate-900">Copy HTML inspection</h3>
              <p className="mt-2">status: {inspection.copyOk ? "ok" : "error"}</p>
              {inspection.copyHtmlSnippet ? (
                <pre className="mt-2 max-h-40 overflow-auto rounded bg-slate-50 p-2 text-xs">
                  {inspection.copyHtmlSnippet}
                </pre>
              ) : null}
              {inspection.copyTextPlain ? (
                <p className="mt-2 text-xs text-slate-500">
                  text/plain: {inspection.copyTextPlain}
                </p>
              ) : null}
              {inspection.copyIssues.length > 0 ? (
                <ul className="mt-2 list-disc pl-4 text-xs text-rose-700">
                  {inspection.copyIssues.map((issue) => (
                    <li key={issue}>{issue}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
            <h3 className="font-medium text-slate-900">Validator (dry-run)</h3>
            <p className="mt-1">
              status: {inspection.validatorStatus} · valid: {String(inspection.validatorValid)} ·
              issues: {inspection.validatorIssueCount}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              resolved qualityStatus if Run now: {inspection.resolvedQualityStatus}
            </p>
          </div>
        </>
      )}

      <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm space-y-3">
        <h3 className="font-medium text-slate-900">Run Preview / Copy / Validator</h3>
        {!writeEnabled ? (
          <p className="text-amber-800">{writeProtectionMessage}</p>
        ) : null}
        <button
          type="button"
          onClick={handleRunInspection}
          disabled={isRunPending || !writeEnabled || !inspection.supported}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          data-testid="admin-run-candidate-inspection-button"
        >
          {isRunPending ? "Running…" : "Run Preview / Copy / Validator"}
        </button>
        {runResult ? <p className="text-xs text-slate-700">{runResult}</p> : null}
        <p className="text-xs text-slate-500">
          rawHtml source: {inspection.hasRawHtml ? "present (escaped in DB)" : "none"}
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm space-y-3">
        <h3 className="font-medium text-slate-900">Add manual Paste QA evidence</h3>
        <label className="block text-xs text-slate-600">
          sourceLabel
          <input
            value={sourceLabel}
            onChange={(event) => setSourceLabel(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
          />
        </label>
        <label className="block text-xs text-slate-600">
          status
          <select
            value={pasteQaStatus}
            onChange={(event) =>
              setPasteQaStatus(event.target.value as "not_run" | "pass" | "failed")
            }
            className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
          >
            <option value="not_run">not_run</option>
            <option value="pass">pass</option>
            <option value="failed">failed</option>
          </select>
        </label>
        <label className="block text-xs text-slate-600">
          notes
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
            rows={2}
          />
        </label>
        <button
          type="button"
          onClick={handleAddEvidence}
          disabled={isEvidencePending || !writeEnabled || !sourceLabel.trim()}
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-50"
          data-testid="admin-add-paste-qa-evidence-button"
        >
          {isEvidencePending ? "Saving…" : "Add manual Paste QA evidence"}
        </button>
        {evidenceResult ? <p className="text-xs text-slate-700">{evidenceResult}</p> : null}
        <p className="text-xs text-slate-500">ossKey: null (OSS upload deferred)</p>
      </div>
    </section>
  );
}
