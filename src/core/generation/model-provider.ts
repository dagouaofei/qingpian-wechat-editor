import type { NormalizedInput } from "./input";
import type { GenerationEvent, GenerationStreamProvider } from "./events";
import type { GenerationModelProviderConfig, GenerationModelProviderName } from "./model-provider-config";

export type GenerateArticleCandidateInput = {
  input: NormalizedInput;
  requestId: string;
  startedAt: string;
};

export type GenerationModelProviderResult = {
  events: GenerationEvent[];
  enrichmentWarnings?: import("./model-article-candidate").ModelArticleEnrichmentIssue[];
};

export type GenerationModelTransportRequest = {
  baseUrl: string;
  apiKey: string;
  model: string;
  timeoutMs: number;
  messages: Array<{ role: "system" | "user"; content: string }>;
};

export type GenerationModelTransportSuccess = {
  ok: true;
  content: string;
};

export type GenerationModelTransportFailure = {
  ok: false;
  error: import("./model-provider-errors").GenerationModelProviderError;
};

export type GenerationModelTransportResponse =
  | GenerationModelTransportSuccess
  | GenerationModelTransportFailure;

export type GenerationModelTransport = {
  complete: (
    request: GenerationModelTransportRequest,
  ) => Promise<GenerationModelTransportResponse>;
};

export type GenerationModelProvider = GenerationStreamProvider & {
  name: GenerationModelProviderName;
  config: GenerationModelProviderConfig;
};

export type CreateVolcengineModelProviderOptions = {
  config?: GenerationModelProviderConfig;
  transport?: GenerationModelTransport;
};

export type ResolveGenerationModelProviderOptions = {
  volcengine?: CreateVolcengineModelProviderOptions;
};
