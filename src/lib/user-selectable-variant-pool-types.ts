import type { VariantDefinition } from "@/core/styles/types";

export type UserSelectableVariantPoolSource =
  | "database"
  | "code_fallback"
  | "empty"
  | "db_unavailable";

export type RuntimeVariantPoolIssueCode =
  | "missing_current_version"
  | "invalid_definition"
  | "ineligible_distribution"
  | "deprecated_lifecycle";

export type RuntimeVariantPoolIssue = {
  runtimeVariantId: string;
  code: RuntimeVariantPoolIssueCode;
  message: string;
};

export type UserSelectableVariantPoolCacheMeta = {
  hit: boolean;
  ttlSeconds: number;
  generatedAt: string;
};

/** Serializable snapshot passed from server page to client preview. */
export type UserSelectableVariantPoolSnapshot = {
  source: UserSelectableVariantPoolSource;
  cache: UserSelectableVariantPoolCacheMeta;
  variants: VariantDefinition[];
  poolVariantIds: string[];
  /** Raw DB definitionJson keyed by runtimeVariantId — DSL runtime source when source=database. */
  definitionJsonByVariantId?: Record<string, unknown>;
  issues: RuntimeVariantPoolIssue[];
  notice?: string;
};
