"use client";

export function AdminLoginForm({
  nextPath,
  errorMessage,
}: {
  nextPath: string;
  errorMessage?: string | null;
}) {
  return (
    <form
      className="space-y-4"
      data-testid="admin-login-form"
      method="POST"
      action="/api/admin/login"
    >
      <input type="hidden" name="next" value={nextPath} />
      <label className="block text-sm text-slate-700">
        Username
        <input
          name="username"
          required
          autoComplete="username"
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
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
        />
      </label>
      {errorMessage ? (
        <p
          className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-900"
          data-testid="admin-login-error"
        >
          {errorMessage}
        </p>
      ) : null}
      <button
        type="submit"
        className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-slate-300"
        data-testid="admin-login-submit"
      >
        Sign in
      </button>
    </form>
  );
}
