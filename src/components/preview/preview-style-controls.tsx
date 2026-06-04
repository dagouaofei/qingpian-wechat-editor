"use client";

import {
  PREVIEW_ARTICLE_STYLE_OPTIONS,
  applyArticleStyleToPreviewControl,
  type PreviewArticleStyleId,
  type PreviewStyleControlState,
} from "@/lib/preview-style-controls";
import { PREVIEW_COLOR_PALETTE_OPTIONS } from "@/lib/preview-color-palette";
import { PREVIEW_HEADING_STYLE_OPTIONS } from "@/lib/preview-heading-style";
import { ShellFieldLabel, ShellSelect } from "@/components/ui-shell/primitives";

export function PreviewStyleControls({
  value,
  disabled,
  onChange,
}: {
  value: PreviewStyleControlState;
  disabled?: boolean;
  onChange: (next: PreviewStyleControlState) => void;
}) {
  return (
    <div
      className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3"
      data-testid="preview-style-controls"
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
          样式与配色
        </p>
        <p className="mt-1 text-xs text-slate-500">
          切换后立即重渲染预览与复制内容，无需重新生成。
        </p>
      </div>

      <label className="block space-y-1.5">
        <ShellFieldLabel>基础风格</ShellFieldLabel>
        <ShellSelect
          id="preview-article-style"
          data-testid="preview-article-style-select"
          disabled={disabled}
          value={value.articleStyle}
          onChange={(event) =>
            onChange(
              applyArticleStyleToPreviewControl(
                value,
                event.target.value as PreviewArticleStyleId,
              ),
            )
          }
        >
          {PREVIEW_ARTICLE_STYLE_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </ShellSelect>
        <p className="text-[11px] text-slate-500">
          {
            PREVIEW_ARTICLE_STYLE_OPTIONS.find((option) => option.id === value.articleStyle)
              ?.description
          }
        </p>
      </label>

      <label className="block space-y-1.5">
        <ShellFieldLabel>小标题样式</ShellFieldLabel>
        <ShellSelect
          id="preview-heading-style"
          data-testid="preview-heading-style-select"
          disabled={disabled}
          value={value.headingVariantId ?? ""}
          onChange={(event) =>
            onChange({
              ...value,
              headingVariantId: event.target.value as PreviewStyleControlState["headingVariantId"],
            })
          }
        >
          <option value="">跟随生成结果</option>
          {PREVIEW_HEADING_STYLE_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </ShellSelect>
      </label>

      <label className="block space-y-1.5">
        <ShellFieldLabel>配色</ShellFieldLabel>
        <ShellSelect
          id="preview-color-palette"
          data-testid="preview-color-palette-select"
          disabled={disabled}
          value={value.colorPalette}
          onChange={(event) =>
            onChange({
              ...value,
              colorPalette: event.target.value as PreviewStyleControlState["colorPalette"],
            })
          }
        >
          {PREVIEW_COLOR_PALETTE_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </ShellSelect>
      </label>
    </div>
  );
}
