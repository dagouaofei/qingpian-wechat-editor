export type {
  ArticleCandidate,
  BlockCompleteEvent,
  BlockDeltaEvent,
  BlockStartEvent,
  StreamStartEvent,
  DoneArticleEvent,
  GenerationErrorEvent,
  GenerationEvent,
  GenerationEventBase,
  GenerationEventMeta,
  GenerationEventType,
  GenerationSequenceIssue,
  GenerationSequenceValidationResult,
  GenerationStream,
  GenerationStreamContext,
  GenerationStreamProvider,
  HeartbeatEvent,
} from "./events";

export { GENERATION_EVENT_TYPES } from "./events";

export {
  blockCompleteEventSchema,
  blockDeltaEventSchema,
  blockStartEventSchema,
  doneArticleEventSchema,
  generationErrorEventSchema,
  generationEventSchema,
  generationEventTypeSchema,
  GenerationEventError,
  heartbeatEventSchema,
  isGenerationEvent,
  parseGenerationEvent,
  safeGenerationDeltaSchema,
} from "./event-schemas";

export {
  decodeGenerationEventFromSse,
  decodeGenerationEventsFromSse,
  encodeGenerationEventToSse,
  encodeGenerationEventsToSse,
} from "./sse";

export {
  collectGenerationStream,
  createGenerationStream,
  isNormalizedInput,
  validateGenerationEventSequence,
} from "./stream";

export {
  ArticleFinalizationError,
  assertFinalizedArticle,
  finalizeDoneArticleEvent,
  finalizeGenerationEvents,
} from "./article-finalize";

export type {
  ArticleFinalizationIssue,
  ArticleFinalizationResult,
  FinalizedGeneratedArticle,
} from "./article-finalize";

export {
  DoneArticleError,
  extractDoneArticleEvent,
  parseDoneArticleCandidate,
  validateDoneArticleEventSequence,
} from "./done-article";

export type {
  DoneArticleParseResult,
  DoneArticleValidationIssue,
} from "./done-article";

export {
  createDeterministicGenerationEvents,
  deterministicGenerationStreamProvider,
} from "./test-provider";

export type {
  CreateVolcengineModelProviderOptions,
  GenerateArticleCandidateInput,
  GenerationModelProvider,
  GenerationModelProviderResult,
  GenerationModelTransport,
  GenerationModelTransportFailure,
  GenerationModelTransportRequest,
  GenerationModelTransportResponse,
  GenerationModelTransportSuccess,
  ResolveGenerationModelProviderOptions,
} from "./model-provider";

export {
  DEFAULT_VOLCENGINE_BASE_URL,
  DEFAULT_VOLCENGINE_TIMEOUT_MS,
  assertVolcengineProviderConfig,
  loadVolcengineProviderConfig,
  VOLCENGINE_ENV_KEYS,
} from "./model-provider-config";

export type {
  GenerationModelProviderConfig,
  GenerationModelProviderConfigIssue,
  GenerationModelProviderConfigResult,
  GenerationModelProviderName,
} from "./model-provider-config";

export {
  GENERATION_MODEL_PROVIDER_ERROR_CODES,
  GenerationModelProviderError,
  mapHttpStatusToProviderError,
  mapTransportFailure,
  sanitizeProviderErrorMessage,
} from "./model-provider-errors";

export type { GenerationModelProviderErrorCode } from "./model-provider-errors";

export {
  buildVolcenginePromptMessages,
  buildVolcengineSystemPrompt,
  buildVolcengineUserPrompt,
  extractBalancedJsonObject,
  findForbiddenArticleFields,
  normalizeModelArticleRoot,
  parseModelJsonContent,
} from "./model-prompt";

export type {
  ModelArticleEnrichmentFailure,
  ModelArticleEnrichmentInput,
  ModelArticleEnrichmentIssue,
  ModelArticleEnrichmentResult,
  ModelArticleEnrichmentSuccess,
  StripForbiddenFieldsResult,
} from "./model-article-candidate";

