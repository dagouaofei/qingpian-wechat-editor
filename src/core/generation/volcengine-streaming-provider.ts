import {
  assertVolcengineProviderConfig,
  loadVolcengineProviderConfig,
  type GenerationModelProviderConfig,
} from "./model-provider-config";
import type {
  CreateVolcengineModelProviderOptions,
  GenerationModelProvider,
} from "./model-provider";
import { GenerationModelProviderError } from "./model-provider-errors";
import { enrichModelArticleCandidate } from "./model-article-enrichment";
import { buildVolcengineStreamingPromptMessages } from "./model-prompt-streaming";
import {
  buildArticleCandidateFromStreamBlocks,
  createJsonlBlockStreamParser,
} from "./jsonl-block-stream-parser";
import type { GenerationEvent } from "./events";
import { createProviderErrorEvent, resolveStreamContext } from "./volcengine-provider";
import { isNormalizedInput } from "./stream";
import {
  createVolcengineStreamTransport,
  type VolcengineStreamTransport,
} from "./volcengine-stream-transport";

export type CreateVolcengineStreamingModelProviderOptions =
  CreateVolcengineModelProviderOptions & {
    streamTransport?: VolcengineStreamTransport;
  };

export function createVolcengineStreamingModelProvider(
  options: CreateVolcengineStreamingModelProviderOptions = {},
): GenerationModelProvider {
  const loaded = loadVolcengineProviderConfig();
  const config =
    options.config ??
    (loaded.ok
      ? loaded.config
      : ({
          provider: "volcengine",
          enabled: false,
          baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
          timeoutMs: 60_000,
        } satisfies GenerationModelProviderConfig));

  const streamTransport =
    options.streamTransport ?? createVolcengineStreamTransport();

  return {
    name: "volcengine",
    config,
    async *generate(input, context = {}) {
      if (!isNormalizedInput(input)) {
        throw new TypeError(
          "createVolcengineStreamingModelProvider requires NormalizedInput",
        );
      }

      const streamContext = resolveStreamContext(input, context);
      const parser = createJsonlBlockStreamParser(streamContext);

      const nextSequence = () => parser.getLastSequence() + 1;

      yield {
        type: "start",
        requestId: streamContext.requestId,
        sequence: 0,
        timestamp: streamContext.startedAt,
        meta: { provider: "volcengine", mode: "stream" },
      };

      const configResult = loadVolcengineProviderConfig({
        VOLCENGINE_ENABLE_REAL_PROVIDER: config.enabled ? "true" : "false",
        VOLCENGINE_API_KEY: config.apiKey,
        VOLCENGINE_MODEL: config.model,
        VOLCENGINE_BASE_URL: config.baseUrl,
        VOLCENGINE_TIMEOUT_MS: String(config.timeoutMs),
      });

      if (!configResult.ok) {
        const issue = configResult.issues[0]!;
        yield createProviderErrorEvent(streamContext, issue.code, issue.message, {
          recoverable: issue.code === "config_disabled",
          sequence: nextSequence(),
        });
        return;
      }

      const resolvedConfig = assertVolcengineProviderConfig(configResult);

      try {
        for await (const chunk of streamTransport.streamCompletion({
          baseUrl: resolvedConfig.baseUrl,
          apiKey: resolvedConfig.apiKey!,
          model: resolvedConfig.model!,
          timeoutMs: resolvedConfig.timeoutMs,
          messages: buildVolcengineStreamingPromptMessages(input),
        })) {
          for (const event of parser.push(chunk)) {
            yield event;
          }
        }

        for (const event of parser.flush()) {
          yield event;
        }
      } catch (error) {
        const providerError =
          error instanceof GenerationModelProviderError
            ? error
            : new GenerationModelProviderError(
                "provider_error",
                error instanceof Error ? error.message : "Volcengine stream failed",
              );
        yield createProviderErrorEvent(
          streamContext,
          providerError.code,
          providerError.message,
          { recoverable: providerError.recoverable, sequence: nextSequence() },
        );
        return;
      }

      const blocks = parser.getCompletedBlocks();
      if (blocks.length === 0) {
        yield createProviderErrorEvent(
          streamContext,
          "invalid_response",
          "Volcengine stream produced no JSONL blocks",
          { sequence: nextSequence() },
        );
        return;
      }

      const rawCandidate = buildArticleCandidateFromStreamBlocks(blocks, streamContext);
      const enrichment = enrichModelArticleCandidate({
        rawCandidate,
        normalizedInput: input,
        requestId: streamContext.requestId,
        providerName: "volcengine",
        modelName: resolvedConfig.model,
        timestamp: streamContext.startedAt,
      });

      if (!enrichment.ok) {
        yield createProviderErrorEvent(
          streamContext,
          "invalid_article_candidate",
          enrichment.errors[0]?.message ?? "Stream article enrichment failed",
          { sequence: nextSequence() },
        );
        return;
      }

      yield {
        type: "done.article",
        requestId: streamContext.requestId,
        sequence: nextSequence(),
        article: enrichment.candidate,
        timestamp: streamContext.startedAt,
        meta: {
          enrichmentWarningCount: enrichment.warnings.length,
          provider: "volcengine",
          model: resolvedConfig.model,
          mode: "stream",
        },
      } satisfies GenerationEvent;
    },
  };
}
