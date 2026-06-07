"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ArticlePreviewPanel } from "@/components/preview/article-preview-panel";
import { GENERATE_ERROR_LABELS, type GenerateApiResponse } from "@/lib/generate-api-types";
import { GenerationAnalysisPanel } from "@/components/preview/generation-analysis-panel";
import { PreviewGeneratingStatus } from "@/components/preview/preview-generating-status";
import { PreviewStyleControls } from "@/components/preview/preview-style-controls";
import { ArrowLeftIcon, CopyIcon, SparklesIcon } from "@/components/ui-shell/icons";
import { PageShell } from "@/components/ui-shell/page-shell";
import {
  ShellBadge,
  ShellButton,
  ShellCard,
  ShellCardAccent,
} from "@/components/ui-shell/primitives";
import type { GenerationEvent, StreamPhase } from "@/core/generation/events";
import { copyClipboardPayload } from "@/lib/copy-clipboard-payload";
import { consumeGenerateStream } from "@/lib/generate-stream-client";
import {
  buildHomeInputRequest,
  homeFormFromSearchParams,
  validateHomeForm,
} from "@/lib/home-input";
import { normalizeInputRequest } from "@/core/generation/input.normalize";
import {
  buildAnalysisSteps,
  GENERATION_ANALYSIS_STEPS,
} from "@/lib/preview-generation-progress";
import {
  buildStreamingBlocksFromEvent,
  computeStreamingPreviewContentRevision,
  renderStreamingPreviewBlocks,
} from "@/lib/render-streaming-preview";
import type { PreviewUserSelectableHeadingOption } from "@/lib/preview-user-selectable-pool";
import { renderArticlePreviewClient } from "@/lib/render-article-preview-client";
import type { UserSelectableVariantPoolSnapshot } from "@/lib/user-selectable-variant-pool-types";
import {
  resolveInitialPreviewStyleControl,
  type PreviewStyleControlState,
} from "@/lib/preview-style-controls";
import { usePreviewStreamScroll } from "@/lib/use-preview-stream-scroll";

import type { StreamingPreviewBlock } from "./streaming-preview-panel";

export type GenerateUiState =
  | "idle"
  | "connecting"
  | "planning"
  | "streaming"
  | "finalizing"
  | "done"
  | "error";

const PHASE_TO_ANALYSIS_INDEX: Record<StreamPhase, number> = {
  planning: 0,
  writing: 1,
  styling: 3,
  finalizing: 4,
};

function mapStreamPhaseToUi(phase: StreamPhase | null): GenerateUiState {
  if (!phase) {
    return "planning";
  }
  if (phase === "planning") {
    return "planning";
  }
  if (phase === "writing") {
    return "streaming";
  }
  return "finalizing";
}

function buildPoolSourceNotice(pool: UserSelectableVariantPoolSnapshot): string | undefined {
  if (pool.source === "database") {
    return `User-selectable pool: database (${pool.poolVariantIds.length} variants · cache TTL ${pool.cache.ttlSeconds}s)`;
  }
  return pool.notice;
}

