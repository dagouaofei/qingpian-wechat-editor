import { parseArticle } from "@/core/article";
import { buildClipboardPayload } from "@/core/copy";
import {
  createRelease1FirstWaveCopyRendererRegistry,
  RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES,
} from "@/core/copy/first-wave-copy-registry";
import { finalizeGenerationEvents } from "@/core/generation/article-finalize";
import type { GenerationErrorEvent, GenerationEvent } from "@/core/generation/events";
import { parseAndNormalizeInputRequest } from "@/core/generation/input.normalize";
import { validateInputRequest } from "@/core/generation/input.parse";
import { loadVolcengineProviderConfig } from "@/core/generation/model-provider-config";
import { sanitizeProviderErrorMessage } from "@/core/generation/model-provider-errors";
import { encodeGenerationEventToSse } from "@/core/generation/sse";
import { generateAndApplyStyleSelection } from "@/core/generation/style-selection";
import { deterministicGenerationStreamProvider } from "@/core/generation/test-provider";
import { createVolcengineStreamingModelProvider } from "@/core/generation/volcengine-streaming-provider";
import {
  createRelease1FirstWavePreviewRendererRegistry,
  RELEASE1_FIRST_WAVE_PREVIEW_BLOCK_TYPES,
  renderArticleBlocks,
  renderTargetForMode,
  type RendererIssue,
  type RendererOutputPlaceholder,
} from "@/core/renderer";
import {
  createFirstWaveRequiredVariantRegistry,
  resolveArticleStyle,
} from "@/core/styles";

import {
  classifyFinalizationIssue,
  classifyInputValidationIssues,
  classifyProviderErrorCode,
} from "./classify-generate-error";
import type {
  GenerateFlowError,
  GenerateMainFlowInput,
  GenerateMainFlowPhase,
  GenerateMainFlowSuccess,
  SerializedPreviewBlock,
} from "./generate-flow-types";
import {
  encodeFlowCompleteToSse,
  encodeFlowErrorToSse,
  type GenerateStreamFlowErrorPayload,
} from "./stream-sse";

const REAL_PROVIDER_SETUP_HINT =
  "未配置真实 AI 模型。请在 .env.local 设置 VOLCENGINE_ENABLE_REAL_PROVIDER=true、VOLCENGINE_API_KEY、VOLCENGINE_MODEL（参见 .env.example）。";

function encodeFlowError(
  error: GenerateFlowError,
): string {
  const payload: GenerateStreamFlowErrorPayload = { ok: false, error };
  return encodeFlowErrorToSse(payload);
}

function resolveStreamingProvider(requireRealProvider?: boolean): {
  mode: "volcengine" | "deterministic";
  label: string;
  generate: typeof deterministicGenerationStreamProvider.generate;
} | null {
  const configResult = loadVolcengineProviderConfig(process.env);
  if (
    configResult.ok &&
    configResult.config.enabled &&
    configResult.config.apiKey &&
    configResult.config.model
  ) {
    const provider = createVolcengineStreamingModelProvider({
      config: configResult.config,
    });
    return {
      mode: "volcengine",
      label: `Volcengine / Doubao (${configResult.config.model}) · SSE`,
      generate: provider.generate.bind(provider),
    };
  }

  if (requireRealProvider) {
    return null;
  }

  return {
    mode: "deterministic",
    label: "Deterministic dev stream provider",
    generate: deterministicGenerationStreamProvider.generate.bind(
      deterministicGenerationStreamProvider,
    ),
  };
}

function serializePreviewBlocks(
  results: ReturnType<typeof renderArticleBlocks>,
): SerializedPreviewBlock[] {
  return results.map((result) => ({
    blockId: result.blockId,
    blockType: result.blockType,
    variantId:
      result.output && "variantId" in result.output
        ? String((result.output as { variantId?: string }).variantId)
        : undefined,
    ok: result.ok,
    output: result.output as RendererOutputPlaceholder | undefined,
    issues: result.issues,
    warnings: result.warnings,
  }));
}

