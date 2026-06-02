"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { GalleryCopyPreviewPanel } from "@/components/gallery/gallery-copy-preview-panel";
import { GalleryTitleHeadingControls } from "@/components/gallery/gallery-title-heading-controls";
import { ArticlePreviewPanel } from "@/components/preview/article-preview-panel";
import { PreviewStyleControls } from "@/components/preview/preview-style-controls";
import { PageShell } from "@/components/ui-shell/page-shell";
import {
  ShellBadge,
  ShellButton,
  ShellCard,
  ShellFieldLabel,
  ShellSelect,
} from "@/components/ui-shell/primitives";
import { IMPLEMENTED_FIRST_WAVE_VARIANT_IDS } from "@/core/styles/variants";
import {
  GALLERY_SAMPLES,
  type GallerySampleId,
} from "@/fixtures/gallery-articles";
import {
  DEFAULT_GALLERY_STYLE_CONTROL,
  type GalleryStyleControlState,
} from "@/lib/gallery-style-controls";
import { renderGalleryPreview } from "@/lib/render-gallery-preview";

export function GalleryPageClient() {
  const [sampleId, setSampleId] = useState<GallerySampleId>("sample-knowledge");
  const [styleControl, setStyleControl] = useState<GalleryStyleControlState>(
    DEFAULT_GALLERY_STYLE_CONTROL,
  );

  const preview = useMemo(
    () => renderGalleryPreview(sampleId, styleControl),
    [sampleId, styleControl],
  );

  const selectedSample = GALLERY_SAMPLES.find((sample) => sample.id === sampleId)!;

  return (
    <PageShell navCtaHref="/" navCtaLabel="开始生成">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <header className="mb-8 space-y-3">
          <ShellBadge>Visible Progress · Fixture Preview</ShellBadge>
          <h1 className="text-3xl font-bold text-slate-900" data-testid="gallery-page-title">
            样式进展展台
          </h1>
          <p className="max-w-2xl text-slate-600">
            用 fixture Article 即时渲染 Preview / Copy，不调用 AI。Title / Heading variant 与聚焦模式便于层级评审。
          </p>
          <p className="text-sm text-slate-500">
            用户主路径：
            <Link href="/" className="mx-1 text-blue-600 hover:underline">
              首页
            </Link>
            →
            <Link href="/preview" className="mx-1 text-blue-600 hover:underline">
              预览
            </Link>
            · 已实现 first-wave variants：
            <span className="font-medium text-slate-700">
              {IMPLEMENTED_FIRST_WAVE_VARIANT_IDS.length}
            </span>
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <ShellCard>
              <ShellFieldLabel>样例文章</ShellFieldLabel>
              <ShellSelect
                data-testid="gallery-sample-select"
                className="mt-2"
                value={sampleId}
                onChange={(event) =>
                  setSampleId(event.target.value as GallerySampleId)
                }
              >
                {GALLERY_SAMPLES.map((sample) => (
                  <option key={sample.id} value={sample.id}>
                    {sample.label}
                  </option>
                ))}
              </ShellSelect>
              <p className="mt-2 text-sm text-slate-600">{selectedSample.description}</p>
              <p className="mt-1 text-xs text-slate-500">
                {selectedSample.blockCount} blocks · {selectedSample.blockTypes.join(", ")}
              </p>
            </ShellCard>

            <ShellCard>
              <PreviewStyleControls
                value={styleControl}
                onChange={(next) => setStyleControl({ ...styleControl, ...next })}
              />
            </ShellCard>

            <ShellCard>
              <GalleryTitleHeadingControls
                value={styleControl}
                onChange={setStyleControl}
              />
            </ShellCard>

            {preview.variantIds.length > 0 ? (
              <ShellCard>
                <p className="text-sm font-medium text-slate-800">当前 variant</p>
                <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto text-xs text-slate-600">
                  {preview.variantIds.map((variantId) => (
                    <li key={variantId} className="font-mono">
                      {variantId}
                    </li>
                  ))}
                </ul>
              </ShellCard>
            ) : null}
          </aside>

          <div className="space-y-6">
            <ShellCard className="min-h-[480px]">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Preview 渲染
                  {styleControl.focusTitleHeading ? (
                    <span className="ml-2 text-sm font-normal text-indigo-600">
                      · title / heading 聚焦
                    </span>
                  ) : null}
                </h2>
                <ShellBadge>fixture · 无 AI</ShellBadge>
              </div>
              <ArticlePreviewPanel
                blocks={preview.displayBlocks}
                colorPalette={styleControl.colorPalette}
              />
            </ShellCard>

            <GalleryCopyPreviewPanel
              textHtml={preview.clipboard.textHtml}
              textPlain={preview.clipboard.textPlain}
              issueCount={preview.clipboard.issueCount}
              warningCount={preview.clipboard.warningCount}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/">
            <ShellButton>去首页生成</ShellButton>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
