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
    slotSubstitutionPath?: string | null;
    substitutedSlot?: string | null;
    decorativeSlotsPreserved?: string[];
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
      data-slot-substitution-path={runtimeTrace?.slotSubstitutionPath ?? undefined}
      data-substituted-slot={runtimeTrace?.substitutedSlot ?? undefined}
      data-decorative-slots-preserved={
        runtimeTrace?.decorativeSlotsPreserved?.length
          ? runtimeTrace.decorativeSlotsPreserved.join(",")
          : undefined
      }
      className="dsl-tree-html-preview"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
