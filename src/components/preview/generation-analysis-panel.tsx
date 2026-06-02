"use client";

import {
  analysisProgressPercent,
  type GenerationAnalysisStep,
} from "@/lib/preview-generation-progress";

function StepIcon({
  status,
  index,
}: {
  status: GenerationAnalysisStep["status"];
  index: number;
}) {
  if (status === "done") {
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
        ✓
      </span>
    );
  }
  if (status === "active") {
    return (
      <span className="relative flex h-7 w-7 shrink-0 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-blue-200/60" />
        <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
          {index + 1}
        </span>
      </span>
    );
  }
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-400">
      {index + 1}
    </span>
  );
}

export function GenerationAnalysisPanel({
  topic,
  steps,
  detail,
}: {
  topic: string;
  steps: GenerationAnalysisStep[];
  detail?: string;
}) {
  const progress = analysisProgressPercent(steps);
  const isLive = steps.some((step) => step.status === "active");

  return (
    <div className="flex flex-col gap-4" data-testid="preview-analysis-panel">
      <header className="relative overflow-hidden rounded-xl border border-blue-100/70 bg-gradient-to-br from-white to-blue-50/40 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-blue-200/60 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700">
            AI 成稿分析
          </span>
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              实时分析中
            </span>
          ) : null}
        </div>
        <h2 className="mt-3 text-base font-semibold text-slate-900">正在生成带样式文章…</h2>
        <p className="mt-1 text-sm text-slate-600">
          主题：《<span className="font-medium text-slate-900">{topic || "—"}</span>》
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
            data-testid="preview-analysis-progress"
          />
        </div>
      </header>

      <ol className="max-h-[min(42vh,20rem)] space-y-0 overflow-y-auto">
        {steps.map((step, index) => {
          const stepClass =
            step.status === "active"
              ? "border-blue-200 bg-blue-50/70 shadow-sm"
              : step.status === "done"
                ? "border-emerald-100 bg-emerald-50/50"
                : "border-slate-200 bg-white/70";

          return (
            <li key={step.id} className="relative flex gap-3 pb-3 last:pb-0">
              {index < steps.length - 1 ? (
                <span
                  className="absolute bottom-0 left-[13px] top-7 w-px bg-slate-200"
                  aria-hidden
                />
              ) : null}
              <StepIcon status={step.status} index={index} />
              <div
                className={`min-w-0 flex-1 rounded-xl border px-3 py-2.5 text-xs transition-all duration-300 ${stepClass}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-medium ${step.status === "pending" ? "text-slate-400" : "text-slate-800"}`}
                  >
                    {step.title}
                  </span>
                  <span
                    className={`shrink-0 text-[10px] ${
                      step.status === "done"
                        ? "text-emerald-600"
                        : step.status === "active"
                          ? "text-blue-600"
                          : "text-slate-400"
                    }`}
                  >
                    {step.status === "done"
                      ? "已完成"
                      : step.status === "active"
                        ? "分析中"
                        : "等待中"}
                  </span>
                </div>
                {(step.status === "active" || step.status === "done") && step.message ? (
                  <p className="mt-1.5 text-slate-600">{step.message}</p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      {detail ? (
        <div className="rounded-xl border border-blue-100/70 bg-blue-50/40 px-3 py-2.5 text-xs text-blue-800">
          {detail}
        </div>
      ) : null}
    </div>
  );
}
