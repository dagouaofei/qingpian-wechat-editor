export const GENERATION_MODEL_PROVIDER_ERROR_CODES = [
  "config_missing_api_key",
  "config_missing_model",
  "config_disabled",
  "auth_failed",
  "rate_limited",
  "timeout",
  "network_error",
  "invalid_response",
  "malformed_json",
  "invalid_article_candidate",
  "forbidden_output_field",
  "provider_error",
] as const;

export type GenerationModelProviderErrorCode =
  (typeof GENERATION_MODEL_PROVIDER_ERROR_CODES)[number];

export class GenerationModelProviderError extends Error {
  readonly code: GenerationModelProviderErrorCode;
  readonly recoverable: boolean;
  readonly statusCode?: number;

  constructor(
    code: GenerationModelProviderErrorCode,
    message: string,
    options?: { recoverable?: boolean; statusCode?: number; cause?: unknown },
  ) {
    super(message, options?.cause ? { cause: options.cause } : undefined);
    this.name = "GenerationModelProviderError";
    this.code = code;
    this.recoverable = options?.recoverable ?? false;
    this.statusCode = options?.statusCode;
  }
}

export function mapHttpStatusToProviderError(
  status: number,
  bodyText?: string,
): GenerationModelProviderError {
  const sanitized = sanitizeProviderErrorMessage(bodyText);

  if (status === 401 || status === 403) {
    return new GenerationModelProviderError(
      "auth_failed",
      sanitized ?? "Volcengine authentication failed",
      { recoverable: false, statusCode: status },
    );
  }

  if (status === 429) {
    return new GenerationModelProviderError(
      "rate_limited",
      sanitized ?? "Volcengine rate limit exceeded",
      { recoverable: true, statusCode: status },
    );
  }

  if (status >= 500) {
    return new GenerationModelProviderError(
      "provider_error",
      sanitized ?? "Volcengine provider returned a server error",
      { recoverable: true, statusCode: status },
    );
  }

  return new GenerationModelProviderError(
    "invalid_response",
    sanitized ?? `Volcengine request failed with status ${status}`,
    { recoverable: false, statusCode: status },
  );
}

export function mapTransportFailure(error: unknown): GenerationModelProviderError {
  if (error instanceof GenerationModelProviderError) {
    return error;
  }

  if (error instanceof Error) {
    if (
      error.name === "AbortError" ||
      /timed out|timeout|aborted/i.test(error.message)
    ) {
      return new GenerationModelProviderError("timeout", "Volcengine request timed out", {
        recoverable: true,
        cause: error,
      });
    }

    if (
      error.message.includes("fetch failed") ||
      error.message.includes("network") ||
      error.message.includes("ECONN")
    ) {
      return new GenerationModelProviderError("network_error", "Volcengine network request failed", {
        recoverable: true,
        cause: error,
      });
    }
  }

  return new GenerationModelProviderError("provider_error", "Volcengine provider request failed", {
    recoverable: false,
    cause: error,
  });
}

export function sanitizeProviderErrorMessage(message?: string): string | undefined {
  if (!message) {
    return undefined;
  }

  return message
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [REDACTED]")
    .replace(/sk-[A-Za-z0-9._-]+/gi, "[REDACTED]")
    .slice(0, 500);
}
