/**
 * Generation input contract — InputRequest / NormalizedInput
 * @see docs/architecture/generation-pipeline.md §1–2
 */

export const INPUT_REQUEST_MODES = [
  "topic_only",
  "topic_with_materials",
  "draft_rewrite",
] as const;

export type InputRequestMode = (typeof INPUT_REQUEST_MODES)[number];

/** Material entry source type (not Article.input.type). */
export const MATERIAL_SOURCE_TYPES = [
  "plain_text",
  "outline",
  "reference",
  "note",
] as const;

export type InputSourceType = (typeof MATERIAL_SOURCE_TYPES)[number];

export type InputSource = {
  type: InputSourceType;
  text: string;
  label?: string;
  order?: number;
};

export const INPUT_DENSITY_HINTS = ["light", "medium", "strong"] as const;

export type InputDensityHint = (typeof INPUT_DENSITY_HINTS)[number];

export type InputStyleIntent = {
  tone?: string;
  presetHint?: string;
  densityHint?: InputDensityHint;
  notes?: string;
};

export type InputRequestMetadata = {
  locale?: string;
  createdAt?: string;
  source?: string;
  requestId?: string;
};

export type InputRequest = {
  id?: string;
  mode: InputRequestMode;
  topic?: string;
  materials?: InputSource[];
  draft?: string;
  styleIntent?: InputStyleIntent;
  metadata?: InputRequestMetadata;
};

export type NormalizedInputSource = {
  type: InputSourceType;
  text: string;
  label?: string;
  order: number;
};

export type NormalizedPrimaryIntent =
  | "topic"
  | "material"
  | "draft"
  | "mixed";

export type NormalizedInput = {
  id?: string;
  mode: InputRequestMode;
  topic?: string;
  materials: NormalizedInputSource[];
  draft?: string;
  styleIntent?: InputStyleIntent;
  metadata?: InputRequestMetadata;
  inputSummary: string;
  sourceCount: number;
  hasDraft: boolean;
  hasMaterials: boolean;
  primaryIntent: NormalizedPrimaryIntent;
  normalizedAt: string;
};

export const INPUT_VALIDATION_SEVERITIES = ["error", "warning"] as const;

export type InputValidationSeverity =
  (typeof INPUT_VALIDATION_SEVERITIES)[number];

export type InputValidationIssue = {
  path: Array<string | number>;
  message: string;
  code: string;
  severity: InputValidationSeverity;
};

export type InputValidationSuccess = {
  ok: true;
  data: InputRequest;
  issues: InputValidationIssue[];
};

export type InputValidationFailure = {
  ok: false;
  data?: undefined;
  issues: InputValidationIssue[];
};

export type InputValidationResult =
  | InputValidationSuccess
  | InputValidationFailure;

export const INPUT_LIMITS = {
  MAX_TOPIC_LENGTH: 500,
  MAX_DRAFT_LENGTH: 50_000,
  MAX_MATERIAL_TEXT_LENGTH: 20_000,
  MAX_MATERIALS_COUNT: 20,
  MAX_TOTAL_INPUT_LENGTH: 100_000,
} as const;
