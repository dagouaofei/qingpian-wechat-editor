import { PreviewBlockView } from "@/components/preview/article-preview-panel";
import type { SerializedPreviewBlock } from "@/server/generation/generate-flow-types";

type Props = {
  previewBlock: SerializedPreviewBlock | null;
  fallbackText: string;
};

export function StyleLibraryInspectionPreviewShell({
  previewBlock,
  fallbackText,
}: Props) {
  if (previewBlock?.ok && previewBlock.output) {
    return (
      <div
        className="rounded-lg border border-slate-200 bg-white p-3"
        data-testid="style-library-inspection-preview-shell"
      >
        <PreviewBlockView block={previewBlock} />
      </div>
    );
  }

  return (
    <p className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-800">
      {fallbackText}
    </p>
  );
}