export function PreviewPageClient({
  userSelectablePool,
  userSelectableHeadingOptions,
}: {
  userSelectablePool: UserSelectableVariantPoolSnapshot;
  userSelectableHeadingOptions: PreviewUserSelectableHeadingOption[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = useMemo(
    () => homeFormFromSearchParams(searchParams),
    [searchParams],
  );
  const validation = useMemo(() => validateHomeForm(form), [form]);
  const streamingStyleInput = useMemo(
    () => normalizeInputRequest(buildHomeInputRequest(form)),
    [form],
  );
  const startedRef = useRef(false);

  const [uiState, setUiState] = useState<GenerateUiState>("idle");
  const [phaseMessage, setPhaseMessage] = useState<string | null>(null);
  const [analysisStepIndex, setAnalysisStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCategory, setErrorCategory] = useState<string | null>(null);
  const [providerLabel, setProviderLabel] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [streamingBlocks, setStreamingBlocks] = useState<StreamingPreviewBlock[]>([]);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [result, setResult] = useState<Extract<GenerateApiResponse, { ok: true }> | null>(
    null,
  );
  const [styleControl, setStyleControl] = useState<PreviewStyleControlState>(() =>
    resolveInitialPreviewStyleControl(form),
  );

  const topic = form.topic || "未命名主题";
  const isLiveGeneration =
    uiState === "connecting" ||
    uiState === "planning" ||
    uiState === "streaming" ||
    uiState === "finalizing";

  const streamContentRevision = useMemo(
    () => computeStreamingPreviewContentRevision(streamingBlocks),
    [streamingBlocks],
  );
  const activeBlockType =
    streamingBlocks.find((block) => block.blockId === activeBlockId)?.blockType ?? null;

  const { containerRef, autoFollow, resumeFollow, resetAutoFollow } =
    usePreviewStreamScroll({
    activeBlockId,
    activeBlockType,
    contentRevision: streamContentRevision,
    enabled:
      uiState === "streaming" ||
      uiState === "finalizing" ||
      (uiState === "planning" && streamingBlocks.length > 0),
  });

  const applyStreamEvent = useCallback((event: GenerationEvent) => {
    if (event.type === "start") {
      setUiState("planning");
      return;
    }

    if (event.type === "phase") {
      setPhaseMessage(event.message);
      setUiState(mapStreamPhaseToUi(event.phase));
      setAnalysisStepIndex(PHASE_TO_ANALYSIS_INDEX[event.phase] ?? 0);
      return;
    }

    if (event.type === "block.start" || event.type === "block.delta") {
      setUiState("streaming");
      setActiveBlockId(event.blockId);
    }

    if (
      event.type === "block.start" ||
      event.type === "block.delta" ||
      event.type === "block.complete"
    ) {
      setStreamingBlocks((prev) => {
        const map = new Map(prev.map((block) => [block.blockId, block]));
        const next = buildStreamingBlocksFromEvent(map, event);
        return Array.from(next.values());
      });
      if (event.type === "block.complete") {
        setActiveBlockId(null);
      }
    }
  }, []);

  const runGeneration = useCallback(async () => {
    resetAutoFollow();
    setUiState("connecting");
    setPhaseMessage("正在连接 AI 生成服务…");
    setAnalysisStepIndex(0);
    setErrorMessage(null);
    setErrorCategory(null);
    setCopyMessage(null);
    setResult(null);
    setStreamingBlocks([]);
    setActiveBlockId(null);
    setStyleControl(resolveInitialPreviewStyleControl(form));

    const inputRequest = buildHomeInputRequest(form);

    try {
      const response = await fetch("/api/generate/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...inputRequest,
          requireRealProvider: true,
        }),
      });

      setUiState("planning");

      let flowFinished = false;

      await consumeGenerateStream(response, {
        onEvent: applyStreamEvent,
        onComplete: (payload) => {
          flowFinished = true;
          setResult(payload);
          setProviderLabel(payload.data.providerLabel);
          setUiState("done");
          setActiveBlockId(null);
        },
        onError: (error) => {
          flowFinished = true;
          setUiState("error");
          setErrorCategory(
            GENERATE_ERROR_LABELS[
              error.category as keyof typeof GENERATE_ERROR_LABELS
            ] ?? GENERATE_ERROR_LABELS.unknown,
          );
          setErrorMessage(error.message);
        },
      });

      if (!flowFinished) {
        setUiState("error");
        setErrorCategory(GENERATE_ERROR_LABELS.unknown);
        setErrorMessage("流式生成未返回完整结果，请重试。");
      }
    } catch (error) {
      setUiState("error");
      setErrorCategory(GENERATE_ERROR_LABELS.unknown);
      setErrorMessage(
        error instanceof Error ? error.message : "生成请求失败，请稍后重试。",
      );
    }
  }, [form, applyStreamEvent, resetAutoFollow]);

  useEffect(() => {
    if (!validation.ok || startedRef.current) {
      return;
    }
    startedRef.current = true;
    void runGeneration();
  }, [validation.ok, runGeneration]);

  useEffect(() => {
    if (uiState !== "connecting" && uiState !== "planning") {
      return;
    }

    const timer = window.setInterval(() => {
      setAnalysisStepIndex((current) =>
        Math.min(current + 1, GENERATION_ANALYSIS_STEPS.length - 2),
      );
    }, 4000);

    return () => {
      window.clearInterval(timer);
    };
  }, [uiState]);

  const inputErrorMessage = !validation.ok
    ? (validation.message ?? "缺少文章主题")
    : null;
  const displayState: GenerateUiState = inputErrorMessage ? "error" : uiState;
  const displayErrorMessage = inputErrorMessage ?? errorMessage;
  const displayErrorCategory = inputErrorMessage
    ? GENERATE_ERROR_LABELS.input_validation
    : errorCategory;

  const styledPreview = useMemo(() => {
    if (displayState !== "done" || !result) {
      return null;
    }

    const rendered = renderArticlePreviewClient(
      result.data.article,
      streamingStyleInput,
      styleControl,
      { userSelectablePool },
    );

    return {
      previewBlocks: rendered.previewBlocks,
      clipboard: rendered.clipboard,
    };
  }, [displayState, result, streamingStyleInput, styleControl, userSelectablePool]);

  const analysisSteps = buildAnalysisSteps(analysisStepIndex);
  const analysisDetail =
    phaseMessage ??
    (displayState === "connecting"
      ? "正在连接生成服务，预览区已就绪。"
      : "正在理解主题并组织文章结构…");

  const livePreviewBlocks = useMemo(() => {
    if (displayState === "done") {
      if (styledPreview) {
        return styledPreview.previewBlocks;
      }
      if (result) {
        return result.data.previewBlocks;
      }
    }
    if (streamingBlocks.length > 0) {
      return renderStreamingPreviewBlocks(streamingBlocks, topic, {
        presetId: form.basicStyle,
        normalizedInput: streamingStyleInput,
      });
    }
    return [];
  }, [
    displayState,
    form.basicStyle,
    result,
    streamingBlocks,
    streamingStyleInput,
    styledPreview,
    topic,
  ]);

  const activeClipboard =
    displayState === "done" && styledPreview
      ? styledPreview.clipboard
      : result?.data.clipboard;

  const showPreviewShell =
    displayState !== "error" &&
    (isLiveGeneration || livePreviewBlocks.length > 0 || displayState === "done");

  const canCopy = displayState === "done" && Boolean(activeClipboard);
  const showStreamingPreviewPanel =
    livePreviewBlocks.length > 0 || (isLiveGeneration && streamingBlocks.length > 0);

  async function handleCopy() {
    if (!activeClipboard) {
      return;
    }
    const copyResult = await copyClipboardPayload(activeClipboard);
    setCopyMessage(copyResult.message);
  }

  function handleRegenerate() {
    startedRef.current = true;
    void runGeneration();
  }

  function handleBackHome() {
    router.push("/");
  }

  return (
    <PageShell navCtaHref="/" navCtaLabel="新建文章">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <ShellButton variant="ghost" size="sm" onClick={handleBackHome}>
            <ArrowLeftIcon />
            返回首页
          </ShellButton>
          {providerLabel ? (
            <ShellBadge
              className="border-slate-200 bg-white text-slate-600"
              data-testid="preview-provider-label"
            >
              {providerLabel}
            </ShellBadge>
          ) : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-8">
          <aside className="space-y-4">
            <ShellCard>
              <ShellCardAccent />
              <div className="space-y-4 p-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                    当前选题
                  </p>
                  <h1 className="mt-1 text-lg font-bold leading-snug text-slate-900">{topic}</h1>
                </div>

                {isLiveGeneration || displayState === "error" ? (
                  <div data-testid="preview-loading-state">
                    {displayState === "error" ? (
                      <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        生成失败，请重试或返回修改输入。
                      </p>
                    ) : (
                      <GenerationAnalysisPanel
                        topic={topic}
                        steps={analysisSteps}
                        detail={analysisDetail}
                      />
                    )}
                  </div>
                ) : (
                  <>
                    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-sm text-slate-600">
                      生成完成，可在右侧预览并复制到公众号。
                    </div>
                    <PreviewStyleControls
                      value={styleControl}
                      onChange={setStyleControl}
                      userSelectableHeadingOptions={userSelectableHeadingOptions}
                      poolSourceNotice={buildPoolSourceNotice(userSelectablePool)}
                    />
                  </>
                )}

                <div className="flex flex-col gap-2">
                  <ShellButton
                    data-testid="preview-regenerate-button"
                    variant="secondary"
                    disabled={isLiveGeneration || !validation.ok}
                    onClick={handleRegenerate}
                  >
                    <SparklesIcon className="h-4 w-4" />
                    重新生成
                  </ShellButton>
                  <ShellButton
                    data-testid="preview-copy-button"
                    disabled={!canCopy}
                    onClick={() => void handleCopy()}
                  >
                    <CopyIcon />
                    复制到公众号
                  </ShellButton>
                  <Link href="/">
                    <ShellButton variant="ghost" className="w-full">
                      修改输入
                    </ShellButton>
                  </Link>
                </div>

                {copyMessage ? (
                  <p className="text-sm text-emerald-700" data-testid="preview-copy-status">
                    {copyMessage}
                  </p>
                ) : null}
              </div>
            </ShellCard>
          </aside>

          <section className="relative min-w-0">
            <PreviewGeneratingStatus
              visible={isLiveGeneration}
              completedBlockCount={
                streamingBlocks.filter((block) => block.complete).length
              }
              totalBlockCount={streamingBlocks.length}
              activeBlockType={activeBlockType}
              phase={
                displayState === "connecting" || displayState === "planning"
                  ? "loading"
                  : displayState === "streaming" || displayState === "finalizing"
                    ? "revealing"
                    : "complete"
              }
              statusHint={phaseMessage ?? undefined}
            />

            {!autoFollow && isLiveGeneration ? (
              <div className="pointer-events-none sticky top-14 z-30 mb-3 flex justify-center">
                <ShellButton
                  size="sm"
                  className="pointer-events-auto shadow-lg"
                  data-testid="preview-resume-follow-button"
                  onClick={resumeFollow}
                >
                  正在生成中 · 回到当前位置
                </ShellButton>
              </div>
            ) : null}

            {displayState === "error" && displayErrorMessage ? (
              <ShellCard
                className="border-red-200 bg-red-50 p-6 text-red-800"
                data-testid="preview-error-panel"
              >
                <p className="font-semibold">{displayErrorCategory}</p>
                <p className="mt-2 text-sm">{displayErrorMessage}</p>
              </ShellCard>
            ) : null}

            {showPreviewShell ? (
              <ShellCard>
                <ShellCardAccent />
                <div className="p-5 sm:p-6">
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">文章预览</h2>
                      {result && displayState === "done" ? (
                        <>
                          <p className="mt-1 text-sm text-slate-600">{result.data.articleTitle}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {result.data.article.blocks.length} 个 block ·{" "}
                            {result.data.previewBlocks.filter((b) => b.ok).length} 个已渲染
                          </p>
                        </>
                      ) : (
                        <p className="mt-1 text-sm text-slate-500">
                          {livePreviewBlocks.length > 0
                            ? "正文 block 正在流式写入…"
                            : "文章容器已就绪，等待首段内容…"}
                        </p>
                      )}
                    </div>
                    <ShellButton
                      size="sm"
                      data-testid="preview-copy-button-top"
                      disabled={!canCopy}
                      onClick={() => void handleCopy()}
                    >
                      <CopyIcon />
                      复制
                    </ShellButton>
                  </div>

                  <div
                    ref={containerRef}
                    className="max-h-[min(72vh,900px)] overflow-y-auto pr-1"
                    data-testid="preview-scroll-container"
                  >
                    {showStreamingPreviewPanel ? (
                      <ArticlePreviewPanel
                        blocks={livePreviewBlocks}
                        activeBlockId={
                          displayState === "streaming" || displayState === "finalizing"
                            ? activeBlockId
                            : null
                        }
                        showStreamingCaret={
                          displayState === "streaming" || displayState === "finalizing"
                        }
                        disableBlockRevealAnimation={isLiveGeneration}
                        colorPalette={styleControl.colorPalette}
                      />
                    ) : (
                      <div
                        className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-8 text-center"
                        data-testid="preview-stream-placeholder"
                      >
                        <p className="text-base font-medium text-slate-700">
                          {topic}
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                          正在生成标题与首段正文…
                        </p>
                        <div className="mx-auto mt-6 max-w-md space-y-3 text-left">
                          <div className="h-8 animate-pulse rounded-lg bg-slate-200/80" />
                          <div className="h-4 animate-pulse rounded bg-slate-200/60" />
                          <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200/50" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ShellCard>
            ) : null}
          </section>
        </div>
      </div>
    </PageShell>
  );
}
