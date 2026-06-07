import type { BlockType } from "@/core/blocks";
import type { DslRuntimeTrace } from "@/core/dsl/runtime/dsl-trace-types";
import {
  dslRuntimeTraceFixtureArticle,
  pickTraceFixtureBlock,
} from "@/lib/dsl-runtime/trace-fixture-article";
import { buildRuntimeTraceForVariant } from "@/lib/dsl-runtime/runtime-trace";
import type { DslRuntimeSource } from "@/lib/dsl-runtime-context-types";

export function buildVariantRuntimeTraceSummary(input: {
  runtimeVariantId: string;
  blockType: BlockType;
  definitionJson: unknown;
  poolSource: DslRuntimeSource;
}): DslRuntimeTrace {
  const block = pickTraceFixtureBlock(input.blockType);

  return buildRuntimeTraceForVariant({
    runtimeVariantId: input.runtimeVariantId,
    blockType: input.blockType,
    definitionJson: input.definitionJson,
    poolSource: input.poolSource,
    article: dslRuntimeTraceFixtureArticle,
    block,
    decodeTargets: ["preview", "copy_wechat"],
  });
}
