import type { BlockType } from "@prisma/client";

import type {
  DslRuntimeSnapshot,
  DslRuntimeSource,
  DslRuntimeVariantSourceMeta,
} from "@/lib/dsl-runtime-context-types";
import { stripSourceHtmlFromRuntimeMeta } from "@/lib/dsl-runtime/resolve-runtime-pool-definition";
import type { RuntimeVariantPoolIssue } from "@/lib/user-selectable-variant-pool-types";

export type RuntimeVariantDslPoolResult = {
  source: DslRuntimeSource;
  cache: DslRuntimeSnapshot["cache"];
  definitionJsonByVariantId: Record<string, unknown>;
  variantSourceMetaByVariantId?: Record<string, DslRuntimeVariantSourceMeta>;
  variantIds: string[];
  issues: RuntimeVariantPoolIssue[];
  notice?: string;
};

export type RuntimeVariantDslPoolOptions = {
  blockType?: BlockType;
  forceRefresh?: boolean;
};

export function toDslRuntimeSnapshot(
  result: RuntimeVariantDslPoolResult,
): DslRuntimeSnapshot {
  return {
    source: result.source,
    cache: result.cache,
    definitionJsonByVariantId: result.definitionJsonByVariantId,
    variantSourceMetaByVariantId: stripSourceHtmlFromRuntimeMeta(
      result.variantSourceMetaByVariantId,
    ),
    variantIds: result.variantIds,
    issues: result.issues,
    notice: result.notice,
  };
}
