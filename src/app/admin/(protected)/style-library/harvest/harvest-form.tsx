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
};

export function HarvestForm({ writeEnabled, writeProtectionMessage }: HarvestFormProps) {
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

  const detectedBlockType = preview?.ok ? preview.detectedBlockType : null;
  const effectiveBlockType = preview?.ok ? preview.effectiveBlockType : null;

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

      {preview?.ok && effectiveBlockType ? (
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
            (detectedBlockType === "unknown" && !blockType)
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
