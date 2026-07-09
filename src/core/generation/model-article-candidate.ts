import type { NormalizedInput } from "./input";

export type ModelArticleEnrichmentSeverity = "warning" | "error";

export type ModelArticleEnrichmentIssue = {
  severity: ModelArticleEnrichmentSeverity;
  code: string;
  message: string;
  path: Array<string | number>;
};

export type ModelArticleEnrichmentInput = {
  rawCandidate: unknown;
  normalizedInput: NormalizedInput;
  requestId: string;
  providerName: string;
  modelName?: string;
  timestamp: string;
  generateId?: () => string;
  /** When true, missing user-visible block text is a blocking error (real provider path). */
  strictContent?: boolean;
};

export type ModelArticleEnrichmentSuccess = {
  ok: true;
  candidate: Record<string, unknown>;
  warnings: ModelArticleEnrichmentIssue[];
};

export type ModelArticleEnrichmentFailure = {
  ok: false;
  errors: ModelArticleEnrichmentIssue[];
  warnings: ModelArticleEnrichmentIssue[];
};

export type ModelArticleEnrichmentResult =
  | ModelArticleEnrichmentSuccess
  | ModelArticleEnrichmentFailure;

export type StripForbiddenFieldsResult = {
  candidate: Record<string, unknown>;
  warnings: ModelArticleEnrichmentIssue[];
};
