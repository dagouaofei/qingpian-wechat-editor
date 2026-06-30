import { redirect } from "next/navigation";

import {
  getCurrentStyleAdmin,
  isStyleAdminAuthConfigured,
  sanitizeAdminNextPath,
} from "@/server/style-admin/auth";

import { AdminLoginForm } from "./admin-login-form";

type PageProps = {
  searchParams: Promise<{
    next?: string;
    error?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const nextPath = sanitizeAdminNextPath(params.next);

  if (isStyleAdminAuthConfigured()) {
    const admin = await getCurrentStyleAdmin();
    if (admin) {
      redirect(nextPath);
    }
  }

  const configError =
    params.error === "auth_not_configured" || !isStyleAdminAuthConfigured()
      ? "Configure STYLE_ADMIN_USERNAME, STYLE_ADMIN_PASSWORD_HASH, and STYLE_ADMIN_SESSION_SECRET in .env.local."
      : null;

  const loginError =
    params.error === "invalid_credentials"
      ? "Invalid username or password."
      : null;

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4 py-12">
      <div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Style Admin Login</h1>
        <p className="mt-2 text-sm text-slate-600">
          Single-admin access for <code>/admin/*</code> pages and write actions.
        </p>
        {configError ? (
          <p
            className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-950"
            data-testid="admin-login-config-error"
          >
            {configError}
          </p>
        ) : null}
        <div className="mt-6">
          <AdminLoginForm nextPath={nextPath} errorMessage={loginError} />
        </div>
      </div>
    </main>
  );
}
