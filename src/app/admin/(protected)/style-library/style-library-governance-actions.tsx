"use client";

import { useState, useTransition } from "react";

import {
  hideFromUserPoolAction,
  markDeprecatedAction,
  restoreFromDeprecatedAction,
  restoreToUserSelectableAction,
  rollbackLastDistributionAction,
} from "./actions";

type GovernanceOperation = {
  id: string;
  label: string;
  description: string;
  submitLabel: string;
  run: (runtimeVariantId: string, reason: string) => ReturnType<typeof hideFromUserPoolAction>;
};

export async function submitGovernanceForm(input: {
  form: HTMLFormElement;
  runtimeVariantId: string;
  run: GovernanceOperation["run"];
}): Promise<ReturnType<typeof hideFromUserPoolAction>> {
  const formData = new FormData(input.form);
  const reason = String(formData.get("reason") ?? "");
  const result = await input.run(input.runtimeVariantId, reason);
  if (result.ok) {
    input.form.reset();
  }
  return result;
}

const GOVERNANCE_OPERATIONS: GovernanceOperation[] = [
  {
    id: "hide-from-pool",
    label: "Hide from user pool",
    description: "Sets hidden=true and userSelectable=false. User-side picker excludes this variant after cache refresh.",
    submitLabel: "Hide from user pool",
    run: hideFromUserPoolAction,
  },
  {
    id: "restore-user-selectable",
    label: "Restore to user-selectable",
    description:
      "Sets userSelectable=true, hidden=false, deprecated=false. Blocked when qualityStatus is copy_fidelity_failed / validator_failed / blocked.",
    submitLabel: "Restore to user-selectable",
    run: restoreToUserSelectableAction,
  },
  {
    id: "mark-deprecated",
    label: "Mark deprecated",
    description: "Sets deprecated=true, hidden=true, userSelectable=false.",
    submitLabel: "Mark deprecated",
    run: markDeprecatedAction,
  },
  {
    id: "restore-from-deprecated",
    label: "Restore from deprecated",
    description: "Sets deprecated=false and hidden=false. Does not auto-enable userSelectable.",
    submitLabel: "Restore from deprecated",
    run: restoreFromDeprecatedAction,
  },
  {
    id: "rollback-distribution",
    label: "Rollback last distribution change",
    description: "Restores distribution fields from the previous admin audit snapshot.",
    submitLabel: "Rollback last distribution change",
    run: rollbackLastDistributionAction,
  },
];

export function StyleLibraryGovernanceActions({
  runtimeVariantId,
  writeEnabled,
  writeProtectionMessage,
}: {
  runtimeVariantId: string;
  writeEnabled: boolean;
  writeProtectionMessage: string;
}) {
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; message: string } | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();

  return (
    <section
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      data-testid="admin-style-library-governance-actions"
    >
      <h2 className="text-sm font-semibold text-slate-900">Governance write actions</h2>
      <p className="mt-1 text-xs text-slate-500">{writeProtectionMessage}</p>
      <p className="mt-2 text-xs text-amber-800">
        User-side pool may take up to 1–5 minutes to refresh on other instances; local dev invalidates
        cache immediately after a successful write.
      </p>

      {!writeEnabled ? (
        <p
          className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-950"
          data-testid="admin-write-disabled-notice"
        >
          Write actions are disabled in this environment. Admin login is still required; set
          STYLE_ADMIN_WRITE_ENABLED=true only for controlled staging or production writes.
        </p>
      ) : null}

      {feedback ? (
        <p
          className={`mt-3 rounded-lg px-3 py-2 text-sm ${
            feedback.kind === "success"
              ? "bg-emerald-50 text-emerald-900"
              : "bg-rose-50 text-rose-900"
          }`}
          data-testid={`admin-governance-feedback-${feedback.kind}`}
        >
          {feedback.message}
        </p>
      ) : null}

      <div className="mt-4 space-y-4">
        {GOVERNANCE_OPERATIONS.map((operation) => (
          <form
            key={operation.id}
            className="rounded-lg border border-slate-100 p-3"
            data-testid={`admin-governance-form-${operation.id}`}
            onSubmit={(event) => {
              event.preventDefault();
              if (!writeEnabled || isPending) {
                return;
              }
              const form = event.currentTarget;
              startTransition(async () => {
                const result = await submitGovernanceForm({
                  form,
                  runtimeVariantId,
                  run: operation.run,
                });
                if (result.ok) {
                  setFeedback({
                    kind: "success",
                    message: `${operation.label} succeeded (cacheVersion=${result.distribution.cacheVersion}).`,
                  });
                } else {
                  setFeedback({
                    kind: "error",
                    message: result.message,
                  });
                }
              });
            }}
          >
            <h3 className="text-sm font-medium text-slate-900">{operation.label}</h3>
            <p className="mt-1 text-xs text-slate-500">{operation.description}</p>
            <label className="mt-3 block text-xs text-slate-600">
              reason (required)
              <input
                name="reason"
                required
                disabled={!writeEnabled || isPending}
                className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                placeholder="manual local test hide"
              />
            </label>
            <button
              type="submit"
              disabled={!writeEnabled || isPending}
              className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              data-testid={`admin-governance-submit-${operation.id}`}
            >
              {isPending ? "Working…" : operation.submitLabel}
            </button>
          </form>
        ))}
      </div>
    </section>
  );
}
