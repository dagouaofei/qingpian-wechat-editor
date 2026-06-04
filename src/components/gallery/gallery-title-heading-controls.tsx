"use client";

import {
  GALLERY_HEADING_VARIANT_IDS,
  GALLERY_TITLE_VARIANT_IDS,
  type GalleryHeadingVariantId,
  type GalleryTitleVariantId,
} from "@/lib/gallery-title-heading";
import { HEADING_PUBLISH_LABELS } from "@/core/renderer/heading-publish-visual";
import type { GalleryStyleControlState } from "@/lib/gallery-style-controls";
import { ShellFieldLabel, ShellSelect } from "@/components/ui-shell/primitives";

const TITLE_LABELS: Record<GalleryTitleVariantId, string> = {
  title_plain_minimal: "Plain 居中/左对齐",
  title_left_bar_classic: "Left bar 经典",
  title_bottom_line_editorial: "Bottom line 编辑",
};

const HEADING_LABELS = HEADING_PUBLISH_LABELS;

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
          8 套可发小标题样式；切换后 Preview 与 Copy 对照区同步更新。
        </p>
      </div>

      <label className="block space-y-1.5">
        <ShellFieldLabel>文章标题样式</ShellFieldLabel>
        <ShellSelect
          id="gallery-title-variant"
          data-testid="gallery-title-variant-select"
          value={value.titleVariantId ?? ""}
          onChange={(event) =>
            onChange({
              ...value,
              titleVariantId: (event.target.value || "") as GalleryTitleVariantId | "",
            })
          }
        >
          <option value="">样例默认</option>
          {GALLERY_TITLE_VARIANT_IDS.map((id) => (
            <option key={id} value={id}>
              {TITLE_LABELS[id]}
            </option>
          ))}
        </ShellSelect>
      </label>

      <label className="block space-y-1.5">
        <ShellFieldLabel>小标题样式（8 套）</ShellFieldLabel>
        <ShellSelect
          id="gallery-heading-variant"
          data-testid="gallery-heading-variant-select"
          value={value.headingVariantId ?? ""}
          onChange={(event) =>
            onChange({
              ...value,
              headingVariantId: (event.target.value || "") as GalleryHeadingVariantId | "",
            })
          }
        >
          <option value="">样例默认</option>
          {GALLERY_HEADING_VARIANT_IDS.map((id) => (
            <option key={id} value={id}>
              {HEADING_LABELS[id]}
            </option>
          ))}
        </ShellSelect>
      </label>
    </div>
  );
}
