import type { ArticleFinalizationIssue } from "@/core/generation";
import type { GenerationModelProviderErrorCode } from "@/core/generation/model-provider-errors";
import type { StyleValidationIssue } from "@/core/styles";

import type { GenerateFlowErrorCategory } from "./generate-flow-types";

const CONFIG_ERROR_CODES = new Set<GenerationModelProviderErrorCode>([
  "config_disabled",
  "config_missing_api_key",
  "config_missing_model",
]);

const NETWORK_ERROR_CODES = new Set<GenerationModelProviderErrorCode>([
  "network_error",
  "timeout",
  "auth_failed",
  "rate_limited",
]);

const MODEL_RESPONSE_ERROR_CODES = new Set<GenerationModelProviderErrorCode>([
  "malformed_json",
  "invalid_response",
  "invalid_article_candidate",
  "forbidden_output_field",
  "provider_error",
]);

export function classifyProviderErrorCode(
  code: string | undefined,
): GenerateFlowErrorCategory {
  const providerCode = code as GenerationModelProviderErrorCode | undefined;
  if (providerCode && CONFIG_ERROR_CODES.has(providerCode)) {
    return "provider_config";
  }
  if (providerCode && NETWORK_ERROR_CODES.has(providerCode)) {
    return "provider_network";
  }
  if (providerCode && MODEL_RESPONSE_ERROR_CODES.has(providerCode)) {
    return "model_response";
  }
  return "unknown";
}

export function classifyFinalizationIssue(
  issue: ArticleFinalizationIssue | undefined,
): GenerateFlowErrorCategory {
  if (issue?.source === "article_schema") {
    return "article_schema";
  }
  if (issue?.source === "event_sequence") {
    return "model_response";
  }
  return "article_schema";
}

export function classifyStyleSelectionIssues(
  issues: StyleValidationIssue[],
): GenerateFlowErrorCategory {
  if (issues.some((issue) => issue.severity === "error")) {
    return "style_selection";
  }
  return "style_selection";
}

export function classifyInputValidationIssues(): GenerateFlowErrorCategory {
  return "input_validation";
}
