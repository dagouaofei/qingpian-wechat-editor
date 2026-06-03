"use client";

import {
  GALLERY_HEADING_VARIANT_IDS,
  GALLERY_TITLE_VARIANT_IDS,
  type GalleryHeadingVariantId,
  type GalleryTitleVariantId,
} from "@/lib/gallery-title-heading";
import type { GalleryStyleControlState } from "@/lib/gallery-style-controls";
import { ShellFieldLabel, ShellSelect } from "@/components/ui-shell/primitives";

const TITLE_LABELS: Record<GalleryTitleVariantId, string> = {
  title_plain_minimal: "Plain 居中/左对齐",
  title_left_bar_classic: "Left bar 经典",
  title_bottom_line_editorial: "Bottom line 编辑",
};

const HEADING_LABELS: Record<GalleryHeadingVariantId, string> = {
  heading_plain_minimal: "Plain 小标题",
  heading_numbered_section: "Numbered 编号",
  heading_top_badge_topic: "Top badge 话题",
  heading_underline_classic: "Underline 经典",
  heading_pill_topic: "Pill 话题",
  heading_editorial_plain: "Editorial 留白",
  heading_keynote_strong: "Keynote 强调",
  heading_highlight_marker: "荧光笔标题",
  heading_short_line: "短线标题",
  heading_icon_prefix: "图标前缀标题",
  heading_minimal_number: "极简数字标题",
  heading_magazine_left_bar: "杂志竖线标题",
  heading_magazine_offset: "杂志错位标题",
};

export function GalleryTitleHeadingControls({
  value,
  onChange,
}: {
  value: GalleryStyleControlState;
  onChange: (next: GalleryStyleControlState) => void;
}) {
  return (
    <div
      className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3"
      data-testid="gallery-title-heading-controls"
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
          Title / Heading
        </p>
        <p className="mt-1 text-xs text-slate-500">
          覆盖样例默认 assignment；留空则使用各样例预设组合。
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

      <label className="block space-y-1.5">
        <ShellFieldLabel>Title variant</ShellFieldLabel>
        <ShellSelect
          data-testid="gallery-title-variant-select"
          value={value.titleVariantId}
          onChange={(event) =>
            onChange({
              ...value,
              titleVariantId: event.target.value as GalleryTitleVariantId | "",
            })
          }
        >
          <option value="">样例默认</option>
          {GALLERY_TITLE_VARIANT_IDS.map((variantId) => (
            <option key={variantId} value={variantId}>
              {TITLE_LABELS[variantId]}
            </option>
          ))}
        </ShellSelect>
      </label>

      <label className="block space-y-1.5">
        <ShellFieldLabel>Heading variant</ShellFieldLabel>
        <ShellSelect
          data-testid="gallery-heading-variant-select"
          value={value.headingVariantId}
          onChange={(event) =>
            onChange({
              ...value,
              headingVariantId: event.target.value as GalleryHeadingVariantId | "",
            })
          }
        >
          <option value="">样例默认</option>
          {GALLERY_HEADING_VARIANT_IDS.map((variantId) => (
            <option key={variantId} value={variantId}>
              {HEADING_LABELS[variantId]}
            </option>
          ))}
        </ShellSelect>
      </label>
    </div>
  );
}