function collectRendererIssues(previewBlocks: SerializedPreviewBlock[]): {
  issues: RendererIssue[];
  warnings: RendererIssue[];
} {
  return previewBlocks.reduce(
    (acc, block) => {
      acc.issues.push(...block.issues);
      acc.warnings.push(...block.warnings);
      return acc;
    },
    { issues: [] as RendererIssue[], warnings: [] as RendererIssue[] },
  );
}

async function buildSuccessPayload(
  article: import("@/core/article").Article,
  normalizedInput: ReturnType<typeof parseAndNormalizeInputRequest>,
  provider: { mode: "volcengine" | "deterministic"; label: string },
  phasesCompleted: GenerateMainFlowPhase[],
  startedAt: string,
): Promise<
  | { ok: true; data: GenerateMainFlowSuccess }
  | { ok: false; error: GenerateFlowError }
> {
  phasesCompleted.push("styling");
  const styleRegistry = createFirstWaveRequiredVariantRegistry();
  const styleResult = generateAndApplyStyleSelection({
    article,
    normalizedInput,
    registry: styleRegistry,
    mode: "deterministic",
    timestamp: startedAt,
  });

  if (!styleResult.applied || !styleResult.ok) {
    return {
      ok: false,
      error: {
        category: "style_selection",
        code: "style_selection_failed",
        message:
          styleResult.issues[0]?.message ?? "Style selection failed without fallback",
        phasesCompleted,
      },
    };
  }

  const styledArticle = styleResult.article;
  phasesCompleted.push("rendering");
  const resolvedArticleStyle = resolveArticleStyle(styledArticle, styleRegistry);
  const previewRegistry = createRelease1FirstWavePreviewRendererRegistry();
  const previewResults = renderArticleBlocks({
    article: styledArticle,
    resolvedArticleStyle,
    mode: "preview",
    target: renderTargetForMode("preview"),
    registry: previewRegistry,
    supportedBlockTypes: RELEASE1_FIRST_WAVE_PREVIEW_BLOCK_TYPES,
  });

  const previewBlocks = serializePreviewBlocks(previewResults);
  const rendererCollected = collectRendererIssues(previewBlocks);
  const blockingRendererIssues = rendererCollected.issues.filter(
    (issue) => issue.severity === "error",
  );

  if (blockingRendererIssues.length > 0) {
    return {
      ok: false,
      error: {
        category: "renderer",
        code: blockingRendererIssues[0]?.code ?? "renderer_failed",
        message: blockingRendererIssues[0]?.message ?? "Preview renderer failed",
        phasesCompleted,
      },
    };
  }

  const copyRegistry = createRelease1FirstWaveCopyRendererRegistry();
  const clipboardPayload = buildClipboardPayload({
    article: styledArticle,
    resolvedArticleStyle,
    registry: copyRegistry,
    supportedBlockTypes: RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES,
  });

  const blockingClipboardIssues = clipboardPayload.issues.filter(
    (issue) => issue.severity === "error",
  );
  if (blockingClipboardIssues.length > 0) {
    return {
      ok: false,
      error: {
        category: "clipboard",
        code: blockingClipboardIssues[0]?.code ?? "clipboard_payload_failed",
        message:
          blockingClipboardIssues[0]?.message ?? "Clipboard payload generation failed",
        phasesCompleted,
      },
    };
  }

  phasesCompleted.push("ready");

  return {
    ok: true,
    data: {
      providerMode: provider.mode,
      providerLabel: provider.label,
      phasesCompleted,
      article: parseArticle(styledArticle),
      articleTitle: styledArticle.metadata.title,
      previewBlocks,
      clipboard: {
        textHtml: clipboardPayload.textHtml,
        textPlain: clipboardPayload.textPlain,
        issueCount: clipboardPayload.issues.length,
        warningCount: clipboardPayload.warnings.length,
      },
      styleWarnings: styleResult.warnings,
      rendererIssues: rendererCollected.issues,
      rendererWarnings: rendererCollected.warnings,
      usedStyleFallback: styleResult.usedFallback,
    },
  };
}

