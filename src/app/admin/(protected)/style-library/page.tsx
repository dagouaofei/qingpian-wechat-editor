import { StyleLibraryAdminListShell } from "./style-library-admin-shell";
import { parseAdminVariantListFilter } from "./style-library-admin-filters";
import type { StyleLibraryAdminSearchParams } from "./style-library-admin-filters";
import { buildStyleLibraryAdminListViewModel } from "./style-library-admin-view-model";

type PageProps = {
  searchParams: Promise<StyleLibraryAdminSearchParams>;
};

export default async function AdminStyleLibraryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = parseAdminVariantListFilter(params);
  const viewModel = await buildStyleLibraryAdminListViewModel(filters);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <StyleLibraryAdminListShell viewModel={viewModel} />
    </main>
  );
}
