export type DslRuntimeSource = "database" | "code_fallback" | "db_unavailable";

export type DslRuntimeCacheMeta = {
  hit: boolean;
  ttlSeconds: number;
  generatedAt: string;
};

/**
 * Serializable DSL runtime context for /preview user-side rendering.
 * When source=database, definitionJsonByVariantId is the sole runtime source of truth.
 */
export type DslRuntimeSnapshot = {
  source: DslRuntimeSource;
  cache: DslRuntimeCacheMeta;
  /** All runtime-eligible variants keyed by runtimeVariantId. */
  definitionJsonByVariantId: Record<string, unknown>;
  variantIds: string[];
  issues: Array<{
    runtimeVariantId: string;
    code: string;
    message: string;
  }>;
  notice?: string;
};
