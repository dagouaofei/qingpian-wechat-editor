export {
  ARTICLE_DSL_VERSION,
  VARIANT_DSL_VERSION,
  type ArticleDslBlockRef,
  type ArticleDslV1,
  type DslElementNode,
  type DslNode,
  type DslRenderTarget,
  type DslSlotBinding,
  type DslSlotNode,
  type DslStyle,
  type DslTextNode,
  type DslValidationIssue,
  type DslValidationResult,
  type VariantDslV1,
  type VariantRenderContract,
} from "./dsl-types";

export {
  getDefaultRenderContract,
  isArticleDslV1,
  isDslNode,
  isVariantDslV1,
  validateArticleDsl,
  validateVariantDsl,
} from "./dsl-validation";

export type {
  DecoderTrace,
  DslDecoderPathTrace,
  DslDefinitionSourceTrace,
  DslRuntimeSourceTrace,
  DslRuntimeTrace,
  EncoderTrace,
  TraceIssue,
  TraceLossReportItem,
  VariantDslRuntimeReadiness,
} from "./dsl-trace-types";
