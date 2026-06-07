"use client";

type Props = {
  html: string;
  variantId?: string;
  blockType?: string;
  runtimeTrace?: {
    runtimeSource: string;
    selectedRuntimeVariantId: string;
    renderedByVariantId: string;
    fallbackUsed: boolean;
    fallbackReason?: string | null;
  };
};

export function DslTreeHtmlPreviewBlock({ html, variantId, blockType, runtimeTrace }: Props) {
  return (
    <section
      data-variant-id={variantId}
      data-block-type={blockType}
      data-render-path="dsl_tree_html"
      data-runtime-source={runtimeTrace?.runtimeSource}
      data-selected-runtime-variant-id={runtimeTrace?.selectedRuntimeVariantId}
      data-rendered-by-variant-id={runtimeTrace?.renderedByVariantId}
      data-fallback-used={runtimeTrace ? String(runtimeTrace.fallbackUsed) : undefined}
      data-fallback-reason={runtimeTrace?.fallbackReason ?? undefined}
      className="dsl-tree-html-preview"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