export async function* iterateGenerateStreamSse(
  input: GenerateMainFlowInput,
): AsyncGenerator<string> {
  const phasesCompleted: GenerateMainFlowPhase[] = [];

  const validation = validateInputRequest(input.inputRequest);
  if (!validation.ok) {
    yield encodeFlowError({
      category: classifyInputValidationIssues(),
      code: validation.issues[0]?.code ?? "input_validation_failed",
      message: validation.issues.map((issue) => issue.message).join("; "),
      phasesCompleted,
    });
    return;
  }

  phasesCompleted.push("normalizing");
  let normalizedInput;
  try {
    normalizedInput = parseAndNormalizeInputRequest(input.inputRequest);
  } catch (error) {
    yield encodeFlowError({
      category: "input_validation",
      code: "input_normalize_failed",
      message: error instanceof Error ? error.message : "Failed to normalize input",
      phasesCompleted,
    });
    return;
  }

  const provider = resolveStreamingProvider(input.requireRealProvider);
  if (!provider) {
    yield encodeFlowError({
      category: "provider_config",
      code: "real_provider_not_configured",
      message: REAL_PROVIDER_SETUP_HINT,
      phasesCompleted,
    });
    return;
  }

  const requestId =
    input.requestId ??
    input.inputRequest.metadata?.requestId ??
    `generate-stream-${Date.now()}`;
  const startedAt = new Date().toISOString();
  let sequence = 0;

  const emitPhase = function* (
    phase: import("@/core/generation/events").StreamPhase,
    message: string,
  ): Generator<string> {
    sequence += 1;
    yield encodeGenerationEventToSse({
      type: "phase",
      requestId,
      sequence,
      timestamp: new Date().toISOString(),
      phase,
      message,
    });
  };

  yield* emitPhase("planning", "正在理解主题并组织文章结构…");

  phasesCompleted.push("generating");
  const collectedEvents: GenerationEvent[] = [];
  let sawWritingPhase = false;

  try {
    for await (const event of provider.generate(normalizedInput, {
      requestId,
      startedAt,
    })) {
      collectedEvents.push(event);
      yield encodeGenerationEventToSse(event);

      if (
        !sawWritingPhase &&
        (event.type === "block.start" || event.type === "block.delta")
      ) {
        sawWritingPhase = true;
        yield* emitPhase("writing", "正在生成正文…");
      }

      if (event.type === "error") {
        const providerError = event as GenerationErrorEvent;
        yield encodeFlowError({
          category: classifyProviderErrorCode(providerError.code),
          code: providerError.code,
          message: sanitizeProviderErrorMessage(providerError.message) ?? providerError.message,
          phasesCompleted,
        });
        return;
      }
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Provider stream failed";
    const category = /invalid uuid/i.test(message)
      ? "model_response"
      : "provider_network";
    yield encodeFlowError({
      category,
      code: "provider_stream_failed",
      message,
      phasesCompleted,
    });
    return;
  }

  phasesCompleted.push("finalizing");
  yield* emitPhase("styling", "正在应用样式与排版…");

  const finalization = finalizeGenerationEvents(collectedEvents);
  if (!finalization.ok) {
    const primary = finalization.issues[0];
    yield encodeFlowError({
      category: classifyFinalizationIssue(primary),
      code: primary?.code ?? "article_finalization_failed",
      message: primary?.message ?? "Article finalization failed",
      phasesCompleted,
    });
    return;
  }

  yield* emitPhase("finalizing", "正在准备预览与复制 payload…");

  const pipeline = await buildSuccessPayload(
    finalization.data.article,
    normalizedInput,
    provider,
    phasesCompleted,
    startedAt,
  );

  if (!pipeline.ok) {
    yield encodeFlowError(pipeline.error);
    return;
  }

  yield encodeFlowCompleteToSse(pipeline);
}
