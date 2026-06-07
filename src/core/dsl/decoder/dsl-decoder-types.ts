import type { Block } from "@/core/blocks";
import type { Article } from "@/core/article";
import type { RendererOutputPlaceholder } from "@/core/renderer/types";

import type { DecoderTrace } from "../runtime/dsl-trace-types";
import type { DslRenderTarget, VariantDslV1 } from "../runtime/dsl-types";
import type { FidelitySubstitutionTrace } from "./fidelity-tree-substitution";

export type DecodeVariantDslInput = {
  variantDsl: VariantDslV1;
  block: Block;
  article: Article;
  target: DslRenderTarget;
};

export type DecodeVariantDslResult =
  | {
      ok: true;
      output: RendererOutputPlaceholder;
      html?: string;
      issues: string[];
      trace?: DecoderTrace;
      substitutionTrace?: FidelitySubstitutionTrace;
    }
  | {
      ok: false;
      code: string;
      message: string;
      issues: string[];
      trace?: DecoderTrace;
    };
