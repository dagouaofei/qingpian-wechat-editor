import { StyleLibraryAdminShell } from "./style-library-admin-shell";
import {
  resolveStyleLibraryLocale,
} from "./style-library-i18n";
import { buildStyleLibraryAdminViewModel } from "./style-library-view-model";

type PageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export default async function StyleLibraryAdminPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const locale = resolveStyleLibraryLocale(params.lang);
  const viewModel = buildStyleLibraryAdminViewModel(undefined, locale);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8" lang={locale}>
      <StyleLibraryAdminShell viewModel={viewModel} />
    </main>
  );
}
