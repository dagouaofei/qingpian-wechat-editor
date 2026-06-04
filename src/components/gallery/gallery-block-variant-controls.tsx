"use client";

import type { BlockType } from "@/core/blocks";
import { resolveMiaopianPresetId } from "@/config/miaopian-preset-bundles";
import { ShellFieldLabel, ShellSelect } from "@/components/ui-shell/primitives";
import {
  blockTypesInArticle,
  variantLabelForId,
  variantPoolForPresetBlock,
} from "@/lib/gallery-block-variants";
import type { GalleryStyleControlState } from "@/lib/gallery-style-controls";
import type { ArticleSampleId } from "@/fixtures/article-samples";
import { articleSampleRawForId } from "@/fixtures/article-samples";
import { parseArticle } from "@/core/article";

const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  title: "Title",
  heading: "Heading",
  lead: "Lead",
  paragraph: "Paragraph",
  divider: "Divider",
  list: "List",
  quote: "Quote",
  highlight: "Highlight",
  info_card: "Info Card",
  cta: "CTA",
  image_placeholder: "Image",
};

export function GalleryBlockVariantControls({
  sampleId,
  value,
  onChange,
}: {
  sampleId: ArticleSampleId;
  value: GalleryStyleControlState;
  onChange: (next: GalleryStyleControlState) => void;
}) {
  const article = parseArticle(articleSampleRawForId(sampleId));
  const presetId = resolveMiaopianPresetId(value.articleStyle);
  const blockTypes = blockTypesInArticle(article);

  return (
    <div
      className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3"
      data-testid="gallery-block-variant-controls"
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
          Block variants
        </p>
        <p className="mt-1 text-xs text-slate-500">
          按 block 类型覆盖 variant；留空则使用样例 / 成稿风格默认。
        </p>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          data-testid="gallery-focus-title-heading"
          checked={value.focusTitleHeading}
          onChange={(event) =>
            onChange({ ...value, focusTitleHeading: event.target.checked })
          }
        />
        仅显示 title / heading（聚焦模式）
      </label>

      {blockTypes.map((blockType) => {
        const pool = variantPoolForPresetBlock(presetId, blockType);
        const selected =
          blockType === "title"
            ? value.titleVariantId || value.blockVariantOverrides.title || ""
            : blockType === "heading"
              ? value.headingVariantId || value.blockVariantOverrides.heading || ""
              : value.blockVariantOverrides[blockType] || "";

        return (
          <label key={blockType} className="block space-y-1.5">
            <ShellFieldLabel>{BLOCK_TYPE_LABELS[blockType]} variant</ShellFieldLabel>
            <ShellSelect
              data-testid={`gallery-variant-select-${blockType}`}
              value={selected}
              onChange={(event) => {
                const variantId = event.target.value;
                const nextOverrides = { ...value.blockVariantOverrides };
                if (variantId) {
                  nextOverrides[blockType] = variantId;
                } else {
                  delete nextOverrides[blockType];
                }
                const next: GalleryStyleControlState = {
                  ...value,
                  blockVariantOverrides: nextOverrides,
                };
                if (blockType === "title") {
                  next.titleVariantId = variantId as GalleryStyleControlState["titleVariantId"];
                }
                if (blockType === "heading") {
                  next.headingVariantId =
                    variantId as GalleryStyleControlState["headingVariantId"];
                }
                onChange(next);
              }}
            >
              <option value="">样例 / 风格默认</option>
              {pool.map((variantId) => (
                <option key={variantId} value={variantId}>
                  {variantLabelForId(variantId)}
                </option>
              ))}
            </ShellSelect>
          </label>
        );
      })}
    </div>
  );
}
