import type { DslRenderTarget } from "./dsl-types";

export type DslRuntimeSourceTrace =
  | "database_dsl"
  | "code_fallback"
  | "unsupported"
  | "missing_dsl";

export type DslDecoderPathTrace = "tree" | "renderContract" | "none";

export type DslDefinitionSourceTrace =
  | "db.definitionJson"
  | "code_fallback_encoded_registry"
  | "unknown";

export type EncoderInputKindTrace = "html" | "registry" | "manual" | "ai";

export type TraceIssue = {
  code: string;
  message: string;
  severity?: "info" | "warning" | "risk" | "blocking";
  path?: string;
};

export type TraceLossReportItem = {
  code: string;
  message: string;
};

export type EncoderTrace = {
  inputKind: EncoderInputKindTrace;
  extractedSlots: Record<string, string>;
  styleTokens: Record<string, string>;
  layoutIntent?: string;
  decorators?: string[];
  lossReport: TraceLossReportItem[];
  issues: TraceIssue[];
};

export type DecoderTrace = {
  target: DslRenderTarget;
  decoderPath: DslDecoderPathTrace;
  rendered: boolean;
  outputLength: number;
  missingSlots: string[];
  unsupportedNodes: string[];
  unsupportedStyles: string[];
  issues: TraceIssue[];
};

export type SourceExactTrace = {
  runtimeVariantId: string;
  definitionHash: string | null;
  decodedPreviewHash: string | null;
  decodedCopyHash: string | null;
  renderedHtmlHash: string | null;
  selectedRuntimeVariantId: string;
  renderedByVariantId: string;
  fallbackUsed: boolean;
  fallbackReason: string | null;
};

export type DslRuntimeTrace = {
  runtimeVariantId: string;
  blockType: string;
  runtimeSource: DslRuntimeSourceTrace;
  decoderPath: DslDecoderPathTrace;
  dslVersion?: string;
  definitionSource: DslDefinitionSourceTrace;
  dslValid: boolean;
  encoder?: EncoderTrace;
  decoder?: DecoderTrace;
  sourceExact?: SourceExactTrace;
};

export type CompatibilityReadinessStatus = "pass" | "failed" | "skipped" | "not_enforced";

export type VariantDslRuntimeReadiness = {
  ok: boolean;
  previewReady: boolean;
  copyReady: boolean;
  compatibilityReady: boolean;
  compatibilityStatus: CompatibilityReadinessStatus;
  issues: TraceIssue[];
  trace: DslRuntimeTrace;
};
