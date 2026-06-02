import { parseArticle } from "@/core/article";
import { buildClipboardPayload } from "@/core/copy";
import { createRelease1FirstWaveCopyRendererRegistry, RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES } from "@/core/copy/first-wave-copy-registry";
import type { GenerationErrorEvent, GenerationEvent } from "@/core/generation";
import {
  collectGenerationStream,
  createVolcengineModelProvider,
  deterministicGenerationStreamProvider,
  finalizeGenerationEvents,
  generateAndApplyStyleSelection,
  loadVolcengineProviderConfig,
  parseAndNormalizeInputRequest,
  sanitizeProviderErrorMessage,
  validateInputRequest,
} from "@/core/generation";
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
  GenerateMainFlowResult,
  GenerateProviderMode,
  SerializedPreviewBlock,
} from "./generate-flow-types";

function failure(
  category: GenerateFlowError["category"],
  code: string,
  message: string,
  phasesCompleted: GenerateMainFlowPhase[],
): GenerateMainFlowResult {
  return {
    ok: false,
    error: {
      category,
      code,
      message: sanitizeProviderErrorMessage(message) ?? message,
      phasesCompleted,
    },
  };
}

function resolveProvider(): {
  mode: GenerateProviderMode;
  label: string;
  generate: typeof deterministicGenerationStreamProvider.generate;
} {
  const configResult = loadVolcengineProviderConfig(process.env);
  if (
    configResult.ok &&
    configResult.config.enabled &&
    configResult.config.apiKey &&
    configResult.config.model
  ) {
    const provider = createVolcengineModelProvider({ config: configResult.config });
    return {
      mode: "volcengine",
      label: `Volcengine / Doubao (${configResult.config.model})`,
      generate: provider.generate.bind(provider),
    };
  }

  return {
    mode: "deterministic",
    label: "Deterministic dev fallback provider",
    generate: deterministicGenerationStreamProvider.generate.bind(
      deterministicGenerationStreamProvider,
    ),
  };
}

function findProviderErrorEvent(
  events: GenerationEvent[],
): GenerationErrorEvent | undefined {
  return events.find((event): event is GenerationErrorEvent => event.type === "error");
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

function collectRendererIssues(
  previewBlocks: SerializedPreviewBlock[],
): { issues: RendererIssue[]; warnings: RendererIssue[] } {
  return previewBlocks.reduce(
    (acc, block) => {
      acc.issues.push(...block.issues);
      acc.warnings.push(...block.warnings);
      return acc;
    },
    { issues: [] as RendererIssue[], warnings: [] as RendererIssue[] },
  );
}

export async function runGenerateMainFlow(
  input: GenerateMainFlowInput,
): Promise<GenerateMainFlowResult> {
  const phasesCompleted: GenerateMainFlowPhase[] = [];

  const validation = validateInputRequest(input.inputRequest);
  if (!validation.ok) {
    return failure(
      classifyInputValidationIssues(),
      validation.issues[0]?.code ?? "input_validation_failed",
      validation.issues.map((issue) => issue.message).join("; "),
      phasesCompleted,
    );
  }

  phasesCompleted.push("normalizing");
  let normalizedInput;
  try {
    normalizedInput = parseAndNormalizeInputRequest(input.inputRequest);
  } catch (error) {
    return failure(
      "input_validation",
      "input_normalize_failed",
      error instanceof Error ? error.message : "Failed to normalize input",
      phasesCompleted,
    );
  }

  const provider = resolveProvider();
  const requestId =
    input.requestId ??
    input.inputRequest.metadata?.requestId ??
    `generate-ui-${Date.now()}`;
  const startedAt = new Date().toISOString();

  phasesCompleted.push("generating");
  let events: GenerationEvent[];
  try {
    events = await collectGenerationStream(
      provider.generate(normalizedInput, { requestId, startedAt }),
    );
  } catch (error) {
    return failure(
      "provider_network",
      "provider_stream_failed",
      error instanceof Error ? error.message : "Provider stream failed",
      phasesCompleted,
    );
  }

  const providerError = findProviderErrorEvent(events);
  if (providerError) {
    return failure(
      classifyProviderErrorCode(providerError.code),
      providerError.code,
      providerError.message,
      phasesCompleted,
    );
  }

  phasesCompleted.push("finalizing");
  const finalization = finalizeGenerationEvents(events);
  if (!finalization.ok) {
    const primary = finalization.issues[0];
    return failure(
      classifyFinalizationIssue(primary),
      primary?.code ?? "article_finalization_failed",
      primary?.message ?? "Article finalization failed",
      phasesCompleted,
    );
  }

  let article = finalization.data.article;
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
    return failure(
      "style_selection",
      "style_selection_failed",
      styleResult.issues[0]?.message ?? "Style selection failed without fallback",
      phasesCompleted,
    );
  }

  article = styleResult.article;

  phasesCompleted.push("rendering");
  const resolvedArticleStyle = resolveArticleStyle(article, styleRegistry);
  const previewRegistry = createRelease1FirstWavePreviewRendererRegistry();
  const previewResults = renderArticleBlocks({
    article,
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
    return failure(
      "renderer",
      blockingRendererIssues[0]?.code ?? "renderer_failed",
      blockingRendererIssues[0]?.message ?? "Preview renderer failed",
      phasesCompleted,
    );
  }

  const copyRegistry = createRelease1FirstWaveCopyRendererRegistry();
  const clipboardPayload = buildClipboardPayload({
    article,
    resolvedArticleStyle,
    registry: copyRegistry,
    supportedBlockTypes: RELEASE1_FIRST_WAVE_COPY_BLOCK_TYPES,
  });

  const blockingClipboardIssues = clipboardPayload.issues.filter(
    (issue) => issue.severity === "error",
  );
  if (blockingClipboardIssues.length > 0) {
    return failure(
      "clipboard",
      blockingClipboardIssues[0]?.code ?? "clipboard_payload_failed",
      blockingClipboardIssues[0]?.message ?? "Clipboard payload generation failed",
      phasesCompleted,
    );
  }

  phasesCompleted.push("ready");

  return {
    ok: true,
    data: {
      providerMode: provider.mode,
      providerLabel: provider.label,
      phasesCompleted,
      article: parseArticle(article),
      articleTitle: article.metadata.title,
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

export async function getGenerateProviderStatus(): Promise<{
  providerMode: GenerateProviderMode;
  providerLabel: string;
}> {
  const provider = resolveProvider();
  return {
    providerMode: provider.mode,
    providerLabel: provider.label,
  };
}
