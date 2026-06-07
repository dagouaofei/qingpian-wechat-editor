import { StyleLibraryAdminDetailShell } from "../style-library-admin-shell";
import { buildStyleLibraryAdminDetailViewModel } from "../style-library-admin-view-model";

type PageProps = {
  params: Promise<{ runtimeVariantId: string }>;
};

export default async function AdminStyleLibraryDetailPage({ params }: PageProps) {
  const { runtimeVariantId } = await params;
  const decodedId = decodeURIComponent(runtimeVariantId);
  const viewModel = await buildStyleLibraryAdminDetailViewModel(decodedId);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <StyleLibraryAdminDetailShell viewModel={viewModel} />
    </main>
  );
}
