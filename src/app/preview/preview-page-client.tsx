"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ArticlePreviewPanel } from "@/app/generate/preview-block-view";
import {
  GENERATE_ERROR_LABELS,
  type GenerateApiResponse,
} from "@/app/generate/types";
import {
  buildHomeInputRequest,
  homeFormFromSearchParams,
  validateHomeForm,
} from "@/lib/home-input";

type PreviewPhase = "idle" | "loading" | "ready" | "error";

export function PreviewPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useMemo(
    () => homeFormFromSearchParams(searchParams),
    [searchParams],
  );
  const validation = useMemo(() => validateHomeForm(form), [form]);
  const startedRef = useRef(false);

  const [phase, setPhase] = useState<PreviewPhase>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCategory, setErrorCategory] = useState<string | null>(null);
  const [providerLabel, setProviderLabel] = useState<string | null>(null);
  const [result, setResult] = useState<Extract<GenerateApiResponse, { ok: true }> | null>(
    null,
  );

  const runGeneration = useCallback(async () => {
    setPhase("loading");
    setErrorMessage(null);
    setErrorCategory(null);
    setResult(null);

    const inputRequest = buildHomeInputRequest(form);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...inputRequest,
          requireRealProvider: true,
        }),
      });
      const payload = (await response.json()) as GenerateApiResponse;

      if (!payload.ok) {
        setPhase("error");
        setErrorCategory(GENERATE_ERROR_LABELS[payload.error.category]);
        setErrorMessage(payload.error.message);
        return;
      }

      setResult(payload);
      setProviderLabel(payload.data.providerLabel);
      setPhase("ready");
    } catch (error) {
      setPhase("error");
      setErrorCategory(GENERATE_ERROR_LABELS.unknown);
      setErrorMessage(
        error instanceof Error ? error.message : "生成请求失败，请稍后重试。",
      );
    }
  }, [form]);

  useEffect(() => {
    if (!validation.ok || startedRef.current) {
      return;
    }
    startedRef.current = true;
    void runGeneration();
  }, [validation.ok, runGeneration]);

  const inputErrorMessage = !validation.ok
    ? (validation.message ?? "缺少文章主题")
    : null;
  const displayPhase = inputErrorMessage ? "error" : phase;
  const displayErrorMessage = inputErrorMessage ?? errorMessage;
  const displayErrorCategory = inputErrorMessage
    ? GENERATE_ERROR_LABELS.input_validation
    : errorCategory;

  function handleRegenerate() {
    startedRef.current = true;
    void runGeneration();
  }

  function handleBackHome() {
    router.push("/");
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10">
      <header className="space-y-2">
        <p className="text-sm font-medium text-emerald-700">文章预览</p>
        <h1 className="text-2xl font-bold text-zinc-900">{form.topic || "未命名主题"}</h1>
        <p className="text-sm text-zinc-600">
          主题输入 → 真实 AI 生成 → Preview Renderer 带样式展示
        </p>
        {providerLabel ? (
          <p
            className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700"
            data-testid="preview-provider-label"
          >
            {providerLabel}
          </p>
        ) : null}
      </header>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm"
          onClick={handleBackHome}
        >
          返回首页
        </button>
        <button
          type="button"
          data-testid="preview-regenerate-button"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          disabled={displayPhase === "loading" || !validation.ok}
          onClick={handleRegenerate}
        >
          重新生成
        </button>
        <Link
          href="/"
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm text-zinc-700"
        >
          修改输入
        </Link>
      </div>

      {displayPhase === "loading" ? (
        <div
          className="rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm"
          data-testid="preview-loading-state"
        >
          <p className="text-lg font-medium text-zinc-800">正在生成文章…</p>
          <p className="mt-2 text-sm text-zinc-500">
            调用真实 AI 并校验 Article Schema，请稍候。
          </p>
        </div>
      ) : null}

      {displayPhase === "error" && displayErrorMessage ? (
        <div
          className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800"
          data-testid="preview-error-panel"
          role="alert"
        >
          <p className="font-semibold">{displayErrorCategory}</p>
          <p className="mt-2">{displayErrorMessage}</p>
        </div>
      ) : null}

      {displayPhase === "ready" && result ? (
        <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">带样式预览</h2>
          <p className="mt-1 text-sm text-zinc-600">{result.data.articleTitle}</p>
          <p className="mt-1 text-xs text-zinc-500">
            {result.data.article.blocks.length} 个 block ·{" "}
            {result.data.previewBlocks.filter((b) => b.ok).length} 个已渲染
          </p>
          <div className="mt-4">
            <ArticlePreviewPanel blocks={result.data.previewBlocks} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
