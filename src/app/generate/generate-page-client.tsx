"use client";

import { useEffect, useMemo, useState } from "react";

import type { InputRequest } from "@/core/generation";

import { ArticlePreviewPanel } from "./preview-block-view";
import type {
  GenerateApiResponse,
  GenerateFormState,
  GenerateProviderStatus,
  GenerateUiPhase,
} from "./types";
import { GENERATE_ERROR_LABELS, GENERATE_UI_PHASES } from "./types";

const DEFAULT_FORM: GenerateFormState = {
  topic: "",
  materials: "",
  draft: "",
  styleTone: "",
  stylePreset: "classic-news",
  styleDensity: "medium",
};

function buildInputRequest(form: GenerateFormState): InputRequest {
  const topic = form.topic.trim();
  const draft = form.draft.trim();
  const materialsText = form.materials.trim();
  const materials = materialsText
    ? [{ type: "plain_text" as const, text: materialsText, order: 0 }]
    : undefined;

  const mode =
    draft.length > 0
      ? ("draft_rewrite" as const)
      : materials && topic
        ? ("topic_with_materials" as const)
        : materials
          ? ("topic_with_materials" as const)
          : ("topic_only" as const);

  return {
    mode,
    topic: topic || undefined,
    materials,
    draft: draft || undefined,
    styleIntent: {
      tone: form.styleTone.trim() || undefined,
      presetHint: form.stylePreset.trim() || undefined,
      densityHint: form.styleDensity || undefined,
    },
    metadata: {
      locale: "zh-CN",
      source: "generate-ui",
    },
  };
}

function phaseLabel(phase: GenerateUiPhase): string {
  switch (phase) {
    case "idle":
      return "等待输入";
    case "normalizing":
      return "输入归一化";
    case "generating":
      return "模型生成";
    case "finalizing":
      return "Article 校验";
    case "styling":
      return "样式选择";
    case "rendering":
      return "Preview 渲染";
    case "ready":
      return "就绪";
    case "error":
      return "错误";
    default:
      return phase;
  }
}

import { copyClipboardPayload } from "@/lib/copy-clipboard-payload";

