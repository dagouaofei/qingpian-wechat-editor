import type {
  GenerateFlowError,
  GenerateFlowErrorCategory,
  GenerateMainFlowSuccess,
} from "@/server/generation/generate-flow-types";

export type GenerateApiSuccessResponse = {
  ok: true;
  data: GenerateMainFlowSuccess;
};

export type GenerateApiErrorResponse = {
  ok: false;
  error: GenerateFlowError;
};

export type GenerateApiResponse = GenerateApiSuccessResponse | GenerateApiErrorResponse;

export const GENERATE_ERROR_LABELS: Record<GenerateFlowErrorCategory, string> = {
  input_validation: "输入校验失败",
  provider_config: "Provider 配置错误",
  provider_network: "Provider 网络错误",
  model_response: "模型响应格式错误",
  article_schema: "Article Schema 校验失败",
  style_selection: "样式选择失败",
  renderer: "Preview Renderer 错误",
  clipboard: "Copy Renderer / Clipboard payload 错误",
  unknown: "未知错误",
};
