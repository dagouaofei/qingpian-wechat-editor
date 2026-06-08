"use client";

import { useMemo, useState, useTransition } from "react";

import type { HtmlHarvestActionResult } from "@/server/style-admin/actions/html-harvest-candidate";
import type { HtmlHarvestPreviewActionResult } from "@/server/style-admin/actions/html-harvest-candidate";

import {
  createHarvestCandidateAction,
  previewHarvestCandidateAction,
} from "./actions";

const SOURCE_PLATFORMS = [
  { value: "wechat_mp", label: "WeChat MP" },
  { value: "135_editor", label: "135 Editor" },
  { value: "xiumi", label: "Xiumi" },
  { value: "dom_html", label: "DOM HTML" },
  { value: "unknown", label: "Unknown" },
] as const;

type HarvestFormProps = {
  writeEnabled: boolean;
  writeProtectionMessage: string;
  compatibilityMode: {
    mode: "off" | "report" | "enforce";
    label: string;
    hint: string;
    envVar: string;
    publicEnvVar: string;
    legacyEnvVar: string;
    defaultMode: string;
  };
};

export function HarvestForm({
  writeEnabled,
  writeProtectionMessage,
  compatibilityMode,
}: HarvestFormProps) {
  const [sourceLabel, setSourceLabel] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourcePlatform, setSourcePlatform] = useState<string>("unknown");
  const [notes, setNotes] = useState("");
  const [rawHtml, setRawHtml] = useState("");
  const [blockType, setBlockType] = useState<"" | "heading" | "info_card">("");
  const [preview, setPreview] = useState<HtmlHarvestPreviewActionResult | null>(null);
  const [submitResult, setSubmitResult] = useState<HtmlHarvestActionResult | null>(null);
  const [isPreviewPending, startPreview] = useTransition();
  const [isSubmitPending, startSubmit] = useTransition();

  const detectedBlockType =
    preview && (preview.ok || preview.detectedBlockType) ? preview.detectedBlockType ?? null : null;
  const effectiveBlockType = preview?.ok ? preview.effectiveBlockType : null;
  const compatibilityIssues = preview?.ok ? preview.issues : preview?.issues ?? [];
  const lossReport = preview?.ok ? preview.lossReport : preview?.lossReport ?? [];
  const sanitizeLossReport = preview?.ok ? preview.sanitizeLossReport : [];
  const encoderLossReport = preview?.ok ? preview.encoderLossReport : [];
  const compatibilityTransformLossReport = preview?.ok
    ? preview.compatibilityTransformLossReport
    : [];
  const canCreateCandidate = preview?.ok ? preview.canCreateCandidate : false;
  const previewBlockingMessage = preview && !preview.ok ? preview.message : null;

  const distributionSummary = useMemo(
    () => ({
      sourceType: "html_paste",
      sourceCohort: "s10_html_harvest_v1",
      lifecycle: "candidate",
      qualityStatus: "not_checked",
      userSelectable: false,
      defaultEligible: false,
      release1Required: false,
      hidden: false,
      deprecated: false,
    }),
    [],
  );

  function buildInput() {
    return {
      sourceLabel,
      sourceUrl: sourceUrl.trim() || undefined,
      sourcePlatform: sourcePlatform as (typeof SOURCE_PLATFORMS)[number]["value"],
      notes: notes.trim() || undefined,
      rawHtml,
      blockType: blockType || undefined,
    };
  }

  function handlePreview() {
    startPreview(async () => {
      setSubmitResult(null);
      const result = await previewHarvestCandidateAction(buildInput());
      setPreview(result);
    });
  }

  function handleSubmit() {
    if (!writeEnabled) {
      return;
    }
    startSubmit(async () => {
      setSubmitResult(null);
      const result = await createHarvestCandidateAction(buildInput());
      setSubmitResult(result);
    });
  }

  return (
    <div className="space-y-6" data-testid="admin-harvest-form">
      <section
        className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 shadow-sm space-y-2"
        data-testid="harvest-compatibility-mode-banner"
      >
        <h2 className="text-sm font-semibold text-slate-900">
          WeChat Compatibility Mode: {compatibilityMode.label}
        </h2>
        <p className="text-xs text-slate-600">
          <span className="font-medium">{compatibilityMode.mode}:</span> {compatibilityMode.hint}
        </p>
        <p className="text-xs text-slate-500">
          Server env: {compatibilityMode.envVar} (default: {compatibilityMode.defaultMode})
        </p>
        <p className="text-xs text-slate-500">
          Browser Preview/Copy also requires {compatibilityMode.publicEnvVar} to match.
        </p>
        <p className="text-xs text-slate-400">
          Legacy alias: {compatibilityMode.legacyEnvVar}
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-slate-900">Source information</h2>
        <label className="block text-xs text-slate-600">
          sourceLabel *
          <input
            value={sourceLabel}
            onChange={(event) => setSourceLabel(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="135 编辑器粘贴"
            data-testid="harvest-source-label"
          />
        </label>
        <label className="block text-xs text-slate-600">
          sourceUrl
          <input
            value={sourceUrl}
            onChange={(event) => setSourceUrl(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="https://..."
          />
        </label>
        <label className="block text-xs text-slate-600">
          sourcePlatform
          <select
            value={sourcePlatform}
            onChange={(event) => setSourcePlatform(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            {SOURCE_PLATFORMS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs text-slate-600">
          notes
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            rows={2}
          />
        </label>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <h2 className="text-sm font-semibold text-slate-900">HTML input</h2>
        <p className="text-xs text-slate-500">
          Paste HTML only. Scripts are stripped and HTML is not executed. Do not paste secrets.
        </p>
        <textarea
          value={rawHtml}
          onChange={(event) => setRawHtml(event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs"
          rows={12}
          data-testid="harvest-raw-html"
          placeholder="<section>...</section>"
        />
        <button
          type="button"
          onClick={handlePreview}
          disabled={isPreviewPending || !rawHtml.trim()}
          className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-200 disabled:opacity-50"
          data-testid="harvest-preview-button"
        >
          {isPreviewPending ? "Detecting…" : "Detect blockType"}
        </button>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <h2 className="text-sm font-semibold text-slate-900">blockType</h2>
        {detectedBlockType ? (
          <p className="text-sm text-slate-700" data-testid="harvest-detected-block-type">
            Detected blockType: <strong>{detectedBlockType}</strong>
          </p>
        ) : (
          <p className="text-sm text-slate-500">Run detection after pasting HTML.</p>
        )}
        <label className="block text-xs text-slate-600">
          blockType (manual override)
          <select
            value={blockType}
            onChange={(event) =>
              setBlockType(event.target.value as "" | "heading" | "info_card")
            }
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            data-testid="harvest-block-type-select"
          >
            <option value="">Use detected blockType</option>
            <option value="heading">heading</option>
            <option value="info_card">info_card</option>
          </select>
        </label>
        {detectedBlockType === "unknown" && !blockType ? (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Unknown detection — select heading or info_card before creating candidate.
          </p>
        ) : null}
      </section>

      {previewBlockingMessage ? (
        <section
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          data-testid="harvest-preview-blocking"
        >
          {previewBlockingMessage}
        </section>
      ) : null}

      {preview?.ok && preview.guidance ? (
        <section
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          data-testid="harvest-compatibility-guidance"
        >
          {preview.guidance}
        </section>
      ) : null}

      {compatibilityMode.mode !== "off" && compatibilityIssues.length > 0 ? (
        <section
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-2"
          data-testid="harvest-compatibility-issues"
        >
          <h2 className="text-sm font-semibold text-slate-900">Compatibility issues</h2>
          <ul className="space-y-1 text-xs">
            {compatibilityIssues.map((issue, index) => (
              <li
                key={`${issue.code}-${index}`}
                className={
                  issue.severity === "blocking"
                    ? "text-red-800"
                    : issue.severity === "risk"
                      ? "text-amber-800"
                      : "text-slate-700"
                }
              >
                <span className="font-mono">[{issue.severity}]</span> {issue.code}: {issue.message}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {preview?.ok && preview.trace ? (
        <section
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3"
          data-testid="harvest-encoder-trace"
        >
          <h2 className="text-sm font-semibold text-slate-900">Encoder / Decoder trace</h2>
          <dl className="grid gap-2 text-xs md:grid-cols-2">
            <div>
              <dt className="text-slate-500">layoutIntent</dt>
              <dd>{preview.trace.layoutIntent ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">dslVersion</dt>
              <dd>{preview.trace.dslVersion ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">decoderPath</dt>
              <dd>{preview.trace.runtimeTrace.decoderPath}</dd>
            </div>
            <div>
              <dt className="text-slate-500">runtimeSource</dt>
              <dd>{preview.trace.runtimeTrace.runtimeSource}</dd>
            </div>
            <div>
              <dt className="text-slate-500">wechatCompatibilityMode</dt>
              <dd data-testid="harvest-trace-compatibility-mode">
                {preview.trace.wechatCompatibilityMode}
              </dd>
            </div>
          </dl>
          <div>
            <h3 className="text-xs font-semibold text-slate-800">Extracted semantic slots</h3>
            <pre className="mt-1 overflow-x-auto rounded bg-slate-50 p-2 text-xs">
              {JSON.stringify(preview.trace.extractedSlots, null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-800">Style tokens</h3>
            <pre className="mt-1 overflow-x-auto rounded bg-slate-50 p-2 text-xs">
              {JSON.stringify(preview.trace.styleTokens, null, 2)}
            </pre>
          </div>
          <details className="rounded-lg border border-slate-200 p-3">
            <summary className="cursor-pointer text-xs font-medium text-slate-800">
              Variant DSL JSON
            </summary>
            <pre className="mt-2 max-h-64 overflow-auto text-xs text-slate-700">
              {preview.trace.variantDslPreview}
            </pre>
          </details>
          <div className="grid gap-2 text-xs md:grid-cols-2">
            <div data-testid="harvest-decoder-preview-summary">
              <span className="font-semibold">Preview decode:</span> ok=
              {String(preview.trace.decoderPreview.ok)}, length=
              {preview.trace.decoderPreview.outputLength}
            </div>
            <div data-testid="harvest-decoder-copy-summary">
              <span className="font-semibold">Copy decode:</span> ok=
              {String(preview.trace.decoderCopy.ok)}, length=
              {preview.trace.decoderCopy.outputLength}
            </div>
          </div>
        </section>
      ) : null}

      {sanitizeLossReport.length > 0 ? (
        <section
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-2"
          data-testid="harvest-sanitize-loss-report"
        >
          <h2 className="text-sm font-semibold text-slate-900">Sanitize loss</h2>
          <p className="text-xs text-slate-500">Security cleanup only (script, handlers, dangerous URLs).</p>
          <ul className="space-y-1 text-xs text-slate-700">
            {sanitizeLossReport.map((entry, index) => (
              <li key={`sanitize-${entry.code}-${index}`}>
                <span className="font-mono">{entry.code}</span>: {entry.message}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {encoderLossReport.length > 0 ? (
        <section
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-2"
          data-testid="harvest-encoder-loss-report"
        >
          <h2 className="text-sm font-semibold text-slate-900">Encoder loss</h2>
          <p className="text-xs text-slate-500">Fidelity encoding loss — not WeChat compatibility downgrade.</p>
          <ul className="space-y-1 text-xs text-slate-700">
            {encoderLossReport.map((entry, index) => (
              <li key={`encoder-${entry.code}-${index}`}>
                <span className="font-mono">{entry.code}</span>: {entry.message}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {compatibilityTransformLossReport.length > 0 ? (
        <section
          className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 shadow-sm space-y-2"
          data-testid="harvest-compatibility-transform-loss"
        >
          <h2 className="text-sm font-semibold text-slate-900">Compatibility transform loss</h2>
          <p className="text-xs text-slate-500">Enforce-mode downgrade / transform only.</p>
          <ul className="space-y-1 text-xs text-slate-700">
            {compatibilityTransformLossReport.map((entry, index) => (
              <li key={`compat-transform-${entry.code}-${index}`}>
                <span className="font-mono">{entry.code}</span>: {entry.message}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {lossReport.length > 0 &&
      sanitizeLossReport.length === 0 &&
      encoderLossReport.length === 0 &&
      compatibilityTransformLossReport.length === 0 ? (
        <section
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-2"
          data-testid="harvest-loss-report"
        >
          <h2 className="text-sm font-semibold text-slate-900">Loss report</h2>
          <ul className="space-y-1 text-xs text-slate-700">
            {lossReport.map((entry, index) => (
              <li key={`${entry.code}-${index}`}>
                <span className="font-mono">{entry.code}</span>: {entry.message}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {preview?.ok && preview.draftPreview ? (
        <section
          className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 shadow-sm space-y-2"
          data-testid="harvest-draft-summary"
        >
          <h2 className="text-sm font-semibold text-slate-900">Candidate draft summary</h2>
          <dl className="grid gap-2 text-sm md:grid-cols-2">
            <div>
              <dt className="text-slate-500">runtimeVariantId</dt>
              <dd className="font-mono text-xs">{preview.draftPreview.runtimeVariantId}</dd>
            </div>
            <div>
              <dt className="text-slate-500">label</dt>
              <dd>{preview.draftPreview.label}</dd>
            </div>
            <div>
              <dt className="text-slate-500">blockType</dt>
              <dd>{preview.draftPreview.blockType}</dd>
            </div>
            <div>
              <dt className="text-slate-500">styleFamily</dt>
              <dd>{preview.draftPreview.styleFamily}</dd>
            </div>
            <div>
              <dt className="text-slate-500">sourceType</dt>
              <dd>{distributionSummary.sourceType}</dd>
            </div>
            <div>
              <dt className="text-slate-500">sourceCohort</dt>
              <dd>{distributionSummary.sourceCohort}</dd>
            </div>
            <div>
              <dt className="text-slate-500">lifecycle</dt>
              <dd>{distributionSummary.lifecycle}</dd>
            </div>
            <div>
              <dt className="text-slate-500">qualityStatus</dt>
              <dd>{distributionSummary.qualityStatus}</dd>
            </div>
          </dl>
          <p className="text-xs text-slate-600">
            distribution: userSelectable={String(distributionSummary.userSelectable)},
            defaultEligible={String(distributionSummary.defaultEligible)},
            release1Required={String(distributionSummary.release1Required)},
            hidden={String(distributionSummary.hidden)}, deprecated=
            {String(distributionSummary.deprecated)}
          </p>
          <p className="text-xs text-slate-600" data-testid="harvest-can-create-candidate">
            canCreateCandidate={String(canCreateCandidate)}
            {preview.partial ? ", partial=true" : ""}
            {preview.severity ? `, severity=${preview.severity}` : ""}
          </p>
        </section>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <h2 className="text-sm font-semibold text-slate-900">Create candidate</h2>
        {!writeEnabled ? (
          <p className="text-sm text-amber-800">{writeProtectionMessage}</p>
        ) : null}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            isSubmitPending ||
            !writeEnabled ||
            !sourceLabel.trim() ||
            !rawHtml.trim() ||
            (detectedBlockType === "unknown" && !blockType) ||
            !canCreateCandidate ||
            !effectiveBlockType
          }
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          data-testid="harvest-create-button"
        >
          {isSubmitPending ? "Creating…" : "Create HTML harvest candidate"}
        </button>
        {submitResult && !submitResult.ok ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" data-testid="harvest-error">
            {submitResult.message}
          </p>
        ) : null}
      </section>

      <section className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <p>Preview / Copy / Validator: S10-STORY-010</p>
        <p>Promote: S10-STORY-011</p>
      </section>
    </div>
  );
}
