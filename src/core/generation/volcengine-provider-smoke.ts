import type { ArticleFinalizationIssue } from "./article-finalize";
import { finalizeGenerationEvents } from "./article-finalize";
import type { GenerationErrorEvent, GenerationEvent } from "./events";
import type { GenerationModelProviderErrorCode } from "./model-provider-errors";
import { sanitizeProviderErrorMessage } from "./model-provider-errors";
import {
  loadVolcengineProviderConfig,
  type GenerationModelProviderConfigIssue,
} from "./model-provider-config";
import { parseAndNormalizeInputRequest } from "./input.normalize";
import { collectGenerationStream } from "./stream";
import { createVolcengineModelProvider } from "./volcengine-provider";
import { createVolcengineTransport } from "./volcengine-transport";

export const VOLCENGINE_SMOKE_INPUT = {
  mode: "topic_only" as const,
  topic: "轻篇 Volcengine Provider Smoke 测试",
  metadata: {
    locale: "zh-CN",
    requestId: "volcengine-smoke-request",
    source: "dev-smoke",
  },
};

export type VolcengineSmokeFailureCategory =
  | "config"
  | "network"
  | "auth"
  | "response_format"
  | "article_schema"
  | "provider"
  | "unknown";

export type VolcengineSmokeSummary = {
  ok: boolean;
  providerName: string;
  model?: string;
  baseUrl?: string;
  eventCount?: number;
  blockCount?: number;
  articleId?: string;
  articleTitle?: string;
  finalizationStatus?: "passed" | "failed";
  enrichmentWarningCount?: number;
  failureCategory?: VolcengineSmokeFailureCategory;
  errorCode?: string;
  errorMessage?: string;
  configIssues?: GenerationModelProviderConfigIssue[];
  finalizationIssues?: ArticleFinalizationIssue[];
};

const CONFIG_ERROR_CODES = new Set<GenerationModelProviderErrorCode>([
  "config_disabled",
  "config_missing_api_key",
  "config_missing_model",
]);

const AUTH_ERROR_CODES = new Set<GenerationModelProviderErrorCode>(["auth_failed"]);

const NETWORK_ERROR_CODES = new Set<GenerationModelProviderErrorCode>([
  "network_error",
  "timeout",
]);

const RESPONSE_FORMAT_ERROR_CODES = new Set<GenerationModelProviderErrorCode>([
  "malformed_json",
  "invalid_response",
  "invalid_article_candidate",
  "forbidden_output_field",
]);

export function classifyVolcengineSmokeFailure(options: {
  errorCode?: string;
  finalizationIssues?: ArticleFinalizationIssue[];
}): VolcengineSmokeFailureCategory {
  const code = options.errorCode as GenerationModelProviderErrorCode | undefined;

  if (code && CONFIG_ERROR_CODES.has(code)) {
    return "config";
  }
  if (code && AUTH_ERROR_CODES.has(code)) {
    return "auth";
  }
  if (code && NETWORK_ERROR_CODES.has(code)) {
    return "network";
  }
  if (code && RESPONSE_FORMAT_ERROR_CODES.has(code)) {
    return "response_format";
  }
  if (
    options.finalizationIssues?.some((issue) => issue.source === "article_schema")
  ) {
    return "article_schema";
  }
  if (code === "rate_limited" || code === "provider_error") {
    return "provider";
  }
  return "unknown";
}

export function sanitizeSmokeMessage(message: string): string {
  return sanitizeProviderErrorMessage(message) ?? message;
}

export function formatVolcengineSmokeSummary(summary: VolcengineSmokeSummary): string {
  const lines = [
    `Volcengine provider smoke: ${summary.ok ? "PASSED" : "FAILED"}`,
    `provider: ${summary.providerName}`,
  ];

  if (summary.model) {
    lines.push(`model: ${summary.model}`);
  }
  if (summary.baseUrl) {
    lines.push(`baseUrl: ${summary.baseUrl}`);
  }
  if (summary.eventCount != null) {
    lines.push(`eventCount: ${summary.eventCount}`);
  }
  if (summary.blockCount != null) {
    lines.push(`blockCount: ${summary.blockCount}`);
  }
  if (summary.articleId) {
    lines.push(`articleId: ${summary.articleId}`);
  }
  if (summary.articleTitle) {
    lines.push(`articleTitle: ${summary.articleTitle}`);
  }
  if (summary.finalizationStatus) {
    lines.push(`finalizationStatus: ${summary.finalizationStatus}`);
  }
  if (summary.enrichmentWarningCount != null) {
    lines.push(`enrichmentWarningCount: ${summary.enrichmentWarningCount}`);
  }

  if (!summary.ok) {
    if (summary.failureCategory) {
      lines.push(`failureCategory: ${summary.failureCategory}`);
    }
    if (summary.errorCode) {
      lines.push(`errorCode: ${summary.errorCode}`);
    }
    if (summary.errorMessage) {
      lines.push(`errorMessage: ${sanitizeSmokeMessage(summary.errorMessage)}`);
    }
    if (summary.configIssues?.length) {
      lines.push(
        `configIssues: ${summary.configIssues
          .map((issue) => `${issue.code}: ${issue.message}`)
          .join("; ")}`,
      );
    }
    if (summary.finalizationIssues?.length) {
      lines.push(
        `finalizationIssues: ${summary.finalizationIssues
          .slice(0, 3)
          .map((issue) => `${issue.code}: ${issue.message}`)
          .join("; ")}`,
      );
    }
  }

  return lines.join("\n");
}

