import { randomUUID } from "node:crypto";

import type { Block, BlockType } from "@/core/blocks";

import type { NormalizedInput } from "./input";
import type {
  GenerationErrorEvent,
  GenerationEvent,
  GenerationEventMeta,
  GenerationStreamContext,
} from "./events";
import {
  GenerationModelProviderError,
  type GenerationModelProviderErrorCode,
} from "./model-provider-errors";
import { enrichModelArticleCandidate } from "./model-article-enrichment";
import {
  assertVolcengineProviderConfig,
  DEFAULT_VOLCENGINE_BASE_URL,
  DEFAULT_VOLCENGINE_TIMEOUT_MS,
  loadVolcengineProviderConfig,
  type GenerationModelProviderConfig,
} from "./model-provider-config";
import type {
  CreateVolcengineModelProviderOptions,
  GenerationModelProvider,
  GenerationModelProviderResult,
  GenerationModelTransport,
} from "./model-provider";
import { buildVolcenginePromptMessages, parseModelJsonContent } from "./model-prompt";
import { isNormalizedInput } from "./stream";
import { createVolcengineTransport } from "./volcengine-transport";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function resolveStreamContext(
  input: NormalizedInput,
  context: Partial<GenerationStreamContext> = {},
): GenerationStreamContext {
  return {
    requestId:
      context.requestId ??
      input.metadata?.requestId ??
      input.id ??
      "volcengine-generation",
    input,
    startedAt: context.startedAt ?? input.normalizedAt ?? new Date().toISOString(),
  };
}

/** @deprecated Use enrichModelArticleCandidate from model-article-enrichment */
export function enrichArticleCandidate(
  candidate: Record<string, unknown>,
  input: NormalizedInput,
  startedAt: string,
  modelId?: string,
): Record<string, unknown> {
  const result = enrichModelArticleCandidate({
    rawCandidate: candidate,
    normalizedInput: input,
    requestId: input.metadata?.requestId ?? input.id ?? "volcengine-generation",
    providerName: "volcengine",
    modelName: modelId,
    timestamp: startedAt,
  });

  if (!result.ok) {
    throw new Error(result.errors[0]?.message ?? "Model article enrichment failed");
  }

  return result.candidate;
}

function extractBlockPreviewText(block: Block): string {
  const content = block.content as Record<string, unknown>;
  const text = content.text;
  if (typeof text === "string") {
    return text;
  }
  if (Array.isArray(text)) {
    return text
      .map((node) =>
        node && typeof node === "object" && "text" in node
          ? String((node as { text?: unknown }).text ?? "")
          : "",
      )
      .join("");
  }
  if (typeof content.body === "string") {
    return content.body;
  }
  if (typeof content.label === "string") {
    return content.label;
  }
  return "";
}

export type BuildGenerationEventsOptions = {
  meta?: GenerationEventMeta;
};

export function buildGenerationEventsFromArticleCandidate(
  article: Record<string, unknown>,
  context: GenerationStreamContext,
  options: BuildGenerationEventsOptions = {},
): GenerationEvent[] {
  const events: GenerationEvent[] = [];
  let sequence = 1;
  const timestamp = context.startedAt;
  const blocks = Array.isArray(article.blocks) ? article.blocks : [];

  for (const rawBlock of blocks) {
    if (!isPlainObject(rawBlock)) {
      continue;
    }

    const blockId =
      typeof rawBlock.id === "string" ? rawBlock.id : randomUUID();
    const blockType = rawBlock.type;
    if (typeof blockType !== "string") {
      continue;
    }

    events.push({
      type: "block.start",
      requestId: context.requestId,
      sequence,
      blockId,
      blockType: blockType as BlockType,
      timestamp,
    });
    sequence += 1;

    const previewText = extractBlockPreviewText(rawBlock as Block);
    if (previewText.length > 0) {
      events.push({
        type: "block.delta",
        requestId: context.requestId,
        sequence,
        blockId,
        delta: previewText,
        timestamp,
      });
      sequence += 1;
    }

    events.push({
      type: "block.complete",
      requestId: context.requestId,
      sequence,
      blockId,
      blockType: blockType as BlockType,
      content: rawBlock.content,
      timestamp,
    });
    sequence += 1;
  }

  events.push({
    type: "done.article",
    requestId: context.requestId,
    sequence,
    article,
    timestamp,
    meta: options.meta,
  });

  return events;
}

export function createProviderErrorEvent(
  context: GenerationStreamContext,
  code: GenerationModelProviderErrorCode,
  message: string,
  options?: { recoverable?: boolean; sequence?: number },
): GenerationErrorEvent {
  return {
    type: "error",
    requestId: context.requestId,
    sequence: options?.sequence ?? 1,
    code,
    message,
    recoverable: options?.recoverable,
    timestamp: new Date().toISOString(),
  };
}

