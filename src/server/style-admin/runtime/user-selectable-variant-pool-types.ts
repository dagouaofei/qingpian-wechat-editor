import type { BlockType } from "@prisma/client";

import type { VariantDefinition } from "@/core/styles/types";
import type {
  RuntimeVariantPoolIssue,
  UserSelectableVariantPoolCacheMeta,
  UserSelectableVariantPoolSnapshot,
  UserSelectableVariantPoolSource,
} from "@/lib/user-selectable-variant-pool-types";

export type {
  RuntimeVariantPoolIssue,
  RuntimeVariantPoolIssueCode,
  UserSelectableVariantPoolCacheMeta,
  UserSelectableVariantPoolSnapshot,
  UserSelectableVariantPoolSource,
} from "@/lib/user-selectable-variant-pool-types";

export type UserSelectableVariantPoolResult = {
  source: UserSelectableVariantPoolSource;
  cache: UserSelectableVariantPoolCacheMeta;
  variants: VariantDefinition[];
  issues: RuntimeVariantPoolIssue[];
  notice?: string;
};

export type UserSelectableVariantPoolOptions = {
  blockType?: BlockType;
  forceRefresh?: boolean;
};

export function toUserSelectableVariantPoolSnapshot(
  result: UserSelectableVariantPoolResult,
): UserSelectableVariantPoolSnapshot {
  return {
    source: result.source,
    cache: result.cache,
    variants: result.variants,
    poolVariantIds: result.variants.map((variant) => variant.id),
    issues: result.issues,
    notice: result.notice,
  };
}