function findTerminalErrorEvent(
  events: GenerationEvent[],
): GenerationErrorEvent | undefined {
  return events.find((event): event is GenerationErrorEvent => event.type === "error");
}

export async function runVolcengineProviderSmoke(
  env: Record<string, string | undefined> = process.env,
): Promise<VolcengineSmokeSummary> {
  const configResult = loadVolcengineProviderConfig(env);

  if (!configResult.ok) {
    const primary = configResult.issues[0];
    return {
      ok: false,
      providerName: "volcengine",
      failureCategory: classifyVolcengineSmokeFailure({
        errorCode: primary?.code,
      }),
      errorCode: primary?.code,
      errorMessage: primary?.message,
      configIssues: configResult.issues,
    };
  }

  const config = configResult.config;
  const normalizedInput = parseAndNormalizeInputRequest(VOLCENGINE_SMOKE_INPUT);
  const provider = createVolcengineModelProvider({
    config,
    transport: createVolcengineTransport(),
  });

  const events = await collectGenerationStream(
    provider.generate(normalizedInput, {
      requestId: VOLCENGINE_SMOKE_INPUT.metadata.requestId,
      startedAt: new Date().toISOString(),
    }),
  );

  const errorEvent = findTerminalErrorEvent(events);
  if (errorEvent) {
    return {
      ok: false,
      providerName: provider.name,
      model: config.model,
      baseUrl: config.baseUrl,
      eventCount: events.length,
      failureCategory: classifyVolcengineSmokeFailure({
        errorCode: errorEvent.code,
      }),
      errorCode: errorEvent.code,
      errorMessage: errorEvent.message,
    };
  }

  const hasDoneArticle = events.some((event) => event.type === "done.article");
  if (!hasDoneArticle) {
    return {
      ok: false,
      providerName: provider.name,
      model: config.model,
      baseUrl: config.baseUrl,
      eventCount: events.length,
      failureCategory: "response_format",
      errorCode: "missing_done_article",
      errorMessage: "Provider stream completed without done.article",
    };
  }

  const finalization = finalizeGenerationEvents(events);
  if (!finalization.ok) {
    const primary = finalization.issues[0];
    const doneEvent = events.find((event) => event.type === "done.article");
    const enrichmentWarningCount =
      doneEvent?.type === "done.article" &&
      typeof doneEvent.meta?.enrichmentWarningCount === "number"
        ? doneEvent.meta.enrichmentWarningCount
        : undefined;
    return {
      ok: false,
      providerName: provider.name,
      model: config.model,
      baseUrl: config.baseUrl,
      eventCount: events.length,
      finalizationStatus: "failed",
      enrichmentWarningCount,
      failureCategory: classifyVolcengineSmokeFailure({
        errorCode: primary?.code,
        finalizationIssues: finalization.issues,
      }),
      errorCode: primary?.code,
      errorMessage: primary?.message,
      finalizationIssues: finalization.issues,
    };
  }

  const article = finalization.data.article;
  const doneEvent = events.find((event) => event.type === "done.article");
  const enrichmentWarningCount =
    doneEvent?.type === "done.article" &&
    typeof doneEvent.meta?.enrichmentWarningCount === "number"
      ? doneEvent.meta.enrichmentWarningCount
      : 0;
  if (article.blocks.length < 1) {
    return {
      ok: false,
      providerName: provider.name,
      model: config.model,
      baseUrl: config.baseUrl,
      eventCount: events.length,
      blockCount: article.blocks.length,
      articleId: article.id,
      articleTitle: article.metadata.title,
      failureCategory: "article_schema",
      errorCode: "empty_blocks",
      errorMessage: "Finalized article must contain at least one block",
    };
  }

  return {
    ok: true,
    providerName: provider.name,
    model: config.model,
    baseUrl: config.baseUrl,
    eventCount: events.length,
    blockCount: article.blocks.length,
    articleId: article.id,
    articleTitle: article.metadata.title,
    finalizationStatus: "passed",
    enrichmentWarningCount,
  };
}
