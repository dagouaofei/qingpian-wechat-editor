"use client";

import { useState, useTransition } from "react";

import { loginAdminAction, type AdminLoginState } from "./actions";

export function AdminLoginForm({ nextPath }: { nextPath: string }) {
  const [feedback, setFeedback] = useState<AdminLoginState | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      data-testid="admin-login-form"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const username = String(formData.get("username") ?? "");
        const password = String(formData.get("password") ?? "");

        startTransition(async () => {
          const result = await loginAdminAction({
            username,
            password,
            next: nextPath,
          });
          if (!result.ok) {
            setFeedback(result);
          }
        });
      }}
    >
      <label className="block text-sm text-slate-700">
        Username
        <input
          name="username"
          required
          autoComplete="username"
          disabled={isPending}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
        />
      </label>
      <label className="block text-sm text-slate-700">
        Password
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          disabled={isPending}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
        />
      </label>
      {feedback && !feedback.ok ? (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-900" data-testid="admin-login-error">
          {feedback.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-slate-300"
        data-testid="admin-login-submit"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
