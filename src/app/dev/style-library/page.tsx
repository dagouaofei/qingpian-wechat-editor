import { StyleLibraryAdminShell } from "./style-library-admin-shell";
import { buildStyleLibraryAdminViewModel } from "./style-library-view-model";

export default function StyleLibraryAdminPage() {
  const viewModel = buildStyleLibraryAdminViewModel();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <StyleLibraryAdminShell viewModel={viewModel} />
    </main>
  );
}
