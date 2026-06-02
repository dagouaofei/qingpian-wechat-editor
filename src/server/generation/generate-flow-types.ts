import type { Article } from "@/core/article";
import type { InputRequest } from "@/core/generation";
import type { RendererIssue, RendererOutputPlaceholder } from "@/core/renderer";
import type { StyleValidationIssue } from "@/core/styles";

export type GenerateFlowErrorCategory =
  | "input_validation"
  | "provider_config"
  | "provider_network"
  | "model_response"
  | "article_schema"
  | "style_selection"
  | "renderer"
  | "clipboard"
  | "unknown";

export type GenerateProviderMode = "volcengine" | "deterministic";

export type GenerateMainFlowPhase =
  | "normalizing"
  | "generating"
  | "finalizing"
  | "styling"
  | "rendering"
  | "ready";

export type GenerateMainFlowInput = {
  inputRequest: InputRequest;
  requestId?: string;
  /**
   * When true, refuse deterministic/mock provider fallback (Sprint 6 user-facing flow).
   * Tests and dev harness may omit this to allow deterministic provider.
   */
  requireRealProvider?: boolean;
};

export type SerializedPreviewBlock = {
  blockId: string;
  blockType: string;
  variantId?: string;
  ok: boolean;
  output?: RendererOutputPlaceholder;
  issues: RendererIssue[];
  warnings: RendererIssue[];
};

export type GenerateClipboardPayload = {
  textHtml: string;
  textPlain: string;
  issueCount: number;
  warningCount: number;
};

export type GenerateMainFlowSuccess = {
  providerMode: GenerateProviderMode;
  providerLabel: string;
  phasesCompleted: GenerateMainFlowPhase[];
  article: Article;
  articleTitle: string;
  previewBlocks: SerializedPreviewBlock[];
  clipboard: GenerateClipboardPayload;
  styleWarnings: StyleValidationIssue[];
  rendererIssues: RendererIssue[];
  rendererWarnings: RendererIssue[];
  usedStyleFallback: boolean;
};

export type GenerateFlowError = {
  category: GenerateFlowErrorCategory;
  code: string;
  message: string;
  phasesCompleted: GenerateMainFlowPhase[];
};

export type GenerateMainFlowResult =
  | { ok: true; data: GenerateMainFlowSuccess }
  | { ok: false; error: GenerateFlowError };
