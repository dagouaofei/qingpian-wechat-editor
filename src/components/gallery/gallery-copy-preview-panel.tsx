"use client";

import { ShellBadge, ShellCard } from "@/components/ui-shell/primitives";

export function GalleryCopyPreviewPanel({
  textHtml,
  textPlain,
  issueCount,
  warningCount,
}: {
  textHtml: string;
  textPlain: string;
  issueCount: number;
  warningCount: number;
}) {
  return (
    <ShellCard className="min-h-[240px]" data-testid="gallery-copy-preview-panel">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <h2 className="text-lg font-semibold text-slate-900">Copy 对照</h2>
        <ShellBadge>clipboard payload</ShellBadge>
      </div>
      <p className="mb-2 text-xs text-slate-500">
        HTML 预览（非 Paste QA）· issues {issueCount} · warnings {warningCount} · plain{" "}
        {textPlain.length} chars
      </p>
      <div
        className="max-h-64 overflow-auto rounded-lg border border-slate-200 bg-white p-3 text-sm"
        dangerouslySetInnerHTML={{ __html: textHtml }}
      />
    </ShellCard>
  );
}
