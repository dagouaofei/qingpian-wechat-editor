import type { InputRequest } from "@/core/generation";

export const HOME_ARTICLE_SCENES = [
  { value: "", label: "不指定" },
  { value: "product_intro", label: "产品介绍" },
  { value: "knowledge", label: "知识科普" },
  { value: "event_promo", label: "活动宣传" },
  { value: "opinion", label: "观点文章" },
  { value: "seeding", label: "带货种草" },
] as const;

export const HOME_TARGET_AUDIENCES = [
  { value: "", label: "不指定" },
  { value: "general", label: "普通用户" },
  { value: "parents", label: "宝妈 / 家长" },
  { value: "office_workers", label: "职场人" },
  { value: "enterprise", label: "企业客户" },
  { value: "wechat_fans", label: "公众号粉丝" },
] as const;

export const HOME_BASIC_STYLES = [
  { value: "", label: "默认（简洁商务）" },
  { value: "business", label: "简洁商务" },
  { value: "warm", label: "温暖叙事" },
  { value: "magazine", label: "高级杂志" },
  { value: "keynote", label: "科技发布会" },
  { value: "xiaohongshu", label: "小红书感" },
  { value: "dedao", label: "得到风" },
] as const;

export type HomeFormState = {
  topic: string;
  scene: string;
  audience: string;
  basicStyle: string;
};

export type HomeFormValidation = {
  ok: boolean;
  message?: string;
};

export function validateHomeForm(form: HomeFormState): HomeFormValidation {
  if (!form.topic.trim()) {
    return { ok: false, message: "请填写文章主题后再开始生成。" };
  }
  return { ok: true };
}

function sceneLabel(value: string): string | undefined {
  return HOME_ARTICLE_SCENES.find((item) => item.value === value)?.label;
}

function audienceLabel(value: string): string | undefined {
  return HOME_TARGET_AUDIENCES.find((item) => item.value === value)?.label;
}

function buildContextNotes(form: HomeFormState): string | undefined {
  const parts: string[] = [];
  const scene = sceneLabel(form.scene);
  const audience = audienceLabel(form.audience);
  if (scene && form.scene) {
    parts.push(`文章用途/场景：${scene}`);
  }
  if (audience && form.audience) {
    parts.push(`目标读者：${audience}`);
  }
  return parts.length > 0 ? parts.join("；") : undefined;
}

export function buildHomeInputRequest(form: HomeFormState): InputRequest {
  const topic = form.topic.trim();
  const contextNotes = buildContextNotes(form);
  const presetHint =
    form.basicStyle.trim() || undefined;

  return {
    mode: "topic_only",
    topic,
    styleIntent: {
      presetHint: presetHint === "" ? undefined : presetHint,
      tone: audienceLabel(form.audience) || undefined,
      notes: contextNotes,
      densityHint: "medium",
    },
    metadata: {
      locale: "zh-CN",
      source: "home-ui",
    },
  };
}

export function homeFormToSearchParams(form: HomeFormState): URLSearchParams {
  const params = new URLSearchParams();
  params.set("topic", form.topic.trim());
  if (form.scene) {
    params.set("scene", form.scene);
  }
  if (form.audience) {
    params.set("audience", form.audience);
  }
  if (form.basicStyle) {
    params.set("style", form.basicStyle);
  }
  return params;
}

export function homeFormFromSearchParams(params: URLSearchParams): HomeFormState {
  return {
    topic: params.get("topic") ?? "",
    scene: params.get("scene") ?? "",
    audience: params.get("audience") ?? "",
    basicStyle: params.get("style") ?? "",
  };
}
