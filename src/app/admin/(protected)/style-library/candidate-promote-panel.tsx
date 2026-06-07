"use client";

import { useState, useTransition } from "react";

import type { CandidatePromotePanelViewModel } from "./candidate-promote-view-model";
import { promoteCandidateFormAction } from "./[runtimeVariantId]/promote-actions";

type CandidatePromotePanelProps = {
  runtimeVariantId: string;
  promote: CandidatePromotePanelViewModel;
  writeEnabled: boolean;
  writeProtectionMessage: string;
};

export function CandidatePromotePanel({
  runtimeVariantId,
  promote,
  writeEnabled,
  writeProtectionMessage,
}: CandidatePromotePanelProps) {
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; message: string } | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();

  return (
    <section
      className="space-y-4 rounded-xl border border-emerald-100 bg-emerald-50/30 p-4 shadow-sm"
      data-testid="admin-candidate-promote-panel"
    >
      <div>
        <h2 className="text-sm font-semibold text-slate-900">Promote to user-selectable</h2>
        <p className="mt-1 text-xs text-slate-600">
          Requires paste_qa_pass · sets userSelectable=true only · does not change defaultEligible,
          release1Required, or default preset.
        </p>
      </div>

      <dl className="grid gap-2 text-sm md:grid-cols-3" data-testid="admin-promote-readiness">
        <div>
          <dt className="text-slate-500">readiness</dt>
          <dd>{promote.readinessOk ? "ok" : "blocked"}</dd>
        </div>
        <div>
          <dt className="text-slate-500">previewReady</dt>
          <dd>{String(promote.previewReady)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">copyReady</dt>
          <dd>{String(promote.copyReady)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">compatibilityStatus</dt>
          <dd data-testid="admin-promote-compatibility-status">{promote.compatibilityStatus}</dd>
        </div>
        <div>
          <dt className="text-slate-500">compatibilityReady</dt>
          <dd>{String(promote.compatibilityReady)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">runtimeSource</dt>
          <dd>{promote.runtimeSource ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-slate-500">decoderPath</dt>
          <dd>{promote.decoderPath ?? "—"}</dd>
        </div>
      </dl>

      {promote.readinessIssues.length > 0 ? (
        <ul className="space-y-1 text-xs text-amber-900">
          {promote.readinessIssues.map((issue) => (
            <li key={issue} className="rounded-lg bg-amber-50 px-3 py-2">
              {issue}
            </li>
          ))}
        </ul>
      ) : null}

      <dl className="grid gap-2 text-sm md:grid-cols-3">
        <div>
          <dt className="text-slate-500">lifecycle</dt>
          <dd>{promote.lifecycle}</dd>
        </div>
        <div>
          <dt className="text-slate-500">qualityStatus</dt>
          <dd>{promote.qualityStatus ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-slate-500">sourceType</dt>
          <dd>{promote.sourceType ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-slate-500">userSelectable</dt>
          <dd>{String(promote.distribution.userSelectable)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">defaultEligible</dt>
          <dd>{String(promote.distribution.defaultEligible)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">release1Required</dt>
          <dd>{String(promote.distribution.release1Required)}</dd>
        </div>
      </dl>

      {promote.alreadyPromoted ? (
        <p
          className="rounded-lg bg-emerald-100 px-3 py-2 text-sm text-emerald-900"
          data-testid="admin-promote-already-promoted"
        >
          Variant is user-selectable. Hide / Restore / Rollback remain available in Governance
          actions below.
        </p>
      ) : promote.eligible ? (
        <p
          className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900"
          data-testid="admin-promote-eligible"
        >
          Eligible for promote to user-selectable.
        </p>
      ) : (
        <ul className="space-y-1 text-sm text-rose-900" data-testid="admin-promote-blocked-reasons">
          {promote.blockedReasons.map((reason) => (
            <li key={reason} className="rounded-lg bg-rose-50 px-3 py-2">
              {reason}
            </li>
          ))}
        </ul>
      )}

      {!writeEnabled ? (
        <p className="text-xs text-amber-800">{writeProtectionMessage}</p>
      ) : null}

      {feedback ? (
        <p
          className={`rounded-lg px-3 py-2 text-sm ${
            feedback.kind === "success"
              ? "bg-emerald-50 text-emerald-900"
              : "bg-rose-50 text-rose-900"
          }`}
          data-testid={`admin-promote-feedback-${feedback.kind}`}
        >
          {feedback.message}
        </p>
      ) : null}

      {!promote.alreadyPromoted ? (
        <form
          className="rounded-lg border border-slate-200 bg-white p-3"
          data-testid="admin-promote-form"
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            if (!writeEnabled || isPending || !promote.eligible) {
              return;
            }
            const formData = new FormData(form);
            const reason = String(formData.get("reason") ?? "");
            startTransition(async () => {
              setFeedback(null);
              const result = await promoteCandidateFormAction({
                runtimeVariantId,
                reason,
              });
              if (result.ok) {
                setFeedback({
                  kind: "success",
                  message:
                    "Promoted to user-selectable · userSelectable=true · defaultEligible=false · release1Required=false",
                });
                form.reset();
              } else {
                setFeedback({
                  kind: "error",
                  message: result.message,
                });
              }
            });
          }}
        >
          <label className="block text-xs text-slate-600">
            reason (required)
            <input
              name="reason"
              required
              disabled={!writeEnabled || isPending || !promote.eligible}
              className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
              placeholder="manual local promote test"
            />
          </label>
          <button
            type="submit"
            disabled={!writeEnabled || isPending || !promote.eligible}
            className="mt-3 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            data-testid="admin-promote-submit"
          >
            {isPending ? "Promoting…" : "Promote to user-selectable"}
          </button>
        </form>
      ) : null}

      {promote.promoteRecords.length > 0 ? (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Promote records
          </h3>
          <ul className="mt-2 space-y-2 text-sm">
            {promote.promoteRecords.map((record) => (
              <li key={record.id} className="rounded-lg bg-white px-3 py-2">
                {record.fromLifecycle} → {record.toLifecycle} · {record.reason} · {record.actor} ·{" "}
                {record.createdAt}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
