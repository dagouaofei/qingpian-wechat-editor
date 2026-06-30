import {
  formatAppVersionForAdminFooter,
  getAppVersionInfo,
} from "@/server/version/app-version";

export function AdminVersionFooter() {
  const version = getAppVersionInfo();

  return (
    <footer
      className="pointer-events-none fixed bottom-3 right-4 z-50 rounded-md border border-slate-200 bg-white/90 px-3 py-1.5 font-mono text-xs text-slate-500 shadow-sm backdrop-blur-sm"
      data-testid="admin-version-footer"
      aria-label="Deployment version"
    >
      {formatAppVersionForAdminFooter(version)}
    </footer>
  );
}
