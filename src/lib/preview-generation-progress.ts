export type AnalysisStepStatus = "pending" | "active" | "done";

export type GenerationAnalysisStep = {
  id: string;
  title: string;
  message?: string;
  status: AnalysisStepStatus;
};

export const GENERATION_ANALYSIS_STEPS: Omit<GenerationAnalysisStep, "status">[] = [
  {
    id: "understand",
    title: "理解选题与写作目标",
    message: "解析主题、场景与读者定位",
  },
  {
    id: "generate",
    title: "调用 AI 生成文章结构",
    message: "生成标题、导语、分节与正文 block",
  },
  {
    id: "validate",
    title: "校验 Article Schema",
    message: "确保输出进入统一 Article 模型",
  },
  {
    id: "style",
    title: "应用样式与排版",
    message: "Style Selection + Preview Renderer",
  },
  {
    id: "prepare",
    title: "准备预览与复制",
    message: "生成 Copy Renderer 剪贴板 payload",
  },
];

export function buildAnalysisSteps(activeIndex: number): GenerationAnalysisStep[] {
  return GENERATION_ANALYSIS_STEPS.map((step, index) => {
    if (index < activeIndex) {
      return { ...step, status: "done" };
    }
    if (index === activeIndex) {
      return { ...step, status: "active" };
    }
    return { ...step, status: "pending" };
  });
}

export function analysisProgressPercent(steps: GenerationAnalysisStep[]): number {
  const doneCount = steps.filter((step) => step.status === "done").length;
  if (steps.length === 0) {
    return 0;
  }
  const activeBonus = steps.some((step) => step.status === "active") ? 0.35 : 0;
  return Math.min(100, Math.round(((doneCount + activeBonus) / steps.length) * 100));
}