export {
  createArticleCandidateFromModelOutput,
  enrichModelArticleCandidate,
  isValidUuid,
  repairModelArticleCandidate,
  resolveEnrichmentUuid,
  stripForbiddenFieldsFromCandidate,
} from "./model-article-enrichment";

export { createVolcengineTransport } from "./volcengine-transport";
export { createVolcengineStreamTransport } from "./volcengine-stream-transport";
export type { VolcengineStreamTransport } from "./volcengine-stream-transport";

export {
  buildArticleCandidateFromStreamBlocks,
  createJsonlBlockStreamParser,
} from "./jsonl-block-stream-parser";
export type { JsonlBlockStreamParser } from "./jsonl-block-stream-parser";

export {
  buildVolcengineStreamingPromptMessages,
  buildVolcengineStreamingSystemPrompt,
} from "./model-prompt-streaming";

export { createVolcengineStreamingModelProvider } from "./volcengine-streaming-provider";

export {
  buildGenerationEventsFromArticleCandidate,
  createProviderErrorEvent,
  createVolcengineModelProvider,
  enrichArticleCandidate,
  generateVolcengineProviderEvents,
  resolveGenerationModelProvider,
  resolveStreamContext,
} from "./volcengine-provider";

export type { BuildGenerationEventsOptions } from "./volcengine-provider";

export {
  classifyVolcengineSmokeFailure,
  formatVolcengineSmokeSummary,
  runVolcengineProviderSmoke,
  sanitizeSmokeMessage,
  VOLCENGINE_SMOKE_INPUT,
} from "./volcengine-provider-smoke";

export type {
  VolcengineSmokeFailureCategory,
  VolcengineSmokeSummary,
} from "./volcengine-provider-smoke";

export {
  loadDevEnvFiles,
  parseSmokeEnvLine,
  printVolcengineSmokeSetupHelp,
} from "./smoke-env";

export type {
  InputDensityHint,
  InputRequest,
  InputRequestMetadata,
  InputRequestMode,
  InputSource,
  InputSourceType,
  InputStyleIntent,
  InputValidationFailure,
  InputValidationIssue,
  InputValidationResult,
  InputValidationSeverity,
  InputValidationSuccess,
  NormalizedInput,
  NormalizedInputSource,
  NormalizedPrimaryIntent,
} from "./input";

export {
  INPUT_DENSITY_HINTS,
  INPUT_LIMITS,
  INPUT_REQUEST_MODES,
  INPUT_VALIDATION_SEVERITIES,
  MATERIAL_SOURCE_TYPES,
} from "./input";

export {
  inputRequestMetadataSchema,
  inputRequestModeSchema,
  inputRequestSchema,
  inputSourceSchema,
  inputSourceTypeSchema,
  inputStyleIntentSchema,
  safeStyleIntentStringSchema,
} from "./schemas";

export {
  InputRequestError,
  isInputRequest,
  parseInputRequest,
  validateInputRequest,
} from "./input.parse";

export {
  normalizeInputRequest,
  parseAndNormalizeInputRequest,
} from "./input.normalize";

export type { ApplyValidatedStyleAssignmentPatchResult } from "./style-selection-apply";
export type {
  StyleSelectionGenerationInput,
  StyleSelectionGenerationResult,
  StyleSelectionProviderMode,
  StyleSelectionVariantSummary,
} from "./style-selection";

export {
  SAFE_STYLE_PRESET_ID,
  SAFE_STYLE_THEME_ID,
  applyValidatedStyleAssignmentPatch,
  applyValidatedStyleSelectionRequest,
  buildSafeFallbackStyleAssignmentPatch,
  buildStyleSelectionRequestFromArticle,
  generateAndApplyStyleSelection,
  generateDeterministicStyleSelection,
  generateStyleAssignmentPatch,
  generateStyleSelectionRequest,
  validateStyleIntentForGeneration,
  verifyArticleStyleResolvable,
} from "./style-selection";