export function GeneratePageClient() {
  const [form, setForm] = useState<GenerateFormState>(DEFAULT_FORM);
  const [providerStatus, setProviderStatus] = useState<GenerateProviderStatus | null>(
    null,
  );
  const [phase, setPhase] = useState<GenerateUiPhase>("idle");
  const [activePhases, setActivePhases] = useState<GenerateUiPhase[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCategory, setErrorCategory] = useState<string | null>(null);
  const [result, setResult] = useState<Extract<GenerateApiResponse, { ok: true }> | null>(
    null,
  );
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/generate")
      .then((response) => response.json())
      .then((payload: GenerateProviderStatus) => setProviderStatus(payload))
      .catch(() => {
        setProviderStatus({
          providerMode: "deterministic",
          providerLabel: "Deterministic dev fallback provider",
        });
      });
  }, []);

  const providerBadge = useMemo(() => {
    if (!providerStatus) {
      return "检测 Provider 中…";
    }
    if (providerStatus.providerMode === "deterministic") {
      return `Dev fallback · ${providerStatus.providerLabel}`;
    }
    return providerStatus.providerLabel;
  }, [providerStatus]);

  async function handleGenerate() {
    setErrorMessage(null);
    setErrorCategory(null);
    setCopyMessage(null);
    setResult(null);
    setActivePhases(["normalizing", "generating"]);
    setPhase("normalizing");

    const phaseTimer = window.setInterval(() => {
      setPhase((current) => {
        const order: GenerateUiPhase[] = [
          "normalizing",
          "generating",
          "finalizing",
          "styling",
          "rendering",
        ];
        const index = order.indexOf(current);
        if (index < 0 || index >= order.length - 1) {
          return current;
        }
        const next = order[index + 1]!;
        setActivePhases((prev) => (prev.includes(next) ? prev : [...prev, next]));
        return next;
      });
    }, 700);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildInputRequest(form)),
      });
      const payload = (await response.json()) as GenerateApiResponse;

      if (!payload.ok) {
        setPhase("error");
        setActivePhases(payload.error.phasesCompleted);
        setErrorCategory(GENERATE_ERROR_LABELS[payload.error.category]);
        setErrorMessage(payload.error.message);
        return;
      }

      setResult(payload);
      setPhase("ready");
      setActivePhases(payload.data.phasesCompleted);
    } catch (error) {
      setPhase("error");
      setErrorCategory(GENERATE_ERROR_LABELS.unknown);
      setErrorMessage(error instanceof Error ? error.message : "Generate request failed");
    } finally {
      window.clearInterval(phaseTimer);
    }
  }

  async function handleCopy() {
    if (!result?.data.clipboard) {
      return;
    }
    const copyResult = await copyClipboardPayload(result.data.clipboard);
    setCopyMessage(copyResult.message);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="space-y-2">
        <p className="text-sm font-medium text-emerald-700">Release 1 · 主流程</p>
        <h1 className="text-3xl font-bold text-zinc-900">轻篇生成</h1>
        <p className="text-zinc-600">
          输入主题 / 资料 / 草稿，走统一 Generation → Article → Style → Preview → Copy 链路。
        </p>
        <p
          className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700"
          data-testid="provider-mode-badge"
        >
          Provider: {providerBadge}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
        <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">输入</h2>
          <label className="block space-y-1">
            <span className="text-sm text-zinc-700">主题</span>
            <input
              data-testid="generate-topic-input"
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
              value={form.topic}
              onChange={(event) => setForm({ ...form, topic: event.target.value })}
              placeholder="例如：轻篇 Release 1 主流程"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm text-zinc-700">资料（可选）</span>
            <textarea
              data-testid="generate-materials-input"
              className="min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2"
              value={form.materials}
              onChange={(event) => setForm({ ...form, materials: event.target.value })}
              placeholder="粘贴参考资料"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm text-zinc-700">草稿（可选）</span>
            <textarea
              data-testid="generate-draft-input"
              className="min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2"
              value={form.draft}
              onChange={(event) => setForm({ ...form, draft: event.target.value })}
              placeholder="已有草稿文本"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-sm text-zinc-700">styleIntent · tone</span>
              <input
                className="w-full rounded-md border border-zinc-300 px-3 py-2"
                value={form.styleTone}
                onChange={(event) => setForm({ ...form, styleTone: event.target.value })}
              />
            </label>
            <label className="block space-y-1">
              <span className="text-sm text-zinc-700">styleIntent · preset</span>
              <select
                className="w-full rounded-md border border-zinc-300 px-3 py-2"
                value={form.stylePreset}
                onChange={(event) =>
                  setForm({ ...form, stylePreset: event.target.value })
                }
              >
                <option value="classic-news">classic-news</option>
                <option value="classic">classic</option>
              </select>
            </label>
          </div>
          <label className="block space-y-1">
            <span className="text-sm text-zinc-700">styleIntent · density</span>
            <select
              className="w-full rounded-md border border-zinc-300 px-3 py-2"
              value={form.styleDensity}
              onChange={(event) =>
                setForm({
                  ...form,
                  styleDensity: event.target.value as GenerateFormState["styleDensity"],
                })
              }
            >
              <option value="light">light</option>
              <option value="medium">medium</option>
              <option value="strong">strong</option>
            </select>
          </label>
          <button
            type="button"
            data-testid="generate-submit-button"
            className="w-full rounded-md bg-zinc-900 px-4 py-2 font-medium text-white disabled:opacity-50"
            disabled={phase !== "idle" && phase !== "ready" && phase !== "error"}
            onClick={() => void handleGenerate()}
          >
            生成文章
          </button>
        </section>

        <section className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">流程状态</h2>
            <p className="mt-1 text-sm text-zinc-600">当前阶段：{phaseLabel(phase)}</p>
            <ol className="mt-4 grid gap-2 sm:grid-cols-2" data-testid="generate-phase-list">
              {GENERATE_UI_PHASES.filter((item) => item !== "idle" && item !== "error").map(
                (item) => {
                  const isActive = activePhases.includes(item) || phase === item;
                  const isCurrent = phase === item;
                  return (
                    <li
                      key={item}
                      className={`rounded-md px-3 py-2 text-sm ${
                        isCurrent
                          ? "bg-emerald-100 text-emerald-900"
                          : isActive
                            ? "bg-zinc-100 text-zinc-800"
                            : "bg-zinc-50 text-zinc-400"
                      }`}
                    >
                      {phaseLabel(item)}
                    </li>
                  );
                },
              )}
            </ol>
            {errorMessage ? (
              <div
                className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                data-testid="generate-error-panel"
              >
                <p className="font-medium">{errorCategory}</p>
                <p className="mt-1">{errorMessage}</p>
              </div>
            ) : null}
          </div>

          {result ? (
            <>
              <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-900">预览</h2>
                    <p className="text-sm text-zinc-600">{result.data.articleTitle}</p>
                  </div>
                  <button
                    type="button"
                    data-testid="generate-copy-button"
                    className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium"
                    onClick={() => void handleCopy()}
                  >
                    复制到剪贴板
                  </button>
                </div>
                {copyMessage ? (
                  <p className="mt-2 text-sm text-zinc-600" data-testid="copy-status-message">
                    {copyMessage}
                  </p>
                ) : null}
                <div className="mt-4">
                  <ArticlePreviewPanel blocks={result.data.previewBlocks} />
                </div>
              </div>

              <details className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                <summary className="cursor-pointer text-sm font-medium text-zinc-800">
                  Clipboard payload（非 DOM 抓取）
                </summary>
                <pre
                  className="mt-3 overflow-x-auto rounded bg-zinc-950 p-3 text-xs text-zinc-100"
                  data-testid="clipboard-plain-preview"
                >
                  {result.data.clipboard.textPlain.slice(0, 1200)}
                </pre>
              </details>
            </>
          ) : null}
        </section>
      </div>
    </div>
  );
}