export async function generateVolcengineProviderEvents(
  input: NormalizedInput,
  config: GenerationModelProviderConfig,
  transport: GenerationModelTransport,
  context: Partial<GenerationStreamContext> = {},
): Promise<GenerationModelProviderResult> {
  const streamContext = resolveStreamContext(input, context);

  const configResult = loadVolcengineProviderConfig({
    VOLCENGINE_ENABLE_REAL_PROVIDER: config.enabled ? "true" : "false",
    VOLCENGINE_API_KEY: config.apiKey,
    VOLCENGINE_MODEL: config.model,
    VOLCENGINE_BASE_URL: config.baseUrl,
    VOLCENGINE_TIMEOUT_MS: String(config.timeoutMs),
  });

  if (!configResult.ok) {
    const issue = configResult.issues[0]!;
    return {
      events: [
        createProviderErrorEvent(streamContext, issue.code, issue.message, {
          recoverable: issue.code === "config_disabled",
        }),
      ],
    };
  }

  const resolvedConfig = assertVolcengineProviderConfig(configResult);

  const transportResult = await transport.complete({
    baseUrl: resolvedConfig.baseUrl,
    apiKey: resolvedConfig.apiKey!,
    model: resolvedConfig.model!,
    timeoutMs: resolvedConfig.timeoutMs,
    messages: buildVolcenginePromptMessages(input),
  });

  if (!transportResult.ok) {
    return {
      events: [
        createProviderErrorEvent(
          streamContext,
          transportResult.error.code,
          transportResult.error.message,
          { recoverable: transportResult.error.recoverable },
        ),
      ],
    };
  }

  let parsed: unknown;
  try {
    parsed = parseModelJsonContent(transportResult.content);
  } catch {
    return {
      events: [
        createProviderErrorEvent(
          streamContext,
          "malformed_json",
          "Volcengine model response is not valid Article JSON",
        ),
      ],
    };
  }

  if (!isPlainObject(parsed)) {
    return {
      events: [
        createProviderErrorEvent(
          streamContext,
          "invalid_article_candidate",
          "Volcengine model response must be a JSON object",
        ),
      ],
    };
  }

  const enrichment = enrichModelArticleCandidate({
    rawCandidate: parsed,
    normalizedInput: input,
    requestId: streamContext.requestId,
    providerName: "volcengine",
    modelName: resolvedConfig.model,
    timestamp: streamContext.startedAt,
  });

  if (!enrichment.ok) {
    const primary = enrichment.errors[0]!;
    return {
      events: [
        createProviderErrorEvent(
          streamContext,
          "invalid_article_candidate",
          primary.message,
        ),
      ],
      enrichmentWarnings: enrichment.warnings,
    };
  }

  return {
    events: buildGenerationEventsFromArticleCandidate(
      enrichment.candidate,
      streamContext,
      {
        meta: {
          enrichmentWarningCount: enrichment.warnings.length,
          provider: "volcengine",
          model: resolvedConfig.model,
        },
      },
    ),
    enrichmentWarnings: enrichment.warnings,
  };
}

function defaultDisabledVolcengineConfig(): GenerationModelProviderConfig {
  return {
    provider: "volcengine",
    enabled: false,
    baseUrl: DEFAULT_VOLCENGINE_BASE_URL,
    timeoutMs: DEFAULT_VOLCENGINE_TIMEOUT_MS,
  };
}

export function createVolcengineModelProvider(
  options: CreateVolcengineModelProviderOptions = {},
): GenerationModelProvider {
  const loaded = loadVolcengineProviderConfig();
  const config =
    options.config ?? (loaded.ok ? loaded.config : defaultDisabledVolcengineConfig());
  const transport = options.transport ?? createVolcengineTransport();

  return {
    name: "volcengine",
    config,
    async *generate(input, context = {}) {
      if (!isNormalizedInput(input)) {
        throw new TypeError(
          "createVolcengineModelProvider requires NormalizedInput; raw InputRequest is not accepted",
        );
      }

      const result = await generateVolcengineProviderEvents(
        input,
        config,
        transport,
        context,
      );

      for (const event of result.events) {
        yield event;
      }
    },
  };
}

export function resolveGenerationModelProvider(
  providerName: GenerationModelProvider["name"] = "volcengine",
  options: CreateVolcengineModelProviderOptions = {},
): GenerationModelProvider {
  if (providerName === "volcengine") {
    return createVolcengineModelProvider(options);
  }

  throw new GenerationModelProviderError(
    "provider_error",
    `Unsupported generation model provider: ${providerName}`,
  );
}
