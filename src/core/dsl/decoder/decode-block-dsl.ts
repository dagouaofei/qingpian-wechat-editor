import type { Block } from "@/core/blocks";
import type { Article } from "@/core/article";

import type { DslRenderTarget, VariantDslV1 } from "../runtime/dsl-types";
import type { DecodeVariantDslResult } from "./dsl-decoder-types";
import { decodeVariantDsl } from "./decode-variant-dsl";

export function decodeBlockWithVariantDsl(input: {
  article: Article;
  block: Block;
  variantDsl: VariantDslV1;
  target: DslRenderTarget;
}): DecodeVariantDslResult {
  return decodeVariantDsl({
    article: input.article,
    block: input.block,
    variantDsl: input.variantDsl,
    target: input.target,
  });
}
