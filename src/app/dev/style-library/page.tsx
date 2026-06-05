import { StyleLibraryAdminShell } from "./style-library-admin-shell";
import { buildStyleLibraryAdminViewModel } from "./style-library-view-model";

export default function StyleLibraryAdminPage() {
  const viewModel = buildStyleLibraryAdminViewModel();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">
          Style Library Admin Shell
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Sprint 9 · S9-STORY-003 — Read-only Style Library v0 browser at{" "}
          <code className="rounded bg-slate-100 px-1">/dev/style-library</code>
          . Data from{" "}
          <code className="rounded bg-slate-100 px-1">@/core/style-library</code>
          ; no write operations.
        </p>
      </header>
      <StyleLibraryAdminShell viewModel={viewModel} />
    </main>
  );
}
