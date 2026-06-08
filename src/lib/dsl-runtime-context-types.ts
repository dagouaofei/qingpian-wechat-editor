export type DslRuntimeSource = "database" | "code_fallback" | "db_unavailable";

export type DslRuntimeCacheMeta = {
  hit: boolean;
  ttlSeconds: number;
  generatedAt: string;
};

export type DslRuntimeVariantSourceMeta = {
  blockType: import("@prisma/client").BlockType;
  styleFamily: string;
  label: string;
  primarySourceType?: string | null;
  sourceHtml?: string | null;
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
  /** Source metadata for fidelity DSL refresh (html_paste headings, etc.). */
  variantSourceMetaByVariantId?: Record<string, DslRuntimeVariantSourceMeta>;
  variantIds: string[];
  issues: Array<{
    runtimeVariantId: string;
    code: string;
    message: string;
  }>;
  notice?: string;
};
