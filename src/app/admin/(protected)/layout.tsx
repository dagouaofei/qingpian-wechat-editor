import { redirect } from "next/navigation";

import { AdminVersionFooter } from "@/components/admin/admin-version-footer";
import {
  getAdminLoginRedirectPath,
  getCurrentStyleAdmin,
  isStyleAdminAuthConfigured,
  STYLE_ADMIN_AUTH_ENABLED_MESSAGE,
} from "@/server/style-admin/auth";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isStyleAdminAuthConfigured()) {
    redirect("/admin/login?error=auth_not_configured");
  }

  const admin = await getCurrentStyleAdmin();
  if (!admin) {
    const next = await getAdminLoginRedirectPath();
    redirect(`/admin/login?next=${encodeURIComponent(next)}`);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header
        className="border-b border-slate-200 bg-white"
        data-testid="admin-protected-header"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
              Sprint 10 · S10-STORY-008
            </p>
            <p className="text-sm text-slate-700" data-testid="admin-auth-enabled-message">
              {STYLE_ADMIN_AUTH_ENABLED_MESSAGE}
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-700">
            <span data-testid="admin-current-user">
              Signed in as <strong>{admin.username}</strong>
            </span>
            <form method="POST" action="/api/admin/logout">
              <button
                type="submit"
                className="rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-slate-50"
                data-testid="admin-logout-button"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>
      {children}
      <AdminVersionFooter />
    </div>
  );
}
